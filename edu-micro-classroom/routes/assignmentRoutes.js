
const express = require('express');
const router = express.Router();
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
//const fileType = require('file-type');
const { STATUS, minioUtil, logger, DB_STATUS, s3Util, commonService, CONST } = require("edu-micro-common");
const ERRORCODE = require("../constants/ERRORCODE.js");
router.use(bodyParser.json({ limit: "5mb" }));
router.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));
let async = require('async');
let assignmentModel = require('../models/assignmentModel');
let assignmentService = require('../services/assignmentServices');
const multer = require("multer");
router.use(fileUpload());


//ADD ASSIGNMENT
router.post('/addAssignment', async (req, res) => {
    try {
        const assignmentData = JSON.parse(`${req.body.assignment_data}`)
        const reqAssignmentDetail = req.plainToken;
        let allowedFileType = ["PDF", "IMAGE", "SHEET","WORD"]
        const assignmentDetails = new assignmentModel.assignment(assignmentData);
        const { error } = assignmentModel.validateAssignment(assignmentDetails)
        if (error) {
            if (error.details)
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
            else return res.status(STATUS.BAD_REQUEST).send(error.message);
        }

        assignmentDetails.school_id = reqAssignmentDetail.school_id;
        assignmentDetails.created_by = reqAssignmentDetail.user_id;
        assignmentDetails.updated_by = reqAssignmentDetail.user_id;

        const decsLength = assignmentDetails.assignment_description.length;
        const isClassRoomExist = await assignmentService.isClassRoomExistInTab(assignmentDetails);
        const isSubjectExist = await assignmentService.isSubjectExistInTab(assignmentDetails);
        const isAssignmentExist = await assignmentService.checkAssignment(assignmentDetails);
        if (isAssignmentExist > 0) {
            res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ASSIGNMENT0001", "error":"${ERRORCODE.ASSIGNMENT.ASSIGNMENT0001}"}`);
        } else if (isClassRoomExist == 0) {
            res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ASSIGNMENT0002", "error":"${ERRORCODE.ASSIGNMENT.ASSIGNMENT0002}"}`);
        } else if (isSubjectExist == 0) {
            res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ASSIGNMENT0003", "error":"${ERRORCODE.ASSIGNMENT.ASSIGNMENT0003}"}`);
        } else if(decsLength > 499){
            res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ASSIGNMENT0007", "error":"${ERRORCODE.ASSIGNMENT.ASSIGNMENT0007}"}`);
        }else{
            const assignmentResult = await assignmentService.addAssignment(assignmentDetails);
            const assignment_id = assignmentResult[0].assignment_id;
            if (req.files) {
                assignmentDetails.assignment_document = await commonService.getFileUploadPath(req.files.assignment_document, "assignment-document", allowedFileType);
            }
            if (assignmentDetails && assignmentDetails.assignment_document) {
                const assignmentDoc = await assignmentService.addAssignmentDoc(assignmentDetails, assignment_id)
            }

            return res.status(STATUS.OK).send({
                message: "Assignment added successfully."
            });
        }
    }
    catch (error) {
        logger.error("catch error", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"ASSIGNMENT0000", "error":"${ERRORCODE.ASSIGNMENT.ASSIGNMENT0000}"}`);
    }
});


//GET ALL
router.post("/getAll", async (req, res) => {
    try {
        const reqAssignmentDetail = req.plainToken;
        const classroom_id = req.body.classroom_id;
        const class_id = req.body.class_id;
        const academic_year_id = req.body.academic_year_id;
        const subject_id = req.body.subject_id;
        const section_id = req.body.section_id;
        const pageSize = req.body.page_size ? req.body.page_size : 20;
        const search = req.body.search ? req.body.search : null;
        const user_id = req.body.user_id ? req.body.user_id : reqAssignmentDetail.user_id;
        let currentPage = req.body.current_page ? req.body.current_page : 0;
        currentPage = (currentPage == 1 || currentPage == 0) ? 0 : ((currentPage - 1) * pageSize);

        if (!academic_year_id) {
            res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ASSIGNMENT0006", "error":"${ERRORCODE.ASSIGNMENT.ASSIGNMENT0006}"}`);
        }

        const reqParams = {
            pageSize,
            currentPage,
            classroom_id,
            search,
            class_id,
            academic_year_id,
            subject_id,
            section_id,
            user_id
        };

        const AssignmentList = await assignmentService.getAllAssignment(reqParams);
        res.status(STATUS.OK).send(AssignmentList);
        return;
    } catch (error) {
        logger.error(error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"ASSIGNMENT0000", "error":"${ERRORCODE.ASSIGNMENT.ASSIGNMENT0000}"}`);
    }
    
});
//GET BY ID
router.get("/getAssignment/:assignmentId", async (req, res) => {
    try {
        const assignment_id = parseInt(req.params.assignmentId);
        const checkAssignmentId = await assignmentService.checkAssignmentId(assignment_id);
        if (checkAssignmentId == 0) {
            res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ASSIGNMENT0004", "error":"${ERRORCODE.ASSIGNMENT.ASSIGNMENT0004}"}`);
        } else {
            const [getAssignment] = await assignmentService.getAssignmentById(assignment_id);
            const [assDocData] = await assignmentService.getAssDocDetailsByAssId(getAssignment.assignment_id);
            const presignedURL = await minioUtil.presignedGetObject(process.env.EDU_S3_BUCKET, assDocData.assignment_document, 300);
            getAssignment.docUrl = presignedURL;
            res.status(STATUS.OK).send(getAssignment);
        }
    } catch (error) {
        logger.error(error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"ASSIGNMENT0000", "error":"${ERRORCODE.ASSIGNMENT.ASSIGNMENT0000}"}`);

    }
})

//UPDATE ASSIGNMENT

router.post("/update", async (req, res) => {
    try {
        const assignmentUpdateData = JSON.parse(`${req.body.update_data}`)
        const reqAssignmentDetail = req.plainToken;
        const assignmentDetails = new assignmentModel.updatedAssignment(assignmentUpdateData);
        let allowedFileType = ["PDF", "IMAGE", "SHEET","WORD"]
        const { error } = assignmentModel.validateUpdateAssignment(assignmentDetails);

        if (error) {
            if (error.details)
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
            else return res.status(STATUS.BAD_REQUEST).send(error.message);

        }

        const checkUpdateAssignmentId = await assignmentService.checkUpdateAssignmentId(assignmentDetails);
        if (checkUpdateAssignmentId == 0) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ASSIGNMENT0004", "error":"${ERRORCODE.ASSIGNMENT.ASSIGNMENT0004}"}`);
        }

        const isSubjectExist = await assignmentService.isSubjectExistInTab(assignmentDetails)
        if (isSubjectExist == 0) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ASSIGNMENT0003", "error":"${ERRORCODE.ASSIGNMENT.ASSIGNMENT0003}"}`);
        }

        const isUpdateAssExistWithId = await assignmentService.isUpdateAssExistWithId(assignmentDetails);
        const isUpdateAssExist = await assignmentService.isUpdateAssExist(assignmentDetails);
        if(isUpdateAssExistWithId == 0 && isUpdateAssExist == 1){
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ASSIGNMENT0001", "error":"${ERRORCODE.ASSIGNMENT.ASSIGNMENT0001}"}`);
        }
    
        const assignment_id = assignmentDetails.assignment_id;
        await assignmentService.updatedAssignment(assignmentDetails);

        const docFile = req.files && req.files.update_document ? req.files.update_document : null
        if (docFile) {
            const UpdateDocument = await commonService.getFileUploadPath(docFile, "assignment-document", allowedFileType);
            const checkAssDoc = await assignmentService.checkAssDoc(assignment_id)
            if (checkAssDoc > 0) {
                await assignmentService.updatedAssignmentDocument(assignment_id, UpdateDocument)
            } else {
                await assignmentService.addAssignmentDocUpdate(assignment_id,UpdateDocument)
            }
            //await assignmentService.updatedAssignmentDocument(assignment_id, UpdateDocument)
        }

        res.status(STATUS.OK).json({ message: "Assignment update successful", data: { assignment_id } });
        return;

    } catch (error) {
        console.log(error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"ASSIGNMENT0000", "error":"${ERRORCODE.ASSIGNMENT.ASSIGNMENT0000}"}`);
    }
});



//download assignment

router.get("/downloadAssignment/:assDocId", async (req, res) => {
    try {
        const ass_Doc_id = req.params.assDocId ? req.params.assDocId : null;
        const [assDocData] = await assignmentService.assDocDetails(ass_Doc_id);
        if (!assDocData) {
            res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ASSIGNMENT0005", "error":"${ERRORCODE.ASSIGNMENT.ASSIGNMENT0005}"}`);
        }
        const presignedURL = await minioUtil.presignedGetObject(process.env.EDU_S3_BUCKET, assDocData.assignment_document, 300);
        return res.status(STATUS.OK).send(presignedURL);

    } catch (error) {
        logger.error(error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"ASSIGNMENT0000", "error":"${ERRORCODE.ASSIGNMENT.ASSIGNMENT0000}"}`);
    }
})


//assignment class list


router.post("/assignmentClassList", async (req, res) => {
    try {
        let academicYearId = req.body.academic_year_id;

        if (!academicYearId) {
            res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ASSIGNMENT0006", "error":"${ERRORCODE.ASSIGNMENT.ASSIGNMENT0006}"}`);
        }

        const list = await assignmentService.getAssignmentClassList(academicYearId);
        return res.status(STATUS.OK).send(list);
    } catch (err) {
        logger.error(err);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send();
    }
});



module.exports = router;






