const express = require("express");
const router = express.Router();
const { STATUS, CONST, logger } = require("edu-micro-common");
const moment = require('moment');

const academicYearModel = require('../models/academicYear');
const academicYearService = require('../services/academicYearService');
const { ACADEMIC_YEAR } = require('../constants/ERRORCODE');

router.post("/add", async (req, res) => {
  try {
    const reqUserDetails = req.plainToken;
    var academicYear = new academicYearModel.AcademicYear(req.body);
    const { error } = academicYearModel.validateAcademicYear(academicYear);

    if (error) {
      if (error.details != null && error.details != "" && error.details != "undefined")
        return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
      else return res.status(STATUS.BAD_REQUEST).send(error.message);

    } else {
      academicYear.school_id = reqUserDetails.school_id;

      if (!academicYear.school_id) {
        return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ACYR000001", "error":"${ACADEMIC_YEAR.ACYR000001}"}`);
      }

      let startdate = moment(academicYear.start_date, 'YYYY-MM-DD');
      let endDate = moment(academicYear.end_date, 'YYYY-MM-DD');
      let durationInMonths = endDate.diff(startdate, 'months');

      if (startdate.diff(endDate) >= 0) {
        return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ACYR000005", "error":"${ACADEMIC_YEAR.ACYR000005}"}`);
      }

      if (durationInMonths < 1) {
        return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ACYR000009", "error":"${ACADEMIC_YEAR.ACYR000009}"}`);
      }

      if (academicYear.academic_year_id) {
        let overlapsCheckExceptId = await academicYearService.academicYearOverlapsCheckExceptId(academicYear);

        if (overlapsCheckExceptId == 0) {
          academicYear = CONST.appendReqUserData(academicYear, reqUserDetails, false);
          await academicYearService.updateAcademicYear(academicYear);
          return res.status(STATUS.OK).send({ message: "Academic year updated successfully." });
        } else {
          return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ACYR000004", "error":"${ACADEMIC_YEAR.ACYR000004}"}`);
        }

      } else {
        
        let overlapsCheck = await academicYearService.academicYearOverlapsCheck(academicYear);
        if (overlapsCheck == 0) {
          academicYear = CONST.appendReqUserData(academicYear, reqUserDetails);
          await academicYearService.addAcademicYear(academicYear);
          return res.status(STATUS.OK).send({ message: "Academic year added successfully." });
        } else {
          return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ACYR000004", "error":"${ACADEMIC_YEAR.ACYR000004}"}`);
        }
      }
    }

  } catch (err) {
    logger.error(err);
    return res.status(STATUS.INTERNAL_SERVER_ERROR).send();
  }
});

router.get("/list", async (req, res) => {
  try {
    let token = req.plainToken;

    if (!token.school_id) {
      return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ACYR000001", "error":"${ACADEMIC_YEAR.ACYR000001}"}`);
    }

    const getAcademicYearData = await academicYearService.getAllAcademicYears(token.school_id);
    return res.status(STATUS.OK).send(getAcademicYearData);
  } catch (err) {
    logger.error(err);
    res.status(STATUS.INTERNAL_SERVER_ERROR).send();
  }
});

router.get("/activeList", async (req, res) => {
  try {
    let token = req.plainToken;

    if (!token.school_id) {
      return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ACYR000001", "error":"${ACADEMIC_YEAR.ACYR000001}"}`);
    }

    const getAcademicYearData = await academicYearService.getActiveAcademicYears(token.school_id);
    return res.status(STATUS.OK).send(getAcademicYearData);
  } catch (err) {
    logger.error(err);
    res.status(STATUS.INTERNAL_SERVER_ERROR).send();
  }
});

router.get("/getById/:academic_year_id", async (req, res) => {
  try {
    let academicYearId = req.params.academic_year_id;

    const getAcademicYearData = await academicYearService.getAcademicYear(academicYearId);
    return res.status(STATUS.OK).send(getAcademicYearData);
  } catch (err) {
    logger.error(err);
    res.status(STATUS.INTERNAL_SERVER_ERROR).send();
  }
});

router.post("/updateStatus", async (req, res) => {
  let academicYearId = req.body.academic_year_id;
  let isActive = (req.body.is_active == '') ? 0 : req.body.is_active;
  try {
    if (isActive == 0) {

      let activeClasses = await academicYearService.countActiveClasses(academicYearId);
      if (activeClasses > 0) {
        return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ADMROL0002", "error":"${ACADEMIC_YEAR.ACYR000008}", "count":"${activeClasses}"}`);
      } else {
        await updateStatus(isActive, academicYearId, res);
      }
    }else{
      await updateStatus(isActive, academicYearId, res)
    }
  } catch (err) {
    logger.error(err);
    return res.status(STATUS.INTERNAL_SERVER_ERROR).send();
  }
});

async function updateStatus(isActive, academicYearId, res) {

  const getAcademicYearData = await academicYearService.getAcademicYear(academicYearId);
  let overlapsCheck = await academicYearService.academicYearOverlapsCheckExceptId(getAcademicYearData[0]);
  if (overlapsCheck == 0) {

    await academicYearService.updateStatus(isActive, getAcademicYearData[0]);
    return res.status(STATUS.OK).send({ message: "Acedemic Year Status has been updated successfully." });
  } else {
    return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ACYR000004", "error":"${ACADEMIC_YEAR.ACYR000004}"}`);
  } 
}

module.exports = router;