const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const ERRORCODE = require('../constants/ERRORCODE');
const { STATUS, logger, CONST, JSONUTIL, redis } = require("edu-micro-common");
const PAGESIZE = require('../constants/CONST');
const studentModel = require('../models/studentModel');
const studentService = require('../services/studentService')
const { STUDENT_REGISTRATION } = require('../constants/QUERY');

const fileUpload = require('express-fileupload')
const XLSX = require('xlsx');

router.use(bodyParser.json({ limit: "5mb" }));
router.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));

router.use(fileUpload());

//POST Student_Registration
router.post("/create", async (req, res) => {

    try {

        const api_key = req.headers["x-api-key"];
        console.log(req.headers)
        if (!api_key) {
            return res.status(STATUS.BAD_REQUEST).send('x-api-key is required');
        }
        const checkAccessKeyExist = await studentService.checkAccessKey(api_key);

        if (checkAccessKeyExist[0].count == 0) {
            console.log('no api key found for the school')
            return res.status(STATUS.UNAUTHORIZED).send({
                message: "Unauthenticated access!"
            });
        }

        const studentDetails = new studentModel.STUDENT_REGISTRATION(req.body);
        const { error } = studentModel.validateStudent(studentDetails)

        if (error) {
            if (error.details)
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
            else return res.status(STATUS.BAD_REQUEST).send(error.message);
        }
        const schoolDetails = await studentService.getSchoolAccessDetails(api_key);
        console.log('schoolDetails---', schoolDetails)
        studentDetails.school_id = schoolDetails[0].school_id;


        // const isStudentExist = await studentService.checkStudentAvailable(studentDetails);
        // if (isStudentExist > 0) {
        //     return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"STUDENTSERVC001", "error":"${ERRORCODE.STUDENT_REGISTRATION.STUDENTSERVC001}"}`);
        // }


        
        const student_reg_number = `REG-${String(Math.floor(1000000000 + Math.random() * 9000000000))}`;
        studentDetails.student_reg_number = student_reg_number;
        const studentResult = await studentService.createStudent(studentDetails);
        const response = {
            student_reg_id: studentResult[0].student_reg_id,
            student_reg_number: student_reg_number
        };

        return res.status(STATUS.CREATED).json({ message: 'Student registered successfully', response });

    } catch (error) {
        logger.error("catch error", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"STUDENTSERVC002", "error":"${ERRORCODE.STUDENT_REGISTRATION.STUDENTSERVC002}"}`);
    }
});


router.post("/createContact", async (req, res) => {
    try {

        const api_key = req.headers["x-api-key"];
        console.log(req.headers)
        if (!api_key) {
            return res.status(STATUS.BAD_REQUEST).send('x-api-key is required');
        }

        const contactFormDetails = req.body;

        const checkAccessKeyExist = await studentService.checkAccessKey(api_key);
        if (checkAccessKeyExist[0].count > 0) {
            const schoolDetails = await studentService.getSchoolAccessDetails(api_key);
            if (schoolDetails) {
                contactFormDetails.school_id = schoolDetails[0].school_id;
                const ContactForm = await studentService.addContactForm(contactFormDetails);
                res.status(STATUS.CREATED).json({ message: "Contact saved successfully ", contact_id: ContactForm[0].contact_id });
            }

        }
        else {
            console.log('no api key found for the school')
            res.status(STATUS.UNAUTHORIZED).send({
                message: "Unauthenticated access!"
            });
        }
    } catch (error) {
        logger.error(error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal server error');
    }
});


//UPDATE Student_Registration
router.post("/update", async (req, res) => {
    try {
        let reqSchoolDetails = req.plainToken;
        const studentDetails = new studentModel.Update_STUDENT_REGISTRATION(req.body);
        studentDetails.updated_by = reqSchoolDetails.school_id;
        const { error } = studentModel.validateUpdateStudent(studentDetails);

        if (error) {
            if (error.details)
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
            else return res.status(STATUS.BAD_REQUEST).send(error.message);
        }

        await studentService.updateStudent(studentDetails);
        res.status(STATUS.OK).json({
            student_reg_id: studentDetails.student_reg_id,
            message: 'Student_registration Updated Successfully'
        });
        return;

    } catch (error) {
        logger.error(error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"STUDENTSERVC002", "error":"${ERRORCODE.STUDENT_REGISTRATION.STUDENTSERVC002}"}`);
    }

});

//GET Specific Student
router.get("/getStudent/:studentregId", async (req, res) => {
    try {
        const student_reg_id = parseInt(req.params.studentregId);
        const studentDetails = await studentService.getSpecificStudentDetails(student_reg_id);
        res.status(STATUS.OK).json(studentDetails);
        return;

    } catch (error) {
        logger.error("catch error", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"STUDENTSERVC002", "error":"${ERRORCODE.STUDENT_REGISTRATION.STUDENTSERVC002}"}`);
    }
});



router.post('/importStudents', async (req, res) => {
    try {

        //const reqUserDetails = req.plainToken;
        const school_id = req.body.school_id;
        const academic_year_id = req.body.academic_year_id;
        const user_id = req.body.user_id;
        console.log('school_id', school_id);
        console.log('academic_year_id', academic_year_id);
        const studentsFile = req.files ? req.files.file : null

        const studentsWorkbook = XLSX.read(studentsFile.data, { type: "buffer" });
        const sheets = studentsWorkbook.SheetNames;
        const studentData = XLSX.utils.sheet_to_json(studentsWorkbook.Sheets[sheets[0]], { defval: "" });
        const studentsFileHeader = Object.keys(studentData[0]);

        if (!studentData || studentData.length == 0) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"STUDENTERR0002", "error":"${ERRORCODE.STUDENT_ERR.STUDENTERR0002}"}`);
        }

       const data = await studentService.importStudents(studentData, school_id, academic_year_id, user_id)
        res.send(data)

        // const isHeadersValid = studentService.validateHeadersAllocation(studentsFileHeader);

        // if (!isHeadersValid) {
        //     return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"STUDENTERR0002", "error":"${ERRORCODE.STUDENT_ERR.STUDENTERR0002}"}`);
        // }

    } catch (error) {
        console.error("catch error", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"STUDENTSERVC002", "error":"${ERRORCODE.STUDENT_REGISTRATION.STUDENTSERVC002}"}`);

    }
})


module.exports = router;