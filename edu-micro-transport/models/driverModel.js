const Joi = require("joi")


const driver = function(driverDetails){
    this.driver_name = driverDetails.driver_name;
    this.dob = driverDetails.dob;
    this.gender = driverDetails.gender;
    this.mobile_number = driverDetails.mobile_number;
    this.driving_licence = driverDetails.driving_licence;
    this.aadhaar_no = driverDetails.aadhaar_no;
    this.alternate_number = driverDetails.alternate_number;
    this.address = driverDetails.address;
    // this.vehicle_id = driverDetails.vehicle_id;
}

const mapDriver = function(mapDetails){
    this.vehicle_id = mapDetails.vehicle_id;
}

function validateDriver(driverDetails){
    const adhPattern = /^\d{12}$/;
    

    const driverSchema = Joi.object({
        driver_name:Joi.string().required(),
        dob:Joi.date().allow(null),
        gender:Joi.number().allow(null),
        mobile_number:Joi.number().integer().min(1000000000).max(9999999999).required().messages({
            'number.base': 'Mobile number must be a valid number',
            'number.integer': 'Mobile number must be an integer',
            'number.min': 'Mobile number must be at least 10 digits',
            'number.max': 'Mobile number must not exceed 10 digits',
            'any.required': 'Mobile number is required',
        }),
        driving_licence:Joi.string().required(),
        aadhaar_no:Joi.string().regex(adhPattern).required().messages({
            'string.pattern.base': 'Aadhaar card number must be a number (12 digit)',
            'any.required': 'Aadhaar number is required',
        }),
        alternate_number:Joi.number(),
        address:Joi.string().required(),
    });
    return driverSchema.validate(driverDetails);
}

const updateDriver = function(driverDetails){
    this.driver_id = driverDetails.driver_id;
    this.driver_name = driverDetails.driver_name;
    this.dob = driverDetails.dob;
    this.gender = driverDetails.gender;
    this.mobile_number = driverDetails.mobile_number;
    this.driving_licence = driverDetails.driving_licence;
    this.aadhaar_no = driverDetails.aadhaar_no;
    this.alternate_number = driverDetails.alternate_number;
    this.address = driverDetails.address;
}

function validateUpdateDriver(driverDetails){
    const driverSchema = Joi.object({
        driver_id:Joi.number().required(),
        driver_name:Joi.string().required(),
        dob:Joi.date().allow(null),
        gender:Joi.number().allow(null),
        mobile_number:Joi.number().required(),
        driving_licence:Joi.string().required(),
        aadhaar_no:Joi.string().required(),
        alternate_number:Joi.number().allow(null),
        address:Joi.string().required(),
    });
    return driverSchema.validate(driverDetails);
}



module.exports = {
    driver,
    validateDriver,
    updateDriver,
    validateUpdateDriver,
    mapDriver
};