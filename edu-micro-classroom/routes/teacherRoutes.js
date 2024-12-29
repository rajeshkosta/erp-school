const express = require("express");
const router = express.Router();
const { STATUS, logger, httpResponseUtil } = require("edu-micro-common");
const classroomStudentModel = require('../models/classroomStudent');
const ERRORCODE = require('../constants/ERRORCODE');
const { CLASSROOM_CONST } = require('../constants/CONST');
const teacherService = require('../services/teacherService');


router.post('/getClassSubjectDetails', async (req, res) => {
    try {
        console.log(req.plainToken);
        const reqUserDetails = req.plainToken;
        const user_id = req.body.teacher_id ? req.body.teacher_id : reqUserDetails.user_id;
        const academic_year_id = req.body.academic_year_id ? req.body.academic_year_id : null;
        const reqParams = {
            user_id,
            academic_year_id
        }

        const classSubjectDetails = await teacherService.getClassSubjectDetails(reqParams);
        return httpResponseUtil.sendSuccessResponse(res, STATUS.OK, classSubjectDetails, "Successfully fetched class subject details");

    } catch (error) {
        console.log(error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"STUDENTERR0000", "error":"${ERRORCODE.STUDENT_ERR.STUDENTERR0000}"}`);
    }
})

module.exports = router;
