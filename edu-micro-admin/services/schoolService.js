const { db, pg, redis, logger, queryUtility, s3Util ,JSONUTIL} = require("edu-micro-common");
const QUERY = require('../constants/QUERY');
const ERRORCODE = require('../constants/ERRORCODE');
const fileConfig = require('../constants/config');
const CONSTANT = require("../constants/CONST");

const validatePattern = async (name, description) => {
    return new Promise((resolve, reject) => {
        let error = '';
       
        resolve(error);
    }); // Promise
};

const addSchool=async(schoolReq)=>{
    try{
const _query={
    text:QUERY.SCHOOL.addSchool, 
    values:[schoolReq.trust_id,
        schoolReq.school_name,
        schoolReq.contact_number,
        schoolReq.address,
        schoolReq.pincode,
        schoolReq.block,
        schoolReq.district,
        schoolReq.state,
        schoolReq.email_id,
        schoolReq.school_board,
        schoolReq.school_type,
        schoolReq.school_motto,
        schoolReq.logo_url,
        1,
        schoolReq.updated_by,
        schoolReq.created_by,
        schoolReq.principal_name,
        schoolReq.established_year,
    ],
};

const queryResult = await pg.executeQueryPromise(_query);
return queryResult;


    }catch(error)
    {
        throw error;
    }
}


const updateSchool=async(schoolReq)=>{
    try{
const _query={
    text:QUERY.SCHOOL.updateSchool, 
    values:[
        schoolReq.school_id,
       schoolReq.contact_number,
        schoolReq.school_name,  
        schoolReq.address,
        schoolReq.pincode,
        schoolReq.block,
        schoolReq.district,
        schoolReq.state,
        schoolReq.email_id,
        schoolReq.school_board,
        schoolReq.school_type,
        schoolReq.school_motto,
        schoolReq.logo_url,
        1,
        schoolReq.updated_by,
        schoolReq.principal_name,
        schoolReq.established_year,
    ],
};
    const queryResult = await pg.executeQueryPromise(_query);
    return queryResult;
    }catch(error)
    {
        throw error;
    }
}

const updateSchoolLogo = async (path, reqUser) => {
  try {
    const _query = {
      text: QUERY.SCHOOL.updateSchoolLogo,
      values: [
        path,
        reqUser.user_id,
        reqUser.school_id
      ],
    };
    const queryResult = await pg.executeQueryPromise(_query);
    return queryResult;
  } catch (error) {
    throw error;
  }
}

const checkIfExist=async(school)=>{
    try{
        let _text = QUERY.SCHOOL.checkSchoolExist
        let _query = {
          text: _text,
          values: [school.school_name, school.trust_id],
        };
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult[0].count;
    }
    catch(err){
        throw error;
    }
}


const checkSchoolAvailable=async(school)=>{
    try{
        let _text = QUERY.SCHOOL.checkSchoolId
        let _query = {
          text: _text,
          values: [school.school_id, school.trust_id],
        };
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult[0].count;
    }
    catch(err){
        throw error;
    }
}

const getSpecificSchoolDetails=async(school_id)=>{
    try{
        const _query = {
            text: QUERY.SCHOOL.getSpecificSchoolDetails,
            values: [school_id],
          };
          const queryResult = await pg.executeQueryPromise(_query);
          return queryResult && queryResult.length > 0 ? queryResult[0] : null;
    }
    catch(err){
        throw error;
    }
}

const getAllSchool=async(reqParams)=>{
    try {
        let key = `School-Data`;
        let whereClause = ` WHERE school_id > 0`;
        let limitClause = "";
        let offsetClause = "";
        let data, count;
        let isCached = false;
    
        if (reqParams.status) {
          key += `|Status:${reqParams.status}`;
          whereClause += ` AND status=${reqParams.status}`;
        }

        if (reqParams.trust_id) {
          key += `|TrustId:${reqParams.trust_id}`;
          whereClause += ` AND trust_id=${reqParams.trust_id}`;
        }
    
        if (reqParams.pageSize) {
          key += `|Size:${reqParams.pageSize}`;
          limitClause = ` LIMIT ${reqParams.pageSize}`;
        }
    
        if (reqParams.currentPage) {
          key += `|Offset:${reqParams.currentPage}`;
          offsetClause += ` OFFSET ${reqParams.currentPage}`;
        }
    
        const cachedData = await redis.GetKeyRedis(key);
        const isSchoolUpdated = await schoolAddUpdateCheck(whereClause);
    
        isCached = cachedData && isSchoolUpdated == 0 ? true : false;
    
        if (isCached) {
          data = JSON.parse(cachedData);
          const cachedCount = await redis.GetKeyRedis(`Count|${key}`);
          console.log(cachedCount);
          count = parseInt(JSON.parse(cachedCount));
          return { data, count };
        }
    
        const replaceObj = {
          "#WHERE_CLAUSE#": whereClause,
          "#LIMIT_CLAUSE#": limitClause,
          "#OFFSET_CLAUSE#": offsetClause,
        };
        console.log(replaceObj);
    
        const _query = JSONUTIL.replaceAll(QUERY.SCHOOL.getAllSchool, replaceObj);
    
        console.log('_query---',_query);
        count = await getAllSchoolCount(whereClause);
        redis
          .SetRedis(`Count|${key}`, count, CONSTANT.CACHE_TTL.school.LONG)
          .then()
          .catch((err) => console.log(err));
        data = await pg.executeQueryPromise(_query);
        redis
          .SetRedis(key, data, CONSTANT.CACHE_TTL.school.LONG)
          .then()
          .catch((err) => console.log(err));
    
        return { data, count };
      } catch (error) {
        console.log(error);
        throw error;
      }
}

const getAllSchoolCount = async (whereClause) => {
    try {

        const _query = QUERY.SCHOOL.getAllSchoolCount.replace('#WHERE_CLAUSE#', whereClause);
        const queryResult = await pg.executeQueryPromise(_query);
        return parseInt(queryResult[0].count);

    } catch (error) {
        throw error;
    }
}


const schoolAddUpdateCheck = async (whereClause) => {
    try {
      whereClause += ` AND (date_created >= NOW() - INTERVAL '5 minutes' OR date_modified >= NOW() - INTERVAL '5 minutes')`;
      const _query = QUERY.SCHOOL.getAllSchoolCount.replace(
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


  const getSchoolDetailsBasedOnTrust=async(trust_id)=>{
    try{
        const _query = {
            text: QUERY.SCHOOL.schoolListBasedOnTrust,
            values: [trust_id],
          };
          const result = await pg.executeQueryPromise(_query);
          return result; 
    }
    catch(err){
        throw error;
    }
}


const getStdMappingDetails=async(school_id)=>{
  try{
    const _query = {
        text: QUERY.SCHOOL.getStdMappingDetails,
        values: [school_id],
      };
      const result = await pg.executeQueryPromise(_query);
      return result; 
}
catch(err){
    throw error;
}
}

const getStdList=async()=>{
  try{
    const _query = {
        text: QUERY.SCHOOL.getStdList,
       
      };
      const result = await pg.executeQueryPromise(_query);
      return result; 
}
catch(err){
    throw error;
}
}

module.exports = {
    validatePattern,
    addSchool,
    updateSchool,
    checkIfExist,
    checkSchoolAvailable,
    getSpecificSchoolDetails,
    getAllSchool,
    getAllSchoolCount,
    getSchoolDetailsBasedOnTrust,
    updateSchoolLogo,
    getStdMappingDetails,
    getStdList
  };
  
