const {
  db,
  pg,
  redis,
  logger,
  queryUtility,
  JSONUTIL,
} = require("edu-micro-common");
const QUERY = require("../constants/QUERY");
const CONSTANT = require("../constants/CONST");
const ERRORCODE = require("../constants/ERRORCODE");
const moment = require("moment");
const { log } = require("util");

const checkTrustNameExist = async (trust_name) => {
  try {
    const _query = {
      text: QUERY.TRUST.checkTrustExist,
      values: [trust_name],
    };

    console.log(_query);

    const queryResult = await pg.executeQueryPromise(_query);
    return queryResult[0].count;
  } catch (error) {
    throw error;
  }
};

const createTrust = async (trustDetails) => {
  console.log(trustDetails);
  try {
    const _query = {
      text: QUERY.TRUST.createTrust,
      values: [
        trustDetails.trust_name,
        trustDetails.contact_no,
        trustDetails.email,
        trustDetails.address,
        trustDetails.status,
        trustDetails.logo_url,
        trustDetails.created_by,
        trustDetails.updated_by,
      ],
    };

    console.log(_query);
    const queryResult = await pg.executeQueryPromise(_query);
    redis.deleteKey("Trust-Data|Size:20|Offset:0");
    redis.deleteKey("Count|Trust-Data|Size:20|Offset:0");
    return queryResult;
  } catch (error) {
    throw error;
  }
};

const updateTrust = async (trustDetails) => {
  try {
    let trust_id = trustDetails.trust_id;
    delete trustDetails.trust_id;
    let setQuery = queryUtility.convertObjectIntoUpdateQuery(trustDetails);
    let updateQuery = `${QUERY.TRUST.updateTrust} ${setQuery} WHERE trust_id = $1`;

    console.log(updateQuery);

    const _query = {
      text: updateQuery,
      values: [trust_id]
    };
    const queryResult = await pg.executeQueryPromise(_query);
    redis.deleteKey("Trust-Data|Size:20|Offset:0");
    redis.deleteKey("Count|Trust-Data|Size:20|Offset:0");
    return queryResult;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


const getSpecificTrustDetails = async (trust_id) => {
  try {
    const _query = {
      text: QUERY.TRUST.getSpecificTrustDetails,
      values: [trust_id],
    };

    const queryResult = await pg.executeQueryPromise(_query);
    return queryResult && queryResult.length > 0 ? queryResult[0] : null;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getAllTrusts = async (reqParams) => {
  try {
    let key = `Trust-Data`;
    let whereClause = ` WHERE trust_id > 0`;
    let limitClause = "";
    let offsetClause = "";
    let data, count;
    let isCached = false;

    if (reqParams.status) {
      key += `|Status:${reqParams.status}`;
      whereClause += ` AND status=${reqParams.status}`;
    }

    if (reqParams.pageSize) {
      key += `|Size:${reqParams.pageSize}`;
      limitClause = ` LIMIT ${reqParams.pageSize}`;
    }

    if (reqParams.currentPage >= 0) {
      key += `|Offset:${reqParams.currentPage}`;
      offsetClause += ` OFFSET ${reqParams.currentPage}`;
    }

    const cachedData = await redis.GetKeyRedis(key);
    const isTrustUpdated = await trustAddUpdateCheck(whereClause);

    isCached = cachedData && isTrustUpdated == 0 ? true : false;

    if (isCached) {
      data = JSON.parse(cachedData);
      const cachedCount = await redis.GetKeyRedis(`Count|${key}`);
      console.log("cachedCount",cachedCount);
      count = parseInt(JSON.parse(cachedCount));
      return { data, count };
    }

    const replaceObj = {
      "#WHERE_CLAUSE#": whereClause,
      "#LIMIT_CLAUSE#": limitClause,
      "#OFFSET_CLAUSE#": offsetClause,
    };
    console.log(replaceObj);

    const _query = JSONUTIL.replaceAll(QUERY.TRUST.getAllTrusts, replaceObj);

    console.log(_query);
    count = await getAllTrustsCount(whereClause);
    redis
      .SetRedis(`Count|${key}`, count, CONSTANT.CACHE_TTL.trust.LONG)
      .then()
      .catch((err) => console.log(err));
    data = await pg.executeQueryPromise(_query);
    redis
      .SetRedis(key, data, CONSTANT.CACHE_TTL.trust.LONG)
      .then()
      .catch((err) => console.log(err));

    return { data, count };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const trustList = async (reqParams) => {
  try {
      
      const _query = `${QUERY.TRUST.trustList}`;

      const data = await pg.executeQueryPromise(_query);

      return data;
  } catch (error) {
      console.log(error);
      throw error;
  }
};
const trustAddUpdateCheck = async (whereClause) => {
  try {
    whereClause += ` AND (date_created >= NOW() - INTERVAL '5 minutes' OR date_modified >= NOW() - INTERVAL '5 minutes')`;
    const _query = QUERY.TRUST.getAllTrustsCount.replace(
      "#WHERE_CLAUSE#",
      whereClause
    );
    console.log(_query);
    const queryResult = await pg.executeQueryPromise(_query);
    return parseInt(queryResult[0].count);
  } catch (error) {
    throw error;
  }
};

const getAllTrustsCount = async (whereClause) => {
    try {

        const _query = QUERY.TRUST.getAllTrustsCount.replace('#WHERE_CLAUSE#', whereClause);
        const queryResult = await pg.executeQueryPromise(_query);
        return parseInt(queryResult[0].count);

    } catch (error) {
        throw error;
    }
}

const updateTrustLogo = async (path, reqUser) => {
  try {
    const _query = {
      text: QUERY.TRUST.updateTrustLogo,
      values: [
        path,
        reqUser.user_id,
        reqUser.trust_id
      ],
    };
    const queryResult = await pg.executeQueryPromise(_query);
    return queryResult;
  } catch (error) {
    throw error;
  }
}
module.exports = {
  checkTrustNameExist,
  createTrust,
  getAllTrusts,
  getSpecificTrustDetails,
  getAllTrustsCount,
  trustAddUpdateCheck,
  trustList,
  updateTrust,
  updateTrustLogo
};
