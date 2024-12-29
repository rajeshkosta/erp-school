const Joi = require("joi");
const { JSONUTIL, DB_STATUS } = require("edu-micro-common");
const ERRORCODE = require("../constants/ERRORCODE.js");

const STUDENT_REGISTRATION = function (studentDetails) {


  this.first_name = studentDetails.first_name ? studentDetails.first_name : null;
  this.middle_name = studentDetails.middle_name ? studentDetails.middle_name : null;
  this.last_name = studentDetails.last_name ? studentDetails.last_name : null;
  this.father_name = studentDetails.father_name ? studentDetails.father_name : null;
  this.mother_name = studentDetails.mother_name ? studentDetails.mother_name : null;
  this.class_id = studentDetails.class_id ? studentDetails.class_id : null;
  this.gender_id = studentDetails.gender_id ? studentDetails.gender_id : null;
  this.dob = studentDetails.dob ? studentDetails.dob : null;
 // this.age = studentDetails.age ? studentDetails.age : null;
  this.email_id = studentDetails.email_id ? studentDetails.email_id : null;
  this.mobile_number = studentDetails.mobile_number ? studentDetails.mobile_number : null;
  this.alternate_mobile_number = studentDetails.alternate_mobile_number ? studentDetails.alternate_mobile_number : null;
  this.nationality = studentDetails.nationality ? studentDetails.nationality : null;
  this.religion = studentDetails.religion ? studentDetails.religion : null;
  this.caste_category = studentDetails.caste_category ? studentDetails.caste_category : null;
  this.caste = studentDetails.caste ? studentDetails.caste : null;
 
  this.current_address = studentDetails.current_address ? studentDetails.current_address : null;
  this.current_address_state_id = studentDetails.current_address_state_id  ? studentDetails.current_address_state_id : null;
  this.current_address_district_id = studentDetails.current_address_district_id ? studentDetails.current_address_district_id : null;
  this.current_address_city = studentDetails.current_address_city ? studentDetails.current_address_city : null;
  this.current_address_pincode = studentDetails.current_address_pincode ? studentDetails.current_address_pincode : null;
  
  this.permanent_address = studentDetails.permanent_address ? studentDetails.permanent_address : null;
  this.permanent_address_state_id = studentDetails.permanent_address_state_id ? studentDetails.permanent_address_state_id : null;
  this.permanent_address_district_id = studentDetails.permanent_address_district_id ? studentDetails.permanent_address_district_id : null;
  this.permanent_address_city = studentDetails.permanent_address_city ? studentDetails.permanent_address_city : null;
  this.permanent_address_pincode = studentDetails.permanent_address_pincode ? studentDetails.permanent_address_pincode : null;
 

  this.blood_group = studentDetails.blood_group ? studentDetails.blood_group : null;
  this.father_email = studentDetails.father_email ? studentDetails.father_email : null;
  this.father_occupation = studentDetails.father_occupation ? studentDetails.father_occupation : null;
  this.mother_email = studentDetails.mother_email ? studentDetails.mother_email : null;
  this.mother_occupation = studentDetails.mother_occupation ? studentDetails.mother_occupation : null;
  this.previous_school_name = studentDetails.previous_school_name ? studentDetails.previous_school_name : null;
  this.previous_school_board = studentDetails.previous_school_board  ? studentDetails.previous_school_board : null;
  this.previous_class = studentDetails.previous_class ? studentDetails.previous_class : null;
  this.previous_school_year = studentDetails.previous_school_year ? studentDetails.previous_school_year : null;
  this.previous_class_percentage_grade = studentDetails.previous_class_percentage_grade ? studentDetails.previous_class_percentage_grade : null;
  this.academic_session = studentDetails.academic_session ? studentDetails.academic_session : null;
  this.mothertongue = studentDetails.mothertongue ? studentDetails.mothertongue : null;
  

};


  
const validateStudent = (studentDetails) => {

  const studentSchema = {
    first_name: Joi.string().trim().allow().required(),
    middle_name: Joi.string().trim().allow(null),
    last_name: Joi.string().trim().allow(null),
    father_name: Joi.string().trim().allow(null),
    mother_name: Joi.string().trim().allow(null),
    class_id: Joi.string().trim().allow().required(),
    gender_id: Joi.number().allow().required(),
    dob: Joi.string().trim().allow(null).required(),
    
    email_id: Joi.string().trim().allow(null),
    mobile_number: Joi.number().allow().required(),
    alternate_mobile_number: Joi.number().allow(null),
    nationality: Joi.string().trim().allow(null),
    religion: Joi.string().trim().allow(null),
    caste_category: Joi.string().trim().allow(null),
    caste: Joi.string().trim().allow(null),

    current_address: Joi.string().trim().allow().required(),
    current_address_state_id: Joi.number().allow().required(),
    current_address_district_id: Joi.number().allow().required(),
    current_address_city: Joi.string().trim().allow(null),
    current_address_pincode: Joi.number().allow().required(),
    

    permanent_address: Joi.string().trim().allow(null),
    permanent_address_state_id: Joi.number().allow(null),
    permanent_address_district_id: Joi.number().allow(null),
    permanent_address_city: Joi.string().trim().allow(null),
    permanent_address_pincode: Joi.number().allow(null),
   

    blood_group: Joi.string().trim().allow(null),
    father_email: Joi.string().trim().allow(null),
    father_occupation: Joi.string().trim().allow(null),
    mother_email: Joi.string().trim().allow(null),
    mother_occupation: Joi.string().trim().allow(null),    
    previous_school_name: Joi.string().trim().allow(null),
    previous_school_board: Joi.string().trim().allow(null),
    previous_class: Joi.string().trim().allow(null),
    previous_school_year: Joi.string().trim().allow(null),
    previous_class_percentage_grade: Joi.string().trim().allow(null),
    academic_session: Joi.string().trim().allow(null),
    mothertongue: Joi.string().trim().allow(null)
    
  };

  return Joi.validate(studentDetails, studentSchema);
};



  const Update_STUDENT_REGISTRATION = function (studentDetails){
    this.student_reg_id = parseInt(studentDetails.student_reg_id),
    this.first_name = JSONUTIL.capitalize(studentDetails.first_name);
    this.middle_name = JSONUTIL.capitalize(studentDetails.middle_name);
    this.last_name = JSONUTIL.capitalize(studentDetails.last_name);
    this.father_name = JSONUTIL.capitalize(studentDetails.father_name);
    this.mother_name = JSONUTIL.capitalize(studentDetails.mother_name);
    this.gender = studentDetails.gender;
    this.mobile_number = studentDetails.mobile_number;
    this.alternate_mobile_number = studentDetails.alternate_mobile_number;
    this.dob = studentDetails.dob;
    this.current_address = studentDetails.current_address;
    this.permanent_address = studentDetails.permanent_address;
    this.email_id = studentDetails.email_id;
    this.religion = studentDetails.religion;
    this.caste = studentDetails.caste;
    this.caste_category = studentDetails.caste_category;
    this.admit_in_class = studentDetails.admit_in_class;
    this.photo_url = studentDetails.photo_url;
    this.mothertounge = studentDetails.mothertounge;
    this.nationality = studentDetails.nationality;
    this.aadhaar_no = studentDetails.aadhaar_no;
    this.registration_date =studentDetails.registration_date;
    this.is_new = studentDetails.is_new ? 
    studentDetails.is_new:DB_STATUS.STATUS_MASTER.ACTIVE;
    this.status = studentDetails.status
    ?studentDetails.status:DB_STATUS.STATUS_MASTER.ACTIVE;
    this.updated_by = studentDetails.updated_by;
    this.date_created = studentDetails.date_created;
    this.date_modified = studentDetails.date_modified;
   };

   const validateUpdateStudent = (studentDetails) =>{

    const commonValidation = (fieldName, pattern) => {
        return Joi.string()
          .strict()
          .trim()
          .regex(pattern)
          .error(
            new Error(
                `{"errorCode":"STUDENTSERVC000", "error":"${ERRORCODE.STUDENT_REGISTRATION.STUDENTSERVC000}"}` 
            )
          );
      };
    const studentNamePattern = /^([ A-Za-z.\-()]){2,200}$/;
    const fatherNamePattern = /^([ A-Za-z.\-()]){2,200}$/;
    const motherNamePattern = /^([ A-Za-z.\-()]){2,200}$/;
    const addressPattern = /^([ A-Za-z.\-()]){10,200}$/;
  
    const studentSchema = {
    student_reg_id: Joi.number().required(),
    first_name: commonValidation('first_name', studentNamePattern),
    middle_name: commonValidation('middle_name',studentNamePattern),
    last_name: commonValidation('last_name',studentNamePattern),
    father_name: commonValidation('father_name', fatherNamePattern),
    mother_name: commonValidation('mother_name', motherNamePattern),
    current_address: commonValidation('current_address',addressPattern ),
    permanent_address: commonValidation('permanent_address', addressPattern),
    gender: Joi.number().integer().allow(null),
    aadhaar_no: Joi.number().integer().allow(null),
    mobile_number: Joi.number().integer().allow(null),
    alternate_mobile_number: Joi.number().integer().allow(null),
    email_id: Joi.string().trim().allow("", null),
    religion: Joi.string().trim().allow("", null),
    caste: Joi.string().trim().allow("", null),
    photo_url: Joi.string().trim().allow("", null),
    caste_category: Joi.string().trim().allow("", null),
    admit_in_class: Joi.string().trim().allow("", null),
    dob: Joi.number().integer().allow(null),
    mothertounge: Joi.string().trim().allow("", null),
    nationality: Joi.string().trim().allow("", null),
    registration_date: Joi.number().integer().allow(null),
    is_new: Joi.number().integer().allow(null),
    status: Joi.number().integer().allow(null),
    updated_by: Joi.number(),
    date_created: Joi.number().integer().allow(null),
    date_modified: Joi.number().integer().allow(null),
    school_id: Joi.number().integer().allow(null)
    };
  
    return Joi.validate(studentDetails, studentSchema);
  };

  module.exports = {
    STUDENT_REGISTRATION,
    Update_STUDENT_REGISTRATION,
    validateStudent,
    validateUpdateStudent

  };