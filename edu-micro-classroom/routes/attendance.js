const express = require('express');
const router = express.Router();
const { STATUS, logger, httpResponseUtil } = require("edu-micro-common");
const { v4: uuidv4 } = require('uuid');
const attendanceModel = require('../models/attendanceModel');
const attendanceService = require("../services/attendanceService");
const { ATTENDANCE_ERR } = require("../constants/ERRORCODE");
const { appendReqUserData } = require('edu-micro-common/constants/CONST');

router.post('/addAttendance', async (req, res) => {
  try {

    const reqUserDetails = req.plainToken;
    let attendanceDetails = new attendanceModel.Attendance(req.body);
    attendanceDetails = appendReqUserData(attendanceDetails, reqUserDetails)

    const { error } = attendanceModel.validateAttendance(attendanceDetails);
    console.log('error--', error)
    if (error) {
      if (error.details)
        return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
      else return res.status(STATUS.BAD_REQUEST).send(error.message);
    }

    console.log('attendanceDetails--', attendanceDetails);
    const data = await attendanceService.addAttendance(attendanceDetails);
    return httpResponseUtil.sendSuccessResponse(res, STATUS.OK, null, 'Attendance marks successfully');

  } catch (error) {
    logger.error(error);
    res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"ATTEND0000", "error":"${ATTENDANCE_ERR.ATTEND0000}"}`);
  }
});


router.post('/getAttendance', async (req, res)=> {
  try{
    const academic_year_id = req.body.academic_year_id;
    const student_admission_id = req.body.student_admission_id;

    if(!academic_year_id){
      return res.status(STATUS.BAD_REQUEST).send({ errorCode: "ATTEND0003", error: ATTENDANCE_ERR.ATTEND0003 });
    }

    if(!student_admission_id){
      return res.status(STATUS.BAD_REQUEST).send({ errorCode: "ATTEND0004", error: ATTENDANCE_ERR.ATTEND0004 });
    }

    const reqParams = {
      academic_year_id,
      student_admission_id
    };

    const firstQueryResult  = await attendanceService.getAttendance(academic_year_id, student_admission_id);

    const secondQueryResult = await attendanceService.getAttendanceCount1(academic_year_id, student_admission_id);
   
    const thirdQueryResult = await attendanceService. getAttendanceCount2(academic_year_id, student_admission_id);
    res.status(STATUS.OK).json({ firstQueryResult, secondQueryResult,thirdQueryResult });


  } catch (error) {
    logger.error(error);
    res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"ATTEND0000", "error":"${ATTENDANCE_ERR.ATTEND0000}"}`);
  }

  }
)


router.post('/getClassroomAttendance', async (req, res) => {
  try {

    const classroom_id = req.body.classroom_id;
    const attendance_date = req.body.attendance_date;
    const pageSize = req.body.page_size ? req.body.page_size : 0;
    let currentPage = req.body.current_page ? req.body.current_page : 0;
    currentPage = (currentPage == 1 || currentPage == 0) ? 0 : ((currentPage - 1) * pageSize);

    if (!classroom_id) {
      return res.status(STATUS.BAD_REQUEST).send({ errorCode: "ATTEND0001", error: ATTENDANCE_ERR.ATTEND0001 });
    }

    if (!attendance_date) {
      return res.status(STATUS.BAD_REQUEST).send({ errorCode: "ATTEND0002", error: ATTENDANCE_ERR.ATTEND0002 });
    }

    const reqParams = {
      pageSize,
      currentPage,
      attendance_date,
      classroom_id
    };

    const attendanceData = await attendanceService.getClassroomAttendance(reqParams);
    return httpResponseUtil.sendSuccessResponse(res, STATUS.OK, attendanceData, 'Attendance fetched successfully');

  } catch (error) {
    logger.error(error);
    res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"ATTEND0000", "error":"${ATTENDANCE_ERR.ATTEND0000}"}`);
  }
})




module.exports = router;


