const express = require('express');
const fileUpload = require("express-fileupload");
const router = express.Router();
const bodyParser = require("body-parser");
const ERRORCODE = require('../constants/ERRORCODE');
const { STATUS, logger, CONST, JSONUTIL, redis } = require("edu-micro-common");
const PAGESIZE = require('../constants/CONST');
const examinationModule = require('../models/examinationModule');
const examinationService = require('../services/examinationService')
const { TRUST } = require('../constants/QUERY');

router.use(bodyParser.json({ limit: "5mb" }));
router.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));

//POST Examination
router.post("/create", async (req, res) => {

    try {

        const reqSchoolDetails = req.plainToken;
        const examinationDetails = new examinationModule.Examination(req.body);

        examinationDetails.created_by = reqSchoolDetails.user_id;
        examinationDetails.updated_by = reqSchoolDetails.user_id;

        const { error } = examinationModule.validateExamination(examinationDetails)

        if (error) {
            if (error.details)
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
            else return res.status(STATUS.BAD_REQUEST).send(error.message);
        }

        const isExamTypeExist = await examinationService.checkExamTypeExist(examinationDetails);
        if (isExamTypeExist > 0) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"EXAMINATIONSERVCOOO", "error":"${ERRORCODE.EXAMINATION.EXAMINATIONSERVCOOO}"}`);
        }

        const createExaminationResult = await examinationService.createExamination(examinationDetails);
        res.status(STATUS.CREATED).json(createExaminationResult);
        return;

    } catch (error) {
        logger.error("catch error", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"EXAMINATIONSERVCOO1", "error":"${ERRORCODE.EXAMINATION.EXAMINATIONSERVCOO1}"}`);
    }
});

//UPDATE Examination
router.post("/update", async (req, res) => {
    try {
        let reqSchoolDetails = req.plainToken;
        const examinationDetails = new examinationModule.UpdateExamination(req.body);
        examinationDetails.updated_by = reqSchoolDetails.user_id;
        const { error } = examinationModule.validateUpdateExamination(examinationDetails);

        if (error) {
            if (error.details)
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
            else
                return res.status(STATUS.BAD_REQUEST).send(error.message);
        }

        const isExamTypeExist = await examinationService.checkExamTypeExist1(examinationDetails);
        if (isExamTypeExist > 0) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"EXAMINATIONSERVCOOO", "error":"${ERRORCODE.EXAMINATION.EXAMINATIONSERVCOOO}"}`);
        }

        await examinationService.updateExamination(examinationDetails);
        res.status(STATUS.OK).json({
            examination_id: examinationDetails.examination_id,
            message: 'Examination Updated Successfully'
        });
        return;

    } catch (error) {
        logger.error(error);
        console.log(error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"EXAMINATIONSERVCOO1", "error":"${ERRORCODE.EXAMINATION.EXAMINATIONSERVCOO1}"}`);
    }

});

//GET All Trusts
router.post("/examinationlist/grid", async (req, res) => {
    try {

        const pageSize = req.body.page_size ? req.body.page_size : 0;
        let currentPage = req.body.current_page ? req.body.current_page : 0;
        currentPage = (currentPage == 1 || currentPage == 0) ? 0 : ((currentPage - 1) * pageSize);
        const status = req.body.status ? req.body.status : null;
        const user_id = req.plainToken.user_id;
        console.log(user_id);
        const reqParams = {
            pageSize,
            currentPage,
            status,
            classroom_id: req.body.classroom_id,
            user_id
        };

        const examinationList = await examinationService.getAllExaminations(reqParams);
        res.status(STATUS.OK).send(examinationList);
        return;

    } catch (error) {
        logger.error("catch error", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"EXAMINATIONSERVCOO1", "error":"${ERRORCODE.EXAMINATION.EXAMINATIONSERVCOO1}"}`);
    }
});

router.get("/classList/:academic_year_id", async (req, res) => {
    try {
        let academicYearId = req.params.academic_year_id;

        if (!academicYearId) {
            return res.status(STATUS.BAD_REQUEST).send({ errorCode: "EXAMINATIONSERVCOO4", error: ERRORCODE.EXAMINATION.EXAMINATIONSERVCOO4 });
        }

        const list = await examinationService.getclassList(academicYearId);
        return res.status(STATUS.OK).send(list);
    } catch (err) {
        logger.error(err);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send();
    }
});

router.get("/examListByClass/:academic_year_id/:class_id", async (req, res) => {
    try {
        let academicYearId = req.params.academic_year_id;
        let classId = req.params.class_id;

        if (!academicYearId) {
            return res.status(STATUS.BAD_REQUEST).send({ errorCode: "EXAMINATIONSERVCOO4", error: ERRORCODE.EXAMINATION.EXAMINATIONSERVCOO4 });
        }

        if (!classId) {
            return res.status(STATUS.BAD_REQUEST).send({ errorCode: "EXAMINATIONSERVCOO5", error: ERRORCODE.EXAMINATION.EXAMINATIONSERVCOO5 });
        }

        const list = await examinationService.examListByClass(academicYearId, classId);
        return res.status(STATUS.OK).send(list);
    } catch (err) {
        logger.error(err);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send();
    }
});

router.get("/getByExaminationId/:examination_id", async (req, res) => {
    try {
        let examinationId = req.params.examination_id;

        const examination = await examinationService.getByExaminationId(examinationId);
        return res.status(STATUS.OK).send(examination);
    } catch (err) {
        logger.error(err);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send();
    }
});

module.exports = router;