const express = require("express");
const router = express.Router();
const { STATUS } = require("edu-micro-common");


router.get('/health', async (req, res) => {
    try {
        return res.status(STATUS.OK).send("Transport Service is Healthy");
    } catch (error) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send();
    }
});



module.exports = router; 