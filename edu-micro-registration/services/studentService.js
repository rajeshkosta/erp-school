const {
  db,
  pg,
  redis,
  logger,
  queryUtility,
  JSONUTIL,
} = require("edu-micro-common");
const QUERY = require("../constants/QUERY");
const CONSTANT = require("../constants/CONST");
const ERRORCODE = require("../constants/ERRORCODE");
const moment = require("moment");

const checkStudentExist = async (aadhaar_no) => {
  try {
    const _query = {
      text: QUERY.STUDENT_REGISTRATION.checkStudentExist,
      values: [aadhaar_no],
    };

    const queryResult = await pg.executeQueryPromise(_query);
    return queryResult[0].count;
  } catch (error) {
    throw error;
  }
};



const addContactForm = async (contactFormDetails) => {
  try {
    const { school_id, name, email_address, mobile_number, message } = contactFormDetails;
    const query = {
      text: QUERY.STUDENT_REGISTRATION.insertContactFormQuery,
      values: [school_id, name, email_address, mobile_number, message]
    };
    const queryResult = await pg.executeQueryPromise(query);
    return queryResult;
  } catch (error) {
    throw new Error(error.message);
  }
};

const checkAccessKey = async (api_key) => {
  try {

    const query = {
      text: QUERY.STUDENT_REGISTRATION.checkAccessKey,
      values: [api_key]
    };
    const queryResult = await pg.executeQueryPromise(query);
    return queryResult;
  } catch (error) {
    throw new Error(error.message);
  }
}
const getSchoolAccessDetails = async (api_key) => {
  try {
    const _query = {
      text: QUERY.STUDENT_REGISTRATION.getSchoolAccessDetails,
      values: [api_key]
    };
    const queryResult = await pg.executeQueryPromise(_query);
    return queryResult;
  } catch (error) {
    throw error;
  }
}

const createStudent = async (studentDetails) => {
  try {

    console.log('studentDetails-----', studentDetails)

    const _query = {
      text: QUERY.STUDENT_REGISTRATION.createStudent,
      values: [
        studentDetails.first_name,
        studentDetails.middle_name,
        studentDetails.last_name,
        studentDetails.father_name,
        studentDetails.mother_name,
        studentDetails.class_id,
        studentDetails.gender_id,
        studentDetails.dob,
        studentDetails.email_id,
        studentDetails.mobile_number,
        studentDetails.alternate_mobile_number,
        studentDetails.nationality,
        studentDetails.religion,
        studentDetails.caste_category,
        studentDetails.caste,
        studentDetails.current_address,
        studentDetails.current_address_state_id,
        studentDetails.current_address_district_id,
        studentDetails.current_address_city,
        studentDetails.current_address_pincode,
        studentDetails.current_address_block_id,
        studentDetails.permanent_address,
        studentDetails.permanent_address_state_id,
        studentDetails.permanent_address_district_id,
        studentDetails.permanent_address_city,
        studentDetails.permanent_address_pincode,
        studentDetails.permanent_address_block_id,
        studentDetails.blood_group,
        studentDetails.father_email,
        studentDetails.father_occupation,
        studentDetails.mother_email,
        studentDetails.mother_occupation,
        studentDetails.previous_school_name,
        studentDetails.previous_school_board,
        studentDetails.previous_class,
        studentDetails.previous_school_year,
        studentDetails.previous_class_percentage_grade,
        studentDetails.academic_session,
        studentDetails.mothertongue,
        studentDetails.student_reg_number,
        studentDetails.school_id
      ],
    };

    console.log('_query-----', _query)

    const queryResult = await pg.executeQueryPromise(_query);
    return queryResult;
  } catch (error) {
    throw error;
  }
};


const checkStudentAvailable = async (studentDetails) => {
  try {

    console.log('studentDetails---', studentDetails)

    const _query = {
      text: QUERY.STUDENT_REGISTRATION.checkStudentAvailable,
      values: [studentDetails.first_name, studentDetails.gender_id, studentDetails.dob, studentDetails.mobile_number],
    };
    const queryResult = await pg.executeQueryPromise(_query);
    return queryResult[0].count;
  } catch (error) {
    throw error;
  }
}



updateStudent = async (studentDetails) => {
  try {
    let student_reg_id = studentDetails.student_reg_id;
    delete studentDetails.student_reg_id;
    let setQuery = queryUtility.convertObjectIntoUpdateQuery(studentDetails);
    let updateQuery = `${QUERY.STUDENT_REGISTRATION.updateStudent} ${setQuery} WHERE student_reg_id = $1`;

    console.log(updateQuery);

    const _query = {
      text: updateQuery,
      values: [student_reg_id]
    };
    const queryResult = await pg.executeQueryPromise(_query);
    return queryResult;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getSpecificStudentDetails = async (student_reg_id) => {
  try {
    const _query = {
      text: QUERY.STUDENT_REGISTRATION.getSpecificStudentDetails,
      values: [student_reg_id],
    };

    const queryResult = await pg.executeQueryPromise(_query);
    return queryResult && queryResult.length > 0 ? queryResult[0] : null;
  } catch (error) {
    console.log(error);
    throw error;
  }
};



const importStudents = async (studentList, school_id, academic_year_id, user_id) => {
  try {

    for (const student of studentList) {
      console.log(student);
      student.name = capitalizeString(student.name);
      student.address = capitalizeString(student.address);
      student.father_name = capitalizeString(student.father_name);
      student.mother_name = capitalizeString(student.mother_name);
      student.academic_year_id =academic_year_id;
      await addStudentData(student, school_id, academic_year_id, user_id);
    }

    return studentList
  } catch (error) {
    throw error;
  }
}

function capitalizeString(str) {
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}


const addStudentData = async (student, school_id, academic_year_id, user_id) => {
  try {

    const query = `select * from importStudent('${JSON.stringify(student)}', ${school_id}, ${user_id})`;
    console.log(query);
    const result = await pg.executeQueryPromise(query);
    return result;

  } catch (error) {
    throw error;
  }
}

module.exports = {
  addContactForm,
  checkAccessKey,
  getSchoolAccessDetails,
  checkStudentExist,
  createStudent,
  updateStudent,
  getSpecificStudentDetails,
  checkStudentAvailable,
  importStudents
};