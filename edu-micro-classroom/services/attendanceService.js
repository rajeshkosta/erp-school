const { pg, JSONUTIL, redis } = require("edu-micro-common");
const { ATTENDANCE_QUERY } = require("../constants/QUERY");

const addAttendance = async (attendanceDetails) => {
    try {

        const studentList = await getStudentList(attendanceDetails.classroom_id, attendanceDetails.attendance_date);

        const studentAttendanceDetails = studentList.map((attendanceData) => {
            const studentData = attendanceDetails.student_list.find(e => e.student_id == attendanceData.student_id)
            if (studentData) {
                attendanceData.attendance_status = studentData.attendance_status;
                attendanceData.remarks = studentData.remarks;
            } else {
                attendanceData.remarks = '';
            }
            return attendanceData;
        })


        const query = `SELECT addAttendance('${JSON.stringify(studentAttendanceDetails)}', ${attendanceDetails.created_by},${attendanceDetails.updated_by})`;
        const queryResult = await pg.executeQueryPromise(query);
        console.log(queryResult);

        return studentAttendanceDetails

    } catch (error) {
        console.log(error);
        throw error;
    }
};


const getStudentList = async (classroom_id, attendance_date) => {
    try {

        const query = {
            text: ATTENDANCE_QUERY.getClassroomStudent,
            values: [classroom_id, attendance_date]
        };

        const queryResult = await pg.executeQueryPromise(query);
        return queryResult;

    } catch (error) {
        throw error;
    }
}


const getClassroomAttendance = async (reqParams) => {
    try {

        let key = `ClsAttendance|Classroom:${reqParams.classroom_id}|Date:${reqParams.attendance_date}`;
        let whereClause = ` WHERE S.classroom_id =${reqParams.classroom_id}`;
        let joinClause = ` AND date='${reqParams.attendance_date}'::DATE `;
        let selectClause = reqParams.attendance_date;
        let limitClause = ''
        let offsetClause = '';
        let data, count;
        let isCached = false;


        if (reqParams.pageSize) {
            key += `|Size:${reqParams.pageSize}`;
            limitClause = ` LIMIT ${reqParams.pageSize}`;
        }

        if (reqParams.currentPage) {
            key += `|Offset:${reqParams.currentPage}`;
            offsetClause += ` OFFSET ${reqParams.currentPage}`;
        }

        const cachedData = await redis.GetKeyRedis(key);
        const isAttendanceUpdated = await attendanceAddUpdateCheck(reqParams);
        isCached = (cachedData) && (!isAttendanceUpdated) ? true : false;

        if (isCached) {
            data = JSON.parse(cachedData);
            const cachedCount = await redis.GetKeyRedis(`Count|${key}`);
            count = parseInt(JSON.parse(cachedCount));
            return { data, count };
        }

        const replaceObj = {
            '#WHERE_CLAUSE#': whereClause,
            '#LIMIT_CLAUSE#': limitClause,
            '#OFFSET_CLAUSE#': offsetClause,
            '#JOIN_CLAUSE#': joinClause,
            '#SELECT_CLAUSE#': selectClause
        };

        const _query = JSONUTIL.replaceAll(ATTENDANCE_QUERY.getAllAttendance, replaceObj);

        count = await getAllAttendanceCount(whereClause);
        data = await pg.executeQueryPromise(_query);
        if (data.length > 0) {
            redis.SetRedis(`Count|${key}`, count, 10 * 60).then().catch(err => console.log(err));
            redis.SetRedis(key, data, 10 * 60).then().catch(err => console.log(err));
        }
        return { data, count };


    } catch (error) {
        console.log(error);
        throw error;
    }
}

const attendanceAddUpdateCheck = async (reqParams) => {
    try {

        const attendanceQuery = `SELECT COUNT(*) AS count FROM tr_attendance WHERE date = '${reqParams.attendance_date}'::DATE
                                 AND classroom_id =${reqParams.classroom_id} 
                                 AND ( date_created >= NOW() - INTERVAL '5 minutes' OR date_modified >= NOW() - INTERVAL '5 minutes')`
        const attendanceQueryFun = pg.executeQueryPromise(attendanceQuery);

        const classStudentQuery = `SELECT COUNT(*) AS count FROM m_classroom_student WHERE classroom_id =${reqParams.classroom_id} 
                                 AND ( date_created >= NOW() - INTERVAL '5 minutes' OR date_modified >= NOW() - INTERVAL '5 minutes')`
        const classStudentQueryFun = pg.executeQueryPromise(classStudentQuery);

        const [attendanceCount, classStudentCount] = await Promise.all([attendanceQueryFun, classStudentQueryFun])
        console.log('attendanceCount', attendanceCount);
        console.log('classStudentCount', classStudentCount);

        const isUpdated = parseInt(attendanceCount[0].count) > 0 || parseInt(classStudentCount[0].count) > 0 ? true : false;
        return isUpdated;

    } catch (error) {
        throw error;
    }
}

const getAllAttendanceCount = async (whereClause) => {
    try {
        const _query = ATTENDANCE_QUERY.getAttendanceCount.replace('#WHERE_CLAUSE#', whereClause);
        const queryResult = await pg.executeQueryPromise(_query);
        return parseInt(queryResult[0].count);
    } catch (error) {
        throw new Error(error.message);
    }
}

const getAttendance = async (academic_year_id, student_admission_id) => {
    try {

        const _query = {
            text: ATTENDANCE_QUERY.getAttendance,
            values: [academic_year_id, student_admission_id]
        };
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult;

    } catch (error) {
        throw error;
    }
};


const getAttendanceCount1 = async (academic_year_id, student_admission_id) => {
    try {

        const _query = {
            text: ATTENDANCE_QUERY.getAttendanceCount1,
            values: [academic_year_id, student_admission_id]
        };

        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult;

    } catch (error) {
        throw error;
    }
};


const getAttendanceCount2 = async (academic_year_id, student_admission_id) => {
    try {

        const _query = {
            text: ATTENDANCE_QUERY.getAttendanceCount2,
            values: [academic_year_id, student_admission_id]
        };

        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult;

    } catch (error) {
        throw error;
    }
};

module.exports = {
    addAttendance,
    getClassroomAttendance,
    getAttendance,
    getAttendanceCount1,
    getAttendanceCount2
};
