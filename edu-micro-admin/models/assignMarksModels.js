const Joi = require("joi");
const { JSONUTIL, DB_STATUS } = require("edu-micro-common");
const ERRORCODE = require("../constants/ERRORCODE.js");

const ExamResult = function (examresults) {
    this.examination_id = examresults.examination_id ? JSONUTIL.capitalize(examresults.examination_id) : null;
    this.subject_id = examresults.subject_id;
    this.student_id = examresults.student_id;
    this.maximum_marks = examresults.maximum_marks;
    this.passing_marks = examresults.passing_marks;
    this.marks_obtained = examresults.marks_obtained;
    this.status = examresults.status
      ? examresults.status
      : DB_STATUS.STATUS_MASTER.ACTIVE;
    this.created_by =examresults.created_by
    this.updated_by = examresults.updated_by;
  };

  const UpdateExamResult = function (examresults) {
    this.exam_result_id = examresults.exam_result_id;
    this.examination_id = examresults.examination_id ? JSONUTIL.capitalize(examresults.examination_id) : null;
    this.subject_id = examresults.subject_id;
    this.student_id = examresults.student_id;
    this.maximum_marks = examresults.maximum_marks;
    this.passing_marks = examresults.passing_marks;
    this.marks_obtained = examresults.marks_obtained;
    this.status = examresults.status
      ? examresults.status
      : DB_STATUS.STATUS_MASTER.ACTIVE;
    this.updated_by = examresults.updated_by;
  };

  const validateExamResult= (examresults) => {
    const ExamResultSchema =( {
        examination_id: Joi.number().integer().required(),
        subject_id: Joi.number().integer().required(),
        student_id: Joi.number().integer().required(),
        maximum_marks: Joi.number().integer(),
        passing_marks: Joi.number().integer(),
        marks_obtained: Joi.number().integer(),
        status: Joi.number().integer(),
        created_by: Joi.number(),
        updated_by: Joi.number()
    });
    return Joi.validate(examresults, ExamResultSchema);
  };

  const validateUpdateExamResult= (examresults) => {
    const ExamResultSchema =( {
        exam_result_id: Joi.number().integer().required(),
        examination_id: Joi.number().integer().required(),
        subject_id: Joi.number().integer().required(),
        student_id: Joi.number().integer().required(),
        maximum_marks: Joi.number().integer(),
        passing_marks: Joi.number().integer(),
        marks_obtained: Joi.number().integer(),
        status: Joi.number().integer(),
        created_by: Joi.number(),
        updated_by: Joi.number()
    });
    return Joi.validate(examresults, ExamResultSchema);
  };

  module.exports = {
    ExamResult,
    UpdateExamResult,
    validateExamResult,
    validateUpdateExamResult
  };

