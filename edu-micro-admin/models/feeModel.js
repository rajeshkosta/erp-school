const Joi = require("joi");
const { JSONUTIL, DB_STATUS } = require("edu-micro-common");
const ERRORCODE = require("../constants/ERRORCODE.js");

const Fee = function (feeDetails) {
    this.fees_type = feeDetails.fees_type ? feeDetails.fees_type : null;
  };

  const UpdateFee = function (feeDetails) {
    this.fees_type_id = parseInt(feeDetails.fees_type_id);
    this.fees_type = feeDetails.fees_type ? feeDetails.fees_type : null;
    this.status = feeDetails.status
      ? feeDetails.status
      : DB_STATUS.STATUS_MASTER.ACTIVE;
    this.updated_by = feeDetails.updated_by;
  };

  const validateFee = (feeDetails) => {
    const feeSchema = {
      fees_type: Joi.array().required(),
      status: Joi.number().integer().allow(),
      created_by: Joi.number(),
      updated_by: Joi.number(),
      school_id: Joi.number(),
    };
  
    return Joi.validate(feeDetails, feeSchema);
  };

  const validateUpdateFee = (feeDetails) => {
    
    const feeSchema = {
      fees_type_id: Joi.number().required(),
      fees_type: Joi.string().required(),
      status: Joi.number().integer().allow(null),
      updated_by: Joi.number()
    };
  
    return Joi.validate(feeDetails, feeSchema);
  };

  module.exports = {
    Fee,
    UpdateFee,
    validateFee,
    validateUpdateFee

  };