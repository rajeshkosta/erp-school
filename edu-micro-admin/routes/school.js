const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const { STATUS, logger, DB_STATUS, s3Util, commonService } = require("edu-micro-common");
const ERRORCODE = require("../constants/ERRORCODE.js");
router.use(bodyParser.json({ limit: "5mb" }));
router.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));
router.use(fileUpload());

let schoolModel = require('../models/school');
let schoolService = require('../services/schoolService');
//SCHOOL-SERVICE IS UP 
router.get('/', async (req, res) => {
  res.send("School service is up and running!!");
});


router.post("/addSchool", async (req, res) => {
  try {

    console.log('req.body.school_data',req.body.school_data)
    const schoolData = JSON.parse(`${req.body.school_data}`);
    console.log("typeof studentData",typeof schoolData);
    const schoolReq = new schoolModel.School(schoolData);
    const { error } = schoolModel.validateSchool(schoolReq);
    let validatePatternError = await schoolService.validatePattern();
    if (validatePatternError)
      return res.status(STATUS.BAD_REQUEST).send(validatePatternError);

    if (error) {
      if (
        error.details != null &&
        error.details != "" &&
        error.details != "undefined"
      )
        return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
      else return res.status(STATUS.BAD_REQUEST).send(error.message);

    } else {

      let reqUser = req.plainToken;
      let userId = reqUser.user_id;
      schoolReq.created_by = userId;
      schoolReq.updated_by = userId;
      const trust_id = reqUser.trust_id;
      schoolReq.trust_id = trust_id;
      const role_id = reqUser.role;

      console.log('role_id',role_id)
      if(role_id != 2){
        return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"SCHOOL0005", "error":"${ERRORCODE.SCHOOL.SCHOOL0005}"}`);
      }

      let checkIfExist = await schoolService.checkIfExist(schoolReq);
      if (checkIfExist > 0)
        return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"SCHOOL0002", "error":"${ERRORCODE.SCHOOL.SCHOOL0002}"}`);

      if (req.files && req.files.logo_url) {
        let allowedFileTypes = ["IMAGE"];
        schoolReq.logo_url = await commonService.getFileUploadPath(req.files.logo_url, "school-logo", allowedFileTypes);
      }
      const schoolResult = await schoolService.addSchool(schoolReq);
      return res.status(STATUS.OK).send({ message: "School added successfully.", data: schoolResult });
    }

  } catch (err) {
    logger.error(err);
    return res.status(STATUS.BAD_REQUEST).send(err);
  }
});




router.post("/update", async (req, res) => {
  try {
    let reqAdminDetails = req.plainToken;
    const role_id = reqAdminDetails.role;

    if(role_id != 2){
      return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"SCHOOL0005", "error":"${ERRORCODE.SCHOOL.SCHOOL0005}"}`);
    }
    let userId = reqAdminDetails.user_id;
    const schoolData = JSON.parse(`${req.body.school_data}`);
    console.log("typeof studentData", typeof schoolData);
    const schoolDetails = new schoolModel.UpdateSchool(schoolData);
    const { error } = schoolModel.validateUpdateSchool(schoolDetails);
    if (error) {
      if (error.details)
        return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
      else return res.status(STATUS.BAD_REQUEST).send(error.message);
    }
    const trust_id = reqAdminDetails.trust_id;
    schoolDetails.trust_id = trust_id;
    schoolDetails.updated_by = userId;

    let checkSchoolAvailable = await schoolService.checkSchoolAvailable(schoolDetails);
    if (checkSchoolAvailable == 0)
      return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"SCHOOL0003", "error":"${ERRORCODE.SCHOOL.SCHOOL0003}"}`);

    if (req.files && req.files.logo_url) {
      let allowedFileTypes = ["IMAGE"];
      schoolDetails.logo_url = await commonService.getFileUploadPath(req.files.logo_url, "school-logo", allowedFileTypes);
    }
    await schoolService.updateSchool(schoolDetails);
    res.status(STATUS.OK).json({
      school_id: schoolDetails.school_id,
      message: 'School Updated Successfully'
    });
    return;

  } catch (error) {
    logger.error(error);
    res.status(STATUS.BAD_REQUEST).send(error);
  }

});

router.get("/getSchool/:school_id", async (req, res) => {
  try {
    const school_id = parseInt(req.params.school_id);
    const schoolDetails = await schoolService.getSpecificSchoolDetails(school_id);
    if (schoolDetails.logo_url) {
      let logo_url = schoolDetails.logo_url;
      schoolDetails.logo_url_cdn = `${process.env.CDN_CONTEXT_PATH}/api/v1/admin/cdn/fileDisplay?file_name=${logo_url}`;
    }
    res.status(STATUS.OK).json(schoolDetails);
    return;

  } catch (error) {
    logger.error("catch error", error);
    res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"SCHOOL0001", "error":"${ERRORCODE.SCHOOL.SCHOOL0001}"}`);
  }
});

router.post("/getAllSchool", async (req, res) => {
  try {
    let reqUserDetails = req.plainToken;
    const trust_id=reqUserDetails.trust_id;
    const pageSize = req.body.page_size ? req.body.page_size : 0;
    let currentPage = req.body.current_page ? req.body.current_page : 0;
    currentPage = (currentPage == 1 || currentPage == 0) ? 0 : ((currentPage - 1) * pageSize);
    const status = req.body.status ? req.body.status : null;
    const reqParams = {
      pageSize,
      currentPage,
      status,
      trust_id
    };

    const schoolList = await schoolService.getAllSchool(reqParams);
    res.status(STATUS.OK).json(schoolList);
    return;

  } catch (error) {
    logger.error("catch error", error);
    res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"SCHOOL0001", "error":"${ERRORCODE.SCHOOL.SCHOOL0001}"}`);
  }
});

router.get("/schoolList", async (req, res) => {
  try {
    let tokenDetails = req.plainToken;
    var trust_id = tokenDetails.trust_id;
    if (!trust_id) {
      res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"SCHOOL0004", "error":"${ERRORCODE.SCHOOL.SCHOOL0004}"}`);
    }
    const schoolList = await schoolService.getSchoolDetailsBasedOnTrust(trust_id);
    res.status(STATUS.OK).json(schoolList);
  } catch (error) {
    logger.error("catch error", error);
    res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"SCHOOL0001", "error":"${ERRORCODE.SCHOOL.SCHOOL0001}"}`);
  }
});

router.post("/uploadLogo", async (req, res) => {
  try {
    // const reqUserDetails = req.plainToken;
    let allowedFileTypes = ["IMAGE"];
    // if (!reqUserDetails.school_id) {
    //   return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"SCHOOL0003", "error":"${ERRORCODE.SCHOOL.SCHOOL0003}"}`);
    // }
    const path = await commonService.getFileUploadPath(req.files, "school-logo", allowedFileTypes);
    // await schoolService.updateSchoolLogo(path, reqUserDetails);
    return res.status(STATUS.OK).json({ message: "School logo uploaded successfully", path });
  } catch (error) {
    logger.error("catch error", error);
    res.status(STATUS.BAD_REQUEST).send(error);
  }
});

module.exports = router;

