const express = require('express');
const fileUpload = require("express-fileupload");
const router = express.Router();
const bodyParser = require("body-parser");
const ERRORCODE = require('../constants/ERRORCODE');
const { STATUS, logger, CONST, JSONUTIL, redis,DB_STATUS } = require("edu-micro-common");
const PAGESIZE = require('../constants/CONST');
const transactionModels = require('../models/transactionModels');
const transactionService = require('../services/transactionService')
const { TRUST } = require('../constants/QUERY');

router.use(bodyParser.json({ limit: "5mb" }));
router.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));

//POST Transaction
router.post("/create", async (req, res) => {

    try {

        const reqUserDetails = req.plainToken;
        const transactionDetails = new transactionModels.Transaction(req.body);

        transactionDetails.created_by = reqUserDetails.user_id;
        transactionDetails.updated_by = reqUserDetails.user_id;
        transactionDetails.balance_amount = transactionDetails.total_amount - transactionDetails.paying_amount;

        console.log(transactionDetails);
        const { error } = transactionModels.validateTransaction(transactionDetails)

        if (error) {
            if (error.details)
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
            else return res.status(STATUS.BAD_REQUEST).send(error.message);
        }

        const istransactionDetailsExist = await transactionService.checkistransactionDetailsExist(transactionDetails.transaction_id);

        if (istransactionDetailsExist > 0) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"TRANSACTION001", "error":"${ERRORCODE.TRANSACTION.TRANSACTION001}"}`);
        }

        const createTransactionResult = await transactionService.createTransaction(transactionDetails);
        res.status(STATUS.CREATED).json(createTransactionResult);
        return;

    } catch (error) {
        logger.error("catch error", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"TRANSACTION000", "error":"${ERRORCODE.TRANSACTION.TRANSACTION000}"}`);
    }
});

//GET Specific gettransactionDetailsBytransactionId 
router.get("/gettransactionDetails/:transactionId", async (req, res) => {
    try {
        const transaction_id = parseInt(req.params.transactionId);
        const transactionDetails = await transactionService.gettransactionDetailsBytransactionId(transaction_id);
        res.status(STATUS.OK).json(transactionDetails);
        return;

    } catch (error) {
        logger.error("catch error", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"TRANSACTION000", "error":"${ERRORCODE.TRANSACTION.TRANSACTION000}"}`);
    }
});

       


router.post("/getalltransaction", async (req, res) => {
    try {
        const {fees_config_id } = req.body;

        if (!fees_config_id) {
            return res.status(STATUS.BAD_REQUEST).json({
                errorCode: "MISSING_FEES_CONFIG_ID",
                error: "Invalid entry."
            });
        }
        
        const transactions = await transactionService.getAllTransactions(
            fees_config_id
        );
        const response = {
            fees_config_id,
            fees_list: transactions.map(transaction => ({
                transaction_id: transaction.transaction_id,
                transaction_mode_id: transaction.transaction_mode_id,
                transaction_mode: transaction.transaction_mode,
                invoice_id: transaction.invoice_id,
                paying_amount: transaction.paying_amount,
                balance_amount: transaction.balance_amount,
                date: transaction.date,

            }))
        };
        res.json(response);
    } catch (error) {
        logger.error("catch error", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"TRANSACTION000", "error":"${ERRORCODE.TRANSACTION.TRANSACTION000}"}`);
    }
});

router.post("/transactionList", async (req, res) => {
    try {
        const { invoice_id, transaction_id } = req.body;

        if (!invoice_id && !transaction_id) {
            return res.status(STATUS.BAD_REQUEST).send({ errorCode: "TRANSACTION001", error: ERRORCODE.TRANSACTION.TRANSACTION001  });
        }

        let isTransactionDetailsExist = 1;
        if (invoice_id) {
            isTransactionDetailsExist = await transactionService.checkTransactionDetailsExistByInvoice(invoice_id);
        } else {
            isTransactionDetailsExist = await transactionService.checkistransactionDetailsExist(transaction_id);
        }

        if (!isTransactionDetailsExist) {
            return res.status(STATUS.BAD_REQUEST).send({ errorCode: "TRANSACTION002", error: ERRORCODE.TRANSACTION.TRANSACTION002 });
        }

        const list = await transactionService.transactionList(invoice_id, transaction_id);
        return res.status(STATUS.OK).send(list);
    } catch (err) {
        console.error(err);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send({ errorCode: "TRANSACTION000", error: ERRORCODE.TRANSACTION.TRANSACTION000 });
    }
});

router.post("/getTransctionListByStudAdmissionId", async (req, res) => {
    try {
        const{student_admission_id,academic_year_id} = req.body
        if (!student_admission_id) {
            return res.status(STATUS.BAD_REQUEST).send({ errorCode: "TRANSACTION004", error: ERRORCODE.TRANSACTION.TRANSACTION004});
        }
        const checkStudentAdmissionId = await transactionService.checkSchoolAdmissionId(student_admission_id);
        if (checkStudentAdmissionId == 0) {
            return res.send(null);
        } else {
            const transactionList = await transactionService.getTransactionById(student_admission_id,academic_year_id);
            res.status(STATUS.OK).json({student_admission_id,academic_year_id,transactionList})
        }
    } catch (error) {
        logger.error(error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send({ errorCode: "TRANSACTION000", error: ERRORCODE.TRANSACTION.TRANSACTION000 });

    }
})

module.exports= router;