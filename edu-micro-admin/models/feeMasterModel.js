const Joi = require("joi");
const { JSONUTIL, DB_STATUS } = require("edu-micro-common");
const ERRORCODE = require("../constants/ERRORCODE.js");

const FeeMaster = function (feeMasterDetails) {
    this.academic_year_id = feeMasterDetails.academic_year_id;
    this.fees_type_id = feeMasterDetails.fees_type_id;
    this.amount = feeMasterDetails.amount;
    this.status = feeMasterDetails.status
    ? feeMasterDetails.status
    : DB_STATUS.STATUS_MASTER.ACTIVE;
  };

  const UpdateFeeMaster = function (feeMasterDetails) {
    this.fees_master_id = feeMasterDetails.fees_master_id;
    this.academic_year_id = feeMasterDetails.academic_year_id;
    this.fees_type_id = feeMasterDetails.fees_type_id;
    this.amount = feeMasterDetails.amount;
    this.status = feeMasterDetails.status
    ? feeMasterDetails.status
    : DB_STATUS.STATUS_MASTER.ACTIVE;
  };

  const validateFeeMaster = (feeMasterDetails) => {
    
    const feeMasterSchema =  Joi.object({
        academic_year_id: Joi.number().integer().required(),
        fees_type_id: Joi.number().integer().required(),
        amount: Joi.number().integer().required(),
        status: Joi.number().integer().required(),
    });
  
    return Joi.validate(feeMasterDetails, feeMasterSchema);
  };

  const validateUpdateMaster = (feeMasterDetails) => {
    const feeMasterSchema =  Joi.object({
        fees_master_id: Joi.number().required(),
        academic_year_id: Joi.number().integer().required(),
        fees_type_id: Joi.number().integer().required(),
        amount: Joi.number().integer().required(),
        status: Joi.number().integer().required(),
    });
  
    return Joi.validate(feeMasterDetails, feeMasterSchema);
  };

  module.exports = {
    FeeMaster,
    validateFeeMaster,
    UpdateFeeMaster,
    validateUpdateMaster

  };