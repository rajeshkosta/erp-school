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

const createFeeConfig = async (feeconfigDetails) => {
  try {
    const _query = {
      text: QUERY.FEEC_ONFIG.createFeeConfig,
      values: [
        feeconfigDetails.academic_year_id,
        feeconfigDetails.student_admission_id,
        feeconfigDetails.total_amount,
        feeconfigDetails.class_id,
        feeconfigDetails.is_discount,
        feeconfigDetails.discount_amount,
        feeconfigDetails.discount_note,
        feeconfigDetails.status,
        feeconfigDetails.updated_by,
        feeconfigDetails.created_by
      ],
    };
    const queryResult = await pg.executeQueryPromise(_query);
    return queryResult;
  } catch (error) {
    throw error;
  }
};

const getFeeConfigByAcademicAndStudentIds = async ( academic_year_id, student_admission_id) => {
  try {
      const query = {
          text: QUERY.FEEC_ONFIG.getFeeConfigByAcademicAndStudentIds, 
          values: [academic_year_id, student_admission_id], 
      };

      const result = await pg.executeQueryPromise(query);
      return result[0].count;
  } catch (error) {
      throw error;
  }
};

const checkisFeeconfigDetailsExist = async (fees_config_id) => {
  try {
    const _query = {
      text: QUERY.FEEC_ONFIG.checkisFeeconfigDetailsExist,
      values: [fees_config_id],
    };

    console.log(_query);

    const queryResult = await pg.executeQueryPromise(_query);
    return queryResult[0].count;
  } catch (error) {
    throw error;
  }
};

const getAllFeeConfigs = async (reqParams) => {
  try {
    let key = `feeconfig-Data`;
    let whereClause = ` WHERE 1=1`;
    let limitClause = "";
    let offsetClause = "";
    let data, count;
    let isCached = false;

    if (reqParams.status) {
      key += `|Status:${reqParams.status}`;
      whereClause += ` AND status=${reqParams.status}`;
    }

    
    if (reqParams.academic_year_id) {
      key += `|AcademicYear:${reqParams.academic_year_id}`;
      whereClause += ` AND fc.academic_year_id=${reqParams.academic_year_id}`;
    }

    if (reqParams.class_id) {
      key += `|Class:${reqParams.class_id}`;
      whereClause += ` AND sa.class_id=${reqParams.class_id}`;
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
    const isfeeConfigUpdated = await feeconfigAddUpdateCheck(whereClause);

    isCached = cachedData && isfeeConfigUpdated == 0 ? true : false;

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

    const _query = JSONUTIL.replaceAll(QUERY.FEEC_ONFIG.getAllfeeconfigs, replaceObj);

    console.log(_query);
    count = await getAllfeeConfigsCount(whereClause);
    redis
      .SetRedis(`Count|${key}`, count, CONSTANT.CACHE_TTL.fee_config.LONG)
      .then()
      .catch((err) => console.log(err));
    data = await pg.executeQueryPromise(_query);
    redis
      .SetRedis(key, data,  CONSTANT.CACHE_TTL.fee_config.LONG)
      .then()
      .catch((err) => console.log(err));

    return { data, count };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getAllfeeConfigsCount = async (whereClause) => {
  try {

      const _query = QUERY.FEEC_ONFIG.getAllfeeConfigsCount.replace('#WHERE_CLAUSE#', whereClause);
      const queryResult = await pg.executeQueryPromise(_query);
      return parseInt(queryResult[0].count);

  } catch (error) {
      throw error;
  }
}

const feeconfigAddUpdateCheck = async (whereClause) => {
  try {
    whereClause += ` AND (fc.date_created >= NOW() - INTERVAL '5 minutes' OR fc.date_modified >= NOW() - INTERVAL '5 minutes')`;
    const _query = QUERY.FEEC_ONFIG.getAllFeesconfigCount.replace(
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

const updateFeeconfig = async (feeConfigDetails) => {
  try {
      const query = {
          text: QUERY.FEEC_ONFIG.updateFeeconfig,
          values: [
            feeConfigDetails.total_amount,
            feeConfigDetails.is_discount,
            feeConfigDetails.discount_amount,
            feeConfigDetails.discount_note,
            feeConfigDetails.status,
            feeConfigDetails.updated_by,
            feeConfigDetails.fees_config_id

           
          ],
      };

      const result = await pg.executeQueryPromise(query);

      return result;
  } catch (error) {
      console.error(`Error updating feeconfig: ${error}`);
      throw error;
  }
};


const createFeeConfigMapping = async (feeConfigMapping) => {
  try {
    const _query = {
      text: QUERY.FEEC_ONFIG.createFeeConfigMapping,
      values: [
        feeConfigMapping.fees_config_id,
        feeConfigMapping.fees_master_id,
        feeConfigMapping.amount,
        feeConfigMapping.status,
        feeConfigMapping.updated_by,
        feeConfigMapping.created_by
      ],
    };
    const queryResult = await pg.executeQueryPromise(_query);
    return queryResult;
  } catch (error) {
    throw error;
  }
};

const getFeeConfogDetailsByfeeConfigId = async (fees_config_id) => {
  try {
    const _query = {
      text: QUERY.FEEC_ONFIG.getSpecificFeeConfigDetails,
      values: [fees_config_id],
    };

    const queryResult = await pg.executeQueryPromise(_query);
    return queryResult && queryResult.length > 0 ? queryResult[0] : null;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteFeesConfigMapping = async (fess_config_id) => {
  try {

    const query = {
      text: QUERY.FEEC_ONFIG.deleteFeesConfigMapping,
      values: [fess_config_id],
    };
 
    const result = await pg.executeQueryPromise(query);
    return result;
  } catch (error) {
    logger.error(`Error getting fees master details: ${error}`);
    throw error;
  }
};

const getAllfeesConfig = async (fess_config_id) => {
  try {

    const query = {
      text: QUERY.FEEC_ONFIG.getAllfeesConfig,
      values: [fess_config_id],
    };
    console.log("query", query);
    const result = await pg.executeQueryPromise(query);
    return result;
  } catch (error) {
    logger.error(`Error getting fees master details: ${error}`);
    throw error;
  }
};

const getfeesConfig = async (academic_year_id,student_admission_id) => {
  try {

    const query = {
      text: QUERY.FEEC_ONFIG.getfeesConfig,
      values: [academic_year_id,student_admission_id],
    };
    console.log("query", query);
    const result = await pg.executeQueryPromise(query);
    return result;
  } catch (error) {
    logger.error(`Error getting fees master details: ${error}`);
    throw error;
  }
};

module.exports = {
  createFeeConfig,
  createFeeConfigMapping,
  getFeeConfogDetailsByfeeConfigId,
  getAllfeesConfig,
  getfeesConfig,
  getFeeConfigByAcademicAndStudentIds,
  checkisFeeconfigDetailsExist,
  updateFeeconfig,
  deleteFeesConfigMapping,
  getAllFeeConfigs,
  feeconfigAddUpdateCheck,
  getAllfeeConfigsCount
};