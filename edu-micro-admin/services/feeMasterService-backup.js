const { pg, ERRORCODE, logger ,queryUtility} = require("edu-micro-common");
const QUERY = require('../constants/QUERY');

const checkIfExist = async (academic_year_id, fees_type_id, class_id) => {
    try {
        const query = {
            text: QUERY.FEEMASTER.checkIfExist,
            values: [academic_year_id, fees_type_id, class_id],
        };

        const result = await pg.executeQueryPromise(query);
        return result[0].count;
    } catch (error) {
        logger.error(`Error checking if fee master exists: ${error}`);
        throw error;
    }
};

const addFeeMaster = async (newFee) => {
    try {
        const query = {
            text: QUERY.FEEMASTER.insertFeeMasterQuery,
            values: [
                newFee.class_id,
                newFee.academic_year_id,
                newFee.fees_type_id,
                newFee.amount,
                newFee.status,
                newFee.created_by,
                newFee.updated_by,
                newFee.school_id
            ],
        };

        const result = await pg.executeQueryPromise(query);
        return result[0]; 
    } catch (error) {
        logger.error(`Error adding fee master: ${error}`);
        throw error;
    }
};

const getAllfeesMaster = async (class_id,academic_year_id,school_id) => {
    try {

        const query = {
            text: QUERY.FEEMASTER.getAllfeesMaster,
            values: [class_id,academic_year_id,school_id],
        };
        console.log("query".query);
        const result = await pg.executeQueryPromise(query);
        return result;
    } catch (error) {
        logger.error(`Error getting fees master details: ${error}`);
        throw error;
    }
};

const getClassListByFeeConfig = async (academic_year_id) => {
    try {

        const query = {
            text: QUERY.FEEMASTER.getClassListByFeeConfig,
            values: [academic_year_id],
        };
        console.log("query".query);
        const result = await pg.executeQueryPromise(query);
        return result;
    } catch (error) {
        logger.error(`Error getting fees master details: ${error}`);
        throw error;
    }
};

const getFeeMasterDatabyFeeMasterId = async (fees_master_id) => {
    try {
      const _query = {
        text: QUERY.FEEMASTER.getSpecificFeeMasterDetails,
        values: [fees_master_id],
      };
  
      const queryResult = await pg.executeQueryPromise(_query);
      return queryResult && queryResult.length > 0 ? queryResult[0] : null;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const checkIfExistbyID = async ( class_id, fees_master_id) => {
    try {
        const query = {
            text: QUERY.FEEMASTER.checkIfExistbyId, 
            values: [class_id, fees_master_id], 
        };

        const result = await pg.executeQueryPromise(query);
        return result[0].count;
    } catch (error) {
        throw error;
    }
};


const updateFeeMasterDetails = async (feeMasterDetails) => {
    try {

        console.log('feeMasterDetails--',feeMasterDetails)
      let fees_master_id = feeMasterDetails.fees_master_id;
      delete feeMasterDetails.fees_master_id;
      let setQuery = queryUtility.convertObjectIntoUpdateQuery(feeMasterDetails);
      let updateQuery = `${QUERY.FEEMASTER.updateFeeMasterDetails} ${setQuery} WHERE fees_master_id = $1`;
  
      console.log(updateQuery);
  
      const _query = {
        text: updateQuery,
        values: [fees_master_id]
      };
      console.log('_query---',_query)
      const queryResult = await pg.executeQueryPromise(_query);
      return queryResult;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
module.exports = {
    addFeeMaster,
    checkIfExist,
    getAllfeesMaster,
    getClassListByFeeConfig,
    getFeeMasterDatabyFeeMasterId,
    checkIfExistbyID,
    updateFeeMasterDetails
  };