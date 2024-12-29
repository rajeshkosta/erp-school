const express = require('express');
const router = express.Router();
const { STATUS, CONST, redis, generateToken, passwordPolicy, logger, SECRET_KEY, SMS } = require("edu-micro-common");
const subjectService = require("../services/subjectService");
const { v4: uuidv4 } = require('uuid');
const subjectModel = require('../models/subjectModel');
const { ERROR } = require("../constants/ERRORCODE");

let async = require('async');

router.post('/addSubject', async (req, res) => {
    try {
        const reqUserDetails = req.plainToken;
        let subjectDetails = new subjectModel.Subject(req.body);
        subjectDetails = CONST.appendReqUserData(subjectDetails, reqUserDetails);
        const { error } = subjectModel.validateSubject(subjectDetails);

        if (error) {
            if (error.details)
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
            else return res.status(STATUS.BAD_REQUEST).send(error.message);

        }

        subjectDetails.school_id = reqUserDetails.school_id;

        if (!subjectDetails.school_id) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"SUBJ0001", "error":"${ERROR.SUBJ0001}"}`);
        }
        
        async.forEachOfSeries(subjectDetails.subject_name, async function (sub, a) {

            let subject_obj = {

                "subject_name": sub,
                "status": 1
            }

            const checkSubjectExists = await subjectService.checkIfExist(subjectDetails.school_id, subject_obj.subject_name);

            if (checkSubjectExists > 0) {
                return res.status(STATUS.BAD_REQUEST).send(

                    {
                        errorCode: "SUBJ0003",
                        error: ERROR.SUBJ0003
                    }

                );
            }

            subject_obj.school_id = subjectDetails.school_id;
            subject_obj.created_by = subjectDetails.created_by;
            subject_obj.updated_by = subjectDetails.updated_by;

            await subjectService.addSubject(subject_obj);

        }, async function () {

            return res.status(STATUS.CREATED).json({ message: 'Subject created successfully' });
        
        });

    } catch (error) {
        logger.error(`Error adding subject: ${error}`);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send();
    }
});

router.get('/getAllSubjects', async (req, res) => {
    try {
        const reqUserDetails = req.plainToken;
      var  school_id = reqUserDetails.school_id;
        const allSubjects = await subjectService.getAllSubjects(school_id);

        return res.status(STATUS.OK).json({ data: allSubjects });
    } catch (error) {
        logger.error(`Error getting all subjects: ${error}`);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong!' });
    }
});



router.get('/getSubjectById/:subject_id', async (req, res) => {
    try {

        const { subject_id } = req.params;
        const subject = await subjectService.getSubjectById(subject_id);

        res.status(STATUS.OK).json({ data: subject });
    } catch (error) {
        logger.error(`Error getting subject by id: ${error}`);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong!' });
    }
});


router.post('/updateSubject', async (req, res) => {
    try {
        let reqSubDetails = req.plainToken;
    let userId = reqSubDetails.user_id;
    const subjectDetails = new subjectModel.UpdateSubject(req.body);
    const { error } = subjectModel.validateUpdateSubject(subjectDetails);
    if (error) {
      if (error.details)
        return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
      else return res.status(STATUS.BAD_REQUEST).send(error.message);
    }
   
    subjectDetails.updated_by = userId;
    subjectDetails.school_id = reqSubDetails.school_id;


    const checkIfExistbyID = await subjectService.checkIfExistbyID(subjectDetails.school_id, subjectDetails.subject_name,subjectDetails.subject_id);

    if (checkIfExistbyID > 0) {
        return res.status(STATUS.BAD_REQUEST).send(
            {
                errorCode: "SUBJ0003",
                error: ERROR.SUBJ0003
            }

        );
    }

      
    await subjectService.UpdateSubjectDetails(subjectDetails);


        return res.status(STATUS.OK).json({ message: 'Subject name updated successfully' });
    } catch (error) {
        logger.error(`Error updating subject name: ${   error}`);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong!' });
    }
});

router.get('/getAllActiveSubjects', async (req, res) => {
    try {
        const reqUserDetails = req.plainToken;
        const school_id = reqUserDetails.school_id;

        const allActiveSubjects = await subjectService.getAllActiveSubjects(school_id);

        return res.status(STATUS.OK).json({ data: allActiveSubjects });
    } catch (error) {
        logger.error(`Error getting all active subjects: ${error}`);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong!' });
    }
});

// get subject suggestion api 

router.get('/subjectSuggestion', async (req, res) => {

    try{
        const subjectSuggestion = await subjectService.subjects();
        return res.status(STATUS.OK).send(subjectSuggestion);
    }
    catch{
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong!'});
    }
})

module.exports = router;