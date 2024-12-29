const Joi = require("joi")

const assignment = function(assignmentDetails){
    this.classroom_id = assignmentDetails.classroom_id;
    this.subject_id = assignmentDetails.subject_id;
    this.assignment_title = assignmentDetails.assignment_title;
    this.start_date = assignmentDetails.start_date;
    this.end_date = assignmentDetails.end_date;
    this.assignment_description = assignmentDetails.assignment_description;
 //   this.assignment_document = assignmentDetails.assignment_document;
  // this.assignment_document = assignmentDetails.assignment_document?assignmentDetails.assignment_document:null;
}



function validateAssignment(assignmentDetails){
    const assignmentSchema = Joi.object({
        classroom_id:Joi.number().required(),
        subject_id:Joi.number().required(),
        assignment_title:Joi.string().required(),
        start_date:Joi.allow(null),
        end_date:Joi.allow(null),
        assignment_description:Joi.string().allow(null),
     //   assignment_document:Joi.string().allow(null)
    });
    return assignmentSchema.validate(assignmentDetails)
}


//UPDATE

const updatedAssignment = function(assignmentDetails){
    this.assignment_id = assignmentDetails.assignment_id;
    this.subject_id = assignmentDetails.subject_id;
    this.assignment_title = assignmentDetails.assignment_title;
    this.start_date = assignmentDetails.start_date;
    this.end_date = assignmentDetails.end_date;
    this.assignment_description = assignmentDetails.assignment_description;
    this.assignment_document = assignmentDetails.assignment_document;
}

function validateUpdateAssignment(assignmentDetails){
    const assignmentUpdateSchema = Joi.object({
        assignment_id:Joi.number().required(),
        subject_id:Joi.number().required(),
        assignment_title:Joi.string().required(),
        start_date:Joi.allow(null),
        end_date:Joi.allow(null),
        assignment_description:Joi.string().allow(null),
        assignment_document:Joi.string().allow(null)
    });
    return assignmentUpdateSchema.validate(assignmentDetails)
}


module.exports = {
    assignment,
    validateAssignment,
    updatedAssignment,
    validateUpdateAssignment
}


