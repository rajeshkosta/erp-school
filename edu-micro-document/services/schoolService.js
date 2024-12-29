const { pg, minioUtil } = require('edu-micro-common')
const { SCHOOL_QUERIES } = require('../constants/QUERY')


const getSchoolDetails = async (school_id) => {
    try {

        const query = {
            text: SCHOOL_QUERIES.getSchoolDetails,
            values: [school_id]
        }
        const result = await pg.executeQueryPromise(query);
        
        const schoolDetails = result[0];
        const logoUrl = await minioUtil.presignedGetObject(process.env.EDU_S3_BUCKET, schoolDetails.logo_url)
        schoolDetails.logo_url = logoUrl;
        return schoolDetails;

    } catch (error) {
        throw error;
    }
}

module.exports = {
    getSchoolDetails
}