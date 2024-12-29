
const { pg } = require("edu-micro-common");
const QUERY = require('../constants/QUERY');



const checkIfExamDetailsExist = async (examDetails) => {
    try {
        const { school_id, exam_name } = examDetails;
        const query = {
            text: QUERY.EXAM.checkIfExamDetailsExist,
            values: [school_id, exam_name],
        };
        const queryResult = await pg.executeQueryPromise(query);
        return queryResult[0].count;
    } catch (error) {
        console.error("Error in checkIfExamDetailsExist:", error);
        throw new Error(error.message);
    }
};


const checkIfExamExist = async (updatedExamDetails) => {
    try {
        const { exam_type_id } = updatedExamDetails;
        const query = {
            text: QUERY.EXAM.checkIfExamExist,
            values: [exam_type_id],
        };
        const queryResult = await pg.executeQueryPromise(query);
        return queryResult[0].count;
    } catch (error) {
        console.error("Error in checkIfExamTypeExists:", error);
        throw new Error(error.message);
    }
};

const addExam = async (exam) => {
    try {
        const { exam_name, school_id, status, created_by, updated_by } = exam;
        const query = {
            text: QUERY.EXAM.insertExamQuery,
            values: [exam_name, school_id, status, created_by, updated_by]
        };
        const queryResult = await pg.executeQueryPromise(query);
        return queryResult;
    } catch (error) {
        throw new Error(error.message);
    }
};

const updateExam = async (examid) => {
    try {
        const { exam_name, exam_type_id } = examid;
        const query = {
            text: QUERY.EXAM.updateExamQuery,
            values: [exam_name, exam_type_id]
        };
        const queryResult = await pg.executeQueryPromise(query);
        return queryResult;
    } catch (error) {
        throw new Error(error.message);
    }
};

const checkIfExamTypeIdExists = async (examid) => {
    try {
        const { exam_type_id } = examid;
        const query = {
            text: QUERY.EXAM.checkIfExamTypeIdExists,
            values: [exam_type_id]
        };
        const queryResult = await pg.executeQueryPromise(query);
        return queryResult[0].count;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getExamById = async (exam_type_id) => {
    try {
        const query = {
            text: QUERY.EXAM.getExamByIdQuery,
            values: [exam_type_id]
        };
        const [result] = await pg.executeQueryPromise(query);
        return result;
    } catch (error) {
        throw error;
    }
};

const getAllExam = async (school_id) => {
    try {
        const query = {
            text: QUERY.EXAM.getAllExamQuery,
            values: [school_id]
        };
        const result = await pg.executeQueryPromise(query);
        return result;
    } catch (error) {
        throw error;
    }
};

const getActiveExam = async (school_id) => {
    try {
        const query = {
            text: QUERY.EXAM.getActiveExamQuery,
            values: [school_id]
        };
        const ActiveExam = await pg.executeQueryPromise(query);
        return ActiveExam;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    addExam,
    checkIfExamDetailsExist,
    checkIfExamExist,
    checkIfExamTypeIdExists,
    getAllExam,
    getExamById,
    getActiveExam,
    updateExam
};
