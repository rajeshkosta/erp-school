const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

const { STATUS, logger, CONST, JSONUTIL, minioUtil, redis, commonService } = require("edu-micro-common");
const ERRORCODE = require('../constants/ERRRORCODE');
router.use(bodyParser.json({ limit: "5mb" }));
router.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));
router.use(fileUpload());

const vehicleModel = require('../models/vehicleModel');
const vehicleService = require('../services/vehicleService')



router.post("/add", async (req, res) => {
    try {

        console.log(req.plainToken);
        const vehicleData = JSON.parse(`${req.body.vehicle_data}`)
        const { user_id, school_id } = req.plainToken
        let allowedFileTypes = ["IMAGE", "PDF", "SHEET","WORD"];
        const vehicleDetails = new vehicleModel.vehicle(vehicleData);

        console.log("vehicleDEtails.....", vehicleDetails);
        const { error } = vehicleModel.validateVehicle(vehicleDetails)
        if (error) {
            if (error.details)
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
            else return res.status(STATUS.BAD_REQUEST).send(error.message);
        }

        vehicleDetails.created_by = user_id;
        vehicleDetails.updated_by = user_id;
        vehicleDetails.school_id = school_id;

        const isVehicleExist = await vehicleService.checkVehicleExist(vehicleDetails);
        if (isVehicleExist > 0) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"VEHICLESERVC001", "error":"${ERRORCODE.VEHICLE.VEHICLESERVC001}"}`);
        }


        if (vehicleData.driver_id) {
            const isDriverExist = await vehicleService.checkDriverUserExists(vehicleData.driver_id, school_id)
            if (!isDriverExist) {
                return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"VEHICLESERVC002", "error":"${ERRORCODE.VEHICLE.VEHICLESERVC002}"}`);
            }
        }

        if (vehicleData.route_id) {
            const isRouteExist = await vehicleService.checkRouteExists(vehicleData.route_id, school_id)
            console.log('isRouteExist', isRouteExist);
            if (!isRouteExist) {
                return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"VEHICLESERVC003", "error":"${ERRORCODE.VEHICLE.VEHICLESERVC003}"}`);
            }
        }

        const addVehicle = await vehicleService.addVehicle(vehicleDetails);
        const vehicle_id = addVehicle[0].vehicle_id;
        const registrationCertificateFile = req.files && req.files.registration_certificate ? req.files.registration_certificate : null;
        if (registrationCertificateFile) {
            vehicleDetails.registration_certificate = await commonService.getFileUploadPath(req.files.registration_certificate, "registration-certificate", allowedFileTypes)
            const addVehDocument = await vehicleService.addVehDocument(vehicleDetails, vehicle_id);
        }

        if (vehicleData.driver_id) {

            const vehicleDriverMapDetails = {
                driver_id: vehicleData.driver_id,
                vehicle_id: vehicle_id,
                updated_by: user_id,
                created_by: user_id
            }

            const vehicleDriverMapResult = await vehicleService.assignDriver(vehicleDriverMapDetails)
        }

        if (vehicleData.route_id) {

            const vehicleRouteMapDetails = {
                route_id: vehicleData.route_id,
                vehicle_id: vehicle_id,
                updated_by: user_id,
                created_by: user_id
            }

            const vehicleRouteMapResult = await vehicleService.assignRoute(vehicleRouteMapDetails)
        }


        res.status(STATUS.OK).send({
            message: "Vehicle added successfully.",
            data: vehicleDetails.vehicle_id
        });


    } catch (error) {
        console.log(error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"VEHICLESERVC000", "error":"${ERRORCODE.VEHICLE.VEHICLESERVC000}"}`);
    }
});


router.get("/getVehicle/:vehicleID", async (req, res) => {
    try {
        const vehicleId = parseInt(req.params.vehicleID);
        const vehicleDetail = await vehicleService.getVehicleByID(vehicleId);
        const vehicleDocDetails = await vehicleService.getVehicleDocument(vehicleId)
        if(vehicleDocDetails){
        const presignedURL = await minioUtil.presignedGetObject(process.env.EDU_S3_BUCKET, vehicleDocDetails.registration_certificate, 300);
        vehicleDetail.document_url = presignedURL;
        vehicleDetail.registration_certificate = vehicleDocDetails.registration_certificate;
        }else{
            vehicleDetail.document_url = null;
            vehicleDetail.registration_certificate = null;
        }
        res.status(STATUS.OK).send(vehicleDetail);
        return;
    } catch (error) {
        console.log(error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"VEHICLESERVC000", "error":"${ERRORCODE.VEHICLE.VEHICLESERVC000}"}`);
    }
});

// UPDATE API


router.post("/update", async (req, res) => {
    try {
        const { user_id, school_id } = req.plainToken;
        const vehicleData = JSON.parse(`${req.body.vehicle_data}`)

        const docFile = req.files && req.files.registration_certificate ? req.files.registration_certificate : null
        const allowedFileTypes = ["IMAGE", "PDF", "SHEET","WORD"];
        const vehicleDetails = new vehicleModel.updatedVehicle(vehicleData);
        console.log("vehicleDEtail....", vehicleDetails);
        const { error } = vehicleModel.validateUpdateVehicle(vehicleDetails);

        if (error) {
            if (error.details)
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
            else return res.status(STATUS.BAD_REQUEST).send(error.message);
        }
        const vehicle_id = vehicleDetails.vehicle_id;
        const route_id = vehicleDetails.route_id;
        const driver_id = vehicleDetails.driver_id;
        vehicleDetails.updated_by = user_id;


        const isVehicleExist = await vehicleService.checkVehicleExistUpdate(vehicleDetails);
        console.log(isVehicleExist);

        if (isVehicleExist > 0) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"VEHICLESERVC001", "error":"${ERRORCODE.VEHICLE.VEHICLESERVC001}"}`);
        }

        await vehicleService.updateVehicle(vehicleDetails);

        if (docFile) {
            const vehicleDocPath = await commonService.getFileUploadPath(docFile, "registration-certificate", allowedFileTypes)
            const isVehicleDocExists = await vehicleService.checkVehicleDocExists(vehicle_id);
            if (isVehicleDocExists > 0) {
                const updateDocDetails = {
                    vehicle_id,
                    vehicle_plate_number: vehicleDetails.vehicle_plate_number ? vehicleDetails.vehicle_plate_number : null,
                    registration_certificate: vehicleDocPath,
                    updated_by: user_id
                }
                await vehicleService.updatedVehicleDocument(updateDocDetails)
            } else {
                const addDocDetails = {
                    vehicle_plate_number: vehicleDetails.vehicle_plate_number ? vehicleDetails.vehicle_plate_number : null,
                    registration_certificate: vehicleDocPath,
                    updated_by: user_id,
                    created_by: user_id
                }
                const addVehDocument = await vehicleService.addVehDocument(addDocDetails, vehicle_id);
            }
        }


        if (route_id) {

            const isRouteExist = await vehicleService.checkRouteExists(route_id, school_id)
            console.log('isRouteExist', isRouteExist);
            if (!isRouteExist) {
                return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"VEHICLESERVC003", "error":"${ERRORCODE.VEHICLE.VEHICLESERVC003}"}`);
            }


            const vehicleRouteMapDetails = {
                route_id: route_id,
                vehicle_id: vehicle_id,
                updated_by: user_id,
                created_by: user_id
            }
            await vehicleService.deleteExistingRoute(vehicle_id);
            await vehicleService.assignRoute(vehicleRouteMapDetails)

        }

        if (driver_id) {

            const isDriverExist = await vehicleService.checkDriverUserExists(driver_id, school_id)
            if (!isDriverExist) {
                return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"VEHICLESERVC002", "error":"${ERRORCODE.VEHICLE.VEHICLESERVC002}"}`);
            }

            const vehicleDriverMapDetails = {
                driver_id,
                vehicle_id,
                updated_by: user_id,
                created_by: user_id
            }

            await vehicleService.deleteExistingDriver(vehicle_id);
            await vehicleService.assignDriver(vehicleDriverMapDetails);

        }


        res.status(STATUS.OK).json({
            vehicle_id: vehicleDetails.vehicle_id,
            message: "vehicle update successful"
        });
        return;


    } catch (error) {
        console.error(error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"VEHICLESERVC000", "error":"${ERRORCODE.VEHICLE.VEHICLESERVC000}"}`);
    }
});


router.post("/getAll", async (req, res) => {
    try {

        const reqUserDetails = req.plainToken;
        const pageSize = req.body.page_size ? req.body.page_size : 50;
        const search = req.body.search ? req.body.search : null;
        let currentPage = req.body.current_page ? req.body.current_page : 0;
        currentPage = (currentPage == 1 || currentPage == 0) ? 0 : ((currentPage - 1) * pageSize);
        const school_id = reqUserDetails.school_id ? reqUserDetails.school_id : req.body.school_id;

        const reqParams = {
            pageSize,
            currentPage,
            school_id,
            search
        };

        const vehicleList = await vehicleService.getAllVehicles(reqParams);
        res.status(STATUS.OK).send(vehicleList);
        return;
    } catch (error) {
        logger.error(error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"VEHICLESERVC000", "error":"${ERRORCODE.VEHICLE.VEHICLESERVC000}"}`);
    }

});

router.post("/assignDriver", async (req, res) => {
    try {
        const reqVehicleDetail = req.plainToken
        const assignDriverDetails = new vehicleModel.assignDriver(req.body);

        const { error } = vehicleModel.validateAssignDriver(assignDriverDetails)
        if (error) {
            if (error.details)
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
            else return res.status(STATUS.BAD_REQUEST).send(error.message);
        }
        assignDriverDetails.created_by = reqVehicleDetail.user_id;
        assignDriverDetails.updated_by = reqVehicleDetail.user_id;

        assignDriverDetails.school_id = reqVehicleDetail.school_id;

        const isAssignDriverExist = await vehicleService.AssignDriverExist(assignDriverDetails.driver_id, assignDriverDetails.vehicle_id);

        const vehicleId = await vehicleService.checkVehicleIdExist(assignDriverDetails.vehicle_id);
        const driverId = await vehicleService.checkDriverIdExist(assignDriverDetails.driver_id);

        if (vehicleId == 0 || driverId == 0) {
            res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ASSIGNSERVC002", "error":"${ERRORCODE.ASSIGN.ASSIGNSERVC002}"}`);
        } else
            // const isAssignDriverExist = await vehicleService.AssignDriverExist(assignDriverDetails.driver_id, assignDriverDetails.vehicle_id);
            if (isAssignDriverExist > 0) {
                res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ASSIGNSERVC001", "error":"${ERRORCODE.ASSIGN.ASSIGNSERVC001}"}`);
            } else {
                const assignDriver = await vehicleService.assignDriver(assignDriverDetails);
                res.status(STATUS.OK).json(assignDriver);
            }
    } catch (error) {
        logger.error("catch error", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"ASSIGNSERVC000", "error":"${ERRORCODE.ASSIGN.ASSIGNSERVC000}"}`);
    }
});


module.exports = router;