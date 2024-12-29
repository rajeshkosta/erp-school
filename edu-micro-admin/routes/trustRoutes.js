const express = require('express');
const fileUpload = require("express-fileupload");
const router = express.Router();
const bodyParser = require("body-parser");
const ERRORCODE = require('../constants/ERRORCODE');
const { STATUS, logger, CONST, JSONUTIL, redis, commonService } = require("edu-micro-common");
const PAGESIZE = require('../constants/CONST');
const trustModel = require('../models/trustModel');
const trustService = require('../services/trustService')
const { TRUST } = require('../constants/QUERY');

router.use(bodyParser.json({ limit: "5mb" }));
router.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));
router.use(fileUpload());

//POST Trust
router.post("/create", async (req, res) => {

    try {

        const reqAdminDetails = req.plainToken;
        const role_id = reqAdminDetails.role;
        if(role_id != 1){
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"TRUSTSERVC006", "error":"${ERRORCODE.TRUST.TRUSTSERVC006}"}`);
        }
        const trustData = JSON.parse(`${req.body.trust_data}`);
        console.log("typeof trustData", typeof trustData);
        const trustDetails = new trustModel.Trust(trustData);

        trustDetails.created_by = reqAdminDetails.user_id;
        trustDetails.updated_by = reqAdminDetails.user_id;

        console.log(trustDetails);
        const { error } = trustModel.validateTrust(trustDetails)

        if (error) {
            if (error.details)
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
            else return res.status(STATUS.BAD_REQUEST).send(error.message);
        }

        const isTrustNameExist = await trustService.checkTrustNameExist(trustDetails.trust_name);

        if (isTrustNameExist > 0) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"TRUSTSERVC001", "error":"${ERRORCODE.TRUST.TRUSTSERVC001}"}`);
        }
        if (req.files && req.files.logo_url) {
            let allowedFileTypes = ["IMAGE"];
            trustDetails.logo_url = await commonService.getFileUploadPath(req.files.logo_url, "trust-logo", allowedFileTypes);
        }
        const createTrustResult = await trustService.createTrust(trustDetails);
        res.status(STATUS.CREATED).json(createTrustResult);
        return;

    } catch (error) {
        logger.error("catch error", error);
        res.status(STATUS.BAD_REQUEST).send(error);
    }
});

//UPDATE Trust
router.post("/update", async (req, res) => {
    try {
        let reqAdminDetails = req.plainToken;
        const role_id = reqAdminDetails.role;
        if(role_id != 1){
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"TRUSTSERVC006", "error":"${ERRORCODE.TRUST.TRUSTSERVC006}"}`);
        }
        const trustData = JSON.parse(`${req.body.trust_data}`);
        console.log("typeof trustData", typeof trustData);
        const trustDetails = new trustModel.UpdateTrust(trustData);
        trustDetails.updated_by = reqAdminDetails.user_id;
        const { error } = trustModel.validateUpdateTrust(trustDetails);

        if (error) {
            if (error.details)
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
            else return res.status(STATUS.BAD_REQUEST).send(error.message);
        }

        if (req.files && req.files.logo_url) {
            let allowedFileTypes = ["IMAGE"];
            trustDetails.logo_url = await commonService.getFileUploadPath(req.files.logo_url, "trust-logo", allowedFileTypes);
        }
        await trustService.updateTrust(trustDetails);
        res.status(STATUS.OK).json({
            trust_id: trustDetails.trust_id,
            message: 'Trust Updated Successfully'
        });
        return;

    } catch (error) {
        logger.error( error);
        res.status(STATUS.BAD_REQUEST).send(error);
    }

});

//GET Specific Trust
router.get("/getTrust/:trustID", async (req, res) => {
    try {
        const trust_id = parseInt(req.params.trustID);
        const trustDetails = await trustService.getSpecificTrustDetails(trust_id);
        if (trustDetails.logo_url) {
            let logo_url = trustDetails.logo_url;
            trustDetails.logo_url_cdn = `${process.env.CDN_CONTEXT_PATH}/api/v1/admin/cdn/fileDisplay?file_name=${logo_url}`;
          }
        res.status(STATUS.OK).json(trustDetails);
        return;

    } catch (error) {
        logger.error("catch error", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"TRUSTSERVC000", "error":"${ERRORCODE.TRUST.TRUSTSERVC000}"}`);
    }
});

//GET All Trusts
router.post("/getAllTrusts", async (req, res) => {
    try {

        const pageSize = req.body.page_size ? req.body.page_size : 0;
        let currentPage = req.body.current_page ? req.body.current_page : 0;
        currentPage = (currentPage == 1 || currentPage == 0) ? 0 : ((currentPage - 1) * pageSize);
        const status = req.body.status ?  req.body.status : null;

        const reqParams = {
            pageSize,
            currentPage,
            status
        };

        const trustList = await trustService.getAllTrusts(reqParams);
        console.log("trustList",trustList);
        res.status(STATUS.OK).send(trustList);
        return;

    } catch (error) {
        logger.error("catch error", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"TRUSTSERVC000", "error":"${ERRORCODE.TRUST.TRUSTSERVC000}"}`);
    }
});


router.post("/trustList", async (req, res) => {
    try {

        const trustList = await trustService.trustList();
        res.status(STATUS.OK).json(trustList);
    } catch (error) {
        logger.error("catch error", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"TRUSTSERVC000", "error":"${ERRORCODE.TRUST.TRUSTSERVC000}"}`);
    }
});

router.post("/uploadLogo", async (req, res) => {
    try {
    //   const reqUserDetails = req.plainToken;
      let allowedFileTypes = ["IMAGE"];
    //   if (!reqUserDetails.trust_id) {
    //     return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"TRUSTSERVC005", "error":"${ERRORCODE.TRUST.TRUSTSERVC005}"}`);
    //   }
      const path = await commonService.getFileUploadPath(req.files, "trust-logo", allowedFileTypes);
    //   await trustService.updateTrustLogo(path, reqUserDetails);
        return res.status(STATUS.OK).json({ message: "School logo uploaded successfully", path });
    } catch (error) {
      logger.error("catch error", error);
      res.status(STATUS.BAD_REQUEST).send(error);
    }
  });

module.exports= router;