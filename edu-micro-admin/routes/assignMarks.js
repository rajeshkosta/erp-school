const express = require('express');
const fileUpload = require("express-fileupload");
const router = express.Router();
const bodyParser = require("body-parser");
const ERRORCODE = require('../constants/ERRORCODE');
const { STATUS, logger, CONST, JSONUTIL, redis, commonService } = require("edu-micro-common");
const PAGESIZE = require('../constants/CONST');
const assignMarksModels = require('../models/assignMarksModels');
const assignMarksService = require('../services/assignMarksService')
const { TEMPLATE } = require('../constants/QUERY');

//UPDATE updateMarks
router.post("/updateMarks", async (req, res) => {
    try {
        let reqAdminDetails = req.plainToken;
        const {academic_year_id,examination_id,student_id,exam_result_id } = req.body;
        const isExamResultsExist = await assignMarksService.checkExamResultsExistByExamResultId(exam_result_id);
        if (isExamResultsExist <=0){
            const examresults = new assignMarksModels.ExamResult(req.body);
            const examinationResults = await assignMarksService.examination(examination_id);
            examresults.maximum_marks = examinationResults.total_marks;
            examresults.passing_marks = examinationResults.passing_marks;
            examresults.updated_by = reqAdminDetails.user_id;
            examresults.created_by = reqAdminDetails.user_id;
            const { error } = assignMarksModels.validateExamResult(examresults);
            if (error) {
                if (error.details)
                    return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
                else return res.status(STATUS.BAD_REQUEST).send(error.message);
            }
            const createExamResult = await assignMarksService.createExamResult(examresults);
            res.status(STATUS.CREATED).json(createExamResult);
            return;
            
       }
    
        const examresult = new assignMarksModels.UpdateExamResult(req.body);
        const examinationResults = await assignMarksService.examination(examination_id);
        examresult.updated_by = reqAdminDetails.user_id;
        examresult.maximum_marks = examinationResults.total_marks;
        examresult.passing_marks = examinationResults.passing_marks;
       

        const { error } = assignMarksModels.validateUpdateTemplate(examresult);

        if (error) {
            if (error.details)
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
            else return res.status(STATUS.BAD_REQUEST).send(error.message);
        }

        await assignMarksService.updateExamResult(examresult);
        res.status(STATUS.OK).json({
            exam_result_id: examresult.exam_result_id,
            message: 'ExamResult Updated Successfully'
        });
        return;

    } catch (error) {
        logger.error( error);
        res.status(STATUS.BAD_REQUEST).send(error);
    }

});



// get assign marks by studnet id 

router.post("/getAssignMarksByStudentId", async (req, res) => {
    try {
        

        const AssignMarksOfStudent = new assignModel.assignMarks(req.body);

        if (!AssignMarksOfStudent.student_id) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ASSIGNMARKS001", "error":"${ERRORCODE.ERROR.ASSIGNMARKS001}"}`);
        } else {
            const assignMarks = await assignMarksService.getAssignMarksOfStudent(AssignMarksOfStudent.student_id, AssignMarksOfStudent.examination_id);

            const StudnetMarks = {
                studentId: AssignMarksOfStudent.student_id,
                examinationId: AssignMarksOfStudent.examination_id,
                marks: assignMarks.map((row, index) => ({
                    subjectId: row.subject_id,
                    totalmarks: row.maximum_marks,
                    marksObtained: row.marks_obtained,
                    resultId: index + 1,
                    passingMark: row.passing_marks
                }))
            };

            return res.status(STATUS.OK).send({ StudnetMarks });
        }
    } catch {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"ASSIGNMARKS002", "error":"${ERRORCODE.ERROR.ASSIGNMARKS002}"}`);
    }
});

//get all assign marks 

router.post("/getAllAssignMarks", async (req, res) => {
    try {
        const reqUserDetails = req.plainToken;
        const school_id = reqUserDetails.school_id;
        const class_id = req.body.class_id;
        const academic_year_id = req.body.academic_year_id;
        const section_id = req.body.section_id;
        const exam_type_id = req.body.exam_type_id;
        const pageSize = req.body.page_size ? req.body.page_size : 0;
        let currentPage = req.body.current_page ? req.body.current_page : 0;
        currentPage = (currentPage == 1 || currentPage == 0) ? 0 : ((currentPage - 1) * pageSize);
        
        if(!academic_year_id){
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ASSIGNMARKS003", "error":"${ERRORCODE.ERROR.ASSIGNMARKS003}"}`);
        }
        const reqParams = {
            academic_year_id,
            class_id,
            section_id,
            exam_type_id,
            pageSize,
            currentPage,
            school_id,
        };
        const AssignMarksList = await assignMarksService.getAllAssignMarks(reqParams);
        res.status(STATUS.OK).send(AssignMarksList);
        return;

    } catch (error) {
        logger.error("catch error", error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"ASSIGNMARKS002", "error":"${ERRORCODE.ERROR.ASSIGNMARKS002}"}`);
    }
});




module.exports = router;
