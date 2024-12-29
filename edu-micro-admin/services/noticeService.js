const { db, pg, redis, logger, queryUtility, s3Util, JSONUTIL } = require("edu-micro-common");

const QUERY = require('../constants/QUERY');
const fs = require('fs').promises;

//ADD NOTICE
const addNotice = async (noticeDetails) => {
    try {

        const _query = {
            text: QUERY.NOTICE.insertNoticeBoard,
            values: [
                noticeDetails.school_id,
                noticeDetails.notice_title,
                noticeDetails.published_on,
                noticeDetails.description,
                noticeDetails.created_by,
                noticeDetails.updated_by,
            ]
        };

        const result = await pg.executeQueryPromise(_query);
        return result;

    } catch (error) {
        throw error;
    }
}
//ADD ROLE ACCESS

const roleAccess = async (noticeDetails,notice_id) => {
    try {

        const _query = {
            text: QUERY.NOTICE.roleAccessInsert,
            values: [
                notice_id,
                noticeDetails.role_list,
                noticeDetails.created_by,
                noticeDetails.updated_by,
            ]
        };

        const result = await pg.executeQueryPromise(_query);
        return result;

    } catch (error) {
        console.error('Error in roleAccess service:', error);
        throw error;
    }
}


//ADD NOTICE DOCUMENT
const addNoticeDoc = async (noticeDetails, notice_id, fileName) => {
    try {

        const _query = {
            text: QUERY.NOTICE.addNoticeDocument,
            values: [
                notice_id,
                fileName,
                noticeDetails.document_path,
                noticeDetails.updated_by,
                noticeDetails.created_by,
            ]
        }
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult;
    } catch (error) {
        throw error;
    }
}

//check condition
const isNoticeExist = async (noticeDetails) => {
    try {
        const _query = {
            text: QUERY.NOTICE.checkNoticeExist,
            values: [noticeDetails.notice_title]
        }
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult[0].count;
    } catch (error) {
        throw error;
    }
}


const checkNoticeIdExist = async (noticeDetails) => {
    try {
        const _query = {
            text: QUERY.NOTICE.checkNoticeIDExist,
            values: [noticeDetails.notice_id]
        }
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult[0].count;
    } catch (error) {
        throw error;
    }
}
//GET BY ID

const getNoticeById = async (notice_id) => {
    try {
        const _query = {
            text: QUERY.NOTICE.getNoticeById,
            values: [notice_id]
        }
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult;
    } catch (error) {
        throw error;
    }
}

const getNoticeDoc = async (notice_id) => {
    try {
        const _query = {
            text: QUERY.NOTICE.getNoticeDocById,
            values: [notice_id]
        }
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult;
    } catch (error) {
        throw error;
    }
}

const checkNoticeId = async (notice_id) => {
    try {
        const _query = {
            text: QUERY.NOTICE.checkNoticeIDExist,
            values: [notice_id]
        }
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult[0].count;
    } catch (error) {
        throw error;
    }
}


//GET ALL

const getAllNotice = async (reqParams) => {
    try {

        let key = `Notice`;
        let whereClause = ` WHERE status > 0`;
        let limitClause = ''
        let offsetClause = '';
        let data, count;
        let isCached = false;

        if (reqParams.school_id) {
            key += `|School:${reqParams.school_id}`;
            whereClause += ` AND school_id=${reqParams.school_id}`;
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
        const isNoticeUpdated = await NoticeAddUpdateCheck(whereClause);
        isCached = (cachedData) && (isNoticeUpdated == 0) ? true : false;

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

        const _query = JSONUTIL.replaceAll(QUERY.NOTICE.getAllNotice, replaceObj);
        console.log(_query);

        count = await getAllNoticeCount(whereClause);
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

const NoticeAddUpdateCheck = async (whereClause) => {
    try {
        whereClause += ` AND (date_created >= NOW() - INTERVAL '5 minutes' OR date_updated >= NOW() - INTERVAL '5 minutes')`;
        const query = QUERY.NOTICE.getNoticeCount.replace('#WHERE_CLAUSE#', whereClause);
        console.log(query);
        const queryResult = await pg.executeQueryPromise(query);
        return parseInt(queryResult[0].count);
    } catch (error) {
        throw error;
    }
}

const getAllNoticeCount = async (whereClause) => {
    try {
        const _query = QUERY.NOTICE.getNoticeCount.replace('#WHERE_CLAUSE#', whereClause);
        console.log('Check Query');
        console.log(_query);
        const queryResult = await pg.executeQueryPromise(_query);
        return parseInt(queryResult[0].count);
    } catch (error) {
        throw new Error(error.message);
    }
}

//UPDATE SERVICE
const updateNotice = async (noticeDetails) => {
    try {
        const notice_id = noticeDetails.notice_id;
        delete noticeDetails.notice_id;
        let setQuery = queryUtility.convertObjectIntoUpdateQuery(noticeDetails);
        let updateQuery = `${QUERY.NOTICE.updateNotice} ${setQuery} WHERE notice_id = $1`;
        const _query = {
            text: updateQuery,
            values: [notice_id]
        };
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult;
    } catch (error) {
        console.log(error);
        throw error;
    }

}

const checkNoticeDoc = async (notice_id) => {
    try {
        const _query = {
            text: QUERY.NOTICE.checkNoticeDoc,
            values: [notice_id]
        }
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult[0].count;
    } catch (error) {
        throw error;
    }
}

const updatedNoticeDocument = async (notice_id, UpdateDocument, fileName) => {
    try {
        const _query = {
            text: QUERY.NOTICE.updatedNoticeDocument,
            values: [notice_id, fileName, UpdateDocument]
        }
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult;
    } catch (error) {
        throw error;
    }
}

const addNoticeDocUpdate = async (notice_id, UpdateDocument, fileName) => {
    try {
        const _query = {
            text: QUERY.NOTICE.addNoticeDocumentIfNot,
            values: [notice_id, fileName, UpdateDocument]
        }
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult;
    } catch (error) {
        throw error;
    }
}

const isUpdateNoticeExistWithId = async (noticeDetails) => {
    try {
        const _query = {
            text: QUERY.NOTICE.isUpdateNotExistWithId,
            values: [noticeDetails.notice_id, noticeDetails.notice_title]
        }
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult[0].count;
    } catch (error) {
        throw error;
    }
}

const isUpdateNoticeExist = async (noticeDetails) => {
    try {
        const _query = {
            text: QUERY.NOTICE.isUpdateNotExist,
            values: [noticeDetails.notice_title]
        }
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult[0].count;
    } catch (error) {
        throw error;
    }
}


//DOWNLOAD NOTICE

const NoticeDocDetails = async(notice_id) =>{
    try{
        const _query = {
            text:QUERY.NOTICE.getNoticeDocDetails,
            values:[notice_id]
        };
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult;
    }catch(error){
        throw error;
    }
}

//GET NOTICE ACCESS


const getNoticeAccDetails = async(roleID,schoolID) =>{
    try{
        const _query = {
            text:QUERY.NOTICE.getNoticeAccDetails,
            values:[roleID,schoolID]
        };
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult;
    }catch(error){
        throw error;
    }
}



module.exports = {
    addNotice,
    addNoticeDoc,
    isNoticeExist,
    getNoticeById,
    getNoticeDoc,
    checkNoticeIdExist,
    getAllNotice,
    updateNotice,
    checkNoticeDoc,
    updatedNoticeDocument,
    addNoticeDocUpdate,
    checkNoticeId,
    isUpdateNoticeExistWithId,
    isUpdateNoticeExist,
    NoticeDocDetails,
    roleAccess,
    getNoticeAccDetails
}