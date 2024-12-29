const Joi = require("joi");
const { JSONUTIL, DB_STATUS } = require("edu-micro-common");
const ERRORCODE = require("../constants/ERRORCODE.js");

const Trust = function (trustDetails) {
  this.trust_name = JSONUTIL.capitalize(trustDetails.trust_name);
  this.contact_no = trustDetails.contact_no;
  this.logo_url = trustDetails.logo_url;
  this.email = trustDetails.email;
  this.address = trustDetails.address;
  this.status = trustDetails.status
    ? trustDetails.status
    : DB_STATUS.STATUS_MASTER.ACTIVE;
  this.created_by = trustDetails.created_by;
  this.updated_by = trustDetails.updated_by;
};

const UpdateTrust = function (trustDetails) {
  this.trust_id = parseInt(trustDetails.trust_id);
  this.trust_name = trustDetails.trust_name ? JSONUTIL.capitalize(trustDetails.trust_name) : null;
  this.contact_no = trustDetails.contact_no;
  this.logo_url = trustDetails.logo_url;
  this.email = trustDetails.email;
  this.address = trustDetails.address;
  this.status = trustDetails.status
    ? trustDetails.status
    : DB_STATUS.STATUS_MASTER.ACTIVE;
  this.updated_by = trustDetails.updated_by;
};

const validateTrust = (trustDetails) => {
  const trustNamePattern = /^([ A-Za-z.\-()]){2,200}$/;

  const trustSchema = {
    trust_name: Joi.string()
      .strict()
      .trim()
      .regex(trustNamePattern)
      .error(
        new Error(
          `{"errorCode":"TRUSTSERVC004", "error":"${ERRORCODE.TRUST.TRUSTSERVC004}"}`
        )
      ),
   // contact_no: Joi.number().integer().allow(null),
   contact_no: Joi.string().trim().allow("", null),
    logo_url: Joi.string().trim().allow("", null),
    email: Joi.string().trim().allow("", null),
    address: Joi.string().trim().allow("", null),
    status: Joi.number().integer().allow(null),
    created_by: Joi.number(),
    updated_by: Joi.number(),
  };

  return Joi.validate(trustDetails, trustSchema);
};

const validateUpdateTrust = (trustDetails) => {
  const trustNamePattern = /^([ A-Za-z.\-()]){2,200}$/;

  console.log(trustDetails);

  const trustSchema = {
    trust_id: Joi.number().required(),
    trust_name: Joi.string().allow(null),
   // contact_no: Joi.number().integer().allow(null),
   contact_no: Joi.string().trim().allow("", null),
    logo_url: Joi.string().trim().allow("", null),
    email: Joi.string().trim().allow("", null),
    address: Joi.string().trim().allow("", null),
    status: Joi.number().integer().allow(null),
    updated_by: Joi.number(),
  };

  if(trustDetails.trust_name || trustDetails.trust_name != null){
  const result = trustNamePattern.test(trustDetails.trust_name);
    if(!result) return { error : 'Invalid trust_name'} 
}

  return Joi.validate(trustDetails, trustSchema);
};

module.exports = {
  Trust,
  UpdateTrust,
  validateTrust,
  validateUpdateTrust,
};
