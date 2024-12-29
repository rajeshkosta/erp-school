const express = require('express');
const fileUpload = require("express-fileupload");
const router = express.Router();
const bodyParser = require("body-parser");
const ERRORCODE = require('../constants/ERRRORCODE');
const { STATUS, logger, DB_STATUS,CONST, JSONUTIL, redis } = require("edu-micro-common");
const PAGESIZE = require('../constants/CONST');
const routeModel = require('../models/routeModel');
const routeService = require('../services/routeService')
const { FEE } = require('../constants/QUERY');
//POST route
router.post("/create", async (req, res) => {
    try {
        
        const reqUserDetails = req.plainToken;
        const routeDetails = new routeModel.route(req.body);
        routeDetails.created_by = reqUserDetails.user_id;
        routeDetails.updated_by = reqUserDetails.user_id;
        routeDetails.school_id = reqUserDetails.school_id;
        
        if (routeDetails.starting_point === routeDetails.ending_point) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ROUTESERV004", "error":"${ERRORCODE.ROUTE.ROUTESERV004}"}`);
        }

        const stopNames = new Set();
        for (const stop of routeDetails.stops_list) {
            console.log("Current Stop:", stop.stop_name);
            console.log("Current stopNames Set:", stopNames);
            
            if (stopNames.has(stop.stop_name)) {
                console.log("Duplicate Stop Detected:", stop.stop_name);
                return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ROUTESERV003", "error":"${ERRORCODE.ROUTE.ROUTESERV003}"}`);
            }
            stopNames.add(stop.stop_name);
        }

        const existingRoute = await routeService.getRouteByRouteNumber(routeDetails.route_no, reqUserDetails.school_id);
        if (existingRoute > 0 ) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ROUTESERV001", "error":"${ERRORCODE.ROUTE.ROUTESERV001}"}`);
        }
        const { error } = routeModel.validateroute(routeDetails)

        if (error) {
            if (error.details)
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
            else return res.status(STATUS.BAD_REQUEST).send(error.message);
        }

        if (!reqUserDetails.school_id) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ROUTESERV000", "error":"${ERRORCODE.ROUTE.ROUTESERV000}"}`);
        }


        const createRouteResult = await routeService.addroute(routeDetails);
        let route_id = createRouteResult.route_id;
        for (const routeStopsMapping of routeDetails.stops_list){
            let routeMapping = routeStopsMapping;
            routeMapping.route_id = route_id;
            routeMapping.created_by = reqUserDetails.user_id;
            routeMapping.updated_by = reqUserDetails.user_id;
            routeMapping.status = DB_STATUS.STATUS_MASTER.ACTIVE;
            await routeService.createRouteMapping(routeMapping);
        }


        return res.status(STATUS.CREATED).json({ message: 'route created successfully' });
    } catch (error) {
        logger.error(`Error adding route: ${error}`);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"ROUTESERV000", "error":"${ERRORCODE.ROUTE.ROUTESERV000}"}`);
    }
});

router.post("/getAllRoutes", async (req, res) => {
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

        const routeList = await routeService.getAllRoutes(reqParams);
        res.status(STATUS.OK).send(routeList);
        return;
    } catch (error) {
        logger.error( error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"ROUTESERV000", "error":"${ERRORCODE.ROUTE.ROUTESERV000}"}`);
    }

});

//UPDATE route
router.post("/update", async (req, res) => {
    try {
        const reqUserDetails = req.plainToken;
        const routeDetails = new routeModel.Updateroute(req.body);
        routeDetails.updated_by = reqUserDetails.user_id;
        const stopsList = routeDetails.stops_list;
        if (routeDetails.starting_point === routeDetails.ending_point) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ROUTESERV004", "error":"${ERRORCODE.ROUTE.ROUTESERV004}"}`);
        }

        const stopNames = new Set();
        for (const stop of routeDetails.stops_list) {
            console.log("Current Stop:", stop.stop_name);
            console.log("Current stopNames Set:", stopNames);
            
            if (stopNames.has(stop.stop_name)) {
                console.log("Duplicate Stop Detected:", stop.stop_name);
                return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ROUTESERV003", "error":"${ERRORCODE.ROUTE.ROUTESERV003}"}`);
            }
            stopNames.add(stop.stop_name);
        }
        const { error } = routeModel.validateUpdateroute(routeDetails);

        if (error) {
            if (error.details)
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
            else return res.status(STATUS.BAD_REQUEST).send(error.message);
        }



        const checkRouteIdExists = await routeService.checkIfRouteIdExist(routeDetails);

        console.log('checkRouteIdExists--',checkRouteIdExists)

        if (checkRouteIdExists==0) {
            return res.status(STATUS.BAD_REQUEST).send(

                {
                    errorCode: "ROUTESERV002",
                    error:  ERRORCODE.ROUTE.ROUTESERV002
                }

            );
        }

        await routeService.updateRoute(routeDetails);

       await routeService.deleterouteMapping(routeDetails.route_id);
        for (const routeStopsMapping of routeDetails.stops_list){
            let routeMapping = routeStopsMapping;
            routeMapping.route_id = routeDetails.route_id;
            routeMapping.updated_by = reqUserDetails.user_id;
            routeMapping.status = DB_STATUS.STATUS_MASTER.ACTIVE;
            await routeService.createRouteMapping(routeMapping);
        }
        res.status(STATUS.OK).json({
            route_id: routeDetails.route_id,
            message: 'route Updated Successfully'
        });
        return;

    } catch (error) {
        logger.error( error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"ROUTESERV000", "error":"${ERRORCODE.ROUTE.ROUTESERV000}"}`);
    }

});

router.get("/getRoutedetail/:routeID", async (req, res) => {
    try {
        const routeId = parseInt(req.params.routeID);
        const routeDetail = await routeService.getRouteByID(routeId);
        res.status(STATUS.OK).json(routeDetail);
        return;
    } catch (error){
        logger.error("catch error", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"ROUTESERV000", "error":"${ERRORCODE.ROUTE.ROUTESERV000}"}`);
    }
});

module.exports = router;