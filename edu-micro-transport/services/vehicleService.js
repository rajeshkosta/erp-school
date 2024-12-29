const { pg, redis, queryUtility, JSONUTIL } = require("edu-micro-common");
const { VEHICLE_QUERIES } = require("../constants/QUERY");
const { ASSIGN_QUERIES } = require("../constants/QUERY");

const addVehicle = async (vehicleDetails) => {
    try {
        const _query = {
            text: VEHICLE_QUERIES.createVehicle,
            values: [
                vehicleDetails.school_id,
                vehicleDetails.vehicle_code,
                vehicleDetails.vehicle_plate_number,
                vehicleDetails.vehicle_reg_number,
                vehicleDetails.chasis_number,
                vehicleDetails.vehicle_model,
                vehicleDetails.year_made,
                vehicleDetails.vehicle_type,
                vehicleDetails.capacity,
                vehicleDetails.updated_by,
                vehicleDetails.created_by
            ],
        };

        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult;
    } catch (error) {
        throw error;
    }
}

const addVehDocument = async (vehicleDetails, vehicle_id) => {
    try {
        const _query = {
            text: VEHICLE_QUERIES.addVehDocument,
            values: [
                vehicle_id,
                vehicleDetails.vehicle_plate_number,
                vehicleDetails.registration_certificate,
                vehicleDetails.updated_by,
                vehicleDetails.created_by
            ]
        };
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult;
    } catch (error) {
        throw error;
    }
}

const updatedVehicleDocument = async (vehicleDocDetails) => {
    try {

        const _query = {
            text: VEHICLE_QUERIES.updateVehicleDocument,
            values: [
                vehicleDocDetails.vehicle_id,
                vehicleDocDetails.vehicle_plate_number,
                vehicleDocDetails.registration_certificate,
                vehicleDocDetails.updated_by,
            ]
        }
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult;
    } catch (error) {
        throw error;
    }
}

const checkVehicleExist = async (vehicleDetails) => {
    try {
        const _query = {
            text: VEHICLE_QUERIES.checkVehicleExist,
            values: [vehicleDetails.vehicle_code, vehicleDetails.vehicle_plate_number, vehicleDetails.chasis_number,vehicleDetails.school_id],
        };

        console.log(_query);
        const queryResult = await pg.executeQueryPromise(_query);
        return parseInt(queryResult[0].count);
    } catch (error) {
        throw error;
    }
}

const checkVehicleExistUpdate = async (vehicleDetails) => {
    try {
        const _query = {
            text: VEHICLE_QUERIES.checkVehicleExistUpdate,
            values: [vehicleDetails.vehicle_code, vehicleDetails.vehicle_plate_number, vehicleDetails.chasis_number, vehicleDetails.school_id],
        };

        console.log(_query);
        const queryResult = await pg.executeQueryPromise(_query);
        return parseInt(queryResult[0].count);
    } catch (error) {
        throw error;
    }
}


const checkVehicleDocExists = async (vehicle_id) => {
    try {
        const _query = {
            text: VEHICLE_QUERIES.checkVehicleDocExists,
            values: [vehicle_id],
        };

        console.log(_query);
        const queryResult = await pg.executeQueryPromise(_query);
        return parseInt(queryResult[0].count);
    } catch (error) {
        throw error;
    }
}

const checkDriverUserExists = async (driver_id, school_id) => {
    try {
        const _query = {
            text: VEHICLE_QUERIES.checkDriverUserExists,
            values: [driver_id, school_id],
        };
        const queryResult = await pg.executeQueryPromise(_query);
        return parseInt(queryResult[0].count);
    } catch (error) {
        throw error;
    }
}


const checkRouteExists = async (route_id, school_id) => {
    try {
        const _query = {
            text: VEHICLE_QUERIES.checkRouteExists,
            values: [route_id, school_id],
        };

        console.log(_query);
        const queryResult = await pg.executeQueryPromise(_query);
        return parseInt(queryResult[0].count);
    } catch (error) {
        throw error;
    }
}



const getVehicleByID = async (vehicle_id) => {
    try {
        const _query = {
            text: VEHICLE_QUERIES.getVehicleByID,
            values: [vehicle_id],
        };
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult[0];
    } catch (error) {
        throw error;
    }
}

const updateVehicle = async (vehicleDetails) => {
    try {
        const vehicle_id = vehicleDetails.vehicle_id;
        delete vehicleDetails.vehicle_id;
        delete vehicleDetails.driver_id;
        delete vehicleDetails.route_id;

        let setQuery = queryUtility.convertObjectIntoUpdateQuery(vehicleDetails);
        let updateQuery = `${VEHICLE_QUERIES.updateVehicle} ${setQuery} WHERE vehicle_id = $1`;
        const _query = {
            text: updateQuery,
            values: [vehicle_id]
        };

        console.log(_query);
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult;
    } catch (error) {
        console.log(error);
        throw error;
    }

}


const getAllVehicles = async (reqParams) => {
    try {

        let key = `Vehicle`;
        let whereClause = ` WHERE V.status > 0`;
        let limitClause = ''
        let offsetClause = '';
        let data, count;
        let isCached = false;

        if (reqParams.school_id) {
            key += `|School:${reqParams.school_id}`;
            whereClause += ` AND V.school_id=${reqParams.school_id}`;
        }

        // if (reqParams.search) {
        //     key += `|Search:${reqParams.search}`;
        //     whereClause += ` AND class ilike '%${reqParams.search}%'`;
        // }

        if (reqParams.pageSize) {
            key += `|Size:${reqParams.pageSize}`;
            limitClause = ` LIMIT ${reqParams.pageSize}`;
        }

        if (reqParams.currentPage) {
            key += `|Offset:${reqParams.currentPage}`;
            offsetClause += ` OFFSET ${reqParams.currentPage}`;
        }

        const cachedData = await redis.GetKeyRedis(key);
        const isVehicleUpdated = await vehicleAddUpdateCheck(whereClause);
        isCached = (cachedData) && (isVehicleUpdated == 0) ? true : false;

        if (isCached) {
            data = JSON.parse(cachedData);
            const cachedCount = await redis.GetKeyRedis(`Count|${key}`);
            count = parseInt(JSON.parse(cachedCount));
            return { data, count };
        }

        const replaceObj = {
            '#WHERE_CLAUSE#': whereClause,
            '#LIMIT_CLAUSE#': limitClause,
            '#OFFSET_CLAUSE#': offsetClause
        };

        const _query = JSONUTIL.replaceAll(VEHICLE_QUERIES.getAllVehicles, replaceObj);
        console.log(_query);

        count = await getAllVehicleCount(whereClause);
        data = await pg.executeQueryPromise(_query);
        if (data.length > 0) {
            redis.SetRedis(`Count|${key}`, count, 10 * 60).then().catch(err => console.log(err));
            redis.SetRedis(key, data, 10 * 60).then().catch(err => console.log(err));
        }

        return { data, count };


    } catch (error) {
        throw error;
    }
}

const vehicleAddUpdateCheck = async (whereClause) => {
    try {
        whereClause += ` AND (V.date_created >= NOW() - INTERVAL '5 minutes' OR V.date_modified >= NOW() - INTERVAL '5 minutes')`;
        const query = VEHICLE_QUERIES.getVehicleCount.replace('#WHERE_CLAUSE#', whereClause);
        console.log(query);
        const queryResult = await pg.executeQueryPromise(query);
        return parseInt(queryResult[0].count);
    } catch (error) {
        throw error;
    }
}

const getAllVehicleCount = async (whereClause) => {
    try {
        const _query = VEHICLE_QUERIES.getVehicleCount.replace('#WHERE_CLAUSE#', whereClause);
        console.log('Check Query');
        console.log(_query);
        const queryResult = await pg.executeQueryPromise(_query);
        return parseInt(queryResult[0].count);
    } catch (error) {
        throw new Error(error.message);
    }
}


const assignDriver = async (vehicleDetails) => {
    try {
        const _query = {
            text: ASSIGN_QUERIES.insertAssignDriver,
            values: [
                vehicleDetails.driver_id,
                vehicleDetails.vehicle_id,
                vehicleDetails.updated_by,
                vehicleDetails.created_by
            ],
        };

        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult;
    } catch (error) {
        throw error;
    }
}


const assignRoute = async (routeDetails) => {
    try {
        const _query = {
            text: VEHICLE_QUERIES.insertVehicleRouteMapping,
            values: [
                routeDetails.route_id,
                routeDetails.vehicle_id,
                routeDetails.updated_by,
                routeDetails.created_by
            ]
        };

        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult;
    } catch (error) {
        throw error;
    }
}


const deleteExistingRoute = async (vehicle_id) => {
    try {

        const _query = {
            text: VEHICLE_QUERIES.deleteExistingRoute,
            values: [vehicle_id]
        };

        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult;

    } catch (error) {
        throw error;
    }
}



const deleteExistingDriver = async (vehicle_id) => {
    try {

        const _query = {
            text: VEHICLE_QUERIES.deleteExistingDriver,
            values: [vehicle_id]
        };

        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult;

    } catch (error) {
        throw error;
    }
}

const AssignDriverExist = async (driver_id, vehicle_id) => {
    try {
        const _query = {
            text: ASSIGN_QUERIES.assignDriverExist,
            values: [driver_id, vehicle_id],
        };
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult[0].count;
    } catch (error) {
        throw error;
    }
}

const checkVehicleIdExist = async (vehicle_id) => {
    try {
        const _query = {
            text: ASSIGN_QUERIES.checkVehicleId,
            values: [vehicle_id],
        };
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult[0].count;
    } catch (error) {
        throw error;
    }
}
const checkDriverIdExist = async (driver_id) => {
    try {
        const _query = {
            text: ASSIGN_QUERIES.checkDriverId,
            values: [driver_id],
        };
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult[0].count;
    } catch (error) {
        throw error;
    }
}


const getVehicleDocument = async (vehicle_id) => {
    try {

        const _query = {
            text: VEHICLE_QUERIES.getVehicleDocument,
            values: [vehicle_id]
        };

        const queryResult = await pg.executeQueryPromise(_query);

        if (queryResult.length == 0) {
            return null;
        }

        const vehicleDocument = queryResult[0];
        return vehicleDocument;

    } catch (error) {
        throw error;
    }
}




module.exports = {
    addVehicle,
    checkVehicleExist,
    getAllVehicles,
    getVehicleByID,
    updateVehicle,
    assignDriver,
    AssignDriverExist,
    checkVehicleIdExist,
    checkDriverIdExist,
    addVehDocument,
    checkDriverUserExists,
    checkRouteExists,
    assignRoute,
    getVehicleDocument,
    checkVehicleExistUpdate,
    checkVehicleDocExists,
    updatedVehicleDocument,
    deleteExistingRoute,
    deleteExistingDriver
};