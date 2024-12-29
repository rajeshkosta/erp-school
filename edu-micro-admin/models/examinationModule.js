const Joi = require("joi");
const { JSONUTIL, DB_STATUS } = require("edu-micro-common");
const ERRORCODE = require("../constants/ERRORCODE.js");

const Examination = function (examinationDetails) {
  this.class_id = examinationDetails.class_id;
  this.academic_year_id = examinationDetails.academic_year_id;
  this.subject_id = examinationDetails.subject_id;
  this.description = examinationDetails.description;
  this.exam_type_id = examinationDetails.exam_type_id;
  this.exam_date = examinationDetails.exam_date;
  this.duration = examinationDetails.duration;
  this.total_marks = examinationDetails.total_marks ? examinationDetails.total_marks : null;
  this.passing_marks = examinationDetails.passing_marks ? examinationDetails.passing_marks : null;
  this.status = examinationDetails.status
    ? trustDetails.status
    : DB_STATUS.STATUS_MASTER.ACTIVE;
  this.created_by = examinationDetails.created_by;
  this.updated_by = examinationDetails.updated_by;
}

const UpdateExamination = function (examinationDetails) {
  this.examination_id = examinationDetails.examination_id;
  this.academic_year_id = examinationDetails.academic_year_id;
  this.class_id = examinationDetails.class_id;
  this.subject_id = examinationDetails.subject_id;
  this.description = examinationDetails.description;
  this.exam_type_id = examinationDetails.exam_type_id;
  this.exam_date = examinationDetails.exam_date;
  this.duration = examinationDetails.duration;
  this.total_marks = examinationDetails.total_marks ? examinationDetails.total_marks : null;
  this.passing_marks = examinationDetails.passing_marks ? examinationDetails.passing_marks : null;
  this.status = examinationDetails.status;
  this.updated_by = examinationDetails.updated_by;
}

const validateExamination = (examinationDetails) => {
  const examinationSchema = {
    class_id: Joi.number().integer().min(1).required(),
    academic_year_id: Joi.number().integer().min(1).required(),
    subject_id: Joi.number().integer().min(1).required(),
    description: Joi.string().trim().allow("", null),
    exam_type_id: Joi.number().integer().min(1).required(),
    exam_date: Joi.date().required(),
    duration: Joi.number().integer().required(),
    total_marks: Joi.number().integer().required(),
    passing_marks: Joi.number().integer().required(),
    status: Joi.number().integer().allow(null),
    created_by: Joi.number().integer().min(1).required(),
    updated_by: Joi.number().integer().min(1).required()
  };

  return Joi.validate(examinationDetails, examinationSchema);
}

const validateUpdateExamination = (examinationDetails) => {

  const examinationSchema = {
    examination_id: Joi.number().integer().min(1).required(),
    class_id: Joi.number().integer().min(1).allow(null),
    academic_year_id: Joi.number().integer().min(1).allow(null),
    subject_id: Joi.number().integer().min(1).allow(null),
    description: Joi.string().trim().allow("", null),
    exam_type_id: Joi.number().integer().min(1).allow(null),
    exam_date: Joi.date().required(), 
    duration: Joi.number().integer().required(),
    total_marks: Joi.number().integer().allow(null),
    passing_marks: Joi.number().integer().allow(null),
    status: Joi.number().integer().allow(null),
    updated_by: Joi.number().integer().min(1).required()
  };
  return Joi.validate(examinationDetails, examinationSchema);
}



module.exports = {
  Examination,
  UpdateExamination,
  validateExamination,
  validateUpdateExamination
};