const { pg, logger } = require("edu-micro-common");
const { ERROR } = require("../constants/ERRORCODE");
const QUERY = require('../constants/QUERY');
const parentModel = require('../models/parent');

async function addParent(parentDetails) {
    try {
      const query = {
        text: QUERY.PARENT.insertParentQuery, 
        values: [
          parentDetails.school_id,
          parentDetails.parent_name,
          parentDetails.mobile_no,
          parentDetails.email_id,
          parentDetails.dob,
          parentDetails.gender,
          parentDetails.address,
          parentDetails.relationship_to_student,
          parentDetails.occupation,
          parentDetails.is_govt_employee,
          parentDetails.work_address,
          parentDetails.emergency_contact,
          parentDetails.status,
          parentDetails.updated_by,
          parentDetails.created_by,
        //   parentDetails.date_created,
        //   parentDetails.date_modified,
        ],
      };
  
      const result = await pg.executeQueryPromise(query);
      console.log(result);
      return result[0];
  
    } catch (error) {
      logger.error(`Error adding parent: ${error}`);
      throw error;
    }
}

const checkIfParentExists = async (mobileNo) => {
    try {
        const query = {
            text: QUERY.PARENT.checkIfExist,
            values: [mobileNo],
        };

        const result = await pg.executeQueryPromise(query);
        return result[0].count > 0;
    } catch (error) {
        throw error;
    }
};


const getAllParents = async () => {
    try {
        const query = {
            text: QUERY.PARENT.getAllParentsQuery,
            
        };

        const result = await pg.executeQueryPromise(query);
        return result; 
    } catch (error) {
        throw error;
    }
};


async function getParentByMobile(mobileNumber) {
    try {
      const query = {
        text: QUERY.PARENT.getByMobileQuery,
        values: [mobileNumber],
      };
  
      const result = await pg.executeQueryPromise(query);
  
      if (result && result.length > 0) {
        return result[0];
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }


  const getParentByID = async (parentID) => {
    try {
        const query = {
            text: QUERY.PARENT.getParentByIDquery,
            values: [parentID],
        };

        const result = await pg.executeQueryPromise(query);
        return result[0];
    } catch (error) {
        throw error;
    }
};
const validateParent = parentModel.validateParent;
const updateParent = async (updatedParentDetails, parentID) => {
  try {
    
    const { error } = validateParent(updatedParentDetails);

    if (error) {
      throw new Error(error.message);
    }

    const query = {
      text: QUERY.PARENT.updateParentQuery,
      values: [
        
        updatedParentDetails.school_id,
        updatedParentDetails.parent_name,
        updatedParentDetails.email_id,
        updatedParentDetails.dob,
        updatedParentDetails.gender,
        updatedParentDetails.address,
        updatedParentDetails.relationship_to_student,
        updatedParentDetails.occupation,
        updatedParentDetails.is_govt_employee,
        updatedParentDetails.work_address,
        updatedParentDetails.emergency_contact,
        updatedParentDetails.status,
        updatedParentDetails.updated_by,
        updatedParentDetails.date_modified,
        parentID 
      ],
    };

    const result = await pg.executeQueryPromise(query);

  
    if (result && result.length > 0) {
      return result[0];
    } else {
      
      throw new Error(ERROR.PARENT_UPDATE_FAILED);
    }
  } catch (error) {
    throw error;
  }
};



module.exports = {
  addParent,
  checkIfParentExists,getAllParents,getParentByMobile,getParentByID,updateParent,
};
