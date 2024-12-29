const express = require("express");
const router = express.Router();

const { STATUS, logger, CONST, JSONUTIL, redis } = require("edu-micro-common");
const ERRORCODE = require('../constants/ERRRORCODE');

const driverModel = require("../models/driverModel");
const driverService = require("../services/driverService");


//Add Driver
router.post("/add", async (req, res) => {
    try {
        const reqDriverDetail = req.plainToken;
        const driverDetails = new driverModel.driver(req.body);
        const mapDetails = new driverModel.mapDriver(req.body);

        const { error } = driverModel.validateDriver(driverDetails);
        if (error) {
            if (error.details)
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
            else return res.status(STATUS.BAD_REQUEST).send(error.message);
        }

        driverDetails.created_by = reqDriverDetail.user_id;
        driverDetails.updated_by = reqDriverDetail.user_id;
        driverDetails.school_id = reqDriverDetail.school_id;

        mapDetails.created_by = reqDriverDetail.user_id;
        mapDetails.updated_by = reqDriverDetail.user_id;

        const checkVehicleIdExist = await driverService.checkVehicleIdExist(mapDetails.vehicle_id);
        const vehicleId = await driverService.checkVehicleInVehTab(mapDetails.vehicle_id);
        const checkDriverExist = await driverService.checkDriverExist(driverDetails)
        if (checkDriverExist > 0) {
            res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"DRIVERSERVC001", "error":"${ERRORCODE.DRIVER.DRIVERSERVC001}"}`);
        } else if (checkVehicleIdExist > 0) {
            res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ASSIGNSERVC003", "error":"${ERRORCODE.ASSIGN.ASSIGNSERVC003}"}`);
        } else if (vehicleId == 0) {
            res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ASSIGNSERVC002", "error":"${ERRORCODE.ASSIGN.ASSIGNSERVC002}"}`);
        } else {
            const addDriver = await driverService.addDriver(driverDetails)
            res.status(STATUS.OK).json(addDriver);

            const driverIDArr = addDriver[0];
            const driverID = driverIDArr.driver_id;

            await driverService.vehicleDriverMap(mapDetails, driverID);
            
        }


    } catch (error) {
        logger.error("catch error", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"DRIVERSERVC000", "error":"${ERRORCODE.DRIVER.DRIVERSERVC000}"}`);
    }
});
//Get Driver By ID
router.get("/getDriver/:driver_id", async (req, res) => {
    try {
        const driver_id = parseInt(req.params.driver_id);
        const getDriver = await driverService.getDriverById(driver_id);
        res.status(STATUS.OK).send(getDriver);
        return;
    } catch (error) {
        logger.error("catch error", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"DRIVERSERVC000", "error":"${ERRORCODE.DRIVER.DRIVERSERVC000}"}`);
    }
});
//Get All Driver
router.post("/getAll", async (req, res) => {
    try {

        const reqDriverDetails = req.plainToken;
        const pageSize = req.body.page_size ? req.body.page_size : 50;
        const search = req.body.search ? req.body.search : null;
        let currentPage = req.body.current_page ? req.body.current_page : 0;
        currentPage = (currentPage == 1 || currentPage == 0) ? 0 : ((currentPage - 1) * pageSize);
        const school_id = reqDriverDetails.school_id ? reqDriverDetails.school_id : req.body.school_id;
        const reqParams = {
            pageSize,
            currentPage,
            school_id,
            search
        };

        const driverList = await driverService.getAllDriver(reqParams);
        res.status(STATUS.OK).send(driverList);
        return;
    } catch (error) {
        logger.error(error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"DRIVERSERVC000", "error":"${ERRORCODE.DRIVER.DRIVERSERVC000}"}`);
    }

});
//Update Driver
router.post("/update", async (req, res) => {
    try {
        const reqDriverDetail = req.plainToken;
        const driverDetails = new driverModel.updateDriver(req.body);

        const { error } = driverModel.validateUpdateDriver(driverDetails);
        if (error) {
            if (error.details)
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
            else return res.status(STATUS.BAD_REQUEST).send(error.message);
        }

        const checkIfExist = await driverService.checkDriverExist(driverDetails.driving_licence)
        if (checkIfExist > 0) {
            res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"DRIVERSERVC001", "error":"${ERRORCODE.DRIVER.DRIVERSERVC001}"}`);
        } else {
            const updateDriver = await driverService.updateDriver(driverDetails);
            res.status(STATUS.OK).json({
                driver_id: driverDetails.driver_id,
                message: "driver update successfully"
            });
        }
    } catch (error) {
        logger.error("catch error", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"DRIVERSERVC000", "error":"${ERRORCODE.DRIVER.DRIVERSERVC000}"}`);

    }
});

module.exports = router;