const Joi = require("joi");
const { DB_STATUS } = require("edu-micro-common");
const { STUDENT_ERR } = require('../constants/ERRORCODE')


const ClassroomStudent = function (classroomStudent) {
    this.student_admission_id = classroomStudent.student_admission_id;
    this.classroom_id = classroomStudent.classroom_id;
    this.roll_no = classroomStudent.roll_no;
    this.house_id = classroomStudent.house_id;
    this.status = classroomStudent.status ? classroomStudent.status : DB_STATUS.STATUS_MASTER.ACTIVE;
    this.created_by = classroomStudent.created_by;
    this.updated_by = classroomStudent.updated_by;
};

const validateClassroomStudnetSchema = Joi.object({
    student_admission_id: Joi.number().required(),
    classroom_id: Joi.number().integer().required(),
    roll_no: Joi.number().integer().required(),
    house_id: Joi.number().integer(),
    status: Joi.number().integer().allow(null),
    created_by: Joi.number().integer().required(),
    updated_by: Joi.number().integer().required()
});

const validateClassroomStudent = function (validateClassroomStudent) {
    console.log('validation err 1', validateClassroomStudent)
    return validateClassroomStudnetSchema.validate(validateClassroomStudent);
};

const updateStudentClass = function (updateStudent) {
    this.student_id = updateStudent.student_id;
    this.student_admission_id = updateStudent.student_admission_id;
    this.classroom_id = updateStudent.classroom_id;
    this.roll_no = updateStudent.roll_no;
    this.house_id = updateStudent.house_id;

}

const validateUpdateClassroomStudentSchema = Joi.object({
    student_id: Joi.number().required(),
    student_admission_id: Joi.number(),
    classroom_id: Joi.number(),
    roll_no: Joi.number(),
    house_id: Joi.number(),

});
const validateUpdateClassroomStudent = function (validateStudent) {

    return validateUpdateClassroomStudentSchema.validate(validateStudent);
}


const validateAllocateStudents = (data) => {

    const schema = {
        school_id: Joi.number().required(),
        academic_year_id: Joi.number().required(),
        classroom_id: Joi.number().required(),
        user_id: Joi.number(),
        studentData: Joi.array()
        // .items(
        //     Joi.object({
        //         student_admission_id: Joi.number().required(),
        //         first_name: Joi.string().allow(null),
        //         gender: Joi.string().allow(null),
        //         roll_no: Joi.number().required()
        //     })
        // ).required(),
    };
    return Joi.validate(data, schema);
}



const validateAllocationRequest = (reqParams) => {

    const response = {
        isValid: true,
        message: ''
    };


    const searchByTypes = ['CLASS', 'ADMISSION'];

    if (!reqParams.search_by) {
        response.isValid = false;
        response.message = `{"errorCode":"STUDENTERR0003", "error":"${STUDENT_ERR.STUDENTERR0003}"}`;
        return response;
    }

    if (!searchByTypes.includes(reqParams.search_by.toUpperCase())) {
        response.isValid = false;
        response.message = `{"errorCode":"STUDENTERR0003", "error":"${STUDENT_ERR.STUDENTERR0003}"}`;
        return response;
    }

    if (!reqParams.academic_year_id) {
        response.isValid = false;
        response.message = `{"errorCode":"STUDENTERR0004", "error":"${STUDENT_ERR.STUDENTERR0004}"}`;
        return response;
    }

    if (reqParams.search_by.toUpperCase() === 'CLASS') {

        if(!reqParams.allot_year_id){
            response.isValid = false;
            response.message = `{"errorCode":"STUDENTERR0006", "error":"${STUDENT_ERR.STUDENTERR0006}"}`;
            return response;
        }

        if (!reqParams.class_id) {
            response.isValid = false;
            response.message = `{"errorCode":"STUDENTERR0005", "error":"${STUDENT_ERR.STUDENTERR0005}"}`;
            return response;
        }

    }

    return response;

}


module.exports = {
    validateClassroomStudent,
    ClassroomStudent,
    validateUpdateClassroomStudent,
    updateStudentClass,
    validateAllocateStudents,
    validateAllocationRequest
};
