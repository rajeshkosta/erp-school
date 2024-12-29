const Joi = require("joi");


const vehicle = function (vehicleDetails) {
    this.vehicle_code = vehicleDetails.vehicle_code;
    this.vehicle_plate_number = vehicleDetails.vehicle_plate_number;
    this.vehicle_reg_number = vehicleDetails.vehicle_reg_number;
    this.chasis_number = vehicleDetails.chasis_number;
    this.vehicle_model = vehicleDetails.vehicle_model;
    this.year_made = vehicleDetails.year_made ;
    this.vehicle_type = vehicleDetails.vehicle_type;
    this.capacity = vehicleDetails.capacity;
    this.registration_certificate = vehicleDetails.registration_certificate;

};


function validateVehicle(vehicleDetails) {
    const vehicleSchema = Joi.object({
        vehicle_code: Joi.string().allow(null),
        vehicle_plate_number: Joi.string().required(),
        vehicle_reg_number: Joi.string().allow("",null),
        chasis_number: Joi.string().required(),
        vehicle_model: Joi.string().required(),
        year_made: Joi.number().allow(null),
        vehicle_type: Joi.string().required(),
        capacity: Joi.number().required(),
        registration_certificate:Joi.string().allow(null)
    });

    return vehicleSchema.validate(vehicleDetails);

}


const updatedVehicle = function (vehicleDetails) {
    this.vehicle_id = vehicleDetails.vehicle_id;
    this.vehicle_code = vehicleDetails.vehicle_code;
    this.vehicle_plate_number = vehicleDetails.vehicle_plate_number;
    this.vehicle_reg_number = vehicleDetails.vehicle_reg_number;
    this.chasis_number = vehicleDetails.chasis_number;
    this.vehicle_model = vehicleDetails.vehicle_model;
    this.year_made = vehicleDetails.year_made;
    this.vehicle_type = vehicleDetails.vehicle_type;
    this.capacity = vehicleDetails.capacity;
    this.route_id = vehicleDetails.route_id ?  vehicleDetails.route_id : null;
    this.driver_id = vehicleDetails.driver_id ?  vehicleDetails.driver_id : null;
}

function validateUpdateVehicle(vehicleDetails) {
    const vehicleSchema = Joi.object({
        vehicle_id: Joi.number().required(),
        vehicle_code: Joi.string().allow(null, ''),
        vehicle_plate_number: Joi.string().allow(null, ''),
        vehicle_reg_number: Joi.string().allow(null, ''),
        chasis_number: Joi.string().allow(null, ''),
        vehicle_model: Joi.string().allow(null, ''),
        year_made: Joi.number().allow(null, ''),
        vehicle_type: Joi.string().allow(null, ''),
        capacity: Joi.number().allow(null, ''),
        route_id: Joi.number().allow(null, ''),
        driver_id: Joi.number().allow(null, '')
    });

    return vehicleSchema.validate(vehicleDetails);

}

const assignDriver = function (vehicleDetails) {
    this.driver_id = vehicleDetails.driver_id;
    this.vehicle_id = vehicleDetails.vehicle_id
};

function validateAssignDriver(vehicleDetails) {
    const vehicleSchema = Joi.object({
        driver_id: Joi.number().required(),
        vehicle_id: Joi.number().required(),
    });

    return vehicleSchema.validate(vehicleDetails);

}

module.exports = {
    vehicle,
    validateVehicle,
    updatedVehicle,
    validateUpdateVehicle,
    assignDriver,
    validateAssignDriver
};