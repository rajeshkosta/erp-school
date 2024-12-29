const express = require('express');
const router = express.Router();
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
//const fileType = require('file-type');
const { STATUS, minioUtil, logger, DB_STATUS, s3Util, commonService, CONST } = require("edu-micro-common");
const ERRORCODE = require("../constants/ERRORCODE.js");
router.use(bodyParser.json({ limit: "5mb" }));
router.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));
let async = require('async');
let noticeModel = require('../models/noticeModel.js');
let noticeService = require('../services/noticeService.js');
router.use(fileUpload());


//ADD NOTICE 
router.post('/addNotice', async (req, res) => {
    try {
        const noticeData = JSON.parse(`${req.body.notice_data}`)
        const reqUserDetail = req.plainToken;
        let allowedFileType = ["PDF", "IMAGE", "SHEET", "WORD"]
        const noticeDetails = new noticeModel.noticeBoard(noticeData);
        const { error } = noticeModel.validateNotice(noticeDetails)
        if (error) {
            if (error.details)
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
            else return res.status(STATUS.BAD_REQUEST).send(error.message);
        }

        noticeDetails.school_id = reqUserDetail.school_id;
        noticeDetails.created_by = reqUserDetail.user_id;
        noticeDetails.updated_by = reqUserDetail.user_id;


        const isNoticeExist = await noticeService.isNoticeExist(noticeDetails)
        if (isNoticeExist > 0) {
            res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"NOTICESERVC001", "error":"${ERRORCODE.NOTICEBOARD.NOTICESERVC001}"}`);

        } else {

            const noticeResult = await noticeService.addNotice(noticeDetails);
            const notice_id = noticeResult[0].notice_id;

            const docFile = req.files && req.files.notice_document ? req.files.notice_document : null
            if (docFile) {
                noticeDetails.document_path = await commonService.getFileUploadPath(docFile, "notice-document", allowedFileType);
                const fileNameWithExt = req.files.notice_document.name;
                const fileName = fileNameWithExt.split('.')[0];

                if (noticeDetails && noticeDetails.document_path) {
                    const noticeDoc = await noticeService.addNoticeDoc(noticeDetails, notice_id, fileName)
                }
            }
            const noticeAccess = await noticeService.roleAccess(noticeDetails, notice_id)
            return res.status(STATUS.OK).json({
                notice_id: notice_id,
                message: "Notice added successfully."
            });
        }
    } catch (error) {
        logger.error("catch error", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"NOTICESERVC000", "error":"${ERRORCODE.NOTICEBOARD.NOTICESERVC000}"}`);
    }
});

//GET NOTICE DETAILS
router.get("/getNoticeAccess", async (req, res) => {
    try {
        const reqUserDetail = req.plainToken;
        const roleID = reqUserDetail.role;
        const schoolID = reqUserDetail.school_id;
        const getNotice = await noticeService.getNoticeAccDetails(roleID, schoolID);
        res.status(STATUS.OK).send(getNotice);
    } catch (error) {
        logger.error(error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"NOTICESERVC000", "error":"${ERRORCODE.NOTICEBOARD.NOTICESERVC000}"}`);
    }
})


//GET BY ID
router.get("/getNotice/:noticeId", async (req, res) => {
    try {
        const notice_id = parseInt(req.params.noticeId);
        const checkNoticeID = await noticeService.checkNoticeId(notice_id);
        if (checkNoticeID == 0) {
            res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"NOTICESERVC002", "error":"${ERRORCODE.NOTICEBOARD.NOTICESERVC002}"}`);
        } else {
            const [getNotice] = await noticeService.getNoticeById(notice_id);
            const [noticeDoc] = await noticeService.getNoticeDoc(getNotice.notice_id);
            const NoticeDocURL = await minioUtil.presignedGetObject(process.env.EDU_S3_BUCKET, noticeDoc.document_path, 300);
            getNotice.docUrl = NoticeDocURL
            res.status(STATUS.OK).send(getNotice);
        }
    } catch (error) {
        logger.error(error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"NOTICESERVC000", "error":"${ERRORCODE.NOTICEBOARD.NOTICESERVC000}"}`);
    }
})

//GET ALL

router.post("/getAll", async (req, res) => {
    try {
        const reqUserDetail = req.plainToken;
        const school_id = reqUserDetail.school_id;
        const pageSize = req.body.page_size ? req.body.page_size : 20;
        const search = req.body.search ? req.body.search : null;
        let currentPage = req.body.current_page ? req.body.current_page : 0;
        currentPage = (currentPage == 1 || currentPage == 0) ? 0 : ((currentPage - 1) * pageSize);

        const reqParams = {
            pageSize,
            currentPage,
            school_id,
            search
        }

        const noticeList = await noticeService.getAllNotice(reqParams);
        res.status(STATUS.OK).send(noticeList);
    } catch (error) {
        logger.error(error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"NOTICESERVC000", "error":"${ERRORCODE.NOTICEBOARD.NOTICESERVC000}"}`);
    }
})

//UPDATE

router.post("/update", async (req, res) => {
    try {
        const noticeUpdateData = JSON.parse(`${req.body.update_data}`)
        const reqUserDetail = req.plainToken;
        const noticeDetails = new noticeModel.updateNotice(noticeUpdateData);
        const notice_id = noticeDetails.notice_id;
        let allowedFileType = ["PDF", "IMAGE", "SHEET", "WORD"]
        const { error } = noticeModel.validateUpdateNotice(noticeDetails)

        if (error) {
            if (error.details)
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
            else return res.status(STATUS.BAD_REQUEST).send(error.message);
        }

        const checkUpdateNoticeId = await noticeService.checkNoticeIdExist(noticeDetails);
        if (checkUpdateNoticeId == 0) {
            res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"NOTICESERVC002", "error":"${ERRORCODE.NOTICEBOARD.NOTICESERVC002}"}`);
        }

        const isUpdateNoticeExistWithId = await noticeService.isUpdateNoticeExistWithId(noticeDetails);
        const isUpdateNoticeExist = await noticeService.isUpdateNoticeExist(noticeDetails);
        if (isUpdateNoticeExistWithId == 0 && isUpdateNoticeExist == 1) {
            res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"NOTICESERVC001", "error":"${ERRORCODE.NOTICEBOARD.NOTICESERVC001}"}`);
        } else {
            await noticeService.updateNotice(noticeDetails);
            const docFile = req.files && req.files.update_document ? req.files.update_document : null
            if (docFile) {
                const UpdateDocument = await commonService.getFileUploadPath(docFile, "notice-document", allowedFileType);
                const checkNoticeDoc = await noticeService.checkNoticeDoc(notice_id)
                const fileNameWithExt = req.files.update_document.name;
                const fileName = fileNameWithExt.split('.')[0];
                if (checkNoticeDoc > 0) {
                    await noticeService.updatedNoticeDocument(notice_id, UpdateDocument, fileName)
                } else {
                    await noticeService.addNoticeDocUpdate(notice_id, UpdateDocument, fileName)
                }
            }
            return res.status(STATUS.OK).send({
                message: "Notice updated successfully."
            });
        }

    } catch (error) {
        logger.error(error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"NOTICESERVC000", "error":"${ERRORCODE.NOTICEBOARD.NOTICESERVC000}"}`);
    }
});


//DOWNLOAD NOTICE

router.get("/downloadNotice/:noticeId", async (req, res) => {
    try {
        const notice_id = req.params.noticeId ? req.params.noticeId : null;
        const [noticeDocData] = await noticeService.NoticeDocDetails(notice_id);
        if (!noticeDocData) {
            res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"NOTICESERVC002", "error":"${ERRORCODE.NOTICEBOARD.NOTICESERVC002}"}`);
        }
        const presignedURL = await minioUtil.presignedGetObject(process.env.EDU_S3_BUCKET, noticeDocData.document_path, 300);
        return res.status(STATUS.OK).send(presignedURL);

    } catch (error) {
        logger.error(error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"NOTICESERVC000", "error":"${ERRORCODE.NOTICEBOARD.NOTICESERVC000}"}`);
    }
})

module.exports = router;