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
const { log } = require("util");


const checkExamTypeExist = async (examinationDetails) => {
  try {
    const _query = {
      text: QUERY.EXAMINATION.checkExamTypeidExist,
      values: [examinationDetails.academic_year_id, examinationDetails.exam_type_id, examinationDetails.class_id, examinationDetails.subject_id],
    };

    console.log(_query);

    const queryResult = await pg.executeQueryPromise(_query);
    return queryResult[0].count;
  } catch (error) {
    throw error;
  }
};

const checkExamTypeExist1 = async (examinationDetails) => {
  try {
    const _query = {
      text: QUERY.EXAMINATION.checkExamTypeidExist1,
      values: [examinationDetails.academic_year_id, examinationDetails.exam_type_id, examinationDetails.class_id, examinationDetails.subject_id, examinationDetails.examination_id],
    };

    console.log(_query);

    const queryResult = await pg.executeQueryPromise(_query);
    return queryResult[0].count;
  } catch (error) {
    throw error;
  }
};

const createExamination = async (examinationDetails) => {
  console.log(examinationDetails);
  try {
    const _query = {
      text: QUERY.EXAMINATION.createExamination,
      values: [
        examinationDetails.class_id,
        examinationDetails.academic_year_id,
        examinationDetails.subject_id,
        examinationDetails.description,
        examinationDetails.exam_type_id,
        examinationDetails.exam_date,
        examinationDetails.duration,
        examinationDetails.total_marks,
        examinationDetails.passing_marks,
        examinationDetails.status,
        examinationDetails.created_by,
        examinationDetails.updated_by,
      ],
    };

    console.log(_query);
    const queryResult = await pg.executeQueryPromise(_query);
    // redis.deleteKey("Trust-Data|Size:20|Offset:0");
    // redis.deleteKey("Count|Trust-Data|Size:20|Offset:0");
    return queryResult;
  } catch (error) {
    throw error;
  }
};

const updateExamination = async (examinationDetails) => {
  try {
    let examination_id = examinationDetails.examination_id;
    delete examinationDetails.examination_id;
    let setQuery = queryUtility.convertObjectIntoUpdateQuery(examinationDetails);
    let updateQuery = `${QUERY.EXAMINATION.updateExamination} ${setQuery} 
      , date_modified = now() WHERE examination_id = $1`;

    console.log(updateQuery);

    const _query = {
      text: updateQuery,
      values: [examination_id]
    };
    console.log(_query);

    const queryResult = await pg.executeQueryPromise(_query);
    return queryResult;
  } catch (error) {

    console.log(error);
    throw error;
  }
};

const getAllExaminations = async (reqParams) => {
  try {
    let key = `Examination-Data|Classroom:${reqParams.classroom_id}`;
    let whereClause = ` WHERE E.classroom_id = ${reqParams.classroom_id}`;
    let limitClause = "";
    let offsetClause = "";
    let data, count;
    let isCached = false;

    if (reqParams.status) {
      key += `|Status:${reqParams.status}`;
      whereClause += ` AND E.status=${reqParams.status}`;
    }

    if (reqParams.pageSize) {
      key += `|Size:${reqParams.pageSize}`;
      limitClause = ` LIMIT ${reqParams.pageSize}`;
    }

    if (reqParams.currentPage >= 0) {
      key += `|Offset:${reqParams.currentPage}`;
      offsetClause += ` OFFSET ${reqParams.currentPage}`;
    }

    const cachedData = await redis.GetKeyRedis(key);
    const isExaminationUpdated = await examinationAddUpdateCheck(whereClause);

    isCached = cachedData && isExaminationUpdated == 0 ? true : false;

    if (isCached) {
      console.log("isCached", isCached);
      data = JSON.parse(cachedData);
      const cachedCount = await redis.GetKeyRedis(`Count|${key}`);
      console.log("cachedCount", cachedCount);
      count = parseInt(JSON.parse(cachedCount));
      return { data, count };
    }

    const replaceObj = {
      "#WHERE_CLAUSE#": whereClause,
      "#LIMIT_CLAUSE#": limitClause,
      "#OFFSET_CLAUSE#": offsetClause,
    };
    console.log(replaceObj);

    const _query = JSONUTIL.replaceAll(QUERY.EXAMINATION.getAllExaminations, replaceObj);

    console.log("ffff", _query);
    count = await getAllExaminationsCount(whereClause);
    redis
      .SetRedis(`Count|${key}`, count, CONSTANT.CACHE_TTL.examination.LONG)
      .then()
      .catch((err) => console.log(err));
    data = await pg.executeQueryPromise(_query);
    redis
      .SetRedis(key, data, CONSTANT.CACHE_TTL.examination.LONG)
      .then()
      .catch((err) => console.log(err));

    return { data, count };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const examinationAddUpdateCheck = async (whereClause) => {
  try {
    whereClause += ` AND (E.date_created >= NOW() - INTERVAL '5 minutes' OR E.date_modified >= NOW() - INTERVAL '5 minutes')`;
    const _query = QUERY.EXAMINATION.getAllExaminationsCount.replace(
      "#WHERE_CLAUSE#",
      whereClause
    );
    console.log(_query);
    const queryResult = await pg.executeQueryPromise(_query);
    return parseInt(queryResult[0].count);
  } catch (error) {
    throw error;
  }
};

const getAllExaminationsCount = async (whereClause) => {
  try {

    const _query = QUERY.EXAMINATION.getAllExaminationsCount.replace('#WHERE_CLAUSE#', whereClause);
    const queryResult = await pg.executeQueryPromise(_query);
    return parseInt(queryResult[0].count);

  } catch (error) {
    throw error;
  }
};

const getclassList = async (academicYearId) => {
  try {

    const _query = {
      text: QUERY.EXAMINATION.getclassList,
      values: [academicYearId]
    };

    const queryResult = await pg.executeQueryPromise(_query);
    return queryResult;

  } catch (error) {
    throw error;
  }
};

const examListByClass = async (academicYearId, classId) => {
  try {

    const _query = {
      text: QUERY.EXAMINATION.examListByClass,
      values: [academicYearId, classId]
    };

    const queryResult = await pg.executeQueryPromise(_query);
    return queryResult;

  } catch (error) {
    throw error;
  }
};

const getByExaminationId = async (examinationId) => {
  try {

    const _query = {
      text: QUERY.EXAMINATION.getByExaminationId,
      values: [examinationId]
    };

    const queryResult = await pg.executeQueryPromise(_query);
    return queryResult && queryResult.length > 0 ? queryResult[0] : null;

  } catch (error) {
    throw error;
  }
};


module.exports = {
  checkExamTypeExist,
  createExamination,
  updateExamination,
  checkExamTypeExist1,
  getAllExaminations,
  examinationAddUpdateCheck,
  getAllExaminationsCount,
  getclassList,
  examListByClass,
  getByExaminationId
};