const Joi = require("joi");
const { JSONUTIL, DB_STATUS } = require("edu-micro-common");
const ERRORCODE = require("../constants/ERRORCODE.js");

const FeeDiscount = function (feeDiscountDetails) {
    this.fees_discounts = feeDiscountDetails.fees_discounts;
    this.status = feeDiscountDetails.status
      ? feeDiscountDetails.status
      : DB_STATUS.STATUS_MASTER.ACTIVE;
    this.created_by = feeDiscountDetails.created_by;
    this.updated_by = feeDiscountDetails.updated_by;
  };

  const UpdateFeeDiscount = function (feeDiscountDetails) {
    this.fees_discount_id = feeDiscountDetails.fees_discount_id
    this.fees_discount_name = feeDiscountDetails.fees_discount_name;
    this.discount = feeDiscountDetails.discount;
    this.status = feeDiscountDetails.status
      ? feeDiscountDetails.status
      : DB_STATUS.STATUS_MASTER.ACTIVE;
    this.updated_by = feeDiscountDetails.updated_by;
  };

  const validateFeeDiscount = (feeDiscountDetails) => {
    const feeDiscountSchema = Joi.object({
      fees_discounts: Joi.array().items(
        Joi.object({
          fees_discount_name: Joi.string().trim().required(),
          discount: Joi.number().integer().required()
        })
      ).required(),
      status: Joi.number().integer().allow(null),
      created_by: Joi.number(),
      updated_by: Joi.number(),
    });
  
    return feeDiscountSchema.validate(feeDiscountDetails);
  };

  const validateUpdateFeeDiscount = (feeDiscountDetails) => {
    const feeDiscountSchema = {
      fees_discount_id: Joi.number().integer().required(),
      fees_discount_name: Joi.string().trim().required(),
      discount: Joi.number().integer().required(),
      status: Joi.number().integer().allow(null),
      updated_by: Joi.number(),
    };
    return Joi.validate(feeDiscountDetails, feeDiscountSchema);
  };

  module.exports = {
    FeeDiscount,
    validateFeeDiscount,
    UpdateFeeDiscount,
    validateUpdateFeeDiscount
  };