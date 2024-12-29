const express = require("express");
const router = express.Router();
const ERRORCODE = require('../constants/ERRORCODE');

const {
    STATUS,
    logger,
    CONST,
    s3Util,
    minioUtil,
    JSONUTIL,
    redis,
    communicationUtil
} = require("edu-micro-common");
const AWS = require("aws-sdk");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const userService = require('../services/userService');
const users = require('../models/users');
let _ = require('underscore');
let bcrypt = require('bcryptjs');
const moment = require('moment');
let SMS = require('../utility/SMS');
const dateformat = require("dateformat");
const RandExp = require('randexp');
let async = require('async');
const fileType = require('file-type');
const PAGESIZE = require('../constants/CONST');
const userListService = require('../services/userListService');

// Set region
AWS.config.update({
    region: process.env.REGION_NAME
});

let s3 = new AWS.S3({});

router.use(fileUpload());

router.use(
    bodyParser.json({
        limit: "5mb"
    })
);

router.use(
    bodyParser.urlencoded({
        extended: true,
        limit: "5mb"
    })
);


//INSERT USERS
router.post("/createUser", async (req, res) => {

    try {

        let reqUser = req.plainToken;
        let userId = reqUser.user_id;
        let newUser = new users(req.body);
        newUser.trust_id = reqUser.trust_id ? reqUser.trust_id : newUser.trust_id;
        newUser.school_id = reqUser.school_id ? reqUser.school_id : newUser.school_id;
        const { error } = users.validate(newUser);

        if (error) {
            if (
                error.details != null &&
                error.details != "" &&
                error.details != "undefined"
            )
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
            else return res.status(STATUS.BAD_REQUEST).send(error.message);
        }

        if (!newUser.mobile_number.toString().match(/^[0-9]{10}$/)) {
            return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.ERROR.ADMROL0014);
        }

        newUser.role_id = parseInt(newUser.role_id);
        newUser.display_name = JSONUTIL.capitalize(newUser.display_name.trim());

        let str = '';
        const alpha = /[A-Z][a-z]/;
        const numeric = /[0-9]/;
        const special = /[!@#$&*]/;
        const pwdComplexityData = await userService.getPasswordComplexity();
        const pwdComplexity = pwdComplexityData[0]
        const length = pwdComplexity.min_password_length;

        str += (pwdComplexity.complexity && pwdComplexity.alphabetical) ? alpha.source : '';
        str += numeric.source;

        if (pwdComplexity.complexity && pwdComplexity.numeric) {
            str += numeric.source;
        }

        if (pwdComplexity.complexity && pwdComplexity.special_chars) {
            str += special.source;
        }

        let pattern = "";

        if (str) {
            str += `{${length}}`;
            pattern = str;
        } else {
            pattern = '[1-9]{' + length + '}';
        }

        const testRegex = new RegExp(pattern);
        const randExp = new RandExp(testRegex).gen(); // CONST.SERVICES.default_pass
        const validateRole = await userService.checkIfRoleIsValid(newUser.role_id);

        if (validateRole <= 0) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ADMROL0012", "error":"${ERRORCODE.ERROR.ADMROL0012}"}`);
        }

        const userCount = await userService.checkIfExist(newUser.mobile_number);

        if (userCount > 0) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ADMROL0005", "error":"${ERRORCODE.ERROR.ADMROL0005}"}`);
        }

        newUser.password = randExp;
        logger.debug(`PASSWORD FOR  ${newUser.display_name}  :  ${newUser.password}`);

        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(newUser.password, salt);
        newUser.rand_password = randExp;
        newUser.user_name = newUser.mobile_number;
        newUser.account_locked = 0;
        newUser.country_id = 1;
        newUser.created_by = userId;

        try {

            const userData = await userService.createUsers(newUser);
            newUser.user_id = userData[0].user_id;
            await userService.createUserMapping(newUser);
            await userService.shareNewUserDetails(newUser);


            if (newUser.user_module_json && newUser.user_module_json.length > 0) {
                async.forEachOfSeries(newUser.user_module_json, async function (per, cb2) {
                    let access = {
                        "user_id": newUser.user_id,
                        "menu_id": per.menu_id,
                        "per_id": per.per_id,
                        "created_by": newUser.created_by
                    }
                    await userService.addPermissions(access);

                }, async function () {
                });
            }
            res.status(STATUS.CREATED).json(userData);

        } catch (err) {
            console.log(err);
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(err);
        }

    } catch (e) {
        console.log(e);
        return res.status(STATUS.BAD_REQUEST).send(e);
    }

});

// To Edit the user data
router.post("/editUser", async (req, res) => {
    let userData = new users.EditUser(req.body);
    let reqUser = req.plainToken;
    let reuserId = reqUser.user_id;
    userData.user_id = parseInt(CONST.decryptPayload(userData.user_id));
    const { error } = users.validateEditUsers(userData);

    if (error) {
        if (
            error.details != null &&
            error.details != "" &&
            error.details != "undefined"
        )
            return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
        else return res.status(STATUS.BAD_REQUEST).send(error.message);
    } else {
        let userId = userData.user_id;
        userData.updated_by = reuserId;
        userService.updateUser(userData, userId, async (err, results) => {
            if (err) {
                res.status(STATUS.INTERNAL_SERVER_ERROR).send(err);
                return;
            }
            if (req.body.user_module_access) {
                await userService.deletePermissions(userData);
                if (req.body.user_module_json) {
                    async.forEachOfSeries(req.body.user_module_json, async function (per, cb2) {
                        let access = {
                            "user_id": userData.user_id,
                            "menu_id": per.menu_id,
                            "per_id": per.per_id,
                            "created_by": reuserId
                        }
                        await userService.addPermissions(access);

                    }, async function () {
                    });
                }
            }
            res.status(STATUS.OK).send({
                error: false,
                data: results,
                message: "User has been updated successfully."
            });
        });
    }

});




// @route    GET api/v2/admin/users/password_policy
// @desc     Get latest password policy
// @access   Private / Admin role only  
router.get('/password_policy', async (req, res) => {
    try {
        let complexity = await userService.getPasswordComplexity();

        res.status(STATUS.OK).send({
            error: false,
            data: complexity

        });
    } catch (e) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(err);
    }
});

// @route    POST api/v2/admin/users/password_policy
// @desc     Creates a new password policy
// @access   Private / Admin role only
router.post('/password_policy', async (req, res) => {
    try {
        var policy = new users.createPasswordPolicySchema(req.body);
        let data = await userService.createPasswordComplexity(policy);
        res.status(STATUS.OK).send({
            error: false,
            data: data.insertId,
            message: "Password complexity set successfully."
        });
    } catch (e) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(e);
    }
});

// @route    POST api/v2/admin/users/validate_password/:id/:password
// @desc     Validates user password based on password policy
// @access   Private / Admin role only



// @route    PUT api/v2/admin/users/password_policy/:id
// @desc     Update Password Policy based on ID
// @access   Private / Admin role only




router.post("/resetPasswordByAdmin", async (req, res) => {
    const userId = req.body.user_id;
    const defaultPassword = CONST.SERVICES.default_pass;
    let password = '';

    try {
        const userMobileObj = await userService.getUserMobile(userId);
        if (userMobileObj > 0) {
            password = defaultPassword;
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);

            await userService.updateUserPasswordbyAdmin(password, userId);

            res.status(STATUS.OK).send({ message: "Password reset successfully" });
        } else {
            res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRRES0002", "error":"${ERRORCODE.ERROR.USRRES0002}"}`);
        }
    } catch (err) {
        console.log(err)
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(err);
    }
});

router.post("/uploadProfilePic", async (req, res) => {
    let reqUser = req.plainToken;
    let userId = reqUser.user_id;
    let newfileName = dateformat(new Date(), "ddmmyyyyHHMMss");
    let key = `LOGGED_IN_USER_DETAILS_${req.plainToken.user_name}`;
    if (!req.files || Object.keys(req.files).length === 0) {
        return res
            .status(STATUS.BAD_REQUEST)
            .send(
                `{"errorCode":"ADMROL0007", "error":"${ERRORCODE.ERROR.ADMROL0007}"}`
            );
    }
    let file_name = req.files.file.name;
    let file_size = req.files.file.size;

    if (file_name && file_name.split(".").length > 2) {
        return res
            .status(STATUS.BAD_REQUEST)
            .send(
                `{"errorCode":"ADMROL0010", "error":"${ERRORCODE.ERROR.ADMROL0010}"}`
            );
    }
    let fileExt = file_name.split(".");
    let ext = fileExt[fileExt.length - 1];
    let allowedExt = ["png", "jpeg", "jpg"]
    file_name = newfileName + "-" + userId + "." + ext;
    var fileData = {
        file_name: file_name,
        orig_file_name: file_name,
        content_type: req.files.file.mimetype
    };

    allowedFiles = ["image/png", "image/jpeg", "image/jpg"];

    if (!allowedFiles.includes(fileData.content_type) || !allowedExt.includes(ext.toLowerCase())) {
        return res
            .status(STATUS.BAD_REQUEST)
            .send(
                `{"errorCode":"ADMROL0008", "error":"${ERRORCODE.ERROR.ADMROL0008}"}`
            );
    }

    if (file_size >= 2000000) {
        res.status(STATUS.BAD_REQUEST).send({ "errorCode": "ADMROL0015", "error": ERRORCODE.ERROR.ADMROL0015 })
    }

    const params = {
        Bucket: process.env.EDU_S3_BUCKET,
        FileName: `profile-pictures/${fileData.file_name}`,
        Body: req.files.file.data
    };


    await minioUtil.putObject(params.Bucket, params.FileName, params.Body);
    await userService.updateProfilePic(params.FileName, userId, function (err, result) {
        if (err) {
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(err);
        } else {
            redis.deleteKey(key);
            res.status(STATUS.OK).send({ message: "Image uploaded successfully" });
        }
    });
});

router.get("/download/profilePic", async (req, res) => {
    let reqUser = req.plainToken;
    let userId = reqUser.user_id;
    await userService.getProfilePic(userId, async function (err, file_name) {
        if (err) {
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(err);
        } else {
            if (file_name) {
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
                    fileName: `download.${fileInfo.ext}`
                }
                redis.SetRedis(file_name, dataObj, CONST.CACHE_TTL.LONG).then().catch(err => console.log(err));
                // Send the base64-encoded string as the response

                res.header('Content-type', `${dataObj.contentType}`);
                res.header('Content-Disposition', `attachment;filename=${dataObj.fileName}`);
                return res.status(STATUS.OK).send(buffer);
            } else {
                res.status(STATUS.OK).send("No Profile Picture Found ")
            }
        }
    });
});


// total count user data for grid
router.post("/grid", async (req, res) => {
    const token = req.plainToken;
    const view_access = req.eduPayload.view_access;
    let page_size = req.body.page_size ? req.body.page_size : PAGESIZE.pagesize.PAGE_SIZE;
    let current_page = req.body.current_page ? req.body.current_page : 0;
    let search = req.body.search;
    console.log("token ---------- ", token);
    console.log("requets body ---------- ", req.body);

    if (current_page != 0 && current_page != 1) {
        current_page = ((current_page - 1) * page_size)
    } else {
        current_page = 0
    }

    try {

        let data = await userService.getUserdataGridNew(token, view_access, [page_size, current_page, search], req.body);
        data = await addCDNImages(data);
        let count = await userService.getUserdataGridCount(token, view_access, [search], req.body);
        res.status(STATUS.OK).send({ data: data, count: parseInt(count) });

    } catch (error) {
        console.log("catch error", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send();
    }
});


const addCDNImages = async (result) => {
    return new Promise((resolve, reject) => {
        async.forEachOfSeries(result, async function (user, cb) {
            if (user.profile_picture_url) {
                let profile_pic_cdn = user.profile_picture_url;
                user.profile_pic_cdn = `${process.env.CDN_CONTEXT_PATH}/api/v1/admin/cdn/fileDisplay?file_name=${profile_pic_cdn}`;
            }
        }, async function () {
            resolve(result);
        });
    })
}

router.get("/user/:user_id", async (req, res) => {
    let user_id = req.params.user_id;

    if (user_id) {
        try {
            user_id = parseInt(user_id);
        } catch (error) {
            user_id = null;
        }
    }

    if (user_id) {
        let userData = await userService.getUserById(user_id);
        if (userData.profile_picture_url) {
            let profile_pic_cdn = userData.profile_picture_url;
            userData.profile_pic_cdn = `${process.env.CDN_CONTEXT_PATH}/api/v1/admin/cdn/fileDisplay?file_name=${profile_pic_cdn}`;
        }

        res.status(STATUS.OK).send(userData)
    } else {
        res.status(STATUS.BAD_REQUEST).send({ "errorCode": "ADMROL0011", "error": ERRORCODE.ERROR.ADMROL0011 })
    }
});



router.post('/getUserList', async (req, res) => {
    try {

        const reqUserDetails = req.plainToken;
        let pageSize = req.body.pageSize ? req.body.pageSize : null;
        let currentPage = req.body.currentPage ? req.body.currentPage : 0;
        currentPage = (currentPage == 1 || currentPage == 0) ? 0 : ((currentPage - 1) * pageSize);
        const school_id = reqUserDetails.school_id ? reqUserDetails.school_id : req.body.school_id;
        const search = req.body.search ? req.body.search : null;
        const role_id = req.body.role_id ? req.body.role_id : null;
        const level = req.body.level ? req.body.level.toUpperCase() : null;

        const reqParams = {
            pageSize,
            currentPage,
            search,
            role_id,
            level,
            school_id
        };

        const userData = await userListService.getUserList(reqParams)
        res.send(userData)

    } catch (error) {
        console.log("catch error", error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"COMMON0000", "error":"${ERRORCODE.ERROR.COMMON0000}"}`);
    }
})

router.post("/chkSMSTemplate", async (req, res) => {
    try {
        let smsBody = req.body.sms_body;
        let mobileNumber = req.body.mobile_number;
        let templateId = req.body.template_id;
        if (smsBody && mobileNumber && templateId) {
            await communicationUtil.sendSMS(smsBody, mobileNumber, templateId);
        }else{
            res.status(STATUS.BAD_REQUEST).send("Invalid request") 
        }
      
       res.status(STATUS.OK).send("SMS send successfully") 
    } catch (error) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send(error);
    }
})

router.get("/getUsersByRole/:role_id", async (req, res) => {
    try {
        const reqUserDetails = req.plainToken;
        const roleId = req.params.role_id;

        if (!reqUserDetails.school_id) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRPRF00001", "error":"${ERRORCODE.USER.USRPRF00001}"}`);
        }
        let data = await userListService.getUsersByRole(reqUserDetails.school_id, roleId);
        res.status(STATUS.OK).send(data);
    } catch (err) {
        logger.error(err);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send();
    }
});

module.exports = router;
