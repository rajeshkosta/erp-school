const express = require('express');
const router = express.Router();
const { STATUS, CONST, redis, generateToken, passwordPolicy, logger, SECRET_KEY, SMS } = require("edu-micro-common");
const ERRORCODE = require('../constants/ERRORCODE.js');
const User = require("../services/authService");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
    v4: uuidv4
} = require('uuid');
const authModel = require('../models/authModel');
const confModel = require('../models/confModel');
const defaultPassword = CONST.SERVICES.default_pass;
const { generateTransactionId, generateOTP, sendOTP, storeOTPInRedis } = require("../services/authService");


router.get('/health', async (req, res) => {
    try {
        return res.status(STATUS.OK).send("Auth Service is Healthy");
    } catch (error) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send();
    }
});

router.get('/validateToken', async (req, res) => {
    const token = req.header("authorization");
    try {
        jwt.verify(token, SECRET_KEY.SECRET_KEY);
        res.status(STATUS.OK).send({
            message: "Success"
        });
    } catch (ex) {
        res.status(STATUS.UNAUTHORIZED).send({
            message: "Unauthenticated access!"
        });
    }
});

router.post('/login', async (req, res) => {

    try {

        const {
            error
        } = authModel.validateLoginDetails(req.body);
        logger.error("ERROR", error);

        if (error) {
            if (error.details)
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
            else return res.status(STATUS.BAD_REQUEST).send(error.message);
        }

        const userResponse = await User.selectUser(req.body.user_name);
        if (!userResponse[0]) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRAUT0001", "error":"${ERRORCODE.ERROR.USRAUT0001}"}`);
        }

        const userId = userResponse[0].user_id;

        const userRoleModuleData = await User.getRoleModuleList(userResponse[0].role_id)
        const userData = userResponse[0];
        const type = 1;

        req.body.password = CONST.decryptPayload(req.body.password);
        if (req.body.password == defaultPassword) {
             return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRAUT0007", "error":"${ERRORCODE.ERROR.USRAUT0007}", "userId": "${userId}"}`);
        }

        const validPassword = await bcrypt.compare(req.body.password, userData.password);
        const policy = await passwordPolicy.validate_password(userId, req.body.password, type);

        if (validPassword && policy.status == true) {


//            const classData = await User.getUserClassroomDetails(userData)
    //        userData.classroomDetails = classData
            const token = await generateToken.generate(userData.user_name, userData, userRoleModuleData, req)
            res.status(STATUS.OK).send(token.encoded);
            return;
        }

        const invalidAttemptsData = await User.getInvalidLoginAttempts(req.body.user_name);
        const invalidAttempts = invalidAttemptsData.invalid_attempts;
        const maxInvalidAttemptsData = await User.getMaxInvalidLoginAttempts();
        const maxInvalidAttempts = maxInvalidAttemptsData.max_invalid_attempts;

        if (maxInvalidAttempts > invalidAttempts) {
            await User.incrementInvalidLoginAttempts(req.body.user_name);
        } else {
            await User.setUserInactive(req.body.user_name);
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRAUT0005", "error":"${ERRORCODE.ERROR.USRAUT0005}"}`);
        }

        return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRAUT0001", "error":"${ERRORCODE.ERROR.USRAUT0001}"}`);

    } catch (e) {
        logger.error(e)
        return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRAUT0001", "error":"${ERRORCODE.ERROR.USRAUT0001}"}`);
    }
});

router.post('/postLoginUserUpdate', async (req, res) => {
    try {
        await User.updateUserLoggedInOut(1, req.body.user_name);
        res.status(STATUS.OK).send('User login details successfully updated!');
    } catch (error) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).send('Something went wrong!');
    }
});

router.post('/logout', async (req, res) => {
    try {
        await User.updateUserLoggedInOut(0, req.plainToken.user_name);
        redis.deleteKey(req.plainToken.user_name);
        redis.deleteKey(`USER_PERMISSIONS_${req.plainToken.user_name}`);
        redis.deleteKey(`LOGGED_IN_USER_DETAILS_${req.plainToken.user_name}`);
        redis.deleteKey(`User|Username:${req.plainToken.user_name}`);
        redis.deleteKey(`COMBINED_ACCESS_LIST|USER:${req.plainToken.user_id}`);
        res.status(STATUS.OK).send(`Username | ${req.plainToken.user_name} | Successfully Logged Out!!`);
    } catch (error) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).send('Something went wrong!');
    }
});

router.post('/generateOTP', async (req, res) => {
    const mobileNumber = req.body.mobile;

    if (!mobileNumber || mobileNumber.toString().length != 10) {
        return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRAUT0010", "error":"${ERRORCODE.ERROR.USRAUT0010}"}`);
    }

    try {

        const key = `Reg_Mob_${mobileNumber}`
        const redisResult = await redis.GetKeys(key);

        if (redisResult && redisResult.length > 0) {
            const result = await redis.GetRedis(key);
            const otpRes = JSON.parse(result);
            return res.status(STATUS.OK).send({ txnId: otpRes.txnId, otp: otpRes.otp })
        }

        const new_txn_id = uuidv4();
        const otp = Math.floor(100000 + Math.random() * 900000);

        const otpData = {
            mobile_no: mobileNumber,
            otp: otp,
            reason: CONST.OTPREASONS.VERIFYMOBNO,
            is_active: 1,
            date_created: new Date(),
            date_modified: new Date()
        };

        const userData = mobileNumber;
        userData.otp = otpData.otp;
        userData.txnId = new_txn_id;

        User.setUserInRedisByTxnId(userData);

        User.setUserInRedisForReg(mobileNumber, userData, function (err, result) {
            console.log(err);
            if (err) {
                return res.status(STATUS.BAD_REQUEST).send("OTP Already Sent");
            } else {
                console.log("result", result);
                res.status(STATUS.OK).send({ "txnId": new_txn_id, "otp": otp });
            }
        });

    } catch (error) {
        console.log("error", error);
        return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRAUT0018", "error":"${ERRORCODE.ERROR.USRAUT0018}"}`);
    }
});

router.post('/validateOTP', async (req, res) => {
    const otp = req.body.otp;
    const txnId = req.body.txnId;

    if (!otp) {
        return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRAUT0012", "error":"${ERRORCODE.ERROR.USRAUT0012}"}`);
    }

    if (!txnId) {
        return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRAUT0013", "error":"${ERRORCODE.ERROR.USRAUT0013}"}`);
    }

    try {

        const key = `User|txnId:${txnId}`;
        const redisResult = await redis.GetKeys(key);

        if (!redisResult || redisResult.length == 0) {
            return res.status(STATUS.UNAUTHORIZED).send("Unauthenticated access!");
        }

        const result = await redis.GetRedis(key);
        const UserData = JSON.parse(result);
        const mobileKey = `Reg_Mob_${UserData.ben_mobile_number}`

        if (UserData.otp != otp) {
            return res.status(STATUS.BAD_REQUEST).send(`{ "errorCode": "USRAUT0014", "error": "${ERRORCODE.ERROR.USRAUT0014}" }`);
        } else {
            let userObj = {};

            if (UserData._id) {
                userObj = {
                    user_name: UserData._id,
                    user_id: UserData._id,
                    mobile_number: UserData.mobile_number,
                    txnId: txnId,
                    isNewAccount: "N"
                }

            } else {
                userObj = {
                    user_name: "Login|" + UserData.mobile_number,
                    mobile_number: UserData.mobile_number,
                    txnId: txnId,
                    source: source,
                    isNewAccount: "Y"
                }
            }

            const tokenData = await generateToken.generateTokenWithRefId(userObj, req)

            redis.deleteKey(key);
            redis.deleteKey(mobileKey);

            return res.status(STATUS.OK).send({ token: tokenData.encoded, isNewAccount: userObj.isNewAccount });
        }
    } catch (error) {
        logger.error(error)
        return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRAUT0019", "error":"${ERRORCODE.ERROR.USRAUT0019}"}`);
    }
});

router.post('/getOtp', async (req, res) => {

    try {
        let mobile_number = req.body.mobile_number;
        if (mobile_number == undefined || mobile_number == null) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRAUT0010", "error":"${ERRORCODE.ERROR.USRAUT0010}"}`);
        }



        let key = `Admin_User|User:${mobile_number}`;
        let redisResult = await redis.GetRedis(key);

        if (redisResult[0]) {
            var userData = JSON.parse(redisResult);
            return res.status(STATUS.BAD_REQUEST).send({
                "errorCode": "USRAUT0011",
                "error": "OTP Already Sent!",
                "txnId": userData.txnId
            });
        } else {
            const userres = await User.selectUser(mobile_number);
            if (!userres[0]) {
                res.status(STATUS.OK).send({
                    "txnId": uuidv4()
                });
            } else {
                let new_txn_id = uuidv4();
                let otp = Math.floor(100000 + Math.random() * 900000);

                let userdata = {}
                userdata.user_name = userres[0].user_name;
                userdata.txnId = new_txn_id;
                userdata.otp = otp;
                userdata.mobile_no = mobile_number;
                userdata.school_id = userres[0].school_id;
                userdata.trust_id = userres[0].trust_id;

                User.setUserInRedis(userdata);
                await User.shareNewUserDetails(userdata);
                res.status(STATUS.OK).send({
                    "txnId": new_txn_id
                });

            }
        }
    } catch (err) {

        res.status(STATUS.INTERNAL_SERVER_ERROR).send(err);
    }

});

router.post('/verifyOtp', async (req, res) => {

        let otp = CONST.decryptPayload(req.body.otp);
        let txnId = req.body.txnId;

        if (otp == undefined || otp == null) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRAUT0012", "error":"${ERRORCODE.ERROR.USRAUT0012}"}`);
        }

        if (txnId == undefined || txnId == null || txnId == '') {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRAUT0013", "error":"${ERRORCODE.ERROR.USRAUT0013}"}`);
        }

        try {
            let key = `Admin_User|txnId:${txnId}`;
            let redisResult = await redis.GetKeys(key);

            if (redisResult && redisResult.length > 0) {
                const result = await redis.GetRedis(key);
                let UserData = JSON.parse(result[0]);
                if (UserData.otp != parseInt(otp)) {
                    return res
                        .status(STATUS.BAD_REQUEST)
                        .send(
                            `{ "errorCode": "USRAUT0014", "error": "${ERRORCODE.ERROR.USRAUT0014}" }`
                        );
                } else {
                    let user_name = UserData.user_name;
                    const checkUser = await User.checkUser(user_name);
                    if (checkUser[0]) {
                        let user_data = checkUser[0];
                        var role_id = user_data.role_id;
                        const roleModuleResult = await User.getRoleModuleList(role_id)
                        const token = await generateToken.generate(UserData.user_name, user_data, roleModuleResult, req)
                        let mobile_key = `Admin_User|User:${UserData.user_name}`;
                        await redis.deleteKey(mobile_key);
                        await redis.deleteKey(key);
                        return res.status(STATUS.OK).send(token.encoded);
                    } else {
                        return res.status(STATUS.BAD_REQUEST)
                            .send(`{ "errorCode": "USRAUT0014", "error": "${ERRORCODE.ERROR.USRAUT0014}" }`);
                    }
                }
            } else {
                return res.status(STATUS.BAD_REQUEST)
                    .send(`{ "errorCode": "USRAUT0014", "error": "${ERRORCODE.ERROR.USRAUT0014}" }`);
            }
        } catch (error) {
            console.log(error);
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRAUT0019", "error":"${ERRORCODE.ERROR.USRAUT0019}"}`);
        }
    });


//getForgetPasswordOtp

router.post('/getForgetPasswordOtp', async (req, res) => {
    try {
        let mobile_number = req.body.mobile_number;
        if (!mobile_number || mobile_number.toString().length !== 10) {
            return res.status(STATUS.BAD_REQUEST).json({ errorCode: "CONFIG0023", error: ERRORCODE.ERROR.CONFIG0023 });
        }

        const phoneNumberExists = await User.selectUser(mobile_number);
        if (!phoneNumberExists[0]) {
            return res.status(STATUS.OK).send({
                "txnId": uuidv4()
            });
        }

        let key = `Admin_Forgot_Password|User:${mobile_number}`;
        let redisResult = await redis.GetRedis(key);

        if (redisResult[0]) {
            var userData = JSON.parse(redisResult);
            return res.status(STATUS.BAD_REQUEST).send({
                "errorCode": "USRAUT0011",
                "error": "OTP Already Sent!",
                "txnId": userData.txnId
            });
        } else {
            let new_txn_id = uuidv4();
            let otp = Math.floor(100000 + Math.random() * 900000);

            let userdata = {}
            userdata.user_name = mobile_number;
            userdata.txnId = new_txn_id;
            userdata.otp = otp;
            userdata.mobile_no = mobile_number;
            userdata.school_id = phoneNumberExists[0].school_id;
            userdata.trust_id = phoneNumberExists[0].trust_id;

            User.setForgotPasswordOTPInRedis(userdata);
            await User.shareForgotOTPUserDetails(userdata);
            res.status(STATUS.OK).send({
                "txnId": new_txn_id
            });
        }
    } catch (err) {
        console.error(`Error in getForgetPasswordOtp API: ${err}`);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(err);
    }
});

// verifyForgetPasswordOtp

router.post('/verifyForgetPasswordOtp', async (req, res) => {

    let otp = CONST.decryptPayload(req.body.otp);
    let txnId = req.body.txnId;

    if (!otp || !txnId) {
        return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRAUT0012", "error":"${ERRORCODE.ERROR.USRAUT0012}"}`);
    }

    try {
        let key = `Admin_Forgot_Password|txnId:${txnId}`;
        let redisResult = await redis.GetRedis(key);

        if (redisResult) {
            let UserData = JSON.parse(redisResult);
            if (UserData.otp != parseInt(otp) || UserData.txnId !== txnId.toString()) {
                return res.status(STATUS.BAD_REQUEST).send(`{ "errorCode": "USRAUT0014", "error": "${ERRORCODE.ERROR.USRAUT0014}" }`);
            } else {
                let user_name = UserData.user_name;
                const checkUser = await User.checkUser(user_name);
                if (checkUser[0]) {
                    let new_txnId = uuidv4();
                    let mobile_key = `Admin_Forgot_Password|User:${user_name}`;
                    let forgotPasswordChangeKey = `FORGOT_PASSWORD_CHANGE_${new_txnId}`;
                    await redis.deleteKey(mobile_key);
                    await redis.deleteKey(key);
                    redis.SetRedis(forgotPasswordChangeKey, { user_name }, 180);
                    return res.status(STATUS.OK).send({ message: 'OTP Verified Successfully', txnId: new_txnId });
                } else {
                    return res.status(STATUS.BAD_REQUEST).send(`{ "errorCode": "USRAUT0014", "error": "${ERRORCODE.ERROR.USRAUT0014}" }`);
                }
            }
        } else {
            return res.status(STATUS.BAD_REQUEST).send(`{ "errorCode": "USRAUT0014", "error": "${ERRORCODE.ERROR.USRAUT0014}" }`);
        }
    } catch (error) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"USRAUT0019", "error":"${ERRORCODE.ERROR.USRAUT0019}"}`);
    }
});

// RESET FORGET PASSWORD 


router.post('/resetForgetPassword', async (req, res) => {
    try {
        let newPassword = CONST.decryptPayload(req.body.newPassword);
        let confirmNewPassword = CONST.decryptPayload(req.body.confirmNewPassword);
        const { txnId } = req.body;

        if (!txnId) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRPRF00027", "error":"${ERRORCODE.ERROR.USRPRF00027}"}`);
        }

        if (newPassword !== confirmNewPassword) {
            return res.status(STATUS.BAD_REQUEST).send({  "error": "Passwords do not match" });
        }

        if (!/^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/.test(newPassword)) {
            return res.status(STATUS.BAD_REQUEST).send({ "error": "Password must be at least 8 characters long and contain at least one letter and one digit" });
        }

        const redisResult = await redis.GetRedis(`FORGOT_PASSWORD_CHANGE_${txnId}`);

        if (!redisResult) {
            return res.status(STATUS.BAD_REQUEST).send({  "error": "Invalid forgot password request" });
        }

        let userData;
        try {
            userData = JSON.parse(redisResult);
        } catch (error) {
            return res.status(STATUS.BAD_REQUEST).send({ "error": "Invalid Forgot Password Request" });
        }

        if (!userData || !userData.user_name) {
            return res.status(STATUS.BAD_REQUEST).send({ "error": "Mobile number not found" });
        }

        const mobileNumber = userData.user_name;

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const passwordUpdated = await User.resetPassword(hashedPassword, mobileNumber);

        if (passwordUpdated) {
            
            await redis.deleteKey(`FORGOT_PASSWORD_CHANGE_${txnId}`);
            await redis.deleteKey(`Admin_Forgot_Password|User:${mobileNumber}`);
            await redis.deleteKey(`User|Username:${mobileNumber}`);
            await redis.deleteKey(mobileNumber);
            res.status(STATUS.OK).json({ message: 'Password updated successfully' });
        } else {
            res.status(STATUS.BAD_REQUEST).json({ "error": 'Password Reset Timeout'});
        }

    } catch (error) {
        console.error('Error updating password:', error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({ "error": 'Internal server error' });
    }
});



module.exports = router;
