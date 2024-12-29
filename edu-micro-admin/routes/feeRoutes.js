const express = require('express');
const fileUpload = require("express-fileupload");
const router = express.Router();
const bodyParser = require("body-parser");
const ERRORCODE = require('../constants/ERRORCODE');
const { STATUS, logger, CONST, JSONUTIL, redis } = require("edu-micro-common");
const PAGESIZE = require('../constants/CONST');
const feeModel = require('../models/feeModel');
const feeService = require('../services/feeService')
const { FEE } = require('../constants/QUERY');
const async = require('async');

router.use(bodyParser.json({ limit: "5mb" }));
router.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));

//POST Fee
router.post("/create", async (req, res) => {
    try {
        
        const reqUserDetails = req.plainToken;
        const feeDetails = new feeModel.Fee(req.body);
        const feestype = feeDetails.fees_type;
        for (const fee of feestype) {
            console.log("fee", fee);
            const checkFeeTypeExists = await feeService.checkIfExist(reqUserDetails.school_id, fee);

            if (checkFeeTypeExists > 0) {
                return res.status(STATUS.BAD_REQUEST).send({
                    errorCode: "FEESERVC001",
                    error: ERRORCODE.FEE.FEESERVC001
                });
            }
        }

        
        if (!feestype || feestype.length == 0) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"FEESERVC003", "error":"${ERRORCODE.FEE.FEESERVC003}"}`);
        }

        console.log("feeDetails", feeDetails);
        const { error } = feeModel.validateFee(feeDetails)

        if (error) {
            if (error.details)
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
            else return res.status(STATUS.BAD_REQUEST).send(error.message);
        }

        if (!reqUserDetails.school_id) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"FEESERVC000", "error":"${ERRORCODE.FEE.FEESERVC000}"}`);
        }

        for (const fee of feestype) {

             const fee_obj = {
                fees_type: fee, 
                status: 1,
                created_by: reqUserDetails.user_id,
                updated_by: reqUserDetails.user_id,
                school_id: reqUserDetails.school_id
            };

            console.log("fee", fee_obj);

            await feeService.addFee(fee_obj);
        }

        return res.status(STATUS.CREATED).json({ message: 'fee created successfully' });
    } catch (error) {
        logger.error(`Error adding fee: ${error}`);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send();
    }
});


//UPDATE Fee
router.post("/update", async (req, res) => {
    try {
        const reqUserDetails = req.plainToken;
        const feeDetails = new feeModel.UpdateFee(req.body);
        feeDetails.updated_by = reqUserDetails.user_id;
        const { error } = feeModel.validateUpdateFee(feeDetails);

        if (error) {
            if (error.details)
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
            else return res.status(STATUS.BAD_REQUEST).send(error.message);
        }

        const checkFeeTypeIdExists = await feeService.checkIfFeeTypeExist(reqUserDetails, feeDetails);

        console.log('checkFeeTypeIdExists--',checkFeeTypeIdExists)

        if (checkFeeTypeIdExists > 0) {
            return res.status(STATUS.BAD_REQUEST).send(

                {
                    errorCode: "FEESERVC001",
                    error:  ERRORCODE.FEE.FEESERVC001
                }

            );
        }

        await feeService.updateFee(feeDetails);
        res.status(STATUS.OK).json({
            fees_type_id: feeDetails.fees_type_id,
            message: 'Fee Updated Successfully'
        });
        return;

    } catch (error) {
        logger.error( error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"FEESERVC000", "error":"${ERRORCODE.FEE.FEESERVC000}"}`);
    }

});

//getall fees
router.get('/getAllfees', async (req, res) => {
    try {
        const reqUserDetails = req.plainToken;
        const school_id = reqUserDetails.school_id;

        const feeDetails = await feeService.getAllfees(school_id);

        res.status(STATUS.OK).json({data: feeDetails });
    } catch (error) {
        logger.error(`Error retrieving fees details: ${error}`);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong!' });
    }
});

router.get('/getFeeTypeById/:fee_type_id', async (req, res) => {
    try {

        const { fee_type_id } = req.params;
        const fee = await feeService.getFeeTypeById(fee_type_id);

        res.status(STATUS.OK).json({ data: fee });
    } catch (error) {
        logger.error(`Error getting FeeccType by id: ${error}`);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong!' });
    }
});

module.exports = router;