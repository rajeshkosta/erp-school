const express = require('express');
const fileUpload = require("express-fileupload");
const router = express.Router();
const bodyParser = require("body-parser");
const ERRORCODE = require('../constants/ERRORCODE');
const { STATUS, logger, CONST, JSONUTIL, redis, commonService } = require("edu-micro-common");
const PAGESIZE = require('../constants/CONST');
const templateModel = require('../models/templateModel');
const templateService = require('../services/templateService')
const { TEMPLATE } = require('../constants/QUERY');

router.use(bodyParser.json({ limit: "5mb" }));
router.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));
router.use(fileUpload());

//UPDATE Template
router.post("/createtemp", async (req, res) => {
    try {
        let reqAdminDetails = req.plainToken;
        const tempConfigData = JSON.parse(`${req.body.temp_config_data}`);
        let config_id = tempConfigData.config_id;
        const isTamplateDetailsExist = await templateService.checkTamplateDetailsExistByConfigId(config_id);
        if (isTamplateDetailsExist <=0){
            const templateDetail = new templateModel.Template(tempConfigData);
            templateDetail.updated_by = reqAdminDetails.user_id;
            templateDetail.created_by = reqAdminDetails.user_id;
            templateDetail.school_id = reqAdminDetails.school_id;
            const { error } = templateModel.validateTemplate(templateDetail);
            if (error) {
                if (error.details)
                    return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
                else return res.status(STATUS.BAD_REQUEST).send(error.message);
            }
            if (req.files && req.files.school_logo) {
                let allowedFileTypes = ["IMAGE"];
                templateDetail.school_logo = await commonService.getFileUploadPath(req.files.school_logo, "school_logo", allowedFileTypes);
            }
            if (req.files && req.files.signature) {
                let allowedFileTypes = ["IMAGE"];
                templateDetail.signature = await commonService.getFileUploadPath(req.files.signature, "signature", allowedFileTypes);
            }
            const createTemplateResult = await templateService.createTemplate(templateDetail);
            res.status(STATUS.CREATED).json(createTemplateResult);
            return;
            
       }
    
        const templateDetails = new templateModel.UpdateTemplate(tempConfigData);
        templateDetails.updated_by = reqAdminDetails.user_id;
        templateDetails.school_id = reqAdminDetails.school_id;

        const { error } = templateModel.validateUpdateTemplate(templateDetails);

        if (error) {
            if (error.details)
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
            else return res.status(STATUS.BAD_REQUEST).send(error.message);
        }

        if (req.files && req.files.school_logo) {
            let allowedFileTypes = ["IMAGE"];
            templateDetails.school_logo = await commonService.getFileUploadPath(req.files.school_logo, "school_logo", allowedFileTypes);
        }

        if (req.files && req.files.signature) {
            let allowedFileTypes = ["IMAGE"];
            templateDetails.signature = await commonService.getFileUploadPath(req.files.signature, "signature", allowedFileTypes);
        }

        await templateService.updateTamplate(templateDetails);
        res.status(STATUS.OK).json({
            config_id: templateDetails.config_id,
            message: 'Tamplate Updated Successfully'
        });
        return;

    } catch (error) {
        logger.error( error);
        res.status(STATUS.BAD_REQUEST).send(error);
    }

});

router.get("/templateList", async (req, res) => {
    try {

        const templateList = await templateService.templateList();
        res.status(STATUS.OK).json(templateList);
    } catch (error) {
        logger.error("catch error", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"TEMPLATESERV000", "error":"${ERRORCODE.TEMPLATE.TEMPLATESERV000}"}`);
    }
});

router.get("/gettemplateDetails/:configId", async (req, res) => {
    try {
        const config_id = parseInt(req.params.configId);
        const templateDetails = await templateService.gettemplateDetailsByconfigId(config_id);
        res.status(STATUS.OK).json(templateDetails);
        return;

    } catch (error) {
        logger.error("catch error", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"TEMPLATESERV000", "error":"${ERRORCODE.TEMPLATE.TEMPLATESERV000}"}`);
    }
});

module.exports= router;
