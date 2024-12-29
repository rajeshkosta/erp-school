const minioUtil = require('../utility/minio.util');
const QUERY = require('../constants/QUERY');
const pg = require('../config/pg');

const getFileUploadPath = async (reqFile, folderName, fileType) => {
    try {
        validateFile(reqFile);

        if (!folderName) {
            return {"error":"Please provide folder Name"};
        }

        if (!fileType && fileType.length < 0) {
            return {"error":"Please provide fileType"};
        }

        validateFileType(reqFile, fileType);

        let file_name = reqFile.name;
        let fileExt = file_name.split(".");
        let ext = fileExt[fileExt.length - 1];
        file_name = Date.now() + "-" + Math.floor(Math.random() * 100) + "." + ext;

        const params = {
            Bucket: process.env.EDU_S3_BUCKET,
            FileName: `${folderName}/${file_name}`,
            Body: reqFile.data
        };

        await minioUtil.putObject(params.Bucket, params.FileName, params.Body);
        return params.FileName;

    } catch (error) {
        throw error;
    }
};

const validateFileType = (reqFile, fileType) =>{

    try {
        let allowedExt = [];
    let allowedFiles = [];
    let file_name = reqFile.name;
    let content_type = reqFile.mimetype;
    
    if(fileType.includes("IMAGE")){
        allowedExt.push("png", "jpeg", "jpg");
        allowedFiles.push("image/png", "image/jpeg", "image/jpg");

    }
    if(fileType.includes("PDF")){
        allowedExt.push("pdf");
        allowedFiles.push("application/pdf");

    }
    if(fileType.includes("SHEET")){
        allowedExt.push('xls', 'xlsx', 'csv');
        allowedFiles.push('application/octet-stream', 
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/csv');
    }

    if (fileType.includes("WORD")) {
        allowedExt.push('doc', 'docx');
        allowedFiles.push('application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    }

    let fileExt = file_name.split(".");
    let ext = fileExt[fileExt.length - 1];

    if (!allowedFiles.includes(content_type) || !allowedExt.includes(ext.toLowerCase())) {
        throw {"error":`File format should be ${allowedExt.join(", ").toUpperCase()}`};
    }
    return;
    } catch (error) {
        throw error;
    }    
};


const validateFile = (reqFile) => {
    try {
        // if (!reqFile || Object.keys(reqFile).length === 0) {
        //     throw {"error":"No files were uploaded."};
        // }
    
        let file_name = reqFile.name;
        let file_size = reqFile.size;

        if (file_name && file_name.split(".").length > 2) {
            throw {"error":"Invalid file name"};
        }
    
        if (file_size >= 2000000) {
            throw {"error": "File size should be less than 2MB"}
        }
        return;
    } catch (error) {
        throw error;
    }
};

const getEduName = async (userData) =>{
    try {
        if(userData.school_id){
            return await getSchoolName(userData.school_id);
        }else if(userData.trust_id){
            return await getTrustName(userData.trust_id);
        }else{
            return 'EDUEZE';
        }
    } catch (error) {
        throw new Error(error.message);
    }
    
}

const getTrustName = async (trust_id) => {
    try {
        const _query = {
            text: QUERY.ADMIN.getTrustName,
            values: [trust_id]
        };

        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult && queryResult.length > 0 ? queryResult[0].name : 'EDUEZE';

    } catch (error) {
        throw new Error(error.message);
    }
}

const getSchoolName = async (school_id) => {
    try {
        const _query = {
            text: QUERY.ADMIN.getSchoolName,
            values: [school_id]
        };

        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult && queryResult.length > 0 ? queryResult[0].name : 'EDUEZE';

    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = { getFileUploadPath, getEduName };