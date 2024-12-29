const { ERROR } = require("../constants/ERRORCODE");
const { DB_STATUS } = require("edu-micro-common");
const Joi = require('joi');

const Holiday = function (holiday) {
    this.school_id = holiday.school_id;
    this.academic_year_id = holiday.academic_year_id;
    this.holiday_date = holiday.holiday_date;
    this.holiday_name = holiday.holiday_name;
    this.holiday_description = holiday.holiday_description;
    this.created_by = holiday.created_by;
    this.updated_by = holiday.updated_by;
};

const validateHolidaySchema = Joi.object({
    school_id: Joi.number().integer().required(),
    academic_year_id: Joi.number().integer().required(),
    holiday_date: Joi.date().iso().required(),
    holiday_name: Joi.string().required(),
    holiday_description: Joi.string().allow('').optional(),
    created_by: Joi.number().integer().required(),
    updated_by: Joi.number().integer().required()
});

const validateHoliday = (holiday) => {
    return validateHolidaySchema.validate(holiday);
};
// update 


const HolidayUpdate = function (holidayUpdate) {
    this.holiday_id = holidayUpdate.holiday_id;
    this.school_id = holidayUpdate.school_id;
    this.academic_year_id = holidayUpdate.academic_year_id;
    this.holiday_date = holidayUpdate.holiday_date;
    this.holiday_name = holidayUpdate.holiday_name;
    this.holiday_description = holidayUpdate.holiday_description;
    this.updated_by = holidayUpdate.updated_by;
};

const validateUpdateHolidaySchema = Joi.object({
    holiday_id: Joi.number().integer().required(),
    school_id: Joi.number().integer().required(),
    academic_year_id: Joi.number().integer().required(),
    holiday_date: Joi.date().required(),
    holiday_name: Joi.string().required(),
    holiday_description: Joi.string().required(),
    updated_by: Joi.number().integer().required()
});

const validateUpdateHoliday = (updateHoliday) => {
    return validateUpdateHolidaySchema.validate(updateHoliday);
};


module.exports = {
    Holiday,
    HolidayUpdate,
    validateUpdateHolidaySchema,
    validateUpdateHoliday,
    validateHoliday
};
