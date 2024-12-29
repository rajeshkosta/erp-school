const Joi = require("joi");
const { ERROR } = require("../constants/ERRORCODE");

const Attendance = function (attendance) {
  this.classroom_id = attendance.classroom_id ? attendance.classroom_id : null;
  this.attendance_date = attendance.attendance_date ? attendance.attendance_date : null;
  this.student_list = attendance.student_list ? attendance.student_list : [];
}

function validateAttendance(attendance) {
  const schema = Joi.object({
    classroom_id: Joi.number().required(),
    attendance_date: Joi.string().trim().required(),
    student_list: Joi.array().items(
      Joi.object({
        student_id: Joi.string().required(),
        attendance_status: Joi.number().required(),
        remarks: Joi.string().trim().allow("", null),
      })
    ),
    created_by: Joi.number().required(),
    updated_by: Joi.number().required()
  });

  return schema.validate(attendance);
}


module.exports = {
  Attendance, validateAttendance
}




