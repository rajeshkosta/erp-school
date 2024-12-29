const { pg, ERRORCODE, logger } = require("edu-micro-common");
const QUERY = require('../constants/QUERY');

const addSubject = async (newSubject) => {

    try {
        const query = {
            text: QUERY.SUBJECT.insertSubjectQuery,
            values: [
                newSubject.classroom_id,
                newSubject.teacher_id,
                newSubject.subject_name,
                newSubject.status,
                newSubject.updated_by,
                newSubject.created_by
            ],
        };

        const result = await pg.executeQueryPromise(query);
        console.log(result);
        return result[0];


    } catch (error) {
        logger.error(`Error adding subject: ${error}`);
        throw error;
    }
};

const checkIfExist = async (classroomId, subjectName) => {
    try {
        const query = {
            text: QUERY.SUBJECT.checkIfExist,
            values: [classroomId, subjectName],
        };

        console.log(query);

        const result = await pg.executeQueryPromise(query);
        return result[0].count;
    } catch (error) {
        throw error;
    }
};

const getAllSubjects = async (classroom_id) => {
    try {

        const query = {
            text: QUERY.SUBJECT.getAllSubjectsQuery,
            values: [classroom_id],
        };

        const result = await pg.executeQueryPromise(query);

        return result;
    } catch (error) {
        logger.error(`Error getting all subjects: ${error}`);
        throw error;
    }
};


const getSubjectByID = async (subjectID) => {
    try {
        const query = {
            text: QUERY.SUBJECT.getSubjectByIDQuery,
            values: [subjectID],
        };

        const result = await pg.executeQueryPromise(query);

        return result // Assuming the data is in the 'rows' property
    } catch (error) {
        logger.error(`Error getting subject by ID: ${error}`);
        throw error;
    }
};





module.exports = {
    addSubject, getAllSubjects, getSubjectByID, checkIfExist

};



