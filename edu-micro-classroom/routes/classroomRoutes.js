const express = require('express');
const router = express.Router();
const { STATUS, CONST, logger, httpResponseUtil } = require("edu-micro-common");

const { v4: uuidv4 } = require('uuid');
const classroomModel = require('../models/classroomModel');
const classroomService = require("../services/classroomService");
const { CLASSROOM_ERR } = require("../constants/ERRORCODE");

router.post('/addClassroom', async (req, res) => {
    try {

        const reqUserDetails = req.plainToken;
        const school_id = reqUserDetails.school_id
        let classroomDetails = new classroomModel.Classroom(req.body);
        classroomDetails = CONST.appendReqUserData(classroomDetails, reqUserDetails);
        const { error } = classroomModel.validateClassroom(classroomDetails);

        if (error) {
            return res.status(STATUS.BAD_REQUEST).send({ error: error?.details?.[0]?.message || error?.message });
        }

        const isAcademicYearIdValid = await classroomService.checkAcademicYearIdValid(classroomDetails.academic_year_id, school_id);
        if (!isAcademicYearIdValid) {
            return res.status(STATUS.BAD_REQUEST).send({ errorCode: "CLSRM0002", error: CLASSROOM_ERR.CLSRM0002 });
        }

        const isClassIdExists = await classroomService.checkClassIdExists(classroomDetails.class_id);
        if (!isClassIdExists) {
            return res.status(STATUS.BAD_REQUEST).send({ errorCode: "CLSRM0003", error: CLASSROOM_ERR.CLSRM0003 });
        }

        const isSectionIdExists = await classroomService.checkSectionIdExists(classroomDetails.section_id, school_id);
        if (!isSectionIdExists) {
            return res.status(STATUS.BAD_REQUEST).send({ errorCode: "CLSRM0004", error: CLASSROOM_ERR.CLSRM0004 });
        }

        const checkClassroomNameExist = await classroomService.checkClassroomExists(classroomDetails);
        if (checkClassroomNameExist > 0) {
            return res.status(STATUS.BAD_REQUEST).send({ errorCode: "CLSRM0001", error: CLASSROOM_ERR.CLSRM0001 });
        }

        const isSubjectValid = await classroomService.validateSubjects(classroomDetails.subjectList, school_id)
        if (!isSubjectValid) {
            return res.status(STATUS.BAD_REQUEST).send({ errorCode: "CLSRM0005", error: CLASSROOM_ERR.CLSRM0005 });
        }

        const data = await classroomService.addClassroomAndSubject(classroomDetails);

        return res.status(STATUS.OK).send({ classroom_id: data })


    } catch (error) {
        logger.error("catch error", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"CLSRM0000", "error":"${CLASSROOM_ERR.CLSRM0000}"}`);

    }
});


router.get('/getClassroom/:classroom_id', async (req, res) => {
    try {
        const classroomId = req.params.classroom_id;
        const classroomDetails = await classroomService.getClassroomDetails(classroomId);
        return res.status(STATUS.OK).send(classroomDetails)
    } catch (error) {
        console.error(error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"CLSRM0000", "error":"${CLASSROOM_ERR.CLSRM0000}"}`);
    }
})

router.post('/updateClassroom', async (req, res) => {
    try {
        //TODO: Validation checks pending here
        const reqUserDetails = req.plainToken;
        const school_id = reqUserDetails.school_id
        let classroomDetails = req.body
        console.log(classroomDetails);
        classroomDetails = CONST.appendReqUserData(classroomDetails, reqUserDetails, false);

        const isSubjectValid = await classroomService.validateSubjects(classroomDetails.subjectList, school_id)
        if (!isSubjectValid) {
            return res.status(STATUS.BAD_REQUEST).send({ errorCode: "CLSRM0005", error: CLASSROOM_ERR.CLSRM0005 });
        }

        const classroom_id = await classroomService.updateClassroom(classroomDetails);
        res.status(STATUS.OK).send({
            message: 'Classroom updated successfully',
            data: { classroom_id }
        });

    } catch (error) {
        console.error(error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"CLSRM0000", "error":"${CLASSROOM_ERR.CLSRM0000}"}`);
    }
})


router.post('/getAllClassrooms', async (req, res) => {
    try {

        //const reqUserDetails = req.plainToken;
        const pageSize = req.body.page_size ? req.body.page_size : 0;
        const academic_year_id = req.body.academic_year_id;
        const search = req.body.search ? req.body.search : null;
        let currentPage = req.body.current_page ? req.body.current_page : 0;
        currentPage = (currentPage == 1 || currentPage == 0) ? 0 : ((currentPage - 1) * pageSize);

        if (!academic_year_id) {
            return res.status(STATUS.BAD_REQUEST).send({ errorCode: "CLSRM0006", error: CLASSROOM_ERR.CLSRM0006 });
        }

        const reqParams = {
            pageSize,
            currentPage,
            academic_year_id,
            search
        };

        const data = await classroomService.getAllClassrooms(reqParams);
        res.status(STATUS.OK).send(data);
        return;

    } catch (error) {
        console.error(error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"CLSRM0000", "error":"${CLASSROOM_ERR.CLSRM0000}"}`);
    }
})


router.post('/getSectionsByStd', async (req, res) => {
    try {

        const { school_id } = req.plainToken;
        const academic_year_id = req.body.academic_year_id ? req.body.academic_year_id : null;
        const class_id = req.body.class_id ? req.body.class_id : null;

        if (!academic_year_id || !class_id) {
            return httpResponseUtil.sendErrorResponse(res, STATUS.BAD_REQUEST, 'CLSRM0007', CLASSROOM_ERR.CLSRM0007);
        }

        const isAcademicYearIdValid = await classroomService.checkAcademicYearIdValid(academic_year_id, school_id);
        if (!isAcademicYearIdValid) {
            return httpResponseUtil.sendErrorResponse(res, STATUS.BAD_REQUEST, 'CLSRM0002', CLASSROOM_ERR.CLSRM0002);
        }

        const reqParams = {
            school_id,
            academic_year_id,
            class_id
        }

        const data = await classroomService.getSectionsByStd(reqParams);
        return httpResponseUtil.sendSuccessResponse(res, STATUS.OK, data, 'Data found successfully!')

    } catch (error) {
        console.error(error);
        return httpResponseUtil.sendErrorResponse(res, STATUS.INTERNAL_SERVER_ERROR, 'CLSRM0000', CLASSROOM_ERR.CLSRM0000)
    }
})

router.post('/getCountsByClass', async (req, res) => {

    const classId = req.body.class_id;
    const academicyearId = req.body.academic_year_id;
    if (!classId) {
        return res.status(STATUS.BAD_REQUEST).send({ errorCode: "CLSRM0008", error: CLASSROOM_ERR.CLSRM0008 });
    }

    if (!academicyearId) {
        return res.status(STATUS.BAD_REQUEST).send({ errorCode: "CLSRM0006", error: CLASSROOM_ERR.CLSRM0006 });
    }

    const countsByClass = await classroomService.getCountsByClass(classId, academicyearId);

    return res.status(STATUS.OK).send(countsByClass);

});


router.post('/getClassByYear', async (req, res) => {
    try {

        const { school_id } = req.plainToken;
        const academic_year_id = req.body.academic_year_id;

        if (!academic_year_id) {
            return res.status(STATUS.BAD_REQUEST).send({ errorCode: "CLSRM0006", error: CLASSROOM_ERR.CLSRM0006 });
        }

        const isAcademicYearIdValid = await classroomService.checkAcademicYearIdValid(academic_year_id, school_id);
        if (!isAcademicYearIdValid) {
            return httpResponseUtil.sendErrorResponse(res, STATUS.BAD_REQUEST, 'CLSRM0002', CLASSROOM_ERR.CLSRM0002);
        }

        const data = await classroomService.getClassByYear(academic_year_id);
        return httpResponseUtil.sendSuccessResponse(res, STATUS.OK, data, 'Classes fetched successfully!');

    } catch (error) {
        console.error(error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"CLSRM0000", "error":"${CLASSROOM_ERR.CLSRM0000}"}`);
    }
})


router.post('/getSubjectsByStd', async (req, res) => {
    try {

        const { school_id } = req.plainToken;
        const academic_year_id = req.body.academic_year_id;
        const class_id = req.body.class_id;

        if (!academic_year_id || !class_id) {
            return httpResponseUtil.sendErrorResponse(res, STATUS.BAD_REQUEST, 'CLSRM0007', CLASSROOM_ERR.CLSRM0007);
        }

        const isAcademicYearIdValid = await classroomService.checkAcademicYearIdValid(academic_year_id, school_id);
        if (!isAcademicYearIdValid) {
            return httpResponseUtil.sendErrorResponse(res, STATUS.BAD_REQUEST, 'CLSRM0002', CLASSROOM_ERR.CLSRM0002);
        }

        const reqParams = {
            school_id,
            academic_year_id,
            class_id
        }

        const data = await classroomService.getSubjectsByStd(reqParams);
        return httpResponseUtil.sendSuccessResponse(res, STATUS.OK, data, 'Subject fetched successfully!')

    } catch (error) {
        console.error(error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"CLSRM0000", "error":"${CLASSROOM_ERR.CLSRM0000}"}`);
    }
})

router.post('/getSubjectsByClassroomId', async (req, res) => {
    try {

        const { school_id } = req.plainToken;
        const classroom_id = req.body.classroom_id;

        if (!classroom_id) {
            return httpResponseUtil.sendErrorResponse(res, STATUS.BAD_REQUEST, 'CLSRM0009', CLASSROOM_ERR.CLSRM0009);
        }

        const reqParams = {
            school_id,
            classroom_id
        }

        const data = await classroomService.getSubjectsByClassroomId(reqParams);
        return httpResponseUtil.sendSuccessResponse(res, STATUS.OK, data, 'Subject fetched successfully!')

    } catch (error) {
        console.error(error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"CLSRM0000", "error":"${CLASSROOM_ERR.CLSRM0000}"}`);
    }
})



router.post('/getSubjectDetails', async (req, res) => {
    try {

        const { school_id } = req.plainToken;
        const classroom_id = req.body.classroom_id;

        if (!classroom_id) {
            return httpResponseUtil.sendErrorResponse(res, STATUS.BAD_REQUEST, 'CLSRM0009', CLASSROOM_ERR.CLSRM0009);
        }

        const subjectData = await classroomService.getSubjectDetails(classroom_id);
        const classTeacherData = await classroomService.getClassTeacher(classroom_id);
        const data = { subjectData, classTeacherData };
        return httpResponseUtil.sendSuccessResponse(res, STATUS.OK, data, 'Subject fetched successfully!')



    } catch (error) {
        console.error(error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"CLSRM0000", "error":"${CLASSROOM_ERR.CLSRM0000}"}`);
    }

})


module.exports = router