const express = require('express');
const router = express.Router();
const { CONST_CLASSES } = require("../constants/classConstant");
const schoolService = require('../services/schoolService')
const { getSchoolAccessDetails } = require('../services/contactFormService')
const { STATUS, logger, CONST, JSONUTIL, redis } = require("edu-micro-common");



router.get('/getClasses', async (req, res) => {

    let api_key = req.headers['x-api-key'];
    if (!api_key) {
        res.status(STATUS.UNAUTHORIZED).send({
            message: "Unauthenticated access!"
        });
    }
    const [access_key_details] = await getSchoolAccessDetails(api_key);
    let school_id = access_key_details.school_id;
    if (!school_id) {
        return res.send('school_id required')
    }
    let data = await schoolService.getStdMappingDetails(school_id);

    if (!data || data.length == 0) {

        data = await schoolService.getStdList(school_id);

    }
    return res.status(STATUS.OK).send(data);

});


router.get('/getSchoolClasses', async (req, res) => {

    let { school_id } = req.plainToken;
    if (!school_id) {
        return res.send('school_id required')
    }
    let data = await schoolService.getStdMappingDetails(school_id);
    //   res.send(CONST_CLASSES)

    if (!data || data.length == 0) {

        data = await schoolService.getStdList(school_id);

    }
    return res.status(STATUS.OK).send(data);

});


module.exports = router;