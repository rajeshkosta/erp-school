const Joi = require("joi");
const { ERROR } = require("../constants/ERRORCODE");

const Classroom = function (classroomDetails) {
    this.academic_year_id = classroomDetails.academic_year_id ? classroomDetails.academic_year_id : null;
    this.class_teacher = classroomDetails.class_teacher ? classroomDetails.class_teacher : null;
    this.class_id = classroomDetails.class_id ? classroomDetails.class_id : null;
    this.section_id = classroomDetails.section_id ? classroomDetails.section_id : null;
    this.capacity = classroomDetails.capacity ? classroomDetails.capacity : null;
    this.room_no = classroomDetails.room_no ? classroomDetails.room_no : null;
    this.floor = classroomDetails.floor ? classroomDetails.floor : null;
    this.building = classroomDetails.building ? classroomDetails.building : null;
    this.projector_available = classroomDetails.projector_available ? classroomDetails.projector_available : 0;
    this.status = classroomDetails.status ? classroomDetails.status : 1;
    this.subjectList = classroomDetails.subjectList
};

const validateClassroom = (classroom) => {
    const schema = {
        academic_year_id: Joi.number().required(),
        class_teacher: Joi.number().allow('', null),
        class_id: Joi.number().required(),
        section_id: Joi.number().allow('', null),
        capacity: Joi.number().allow('', null),
        room_no: Joi.string().allow('', null),
        floor: Joi.string().allow('', null),
        building: Joi.string().allow('', null),
        projector_available: Joi.number(),
        status: Joi.number(),
        created_by: Joi.number().required(),
        updated_by: Joi.number().required(),
        subjectList: Joi.array()
    };
    return Joi.validate(classroom, schema);
}


module.exports = {
    Classroom,
    validateClassroom
};