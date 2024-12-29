
const { db, pg, redis, logger, queryUtility, s3Util, JSONUTIL } = require("edu-micro-common");
const QUERY = require('../constants/QUERY');
const fs = require('fs').promises;

//ADD ASSIGNMENT
const addAssignment = async (assignmentDetails) => {
    try {

        const _query = {
            text: QUERY.ASSIGNMENT.addAssignmentDetails,
            values: [
            assignmentDetails.classroom_id,
            assignmentDetails.subject_id,
            assignmentDetails.assignment_title,
            assignmentDetails.start_date,
            assignmentDetails.end_date,
            assignmentDetails.assignment_description,
            assignmentDetails.created_by,
            assignmentDetails.updated_by,
            ]
        };

        const result = await pg.executeQueryPromise(_query);
        return result;

    } catch (error) {
        throw error;
    }
}


const addAssignmentDoc = async(assignmentDetails,assignment_id) =>{
    try{

        const _query = {
            text: QUERY.ASSIGNMENT.addAssignmentDocument,
            values:[
                assignment_id,
                assignmentDetails.classroom_id,
                assignmentDetails.assignment_document,
                assignmentDetails.updated_by,
                assignmentDetails.created_by,
            ]
        }
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult;
    }catch(error){
        throw error;
    }
}


//CHECK CONDITION
const checkAssignment = async(assignmentDetails) =>{
    try{
        const _query = {
            text:QUERY.ASSIGNMENT.checkAssignmentExist,
            values:[assignmentDetails.classroom_id,assignmentDetails.subject_id,assignmentDetails.assignment_title]
        }
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult[0].count;
    }catch(error){
        throw error;
    }
}

const isClassRoomExistInTab = async(assignmentDetails) =>{
    try{
        const _query = {
            text:QUERY.ASSIGNMENT.isClassRoomExistInTab,
            values:[assignmentDetails.school_id,assignmentDetails.classroom_id]
        }
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult[0].count;
    }catch(error){
        throw error;
    }
}

const   isSubjectExistInTab = async (assignmentDetails) =>{
    try{
        const _query = {
            text:QUERY.ASSIGNMENT.isSubjectExistInTab,
            values:[assignmentDetails.subject_id]
        }
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult[0].count;
    }catch(error){
        throw error;
    }
}


const checkAssignmentId = async(assignment_id) =>{
    try{
        const _query={
            text:QUERY.ASSIGNMENT.checkAssignmentById,
            values:[assignment_id]
        }
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult[0].count;
    }catch(error){
        throw error;
    }
}

const checkUpdateAssignmentId = async(assignmentDetails) =>{
    try{
        const _query={
            text:QUERY.ASSIGNMENT.checkAssignmentById,
            values:[assignmentDetails.assignment_id]
        }
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult[0].count;
    }catch(error){
        throw error;
    }
}


const isClassRoomExistUpdate = async(assignmentDetails) =>{
    try{
        const _query = {
            text:QUERY.ASSIGNMENT.isClassRoomExistUpdate,
            values:[assignmentDetails.classroom_id]
        }
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult[0].count;
    }catch(error){
        throw error;
    }
}


const isUpdateAssExistWithId = async(assignmentDetails) =>{
    try{
        const _query = {
            text:QUERY.ASSIGNMENT.isUpdateAssExistWithId,
            values:[assignmentDetails.assignment_id,assignmentDetails.subject_id,assignmentDetails.assignment_title]
        }
        const queryResult = await pg.executeQueryPromise(_query);
        console.log("Count by id....",queryResult[0].count);
        return queryResult[0].count;
    }catch(error){
        throw error;
    }
}


const isUpdateAssExist = async(assignmentDetails) =>{
    try{
        const _query = {
            text:QUERY.ASSIGNMENT.isUpdateAssExist,
            values:[assignmentDetails.subject_id,assignmentDetails.assignment_title]
        }
        const queryResult = await pg.executeQueryPromise(_query);
        console.log("Count ass....",queryResult[0].count);
        return queryResult[0].count;
    }catch(error){
        throw error;
    }
}

//GET ALL 


const getAllAssignment = async (reqParams) => {
    try {

        let key = `Assignment`;
        let whereClause = ` WHERE ma.status > 0`;
        let limitClause = ''
        let offsetClause = '';
        let data, count;
        let isCached = false;

        if (reqParams.academic_year_id) {
            key += `|Academic:${reqParams.academic_year_id}`;
            whereClause += ` AND mcl.academic_year_id=${reqParams.academic_year_id}`;
        }

        if (reqParams.user_id) {
            key += `|User:${reqParams.user_id}`;
            whereClause += ` AND (ma.created_by=${reqParams.user_id} OR ma.updated_by=${reqParams.user_id})`;
        }

        if (reqParams.class_id) {
            key += `|Class:${reqParams.class_id}`;
            whereClause += ` AND mcl.class_id=${reqParams.class_id}`;
        }

        if (reqParams.section_id) {
            key += `|Section:${reqParams.section_id}`;
            whereClause += ` AND mcl.section_id=${reqParams.section_id}`;
        }

        if (reqParams.classroom_id) {
            key += `|Classroom:${reqParams.classroom_id}`;
            whereClause += ` AND mcl.classroom_id=${reqParams.classroom_id}`;
        }

        if (reqParams.subject_id) {
            key += `|Subject:${reqParams.subject_id}`;
            whereClause += ` AND ma.subject_id=${reqParams.subject_id}`;
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
        const isAssignmentUpdated = await AssignmentAddUpdateCheck(whereClause);
        isCached = (cachedData) && (isAssignmentUpdated == 0) ? true : false;

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

        const _query = JSONUTIL.replaceAll(QUERY.ASSIGNMENT.getAllAssignment, replaceObj);
        console.log(_query);

        count = await getAllAssignmentCount(whereClause);
        data = await pg.executeQueryPromise(_query);
        if (data.length > 0) {
            redis.SetRedis(`Count|${key}`, count, 10 * 60).then().catch(err => console.log(err));
            redis.SetRedis(key, data, 10 * 60).then().catch(err => console.log(err));
        }

        return { data, count };

    } catch (error) {
        throw error;
    }
}

const AssignmentAddUpdateCheck = async (whereClause) => {
    try {
        whereClause += ` AND (ma.date_created >= NOW() - INTERVAL '5 minutes' OR ma.date_updated >= NOW() - INTERVAL '5 minutes')`;
        const query = QUERY.ASSIGNMENT.getAssignmentCount.replace('#WHERE_CLAUSE#', whereClause);
        console.log(query);
        const queryResult = await pg.executeQueryPromise(query);
        return parseInt(queryResult[0].count);
    } catch (error) {
        throw error;
    }
}

const getAllAssignmentCount = async (whereClause) => {
    try {
        const _query = QUERY.ASSIGNMENT.getAssignmentCount.replace('#WHERE_CLAUSE#', whereClause);
        console.log('Check Query');
        console.log(_query);
        const queryResult = await pg.executeQueryPromise(_query);
        return parseInt(queryResult[0].count);
    } catch (error) {
        throw new Error(error.message);
    }
}

//GET BY ID
const getAssignmentById = async (assignment_id) =>{
    try{
        const _query = {
            text:QUERY.ASSIGNMENT.getAssignmentById,
            values:[assignment_id]
        }
         const queryResult = await pg.executeQueryPromise(_query);
         return queryResult;
    }catch(error){
        throw error;
    }
}

//UPDATE ASSIGNMENT
const updatedAssignment = async (assignmentDetails) => {
    try {
        const assignment_id = assignmentDetails.assignment_id;
        console.log("detail....",assignmentDetails);
        delete assignmentDetails.assignment_id;
        delete assignmentDetails.assignment_document;
        let setQuery = queryUtility.convertObjectIntoUpdateQuery(assignmentDetails);
        let updateQuery = `${QUERY.ASSIGNMENT.updateQuery} ${setQuery} WHERE assignment_id = $1`;
        const _query = {
            text: updateQuery,
            values: [assignment_id]
        };
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult;
    } catch (error) {
        console.log(error);
        throw error;
    }

}

//update document
const updatedAssignmentDocument = async(assignmentID,document) =>{
    try{
        
        const _query = {
            text:QUERY.ASSIGNMENT.updatedAssignmentDocument,
            values:[
                assignmentID,
                document,
            ]
        }
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult;
    }catch(error){
        throw error;
    }
}

//ADD IF not exist assignment document

const addAssignmentDocUpdate = async(assignment_id,updateDocument) =>{
    try{
        const _query ={
            text:QUERY.ASSIGNMENT.addAssignmentDocumentIfnot,
            values:[assignment_id,
                updateDocument
            ]
        }
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult;
    }catch(error){
        throw error;
    }
}


//DOWNLOAD DOCUMENT
const   assDocDetails = async(a_d_id) =>{
    try{
        const _query = {
            text:QUERY.ASSIGNMENT.getAssDocDetail,
            values:[a_d_id]
        };
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult;
    }catch(error){
        throw error;
    }
}


const   getAssDocDetailsByAssId = async(assignment_id) =>{
    try{
        const _query = {
            text:QUERY.ASSIGNMENT.getAssDocDetailsByAssId,
            values:[assignment_id]
        };
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult;
    }catch(error){
        throw error;
    }
}


//assignment List
const getAssignmentClassList = async(academicYearId) =>{
    try{
        const _query ={
            text:QUERY.ASSIGNMENT.getAssignmentClassList,
            values:[academicYearId]
        }
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult;
    }catch(error){
        throw error;
    }
}


//check assignment doc
const checkAssDoc = async(assignmentID) =>{
    try{
        const _query = {
            text:QUERY.ASSIGNMENT.checkAssDoc,
            values:[assignmentID]
        }
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult[0].count;
    }catch(error){
        throw error;
    }
}




module.exports = {
    addAssignment,
    checkAssignment,
    isClassRoomExistInTab,
    isSubjectExistInTab,
    getAllAssignment,
    checkAssignmentId,
    getAssignmentById,
    updatedAssignment,
    checkUpdateAssignmentId,
    isClassRoomExistUpdate,
    addAssignmentDoc,
    assDocDetails,
    getAssignmentClassList,
    updatedAssignmentDocument,
    checkAssDoc,
    addAssignmentDocUpdate,
    getAssDocDetailsByAssId,
    isUpdateAssExistWithId,
    isUpdateAssExist
};



