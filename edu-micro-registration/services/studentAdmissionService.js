const { db, pg, redis, logger, queryUtility, JSONUTIL } = require("edu-micro-common");
const QUERY = require("../constants/QUERY");
const CONSTANT = require("../constants/CONST");
const ERRORCODE = require("../constants/ERRORCODE");
const moment = require("moment");


const generateUniqueAdmissionNumber = async (studentDetails) => {
  try {
    function generateUniqueKey(yearOfBirth, aadhar, admissionYear) {
      // Extract the last two digits of the year of birth

      console.log('dsfadsf===', yearOfBirth, aadhar, admissionYear)
      const yearOfBirthLastTwo = yearOfBirth.getFullYear().toString().slice(-2);

      // Extract the last four digits of the Aadhar number
      const aadharLastFour = aadhar.slice(-4);

      // Extract the last two digits of the admission year
      const admissionYearLastTwo = admissionYear.toString().slice(-2);

      // Generate a 4-digit random number
      const randomFourDigits = String(Math.floor(1000 + Math.random() * 9000));

      // Concatenate all components to form the final key
      const key = yearOfBirthLastTwo + aadharLastFour + admissionYearLastTwo + randomFourDigits;

      return key;
    }

    // Example usage:
    var AdmissionDate = new Date(studentDetails.admission_date);
    var admissionYear = parseInt(AdmissionDate.getFullYear());

    console.log('AdmissionDate==', AdmissionDate, admissionYear)

    var BirthDate = new Date(studentDetails.dob);
    console.log('BirthDate---', BirthDate)
    var yearOfBirth = BirthDate.getFullYear();
    console.log('BirthDate==', BirthDate, yearOfBirth)
    //const yearOfBirth = new Date('2000-01-15'); // Replace with actual year of birth
    const aadhar = studentDetails.aadhaar_no; // Replace with actual Aadhar number
    // const admissionYear = studentDetails.admission_date; // Replace with actual admission year

    const uniqueKey = generateUniqueKey(yearOfBirth, aadhar, admissionYear);
    console.log('uniqueKey====', uniqueKey);
    return uniqueKey
    //

  }
  catch (err) {
    throw err;
  }
};



const checkStudestudentDetailsntExistById = async (student_admission_id) => {
  try {
    const _query = {
      text: QUERY.STUDENT_ADMISSION.checkStudentExistById,
      values: [student_admission_id],
    };
    const queryResult = await pg.executeQueryPromise(_query);
    return queryResult[0].count;
  } catch (error) {
    throw error;
  }
};



const checkStudentExist = async (studentDetails) => {
  try {

    const _query = {
      text: QUERY.STUDENT_ADMISSION.checkStudentAvailavle,
      values: [studentDetails.first_name, studentDetails.gender_id, studentDetails.dob, studentDetails.mobile_number, studentDetails.school_id],
    };
    const queryResult = await pg.executeQueryPromise(_query);
    return queryResult[0].count;
  } catch (error) {
    throw error;
  }
}

const createStudentAdmission = async (studentDetails) => {
  try {

    const _query = `select insert_student_admission('${JSON.stringify(studentDetails)}')`;
    const result = await pg.executeQueryPromise(_query);

    return result;
  } catch (error) {
    throw error;
  }
};


const insertDocument = async (admission_id, studentDetails) => {

  try {

    const aadharDocument = studentDetails.aadhar_document ? `'${studentDetails.aadhar_document}'` : null;
    const birthCertificate = studentDetails.birth_certificate ? `'${studentDetails.birth_certificate}'` : null;
    const studentPhoto = studentDetails.student_photo ? `'${studentDetails.student_photo}'` : null;
    const fatherPhoto = studentDetails.father_photo ? `'${studentDetails.father_photo}'` : null;
    const motherPhoto = studentDetails.mother_photo ? `'${studentDetails.mother_photo}'` : null;
    const utcCertificate = studentDetails.utc_certificate ? `'${studentDetails.utc_certificate}'` : null;

    const _query = `select insert_student_document(${admission_id},${aadharDocument},${birthCertificate},
      ${studentPhoto},${fatherPhoto},${motherPhoto},${utcCertificate},${studentDetails.created_by},${studentDetails.updated_by})`;

    const result = await pg.executeQueryPromise(_query);

    return result;
  } catch (error) {
    throw error;
  }
}

const updateStudent = async (studentDetails) => {
  try {
    delete studentDetails.aadhar_document;
    delete studentDetails.birth_certificate;
    delete studentDetails.student_photo;
    delete studentDetails.father_photo;
    delete studentDetails.mother_photo;
    delete studentDetails.utc_certificate;

    let setQuery = queryUtility.convertObjectIntoUpdateQuery(studentDetails);
    let updateQuery = `${QUERY.STUDENT_ADMISSION.updateStudent} ${setQuery} WHERE student_admission_id = $1 and school_id = $2`;

    const _query = {
      text: updateQuery,
      values: [studentDetails.student_admission_id, studentDetails.school_id]
    };

    console.log('_query-----',_query)
    const queryResult = await pg.executeQueryPromise(_query);
    return queryResult;
  } catch (error) {
    throw error;
  }
};



const getStudentDetailsByAdmissionId = async (student_admission_id) => {
  try {
    const _query = {
      text: QUERY.STUDENT_ADMISSION.getStudentDetailsByAdmissionId,
      values: [student_admission_id],
    };

    const queryResult = await pg.executeQueryPromise(_query);
    return queryResult && queryResult.length > 0 ? queryResult[0] : null;
  } catch (error) {
    throw error;
  }
};


const getStudentDocumentByAdmissionId = async (student_admission_id) => {
  try {
    const _query = {
      text: QUERY.STUDENT_ADMISSION.getStudentDocumentByAdmissionId,
      values: [student_admission_id],
    };

    const queryResult = await pg.executeQueryPromise(_query);
    return queryResult;
  } catch (error) {
    throw error;
  }
};


const getStudentDataById = async (student_admission_id, academic_year_id) => {
  try {
    const _query = {
      text: QUERY.STUDENT_ADMISSION.getStudentDataById,
      values: [student_admission_id, academic_year_id],
    };
    const queryResult = await pg.executeQueryPromise(_query);
    return queryResult;
  } catch (error) {
    throw error;
  }
};


const mapStudentDocumentObject = async (studentDetails, studentDocumentDetails) => {
  try {

    studentDocumentDetails.forEach(element => {

      if (element.document_name == "AADHAR") {
        studentDetails.aadhar_document = element.document_path;
        studentDetails.aadhar_document_cdn = `${process.env.CDN_CONTEXT_PATH}/api/v1/admin/cdn/fileDisplay?file_name=${studentDetails.aadhar_document}`;
      }

      if (element.document_name == "BIRTH_CERTIFICATE") {
        studentDetails.birth_certificate = element.document_path;
        studentDetails.birth_certificate_cdn = `${process.env.CDN_CONTEXT_PATH}/api/v1/admin/cdn/fileDisplay?file_name=${studentDetails.birth_certificate}`;
      }

      if (element.document_name == "STUDENT_PHOTO") {
        studentDetails.student_photo = element.document_path;
        studentDetails.student_photo_cdn = `${process.env.CDN_CONTEXT_PATH}/api/v1/admin/cdn/fileDisplay?file_name=${studentDetails.student_photo}`;
      }

      if (element.document_name == "FATHER_PHOTO") {
        studentDetails.father_photo = element.document_path;
        studentDetails.father_photo_cdn = `${process.env.CDN_CONTEXT_PATH}/api/v1/admin/cdn/fileDisplay?file_name=${studentDetails.father_photo}`;
      }

      if (element.document_name == "MOTHER_PHOTO") {
        studentDetails.mother_photo = element.document_path;
        studentDetails.mother_photo_cdn = `${process.env.CDN_CONTEXT_PATH}/api/v1/admin/cdn/fileDisplay?file_name=${studentDetails.mother_photo}`;
      }

      if (element.document_name == "UTC_CERTIFICATE") {
        studentDetails.utc_certificate = element.document_path;
        studentDetails.utc_certificate_cdn = `${process.env.CDN_CONTEXT_PATH}/api/v1/admin/cdn/fileDisplay?file_name=${studentDetails.utc_certificate}`;
      }
    });

    return studentDetails
  }
  catch (err) {
    throw err;
  }

}





// const getAllStudentList = async (reqParams) => {
//   try {
//     let key = `Student-Admission-Data`;

//      let cte_class_whereClause = ` WHERE 1=1`;
//      let cte_student_whereClause = ` WHERE 1=1`;
//      let cte_fee_whereClause = ` WHERE 1=1`;
//      let whereClause = ` WHERE 1=1`;

//     let limitClause = "";
//     let offsetClause = "";
//     let data, count;
//     let isCached = false;

//     if (reqParams.status) {
//       key += `|Status:${reqParams.status}`;
//        //-------------------
//           whereClause += ` AND status=${reqParams.status}`;

//      cte_student_whereClause += ` AND status=${reqParams.status}`;
//      cte_class_whereClause += ` AND status=${reqParams.status}`;
//      cte_fee_whereClause += ` AND status=${reqParams.status}`;
//     }

//     if (reqParams.school_id) {
//       key += `|School_id:${reqParams.school_id}`;
//       //-----------
//           whereClause += ` AND school_id=${reqParams.school_id}`;
//      cte_student_whereClause += ` AND sa.school_id=${reqParams.school_id}`;
//     }

//     if (reqParams.academic_year_id) {
//       key += `|Academic_year_id:${reqParams.academic_year_id}`;
//          // ------------
//          whereClause += ` AND academic_session='${reqParams.academic_year_id}'`;

//      cte_student_whereClause += ` AND sa.academic_session='${reqParams.academic_year_id}'`
//      cte_class_whereClause += ` AND ay.academic_year_id=${reqParams.academic_year_id}`;
//      cte_fee_whereClause += ` AND cf.academic_year_id=${reqParams.academic_year_id}`;
//     }

//     if (reqParams.pageSize) {
//       key += `|Size:${reqParams.pageSize}`;
//       limitClause = ` LIMIT ${reqParams.pageSize}`;
//     }

//     if (reqParams.currentPage) {
//       key += `|Offset:${reqParams.currentPage}`;
//       offsetClause += ` OFFSET ${reqParams.currentPage}`;
//     }

//     const cachedData = await redis.GetKeyRedis(key);

//     //console.log('whereClause-----',whereClause)
//     //console.log('reqParams---',reqParams)

//     const isStudentAdmissionUpdated = await studentAddUpdateCheck(whereClause);

//     isCached = cachedData && isStudentAdmissionUpdated == 0 ? true : false;

//     if (isCached) {
//       data = JSON.parse(cachedData);
//       const cachedCount = await redis.GetKeyRedis(`Count|${key}`);
//       console.log(cachedCount);
//       count = parseInt(JSON.parse(cachedCount));
//       return { data, count };
//     }

//     const replaceObj = {
//       //-------------
//       "#WHERE_CLAUSE#": whereClause,

//       "#CTE_CLASS_WHERE_CLAUSE#": cte_class_whereClause,
//       "#CTE_STUDENT_WHERE_CLAUSE#": cte_student_whereClause,
//       "#CTE_FEE_WHERE_CLAUSE#": cte_fee_whereClause,
//       "#LIMIT_CLAUSE#": limitClause,
//       "#OFFSET_CLAUSE#": offsetClause,
//     };
//     //console.log('replaceObj---',replaceObj);

//     const _query = JSONUTIL.replaceAll(QUERY.STUDENT_ADMISSION.getAllStudentList, replaceObj);

//     //console.log('_query----whereClause-',whereClause)

//     count = await getAllStudentCount(whereClause);
//    //count = await getAllStudentCount(cte_student_whereClause);
//    //console.log('count0------',count)
//     redis
//       .SetRedis(`Count|${key}`, count, CONSTANT.CACHE_TTL.student.LONG)
//       .then()
//       .catch((err) => console.log(err));

//       console.log('_query---------0000',_query)
//     data = await pg.executeQueryPromise(_query);
//     redis
//       .SetRedis(key, data, CONSTANT.CACHE_TTL.student.LONG)
//       .then()
//       .catch((err) => console.log(err));

//     return { data, count };
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// }



const getAllStudentList = async (reqParams) => {
  try {
    let key = `Student-Admission-Data`;

    let cte_class_whereClause = ` WHERE 1=1`;
    let cte_student_whereClause = ` WHERE 1=1`;
    let cte_fee_whereClause = ` WHERE 1=1`;
    let whereClause = ` WHERE 1=1`;
    let cte_WhereClause = ` WHERE 1=1`;
   
    let limitClause = "";
    let offsetClause = "";
    let data, count;
    let isCached = false;

    if (reqParams.status) {
      key += `|Status:${reqParams.status}`;
      //-------------------
      whereClause += ` AND status=${reqParams.status}`;

      cte_student_whereClause += ` AND status=${reqParams.status}`;
      cte_class_whereClause += ` AND status=${reqParams.status}`;
      cte_fee_whereClause += ` AND status=${reqParams.status}`;

    }

    if (reqParams.school_id) {
      key += `|School_id:${reqParams.school_id}`;
      //-----------
      whereClause += ` AND school_id=${reqParams.school_id}`;
      cte_student_whereClause += ` AND sa.school_id=${reqParams.school_id}`;
    }

    if (reqParams.academic_year_id) {
      key += `|Academic_year_id:${reqParams.academic_year_id}`;
      // ------------
      whereClause += ` AND academic_session='${reqParams.academic_year_id}'`;

      //  cte_student_whereClause += ` AND sa.academic_session='${reqParams.academic_year_id}'`
      cte_class_whereClause += ` AND ay.academic_year_id=${reqParams.academic_year_id}`;
      cte_fee_whereClause += ` AND cf.academic_year_id=${reqParams.academic_year_id}`;
    }

    if (reqParams.student_std_id) {
      key += `|Student_std_id:${reqParams.student_std_id}`;
      cte_WhereClause += ` AND cl.class_id=${reqParams.student_std_id}`

    }
    // console.log('cte_WhereClause--',cte_WhereClause)
    if (reqParams.student_section_id) {
      key += `|Student_section_id:${reqParams.student_section_id}`;
      cte_WhereClause += ` AND cl.section_id =${reqParams.student_section_id}`

    }

    if (reqParams.student_name) {
      key += `|Student_name:${reqParams.student_name}`;
      //cte_WhereClause += ` AND cs.full_name Ilike '${reqParams.student_name}'`
      cte_WhereClause += ` AND cs.full_name ILIKE ${reqParams.student_name ? `'%${reqParams.student_name}%'` : "''"}`
    }

    if (reqParams.student_admission_number) {
      key += `|Student_student_admission_number:${reqParams.student_admission_number}`
      cte_WhereClause += ` AND cs.student_admission_number ='${reqParams.student_admission_number}'`
    }

   


    // if (reqParams.pageSize) {
    //   key += `|Size:${reqParams.pageSize}`;
    //   limitClause = ` LIMIT ${reqParams.pageSize}`;
    // }

    if (reqParams.currentPage) {
      key += `|Offset:${reqParams.currentPage}`;
      offsetClause += ` OFFSET ${reqParams.currentPage}`;
    }




    const replaceObj = {
      //-------------
      "#WHERE_CLAUSE#": whereClause,
      "#CTE_CLAUSE#": cte_WhereClause,

      "#CTE_CLASS_WHERE_CLAUSE#": cte_class_whereClause,
      "#CTE_STUDENT_WHERE_CLAUSE#": cte_student_whereClause,
      "#CTE_FEE_WHERE_CLAUSE#": cte_fee_whereClause,
      "#LIMIT_CLAUSE#": limitClause,
      "#OFFSET_CLAUSE#": offsetClause,
    };
   
    let where = ` AND (date_created >= NOW() - INTERVAL '5 minutes' OR date_modified >= NOW() - INTERVAL '5 minutes')`;
    
    const cachedData = await redis.GetKeyRedis(key);
//console.log('1111111111111111111',replaceObj)

    const isStudentAdmissionUpdated = await studentAddUpdateCheck(replaceObj,where);
   // console.log('222222222222222',replaceObj)
   
    isCached = cachedData && isStudentAdmissionUpdated == 0 ? true : false;

    if (isCached) {
      data = JSON.parse(cachedData);
      const cachedCount = await redis.GetKeyRedis(`Count|${key}`);
      console.log(cachedCount);
      count = parseInt(JSON.parse(cachedCount));
      return { data, count };
    }

    

    const _query = JSONUTIL.replaceAll(QUERY.STUDENT_ADMISSION.getAllStudentList, replaceObj);

   //console.log('getAllStudentList_query----',_query)

    count = await getAllStudentCount(replaceObj);

    redis
      .SetRedis(`Count|${key}`, count, CONSTANT.CACHE_TTL.student.LONG)
      .then()
      .catch((err) => console.log(err));

    data = await pg.executeQueryPromise(_query);

    redis
      .SetRedis(key, data, CONSTANT.CACHE_TTL.student.LONG)
      .then()
      .catch((err) => console.log(err));

    return { data, count };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

  const getAllStudentCount = async (replaceObj) => {
  try {
 
   const _query = JSONUTIL.replaceAll(QUERY.STUDENT_ADMISSION.getAllStudentCount, replaceObj);

    console.log('getAllStudentCount_query----',_query)
    const queryResult = await pg.executeQueryPromise(_query);
    return parseInt(queryResult[0].count);

  } catch (error) {
    throw error;
  }
}


const studentAddUpdateCheck = async (replaceObj,where) => {
  try {
   
    const _query = JSONUTIL.replaceAll(QUERY.STUDENT_ADMISSION.getAllStudentCount, replaceObj,where);
 
   // console.log('studentAddUpdateCheck--------------',_query)
    const queryResult = await pg.executeQueryPromise(_query);
   // console.log('queryResult_studentAddUpdateCheck-------------',queryResult)
    return parseInt(queryResult[0].count);
  } catch (error) {
    throw error;
  }
};

const getStudentForAllocation = async (reqParams) => {
  try {
    const cacheKey = `STUD_ALLOC|School:${reqParams.school_id}|Academic:${reqParams.academic_year_id}|Std:${reqParams.class_id}`;
    let isCached = false;
    let data;
    console.log(cacheKey);

    const cachedData = await redis.GetKeyRedis(cacheKey);
    const isStudentForAllocationUpdated = await checkStudentForAllocationUpdated(reqParams);

    isCached = cachedData && !isStudentForAllocationUpdated ? true : false;
    if (isCached) {
      data = JSON.parse(cachedData);
      return data;
    }

    const _query = `with cte_classroom as (
      select CS.student_admission_id from m_classroom_student CS
      inner join m_classroom C on C.classroom_id = CS.classroom_id 
      inner join m_standard ST on ST.std_id = C.class_id 
      inner join m_academic_year Y on Y.academic_year_id  = C.academic_year_id 
      where ST.std_id = ${reqParams.class_id} and C.academic_year_id = ${reqParams.academic_year_id})
      SELECT SA.student_admission_id, SA.school_id, SA.student_admission_number,
      SA.first_name, SA.middle_name, SA.last_name, SA.gender_id, SA.dob,SA.father_name cc.*
      FROM m_student_admission SA
      LEFT JOIN cte_classroom CC ON CC.student_admission_id = SA.student_admission_id 
      WHERE SA.school_id = ${reqParams.school_id} 
      AND SA.class_id = ${reqParams.class_id}
      AND SA.academic_session::INT = ${reqParams.academic_year_id}
      and CC.student_admission_id is NULL
      ORDER BY SA.first_name;`

    const queryResult = await pg.executeQueryPromise(_query);

    if (queryResult.length > 0) {
      redis.SetRedis(cacheKey, queryResult, CONSTANT.CACHE_TTL.student.SHORT).then().catch((err) => console.log(err));
    }
    return queryResult;

  } catch (error) {
    console.log(error);
    throw error;
  }
}


const checkStudentForAllocationUpdated = async (reqParams) => {
  try {

    const queryClassStudent = `select count(*) AS count from m_classroom_student CS
    inner join m_classroom C on C.classroom_id = CS.classroom_id 
    inner join m_standard ST on ST.std_id = C.class_id 
    inner join m_academic_year Y on Y.academic_year_id = C.academic_year_id 
    where ST.std_id = ${reqParams.class_id} and C.academic_year_id = ${reqParams.academic_year_id}
    AND (cs.date_created >= NOW() - INTERVAL '5 minutes' OR cs.date_modified >= NOW() - INTERVAL '5 minutes')`;
    const queryClassStudentResult = await pg.executeQueryPromise(queryClassStudent);


    const queryAdmissionStudent = `select count(*) AS count from m_student_admission SA
    WHERE SA.school_id = ${reqParams.school_id} AND SA.class_id = 7 AND SA.academic_session::INT = 7 
    AND (SA.date_created >= NOW() - INTERVAL '5 minutes' OR SA.date_modified >= NOW() - INTERVAL '5 minutes')`;
    const queryAdmissionStudentResult = await pg.executeQueryPromise(queryAdmissionStudent);

    return parseInt(queryClassStudentResult[0].count) > 0 || parseInt(queryAdmissionStudentResult[0].count) > 0 ? true : false;

  } catch (error) {
    throw error;
  }
};


const getPhotoUrlForStudentList = async (studentList) => {
  try {
    for (const student of studentList) {
      let presignedURL = null;
      if (student.document_path)
        presignedURL = await minioUtil.presignedGetObject(process.env.EDU_S3_BUCKET, student.document_path, 3600);
      student.photo_url = presignedURL;
      delete student.document_path;
    }
    return studentList;
  } catch (error) {
    throw error;
  }
}


module.exports = {

  getPhotoUrlForStudentList,
  getStudentForAllocation,
  createStudentAdmission,
  updateStudent,
  getStudentDetailsByAdmissionId,
  generateUniqueAdmissionNumber,
  checkStudestudentDetailsntExistById,
  getAllStudentList,
  getAllStudentCount,
  getStudentForAllocation,
  checkStudentExist,
  insertDocument,
  getStudentDocumentByAdmissionId,
  mapStudentDocumentObject,
  getStudentDataById
};





