const express = require("express");
const router = express.Router();
const fileUpload = require('express-fileupload')
const XLSX = require('xlsx');
const { STATUS, logger, httpResponseUtil } = require("edu-micro-common");

const classroomStudentModel = require('../models/classroomStudent');
const ERRORCODE = require('../constants/ERRORCODE');
const { CLASSROOM_CONST } = require('../constants/CONST');
const studentService = require('../services/classroomStudentService');



const errorHandler = (res, status, message) => {
    console.error(message);
    res.status(status).send({ error: message });
};

router.use(fileUpload());

router.post("/addClassroomStudents", async (req, res) => {
    try {
        const reqAdminDetails = req.plainToken;
        const classroomStudents = req.body;
        const created_by = reqAdminDetails.user_id;
        const updated_by = reqAdminDetails.user_id;

        if (!classroomStudents || classroomStudents.length === 0) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"CLSSTU000005", "error":"${ERRORCODE.ERROR.CLSSTU000005}"}`);
        }

        for (const classroomStudent of classroomStudents) {
            const { student_admission_id, classroom_id, roll_no, house_id } = classroomStudent;

            const studnetClassroomDetails = new classroomStudentModel.ClassroomStudent({ student_admission_id, classroom_id, roll_no, house_id, created_by, updated_by });

            const { error } = classroomStudentModel.validateClassroomStudent(studnetClassroomDetails);

            if (error) {
                return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"CLSSTU000003", "error":"${ERRORCODE.ERROR.CLSSTU000003}"}`);
            }

            const studentadmissionId = await studentService.checkAdmissionId(studnetClassroomDetails);

            if (studentadmissionId > 0) {
                return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"CLSSTU000001", "error":"${ERRORCODE.ERROR.CLSSTU000001}"}`);
            }

            const RollnoAvailableInClass = await studentService.checkRollnoAvailableInClass(studnetClassroomDetails);

            if (RollnoAvailableInClass > 0) {
                return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"CLSSTU000001", "error":"${ERRORCODE.ERROR.CLSSTU000001}"}`);
            }

            const createClassroomStudent = await studentService.addClassroomStudent(studnetClassroomDetails);
        }
        res.status(STATUS.CREATED).json({ message: "classroom Student created successfully." });
    } catch (error) {
        logger.error("catch error", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"CLSSTU000006", "error":"${ERRORCODE.ERROR.CLSSTU000006}"}`);
    }
});

router.get("/getClassroomStudentById/:studentId", async (req, res) => {
    try {
        const studentId = req.params.studentId;

        if (isNaN(studentId)) {
            return errorHandler(res, STATUS.BAD_REQUEST, "Invalid studentId");
        }

        const studentDetails = await studentService.getClassroomStudentById(studentId);
        studentService
        if (!studentDetails || Object.keys(studentDetails).length === 0) {
            return res.status(STATUS.NOT_FOUND).send({ error: "Student not found" });
        }

        return res.status(STATUS.OK).send({ studentDetails });
    } catch (err) {
        errorHandler(res, STATUS.INTERNAL_SERVER_ERROR, "Internal Server Error");
    }

});

router.post("/updateClassroomStudent", async (req, res) => {
    try {
        let reqStudentDetails = req.plainToken;
        const studentDetails = new classroomStudentModel.updateStudentClass(req.body);

        const { error } = classroomStudentModel.validateUpdateClassroomStudent(studentDetails);
        if (error) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"CLSSTU000003", "error":"${ERRORCODE.ERROR.CLSSTU000003}"}`)
        }
        let checkStudentAvailable = await studentService.checkStudentAvailable(studentDetails);
        if (checkStudentAvailable == 0)
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"CLSSTU000002", "error":"${ERRORCODE.ERROR.CLSSTU000002}"}`)


        let checkAdmissionId = await studentService.checkAdmissionId(studentDetails);
        if (checkAdmissionId > 0)
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"CLSSTU000004", "error":"${ERRORCODE.ERROR.CLSSTU000004}"}`)

        let checkRollnoAvailableInClass = await studentService.checkRollnoAvailableInClass(studentDetails);
        if (checkRollnoAvailableInClass > 0)
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"CLSSTU000001", "error":"${ERRORCODE.ERROR.CLSSTU000001}"}`)


        await studentService.updateClassroomStudent(studentDetails);
        res.status(STATUS.OK).json({
            student_id: studentDetails.student_id,
            message: 'classroom Student Updated Successfully'
        });
        return;
    } catch (error) {

        logger.error(error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send('internal server error');
    }

});

router.post("/getClassroomStudents", async (req, res) => {
    try {

        const { school_id } = req.plainToken;
        const pageSize = req.body.page_size ? req.body.page_size : null;
        const classroom_id = req.body.classroom_id || null;
        const search = req.body.search ? req.body.search : null;
        let currentPage = req.body.current_page ? req.body.current_page : 0;
        currentPage = (currentPage == 1 || currentPage == 0) ? 0 : ((currentPage - 1) * pageSize);

        const isClassroomIdValid = await studentService.checkClassroomFromValidSchool(school_id, classroom_id);
        if (!isClassroomIdValid) {
            return res.status(STATUS.BAD_REQUEST).send({ errorCode: "STUDENTERR0012", error: ERRORCODE.STUDENT_ERR.STUDENTERR0012 });
        }

        const reqParams = {
            classroom_id,
            pageSize,
            currentPage
        }

        const data = await studentService.getAllClassroomStudents(reqParams);
        return httpResponseUtil.sendSuccessResponse(res, STATUS.OK, data, "Students fetched successfully");

    } catch (err) {
        console.log(err);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"STUDENTERR0000", "error":"${ERRORCODE.STUDENT_ERR.STUDENTERR0000}"}`);
    }
});

router.post('/getStudentsForAllocation', async (req, res) => {
    try {

        const { school_id } = req.plainToken;
        const reqParams = req.body;
        reqParams.school_id = school_id;
        reqParams.search_by = reqParams.search_by ? reqParams.search_by.toUpperCase() : '';
        let responseData;

        const validateData = classroomStudentModel.validateAllocationRequest(reqParams);
        if (!validateData.isValid) {
            return res.status(STATUS.BAD_REQUEST).send(validateData.message);
        }


        if (reqParams.search_by == 'CLASS') {
            responseData = await studentService.getStudentsForAllocationFromClass(reqParams);
        }

        if (reqParams.search_by == 'ADMISSION') {
            responseData = await studentService.getStudentsForAllocationFromAdmission(reqParams);
        }

        responseData = await studentService.getPhotoUrlForStudentList(responseData);
        return httpResponseUtil.sendSuccessResponse(res, STATUS.OK, responseData, "Data fetched successfully")

    } catch (error) {
        logger.error(error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"STUDENTERR0000", "error":"${ERRORCODE.STUDENT_ERR.STUDENTERR0000}"}`);
    }
})


router.post('/getStudentsForAllocation1', async (req, res) => {
    try {

        const { school_id } = req.plainToken;
        const reqParams = req.body;
        reqParams.school_id = school_id;
        reqParams.search_by = reqParams.search_by ? reqParams.search_by.toUpperCase() : '';
        let responseData;

        const validateData = classroomStudentModel.validateAllocationRequest(reqParams);
        if (!validateData.isValid) {
            return res.status(STATUS.BAD_REQUEST).send(validateData.message);
        }


        if (reqParams.search_by == 'CLASS') {
            responseData = await studentService.getStudentsForAllocationFromClass(reqParams);
        }

        if (reqParams.search_by == 'ADMISSION') {
            responseData = await studentService.getStudentsForAllocationFromAdmission(reqParams);
        }

        return httpResponseUtil.sendSuccessResponse(res, STATUS.OK, responseData, "Data fetched successfully")

    } catch (error) {
        logger.error(error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"STUDENTERR0000", "error":"${ERRORCODE.STUDENT_ERR.STUDENTERR0000}"}`);
    }
})

router.post("/allocateStudents", async (req, res) => {
    try {


        const { school_id, user_id } = req.plainToken;
        const academic_year_id = req.body.academic_year_id || null;
        const classroom_id = req.body.classroom_id || null;
        const studentData = req.body.student_list || null;

        const reqParams = {
            studentData,
            school_id,
            academic_year_id,
            classroom_id,
            user_id
        }

        console.info("allocateStudents|Request", reqParams);

        const { error } = classroomStudentModel.validateAllocateStudents(reqParams);

        if (error) {
            if (error.details)
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
            else return res.status(STATUS.BAD_REQUEST).send(error.message);
        }

        const isAcademicYearIdValid = await studentService.checkAcademicYearIdValid(academic_year_id, school_id);
        if (!isAcademicYearIdValid) {
            return res.status(STATUS.BAD_REQUEST).send({ errorCode: "STUDENTERR0011", error: ERRORCODE.STUDENT_ERR.STUDENTERR0011 });
        }


        const isClassroomIdValid = await studentService.checkClassroomIdValid(academic_year_id, classroom_id);
        if (!isClassroomIdValid) {
            return res.status(STATUS.BAD_REQUEST).send({ errorCode: "STUDENTERR0012", error: ERRORCODE.STUDENT_ERR.STUDENTERR0012 });
        }

        const validateData = await studentService.validateStudentData(reqParams, false);
        if (!validateData.isValid) {
            return res.status(STATUS.BAD_REQUEST).send(JSON.parse(validateData.errorMessage));
        }

        reqParams.studentData = validateData.studentData;
        const data = await studentService.allocateStudents(reqParams)
        return httpResponseUtil.sendSuccessResponse(res, STATUS.OK, data, "Successfully allocated students")

    } catch (error) {

        logger.error("allocateStudents|Error", error);

        if (error.status) {
            return res.status(error.status).send({ "errorCode": error.errorCode, "error": error.error, "message": error.message })
        }

        return res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"STUDENTERR0000", "error":"${ERRORCODE.STUDENT_ERR.STUDENTERR0000}"}`);
    }
})

router.post("/allocateStudentsExcel", async (req, res) => {
    try {

        const reqUserDetails = req.plainToken;
        const school_id = reqUserDetails.school_id
        const studentsFile = req.files ? req.files.file : null
        const academic_year_id = req.body.academic_year_id || null;
        const classroom_id = req.body.classroom_id || null;

        const studentsWorkbook = XLSX.read(studentsFile.data, { type: "buffer" });
        const sheets = studentsWorkbook.SheetNames;
        const studentData = XLSX.utils.sheet_to_json(studentsWorkbook.Sheets[sheets[0]], { defval: "" });
        const studentsFileHeader = Object.keys(studentData[0]);

        if (!studentData || studentData.length == 0) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"STUDENTERR0002", "error":"${ERRORCODE.STUDENT_ERR.STUDENTERR0002}"}`);
        }

        const isHeadersValid = studentService.validateHeadersAllocation(studentsFileHeader);

        if (!isHeadersValid) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"STUDENTERR0002", "error":"${ERRORCODE.STUDENT_ERR.STUDENTERR0002}"}`);
        }

        const reqParams = {
            studentData,
            school_id,
            academic_year_id,
            classroom_id
        }

        const validateData = await studentService.validateStudentData(reqParams);

        const response = {
            success: true,
            message: "Successfully allocated students",
            data: validateData.studentData
        }

        if (!validateData.isValid) {
            response.success = false;
            response.message = "File contains invalid entries, please check error file";
            response.errorFile = ''
            return res.status(STATUS.OK).send(response);
        }


        res.send(response)

    } catch (error) {
        console.log(error);

        if (error.status) {
            return res.status(error.status).send({ "errorCode": error.errorCode, "error": error.error, "message": error.message })
        }

        return res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"STUDENTERR0000", "error":"${ERRORCODE.STUDENT_ERR.STUDENTERR0000}"}`);
    }
})

router.post('/reassignRollNo', async (req, res) => {
    try {

        const { school_id } = req.plainToken;
        const classroom_id = req.body.classroom_id || null;
        const rollNoType = req.body.rollNoType || CLASSROOM_CONST.RollNoTypes.byName;

        if (!classroom_id) {
            return res.status(STATUS.BAD_REQUEST).send({ errorCode: "STUDENTERR0012", error: ERRORCODE.STUDENT_ERR.STUDENTERR0012 });
        }

        const isClassroomIdValid = await studentService.checkClassroomFromValidSchool(school_id, classroom_id);
        if (!isClassroomIdValid) {
            return res.status(STATUS.BAD_REQUEST).send({ errorCode: "STUDENTERR0012", error: ERRORCODE.STUDENT_ERR.STUDENTERR0012 });
        }

        const data = await studentService.reassignRollNo(classroom_id, rollNoType);

        return httpResponseUtil.sendSuccessResponse(res, STATUS.OK, data, "Successfully reassigned roll no")


    } catch (error) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"STUDENTERR0000", "error":"${ERRORCODE.STUDENT_ERR.STUDENTERR0000}"}`);
    }
})


router.post("/reAllocateStudents", async (req, res) => {
    try {


        const { school_id, user_id } = req.plainToken;
        const academic_year_id = req.body.academic_year_id || null;
        const classroom_id = req.body.classroom_id || null;
        const studentData = req.body.student_list || null;

        const reqParams = {
            studentData,
            school_id,
            academic_year_id,
            classroom_id,
            user_id
        }

        const { error } = classroomStudentModel.validateAllocateStudents(reqParams);

        if (error) {
            if (error.details)
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
            else return res.status(STATUS.BAD_REQUEST).send(error.message);
        }

        const isAcademicYearIdValid = await studentService.checkAcademicYearIdValid(academic_year_id, school_id);
        if (!isAcademicYearIdValid) {
            return res.status(STATUS.BAD_REQUEST).send({ errorCode: "STUDENTERR0011", error: ERRORCODE.STUDENT_ERR.STUDENTERR0011 });
        }


        const isClassroomIdValid = await studentService.checkClassroomIdValid(academic_year_id, classroom_id);
        if (!isClassroomIdValid) {
            return res.status(STATUS.BAD_REQUEST).send({ errorCode: "STUDENTERR0012", error: ERRORCODE.STUDENT_ERR.STUDENTERR0012 });
        }


        const validateData = await studentService.validateStudentData(reqParams, true);
        console.log(validateData);
        if (!validateData.isValid) {
            return res.status(STATUS.BAD_REQUEST).send(JSON.parse(validateData.errorMessage));
        }

        reqParams.studentData = validateData.studentData;
        const data = await studentService.reAllocateStudents(reqParams)
        return httpResponseUtil.sendSuccessResponse(res, STATUS.OK, data, "Successfully Reallocated students")

    } catch (error) {
        console.log(error);

        if (error.status) {
            return res.status(error.status).send({ "errorCode": error.errorCode, "error": error.error, "message": error.message })
        }

        return res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"STUDENTERR0000", "error":"${ERRORCODE.STUDENT_ERR.STUDENTERR0000}"}`);
    }
})


module.exports = router;
