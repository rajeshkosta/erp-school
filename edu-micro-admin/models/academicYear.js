const { ACADEMIC_YEAR } = require("../constants/ERRORCODE");
const Joi = require("joi");

var AcademicYear = function (year) {
    this.academic_year_id = year.academic_year_id;
    this.academic_year_name = year.academic_year_name;
    this.start_date = year.start_date;
    this.end_date =year.end_date;
  };

  function validateAcademicYear(year) {
    const schema = {
    academic_year_id: Joi.number().allow(null),
    academic_year_name: Joi.string()
        .min(2)
        .max(50)
        .error(
          new Error(`{"errorCode":"ACYR000002", "error":"${ACADEMIC_YEAR.ACYR000002}"}`)
        )
        .required(),
     start_date: Joi.date()
      .error(
        new Error(`{"errorCode":"ACYR000006", "error":"${ACADEMIC_YEAR.ACYR000006}"}`)
      )
      .required(),
     end_date: Joi.date().required().error(
      new Error(`{"errorCode":"ACYR000007", "error":"${ACADEMIC_YEAR.ACYR000007}"}`)
    )
    .required()
    };
    return Joi.validate(year, schema);
  }

  var AcademicYearupdate = function (year) {
    this.academic_year_name = year.academic_year_name;
    this.start_date = year.start_date;
    this.end_date =year.end_date;
  };

  module.exports.AcademicYear = AcademicYear;
  module.exports.validateAcademicYear = validateAcademicYear;