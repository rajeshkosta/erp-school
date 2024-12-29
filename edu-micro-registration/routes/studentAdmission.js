
const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const ERRORCODE = require('../constants/ERRORCODE');
const { commonService, STATUS, logger, CONST, httpResponseUtil, redis } = require("edu-micro-common");
const PAGESIZE = require('../constants/CONST');
const studentAdmissionModel = require('../models/studentAdmissionModel');
const studentAdmissionService = require('../services/studentAdmissionService')
//const { SCHOOL } = require('../constants/QUERY');
const fileUpload = require("express-fileupload");
router.use(bodyParser.json({ limit: "5mb" }));
router.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));



router.use(fileUpload());
router.use(
    bodyParser.json({
        limit: "5mb"
    })
);
router.use(
    bodyParser.urlencoded({
        extended: true,
        limit: "5mb"
    })
);

//ADMISSION-SERVICE IS UP 
router.get('/', async (req, res) => {
    res.send("Admission service is up and running!!");
});


router.post("/studentAdmission", async (req, res) => {
    try {
        const admissionDetails = req.plainToken;
        const studentData = JSON.parse(`${req.body.student_data}`);

        console.log("typeof studentData", typeof studentData);
        const studentDetails = new studentAdmissionModel.studentAdmission(studentData);
        const { error } = studentAdmissionModel.validateStudent(studentDetails)
        if (error) {
            if (error.details)
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
            else return res.status(STATUS.BAD_REQUEST).send(error.message);
        }

        studentDetails.school_id = admissionDetails.school_id;
        studentDetails.created_by = admissionDetails.user_id;
        studentDetails.updated_by = admissionDetails.user_id;

        let isvalid = studentAdmissionModel.isValidDate(studentDetails.dob)
        if (!isvalid) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"STUDADMIS0007", "error":"${ERRORCODE.STUDENT_ADMISSION.STUDADMIS0007}"}`);
        }
        const student_admission_number = String(Math.floor(1000000000 + Math.random() * 9000000000));
        ////const student_admission_number = "ADMIN12345"; 
        ////const student_admission_number = await studentAdmissionService.generateUniqueAdmissionNumber(studentDetails);
        studentDetails.student_admission_number = student_admission_number;

        const isStudentExist = await studentAdmissionService.checkStudentExist(studentDetails);
        if (isStudentExist > 0) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"STUDADMIS0006", "error":"${ERRORCODE.STUDENT_ADMISSION.STUDADMIS0006}"}`);
        }

        const studentDocumentDetails = await uploadFiles(req.files, studentDetails);
        const studentAdmissionDetails = await studentAdmissionService.createStudentAdmission(studentDetails);
        await studentAdmissionService.insertDocument(studentAdmissionDetails[0].insert_student_admission, studentDocumentDetails);

        const response = {
            student_admission_id: studentAdmissionDetails[0].insert_student_admission,
            student_admission_number: student_admission_number
        };

        return res.status(STATUS.CREATED).json({ message: 'Admission successfully completed', data: [response] });

    } catch (error) {
        logger.error("catch error", error);
        res.status(STATUS.BAD_REQUEST).send(error);
    }

});


router.post("/uploadFile", async (req, res) => {
    try {
        let documentReq = (req.body);
        const document_type = documentReq.constant;
        let allowedFileTypes = ["PDF"];

        if (document_type === "STUDENT_PHOTO") {
            console.log('student photo')
            allowedFileTypes = ["IMAGE"]
            let path = await commonService.getFileUploadPath(req.files, "student_photo", allowedFileTypes);
            return res.status(STATUS.OK).json({ message: "Photo uploaded successfully", path });
        }
        if (document_type === "BIRTH_CERTIFICATE") {
            allowedFileTypes = ["PDF", "IMAGE"]
            let path = await commonService.getFileUploadPath(req.files, "birth_certificate", allowedFileTypes);
            return res.status(STATUS.OK).json({ message: "Birth certificate uploaded successfully", path });
        }
        if (document_type === "DOCUMENT") {
            allowedFileTypes = ["PDF", "IMAGE"]
            let path = await commonService.getFileUploadPath(req.files, "student_document", allowedFileTypes);
            return res.status(STATUS.OK).json({ message: "Document uploaded successfully", path });
        }
        if (document_type === "PARENTS") {
            allowedFileTypes = ["IMAGE"]
            let path = await commonService.getFileUploadPath(req.files, "parents", allowedFileTypes);
            return res.status(STATUS.OK).json({ message: "Photo uploaded successfully", path });
        }

        console.log('upload api---')
    } catch (error) {
        logger.error("catch error-", error);
        res.status(STATUS.BAD_REQUEST).send(error);
    }
});



router.post("/update", async (req, res) => {
    try {
        let reqAdmissionDetails = req.plainToken;
        const studentData = JSON.parse(`${req.body.student_data}`);
        const studentDetails = new studentAdmissionModel.updateStudentAdmission(studentData);
        const { error } = studentAdmissionModel.validateUpdateStudentAdmission(studentDetails);

        if (error) {
            if (error.details)
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
            else return res.status(STATUS.BAD_REQUEST).send(error.message);
        }
        studentDetails.updated_by = reqAdmissionDetails.user_id;
        studentDetails.created_by = reqAdmissionDetails.user_id;

        studentDetails.school_id = reqAdmissionDetails.school_id;
        const isStudentAdmitted = await studentAdmissionService.checkStudestudentDetailsntExistById(studentDetails.student_admission_id);

        if (isStudentAdmitted == 0) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"STUDADMIS0001", "error":"${ERRORCODE.STUDENT_ADMISSION.STUDADMIS0001}"}`);
        }

        await uploadFiles(req.files, studentDetails);
        await studentAdmissionService.insertDocument(studentDetails.student_admission_id, studentDetails);
        await studentAdmissionService.updateStudent(studentDetails);

        res.status(STATUS.OK).json({
            message: 'Admission details updated successfully'
        });
        let key = `Student-Admission-Data|School_id:${reqAdmissionDetails.school_id}`;
        redis.deleteKey(key);
        return;

    } catch (error) {
        logger.error(error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"STUDADMIS0003", "error":"${ERRORCODE.STUDENT_ADMISSION.STUDADMIS0003}"}`);
    }
});

router.get("/getStudent/:studentAdmissionId", async (req, res) => {
    try {
        const student_admission_id = parseInt(req.params.studentAdmissionId);
        const studentDetails = await studentAdmissionService.getStudentDetailsByAdmissionId(student_admission_id);
        const studentDocumentDetails = await studentAdmissionService.getStudentDocumentByAdmissionId(student_admission_id);
        const studentResult = await studentAdmissionService.mapStudentDocumentObject(studentDetails, studentDocumentDetails);
        res.status(STATUS.OK).json(studentResult);
        return;
    } catch (error) {
        logger.error("catch error", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"STUDENTSERVC002", "error":"${ERRORCODE.STUDENT_REGISTRATION.STUDENTSERVC002}"}`);
    }
});


router.post("/getStudentProfileDetailsById", async (req, res) => {
    try {
        const { student_admission_id, academic_year_id } = req.body;

        if (!student_admission_id) {
            return res.status(STATUS.BAD_REQUEST).send({ errorCode: "STUDADMIS0008", error: ERRORCODE.STUDENT_ADMISSION.STUDADMIS0008 });
        }
        if (!academic_year_id) {
            return res.status(STATUS.BAD_REQUEST).send({ errorCode: "STUDADMIS0004", error: ERRORCODE.STUDENT_ADMISSION.STUDADMIS0004 });
        }

        const studentDetails = await studentAdmissionService.getStudentDataById(student_admission_id, academic_year_id);
        const studentDocumentDetails = await studentAdmissionService.getStudentDocumentByAdmissionId(student_admission_id);
        const studentResult = await studentAdmissionService.mapStudentDocumentObject(studentDetails[0], studentDocumentDetails);
        const response = {
            studentDetails: studentResult
        };
        return res.status(STATUS.OK).json({ data: [response] });
    } catch (error) {
        logger.error("catch error", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"STUDENTSERVC002", "error":"${ERRORCODE.STUDENT_REGISTRATION.STUDENTSERVC002}"}`);
    }
});


router.post("/getAllStudentList", async (req, res) => {
    try {
        const admissionDetails = req.plainToken;

        let pageSize = req.body.pageSize ? req.body.pageSize : 0;
        let currentPage = req.body.currentPage ? req.body.currentPage : 0;
        const academic_year_id = req.body.academic_year_id ? req.body.academic_year_id : null;
        const student_admission_number = req.body.student_admission_number ? req.body.student_admission_number : '';
        const student_name = req.body.student_name ? req.body.student_name : '';
        const student_std_id = req.body.student_std_id ? req.body.student_std_id : null;
        const student_section_id = req.body.student_section_id ? req.body.student_section_id : null;
       // const student_search = req.body.student_search ? req.body.student_search : null;
        if (!academic_year_id) {
            return res.status(STATUS.BAD_REQUEST).send('academic_year_id is required');
        }

        currentPage = (currentPage == 1 || currentPage == 0) ? 0 : ((currentPage - 1) * pageSize);
        const status = req.body.status ? req.body.status : null;
        const school_id = admissionDetails.school_id;
        const reqParams = {
            pageSize,
            currentPage,
            status,
            school_id,
            academic_year_id,
            student_admission_number,
            student_name,
           // student_search,
            student_std_id,
            student_section_id
        };


        const studentList = await studentAdmissionService.getAllStudentList(reqParams);

        res.status(STATUS.OK).json(studentList);
        return;

    } catch (error) {
        logger.error("catch error", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"STUDADMIS0003", "error":"${ERRORCODE.STUDENT_ADMISSION.STUDADMIS0003}"}`);
    }
});

// router.post("/getAllStudentList", async (req, res) => {
//     try {
//         const admissionDetails = req.plainToken;

//         const pageSize = req.body.page_size ? req.body.page_size : 0;
//         let currentPage = req.body.current_page ? req.body.current_page : 0;
//         const academic_year_id = req.body.academic_year_id;

//         if (!academic_year_id) {
//             return res.status(STATUS.BAD_REQUEST).send('academic_year_id is required');
//         }

//         currentPage = (currentPage == 1 || currentPage == 0) ? 0 : ((currentPage - 1) * pageSize);
//         const status = req.body.status ? req.body.status : null;
//         const school_id = admissionDetails.school_id;
//         const reqParams = {
//             pageSize,
//             currentPage,
//             status,
//             school_id,
//             academic_year_id
//         };


//         const studentList = await studentAdmissionService.getAllStudentList(reqParams);
//         res.status(STATUS.OK).json(studentList);
//         return;

//     } catch (error) {
//         logger.error("catch error", error);
//         res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"STUDADMIS0003", "error":"${ERRORCODE.STUDENT_ADMISSION.STUDADMIS0003}"}`);
//     }
// });



router.post("/getStudentForAllocation", async (req, res) => {
    try {
        const { school_id } = req.plainToken;
        const academic_year_id = req.body.academic_year_id;
        const class_id = req.body.class_id;

        if (!academic_year_id) {
            return res.status(STATUS.BAD_REQUEST).send({ errorCode: "STUDADMIS0004", error: ERRORCODE.STUDENT_ADMISSION.STUDADMIS0004 });
        }

        if (!class_id) {
            return res.status(STATUS.BAD_REQUEST).send({ errorCode: "STUDADMIS0005", error: ERRORCODE.STUDENT_ADMISSION.STUDADMIS0005 });
        }

        const reqParams = {
            academic_year_id,
            class_id,
            school_id
        }

        const studentData = await studentAdmissionService.getStudentForAllocation(reqParams);
        return httpResponseUtil.sendSuccessResponse(res, STATUS.OK, studentData, 'Records fetched successfully')

    } catch (error) {
        logger.error("catch error", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"STUDENTSERVC002", "error":"${ERRORCODE.STUDENT_REGISTRATION.STUDENTSERVC002}"}`);
    }
});

async function uploadFiles(reqfile, studentDetails) {

    try {

        if (reqfile && reqfile.student_photo) {
            try {
                allowedFileTypes = ["IMAGE"]
                let path = await commonService.getFileUploadPath(reqfile.student_photo, "student_photo", allowedFileTypes);
                studentDetails.student_photo = path;
            } catch (err) {
                err = { "error": `Student Photo ${err.error}` };
                throw err;
            }
        }
        if (reqfile && reqfile.father_photo) {
            try {
                allowedFileTypes = ["IMAGE"]
                let path = await commonService.getFileUploadPath(reqfile.father_photo, "parents", allowedFileTypes);
                studentDetails.father_photo = path;
            } catch (err) {
                err = { "error": `Father Photo ${err.error}` };
                throw err;
            }
        }
        if (reqfile && reqfile.mother_photo) {
            try {
                allowedFileTypes = ["IMAGE"]
                let path = await commonService.getFileUploadPath(reqfile.mother_photo, "parents", allowedFileTypes);
                studentDetails.mother_photo = path;
            } catch (err) {
                err = { "error": `Mother Photo ${err.error}` };
                throw err;
            }
        }
        if (reqfile && reqfile.birth_certificate) {
            try {
                let allowedFileTypes = ["PDF", "IMAGE"]
                let path = await commonService.getFileUploadPath(reqfile.birth_certificate, "birth_certificate", allowedFileTypes);
                studentDetails.birth_certificate = path;
            } catch (err) {
                err = { "error": `Birth Certificate ${err.error}` };
                throw err;
            }
        }
        if (reqfile && reqfile.aadhar_document) {
            try {
                let allowedFileTypes = ["PDF", "IMAGE"]
                let path = await commonService.getFileUploadPath(reqfile.aadhar_document, "student_document", allowedFileTypes);
                studentDetails.aadhar_document = path;
            } catch (err) {
                err = { "error": `Aadhar Document ${err.error}` };
                throw err;
            }
        }
        if (reqfile && reqfile.utc_certificate) {
            try {
                allowedFileTypes = ["PDF", "IMAGE"]
                let path = await commonService.getFileUploadPath(reqfile.utc_certificate, "student_document", allowedFileTypes);
                studentDetails.utc_certificate = path;
            } catch (err) {
                err = { "error": `Transfer Certificate ${err.error}` };
                throw err;
            }
        }

        return studentDetails;
    } catch (error) {
        console.log('error', error)
        throw error;
    }
}

module.exports = router;
