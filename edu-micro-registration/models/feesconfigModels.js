const Joi = require("joi");
const { JSONUTIL, DB_STATUS } = require("edu-micro-common");
const ERRORCODE = require("../constants/ERRORCODE.js");

const Feeconfig = function (feeconfigDetails) {
    this.academic_year_id  = feeconfigDetails.academic_year_id;
    this.student_admission_id = feeconfigDetails.student_admission_id;
    this.total_amount = feeconfigDetails.total_amount;
    this.class_id = feeconfigDetails.class_id ? feeconfigDetails.class_id : null;
    this.is_discount = feeconfigDetails.is_discount;
    this.discount_amount = feeconfigDetails.discount_amount ? feeconfigDetails.discount_amount : null;
    this.discount_note = feeconfigDetails.discount_note ? feeconfigDetails.discount_note : null;
    this.status = DB_STATUS.STATUS_MASTER.ACTIVE;
    this.fees_list = feeconfigDetails.fees_list;
  };

  const updateFeeconfig = function (feeconfigDetails) {
    this.fees_config_id = feeconfigDetails.fees_config_id
    this.academic_year_id  = feeconfigDetails.academic_year_id;
    this.student_admission_id = feeconfigDetails.student_admission_id;
    this.total_amount = feeconfigDetails.total_amount;
    this.class_id = feeconfigDetails.class_id ? feeconfigDetails.class_id : null;
    this.is_discount = feeconfigDetails.is_discount;
    this.discount_amount = feeconfigDetails.discount_amount ? feeconfigDetails.discount_amount : null;
    this.discount_note = feeconfigDetails.discount_note ? feeconfigDetails.discount_note : null;
    this.status = DB_STATUS.STATUS_MASTER.ACTIVE;
    this.fees_list = feeconfigDetails.fees_list;
  };

  const validateFeeconfig = (feeconfigDetails) => {
    const feeConfigSchema =( {
      academic_year_id: Joi.number().integer().required(),
      student_admission_id: Joi.number().integer().required(), 
      total_amount: Joi.number().max(9999999999).required(), 
      is_discount: Joi.number().required(),
      class_id: Joi.number().integer().allow(null),
      discount_amount: Joi.number().max(999999999).allow(null),
      discount_note:Joi.string().trim().allow("",null),
      status: Joi.number().integer().allow(null),
      fees_list: Joi.array().items(Joi.object({
        fees_master_id: Joi.number().integer().required(),
        amount: Joi.number().max(9999999999).required()
      })),
      created_by: Joi.number(),
      updated_by: Joi.number()
    });
    console.log("feeconfigDetails",feeconfigDetails)
    return Joi.validate(feeconfigDetails, feeConfigSchema);
  };

  const validateUpdateFeeconfig = (feeconfigDetails) => {
    const feeConfigSchema =( {
      fees_config_id: Joi.number().integer().required(),
      academic_year_id: Joi.number().integer().required(),
      student_admission_id: Joi.number().integer().required(), 
      total_amount: Joi.number().max(999999999).required(), 
      is_discount: Joi.number().required(),
      class_id: Joi.number().integer().allow(null),
      discount_amount: Joi.number().max(999999999).allow(null),
      discount_note:Joi.string().trim().allow("",null),
      status: Joi.number().integer().allow(null),
      fees_list: Joi.array().items(Joi.object({
        fees_master_id: Joi.number().integer().required(),
        amount: Joi.number().max(999999999).required()
      })),
      updated_by: Joi.number()
    });
    return Joi.validate(feeconfigDetails, feeConfigSchema);
  };

  module.exports = {
    Feeconfig,
    updateFeeconfig,
    validateFeeconfig,
    validateUpdateFeeconfig
  };