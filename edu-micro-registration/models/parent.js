const Joi = require("joi");
const ERROR = require("../constants/ERRORCODE");

function Parent(parent) {
   // this.parent_id = parent.parent_id;
    this.school_id = parent.school_id;
    this.parent_name = parent.parent_name;
    this.mobile_no = parent.mobile_no;
    this.email_id = parent.email_id;
    this.dob = parent.dob;
    this.gender = parent.gender;
    this.address = parent.address;
    this.relationship_to_student = parent.relationship_to_student;
    this.occupation = parent.occupation;
    this.is_govt_employee = parent.is_govt_employee;
    this.work_address = parent.work_address;
    this.emergency_contact = parent.emergency_contact;
    this.status = parent.status;
    // this.updated_by = parent.updated_by;
    // this.created_by = parent.created_by;
    // this.date_created = parent.date_created;
    // this.date_modified = parent.date_modified;
}

function validateParent(parentToValidate) {
    const schema = Joi.object({
        school_id: Joi.number().integer().required(),
        parent_name: Joi.string().max(100).required(),
        mobile_no: Joi.number().integer().required(),
        email_id: Joi.string().email().max(100),
        dob: Joi.date().iso(),
        gender: Joi.number().integer().required(),
        address: Joi.string().max(255),
        relationship_to_student: Joi.string().max(20),
        occupation: Joi.string().max(255),
        is_govt_employee: Joi.number().integer(),
        work_address: Joi.string().max(255),
        emergency_contact: Joi.number().integer(),
        status: Joi.number().integer(),
        updated_by: Joi.number().integer(),
        created_by: Joi.number().integer(),
        // date_created: Joi.date().iso(),
        // date_modified: Joi.date().iso(),
    });

    return schema.validate(parentToValidate);
}

module.exports = {
    Parent,
    validateParent,
};
