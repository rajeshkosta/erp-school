const { pg, redis, JSONUTIL, queryUtility } = require("edu-micro-common");
const { CLASSROOM_QUERIES } = require("../constants/QUERY");

const checkAcademicYearIdValid = async (academic_year_id, school_id) => {
    try {

        const query = {
            text: CLASSROOM_QUERIES.checkAcademicYearIdValid,
            values: [school_id, academic_year_id]
        }

        const queryResult = await pg.executeQueryPromise(query);
        console.log(query, queryResult);
        return queryResult[0].count > 0 ? true : false;

    } catch (error) {
        throw error;
    }
}

const checkClassIdExists = async (classId) => {
    try {

        const query = {
            text: CLASSROOM_QUERIES.checkClassIdExists,
            values: [classId]
        }

        const queryResult = await pg.executeQueryPromise(query);
        console.log(query, queryResult);
        return queryResult[0].count > 0 ? true : false;

    } catch (error) {
        throw error;
    }
}

const checkSectionIdExists = async (section_id, school_id) => {
    try {

        const query = {
            text: CLASSROOM_QUERIES.checkSectionIdExists,
            values: [section_id, school_id]
        }

        const queryResult = await pg.executeQueryPromise(query);
        console.log(query, queryResult);
        return queryResult[0].count > 0 ? true : false;

    } catch (error) {
        throw error;
    }
}

const checkClassroomExists = async (classroom) => {
    try {

        let query = `SELECT COUNT(*) as count FROM m_classroom WHERE academic_year_id = ${classroom.academic_year_id} AND class_id = ${classroom.class_id}`;

        if (classroom.section_id) {
            query += ` AND section_id = ${classroom.section_id} `;
        } else {
            query += ` AND section_id IS NULL`;
        }


        console.log(query);
        // let query = `SELECT COUNT(*) FROM m_classroom WHERE academic_year_id = ${classroom.academic_year_id} AND class ILIKE '${classroom.class}' `;
        // if (classroom.section) {
        //     query += `AND section ILIKE '${classroom.section}' `;
        // } else {
        //     query += `AND section IS NULL`;
        // }

        const result = await pg.executeQueryPromise(query);
        return result[0].count;

    } catch (error) {
        throw error;
    }
}

const addClassroomAndSubject = async (classroom) => {
    try {

        console.log(classroom);
        const classroomId = await addClassroom(classroom);

        for (const subject of classroom.subjectList) {
            subject.classroom_id = classroomId;
            subject.created_by = classroom.created_by;
            subject.updated_by = classroom.updated_by;
            await addClassroomSubject(subject)
        }

        return classroomId;

    } catch (error) {
        throw error;
    }
}

const addClassroom = async (classroom) => {
    try {
        const _query = {
            text: CLASSROOM_QUERIES.addClassroom,
            values: [
                classroom.academic_year_id,
                classroom.class_teacher,
                classroom.class_id,
                classroom.section_id,
                classroom.capacity,
                classroom.room_no,
                classroom.floor,
                classroom.building,
                classroom.projector_available,
                classroom.status,
                classroom.updated_by,
                classroom.created_by
            ],
        };

        console.log(_query);
        const queryResult = await pg.executeQueryPromise(_query);

        return queryResult[0].classroom_id;

    } catch (error) {
        throw error;
    }
}

const addClassroomSubject = async (subject) => {
    try {
        const _query = {
            text: CLASSROOM_QUERIES.addClassroomSubject,
            values: [
                subject.subject_id,
                subject.classroom_id,
                subject.teacher_id,
                subject.updated_by,
                subject.created_by
            ],
        };
        console.log(_query);
        const queryResult = await pg.executeQueryPromise(_query);

        return queryResult[0];

    } catch (error) {
        throw error;
    }
}

const getClassroomDetails = async (classroomId) => {
    try {
        const classroomDetails = await getClassroomById(classroomId);
        classroomDetails.subjectList = await getClassroomSubjects(classroomId);
        return classroomDetails;
    } catch (error) {
        throw error;
    }
}

const getClassroomById = async (classroomId) => {
    try {
        const query = `SELECT C.classroom_id, C.academic_year_id, C.class_teacher, U.display_name AS class_teacher_name, C.class_id, C.section_id, C.capacity,
        C.room_no, C.floor, C.building, C.projector_available, C.status, ST.std_name, ST.abbr, 
        ST.category, SC.section_name
        FROM m_classroom C
        INNER JOIN m_standard ST ON ST.std_id = C.class_id
        INNER JOIN m_section SC ON SC.section_id = C.section_id
        LEFT JOIN m_users U ON U.user_id = C.class_teacher
        WHERE classroom_id = ${classroomId}`;
        const result = await pg.executeQueryPromise(query);
        return result[0];
    } catch (error) {
        throw error;
    }
}

const getClassroomSubjects = async (classroomId) => {
    try {
        const query = `SELECT CS.class_subject_id, CS.subject_id, CS.classroom_id, CS.teacher_id ,
        U.display_name AS teacher_name, S.subject_name
        FROM m_classroom_subject CS 
        INNER JOIN m_subject S ON S.subject_id = CS.subject_id
        LEFT JOIN m_users U ON U.user_id = CS.teacher_id 
        WHERE CS.classroom_id = ${classroomId} AND CS.status > 0`;
        const result = await pg.executeQueryPromise(query);
        return result;
    } catch (error) {
        throw error;
    }
}

const getAllClassrooms = async (reqParams) => {
    try {

        let key = `Classrooms`;
        let whereClause = ` WHERE C.status > 0`;
        let limitClause = ''
        let offsetClause = '';
        let data, count;
        let isCached = false;

        if (reqParams.academic_year_id) {
            key += `|Academic:${reqParams.academic_year_id}`;
            whereClause += ` AND C.academic_year_id=${reqParams.academic_year_id}`;
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
        const isClassroomUpdated = await classroomAddUpdateCheck(whereClause);
        isCached = (cachedData) && (isClassroomUpdated == 0) ? true : false;

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

        const _query = JSONUTIL.replaceAll(CLASSROOM_QUERIES.getAllClassrooms, replaceObj);
        console.log(_query);

        count = await getAllClassroomCount(whereClause);
        redis.SetRedis(`Count|${key}`, count, 10 * 60).then().catch(err => console.log(err));
        data = await pg.executeQueryPromise(_query);
        redis.SetRedis(key, data, 10 * 60).then().catch(err => console.log(err));

        return { data, count };


    } catch (error) {
        throw error;
    }
}

const classroomAddUpdateCheck = async (whereClause) => {
    try {
        whereClause += ` AND (C.date_created >= NOW() - INTERVAL '5 minutes' OR C.date_modified >= NOW() - INTERVAL '5 minutes')`;
        const query = CLASSROOM_QUERIES.getAllClassroomCount.replace('#WHERE_CLAUSE#', whereClause);
        console.log(query);
        const queryResult = await pg.executeQueryPromise(query);
        return parseInt(queryResult[0].count);
    } catch (error) {
        throw error;
    }
}

const getAllClassroomCount = async (whereClause) => {
    try {
        const _query = CLASSROOM_QUERIES.getAllClassroomCount.replace('#WHERE_CLAUSE#', whereClause);
        console.log('Check Query');
        console.log(_query);
        const queryResult = await pg.executeQueryPromise(_query);
        return parseInt(queryResult[0].count);
    } catch (error) {
        throw new Error(error.message);
    }
}

const updateClassroom = async (classroomDetails) => {
    try {

        console.log(classroomDetails);
        classroomDetails.date_modified = "NOW()";
        let classroom_id = classroomDetails.classroom_id;
        const subjectList = classroomDetails.subjectList;
        delete classroomDetails.classroom_id;
        delete classroomDetails.academic_year_id;
        delete classroomDetails.subjectList;

        let setQuery = queryUtility.convertObjectIntoUpdateQuery(classroomDetails);
        let updateQuery = `${CLASSROOM_QUERIES.updateClassroom} ${setQuery} WHERE classroom_id = $1`;

        const _query = {
            text: updateQuery,
            values: [classroom_id]
        };

        const queryResult = await pg.executeQueryPromise(_query);
        await updateClassroomSubjects(subjectList, classroom_id, classroomDetails.updated_by);
        return classroom_id;

    } catch (error) {
        throw error
    }
}

const updateClassroomSubjects = async (subjectList, classroom_id, updated_by) => {
    try {

        const presentSubjectList = await getClassroomSubjects(classroom_id);
        //const addSubjectList = subjectList.filter(sub => !presentSubjectList.find(pSub => parseInt(sub.subject_id) === parseInt(pSub.subject_id)))
        const delSubjectList = presentSubjectList.filter(pSub => !subjectList.find(sub => parseInt(pSub.subject_id) === parseInt(sub.subject_id)))
        const addSubjectList = subjectList.filter(sub => !delSubjectList.find(pSub => parseInt(sub.subject_id) === parseInt(pSub.subject_id)))
        console.log(addSubjectList);
        for (const subject of addSubjectList) {
            subject.classroom_id = classroom_id;
            subject.created_by = updated_by;
            subject.updated_by = updated_by;
            await addClassroomSubjectOnUpdate(subject)
        }

        for (const subject of delSubjectList) {
            subject.classroom_id = classroom_id;
            subject.updated_by = updated_by;
            await changeClassroomSubjectStatus(subject, 0)
        }

    } catch (error) {
        throw error;
    }
}

const addClassroomSubjectOnUpdate = async (subject) => {
    try {

        const query = `SELECT count(*) AS count FROM m_classroom_subject WHERE subject_id = ${subject.subject_id} AND classroom_id = ${subject.classroom_id}`;
        const queryResult = await pg.executeQueryPromise(query);
        if (queryResult[0].count > 0) {
            await changeClassroomSubject(subject)
        } else {
            subject.created_by = subject.updated_by
            await addClassroomSubject(subject)
        }

    } catch (error) {
        throw error;
    }
}

const changeClassroomSubjectStatus = async (subject, status) => {
    try {
        const _query = `UPDATE m_classroom_subject SET status = ${status}, updated_by = ${subject.updated_by}, date_modified = NOW() WHERE classroom_id = ${subject.classroom_id} AND subject_id = ${subject.subject_id}`;
        console.log(_query);
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult[0];
    } catch (error) {
        throw error
    }
}


const changeClassroomSubject = async (subject) => {
    try {
        console.log(subject);
        const _query = `UPDATE m_classroom_subject SET teacher_id = ${subject.teacher_id}, status = 1, updated_by = ${subject.updated_by}, date_modified = NOW() WHERE classroom_id = ${subject.classroom_id} AND subject_id = ${subject.subject_id}`;
        console.log(_query);
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult[0];
    } catch (error) {
        throw error
    }
}

const validateSubjects = async (subjectList, school_id) => {
    try {

        if (hasDuplicateSubjectIds(subjectList)) {
            return false;
        }

        let isValid = true

        for (const subject of subjectList) {
            const query = `SELECT count(*) AS count FROM m_subject WHERE subject_id = ${subject.subject_id} AND school_id = ${school_id}`;
            const queryResult = await pg.executeQueryPromise(query);
            isValid = queryResult[0].count > 0 ? true : false;
            if (!isValid) {
                return isValid;
            }
        }
        return isValid;
    } catch (error) {
        throw error
    }
}

const hasDuplicateSubjectIds = (array) => {
    const idSet = new Set();

    for (const item of array) {
        const itemId = item.subject_id;

        if (idSet.has(itemId)) {
            return true;
        }

        idSet.add(itemId);
    }

    return false;
}

const getSectionsByStd = async (reqParams) => {
    try {

        const cacheKey = `SecList|Year_${reqParams.academic_year_id}|Class_${reqParams.class_id}`;
        console.log("SecList", cacheKey);
        const cachedData = await redis.GetKeyRedis(cacheKey);
        const isClassroomUpdated = await sectionAddUpdateCheck(reqParams.academic_year_id, reqParams.class_id);
        isCached = (cachedData) && (isClassroomUpdated == 0) ? true : false;

        if (isCached) {
            data = JSON.parse(cachedData);
            const cachedCount = await redis.GetKeyRedis(`Count|${cacheKey}`);
            count = parseInt(JSON.parse(cachedCount));
            return data;
        }

        const query = {
            text: CLASSROOM_QUERIES.getSectionsByStd,
            values: [reqParams.academic_year_id, reqParams.class_id]
        }

        const queryResult = await pg.executeQueryPromise(query);
        redis.SetRedis(cacheKey, queryResult, 10 * 60).then().catch(err => console.log(err));
        return queryResult;


    } catch (error) {
        throw error;
    }
}

const sectionAddUpdateCheck = async (academic_year_id, class_id) => {
    try {
        const query = ` SELECT COUNT(*) AS count FROM m_classroom WHERE academic_year_id = ${academic_year_id} AND  class_id = ${class_id} AND(date_created >= NOW() - INTERVAL '5 minutes' OR date_modified >= NOW() - INTERVAL '5 minutes')`;
        console.log(query);
        const queryResult = await pg.executeQueryPromise(query);
        return parseInt(queryResult[0].count);
    } catch (error) {
        throw error;
    }
}

const getCountsByClass = async (class_id, academic_year_id) => {
    try {

        const query = {
            text: CLASSROOM_QUERIES.getCountsByClass,
            values: [class_id, academic_year_id]
        }

        const queryResult = await pg.executeQueryPromise(query);
        console.log(query, queryResult);
        return queryResult;

    } catch (error) {
        throw error;
    }
}


const getClassByYear = async (academic_year_id) => {
    try {

        //TODO: add caching here
        const query = {
            text: CLASSROOM_QUERIES.getClassByYear,
            values: [academic_year_id]
        }

        const queryResult = await pg.executeQueryPromise(query);
        console.log(query, queryResult);
        return queryResult;


    } catch (error) {
        throw error
    }
}




const getSubjectsByStd = async (reqParams) => {
    try {

        // const cacheKey = `SecList|School_${reqParams.school_id}|Year_${reqParams.academic_year_id}|Class_${reqParams.class_id}`;
        // console.log("SecList", cacheKey);
        // const cachedData = await redis.GetKeyRedis(cacheKey);
        // const isClassroomUpdated = await subjectAddUpdateCheck();
        // isCached = (cachedData) && (isClassroomUpdated == 0) ? true : false;

        // if (isCached) {
        //     data = JSON.parse(cachedData);
        //     const cachedCount = await redis.GetKeyRedis(`Count|${cacheKey}`);
        //     count = parseInt(JSON.parse(cachedCount));
        //     return data;
        // }

        const query = {
            text: CLASSROOM_QUERIES.getSubjectsByStd,
            values: [reqParams.academic_year_id, reqParams.class_id]
        }

        const queryResult = await pg.executeQueryPromise(query);
        // redis.SetRedis(cacheKey, queryResult, 10 * 60).then().catch(err => console.log(err));
        return queryResult;


    } catch (error) {
        throw error;
    }
}

const getSubjectsByClassroomId = async (reqParams) => {
    try {

        const query = {
            text: CLASSROOM_QUERIES.getSubjectsByClassroomId,
            values: [reqParams.classroom_id]
        }

        const queryResult = await pg.executeQueryPromise(query);
        return queryResult;


    } catch (error) {
        throw error;
    }
}

const getSubjectDetails = async (classroom_id) => {
    try {

        const cacheKey = `DASH|CLASS_SUBJECT|CLASSROOM_${classroom_id}`;
        console.log('CacheKey|getSubjectDetails', cacheKey);
        const cachedData = await redis.GetKeyRedis(cacheKey);
        const isClassroomUpdated = await checkSubjectDetailsUpdated(classroom_id);
        isCached = (cachedData) && (isClassroomUpdated == 0) ? true : false;

        if (isCached) {
            data = JSON.parse(cachedData);
            const cachedCount = await redis.GetKeyRedis(`Count|${cacheKey}`);
            count = parseInt(JSON.parse(cachedCount));
            return data;
        }

        const query = {
            text: CLASSROOM_QUERIES.getSubjectDetails,
            values: [classroom_id]
        }

        const queryResult = await pg.executeQueryPromise(query);
        redis.SetRedis(cacheKey, queryResult, 30 * 60).then().catch(err => console.log(err));
        return queryResult;


    } catch (error) {
        throw error;
    }
}

const checkSubjectDetailsUpdated = async (classroom_id) => {
    try {

        const query = ` select COUNT(*) as count
        from m_classroom cl
        inner join m_classroom_subject csb on csb.classroom_id = cl.classroom_id 
        inner join m_subject sb on sb.subject_id = csb.subject_id 
        left join m_users u on csb.teacher_id  = u.user_id 
        where cl.classroom_id = ${classroom_id}  and 
        (cl.date_created >= NOW() - INTERVAL '5 minutes' OR cl.date_modified >= NOW() - INTERVAL '5 minutes'
        or csb.date_created >= NOW() - INTERVAL '5 minutes' OR csb.date_modified >= NOW() - INTERVAL '5 minutes'
        or sb.date_created >= NOW() - INTERVAL '5 minutes' OR sb.date_modified >= NOW() - INTERVAL '5 minutes'
        or u.date_created >= NOW() - INTERVAL '5 minutes' OR u.date_modified >= NOW() - INTERVAL '5 minutes'
        )`

        const queryResult = await pg.executeQueryPromise(query);
        return parseInt(queryResult[0].count);

    } catch (error) {
        throw error;
    }
}

const getClassTeacher = async (classroom_id) => {
    try {

        const cacheKey = `DASH|CLASS_TEACHER|CLASSROOM_${classroom_id}`;
        console.log('CacheKey|getClassTeacher', cacheKey);
        const cachedData = await redis.GetKeyRedis(cacheKey);
        const isClassTeacherUpdated = await checkClassTeacherUpdated(classroom_id);
        isCached = (cachedData) && (isClassTeacherUpdated == 0) ? true : false;


        if (isCached) {
            data = JSON.parse(cachedData);
            const cachedCount = await redis.GetKeyRedis(`Count|${cacheKey}`);
            count = parseInt(JSON.parse(cachedCount));
            return data;
        }

        const query = {
            text: CLASSROOM_QUERIES.getClassTeacher,
            values: [classroom_id]
        }

        const [queryResult] = await pg.executeQueryPromise(query);
        redis.SetRedis(cacheKey, queryResult, 30 * 60).then().catch(err => console.log(err));
        return queryResult;



    } catch (error) {
        throw error;
    }
}

const checkClassTeacherUpdated = async (classroom_id) => {
    try {

        const query = ` select COUNT(*) as count
        from m_classroom cl
        inner join m_standard st on st.std_id = cl.class_id 
        inner join m_section sc on sc.section_id = cl.section_id 
        left join m_users u on cl.class_teacher = u.user_id 
        where cl.classroom_id = ${classroom_id} and
        (cl.date_created >= NOW() - INTERVAL '5 minutes' OR cl.date_modified >= NOW() - INTERVAL '5 minutes'
        or st.date_created >= NOW() - INTERVAL '5 minutes' OR st.date_modified >= NOW() - INTERVAL '5 minutes'
        or sc.date_created >= NOW() - INTERVAL '5 minutes' OR sc.date_modified >= NOW() - INTERVAL '5 minutes'
        or u.date_created >= NOW() - INTERVAL '5 minutes' OR u.date_modified >= NOW() - INTERVAL '5 minutes'
        )`

        const queryResult = await pg.executeQueryPromise(query);
        return parseInt(queryResult[0].count);

    } catch (error) {
        throw error;
    }
}

module.exports = {
    checkAcademicYearIdValid,
    checkClassroomExists,
    checkClassIdExists,
    checkSectionIdExists,
    addClassroomAndSubject,
    getClassroomDetails,
    getAllClassrooms,
    updateClassroom,
    validateSubjects,
    getSectionsByStd,
    getCountsByClass,
    getClassByYear,
    getSubjectsByStd,
    getSubjectsByClassroomId,
    getSubjectDetails,
    getClassTeacher
};