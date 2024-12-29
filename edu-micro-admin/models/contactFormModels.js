const { ERROR } = require("../constants/ERRORCODE");
const Joi = require("joi");
const { DB_STATUS } = require("edu-micro-common");


const validateContactFormSchema = Joi.object({
    name: Joi.string().required(),
    email_address: Joi.string().email(),
    mobile_number: Joi.number().integer().min(1000000000).max(9999999999).required(),
    message: Joi.string().max(1000).required()
});

module.exports.validateContactFormSchema = validateContactFormSchema;
