const express = require("express");
const router = express.Router();
const { STATUS, logger, CONST, passwordPolicy, redis, SMS } = require("edu-micro-common");
const bcrypt = require("bcryptjs");
let ERRORCODE = require('../constants/ERRRORCODE');
let userService = require('../services/userService');
let moment = require('moment');
let userModel = require('../models/users')
let async = require('async');
const { v4: uuidv4 } = require('uuid');
const { user } = require("../config/config");
const { OK } = require("edu-micro-common/constants/STATUS");

router.get('/health', async (req, res) => {
    try {
        return res.status(STATUS.OK).send("User Service is Healthy");
    } catch (error) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send();
    }
});

router.post("/updateUser", async (req, res) => {
    var userId = CONST.decryptPayload(req.body.userId);
    // var userId = req.body.userId;
    let reqUser = req.plainToken;
    let reuserId = reqUser.user_id;
    let userBody = req.body;
    userBody.update_by = reuserId;

    var user = new userModel.UpdateUser(userBody);
    let key = `LOGGED_IN_USER_DETAILS_${reqUser.user_name}`;
    if (!userId || !user) {
        return res
            .status(STATUS.BAD_REQUEST)
            .send(
                `{"errorCode":"USRPRF0014", "error":"${ERRORCODE.ERROR.USRPRF0014}"}`
            );
    }

    const {
        error
    } = userModel.validateUpdateUsers(user);
    if (error) {
        if (
            error.details != null &&
            error.details != "" &&
            error.details != "undefined"
        ) {
            return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
        } else return res.status(STATUS.BAD_REQUEST).send(error.message);
    } else {
        user.updated_by = reuserId;
        userService.updateUser(user, userId, async (err, results) => {
            if (err) {
                return res.status(STATUS.INTERNAL_SERVER_ERROR).send(err);
            }

            return res.status(STATUS.OK).send({
                error: false,
                data: results,
                message: "User has been updated successfully."
            });
        });
        redis.deleteKey(key);
    }
});


router.post("/verifyMobileNumber", async (req, res) => {

    let phoneNo = CONST.decryptPayload(req.body.mobile_number);
    if (phoneNo != null && phoneNo.length != 10) {
        return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRMOB0000", "error":"${ERRORCODE.ERROR.USRMOB0000}"}`);
    }

    userService.verifyMobile(phoneNo, async (err, result) => {
        const new_txn_id = uuidv4();
        if (err) res.status(STATUS.INTERNAL_SERVER_ERROR).send(err);
        if (result > 0) {
            let otp = Math.floor(100000 + Math.random() * 900000);
            let otpData = {
                mobile_no: phoneNo,
                otp: otp,
                txnId: new_txn_id,
                reason: CONST.OTPREASONS.FORGOTPASSWORD,
                is_active: 1,
                date_created: new Date(),
                date_modified: new Date()
            };

            let forgotPasswordOtpKey = `FORGOT_PASSWORD_OTP_${phoneNo}`;
            let forgotPasswordTxnIdKey = `FORGOT_PASSWORD_OTP_${new_txn_id}`;
            let redisResult = await redis.GetKeyRedis(forgotPasswordOtpKey);
            if (redisResult && redisResult.length > 0 && redisResult[0]) {
                logger.debug('Otp Already sent for the mobile number::', redisResult);
                otpData = JSON.parse(redisResult);
                return res.status(STATUS.BAD_REQUEST).send({
                    message: "OPT Already Sent!!",
                    txnId: otpData.txnId,
                    otp: otpData.otp


                });
            } else {
                redis.SetRedis(forgotPasswordOtpKey, otpData, 180);
                redis.SetRedis(forgotPasswordTxnIdKey, otpData, 180);
                // await userService.shareNewUserDetails(otpData);
                res.status(STATUS.OK).send({
                    txnId: otpData.txnId,
                    otp: otpData.otp
                });
            }
        } else {
            res.status(STATUS.OK).send({
                txnId: new_txn_id,


            });
        }
    });

});


router.post("/verifyForgotPasswordOtp", async (req, res) => {
    let txnId = req.body.txnId;
    let otp = CONST.decryptPayload(req.body.otp);

    if (!txnId) {
        return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRPRF00027", "error":"${ERRORCODE.ERROR.USRPRF00027}"}`);
    }
    if (otp != null && otp.toString().length != 6) {
        return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRPRF0003", "error":"${ERRORCODE.ERROR.USRPRF0003}"}`);
    } else {
        let forgotPasswordTxnIdKey = `FORGOT_PASSWORD_OTP_${txnId}`;
        let redisResult = await redis.GetKeyRedis(forgotPasswordTxnIdKey);
        if (redisResult && redisResult.length > 0 && redisResult[0]) {
            let otpData = JSON.parse(redisResult);
            if (otpData.otp == otp) {
                let new_txnId = uuidv4();
                let forgotPasswordOtpKey = `FORGOT_PASSWORD_OTP_${otpData.mobile_no}`;
                let forgotPasswordChangeKey = `FORGOT_PASSWORD_CHANGE_${new_txnId}`;
                redis.deleteKey(forgotPasswordTxnIdKey);
                redis.deleteKey(forgotPasswordOtpKey);
                redis.SetRedis(forgotPasswordChangeKey, otpData, 180);
                return res.status(STATUS.OK).send({ message: 'OTP Verified Successfully', txnId: new_txnId });
            } else {
                return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRPRF0005", "error":"${ERRORCODE.ERROR.USRPRF0005}"}`);
            }
        } else {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRPRF0005", "error":"${ERRORCODE.ERROR.USRPRF0005}"}`);
        }
    }
});


router.post("/resetPassword", async (req, res) => {
    let txnId = req.body.txnId;
    let confirm_password = CONST.decryptPayload(req.body.confirm_password);
    let newPassword = CONST.decryptPayload(req.body.new_password);
    if (!txnId) {
        return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRPRF00027", "error":"${ERRORCODE.ERROR.USRPRF00027}"}`);
    }

    if (!newPassword) {
        return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRPRF00019", "error":"${ERRORCODE.ERROR.USRPRF00019}"}`);
    }
    if (!confirm_password) {
        return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRPRF00028", "error":"${ERRORCODE.ERROR.USRPRF00028}"}`);
    }

    if (confirm_password != newPassword) {
        return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRPRF00029", "error":"${ERRORCODE.ERROR.USRPRF00029}"}`);
    }

    let forgotPasswordChangeKey = `FORGOT_PASSWORD_CHANGE_${txnId}`;

    let redisResult = await redis.GetKeyRedis(forgotPasswordChangeKey);
    if (redisResult && redisResult.length > 0 && redisResult[0]) {
        redis.deleteKey(forgotPasswordChangeKey);
        let otpData = JSON.parse(redisResult);
        userService.getProfileDtlsbyMob(otpData.mobile_no, (err, result) => {
            if (err) res.status(STATUS.BAD_REQUEST).send(err);
            let type = 2;
            let lastPassword = result[0].current_password;
            if (result && result[0]) {
                passwordPolicy.validate_password(result[0].user_id, newPassword, type).then(function (policy) {
                    if (policy.status) {
                        bcrypt.compare(newPassword, lastPassword, async (err, res1) => {
                            if (res1) {
                                res
                                    .status(STATUS.BAD_REQUEST)
                                    .send(
                                        `{"errorCode":"USRPRF0004", "error":"${ERRORCODE.ERROR.USRPRF0004}"}`
                                    );
                            } else {
                                const salt = await bcrypt.genSalt(10);
                                newPassword = await bcrypt.hash(newPassword, salt);
                                userService.updatePassword(newPassword, result[0].user_id, result[0].user_name, async (err, results) => {
                                    if (err) {
                                        res.status(STATUS.INTERNAL_SERVER_ERROR).send(err);
                                    } else {
                                        if (type == 2) {
                                            const userDetails = await userService.getUserDtlsPromise(result[0].user_id);
                                            let userData = {};
                                            userData = Object.assign(userData, userDetails);
                                            userData['user_name'] = userDetails['username'];
                                            userData['state_id'] = userDetails['state'];
                                            userData['district_id'] = userDetails['district'];
                                            userData['password'] = lastPassword;
                                            userData['account_locked'] = 0;
                                            userData['date_created'] = moment(userDetails['date_created']).toISOString();
                                            userData['password_last_updated'] = moment(userDetails['password_last_updated']).toISOString();
                                            delete userData['username'];
                                            delete userData['user_id'];
                                            delete userData['state'];
                                            delete userData['district'];
                                            delete userData['current_password'];
                                            delete userData['invalid_attempts'];

                                            userService.setPasswordHistory(userData, function (e, r) { });
                                        }
                                    }
                                    delete_current_user_keys(otpData.mobile_no);
                                    res.status(STATUS.OK).send({
                                        error: false,
                                        data: results,
                                        message: "Password has been changed successfully."
                                    });
                                });
                            }
                        });
                    } else {
                        return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRPRF0022", "error":${policy.message}}`);
                    }
                }).catch(err => {
                    return res.status(STATUS.BAD_REQUEST).send(err);
                });
            } else {
                return res.status(STATUS.BAD_REQUEST).send(`{ "errorCode": "USRPRF0001", "error": "${ERRORCODE.ERROR.USRPRF0001}" }`);
            }
        });
    } else {
        return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRPRF00030", "error":"${ERRORCODE.ERROR.USRPRF00030}"}`);
    }
});

router.get("/getLoggedInUserInfo", async (req, res) => {
    const userData = req.plainToken;
    let getAcademicYearData = [];
    let key = `LOGGED_IN_USER_DETAILS_${userData.user_name}`;
    let redisResult = await redis.GetKeyRedis(key);
    if (redisResult && redisResult.length > 0 && redisResult[0]) {

        res.status(STATUS.OK).send({
            loggedInUser: JSON.parse(redisResult)
        });
    } else {
        userService.selectUser(userData.user_name, async (err, userres) => {
            if (err) {
                return res.status(STATUS.INTERNAL_SERVER_ERROR).send('SOMETHING WENT WRONG IN SELECT USER');
            } else {
                if (!userres[0]) {
                    return res.status(STATUS.BAD_REQUEST).send("Invalid User")
                } else {
                    var userDetails = {};
                    let userDetailsDB = userres[0];
                    console.log("=================================");
                    console.log(userDetailsDB);
                    console.log("=================================");

                    if (userDetailsDB.profile_picture_url) {
                        let profile_pic_cdn = userDetailsDB.profile_picture_url;
                        userDetailsDB.profile_pic_cdn = `${process.env.CDN_CONTEXT_PATH}/api/v1/admin/cdn/fileDisplay?file_name=${profile_pic_cdn}`;
                    }

                    let gender = CONST.GENDER[userDetailsDB.gender];
                    userDetailsDB.logo_url = await userService.getLogoUrl(userData);
                    if (userDetailsDB.logo_url) {
                        userDetailsDB.logo_url_cdn = `${process.env.CDN_CONTEXT_PATH}/api/v1/admin/cdn/fileDisplay?file_name=${userDetailsDB.logo_url}`;
                    }
                    if (userData.school_id) {
                        getAcademicYearData = await userService.getActiveAcademicYears(userData.school_id);
                    }
                    userDetails = {
                        ...userDetailsDB,
                        user_level: userData.user_level,
                        gender_name: gender,
                        user_id: userDetailsDB.user_id,
                        role_id: userDetailsDB.role,
                        academic_year_data: getAcademicYearData
                    };
                    let loggedInUserKey = `LOGGED_IN_USER_DETAILS_${userData.user_name}`;
                    redis.SetRedis(loggedInUserKey, userDetails, 28800);
                    res.status(STATUS.OK).send({
                        loggedInUser: userDetails
                    });
                }
            }
        });
    }
});

router.post("/updatePassword", async (req, res) => {

    var userId = CONST.decryptPayload(req.body.userId);
    // var userId = req.body.userId;
    req.body.currentPassword = CONST.decryptPayload(req.body.currentPassword);
    req.body.newPassword = CONST.decryptPayload(req.body.newPassword);

    if (!userId) {
        return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRPRF0001", "error":"${ERRORCODE.ERROR.USRPRF0001}"}`);
    }
    if (!req.body.newPassword) {
        return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRPRF0006", "error":"${ERRORCODE.ERROR.USRPRF0006}"}`);
    }
    userService.getProfileDtls(userId, (err, result) => {
        if (result && result.length > 0) {
            let currentPwd = result[0].current_password;
            if (err) res.status(STATUS.INTERNAL_SERVER_ERROR).send(err);
            bcrypt.compare(req.body.currentPassword, result[0].current_password, async (err, res2) => {
                if (!res2) {
                    res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRPRF0007", "error":"${ERRORCODE.ERROR.USRPRF00020}"}`);
                } else {

                    bcrypt.compare(req.body.newPassword, result[0].current_password, async (err, res1) => {
                        if (res1) {
                            res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRPRF0008", "error":"${ERRORCODE.ERROR.USRPRF00021}"}`);
                        } else {
                            var passwrd = req.body.newPassword;
                            const salt = await bcrypt.genSalt(10);
                            req.body.newPassword = await bcrypt.hash(req.body.newPassword, salt);
                            let type = 2;
                            passwordPolicy.validate_password(userId, passwrd, type).then(function (policy) {
                                if (policy.status) {
                                    userService.updatePassword(req.body.newPassword, userId, result[0].user_name, (err, results) => {
                                        if (err) res.status(STATUS.INTERNAL_SERVER_ERROR).send(err);
                                        else {
                                            userService.getUserDtlsPro(userId, function (err, userDetails) {
                                                let userData = {};

                                                userData['user_name'] = userDetails['user_name'];
                                                userData['state_id'] = userDetails['state'];
                                                userData['district_id'] = userDetails['district'];
                                                userData['password'] = currentPwd;
                                                userData['user_id_parent'] = userDetails['user_id'];
                                                userData['display_name'] = userDetails['display_name'];
                                                userData['mobile_number'] = userDetails['mobile_number'];
                                                userData['date_of_birth'] = userDetails['date_of_birth'];
                                                userData['role_id'] = userDetails['role_id'];
                                                userData['is_active'] = userDetails['is_active'];
                                                userData['date_created'] = userDetails['date_created'];
                                                userData['account_locked'] = 0;
                                                userService.setPasswordHistory(userData, function (e, r) { })
                                            })
                                        }


                                        delete_current_user_keys(result[0].user_name);

                                        res.status(STATUS.OK).send({
                                            error: false,
                                            data: results,
                                            message: "Password has been changed successfully."
                                        });
                                    });
                                } else {
                                    return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRPRF0022", "error":${policy.message}}`);
                                }
                            })
                        }
                    });
                }
            });
        } else {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRPRF0006", "error":"${ERRORCODE.ERROR.USRPRF0006}"}`);
        }
    });
});


function delete_current_user_keys(username) {
    redis.deleteKey(username);
    redis.deleteKey(`User|Username:${username}`);
}

//update user status 
router.post("/updateUserStatus", async (req, res) => {
    try {
        const userTokenData = req.plainToken;
        const updateUserStatus = {
            user_id: req.body.user_id,
            created_by: userTokenData.created_by,
            updated_by: userTokenData.updated_by
        };

        if (updateUserStatus.user_id === 0) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRPRF00031", "error":"${ERRORCODE.ERROR.USRPRF00031}"}`);
        }

        const userStatus = await userService.getUserDetails(updateUserStatus.user_id);
        if (userStatus.length === 0) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRPRF00032", "error":"${ERRORCODE.ERROR.USRPRF00032}"}`);
        }

        const isActive = userStatus[0].is_active;
        const currentStatus = isActive == 1 ? 0 : 1;
        
        const updatedStatus = await userService.updateUserStatus(updateUserStatus, currentStatus);

        let message = "";
        if (currentStatus === 1) {
            message = "User is activated";
        } else {
            message = "User is deactivated";
        }
        return res.status(STATUS.OK).json({ message });

    } catch (error) {
        console.error(error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
});


router.post("/sendOTPUpdateMobileNumber", async (req, res) => {
    var phoneNo = req.body.newMobileNumber;
    var oldphoneNo = req.body.oldMobileNumber;
    const userData = req.plainToken;

    if (userData.user_name == phoneNo) {
        return res.status(STATUS.BAD_REQUEST).send(`{ "errorCode": "USRPRF00017", "error": "${ERRORCODE.ERROR.USRPRF00017}" }`);
    }

    userService.checkIfExist(phoneNo, async (err, userres) => {
        if (userres > 0) {
            return res.status(STATUS.BAD_REQUEST).send(`{ "errorCode": "USRPRF00016", "error": "${ERRORCODE.ERROR.USRPRF00016}" }`);
        } else {
            let otp = Math.floor(100000 + Math.random() * 900000);
            var otpData = {
                mobile_no: oldphoneNo,
                otp: otp,
                reason: CONST.OTPREASONS.UPDATEMOBNO,
                is_active: 1,
                school_id : userData.school_id,
                trust_id : userData.trust_id,
                date_created: new Date(),
                date_modified: new Date()
            };
            let changeMobileOtpKey = `MOBILE_CHANGE_OTP_${userData.user_name}`;
            let redisResult = await redis.GetKeyRedis(changeMobileOtpKey);
            if (redisResult && redisResult.length > 0 && redisResult[0]) {
                logger.debug('Otp Already sent for the mobile number::', redisResult);
                return res.status(STATUS.BAD_REQUEST).send({
                    message: "OPT Already Sent!!"
                });
            } else {
                redis.SetRedis(changeMobileOtpKey, otpData, 180);
                await userService.shareOTPDetails(otpData);
                return res.status(STATUS.OK).send({
                    message: "OTP (One Time Password) has been sent to your mobile number " + req.body.oldMobileNumber
                });
            }
        }
    });
});

router.post("/updateMobileNumber", async (req, res) => {
    const userData = req.plainToken;
    let username = userData.user_name;
    let otp = CONST.decryptPayload(req.body.otp);

    if (!username) {
        return res.status(STATUS.BAD_REQUEST).send(`{ "errorCode": "USRPRF0006", "error": "${ERRORCODE.ERROR.USRPRF0006}" }`);
    }

    if (!req.body.newMobileNumber) {
        return res.status(STATUS.BAD_REQUEST).send(`{ "errorCode": "USRPRF0010", "error": "${ERRORCODE.ERROR.USRPRF0010}" }`);
    }

    if (!req.body.oldMobileNumber) {
        return res.status(STATUS.BAD_REQUEST).send(`{ "errorCode": "USRPRF00025", "error": "${ERRORCODE.ERROR.USRPRF00025}" }`);
    }

    if (!otp) {
        return res.status(STATUS.BAD_REQUEST).send(`{ "errorCode": "USRPRF0007", "error": "${ERRORCODE.ERROR.USRPRF0007}" }`);
    }
    let changeMobileOtpKey = `MOBILE_CHANGE_OTP_${userData.user_name}`;
    let redisResult = await redis.GetKeyRedis(changeMobileOtpKey);
    if (redisResult && redisResult.length > 0 && redisResult[0]) {
        let otpData = JSON.parse(redisResult);
        if (otpData.otp != otp) {
            return res.status(STATUS.BAD_REQUEST).send(`{ "errorCode": "USRPRF0008", "error": "${ERRORCODE.ERROR.USRPRF0008}" }`);
        } else {
            redis.deleteKey(changeMobileOtpKey);
            userService.selectUserToUpdateMobileNumber(username, (err, result) => {
                if (err) res.status(STATUS.INTERNAL_SERVER_ERROR).send(err);

                if (result[0]) {
                    result[0].mobileNumber = req.body.newMobileNumber;
                    result[0].username = req.body.newMobileNumber;
                    userService.updateMobileNumber(result[0], username, (err, results) => {
                        if (err) res.status(STATUS.INTERNAL_SERVER_ERROR).send(err);
                        else {
                            delete_current_user_keys(username);
                            res.status(STATUS.OK).send({
                                message: "Mobile Number has been updated successfully. Kindly login with new Mobile Number with the existing password"
                            });
                        }
                    });
                } else {
                    return res.status(STATUS.BAD_REQUEST).send(`{ "errorCode": "USRPRF0009", "error": "${ERRORCODE.ERROR.USRPRF0009}" }`);
                }
            });
        }
    } else {
        return res.status(STATUS.BAD_REQUEST).send(`{ "errorCode": "USRPRF0008", "error": "${ERRORCODE.ERROR.USRPRF0008}" }`);
    }
});

module.exports = router;