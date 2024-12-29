const { pg,logger,queryUtility } = require("edu-micro-common");
const QUERY = require('../constants/QUERY');
const { count } = require("edu-micro-common/config/mongoDB");

 

const addContactForm = async (contactFormDetails) => {
    try {
        const {school_id,name, email_address, mobile_number, message } = contactFormDetails;
        const query = {
            text: QUERY.CONTACTFORM.insertContactFormQuery,
            values: [school_id,name, email_address, mobile_number, message]
        };
        const queryResult = await pg.executeQueryPromise(query);
        return queryResult;
    } catch (error) {
        throw new Error(error.message);
    }
};

const checkAccessKey=async(api_key)=>{
    try {
        
        const query = {
            text: QUERY.CONTACTFORM.checkAccessKey,
            values: [api_key]
        };
        const queryResult = await pg.executeQueryPromise(query);
        return queryResult;
    } catch (error) {
        throw new Error(error.message);
    }
}



const getSchoolAccessDetails = async (api_key) => {
    try {
        const _query = {
            text: QUERY.CONTACTFORM.getSchoolAccessDetails,
            values: [api_key]
        };
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult;
    } catch (error) {
        throw error;
    }
}


const getAllContactFormList = async (reqParams) => {
    try {
        let key = `ContactForm`;
        let whereClause = ` WHERE mobile_number > 0`;
        let limitClause = ''
        let offsetClause = '';
        let data, count;

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

        const _query = `SELECT * FROM tr_contact_us${whereClause}${limitClause}${offsetClause}`;
        count = await getAllContactFormCount(whereClause);
        data = await pg.executeQueryPromise(_query);
        return { data, count };

    } catch (error) {
        logger.error(error);
        throw error;
    }
} 


const getAllContactFormCount = async (whereClause) => {
    try {
        const _query = QUERY.CONTACTFORM.getContactFormCount.replace('#WHERE_CLAUSE#', whereClause);
        console.log('Check Query');
        console.log(_query);
        const queryResult = await pg.executeQueryPromise(_query);
        return parseInt(queryResult[0].count);
    } catch (error) {
        throw new Error(error.message);
    }
}

const getContactFormByIdQuery = async (contact_id) => {
    try {
        const _query = {
            text: QUERY.CONTACTFORM.getContactFormByIdQuery,
            values: [contact_id]
        };
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult;
    } catch (error) {
        throw error;
    }
}

const checkContactIdQuery = async (contact_id) =>{
    try {
        const _query = {
            text: QUERY.CONTACTFORM.checkContactIdQuery,
            values: [contact_id]
        };
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult[0].count;
    } catch (error) {
        throw error;
    }

}



module.exports = { addContactForm,getAllContactFormList,getContactFormByIdQuery,
    checkContactIdQuery,getSchoolAccessDetails,checkAccessKey };

