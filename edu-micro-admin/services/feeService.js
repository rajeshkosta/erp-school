const { pg, ERRORCODE, logger ,queryUtility, CONST} = require("edu-micro-common");
const QUERY = require('../constants/QUERY');

const addFee = async (newFee) => {

    try {
        const query = {
            text: QUERY.FEE.insertFeeQuery,
            values: [
                newFee.fees_type,
                newFee.status,
                newFee.created_by,
                newFee.updated_by,
                newFee.school_id,
            ],
        };

        const result = await pg.executeQueryPromise(query);
    
        return result[0];
        

    } catch (error) {
        logger.error(`Error adding fee: ${error}`);
        throw error;
    }
};

const checkIfExist = async (school_id, fees_type) => {
    try {
        const query = {
            text: QUERY.FEE.checkIfExist,
            values: [school_id, fees_type],
        };

        const result = await pg.executeQueryPromise(query);
        return result[0].count;
    } catch (error) {
        throw error;
    }
};


const checkIfFeeTypeExist=async(reqUserDetails, feeDetails)=>{

    try {
        const query = {
            text: QUERY.FEE.checkIfFeeTypeExist,
            values: [reqUserDetails.school_id, feeDetails.fees_type, feeDetails.fees_type_id],
        };

        const result = await pg.executeQueryPromise(query);
        return result[0].count;
    } catch (error) {
        throw error;
    }

}

const updateFee = async (feeDetails) => {
    try {
        console.log('feeDetails--',feeDetails)
      let fees_type_id = feeDetails.fees_type_id;
      delete feeDetails.fees_type_id;

      
      let setQuery = queryUtility.convertObjectIntoUpdateQuery(feeDetails);
      let updateQuery = `${QUERY.FEE.updateFee} ${setQuery} WHERE fees_type_id= $1`;
  
      console.log(updateQuery);
  
      const _query = {
        text: updateQuery,
        values: [fees_type_id]
      };

      console.log('_query---',_query)
      const queryResult = await pg.executeQueryPromise(_query);
      return queryResult;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const getAllfees = async (schoolId) => {
    try {

        const query = {
            text: QUERY.FEE.getAllfees,
            values: [schoolId],
        };
        const result = await pg.executeQueryPromise(query);
        return result;
    } catch (error) {
        logger.error(`Error getting fees details: ${error}`);
        throw error;
    }
};

const getFeeTypeById = async (feeTypeId) => {
    try {

        const query = {
            text: QUERY.FEE.getFeeTypeById,
            values: [feeTypeId],
        };
        const result = await pg.executeQueryPromise(query);
        return result;
    } catch (error) {
        logger.error(`Error getting fees details: ${error}`);
        throw error;
    }
};
module.exports = {
    addFee,
    checkIfExist,
    updateFee,
    getAllfees,
    getFeeTypeById,
    checkIfFeeTypeExist
  };