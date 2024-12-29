
const { ERROR } = require("../constants/ERRORCODE");
const Joi = require("joi");
const { DB_STATUS } = require("edu-micro-common");

const Exam = function (exam) {
    this.exam_name = exam.exam_name;
    this.status = exam.status
        ? exam.status
        : DB_STATUS.STATUS_MASTER.ACTIVE
};

const validateExamSchema = Joi.object({
    exam_name: Joi.string().required(),
    status: Joi.number().integer().allow(null)
});

const validateExam = function (validateStudent) {
    console.log('validation err 1', validateStudent)
    return validateExamSchema.validate(validateStudent);
};

const validateUpdateExam = Joi.object({
    exam_type_id: Joi.number().integer().required(),
    exam_name: Joi.string().required(),
    status: Joi.number().integer().allow(null)
});

const validateUpdateExamSchema = function (validateStudent) {
    return validateUpdateExam.validate(validateStudent);
};

const updateExam = function (updateExam) {
    this.exam_type_id = updateExam.exam_type_id;
    this.exam_name = updateExam.exam_name;
    this.status = updateExam.status
        ? updateExam.status
        : DB_STATUS.STATUS_MASTER.ACTIVE
};

module.exports.Exam = Exam;
module.exports.validateExam = validateExam;
module.exports.updateExam = updateExam;
module.exports.validateUpdateExamSchema = validateUpdateExamSchema;
