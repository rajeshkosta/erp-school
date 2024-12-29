const express = require('express');
const router = express.Router();
const { STATUS, CONST, logger } = require("edu-micro-common");
const parentService = require("../services/parentService");
const parentModel = require('../models/parent');
const ERROR  = require("../constants/ERRORCODE");

// POST API for adding a new parent
router.post('/addParent', async (req, res) => {
    try {
      const reqUserDetails = req.plainToken;
      let parentDetails = new parentModel.Parent(req.body);
      
      parentDetails = CONST.appendReqUserData(parentDetails, reqUserDetails);
  
      const { error } = parentModel.validateParent(parentDetails);  
  
      if (error) {
        if (error.details) {
          return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
        } else {
          return res.status(STATUS.BAD_REQUEST).send(error.message);
        }
      }
  
      const checkParentExists = await parentService.checkIfParentExists(parentDetails.mobile_no);
      if (checkParentExists) {
        return res.status(STATUS.BAD_REQUEST).send({
          errorCode: "PARENT0002",
          error: ERROR.ERROR.PARENT0002
        });
      }
  
      const parentResult = await parentService.addParent(parentDetails);
  
      res.status(STATUS.CREATED).json({ message: 'Parent created successfully', data: parentResult });
    } catch (error) {
      logger.error(`Error adding parent: ${error}`);
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong!' });
    }
});



router.get('/getAllParents', async (req, res) => {
    try {
        const allParents = await parentService.getAllParents();

        res.status(STATUS.OK).json({ data: allParents });
    } catch (error) {
        logger.error(`Error getting parents: ${error}`);
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong!' });
    }
});


router.get('/getParentByMobile/:mobileNumber', async (req, res) => {
    try {
      const mobileNumber = req.params.mobileNumber;
  
      const parent = await parentService.getParentByMobile(mobileNumber);
  
      if (!parent) {
        return res.status(STATUS.NOT_FOUND).json({ error: 'Parent not found' });
      }
  
      res.status(STATUS.OK).json({ data: parent });
    } catch (error) {
      logger.error(`Error getting parent by mobile number: ${error}`);
      res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong!' });
    }
  });

  router.get('/getParentByID/:parentID', async (req, res) => {
    try {
        const parentID = req.params.parentID;

        const parent = await parentService.getParentByID(parentID);

        if (!parent) {
            return res.status(STATUS.NOT_FOUND).json({ error: 'Parent not found' });
        }

        res.status(STATUS.OK).json({ data: parent });
    } catch (error) {
        logger.error(`Error getting parent by ID: ${error}`);
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong!' });
    }
});
  

router.post('/updateParent/:parentID', async (req, res) => {
    try {
      const reqUserDetails = req.plainToken;
      const parentID = req.params.parentID;
      let updatedParentDetails = new parentModel.Parent(req.body);
  
      const { error } = parentModel.validateParent(updatedParentDetails);
  
      if (error) {
        return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
      }
  
      updatedParentDetails = CONST.appendReqUserData(updatedParentDetails, reqUserDetails);
  
     
      const updatedParentResult = await parentService.updateParent(updatedParentDetails, parentID);
  
      res.status(STATUS.OK).json({ message: 'Parent updated successfully', data: updatedParentResult });
    } catch (error) {
      logger.error(`Error updating parent: ${error}`);
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong!' });
    }
  });
  


module.exports = router;
