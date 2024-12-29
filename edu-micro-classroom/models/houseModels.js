const { ERROR } = require("../constants/ERRORCODE");
const Joi = require("joi");

// Constructor
let House = function (house) {
  this.academic_year_id = house.academic_year_id ? house.academic_year_id : null;
  this.house_name = house.house_name ? house.house_name : null;
  this.house_description = house.house_description ? house.house_description : null;
  this.status = house.status ? house.status : 1;
};


const validateHouse = (house) => {
    const userPattern = /^([ A-Za-z.\-()]){2,30}$/
    const schema = {
        academic_year_id: Joi.number().required(),
        house_name: Joi.string().required(),
        house_description: Joi.string(),
        status: Joi.number()
    };

    return Joi.validate(house, schema);
}

let UpdateHouse = function (updateHouse) {
    this.house_id = updateHouse.house_id !== undefined ? updateHouse.house_id : null;
    this.academic_year_id = updateHouse.academic_year_id !== undefined ? updateHouse.academic_year_id : null;
    this.house_name = updateHouse.house_name !== undefined ? updateHouse.house_name : null;
    this.house_description = updateHouse.house_description;

};

const validateUpdateHouse = (updateHouse) => {
    const userPattern = /^([ A-Za-z.\-()]){2,100}$/;
    const schema = {
        house_id: Joi.number().required(),
        academic_year_id: Joi.number().required(),
        house_name: Joi.string().required(),
        house_description: Joi.string(),
    };

    return Joi.validate(updateHouse, schema);
};

module.exports = {
    House,
    validateHouse,
    UpdateHouse,
    validateUpdateHouse
};
