const express = require('express');
const fileUpload = require("express-fileupload");
const router = express.Router();
const bodyParser = require("body-parser");
const ERRORCODE = require('../constants/ERRORCODE');
const { STATUS, logger, CONST, JSONUTIL, redis } = require("edu-micro-common");
const PAGESIZE = require('../constants/CONST');
const feeDiscountModels = require('../models/feeDiscountModels');
const feeDiscountService = require('../services/feeDiscountService')
const { TRUST } = require('../constants/QUERY');
const async = require('async');

router.use(bodyParser.json({ limit: "5mb" }));
router.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));

//POST FeeDiscount
router.post("/create", async (req, res) => {

    try {
      
        const reqUserDetails = req.plainToken;
        const feeDiscountDetails = new feeDiscountModels.FeeDiscount(req.body);

        console.log("feeDiscountDetails",feeDiscountDetails);
        const { error } = feeDiscountModels.validateFeeDiscount(feeDiscountDetails)

        if (error) {
            if (error.details)
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
            else return res.status(STATUS.BAD_REQUEST).send(error.message);

        }
        
        async.forEachOfSeries(feeDiscountDetails.fees_discounts, async function (feediscount, a) {

       console.log("feediscount",feediscount);

            const checkFeediscountExists = await feeDiscountService.checkfeeDiscountExist(reqUserDetails.school_id, feediscount);

            if (checkFeediscountExists > 0) {
                return res.status(STATUS.BAD_REQUEST).send(

                    {
                        errorCode: "FEEDISCOUNTSERVCOO2",
                        error: ERRORCODE.FEEDISCOUNT.FEEDISCOUNTSERVCOO2
                    }

                );
            }

          const fee_discount_obj = {
            school_id:reqUserDetails.school_id, fees_discount_name: feediscount.fees_discount_name,discount:feediscount.discount, status:1,created_by:reqUserDetails.user_id,updated_by:reqUserDetails.user_id
          }
          console.log("fee_discount_obj",fee_discount_obj)
            await feeDiscountService.createFeeDiscount(fee_discount_obj);

        }, 
        
        async function () {

            return res.status(STATUS.CREATED).json({ message: 'fee discount created successfully' });
        
        });

    } catch (error) {
        logger.error(`Error adding fee discount: ${error}`);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send();
    }
});

//updateFeeDiscount
router.post('/update', async (req, res) => {
    try {
        const reqUserDetails = req.plainToken;
        const userId = reqUserDetails.user_id;
        const feeDiscountDetails = new feeDiscountModels.UpdateFeeDiscount(req.body);
        const { error } = feeDiscountModels.validateUpdateFeeDiscount(feeDiscountDetails);

        if (error) {
            if (error.details)
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
            else return res.status(STATUS.BAD_REQUEST).send(error.message);
        }
        
        feeDiscountDetails.updated_by = userId;

        const checkIfExistbyID = await feeDiscountService.checkIfExistbyID(feeDiscountDetails.fees_discount_id);
        
        if (checkIfExistbyID == 0) {
            return res.status(STATUS.BAD_REQUEST).json({
                errorCode: "FEEDISCOUNTSERVCOO2",
                error: ERRORCODE.FEEDISCOUNT.FEEDISCOUNTSERVCOO3
            });
        }

        await feeDiscountService.updateFeeDiscountDetails(feeDiscountDetails);

        return res.status(STATUS.OK).json({ message: 'Fee discount updated successfully' });
    } catch (error) {
        logger.error(`Error updating Fee discount: ${error}`);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong!' });
    }
});

router.get('/getAllfeediscount', async (req, res) => {
    try {
        const reqUserDetails = req.plainToken;
        const school_id = reqUserDetails.school_id;

        const feeDiscountDetails = await feeDiscountService.getAllfeediscount(school_id);

        res.status(STATUS.OK).json({data: feeDiscountDetails });
    } catch (error) {
        logger.error(`Error retrieving fee discount details: ${error}`);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong!' });
    }
});

router.get('/getFeediscountById/:fees_discount_id', async (req, res) => {
    try {

        const { fees_discount_id } = req.params;
        const feediscount = await feeDiscountService.getFeediscountById(fees_discount_id);

        res.status(STATUS.OK).json({ data: feediscount });
    } catch (error) {
        logger.error(`Error getting feediscount by id: ${error}`);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong!' });
    }
});

module.exports= router;