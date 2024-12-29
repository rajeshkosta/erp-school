const { pg, ERRORCODE, logger ,queryUtility,JSONUTIL, CONST} = require("edu-micro-common");
const QUERY = require('../constants/QUERY');


const checkExamResultsExistByExamResultId = async (exam_result_id) => {
    try {
      const _query = {
        text: QUERY.EXAMRESULT.checkExamResultsExistByExamResultId,
        values: [exam_result_id],
      };
  
      console.log(_query);
  
      const queryResult = await pg.executeQueryPromise(_query);
      return queryResult[0].count;
    } catch (error) {
      throw error;
    }
  };

  const createExamResult = async (examresults) => {
    try {
      const _query = {
        text: QUERY.EXAMRESULT.createExamResult,
        values: [
            examresults.examination_id,
            examresults.subject_id,
            examresults.student_id,
            examresults.maximum_marks,
            examresults.passing_marks,
            examresults.marks_obtained,
            examresults.status,
            examresults.created_by,
            examresults.updated_by
        ],
      };
  
      console.log(_query);
      const queryResult = await pg.executeQueryPromise(_query);
      return queryResult;
    } catch (error) {
      throw error;
    }
  };

  module.exports = {
    checkExamResultsExistByExamResultId,
    createExamResult
  };
const { db, pg, redis, logger, queryUtility, s3Util, JSONUTIL } = require("edu-micro-common");
const QUERY = require('../constants/QUERY');
const { count } = require("edu-micro-common/config/mongoDB");



const getAssignMarksOfStudent = async (student_id, examination_id) => {
    try {
        const _query = {
            text: QUERY.ASSIGNMARKS.getAssignMarksOfStudent,
            values: [student_id, examination_id],
        };

        const result = await pg.executeQueryPromise(_query);
        return result;
    } catch (error) {
        throw error;
    }
};


const getAllAssignMarks = async (reqParams) => {
    try {
      let key = `assignMarks_Data`;
      let whereClause = ` WHERE msa.status=1`;
      let limitClause = "";
      let offsetClause = "";
      let data, count;
      let isCached = false;
  
      if (reqParams.school_id) {
        key += `|AcademicYear:${reqParams.school_id}`;
        whereClause += ` AND msa.school_id=${reqParams.school_id}`;
      }

      if (reqParams.academic_year_id) {
        key += `|AcademicYear:${reqParams.academic_year_id}`;
        whereClause += ` AND me.academic_year_id=${reqParams.academic_year_id}`;
      }
  
      if (reqParams.exam_type_id) {
        key += `|Exam:${reqParams.exam_type_id}`;
        whereClause += ` AND me.exam_type_id=${reqParams.exam_type_id}`;
      }
  
      if (reqParams.class_id) {
        key += `|Class:${reqParams.class_id}`;
        whereClause += ` AND msa.class_id=${reqParams.class_id}`;
      }
  
      if (reqParams.section_id) {
        key += `|Section:${reqParams.section_id}`;
        whereClause += ` AND msa.section_id=${reqParams.section_id}`;
      }
  
      if (reqParams.pageSize) {
        key += `|Size:${reqParams.pageSize}`;
        limitClause = ` LIMIT ${reqParams.pageSize}`;
      }
  
      if (reqParams.currentPage >= 0) {
        key += `|Page:${reqParams.currentPage}`;
        offsetClause += ` OFFSET ${reqParams.currentPage}`;
      }
  
      const cachedData = await redis.GetKeyRedis(key);
      const isAssignMarksUpdated = await assignMarksAddUpdateCheck(whereClause);
  
      isCached = cachedData && !isAssignMarksUpdated ? true : false;
  
      if (isCached) {
        data = JSON.parse(cachedData);
        const cachedCount = await redis.GetKeyRedis(`Count|${key}`);
        count = parseInt(JSON.parse(cachedCount));
        return { data, count };
      }
  
      const replaceObj = {
        "#WHERE_CLAUSE#": whereClause,
        "#LIMIT_CLAUSE#": limitClause,
        "#OFFSET_CLAUSE#": offsetClause,
      };
  
      const _query = JSONUTIL.replaceAll(QUERY.ASSIGNMARKS.getAllAssignMarks, replaceObj);
      count = await getAllAssignMarksCount(whereClause);
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
  };
  
  const assignMarksAddUpdateCheck = async (whereClause) => {
    try {
        whereClause += ` AND (msa.date_created >= NOW() - INTERVAL '5 minutes' OR msa.date_modified >= NOW() - INTERVAL '5 minutes')`;
        const query = QUERY.ASSIGNMARKS.getAllAssignMarksCount.replace('#WHERE_CLAUSE#', whereClause);
        console.log(query);
        const queryResult = await pg.executeQueryPromise(query);
        return parseInt(queryResult[0].count);
    } catch (error) {
        throw error;
    }
}

const getAllAssignMarksCount = async (whereClause) => {
    try {
        const _query = QUERY.ASSIGNMARKS.getAllAssignMarksCount.replace('#WHERE_CLAUSE#', whereClause);
        console.log('Check Query');
        console.log(_query);
        const queryResult = await pg.executeQueryPromise(_query);
        return parseInt(queryResult[0].count);
    } catch (error) {
        throw new Error(error.message);
    }
}
  

module.exports = { 
    getAssignMarksOfStudent,getAllAssignMarks
}
