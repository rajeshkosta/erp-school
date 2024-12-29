const { pg, CONST, redis, JSONUTIL } = require("edu-micro-common");
const { USER: USER_QUERY } = require('../constants/QUERY');


const getUserList = async (reqParams) => {
    try {

        let key = `UserList`;
        let whereClause = ` WHERE 1=1 `;
        let limitClause = ''
        let offsetClause = '';
        let data, count;
        let isCached = false;

        if (reqParams.school_id) {
            key += `|School:${reqParams.school_id}`;
            whereClause += ` AND school_id=${reqParams.school_id}`;
        }

        if (reqParams.role_id) {
            key += `|Role:${reqParams.role_id}`;
            whereClause += ` AND role_id=${reqParams.role_id}`;
        }

        if (reqParams.level) {
            key += `|Level:${reqParams.level}`;
            whereClause += ` AND user_level ILIKE '${reqParams.level}'`;
        }

        if (reqParams.search && reqParams.search.length > 2) {
            if (isNaN(reqParams.search)) {
                whereClause += ` AND display_name ILIKE '%${reqParams.search}%'`;
            } else {
                whereClause += ` AND mobile_number=${reqParams.search}`;
            }

            key += `|Search:${reqParams.search}`;
        }

        if (reqParams.pageSize) {
            key += `|Size:${reqParams.pageSize}`;
            limitClause = ` LIMIT ${reqParams.pageSize}`;
        }

        if (reqParams.currentPage) {
            key += `|Offset:${reqParams.currentPage}`;
            offsetClause += ` OFFSET ${reqParams.currentPage}`;
        }

        console.log(key);

        const cachedData = await redis.GetKeyRedis(key);
        const isUserUpdated = await userAddUpdateCheck(whereClause);
        isCached = (cachedData) && (isUserUpdated == 0) ? true : false;

        //whereClause += ` AND U.is_deleted != 1`;

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

        const _query = JSONUTIL.replaceAll(USER_QUERY.getAllUsers, replaceObj);

        console.log("------------------");
        console.log(_query);

        count = await getAllUserCount(whereClause);
        data = await pg.executeQueryPromise(_query);

        if (count > 0) {
            redis.SetRedis(`Count|${key}`, count, 10 * 60).then().catch(err => console.log(err));
            redis.SetRedis(key, data, 10 * 60).then().catch(err => console.log(err));
        }


        return { data, count };

    } catch (error) {
        throw error;
    }
}

const userAddUpdateCheck = async (whereClause) => {

    try {

        whereClause += ` AND (date_created >= NOW() - INTERVAL '5 minutes' OR date_modified >= NOW() - INTERVAL '5 minutes')`;

        const _query = USER_QUERY.getUserCount.replace('#WHERE_CLAUSE#', whereClause);
        console.log('Check Query');
        console.log(_query);
        const queryResult = await pg.executeQueryPromise(_query);
        return parseInt(queryResult[0].count);

    } catch (error) {
        throw error;
    }

}

const getAllUserCount = async (whereClause) => {
    try {

        const _query = USER_QUERY.getUserCount.replace('#WHERE_CLAUSE#', whereClause);
        console.log('Check Query');
        console.log(_query);
        const queryResult = await pg.executeQueryPromise(_query);
        return parseInt(queryResult[0].count);

    } catch (error) {
        throw new Error(error.message);
    }
}

const getUsersByRole = async (schoolId, roleID) => {
    try {
        let _query = {
          text: USER_QUERY.getUsersByRole,
          values: [schoolId, roleID]
        };
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult;
      } catch (error) {
        throw new Error(error.message);
      }
}



module.exports = {
    getUserList, getUsersByRole
};
