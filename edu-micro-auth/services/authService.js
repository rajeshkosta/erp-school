const { redis, logger, CONST, communicationUtil, commonService, pg } = require("edu-micro-common");
let QUERY = require('../constants/QUERY');
let config = require('../constants/config');
const ejs = require('ejs')

const User = {};

User.getUserInRedisByUserName = async (username) => {
    let key = `User|Username:${username}`
    let result = await redis.GetKeyRedis(key);
    return result;

}

User.setUserInRedisByUserNameForLogin = async (username, userObj) => {
    if (userObj && userObj[0]) {
        redis.SetRedis(`User|Username:${username}`, userObj, config.user.REDIS_EXPIRE_TIME_PWD)
            .then()
            .catch(err => logger.error(err));
    }
};

User.selectUser = async (username) => {

    try {
        let redis_result = await User.getUserInRedisByUserName(username);
        redis_result = redis_result && typeof redis_result == 'string' ? JSON.parse(redis_result) : redis_result;

        if (redis_result && redis_result.length && redis_result[0].account_locked != 1) {
            return redis_result
        }

        const _query = {
            text: QUERY.AUTH.selectUser,
            values: [username]
        };

        const queryResult = await pg.executeQueryPromise(_query);
        await User.setUserInRedisByUserNameForLogin(username, queryResult).catch(e => logger.error(e));
        return queryResult

    } catch (error) {
        throw new Error(error.message)
    }

};

User.getRoleModuleList = async (role_id) => {
    try {
        const _query = {
            text: QUERY.AUTH.selectRoleDetailsQueryByRoleId,
            values: [role_id]
        };

        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult[0];

    } catch (error) {
        throw new Error(error.message)
    }
};

User.getInvalidLoginAttempts = async (user_name) => {
    return new Promise(async (resolve, reject) => {

        const _query = {
            text: QUERY.AUTH.getInvalidAttempts,
            values: [user_name]
        };

        await pg.executeQuery(_query, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res[0]);
            }
        });

    });
}

User.getMaxInvalidLoginAttempts = async () => {
    return new Promise(async (resolve, reject) => {

        const _query = {
            text: QUERY.AUTH.getMaxInvalidLoginAttempts,
            values: []
        };

        await pg.executeQuery(_query, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res[0]);
            }
        });

    });
}

User.incrementInvalidLoginAttempts = (user_name) => {
    return new Promise(async (resolve, reject) => {

        const _query = {
            text: QUERY.AUTH.incrementInvalidAttempts,
            values: [user_name]
        };

        await pg.executeQuery(_query, (err, res) => {
            if (err) {
                reject(err, null);
            } else {
                logger.info('increment')
                logger.info(res[0]);
                resolve(null, res[0]);
            }
        });

    });
}

User.setUserInactive = async (id) => {
    return new Promise(async (resolve, reject) => {

        const _query = {
            text: QUERY.AUTH.setUserInactive,
            values: [id]
        };

        await pg.executeQuery(_query, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res[0]);
            }
        });

    });
}

User.updateUserLoggedInOut = async (isLoggedIn, userName) => {

    try {

        const _query = {
            text: QUERY.AUTH.updateUserLoggedInOut,
            values: [isLoggedIn, userName]
        };

        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult;

    } catch (error) {
        throw new Error(error.message);
    }
};

User.setUserInRedisByTxnId = async (userData) => {
    if (userData != undefined && userData != null) {
        let txnId = userData.txnId;
        redis.SetRedis(`User|txnId:${txnId}`, userData, 180)
            .then()
            .catch(err => logger.error(err));
    };
};

User.setUserInRedisForReg = async (phoneNo, userData, result) => {
    if (userData != undefined && userData != null) {
        try {
            let redisKey = `Reg_Mob_${phoneNo}`
            await User.setOTPInRedis(redisKey, userData);
            return result(null, 'done');
        } catch (e) {
            return result(e, null);
        }
    };
};

User.setOTPInRedis = async (redisKey, userData) => {
    let res = await User.checkIfOtpExistInRedis(redisKey);
    return new Promise((resolve, reject) => {
        if (res) {
            reject('OTP ALREADY SENT')
        } else {
            redis.SetRedis(redisKey, userData, 180)
                .then()
                .catch(err => logger.error(err));
            resolve();
        }
    })
}

User.checkIfOtpExistInRedis = async (key) => {
    let res = await redis.GetKeyRedis(key);
    return res;
}

User.setUserInRedis = async (userData) => {
    if (userData != undefined && userData != null) {
        let txnId = userData.txnId;

        redis.SetRedis(`Admin_User|User:${userData.user_name}`, userData, 180)
            .then()
            .catch(err => logger.error(err));

        redis.SetRedis(`Admin_User|txnId:${txnId}`, userData, 180)
            .then()
            .catch(err => logger.error(err));
    };
};

User.setForgotPasswordOTPInRedis = async (userData) => {
    if (userData != undefined && userData != null) {
        let txnId = userData.txnId;

        redis.SetRedis(`Admin_Forgot_Password|User:${userData.user_name}`, userData, 180)
            .then()
            .catch(err => logger.error(err));

        redis.SetRedis(`Admin_Forgot_Password|txnId:${txnId}`, userData, 180)
            .then()
            .catch(err => logger.error(err));
    };
};

User.checkUser = async (username) => {

    try {
        let redis_result = await User.getUserInRedisByUserName(username);

        redis_result = JSON.parse(redis_result);

        if (redis_result && redis_result.length && redis_result[0].account_locked != 1) {
            return redis_result;
        } else {
            const _query = {
                text: QUERY.AUTH.selectUser,
                values: [username]
            };
            const queryResult = await pg.executeQueryPromise(_query);
            User.setUserInRedisByUserNameForLogin(username, queryResult);
            return queryResult;
        }
    } catch (err) {
        throw err;
    }
};

const generateHtmlFromEjs = async (result, ejs_path) => {
    try {
        let html;
        html = await ejs.renderFile(ejs_path, result, {
            async: true
        });
        return html;

    } catch (error) {
        throw error;
    }
}


User.getUserClassroomDetails = async (userDetails) => {
    try {

        const currentAcademicYear = await getActiveAcademicYears(userDetails.school_id);
        console.log(currentAcademicYear);
        let classroomDetails;

        if (currentAcademicYear) {
            const _query = {
                text: QUERY.AUTH.getClassroomDetails,
                values: [currentAcademicYear.academic_year_id, userDetails.user_id]
            };
            const queryResult = await pg.executeQueryPromise(_query);

            classroomDetails = queryResult && queryResult.length > 0 ? queryResult[0] : null;
        }
        return {
            currentAcademicYear,
            classroomDetails
        }


    } catch (error) {
        throw error;
    }
}



const getActiveAcademicYears = async (school_id) => {
    try {
        const _query = {
            text: QUERY.AUTH.getActiveAcademicYears,
            values: [school_id]
        };
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult && queryResult.length > 0 ? queryResult[0] : null;

    } catch (error) {
        throw new Error(error.message);
    }
}


User.checkPhoneNumberExists = async (mobileNumber) => {
    try {
        const _query = {
            text: QUERY.AUTH.checkIsPhoneNumberExists,
            values: [mobileNumber]
        };
        const result = await pg.executeQueryPromise(_query);
        return result && result.length > 0;
    } catch (error) {
        throw new Error(error.message);
    }
};


User.resetPassword = async (newPassword,mobileNumber) => {
    try {
        const _query = {
            text: QUERY.AUTH.resetPasswordQuery,
            values: [newPassword,mobileNumber]
        };
        const result = await pg.executeQueryPromise(_query);
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
};

User.shareNewUserDetails = async (userDetails) => {
    try {

        let mobileNumber = userDetails.mobile_no;
        let eduName = await commonService.getEduName(userDetails);
        let message = CONST.SMS_TEMPLATES.ADMIN_LOGIN_WITH_OTP.body;
        let templateId = CONST.SMS_TEMPLATES.ADMIN_LOGIN_WITH_OTP.template_id;
        let time = CONST.SMS_TEMPLATES.ADMIN_LOGIN_WITH_OTP.time;
        message = message.replace("<OTP>", userDetails.otp)
                        .replace("<TIME>", time)
                        .replace("<EDUNAME>", eduName);

        await communicationUtil.sendSMS(message, mobileNumber, templateId);

    } catch (error) {
        throw error;
    }
}

User.shareForgotOTPUserDetails = async (userDetails) => {
    try {

        let mobileNumber = userDetails.mobile_no;
        let eduName = await commonService.getEduName(userDetails);
        let message = CONST.SMS_TEMPLATES.ADMIN_FORGOT_PASSWORD.body;
        let templateId = CONST.SMS_TEMPLATES.ADMIN_FORGOT_PASSWORD.template_id;
        let time = CONST.SMS_TEMPLATES.ADMIN_FORGOT_PASSWORD.time;
        message = message.replace("<OTP>", userDetails.otp)
                        .replace("<TIME>", time)
                        .replace("<EDUNAME>", eduName);

        console.log("message, mobileNumber, templateId", message, mobileNumber, templateId);
        await communicationUtil.sendSMS(message, mobileNumber, templateId);

    } catch (error) {
        throw error;
    }
}

module.exports = User;
