const Joi = require("joi");
const { JSONUTIL, DB_STATUS } = require("edu-micro-common");
const ERRORCODE = require("../constants/ERRORCODE.js");

const Transaction = function (transactionDetails) {
  this.student_admission_id = transactionDetails.student_admission_id ? transactionDetails.student_admission_id:null;
  this.class_id = transactionDetails.class_id ? transactionDetails.class_id:null;
  this.academic_year_id = transactionDetails.academic_year_id ? transactionDetails.academic_year_id:null;
  this.total_amount = transactionDetails.total_amount ? transactionDetails.total_amount:null;
  this.fees_config_id = transactionDetails.fees_config_id ? transactionDetails.fees_config_id:null;
  this.date = transactionDetails.date ? transactionDetails.date:null;
  this.paying_amount = transactionDetails.paying_amount ? transactionDetails.paying_amount:null;
  this.balance_amount = transactionDetails.balance_amount ? transactionDetails.balance_amount:null;
  this.transaction_mode_id = transactionDetails.transaction_mode_id ? transactionDetails.transaction_mode_id:null;
  this.status = transactionDetails.status
  ? transactionDetails.status
  : DB_STATUS.STATUS_MASTER.ACTIVE;
  this.created_by = transactionDetails.created_by;
  this.updated_by = transactionDetails.updated_by;
};

const validateTransaction = (transactionDetails) => {
    const transactionSchema = {
      student_admission_id:Joi.number().integer().allow(null),
      class_id: Joi.number().integer().allow(null),
      fees_config_id: Joi.number().integer(null),
      academic_year_id: Joi.number().integer().allow( null),
      total_amount: Joi.number().integer().allow(null),
      date: Joi.date().required(),
      paying_amount: Joi.number().integer().allow(null),
      balance_amount: Joi.number().integer().allow(null),
      transaction_mode_id: Joi.number().integer().allow(null),
      status: Joi.number().integer().allow(null),
      created_by: Joi.number(),
      updated_by: Joi.number(),
    };
  
    return Joi.validate(transactionDetails, transactionSchema);
  };

  module.exports = {
    Transaction,
    validateTransaction
  };