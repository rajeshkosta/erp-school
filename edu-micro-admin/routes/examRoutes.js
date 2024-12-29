const express = require("express");
const router = express.Router();
const { STATUS, logger } = require("edu-micro-common");

let async = require('async');

let examModels = require("../models/examModels");
let ERRORCODE = require("../constants/ERRORCODE");
const examService = require("../services/examService");
const { Console } = require("console");

const errorHandler = (res, status, message) => {
    console.error(message);
    res.status(status).send({ error: message });
};

// CREATE EXAM API

router.post("/createExamType", async (req, res) => {
    try {
        const reqAdminDetails = req.plainToken;
        const examNames = req.body.exam_name;

        if (!examNames || examNames.length === 0) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"EXAMTP000007", "error":"${ERRORCODE.ERROR.EXAMTP000007}"}`);
        }

        for (const examName of examNames) {
            const examDetails = new examModels.Exam({ exam_name: examName });
            const { error } = examModels.validateExam(examDetails);

            if (error) {
                return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"EXAMTP000001", "error":"${ERRORCODE.ERROR.EXAMTP000001}"}`);
            }

            examDetails.school_id = reqAdminDetails.school_id;
            examDetails.created_by = reqAdminDetails.user_id;
            examDetails.updated_by = reqAdminDetails.user_id;

            const isExamTypeAvailable = await examService.checkIfExamDetailsExist(examDetails);

            if (isExamTypeAvailable > 0) {
                return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"EXAMTP000003", "error":"${ERRORCODE.ERROR.EXAMTP000003}"}`);
            }

            const createExamResult = await examService.addExam(examDetails);
        }

        res.status(STATUS.CREATED).json({ message: "Exams type created successfully." });
    } catch (error) {
        logger.error("catch error", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"EXAM000002", "error":"${ERRORCODE.ERROR.EXAMTP000002}"}`);
    }
});


//UPDATE API

router.post("/updateExamType", async (req, res) => {
    try {
        const reqAdminDetails = req.plainToken;
        const updatedExamDetails = new examModels.updateExam(req.body);
        const { error } = examModels.validateUpdateExamSchema(updatedExamDetails);

        if (error) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"EXAMTP000001", "error":"${ERRORCODE.ERROR.EXAMTP000001}"}`);
        }

        updatedExamDetails.school_id = reqAdminDetails.school_id;
        updatedExamDetails.updated_by = reqAdminDetails.user_id;
        const {exam_name} = updatedExamDetails;

        console.log("updatedExamDetails", updatedExamDetails);

        const isExamTypeIdAvailable = await examService.checkIfExamTypeIdExists(updatedExamDetails);
        if (isExamTypeIdAvailable == 0) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"EXAMTP000005", "error":"${ERRORCODE.ERROR.EXAMTP000005}"}`);
        }

        const isExamNameAvailable = await examService.checkIfExamDetailsExist(updatedExamDetails);
        if (isExamNameAvailable > 0) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"EXAMTP000003", "error":"${ERRORCODE.ERROR.EXAMTP000003}"}`);
        }

        const updateExamResult = await examService.updateExam(updatedExamDetails);
        console.log("updateExamResult---", updateExamResult);

        res.status(STATUS.OK).json({ message: "Exam type updated successfully." });
    } catch (error) {
        console.error("catch error", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"EXAMTP000002", "error":"${ERRORCODE.ERROR.EXAMTP000002}"}`);
    }
});




//GET ALL EXAM API 

router.get("/getAllExamsType", async (req, res) => {
    try {
        const reqAdminDetails = req.plainToken;
        const school_id = reqAdminDetails.school_id;

        const data = await examService.getAllExam(school_id);
        return res.status(STATUS.OK).send({ data });
    } catch (err) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"EXAMTP000002", "error":"${ERRORCODE.ERROR.EXAMTP000002}"}`);
    }
});

//GET BY EXAM ID API

router.get("/getExamTypeById/:examId", async (req, res) => {
    try {
        const examId = req.params.examId;
        if (isNaN(examId)) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"EXAMTP000006", "error":"${ERRORCODE.ERROR.EXAMTP000006}"}`);
        }

        const examDetails = await examService.getExamById(examId);
        if (!examDetails || Object.keys(examDetails).length === 0) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"EXAMTP000005", "error":"${ERRORCODE.ERROR.EXAMTP000005}"}`);
        }

        return res.status(STATUS.OK).send({ examDetails });
    } catch (err) {
        return errorHandler(res, STATUS.INTERNAL_SERVER_ERROR, "Internal Server Error");
    }
});

// GET ACTIVE API

router.get("/getActiveExamsType", async (req, res) => {
    try {

        const reqAdminDetails = req.plainToken;
        const school_id = reqAdminDetails.school_id;
        const data = await examService.getActiveExam(school_id);
        return res.status(STATUS.OK).send({ data });
    } catch (err) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"EXAMTP000002", "error":"${ERRORCODE.ERROR.EXAMTP000002}"}`);
    }
});


module.exports = router;
