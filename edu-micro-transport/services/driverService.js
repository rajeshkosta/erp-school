
const {
    db,
    pg,
    redis,
    logger,
    queryUtility,
    JSONUTIL,
} = require("edu-micro-common");
const { DRIVER_QUERIES, ASSIGN_QUERIES } = require("../constants/QUERY");
const { MAP_QUERIES } = require("../constants/QUERY");

const checkDriverExist = async (driverDetails) => {
    try {
        const _query = {
            text: DRIVER_QUERIES.checkDriverExist,
            values: [driverDetails.mobile_number,driverDetails.driving_licence, driverDetails.aadhaar_no]
        }

        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult[0].count;
    } catch (error) {
        throw error;
    }
}




const checkVehicleIdExist = async (vehicle_id) => {
    try {
        const _query = {
            text: MAP_QUERIES.ifVehicleExist,
            values: [vehicle_id]
        }

        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult[0].count;
    } catch (error) {
        throw error;
    }
}

const checkVehicleInVehTab = async (vehicle_id) => {
    try {
        const _query = {
            text: MAP_QUERIES.checkVehicleInVeh,
            values: [vehicle_id],
        };
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult[0].count;
    } catch (error) {
        throw error;
    }
}

const addDriver = async (driverDetails) => {
    try {
        const _query = {
            text: DRIVER_QUERIES.createDriver,
            values: [
                driverDetails.school_id,
                driverDetails.driver_name,
                driverDetails.dob,
                driverDetails.gender,
                driverDetails.mobile_number,
                driverDetails.driving_licence,
                driverDetails.aadhaar_no,
                driverDetails.alternate_number,
                driverDetails.address,
                driverDetails.updated_by,
                driverDetails.created_by
            ]
        };
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult;
    } catch (error) {
        throw error;
    }
}

const vehicleDriverMap = async (mapDetails, driver_id) => {
    try {
        const _query = {
            text: MAP_QUERIES.insertMapData,
            values: [
                mapDetails.vehicle_id,
                driver_id,
                mapDetails.updated_by,
                mapDetails.created_by
            ]
        };
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult;
    } catch (error) {
        throw error;
    }
}


const getDriverById = async (driver_id) => {
    try {
        const _query = {
            text: DRIVER_QUERIES.getDriverByID,
            values: [driver_id]
        };
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult;
    } catch (error) {
        throw error;
    }
}



const getAllDriver = async (reqParams) => {
    try {

        let key = `Driver`;
        let whereClause = ` WHERE status > 0`;
        let limitClause = ''
        let offsetClause = '';
        let data, count;
        let isCached = false;

        if (reqParams.school_id) {
            key += `|School:${reqParams.school_id}`;
            whereClause += ` AND school_id=${reqParams.school_id}`;
        }


        if (reqParams.pageSize) {
            key += `|Size:${reqParams.pageSize}`;
            limitClause = ` LIMIT ${reqParams.pageSize}`;
        }

        if (reqParams.currentPage) {
            key += `|Offset:${reqParams.currentPage}`;
            offsetClause += ` OFFSET ${reqParams.currentPage}`;
        }

        const cachedData = await redis.GetKeyRedis(key);
        const isDriverUpdated = await driverAddUpdateCheck(whereClause);
        isCached = (cachedData) && (isDriverUpdated == 0) ? true : false;

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

        const _query = JSONUTIL.replaceAll(DRIVER_QUERIES.getAllDriver, replaceObj);
        console.log(_query);

        count = await getAllDriverCount(whereClause);
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

const driverAddUpdateCheck = async (whereClause) => {
    try {
        whereClause += ` AND (date_created >= NOW() - INTERVAL '5 minutes' OR date_modified >= NOW() - INTERVAL '5 minutes')`;
        const query = DRIVER_QUERIES.getDriverCount.replace('#WHERE_CLAUSE#', whereClause);
        console.log(query);
        const queryResult = await pg.executeQueryPromise(query);
        return parseInt(queryResult[0].count);
    } catch (error) {
        throw error;
    }
}

const getAllDriverCount = async (whereClause) => {
    try {
        const _query = DRIVER_QUERIES.getDriverCount.replace('#WHERE_CLAUSE#', whereClause);
        console.log('Check Query');
        console.log(_query);
        const queryResult = await pg.executeQueryPromise(_query);
        return parseInt(queryResult[0].count);
    } catch (error) {
        throw new Error(error.message);
    }
}



const updateDriver = async (driverDetails) => {
    try {
        const driver_id = driverDetails.driver_id;
        delete driverDetails.driver_id;
        let setQuery = queryUtility.convertObjectIntoUpdateQuery(driverDetails);
        let updateQuery = `${DRIVER_QUERIES.updateDriver} ${setQuery} WHERE driver_id = $1`;
        const _query = {
            text: updateQuery,
            values: [driver_id]
        };
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult;
    } catch (error) {
        throw error
    }
}



module.exports = {
    checkDriverExist,
    addDriver,
    getAllDriver,
    getDriverById,
    updateDriver,
    vehicleDriverMap,
    checkVehicleIdExist,
    checkVehicleInVehTab
};