//const ERRORCODE = require('../constants/ERRRORCODE.js');
const Joi = require("joi");
const { ERROR } = require("../constants/ERRORCODE");

// Constructor
const Subject = function (subject) {
  this.classroom_id = subject.classroom_id;
  this.teacher_id = subject.teacher_id;
  this.subject_name = subject.subject_name;
  this.status = subject.status;
}

function validateSubject(subjectToValidate) {
  const stringWithoutNumbersRegex = /^[^\d]+$/;
  const schema = Joi.object({
    classroom_id: Joi.number().integer().error(
      new Error(`{"errorCode":"SUBJ0001", "error":"${ERROR.SUBJ0001}"}`)
    )
    .required(),
    teacher_id: Joi.number().integer().error(
      new Error(`{"errorCode":"SUBJ0002", "error":"${ERROR.SUBJ0002}"}`)
    )
    .required(),
    subject_name: Joi.string().max(50).required().regex(stringWithoutNumbersRegex)
      .error(new Error(`{"errorCode":"SUBJ0006", "error":"${ERROR.SUBJ0006}"}`)),
    status: Joi.number().integer(),
    updated_by: Joi.number().integer(),
    created_by: Joi.number().integer()
  });

  return schema.validate(subjectToValidate);
}

module.exports.Subject = Subject;
module.exports.validateSubject = validateSubject;
