const { pg, ERRORCODE, logger ,queryUtility,JSONUTIL, CONST} = require("edu-micro-common");
const QUERY = require('../constants/QUERY');

const updateTamplate = async (templateDetails) => {
    try {
        const query = {
            text: QUERY.TEMPLATE.updateTamplate,
            values: [
                templateDetails.template_id,
                templateDetails.school_name,
                templateDetails.school_address,
                templateDetails.contact_no,
                templateDetails.school_id,
                templateDetails.title,
                templateDetails.school_logo,
                templateDetails.signature,
                templateDetails.status,
                templateDetails.updated_by,
                templateDetails.config_id
             
            ],
        };
  
        const result = await pg.executeQueryPromise(query);
  
        return result;
    } catch (error) {
        console.error(`Error updating Template: ${error}`);
        throw error;
    }
  };

  const checkTamplateDetailsExistByConfigId = async (config_id) => {
    try {
      const _query = {
        text: QUERY.TEMPLATE.checkTamplateDetailsExistByConfigId,
        values: [config_id],
      };
  
      console.log(_query);
  
      const queryResult = await pg.executeQueryPromise(_query);
      return queryResult[0].count;
    } catch (error) {
      throw error;
    }
  };


  const createTemplate = async (templateDetail) => {
    try {
      const _query = {
        text: QUERY.TEMPLATE.createTemplate,
        values: [
            templateDetail.template_id,
            templateDetail.school_name,
            templateDetail.school_address,
            templateDetail.contact_no,
            templateDetail.school_logo,
            templateDetail.school_id,
            templateDetail.title,
            templateDetail.signature,
            templateDetail.status,
            templateDetail.created_by,
            templateDetail.updated_by
        ],
      };
  
      console.log(_query);
      const queryResult = await pg.executeQueryPromise(_query);
      return queryResult;
    } catch (error) {
      throw error;
    }
  };

  const templateList = async () => {
    try {
        
        const _query = `${QUERY.TEMPLATE.templateList}`;
  
        const data = await pg.executeQueryPromise(_query);
  
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
  };

  const gettemplateDetailsByconfigId = async (config_id) => {
    try {
      const _query = {
        text: QUERY.TEMPLATE.gettemplateDetailsByconfigId,
        values: [config_id],
      };
  
      const queryResult = await pg.executeQueryPromise(_query);
      return queryResult && queryResult.length > 0 ? queryResult[0] : null;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };


  module.exports = {
    updateTamplate,
    checkTamplateDetailsExistByConfigId,
    createTemplate,
    templateList,
    gettemplateDetailsByconfigId
  };