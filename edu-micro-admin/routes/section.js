const express = require('express');
const router = express.Router();
const { STATUS, CONST, redis, generateToken, passwordPolicy, logger, SECRET_KEY, SMS } = require("edu-micro-common");
const sectionService = require("../services/sectionService");
const { v4: uuidv4 } = require('uuid');
const sectionModel = require('../models/section');
const { ERROR } = require("../constants/ERRORCODE");
const async = require('async');

router.post('/addSection', async (req, res) => {
    try {
        const reqUserDetails = req.plainToken;
        let sectionDetails = new sectionModel.Section(req.body);
        sectionDetails = CONST.appendReqUserData(sectionDetails, reqUserDetails);

        const { error } = sectionModel.validateSection(sectionDetails);

        if (error) {
            if (error.details) {
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
            } else {
                return res.status(STATUS.BAD_REQUEST).send(error.message);
            }
        }

        sectionDetails.school_id = reqUserDetails.school_id;

        if (!sectionDetails.school_id) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"SEC0001", "error":"${ERROR.SEC0001}"}`);
        }

        async.forEachOfSeries(sectionDetails.section_name, async function (sec, a) {

            let section_obj = {
                "section_name": sec,
                "status": 1
            }

            const checkSectionExists = await sectionService.checkIfExist(sectionDetails.school_id, section_obj.section_name);

            if (checkSectionExists > 0) {
                return res.status(STATUS.BAD_REQUEST).send({
                    errorCode: "SEC0003",
                    error: ERROR.SEC0003
                });
            }

            section_obj.school_id = sectionDetails.school_id;
            section_obj.created_by = sectionDetails.created_by;
            section_obj.updated_by = sectionDetails.updated_by;

            await sectionService.addSection(section_obj);

        }, async function () {

            return res.status(STATUS.CREATED).json({ message: 'Section created successfully' });

        });

    } catch (error) {
        logger.error(`Error adding section: ${error}`);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong!' });
    }
});

router.get('/getSection/:section_id', async (req, res) => {
    try {
        const { section_id } = req.params;
        const sectionDetails = await sectionService.getSectionById(section_id);

        res.status(STATUS.OK).json({ data: sectionDetails });
    } catch (error) {
        logger.error(`Error retrieving section details: ${error}`);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong!' });
    }
});

router.get('/getAllSection', async (req, res) => {
    try {
        const reqUserDetails = req.plainToken;
        const school_id = reqUserDetails.school_id;

        const sectionDetails = await sectionService.getAllSection(school_id);

        res.status(STATUS.OK).json({data: sectionDetails });
    } catch (error) {
        logger.error(`Error retrieving section details: ${error}`);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong!' });
    }
});


router.post('/updateSection', async (req, res) => {
    try {
        const reqSecDetails = req.plainToken;
        const userId = reqSecDetails.user_id;
        const sectionDetails = new sectionModel.UpdateSection(req.body);
        const { error } = sectionModel.validateUpdateSection(sectionDetails);

        if (error) {
            if (error.details)
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
            else return res.status(STATUS.BAD_REQUEST).send(error.message);
        }
        
        sectionDetails.updated_by = userId;
        sectionDetails.school_id = reqSecDetails.school_id;

        const checkIfExistbyID = await sectionService.checkIfExistbyID(sectionDetails.school_id, sectionDetails.section_name, sectionDetails.section_id);

        if (checkIfExistbyID > 0) {
            return res.status(STATUS.BAD_REQUEST).send({
                errorCode: "SEC0003",
                error: ERROR.SEC0003
            });
        }

        await sectionService.updateSectionDetails(sectionDetails);

        return res.status(STATUS.OK).json({ message: 'Section name updated successfully' });
    } catch (error) {
        logger.error(`Error updating section name: ${error}`);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong!' });
    }
});


module.exports = router;