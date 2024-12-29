const { pg, JSONUTIL, redis, minioUtil } = require("edu-micro-common");
//const json2xls = require('json2xls');
const QUERY = require("../constants/QUERY");
const EXCEL_CONST = require('../constants/EXCEL_CONST');
const { STUDENT_ERR } = require('../constants/ERRORCODE');



const addClassroomStudent = async (student) => {
    try {
        const { student_admission_id, classroom_id, roll_no, house_id, status, created_by, updated_by } = student;
        const query = {
            text: QUERY.CLASSROOM_STUDENT.insertClassroomStudentQuery,
            values: [student_admission_id, classroom_id, roll_no, house_id, status, created_by, updated_by]
        };
        const queryResult = await pg.executeQueryPromise(query);
        return queryResult;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getAllClassroomStudents = async (reqParams) => {
    try {


        let key = `ClassroomStudent`;
        let whereClause = ` WHERE CS.status > 0`;
        let limitClause = ''
        let offsetClause = '';
        let data, count;
        let isCached = false;

        if (reqParams.classroom_id) {
            key += `|Classroom:${reqParams.classroom_id}`;
            whereClause += ` AND CS.classroom_id=${reqParams.classroom_id}`;
        }

        // if (reqParams.search) {
        //     key += `|Search:${reqParams.search}`;
        //     whereClause += ` AND class ilike '%${reqParams.search}%'`;
        // }

        if (reqParams.pageSize) {
            key += `|Size:${reqParams.pageSize}`;
            limitClause = ` LIMIT ${reqParams.pageSize}`;
        }

        if (reqParams.currentPage) {
            key += `|Offset:${reqParams.currentPage}`;
            offsetClause += ` OFFSET ${reqParams.currentPage}`;
        }

        const cachedData = await redis.GetKeyRedis(key);
        const isClassroomStudentUpdated = await classroomStudentsAddUpdateCheck(whereClause);
        isCached = (cachedData) && (isClassroomStudentUpdated == 0) ? true : false;

        if (isCached) {
            data = JSON.parse(cachedData);
            const cachedCount = await redis.GetKeyRedis(`Count|${key}`);
            count = parseInt(JSON.parse(cachedCount));
            return { data, count };
        }

        const replaceObj = {
            '#WHERE_CLAUSE#': whereClause,
            '#LIMIT_CLAUSE#': limitClause,
            '#OFFSET_CLAUSE#': offsetClause
        };

        const _query = JSONUTIL.replaceAll(QUERY.CLASSROOM_STUDENT.getAllClassroomStudents, replaceObj);
        console.log(_query);

        count = await getAllClassroomStudentsCount(whereClause);
        data = await pg.executeQueryPromise(_query);
        data = await getPhotoUrlForStudentList(data);

        if (data.length > 0) {
            redis.SetRedis(`Count|${key}`, count, 10 * 60).then().catch(err => console.log(err));
            redis.SetRedis(key, data, 10 * 60).then().catch(err => console.log(err));
        }

        return { data, count };

    } catch (error) {
        throw error;
    }
};

const classroomStudentsAddUpdateCheck = async (whereClause) => {
    try {
        whereClause += ` AND (CS.date_created >= NOW() - INTERVAL '5 minutes' OR CS.date_modified >= NOW() - INTERVAL '5 minutes')`;
        const query = QUERY.CLASSROOM_STUDENT.getAllClassroomStudentCount.replace('#WHERE_CLAUSE#', whereClause);
        console.log(query);
        const queryResult = await pg.executeQueryPromise(query);
        return parseInt(queryResult[0].count);
    } catch (error) {
        throw error;
    }
}

const getAllClassroomStudentsCount = async (whereClause) => {
    try {
        const _query = QUERY.CLASSROOM_STUDENT.getAllClassroomStudentCount.replace('#WHERE_CLAUSE#', whereClause);
        console.log('Check Query');
        console.log(_query);
        const queryResult = await pg.executeQueryPromise(_query);
        return parseInt(queryResult[0].count);
    } catch (error) {
        throw new Error(error.message);
    }
}

const getClassroomStudentById = async (student_id) => {
    try {
        const query = {
            text: QUERY.CLASSROOM_STUDENT.getAllClassroomStudentByIdQuery,
            values: [student_id]
        };

        const [result] = await pg.executeQueryPromise(query);
        return result;
    } catch (error) {
        throw error;
    }
};

const checkStudentAvailable = async (classroomStudent) => {
    try {
        let _text = QUERY.CLASSROOM_STUDENT.isStudentExists
        let _query = {
            text: _text,
            values: [classroomStudent.student_id],
        };
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult[0].count;

    }
    catch (err) {
        throw error;
    }

}

const updateClassroomStudent = async (classroomStudent) => {
    try {
        const _query = {
            text: QUERY.CLASSROOM_STUDENT.updateClassroomStudentByIdQuery,
            values: [
                classroomStudent.classroom_id,
                classroomStudent.roll_no,
                classroomStudent.house_id,
                classroomStudent.student_admission_id,
                classroomStudent.student_id
            ],
        };

        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult;
    } catch (error) {
        throw error;
    }

}

const checkRollnoAvailableInClass = async (studentDetails) => {
    try {
        const query = {
            text: QUERY.CLASSROOM_STUDENT.isRollNoExists,
            values: [studentDetails.roll_no, studentDetails.classroom_id],
        };

        const queryResult = await pg.executeQueryPromise(query);
        return queryResult[0].count;
    } catch (error) {
        console.error("Error in updateClassroomStudent:", error);
        throw error;
    }
};

const checkAdmissionId = async (studentDetails) => {

    try {
        const query = {
            text: QUERY.CLASSROOM_STUDENT.ischeckAdmissionIdExist,
            values: [studentDetails.student_admission_id],
        };

        const queryResult = await pg.executeQueryPromise(query);
        return queryResult[0].count;
    } catch (error) {
        console.error("Error in updateClassroomStudent:", error);
        throw error;
    }
}


const checkClassroomFromValidSchool = async (school_id, classroom_id) => {
    try {

        const query = {
            text: QUERY.STUDENT_ALLOCATION_QUERIES.checkClassroomFromValidSchool,
            values: [school_id, classroom_id]
        }

        const queryResult = await pg.executeQueryPromise(query);
        console.log(query, queryResult);
        return queryResult[0].count > 0 ? true : false;

    } catch (error) {
        throw error;
    }
}





const validateHeadersAllocation = (headers) => {
    try {

        const isHeadersValid = EXCEL_CONST.STUDENT_ALLOCATION_HEADERS.every(ele => headers.includes(ele))

        if (!isHeadersValid) {
            throw { status: 400, errorCode: 'STUDENTERR0001', error: STUDENT_ERR.STUDENTERR0001, message: `${EXCEL_CONST.STUDENT_ALLOCATION_HEADERS.join(', ')} these headers are expected` }
        }

        return isHeadersValid

    } catch (error) {
        throw error;
    }
}

const validateStudentDataExcel = async (reqParams) => {
    try {

        let isValid = true;
        const { studentData, school_id, academic_year_id } = reqParams;

        for (const student of studentData) {
            let errorMsgs = [];

            if (!student.student_admission_number) {
                isValid = false;
                student.error_messages = 'Student Admission Number is required';
                continue;
            }

            if (!student.student_name) {
                isValid = false;
                student.error_messages = 'Student Name is required';
                continue;
            }

            if (!student.roll_no) {
                isValid = false;
                student.error_messages = 'Roll No is required';
                continue;
            }

            const studentDetails = await getStudentDetails(student.student_admission_number, school_id);

            if (!studentDetails) {
                isValid = false;
                student.error_messages = 'Invalid Student Admission Number';
                continue;
            }

            if (studentDetails) {
                console.log('isStudentAllocated');
                const isStudentAllocated = await checkStudentAllocated(academic_year_id, studentDetails.student_admission_id);
                if (isStudentAllocated) {
                    isValid = false;
                    student.error_messages = `Student already allocated to ${isStudentAllocated.std_name}-${isStudentAllocated.section_name}`;
                    continue;
                }
            }


            student.error_messages = errorMsgs.join(', ');
        }

        // if (!isValid) {
        //     const studentDataXls = json2xls(studentData);
        //     const studentDataBuffer = Buffer.from(studentDataXls, 'binary');
        //     await minioUtil.putObject(process.env.MINIO_BUCKET, successUploadFilePath, studentDataBuffer);
        // }

        return { isValid, studentData };

    } catch (error) {
        throw error;
    }
}


const checkAcademicYearIdValid = async (academic_year_id, school_id) => {
    try {

        const query = {
            text: QUERY.STUDENT_ALLOCATION_QUERIES.checkAcademicYearIdValid,
            values: [school_id, academic_year_id]
        }

        const queryResult = await pg.executeQueryPromise(query);
        return queryResult[0].count > 0 ? true : false;

    } catch (error) {
        throw error;
    }
}

const checkClassroomIdValid = async (academic_year_id, classroom_id) => {
    try {

        const query = {
            text: QUERY.STUDENT_ALLOCATION_QUERIES.checkClassroomIdValid,
            values: [academic_year_id, classroom_id]
        }

        const queryResult = await pg.executeQueryPromise(query);
        return queryResult[0].count > 0 ? true : false;

    } catch (error) {
        throw error;
    }
}

const getStudentDetails = async (student_admission_number, school_id) => {
    try {
        const query = `SELECT student_admission_id FROM m_student_admission WHERE student_admission_number = '${student_admission_number}' and school_id = '${school_id}'`;
        const result = await pg.executeQueryPromise(query);
        return result[0];

    } catch (error) {
        throw error;
    }
}

const getStudentDetailsByAdmissionId = async (student_admission_id) => {
    try {
        const query = `SELECT student_admission_id, first_name, gender_id FROM m_student_admission WHERE student_admission_id = '${student_admission_id}'`;
        const result = await pg.executeQueryPromise(query);
        return result[0] ? result[0] : null;

    } catch (error) {
        throw error;
    }
}


const checkStudentAllocated = async (academic_year_id, student_admission_id) => {
    try {
        const query = `SELECT ST.std_name, SC.section_name, CS.classroom_id FROM m_classroom_student CS 
        INNER JOIN m_classroom C ON CS.classroom_id = C.classroom_id
        INNER JOIN m_standard ST ON ST.std_id = C.class_id
        INNER JOIN m_section SC ON SC.section_id = C.section_id
        INNER JOIN m_academic_year A ON A.academic_year_id = C.academic_year_id
        WHERE A.academic_year_id = ${academic_year_id} AND CS.student_admission_id = ${student_admission_id};`
        const result = await pg.executeQueryPromise(query);
        return result[0];
    } catch (error) {
        throw error;
    }
}

const checkStudentExists = async (student_admission_id, school_id) => {
    try {

        const query = {
            text: QUERY.STUDENT_ALLOCATION_QUERIES.checkStudentExists,
            values: [school_id, student_admission_id],
        }

        const queryResult = await pg.executeQueryPromise(query);
        return queryResult[0].count > 0 ? true : false;

    } catch (error) {
        throw error;
    }
}


const checkRollNoExistsInClassroom = async (roll_no, classroom_id) => {
    try {
        const query = {
            text: QUERY.STUDENT_ALLOCATION_QUERIES.checkRollNoExistsInClassroom,
            values: [roll_no, classroom_id],
        }

        const queryResult = await pg.executeQueryPromise(query);
        return queryResult[0].count > 0 ? true : false;

    } catch (error) {
        throw error;
    }
}


const validateStudentData = async (reqParams, isReAllocate = false) => {
    try {

        const { studentData, school_id, academic_year_id, classroom_id } = reqParams;
        let isValid = true;
        let errorMessage;
        const rollNoList = [];

        for (const student of studentData) {

            // const isDuplicateRollNo = rollNoList.indexOf(student.roll_no) !== -1 ? true : false;

            // if (isDuplicateRollNo) {
            //     isValid = false;
            //     errorMessage = `{"errorCode":"STUDENTERR0009", "error":"Duplicate Roll No: ${student.roll_no}"}`
            //     break;
            // }


            const studentDetails = await getStudentDetailsByAdmissionId(student.student_admission_id);
            if (!studentDetails) {
                isValid = false;
                errorMessage = `{"errorCode":"STUDENTERR0007", "error":"${STUDENT_ERR.STUDENTERR0007}"}`
                break;
            }

            student.first_name = studentDetails.first_name;
            student.gender_id = studentDetails.gender_id;


            console.log('isStudentAllocated');
            const isStudentAllocated = await checkStudentAllocated(academic_year_id, student.student_admission_id);

            if (!isReAllocate) {
                if (isStudentAllocated) {
                    isValid = false;
                    errorMessage = `{"errorCode":"STUDENTERR0008", "error":"Student ${student.student_admission_id} already allocated to ${isStudentAllocated.std_name}-${isStudentAllocated.section_name}"}`;
                    break;
                }
            }

            if (isReAllocate) {

                if (!isStudentAllocated) {
                    isValid = false;
                    errorMessage = `{"errorCode":"STUDENTERR0013", "error":"${STUDENT_ERR.STUDENTERR0013}"}`;
                    break;
                }
                console.log();
                if (isStudentAllocated.classroom_id == classroom_id) {
                    isValid = false;
                    errorMessage = `{"errorCode":"STUDENTERR0014", "error":"${STUDENT_ERR.STUDENTERR0014}"}`;
                    break;
                }
            }



            // const isRollNoExistsInClassroom = await checkRollNoExistsInClassroom(student.roll_no, classroom_id);
            // if (isRollNoExistsInClassroom) {
            //     isValid = false;
            //     errorMessage = `{"errorCode":"STUDENTERR0010", "Roll No ${student.roll_no} already exists"}`
            //     break;
            // }

            // rollNoList.push(student.roll_no);


        }

        return { isValid, errorMessage, studentData };

    } catch (error) {
        throw error;
    }
}

const allocateStudents = async (reqParams) => {
    try {

        const { studentData, classroom_id, user_id } = reqParams;
        let maxRollNo = await getMaxRollNo(classroom_id);
        studentData.sort((a, b) => a.first_name.localeCompare(b.first_name, 'en', { sensitivity: 'base' }));
        for (const student of studentData) {

            maxRollNo++;
            const studentDetails = {
                student_admission_id: student.student_admission_id,
                classroom_id: classroom_id,
                roll_no: maxRollNo,
                created_by: user_id,
                updated_by: user_id,
            }

            const result = await addStudentToClassroom(studentDetails);
        }

        return;

    } catch (error) {
        throw error;
    }
}


const getMaxRollNo = async (classroom_id) => {
    try {
        const query = `SELECT COALESCE(MAX(roll_no),0) AS max_roll FROM m_classroom_student WHERE classroom_id = ${classroom_id}`;
        const result = await pg.executeQueryPromise(query);
        return result && result[0].max_roll ? parseInt(result[0].max_roll) : 0;
    } catch (error) {
        throw error;
    }
}


const addStudentToClassroom = async (studentDetails) => {
    try {

        const query = {
            text: QUERY.STUDENT_ALLOCATION_QUERIES.addClassroomStudent,
            values: [studentDetails.student_admission_id, studentDetails.classroom_id, studentDetails.roll_no, studentDetails.created_by, studentDetails.updated_by],
        }

        const queryResult = await pg.executeQueryPromise(query);
        return queryResult;

    } catch (error) {
        throw error;
    }
}



const getStudentsForAllocationFromAdmission = async (reqParams) => {
    try {

        const { academic_year_id, class_id, school_id } = reqParams;
        let whereClause = `WHERE SA.school_id = ${school_id} AND SA.academic_session::INT = ${academic_year_id}`;
        let whereClauseCte = `WHERE C.academic_year_id = ${academic_year_id}`;

        if (class_id) {
            whereClause += ` AND SA.class_id = ${class_id}`;
            whereClauseCte += ` AND ST.std_id = ${class_id}`;
        }

        const _query = `with cte_classroom as (
            select CS.student_admission_id, CS.student_id from m_classroom_student CS
            inner join m_classroom C on C.classroom_id = CS.classroom_id 
            inner join m_standard ST on ST.std_id = C.class_id 
            inner join m_academic_year Y on Y.academic_year_id  = C.academic_year_id 
            ${whereClauseCte} )
            SELECT SA.student_admission_id, SA.school_id, SA.student_admission_number,
            SA.first_name, SA.middle_name, SA.last_name, SA.gender_id, CC.student_id, 
            case when CC.student_id is null then false else true end as is_alloted,
            SAD.document_path
            FROM m_student_admission SA
            LEFT JOIN cte_classroom CC ON CC.student_admission_id = SA.student_admission_id 
            LEFT JOIN m_student_admission_document SAD ON SAD.student_admission_id = SA.student_admission_id AND SAD.document_name = 'STUDENT_PHOTO'
            ${whereClause} 
            ORDER BY SA.first_name;`;

        console.log(_query);

        const queryResult = await pg.executeQueryPromise(_query);

        // if (queryResult.length > 0) {
        //     redis.SetRedis(cacheKey, queryResult, CONSTANT.CACHE_TTL.student.SHORT).then().catch((err) => console.log(err));
        // }
        return queryResult;

    } catch (error) {
        throw error
    }
}

const getStudentsForAllocationFromClass = async (reqParams) => {
    try {

        const { academic_year_id, class_id, school_id, allot_year_id, section_id } = reqParams;
        let whereClause = `WHERE C.academic_year_id  = ${academic_year_id} `;
        let whereClauseCte = `WHERE C.academic_year_id = ${allot_year_id}`;

        if (class_id) {
            whereClause += ` AND C.class_id = ${class_id}`;
        }

        if (section_id) {
            whereClause += ` AND C.section_id = ${section_id}`;
        }

        const _query = `with cte_classroom as (
            select SA.student_admission_id, SA.school_id, SA.student_admission_number,
             SA.first_name, SA.middle_name, SA.last_name, SA.gender_id, SAD.document_path from m_classroom_student CST
            inner join m_student_admission SA on CST.student_admission_id  = SA.student_admission_id 
            LEFT JOIN m_student_admission_document SAD ON SAD.student_admission_id = SA.student_admission_id AND SAD.document_name = 'STUDENT_PHOTO'
            inner join m_classroom C on C.classroom_id  = CST.classroom_id 
            inner join m_standard ST on ST.std_id = C.class_id 
            ${whereClause}),
             cte_current_year as (
            select CST.student_id, SA.student_admission_id from m_classroom_student CST
            inner join m_student_admission SA on CST.student_admission_id  = SA.student_admission_id 
            inner join m_classroom C on C.classroom_id  = CST.classroom_id 
            ${whereClauseCte})
            select CC.student_admission_id, CC.school_id, CC.student_admission_number,
             CC.first_name, CC.middle_name, CC.last_name, CC.gender_id, CCY.student_id, 
             case when CCY.student_id IS null then false else true end as is_alloted, CC.document_path
             from cte_classroom CC 
           left join cte_current_year CCY on CC.student_admission_id = CCY.student_admission_id ;`;



        console.log(_query);

        const queryResult = await pg.executeQueryPromise(_query);

        // if (queryResult.length > 0) {
        //     redis.SetRedis(cacheKey, queryResult, CONSTANT.CACHE_TTL.student.SHORT).then().catch((err) => console.log(err));
        // }
        return queryResult;

    } catch (error) {
        throw error
    }
}

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

const reassignRollNo = async (classroom_id, rollNoType) => {
    try {

        const query = {
            text: QUERY.STUDENT_ALLOCATION_QUERIES.reassignRollNo,
            values: [classroom_id, rollNoType],
        }
        console.log(query);

        const queryResult = await pg.executeQueryPromise(query);
        return queryResult;

    } catch (error) {
        throw error;
    }
}

const reAllocateStudents = async (reqParams) => {
    try {

        const { studentData, classroom_id, user_id, academic_year_id } = reqParams;
        let maxRollNo = await getMaxRollNo(classroom_id);
        studentData.sort((a, b) => a.first_name.localeCompare(b.first_name, 'en', { sensitivity: 'base' }));
        for (const student of studentData) {

            maxRollNo++;

            const studentDetails = {
                student_admission_id: student.student_admission_id,
                classroom_id: classroom_id,
                roll_no: maxRollNo,
                created_by: user_id,
                updated_by: user_id,
            }

            await deAllocateStudent(studentDetails, academic_year_id)

            // const result = await addStudentToClassroom(studentDetails);
        }

        return;

    } catch (error) {
        throw error;
    }
}


const deAllocateStudent = async (studentDetails, academic_year_id) => {
    try {

        console.log(studentDetails);
        const currentClassroomDetails = await getCurrentClassroomDetails(studentDetails.student_admission_id, academic_year_id)
        console.log(currentClassroomDetails);

        const reAllocationLog = {
            student_id: currentClassroomDetails.student_id,
            student_admission_id: currentClassroomDetails.student_admission_id,
            classroom_id: currentClassroomDetails.classroom_id,
            roll_no: currentClassroomDetails.roll_no,
            house_id: currentClassroomDetails.house_id,
            prev_updated_by: currentClassroomDetails.updated_by,
            prev_date_modified: currentClassroomDetails.date_modified,
            created_by: studentDetails.created_by,
            updated_by: studentDetails.updated_by
        }

        const query = `SELECT * FROM reAllocateStudent('${JSON.stringify(reAllocationLog)}','${JSON.stringify(studentDetails)}')`
        console.log(query);

        const queryResult = await pg.executeQueryPromise(query);
        return queryResult;

    } catch (error) {
        throw error;
    }
}



const getCurrentClassroomDetails = async (student_admission_id, academic_year_id) => {
    try {
        const query = `SELECT CS.* FROM m_classroom_student CS 
        INNER JOIN m_classroom C ON CS.classroom_id = C.classroom_id
        INNER JOIN m_standard ST ON ST.std_id = C.class_id
        INNER JOIN m_section SC ON SC.section_id = C.section_id
        INNER JOIN m_academic_year A ON A.academic_year_id = C.academic_year_id
        WHERE A.academic_year_id = ${academic_year_id} AND CS.student_admission_id = ${student_admission_id};`
        console.log(query);
        const result = await pg.executeQueryPromise(query);
        return result[0];
    } catch (error) {
        throw error;
    }
}


module.exports = {
    checkAdmissionId,
    getAllClassroomStudents,
    checkStudentAvailable,
    getClassroomStudentById,
    addClassroomStudent,
    updateClassroomStudent,
    checkRollnoAvailableInClass,

    checkClassroomFromValidSchool,
    validateHeadersAllocation,
    validateStudentData,
    getStudentsForAllocationFromAdmission,
    getStudentsForAllocationFromClass,
    allocateStudents,
    checkAcademicYearIdValid,
    checkClassroomIdValid,
    reassignRollNo,
    reAllocateStudents,
    getPhotoUrlForStudentList
};
