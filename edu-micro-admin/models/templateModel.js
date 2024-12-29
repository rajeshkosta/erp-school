const Joi = require("joi");
const { JSONUTIL, DB_STATUS } = require("edu-micro-common");
const ERRORCODE = require("../constants/ERRORCODE.js");

const UpdateTemplate = function (templateDetails) {
    this.config_id = parseInt(templateDetails.config_id);
    this.template_id = templateDetails.template_id;
    this.school_name = templateDetails.school_name;
    this.school_address = templateDetails.school_address;
    this.contact_no = templateDetails.contact_no;
    this.school_logo = templateDetails.school_logo;
    this.signature = templateDetails.signature;
    this.title = templateDetails.title;
    this.status = templateDetails.status
      ? templateDetails.status
      : DB_STATUS.STATUS_MASTER.ACTIVE;
    this.updated_by = templateDetails.updated_by;
  };

  const Template = function (templateDetails) {
    this.template_id = templateDetails.template_id;
    this.school_name = templateDetails.school_name;
    this.school_address = templateDetails.school_address;
    this.contact_no = templateDetails.contact_no;
    this.school_logo = templateDetails.school_logo;
    this.signature = templateDetails.signature;
    this.school_id = templateDetails.school_id;
    this.title = templateDetails.title;
    this.status = templateDetails.status
      ? templateDetails.status
      : DB_STATUS.STATUS_MASTER.ACTIVE;
    this.created_by =templateDetails,this.created_by
    this.updated_by = templateDetails.updated_by;
  };


  const validateUpdateTemplate = (templateDetails) => {
    const tamplateSchema =( {
      config_id: Joi.number().integer().required(),
      template_id: Joi.number().integer().required(),
      school_name: Joi.string(),
      school_address: Joi.string(),
      contact_no: Joi.number(),
      school_logo: Joi.string(),
      title: Joi.string(),
      signature: Joi.string(), school_id: Joi.number(),
      status: Joi.number().integer(),
      updated_by: Joi.number()
    });
    return Joi.validate(templateDetails, tamplateSchema);
  };

  const validateTemplate = (templateDetails) => {
    const tamplateSchema =( {
      template_id: Joi.number().integer().required(),
      school_name: Joi.string(),
      school_address: Joi.string(),
      contact_no: Joi.string(),
      school_logo: Joi.string(),
      signature: Joi.string(),
      school_id: Joi.number(),
      title: Joi.string(),
      status: Joi.number().integer(),
      created_by: Joi.number(),
      updated_by: Joi.number()
    });
    return Joi.validate(templateDetails, tamplateSchema);
  };


  module.exports = {
    UpdateTemplate,
    validateUpdateTemplate,
    Template,
    validateTemplate
  };