const express = require('express');
const router = express.Router();
const { STATUS, CONST, redis, generateToken, passwordPolicy, logger, SECRET_KEY, SMS } = require("edu-micro-common");
//const ERRORCODE = require('../constants/ERRRORCODE');
const subjectService = require("../services/subjectService");
const { v4: uuidv4 } = require('uuid');
const subjectModel = require('../models/subjectModel');
const { ERROR } = require("../constants/ERRORCODE");

// POST API for creating a new subject
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
    const checkSubjectExists = await subjectService.checkIfExist(subjectDetails.classroom_id, subjectDetails.subject_name);
    if (checkSubjectExists > 0) {
      return res.status(STATUS.BAD_REQUEST).send({
        errorCode: "SUBJ0003",
        error: ERROR.SUBJ0003
      });
    }

    const subjectResult = await subjectService.addSubject(subjectDetails);

    res.status(STATUS.CREATED).json({ message: 'Subject created successfully', data: subjectResult });
  } catch (error) {
    logger.error(`Error adding subject: ${error}`);
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong!' });
  }
});


router.post('/getAllSubjects', async (req, res) => {
  try {

    const classroom_id = req.body.classroom_id;
    const subjectList = await subjectService.getAllSubjects(classroom_id);
    res.status(STATUS.OK).send(subjectList);
    return;
  } catch (error) {
    logger.error(`Error getting subjects: ${error}`);
    res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong!' });
  }
});

router.get('/getSubjectByID/:subjectID', async (req, res) => {
  try {
    const subjectID = req.params.subjectID;

    const subject = await subjectService.getSubjectByID(subjectID);

    if (!subject) {
      return res.status(STATUS.NOT_FOUND).json({ error: 'Subject not found' });
    }

    res.status(STATUS.OK).json({ data: subject });
  } catch (error) {
    logger.error(`Error getting subject by ID: ${error}`);
    res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong!' });
  }
});





module.exports = router;
