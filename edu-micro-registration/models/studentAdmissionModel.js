
const moment=require("moment");
const Joi = require("joi");
const { JSONUTIL, DB_STATUS } = require("edu-micro-common");
const ERRORCODE = require("../constants/ERRORCODE.js");



const studentAdmission = function (studentDetails) {
  // this.full_name = studentDetails.full_name;
  this.first_name = studentDetails.first_name ? studentDetails.first_name : null;
  this.middle_name = studentDetails.middle_name ? studentDetails.middle_name : null;
  this.last_name = studentDetails.last_name ? studentDetails.last_name : null;
  this.gender_id = studentDetails.gender_id ? studentDetails.gender_id : null;
  this.dob = studentDetails.dob ? studentDetails.dob : null;
  this.email_id = studentDetails.email_id ? studentDetails.email_id : null;
  this.mobile_number = studentDetails.mobile_number ? studentDetails.mobile_number : null;
  this.alternate_mobile_number = studentDetails.alternate_mobile_number ? studentDetails.alternate_mobile_number : null;
  this.blood_group = studentDetails.blood_group ? studentDetails.blood_group : null;
  this.nationality = studentDetails.nationality ? studentDetails.nationality : null;
  this.birth_certificate_no = studentDetails.birth_certificate_no ? studentDetails.birth_certificate_no : null;
  this.aadhaar_no = studentDetails.aadhaar_no ? studentDetails.aadhaar_no : null;
  this.religion = studentDetails.religion ? studentDetails.religion : null;
  this.caste_category = studentDetails.caste_category ? studentDetails.caste_category : null;
  this.caste = studentDetails.caste ? studentDetails.caste : null;
  this.father_name = studentDetails.father_name ? studentDetails.father_name : null;
  this.father_email = studentDetails.father_email ? studentDetails.father_email : null;
  this.father_occupation = studentDetails.father_occupation ? studentDetails.father_occupation : null;
  this.mother_name = studentDetails.mother_name ? studentDetails.mother_name : null;
  this.mother_email = studentDetails.mother_email ? studentDetails.mother_email : null;
  this.mother_occupation = studentDetails.mother_occupation ? studentDetails.mother_occupation : null;
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
  this.previous_school_name = studentDetails.previous_school_name ? studentDetails.previous_school_name : null;
  this.previous_school_board = studentDetails.previous_school_board  ? studentDetails.previous_school_board : null;
  this.previous_class = studentDetails.previous_class ? studentDetails.previous_class : null;
  this.previous_school_year = studentDetails.previous_school_year ? studentDetails.previous_school_year : null;
  this.previous_class_percentage_grade = studentDetails.previous_class_percentage_grade ? studentDetails.previous_class_percentage_grade : null;
  this.academic_session = studentDetails.academic_session ? studentDetails.academic_session : null;
  this.admission_date = studentDetails.admission_date ? studentDetails.admission_date : null;
  this.class_id = studentDetails.class_id ? studentDetails.class_id : null;
  // this.section_id = studentDetails.section_id;
  this.mothertongue = studentDetails.mothertongue ? studentDetails.mothertongue : null;
  this.transport_opted = studentDetails.transport_opted ? studentDetails.transport_opted : null;
  this.parent_id = studentDetails.parent_id ? studentDetails.parent_id : null;
  this.status = studentDetails.status ? studentDetails.status : DB_STATUS.STATUS_MASTER.ACTIVE;
  this.student_reg_id = studentDetails.student_reg_id ? studentDetails.student_reg_id : null;
  this.guardian_name = studentDetails.guardian_name ? studentDetails.guardian_name : null;
  this.guardian_mobile_no = studentDetails.guardian_mobile_no ? studentDetails.guardian_mobile_no : null;
  this.guardian_email_id = studentDetails.guardian_email_id ? studentDetails.guardian_email_id : null;
  this.guardian_address = studentDetails.guardian_address ? studentDetails.guardian_address : null;
  this.guardian_relation= studentDetails.guardian_relation ? studentDetails.guardian_relation : null;

  this.aadhar_document = studentDetails.aadhar_document ? studentDetails.aadhar_document : null;
  this.birth_certificate=studentDetails.birth_certificate? studentDetails.birth_certificate:null;
  this.student_photo=studentDetails.student_photo? studentDetails.student_photo:null;
  this.father_photo=studentDetails.father_photo? studentDetails.father_photo:null;
  this.mother_photo=studentDetails.mother_photo? studentDetails.mother_photo:null;
  this.utc_certificate=studentDetails.utc_certificate? studentDetails.utc_certificate:null;
};


const validateStudent = (studentDetails) => {

  const studentSchema = {
    // full_name: Joi.string().trim().allow("", null),
    first_name: Joi.string().trim().allow(null),
    middle_name: Joi.string().trim().allow(null),
    last_name: Joi.string().trim().allow(null),
    gender_id: Joi.number().allow(null),
    dob: Joi.string().trim().allow(null),
    email_id: Joi.string().trim().allow(null),
    mobile_number: Joi.number().integer().allow(null),
    alternate_mobile_number: Joi.number().integer().allow(null),
    blood_group: Joi.string().trim().allow(null),
    nationality: Joi.string().trim().allow(null),
    birth_certificate_no: Joi.string().trim().allow(null),
    aadhaar_no: Joi.number().integer().allow(null),
    religion: Joi.string().trim().allow(null),
    caste_category: Joi.string().trim().allow(null),
    caste: Joi.string().trim().allow(null),

    father_name: Joi.string().trim().allow(null),
    father_email: Joi.string().trim().allow(null),
    father_occupation: Joi.string().trim().allow(null),
    mother_name: Joi.string().trim().allow(null),
    mother_email: Joi.string().trim().allow(null),
    mother_occupation: Joi.string().trim().allow(null),
    current_address: Joi.string().trim().allow(null),
    current_address_state_id: Joi.number().integer().allow(null),
    current_address_district_id: Joi.number().integer().allow(null),
    current_address_city: Joi.string().trim().allow(null),
    current_address_pincode: Joi.number().integer().allow(null),

    permanent_address: Joi.string().trim().allow(null),
    permanent_address_state_id: Joi.number().integer().allow(null),
    permanent_address_district_id: Joi.number().integer().allow(null),
    permanent_address_city: Joi.string().trim().allow(null),
    permanent_address_pincode: Joi.number().integer().allow(null),
    previous_school_name: Joi.string().trim().allow(null),
    previous_school_board: Joi.string().trim().allow(null),
    previous_class: Joi.string().trim().allow(null),
    previous_school_year: Joi.number().allow(null),
    previous_class_percentage_grade: Joi.string().trim().allow(null),

    academic_session: Joi.string().trim().allow(null),
    admission_date: Joi.string().trim().allow(null),
    class_id: Joi.number().allow(null),
    //section_id: Joi.number().integer().allow("",null),
    mothertongue: Joi.string().trim().allow(null),
    transport_opted: Joi.string().trim().allow(null),
    parent_id: Joi.number().integer().allow(null),
    status: Joi.number().integer().allow(null),
    student_reg_id: Joi.number().integer().allow(null),
    guardian_name: Joi.string().trim().allow(null),
    guardian_mobile_no: Joi.string().trim().allow(null),
    guardian_email_id: Joi.string().trim().allow(null),
    guardian_address: Joi.string().trim().allow(null),
    guardian_relation: Joi.string().trim().allow(null),

    aadhar_document:Joi.string().trim().allow(null),
    birth_certificate:Joi.string().trim().allow(null),
    student_photo:Joi.string().trim().allow(null),
    father_photo:Joi.string().trim().allow(null),
    mother_photo:Joi.string().trim().allow(null),
    utc_certificate:Joi.string().trim().allow(null)

  };

  return Joi.validate(studentDetails, studentSchema);
};


const isValidDate = (date) => {
  try {
      const isValid = moment(date, 'YYYY-MM-DD', true).isValid();
      return isValid;
  } catch (error) {
      return false;
  }
}

const updateStudentAdmission = function (studentDetails) {
  this.student_admission_id = studentDetails.student_admission_id;
  this.first_name = studentDetails.first_name ? studentDetails.first_name : null;
  this.middle_name = studentDetails.middle_name ? studentDetails.middle_name : null;
  this.last_name = studentDetails.last_name ? studentDetails.last_name : null;
  this.gender_id = studentDetails.gender_id ? studentDetails.gender_id : null;
  this.dob = studentDetails.dob ? studentDetails.dob : null;
  this.email_id = studentDetails.email_id ? studentDetails.email_id : null;
  this.mobile_number = studentDetails.mobile_number ? studentDetails.mobile_number : null;
  this.alternate_mobile_number = studentDetails.alternate_mobile_number ? studentDetails.alternate_mobile_number : null;
  this.blood_group = studentDetails.blood_group ? studentDetails.blood_group : null;
  this.nationality = studentDetails.nationality ? studentDetails.nationality : null;
  this.birth_certificate_no = studentDetails.birth_certificate_no ? studentDetails.birth_certificate_no : null;
  this.aadhaar_no = studentDetails.aadhaar_no ? studentDetails.aadhaar_no : null;
  this.religion = studentDetails.religion ? studentDetails.religion : null;
  this.caste_category = studentDetails.caste_category ? studentDetails.caste_category : null;
  this.caste = studentDetails.caste ? studentDetails.caste : null;
  this.father_name = studentDetails.father_name ? studentDetails.father_name : null;
  this.father_email = studentDetails.father_email ? studentDetails.father_email : null;
  this.father_occupation = studentDetails.father_occupation ? studentDetails.father_occupation : null;
  this.mother_name = studentDetails.mother_name ? studentDetails.mother_name : null;
  this.mother_email = studentDetails.mother_email ? studentDetails.mother_email : null;
  this.mother_occupation = studentDetails.mother_occupation ? studentDetails.mother_occupation : null;

 
  this.current_address = studentDetails.current_address ? studentDetails.current_address : null;
  this.current_address_state_id = studentDetails.current_address_state_id ? studentDetails.current_address_state_id : null;
  this.current_address_district_id = studentDetails.current_address_district_id ? studentDetails.current_address_district_id : null;
  this.current_address_city = studentDetails.current_address_city ? studentDetails.current_address_city : null;
  this.current_address_pincode = studentDetails.current_address_pincode ? studentDetails.current_address_pincode : null;
  this.permanent_address = studentDetails.permanent_address ? studentDetails.permanent_address : null;
  this.permanent_address_state_id = studentDetails.permanent_address_state_id ? studentDetails.permanent_address_state_id : null;
  this.permanent_address_district_id = studentDetails.permanent_address_district_id ? studentDetails.permanent_address_district_id : null;
  this.permanent_address_city = studentDetails.permanent_address_city ? studentDetails.permanent_address_city : null;
  this.permanent_address_pincode = studentDetails.permanent_address_pincode ? studentDetails.permanent_address_pincode : null;
  this.previous_school_name = studentDetails.previous_school_name ? studentDetails.previous_school_name : null;
  this.previous_school_board = studentDetails.previous_school_board ? studentDetails.previous_school_board : null;
  this.previous_class = studentDetails.previous_class ? studentDetails.previous_class : null;
  this.previous_school_year = studentDetails.previous_school_year ? studentDetails.previous_school_year : null;
  this.previous_class_percentage_grade = studentDetails.previous_class_percentage_grade ? studentDetails.previous_class_percentage_grade : null;
  this.academic_session = studentDetails.academic_session ? studentDetails.academic_session : null;
  this.admission_date = studentDetails.admission_date ? studentDetails.admission_date : null;
  this.class_id = studentDetails.class_id ? studentDetails.class_id : null;
  this.mothertongue = studentDetails.mothertongue ? studentDetails.mothertongue : null;
  this.transport_opted = studentDetails.transport_opted ? studentDetails.transport_opted : null;
  this.status = studentDetails.status ? studentDetails.status : DB_STATUS.STATUS_MASTER.ACTIVE;
 
};

const validateUpdateStudentAdmission = (studentDetails) => {

  const studentSchema = {
    student_admission_id: Joi.number().integer().required(),
    first_name: Joi.string().trim().allow(null),
    middle_name: Joi.string().trim().allow(null),
    last_name: Joi.string().trim().allow(null),
    gender_id: Joi.number().allow(null),
    dob: Joi.string().trim().allow(null),
    email_id: Joi.string().trim().allow(null),

    mobile_number: Joi.number().integer().allow(null),
    alternate_mobile_number: Joi.number().integer().allow(null),
    blood_group: Joi.string().trim().allow(null),
    nationality: Joi.string().trim().allow(null),
    birth_certificate_no: Joi.string().trim().allow(null),
    aadhaar_no: Joi.string().trim().allow(null),
    religion: Joi.string().trim().allow(null),
    caste_category: Joi.string().trim().allow(null),
    caste: Joi.string().trim().allow(null),
    father_name: Joi.string().trim().allow(null),
    father_email: Joi.string().trim().allow(null),
    father_occupation: Joi.string().trim().allow(null),
    mother_name: Joi.string().trim().allow(null),
    mother_email: Joi.string().trim().allow(null),
    mother_occupation: Joi.string().trim().allow(null),

    current_address: Joi.string().trim().allow(null),
    current_address_state_id: Joi.number().integer().allow(null),
    current_address_district_id: Joi.number().integer().allow(null),
    current_address_city: Joi.string().trim().allow(null),
    current_address_pincode: Joi.number().integer().allow(null),
    permanent_address: Joi.string().trim().allow(null),
    permanent_address_state_id: Joi.number().integer().allow(null),
    permanent_address_district_id: Joi.number().integer().allow(null),
    permanent_address_city: Joi.string().trim().allow(null),
    permanent_address_pincode: Joi.number().integer().allow(null),
    previous_school_name: Joi.string().trim().allow(null),
    previous_school_board: Joi.string().trim().allow(null),
    previous_class: Joi.string().trim().allow(null),
    previous_school_year: Joi.number().allow(null),
    previous_class_percentage_grade: Joi.string().trim().allow(null),
    academic_session: Joi.string().trim().allow(null),
    admission_date: Joi.string().trim().allow(null),
    class_id: Joi.number().allow(null),
    mothertongue: Joi.string().trim().allow(null),
    transport_opted: Joi.string().trim().allow(null),
    status: Joi.number().integer().allow(null)
  

  };

  return Joi.validate(studentDetails, studentSchema);
};

module.exports = {
  studentAdmission,
  validateStudent,
  updateStudentAdmission,
  validateUpdateStudentAdmission,
  isValidDate
};

