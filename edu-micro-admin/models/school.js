
const Joi = require("joi");
const ERROR = require("../constants/ERRORCODE");

const School = function (school) {
  this.school_name = school.school_name;
  this.contact_number = school.contact_number;
  this.address = school.address;
  this.pincode = school.pincode;
  this.block = school.block;
  this.district = school.district;
  this.state = school.state;
  this.country = school.country;
  this.email_id = school.email_id;
  this.school_board = school.school_board;
  this.school_type = school.school_type;
  this.school_motto = school.school_motto;
  this.principal_name = school.principal_name;
  this.established_year = school.established_year;
  this.logo_url = school.logo_url;

}


const UpdateSchool = function (school) {
  this.school_id = school.school_id;
  this.school_name = school.school_name;
  this.pincode = school.pincode;
  this.block = school.block;
  this.district = school.district;
  this.state = school.state;
  this.country = school.console;
  this.contact_number = school.contact_number;
  this.address = school.address;
  this.email_id = school.email_id;
  this.school_board = school.school_board;
  this.school_type = school.school_type;
  this.school_motto = school.school_motto;
  this.principal_name = school.principal_name;
  this.established_year = school.established_year;
  this.logo_url = school.logo_url;
}


function validateSchool(school) {
  const schema = {
    school_name: Joi.string()
      .min(1)
      .max(200)
      .error(
        new Error(`{"errorCode":"SCHOOL0001", "error":"${ERROR.SCHOOL.SCHOOL0001}"}`)
      )
      .required(),
      contact_number: Joi.string().trim().allow("", null),
   // contact_number: Joi.number().required(),
    address: Joi.string()
      .min(5)
      .max(500),
    pincode: Joi.string().trim().allow("", null),
    block: Joi.string().trim().allow("", null),
    district: Joi.string().trim().allow("", null),
    state: Joi.string().trim().allow("", null),
    country: Joi.string().trim().allow("", null),
    email_id: Joi.string().required(),
    school_board: Joi.string().trim().allow("", null),
    school_type: Joi.string().trim().allow("", null),
    school_motto: Joi.string().trim().allow("", null),
    principal_name: Joi.string().trim().allow("", null),
    established_year: Joi.number().integer().allow(null),
    logo_url: Joi.string().trim().allow("", null)
  };
  return Joi.validate(school, schema);
}

function validateUpdateSchool(school) {
  const schema = {
    school_id: Joi.number().required(),
    school_name: Joi.string()
      .min(1)
      .max(200)
      .error(
        new Error(`{"errorCode":"SCHOOL0001", "error":"${ERROR.SCHOOL.SCHOOL0001}"}`)
      )
      .required(),
      contact_number: Joi.string().trim().allow("", null),
    //contact_number: Joi.number().required(),
    address: Joi.string()
      .min(5)
      .max(500),
    pincode: Joi.string().trim().allow("", null),
    block: Joi.string().trim().allow("", null),
    district: Joi.string().trim().allow("", null),
    state: Joi.string().trim().allow("", null),
    country: Joi.string().trim().allow("", null),
    email_id: Joi.string().required(),
    school_board: Joi.string().trim().allow("", null),
    school_type: Joi.string().trim().allow("", null),
    school_motto: Joi.string().trim().allow("", null),
    principal_name: Joi.string().trim().allow("", null),
    established_year: Joi.number().integer().allow(null),
    logo_url: Joi.string().trim().allow("", null)

  };
  return Joi.validate(school, schema);
}

module.exports = {
  School, validateSchool,
  UpdateSchool, validateUpdateSchool
};

