const { pg, redis, CONST, queryUtility } = require("edu-micro-common");
const moment = require('moment');
const momentRange = require('moment-range');
const extendendMoment = momentRange.extendMoment(moment);

const QUERY = require('../constants/QUERY');

const addAcademicYear = async (academicYear) => {
    try {

        const _query = {
            text: QUERY.ACADEMIC_YEAR.addAcademicYear,
            values: [academicYear.academic_year_name, academicYear.school_id,
                academicYear.start_date, academicYear.end_date, academicYear.created_by]
        };

        const queryResult = await pg.executeQueryPromise(_query);
        redis.deleteKey(`ACADEMIC_YEAR|ACTIVE|SCHOOL:${academicYear.school_id}`);
        redis.deleteKey(`ACADEMIC_YEAR|SCHOOL:${academicYear.school_id}`);
        return queryResult;

    } catch (error) {
        throw new Error(error.message);
    }
}

const getAllAcademicYears = async (school_id) => {
    try {

        let key = `ACADEMIC_YEAR|SCHOOL:${school_id}`;
        const cachedData = await redis.GetKeyRedis(key);
        if (cachedData) {
          return JSON.parse(cachedData);
        }
        const _query = {
            text: QUERY.ACADEMIC_YEAR.getAllAcademicYears,
            values: [school_id]
        };

        const queryResult = await pg.executeQueryPromise(_query);
        if (queryResult && queryResult.length > 0) {
            redis.SetRedis(key, queryResult, CONST.CACHE_TTL.SHORT).then().catch(err => console.log(err));
        }
        return queryResult

    } catch (error) {
        throw new Error(error.message);
    }
}

const getActiveAcademicYears = async (school_id) => {
    try {
        let key = `ACADEMIC_YEAR|ACTIVE|SCHOOL:${school_id}`;
        const cachedData = await redis.GetKeyRedis(key);
        if (cachedData) {
          return JSON.parse(cachedData);
        }
        const _query = {
            text: QUERY.ACADEMIC_YEAR.getActiveAcademicYears,
            values: [school_id]
        };

        const queryResult = await pg.executeQueryPromise(_query);
        if (queryResult && queryResult.length > 0) {
            redis.SetRedis(key, queryResult, CONST.CACHE_TTL.SHORT).then().catch(err => console.log(err));
        }
        return queryResult

    } catch (error) {
        throw new Error(error.message);
    }
}

const updateAcademicYear = async (academicYear) => {
    try {

        let academicYearId = academicYear.academic_year_id;
        let schoolId = academicYear.school_id;
        delete academicYear.academic_year_id;
        delete academicYear.school_id;

        let setQuery = queryUtility.convertObjectIntoUpdateQuery(academicYear);
        let updateQuery = `${QUERY.ACADEMIC_YEAR.upadteAcademicYear} ${setQuery}, date_modified = now() WHERE academic_year_id = $1`;

        console.log(updateQuery);
        
        const _query = {
            text: updateQuery,
            values: [academicYearId]
        };

        const queryResult = await pg.executeQueryPromise(_query);
        redis.deleteKey(`ACADEMIC_YEAR|ACTIVE|SCHOOL:${schoolId}`);
        redis.deleteKey(`ACADEMIC_YEAR|SCHOOL:${schoolId}`);
        return queryResult

    } catch (error) {
        throw new Error(error.message);
    }
}

const academicYearOverlapsCheckExceptId = async (academicYearData) => {
    try {
        const _query = {
            text: QUERY.ACADEMIC_YEAR.getActiveAcademicYearsExceptId,
            values: [academicYearData.school_id, academicYearData.start_date, academicYearData.end_date, academicYearData.academic_year_id]
        };

        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult[0].count;
    } catch (error) {
        throw new Error(error.message);
    }
}

const academicYearOverlapsCheck = async (academicYearData) => {
    try {
        const _query = {
            text: QUERY.ACADEMIC_YEAR.academicYearOverlapsCheck,
            values: [academicYearData.school_id, academicYearData.start_date, academicYearData.end_date]
        };

        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult[0].count;
    } catch (error) {
        throw new Error(error.message);
    }
}

const countActiveClasses = async (academic_year_id) => {
    try {
        const _query = {
            text: QUERY.ACADEMIC_YEAR.countActiveClasses,
            values: [academic_year_id]
        };

        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult[0].count;
    } catch (error) {
        throw new Error(error.message);
    }
}

const getAcademicYear = async (academicYearId) => {
    try {
        const _query = {
            text: QUERY.ACADEMIC_YEAR.getAcademicYear,
            values: [academicYearId]
        };

        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult;
    } catch (error) {
        throw new Error(error.message);
    }
}


const updateStatus = async (isActive, academicYear) => {
    try {

        let academicYearId = academicYear.academic_year_id;
        let schoolId = academicYear.school_id;
        let updateQuery = `${QUERY.ACADEMIC_YEAR.upadteAcademicYear} status = $1 WHERE academic_year_id = $2`;
        
        const _query = {
            text: updateQuery,
            values: [isActive, academicYearId]
        };

        console.log(_query);

        const queryResult = await pg.executeQueryPromise(_query);
        redis.deleteKey(`ACADEMIC_YEAR|ACTIVE|SCHOOL:${schoolId}`);
        redis.deleteKey(`ACADEMIC_YEAR|SCHOOL:${schoolId}`);
        return queryResult

    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    addAcademicYear,
    academicYearOverlapsCheck,
    getAllAcademicYears,
    updateAcademicYear,
    getActiveAcademicYears,
    academicYearOverlapsCheckExceptId,
    countActiveClasses,
    getAcademicYear,
    updateStatus
}