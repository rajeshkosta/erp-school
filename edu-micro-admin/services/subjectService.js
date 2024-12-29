const { pg, redis,ERRORCODE, CONST, logger } = require("edu-micro-common");
const QUERY = require('../constants/QUERY');

const addSubject = async (newSubject) => {

    try {
        const query = {
            text: QUERY.SUBJECT.insertSubjectQuery,
            values: [
                newSubject.school_id, 
                newSubject.subject_name,
                newSubject.status,
                newSubject.updated_by,
                newSubject.created_by
            ],
        };

        const result = await pg.executeQueryPromise(query);
    
        return result[0];
        

    } catch (error) {
        logger.error(`Error adding subject: ${error}`);
        throw error;
    }
};

const checkIfExist = async (schoolId, subjectName) => {
    try {
        const query = {
            text: QUERY.SUBJECT.checkIfExist,
            values: [schoolId, subjectName],
        };

        const result = await pg.executeQueryPromise(query);
        return result[0].count;
    } catch (error) {
        throw error;
    }
};


const checkIfExistbyID = async (schoolId, subjectName,subjectId) => {
    try {
        const query = {
            text: QUERY.SUBJECT.checkIfExistbyId,
            values: [schoolId, subjectName,subjectId],
        };

        const result = await pg.executeQueryPromise(query);
        return result[0].count;
    } catch (error) {
        throw error;
    }
};



const 
getAllSubjects = async (schoolId) => {
    try {
      const query = {
        text: QUERY.SUBJECT.getAllSubjectsQuery,
        values: [schoolId],
      };
  
      const result = await pg.executeQueryPromise(query);
  
      return result;
    } catch (error) {
      logger.error(`Error getting all subjects: ${error}`);
      throw error;
    }
  };


const UpdateSubjectDetails = async (subjectDetails) => {
  try {
      const query = {
          text: QUERY.SUBJECT.updateSubjectNameQuery,
          values: [
            subjectDetails.subject_id,
            subjectDetails.subject_name,
             subjectDetails.updated_by, 
              
          ],
      };

      const result = await pg.executeQueryPromise(query);
      return result[0];  
  } catch (error) {
      logger.error(`Error updating subject name: ${error}`);
      throw error;
  }
};

const getAllActiveSubjects = async (schoolId) => {
  try {
      const query = {
          text: QUERY.SUBJECT.getAllActiveSubjects,
          values: [schoolId],
      };

      const result = await pg.executeQueryPromise(query);

      return result;
  } catch (error) {
      logger.error(`Error getting all active subjects: ${error}`);
      throw error;
  }
};



const getSubjectById = async (subjectId) => {
    try {
        const query = {
            text: QUERY.SUBJECT.getSubjectById,
            values: [subjectId],
        };
        const result = await pg.executeQueryPromise(query);
        return result[0]; // Assuming you expect only one subject for the given id
    } catch (error) {
        logger.error(`Error getting subject by ID: ${error}`);
        throw error;
    }
};


const subjects= async () => {
    try {
        const key = 'SUBJECTS';  
       
        let redisResult = await redis.GetKeyRedis(key);
        if (redisResult && redisResult.length > 0 && redisResult[0])
        {
            let redisSubject=JSON.parse(redisResult);
            return redisSubject.sort();
        }else{
            const result = await pg.executeQueryPromise({
                text: QUERY.SUBJECT.getAllSubjectSuggestion,
            });
       
        let SubjectResult=  result.map(item => item.subject);
        redis.SetRedis(key, SubjectResult, CONST.CACHE_TTL.LONG);
        return SubjectResult.sort();
        }
           
    } 
    catch (error) {
        console.error('Error in assignmentService.getSubjects:', error);
        throw error;
    }
};

module.exports = {
    addSubject,checkIfExist,getAllSubjects,
    UpdateSubjectDetails,getAllActiveSubjects,getSubjectById,checkIfExistbyID,subjects
    
};