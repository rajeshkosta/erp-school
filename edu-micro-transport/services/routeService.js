const { pg, ERRORCODE, logger ,queryUtility,JSONUTIL, CONST} = require("edu-micro-common");
const QUERY = require('../constants/QUERY');

const getRouteByRouteNumber = async (route_no,school_id) => {
    try {
        const query = {
            text: QUERY.ROUTE_QUERIES.checkIfExist,
            values: [route_no,school_id],
        };

        const result = await pg.executeQueryPromise(query);
        return result[0].count;
    } catch (error) {
        throw error;
    }
};

const addroute = async (routeDetails) => {

    try {
        routeDetails.total_stops = routeDetails.stops_list.length;
        const query = {
            text: QUERY.ROUTE_QUERIES.insertRouteQuery,
            values: [
                routeDetails.route_no,
                routeDetails.starting_point,
                routeDetails.ending_point,
                routeDetails.total_stops,
                routeDetails.distance,
                routeDetails.estimated_travel_time,
                routeDetails.status,
                routeDetails.school_id,
                routeDetails.created_by,
                routeDetails.updated_by
            ],
        };

        const result = await pg.executeQueryPromise(query);

        console.log("result",result);
    
        return result[0];
        

    } catch (error) {
        logger.error(`Error adding route: ${error}`);
        throw error;
    }
};

const createRouteMapping = async (routeMapping) => {
    try {
      const _query = {
        text: QUERY.ROUTE_QUERIES.createRouteMapping,
        values: [
          routeMapping.route_id,
          routeMapping.stop_name,
          routeMapping.lattitude,
          routeMapping.longitude,
          routeMapping.status,
          routeMapping.updated_by,
          routeMapping.created_by
        ],
      };
      const queryResult = await pg.executeQueryPromise(_query);
      return queryResult;
    } catch (error) {
      throw error;
    }
  };

const checkIfRouteIdExist=async(routeDetails)=>{

    try {
        const query = {
            text: QUERY.ROUTE_QUERIES.checkIfRouteIdExist,
            values: [routeDetails.route_id],
        };

        const result = await pg.executeQueryPromise(query);
        return result[0].count;
    } catch (error) {
        throw error;
    }

}

const checkIfStopsExist=async(stop_name,route_id)=>{

    try {
        const query = {
            text: QUERY.ROUTE_QUERIES.checkIfStopsExist,
            values: [stop_name,route_id],
        };

        const result = await pg.executeQueryPromise(query);
        return result[0].count;
    } catch (error) {
        throw error;
    }

}

const updateRoute = async (routeDetails) => {
    try {
        routeDetails.total_stops = routeDetails.stops_list.length;
        const query = {
            text: QUERY.ROUTE_QUERIES.updateRoute,
            values: [
                routeDetails.starting_point,
                routeDetails.ending_point,
                routeDetails.total_stops,
                routeDetails.status,
                routeDetails.updated_by,
                routeDetails.route_id
             
            ],
        };
  
        const result = await pg.executeQueryPromise(query);
  
        return result;
    } catch (error) {
        console.error(`Error updating feeconfig: ${error}`);
        throw error;
    }
  };

  const deleterouteMapping = async (route_id) => {
    try {
  
      const query = {
        text: QUERY.ROUTE_QUERIES.deleterouteMapping,
        values: [route_id],
      };
   
      const result = await pg.executeQueryPromise(query);
      return result;
    } catch (error) {
      logger.error(`Error getting in route: ${error}`);
      throw error;
    }
  };

  const getAllRoutes = async (reqParams) => {
    try {

        let key = `Route`;
        let whereClause = ` WHERE status > 0`;
        let limitClause = ''
        let offsetClause = '';
        let data, count;
        let isCached = false;

        if (reqParams.school_id) {
            key += `|School:${reqParams.school_id}`;
            whereClause += ` AND school_id=${reqParams.school_id}`;
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

        const replaceObj = {
            '#WHERE_CLAUSE#': whereClause,
            '#LIMIT_CLAUSE#': limitClause,
            '#OFFSET_CLAUSE#': offsetClause
        };

        const _query = JSONUTIL.replaceAll(QUERY.ROUTE_QUERIES.getAllRoutes, replaceObj);
        console.log(_query);

        count = await getAllRouteCount(whereClause);
        data = await pg.executeQueryPromise(_query);

        return { data, count };


    } catch (error) {
        throw error;
    }
}

const vehicleAddUpdateCheck = async (whereClause) => {
    try {
        whereClause += ` AND (date_created >= NOW() - INTERVAL '5 minutes' OR date_modified >= NOW() - INTERVAL '5 minutes')`;
        const query = QUERY.ROUTE_QUERIES.getAllRouteCount.replace('#WHERE_CLAUSE#', whereClause);
        console.log(query);
        const queryResult = await pg.executeQueryPromise(query);
        return parseInt(queryResult[0].count);
    } catch (error) {
        throw error;
    }
}

const getAllRouteCount = async (whereClause) => {
    try {
        const _query = QUERY.ROUTE_QUERIES.getAllRouteCount.replace('#WHERE_CLAUSE#', whereClause);
        console.log('Check Query');
        console.log(_query);
        const queryResult = await pg.executeQueryPromise(_query);
        return parseInt(queryResult[0].count);
    } catch (error) {
        throw new Error(error.message);
    }
}

const getRouteByID = async (route_id) => {
    try {
        const routeQuery = {
            text: QUERY.ROUTE_QUERIES.getRouteByID,
            values: [route_id],
        };

        const stopsQuery = {
            text: QUERY.ROUTE_QUERIES.getStopsByRouteID,
            values: [route_id],
        };
        
        const [routeResult, stopsResult] = await Promise.all([
            pg.executeQueryPromise(routeQuery),
            pg.executeQueryPromise(stopsQuery),
        ]);

        console.log('Route Result:', routeResult);
        console.log('Stops Result:', stopsResult);

          const routeDetail = {
              route: routeResult,
              stops: stopsResult
          };
  
          return routeDetail;
    } catch (error) {
        throw error;
    }
};



module.exports = {
    getRouteByRouteNumber,
    addroute,
    checkIfRouteIdExist,
    updateRoute,
    checkIfStopsExist,
    createRouteMapping,
    deleterouteMapping,
    getAllRoutes,
    getRouteByID
  };