const Joi = require("joi");
const ERROR = require("../constants/ERRORCODE");

function Section(section) {
    this.section_name = section.section_name;
    //this.status = section.status;

}

 
function validateSection(sectionToValidate) {
    const schema = Joi.object({
        section_name: Joi.array().items(Joi.string()).required(),
        created_by: Joi.number().integer(),
        updated_by: Joi.number().integer(),

    });

    return schema.validate(sectionToValidate);
}

const UpdateSection = function (section) {
    this.section_id = section.section_id;
    this.section_name = section.section_name;
};

function validateUpdateSection(sectionToValidate) {
    const schema = Joi.object({
        section_name: Joi.string(),
        section_id: Joi.number().integer()
    });

    return schema.validate(sectionToValidate);
}


    

module.exports = {
    Section,
    validateSection,UpdateSection,validateUpdateSection
}
