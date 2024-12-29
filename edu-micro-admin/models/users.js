const Joi = require("joi");
let ERRORCODE = require('../constants/ERRORCODE.js')

const User = function (users) {
    this.user_name = users.user_name;
    this.first_name = users.first_name.trim();
    this.last_name = users.last_name ? users.last_name.trim() : "";
    this.display_name = this.last_name ? this.first_name.concat(" ").concat(this.last_name).trim() : this.first_name;
    this.mobile_number = users.mobile_number;
    this.role_id = users.role_id;
    this.trust_id = users.trust_id ? users.trust_id : null;
    this.school_id = users.school_id ? users.school_id : null;
    this.email_id = users.email_id ? users.email_id : null;
    this.user_module_json = users.user_module_json ? users.user_module_json : null;
};

const UpdateUser = function (users) {
    this.display_name = users.display_name;
    this.date_modified = new Date();
    this.date_of_birth = users.date_of_birth;
    this.gender = users.gender;
    this.updated_by = users.updated_by;
    this.email_id = users.email_id;
};

function validateUpdateUsers(user) {
    const pattern = /^[0-9]{10}$/;
    const pattern1 = /^([^0-9]*){1,50}$/;
    const userPattern = /^([ A-Za-z.\-()]){2,30}$/
    const schema = {
        display_name: Joi.string()
            .strict()
            .trim()
            .regex(userPattern)
            .error(
                new Error(`{"errorCode":"ADMROL0001", "error":"${ERRORCODE.ERROR.ADMROL0001}"}`)
            ),
        gender: Joi.number().allow("", null),
        date_of_birth: Joi.date().allow("", null),
        date_modified: Joi.date(),
        updated_by: Joi.number(),
        email_id: Joi.string().email()
    };

    return Joi.validate(user, schema);
}


function validateUsers(user) {
    const userPattern = /^([ A-Za-z.\-()]){2,30}$/
    const schema = {
        user_name: Joi.string(),
        first_name: Joi.string().required(),
        last_name: Joi.string().allow("", null),
        display_name: Joi.string()
            .strict()
            .trim()
            .regex(userPattern)
            .error(
                new Error(`{"errorCode":"ADMROL0013", "error":"${ERRORCODE.ERROR.ADMROL0013}"}`)
            ),
        mobile_number: Joi.number()
            .error(
                new Error(`{"errorCode":"ADMROL0014", "error":"${ERRORCODE.ERROR.ADMROL0014}"}`)
            )
            .required(),
        role_id: Joi.string()
            .error(
                new Error(`{"errorCode":"ADMROL0012", "error":"${ERRORCODE.ERROR.ADMROL0012}"}`)
            )
            .required(),
        created_by: Joi.number(),
        country_id: Joi.number().empty('').allow(null),
        trust_id: Joi.number().empty('').allow(null),
        school_id: Joi.number().empty('').allow(null),
        email_id: Joi.string().email().allow(null, ""),
        user_module_json: Joi.array().allow(null)
    };

    return Joi.validate(user, schema);
}

const EditUser = function (users) {
    this.user_id = users.user_id;
    this.first_name = users.first_name.trim();
    this.last_name = users.last_name ? users.last_name.trim() : null;
    this.display_name = this.last_name ? this.first_name.concat(" ").concat(this.last_name).trim() : this.first_name;
    this.is_active = users.is_active || 1;
    this.email_id = users.email_id;
};


function validateEditUsers(user) {
    const userPattern = /^([ A-Za-z.\-()]){2,30}$/
    const schema = {
        user_id: Joi.number().required(),
        first_name: Joi.string(),
        last_name: Joi.string().allow("", null),
        display_name: Joi.string()
            .strict()
            .trim()
            .regex(userPattern)
            .error(
                new Error(`{"errorCode":"ADMROL0001", "error":"${ERRORCODE.ERROR.ADMROL0003}"}`)
            ),
        is_active: Joi.number()
            .min(0)
            .max(255)
            .error(
                new Error(`{"errorCode":"ADMROL0011", "error":"${ERRORCODE.ERROR.ADMROL0011}"}`)
            ),
        email_id: Joi.string().email()
    };

    return Joi.validate(user, schema);
}

module.exports = User;
module.exports.UpdateUser = UpdateUser;
module.exports.validateUpdateUsers = validateUpdateUsers;
module.exports.validate = validateUsers;
module.exports.EditUser = EditUser;
module.exports.validateEditUsers = validateEditUsers;