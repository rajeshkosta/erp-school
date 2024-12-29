const express = require('express');
const fileUpload = require("express-fileupload");
const router = express.Router();
const bodyParser = require("body-parser");
const ERRORCODE = require('../constants/ERRORCODE');
const { STATUS, logger, CONST, JSONUTIL, redis } = require("edu-micro-common");
const PAGESIZE = require('../constants/CONST');
const feeMasterModel = require('../models/feeMasterModel');
const feeMasterService = require('../services/feeMasterService')
const { FEE } = require('../constants/QUERY');
const async = require('async');

router.use(bodyParser.json({ limit: "5mb" }));
router.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));

//POST Fee Master
router.post("/create", async (req, res) => {
    try {
        const reqUserDetails = req.plainToken;
        const { class_id, fee_master,academic_year_id } = req.body; 
    
        for (const fee of fee_master) {
            fee.class_id = class_id;
            fee.academic_year_id = academic_year_id;
        
            console.log("fee",fee);
            const fee_obj = new feeMasterModel.FeeMaster(fee);

            const { error } = feeMasterModel.validateFeeMaster(fee_obj);
            if (error) {
                return res.status(STATUS.BAD_REQUEST).json({ error: error.details[0].message });
            }
            const checkFeeMasterTypeExists = await feeMasterService.checkIfExist(reqUserDetails.academic_year_id, fee_obj.fees_type_id, class_id);
            if (checkFeeMasterTypeExists > 0) {
                return res.status(STATUS.BAD_REQUEST).json({
                    errorCode: "FEEMASTERSERVC001",
                    error: ERRORCODE.FEEMASTER.FEEMASTERSERVC001
                });
            }
            fee_obj.school_id = reqUserDetails.school_id;
            fee_obj.created_by = reqUserDetails.user_id;
            fee_obj.updated_by = reqUserDetails.user_id;
            await feeMasterService.addFeeMaster(fee_obj);
        }

        return res.status(STATUS.CREATED).json({ message: 'fee master created successfully' });
    } catch (error) {
        logger.error(`Error adding fee: ${error}`);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send();
    }
});

//getFeeMasterGridByClassId
router.post('/getFeeMasterGridByClassId', async (req, res) => {
    try {
        const reqUserDetails = req.plainToken;
        const school_id = reqUserDetails.school_id;

        const { class_id } = req.body;
        const {academic_year_id } = req.body;

        const feeMasterDetails = await feeMasterService.getAllfeesMaster(class_id,academic_year_id,school_id);

        res.status(STATUS.OK).json({data: feeMasterDetails });
    } catch (error) {
        logger.error(`Error retrieving fees master details: ${error}`);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong!' });
    }
});

//updateFeeMaster
router.post('/update', async (req, res) => {
    try {
        const reqUserDetails = req.plainToken;
        const userId = reqUserDetails.user_id;
        const feeMasterDetails = new feeMasterModel.UpdateFeeMaster(req.body);
        const { error } = feeMasterModel.validateUpdateMaster(feeMasterDetails);

        if (error) {
            if (error.details)
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
            else return res.status(STATUS.BAD_REQUEST).send(error.message);
        }
        
        feeMasterDetails.updated_by = userId;
        feeMasterDetails.school_id = reqUserDetails.school_id;

        const checkIfExistbyID = await feeMasterService.checkIfExistbyID( feeMasterDetails.class_id, feeMasterDetails.fees_master_id);

        if (checkIfExistbyID < 0) {
            return res.status(STATUS.BAD_REQUEST).json({
                errorCode: "FEEMASTERSERVC002",
                error: ERRORCODE.FEEMASTER.FEEMASTERSERVC002
            });
        }

        await feeMasterService.updateFeeMasterDetails(feeMasterDetails);

        return res.status(STATUS.OK).json({ message: 'Fee master updated successfully' });
    } catch (error) {
        logger.error(`Error updating Fee master: ${error}`);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong!' });
    }
});

//getClassListByFeeConfig
router.post('/getClassListByFeeConfig', async (req, res) => {
    try {
        const reqUserDetails = req.plainToken;
        const school_id = reqUserDetails.school_id;
        const {academic_year_id } = req.body;

        const feeMasterDetails = await feeMasterService.getClassListByFeeConfig(academic_year_id);

        res.status(STATUS.OK).json({data: feeMasterDetails });
    } catch (error) {
        logger.error(`Error retrieving fees master details: ${error}`);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong!' });
    }
});



//GET Specific getFeeMasterDatabyFeeMasterId 
router.get("/getFeeMaster/:MasterId", async (req, res) => {
    try {
        const fees_master_id = parseInt(req.params.MasterId);
        const feeMasterDetails = await feeMasterService.getFeeMasterDatabyFeeMasterId(fees_master_id);
        res.status(STATUS.OK).json(feeMasterDetails);
        return;

    } catch (error) {
        logger.error("catch error", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"TRUSTSERVC000", "error":"${ERRORCODE.TRUST.TRUSTSERVC000}"}`);
    }
});





module.exports = router;