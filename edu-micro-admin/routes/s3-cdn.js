const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const fileType = require('file-type');

const ERRORCODE = require('../constants/ERRORCODE');
const { STATUS, logger, minioUtil, CONST, JSONUTIL, redis } = require("edu-micro-common");
const s3CdnService = require('../services/s3-cdnService');

router.use(bodyParser.json({ limit: "5mb" }));
router.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));

router.get('/fileDownload', async (req, res) => {
    try {
        let file_name = req.query.file_name;
        if (!file_name) {
            return res.send(STATUS.BAD_REQUEST).send({ error_code: 'CDN00000', error: 'File name is required' });
        }

        let redisData = await redis.GetKeyRedis(file_name);
        if (redisData) {
            let data = JSON.parse(redisData);
            const buffer = Buffer.from(data.base64, 'base64');
            res.header('Content-type', `${data.contentType}`);
            res.header('Content-Disposition', `attachment;filename=${data.fileName}`);
            return res.status(STATUS.OK).send(buffer);
        }

        let buffer = await minioUtil.getObject(process.env.EDU_S3_BUCKET, file_name);
        const fileInfo = fileType(buffer);

        // Convert the Buffer to a base64-encoded string
        const base64String = buffer.toString('base64');
        const dataObj = {
            base64: base64String,
            contentType: fileInfo.mime,
            fileName: file_name.replace('/','')
        }
        redis.SetRedis(file_name, dataObj, CONST.CACHE_TTL.LONG).then().catch(err => console.log(err));
        // Send the base64-encoded string as the response

        res.header('Content-type', `${dataObj.contentType}`);
        res.header('Content-Disposition', `attachment;filename=${dataObj.fileName}`);
        return res.status(STATUS.OK).send(buffer);
    } catch (error) {
        logger.error(error);
        res.send(STATUS.BAD_REQUEST).send(error);
    }
});


router.get('/fileDisplay', async (req, res) => {
    try {
        let file_name = req.query.file_name;
        if (!file_name) {
            return res.send(STATUS.BAD_REQUEST).send({ error_code: 'CDN00000', error: 'File name is required' });
        }

        let redisData = await redis.GetKeyRedis(file_name);
        if (redisData) {
            let data = JSON.parse(redisData);
            const buffer = Buffer.from(data.base64, 'base64');
            res.header('Content-type', `${data.contentType}`);
            res.header('Content-Disposition', `inline;filename=${data.fileName}`);
            return res.status(STATUS.OK).send(buffer);
        }

        let buffer = await minioUtil.getObject(process.env.EDU_S3_BUCKET, file_name);
        const fileInfo = fileType(buffer);

        // Convert the Buffer to a base64-encoded string
        const base64String = buffer.toString('base64');
        const dataObj = {
            base64: base64String,
            contentType: fileInfo.mime,
            fileName: `download.${fileInfo.ext}`
        }
        redis.SetRedis(file_name, dataObj, CONST.CACHE_TTL.LONG).then().catch(err => console.log(err));
        // Send the base64-encoded string as the response

        res.header('Content-type', `${dataObj.contentType}`);
        res.header('Content-Disposition', `inline;filename=${dataObj.fileName}`);
        return res.status(STATUS.OK).send(buffer);
    } catch (error) {
        logger.error(error);
        res.send(STATUS.BAD_REQUEST).send(error);
    }
})

module.exports = router