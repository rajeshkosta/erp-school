const Joi = require("joi");


 assignMarks = function (assignMarks) {
    this.student_id = assignMarks.student_id;
    this.examination_id = assignMarks.examination_id;
  };

  
  module.exports = {
    assignMarks
  }