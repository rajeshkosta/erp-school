const Joi = require("joi");
const { JSONUTIL, DB_STATUS } = require("edu-micro-common");

const route = function (routeDetails) {
    this.route_no = routeDetails.route_no ? routeDetails.route_no : null;
    this.starting_point = routeDetails.starting_point ? routeDetails.starting_point : null;
    this.ending_point = routeDetails.ending_point ? routeDetails.ending_point : null;
    this.status = routeDetails.status
    ? routeDetails.status
    : DB_STATUS.STATUS_MASTER.ACTIVE;
    this.stops_list = routeDetails.stops_list ? routeDetails.stops_list: null;
  };

  const Updateroute = function (routeDetails) {
    this.route_id = routeDetails.route_id ? routeDetails.route_id : null;
    this.starting_point = routeDetails.starting_point ? routeDetails.starting_point : null;
    this.ending_point = routeDetails.ending_point ? routeDetails.ending_point : null;
    this.status = routeDetails.status
    ? routeDetails.status
    : DB_STATUS.STATUS_MASTER.ACTIVE;
    this.stops_list = routeDetails.stops_list ? routeDetails.stops_list: null;
  };

  const validateroute = (routeDetails) => {
    const routeSchema = Joi.object({
        school_id: Joi.number().integer(),
        route_no: Joi.string().required(),
        starting_point: Joi.string().required(),
        ending_point: Joi.string().required(),
        status: Joi.number().integer(),
        stops_list: Joi.array().items(Joi.object({
          stop_name: Joi.string().required()
        })), 
        created_by: Joi.number(),
        updated_by: Joi.number(),
    });

    return routeSchema.validate(routeDetails);
};

const validateUpdateroute = (routeDetails) => {
  const routeSchema = Joi.object({
    route_id: Joi.number().integer(),
    school_id: Joi.number().integer(),
    starting_point: Joi.string().required(),
    ending_point: Joi.string().required(),
    status: Joi.number().integer(),
    stops_list: Joi.array().items(Joi.object({
      stop_name: Joi.string().required()
    })), 
    updated_by: Joi.number(),
  });

  return routeSchema.validate(routeDetails);
};


  module.exports = {
    route,
    Updateroute, 
    validateroute,
    validateUpdateroute

  };