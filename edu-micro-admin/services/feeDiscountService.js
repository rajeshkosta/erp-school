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

  const checkfeeDiscountExist = async (school_id,fees_discounts) => {
    try {
      const _query = {
        text: QUERY.FEEDISCOUNT.checkfeeDiscountExist,
        values: [school_id,fees_discounts.fees_discount_name],
        
      };
  
      console.log("_query-----",_query);
  
      const queryResult = await pg.executeQueryPromise(_query);
      return queryResult[0].count;
    } catch (error) {
      throw error;
    }
  };

  const createFeeDiscount = async (feeDiscountDetails) => {
    console.log('feeDiscountDetails------',feeDiscountDetails);
    try {
      const _query = {
        text: QUERY.FEEDISCOUNT.createFeeDiscount,
        values: [
            feeDiscountDetails.school_id,
            feeDiscountDetails.fees_discount_name,
            feeDiscountDetails.discount,
            feeDiscountDetails.status,
            feeDiscountDetails.updated_by,
            feeDiscountDetails.created_by,
        ],
      };
  
      console.log('_query-----',_query);
      const queryResult = await pg.executeQueryPromise(_query);
      return queryResult;
    } catch (error) {
      throw error;
    }
  };

  const checkIfExistbyID = async ( fees_discount_id) => {
    try {
        const query = {
            text: QUERY.FEEDISCOUNT.checkIfExistbyId, 
            values: [fees_discount_id], 
        };

        const result = await pg.executeQueryPromise(query);
        return result[0].count;
    } catch (error) {
        throw error;
    }
};

updateFeeDiscountDetails = async (feeDiscountDetails) => {
    try {

        console.log('feeDiscountDetails--',feeDiscountDetails)
      let fees_discount_id = feeDiscountDetails.fees_discount_id;
      delete feeDiscountDetails.fees_discount_id;
      let setQuery = queryUtility.convertObjectIntoUpdateQuery(feeDiscountDetails);
      let updateQuery = `${QUERY.FEEDISCOUNT.updateFeeMasterDetails} ${setQuery} WHERE fees_discount_id = $1`;
  
      console.log(updateQuery);
  
      const _query = {
        text: updateQuery,
        values: [fees_discount_id]
      };
      console.log('_query---',_query)
      const queryResult = await pg.executeQueryPromise(_query);
      return queryResult;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const getAllfeediscount = async (schoolId) => {
    try {

        const query = {
            text: QUERY.FEEDISCOUNT.getAllfeediscount,
            values: [schoolId],
        };
        const result = await pg.executeQueryPromise(query);
        return result;
    } catch (error) {
        logger.error(`Error getting fee discount details: ${error}`);
        throw error;
    }
};

const getFeediscountById = async (fees_discount_id) => {
    try {

        const query = {
            text: QUERY.FEEDISCOUNT.getFeediscountById,
            values: [fees_discount_id],
        };
        const result = await pg.executeQueryPromise(query);
        return result;
    } catch (error) {
        logger.error(`Error getting fees details: ${error}`);
        throw error;
    }
};

  module.exports = {
    checkfeeDiscountExist,
    createFeeDiscount,
    checkIfExistbyID,
    updateFeeDiscountDetails,
    getAllfeediscount,
    getFeediscountById

  };