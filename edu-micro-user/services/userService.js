const { CONST,pg, redis, logger, commonService, communicationUtil, queryUtility } = require("edu-micro-common");
const User = {};
let QUERY = require('../constants/QUERY')
const config = require("../config/config");


User.getProfileDtlsbyMob = async (id, result) => {
    const _query = {
        text: QUERY.USER.selectProfileDtlsbyMobQuery,
        values: [id]
    };
    await pg.executeQuery(_query, (err, res) => {
        if (err) {
            logger.error("error: ", err);
            result(err, null);
        } else {
            logger.error("res: ", res);
            console.log(res)
            result(null, res);
        }
    }
    );
};

User.updatePassword = async (pwd, userId, username, result) => {
    const _query = {
        text: QUERY.USER.updateUserPwdQuery,
        values: [pwd, userId]
    };
    var querySQL = await pg.executeQuery(_query, (err, res) => {
        if (err) {
            logger.error("error: " + err);
            result(err, null);
        } else {
            // User.setUserInRedisByUserName(username, pwd);
            result(null, res);
        }
    }
    );
};


User.shareNewUserDetails = async (userDetails) => {
    try {

        let mobile_number = '91' + userDetails.mobile_no;
        let message = CONST.SMS_TEMPLATES.ADMIN_FORGOT_PASSWORD.body;
        message = message.replace("<OTP>", userDetails.otp).replace("<TIME>", 3);
        let userData = await User.selectUserPromise(userDetails.mobile_no);
        console.log("message", userData);
        SMS.sendSMS(mobile_number, message);
        // whatsAppUtil.sendMessage(userDetails.mobile_no, message).then().catch(e => console.log(e));

        if (userData.email_id) {
            let render_options = {
                name: userData.display_name,
                title: `AEMS, AIEZE | Forgot Password`,
                otp: userDetails.otp,
                duration: 3
            }
    
            let html_template = await generateHtmlFromEjs(render_options, 'views/pages/user-forgot-password-otp.ejs');
            await email.sendMail(userData.email_id, userData.display_name, 'AEMS, AIEZE | Forgot Password', html_template);
        }

    } catch (error) {
        throw error;
    }
}


User.selectUser = async (username, result) => {
    const _query = {
        text: QUERY.USER.selectUser,
        values: [username]
    };
    var querySQL = await pg.executeQuery(_query, (err, res) => {
        if (err) {
            logger.error("error: " + err);
            result(err, null);
        } else {
            result(null, res);
        }
    }
    );
};

User.selectUserToUpdateMobileNumber = async (username, result) => {
    const _query = {
        text: QUERY.USER.selectUserToUpdateMobileNumber,
        values: [username]
    };
    var querySQL = await pg.executeQuery(_query, (err, res) => {
        if (err) {
            logger.error("error: " + err);
            result(err, null);
        } else {
            result(null, res);
        }
    }
    );
};

User.verifyMobile = async (phoneNo, result) => {
    const _query = {
        text: QUERY.USER.verifyMobile,
        values: [phoneNo]
    };
    await pg.executeQuery(_query, (err, res) => {
            if (err) {
                logger.error("error: " + err);
                result(err, null);
            } else {
                User.setUserInRedisByUserName(phoneNo, "");
                result(null, res[0].count);
            }
        }
    );
    // logger.debug(querySQL.sql);
};



User.getUserDtlsPromise = async (id) => {
    const _query = {
        text: QUERY.USER.selectProfileDtlsQuery,
        values: [id]
    };
    var result = await pg.executeQueryPromise(_query);
    return result[0];
};

User.setPasswordHistory = async (userDetails, cb) => {
    let selectQuery = queryUtility.convertObjectIntoSelectQuery(userDetails);
    const _query = `${QUERY.USER.setPasswordHistory} ${selectQuery}`;
    var querySQL = await pg.executeQuery(_query, (err, res) => {
        if (err) {
            cb(err, null)
        } else {
            cb(null, res);
        }
    });
};

User.setUserInRedisByUserName = async (username, password) => {
    const _query = {
        text: QUERY.USER.selectUser,
        values: [username]
    };
    var querySQL = await pg.executeQuery(_query, (err, userObj) => {
        if (err) {
            logger.error("error: " + err);
        } else {
            if (userObj && userObj[0]) {
                redis.SetRedis(`User|Username:${username}`, userObj, config.user.REDIS_EXPIRE_TIME_PWD)
                    .then()
                    .catch(err => {
                        logger.error("error: " + err);
                    })
            }
        }
    });
};

User.updatePreferredLocationOfUser = async (userId, state_id, district_id, zipcode) => {
    try {
        let _query = {
            text: QUERY.USER.updatePreferredLocation,
            values: [state_id, district_id, zipcode, userId]
        };

        const queryResult = await pg.executeQueryPromise(_query);

        return queryResult;
    } catch (error) {
        throw error;
    }
};

User.getProfileDtls = async (id, result) => {
    
    const _query = {
        text: QUERY.USER.selectProfileDtlsQuery,
        values: [id]
    };
    var querySQL = await pg.executeQuery(_query, (err, res) => {
            if (err) {
                logger.error("error: ", err);
                result(err, null);
            } else {
                result(null, res);
            }
        }
    );
};




User.updateUser = async (req, userId, result) => {
    let setQuery = queryUtility.convertObjectIntoUpdateQuery(req);
    let updateQuery = `${QUERY.USER.updateUserQuery} ${setQuery} WHERE user_id = $1`;


    console.log(updateQuery);
    
    const _query = {
        text: updateQuery,
        values: [userId]
    };
    var querySQL = await pg.executeQuery(_query, async (err, res) => {
        if (err) {
            logger.error("error: " + err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
};


User.getUserDtlsPro = async (id, cb) => {
    const _query = {
        text: QUERY.USER.selectProfileDtlsQuery,
        values: [id]
    };
    var querySQL = await pg.executeQuery(_query, (err, res) => {
        if (err) {
            logger.error("error: ", err);
            cb(err, null)
        } else {
            let r = res && res[0] ? res[0] : [];
            cb(null, r);
        }
    });
};

User.getActiveAcademicYears = async (school_id) => {
    try {
        const _query = {
            text: QUERY.ACADEMIC_YEAR.getActiveAcademicYears,
            values: [school_id]
        };

        const queryResult = await pg.executeQueryPromise(_query);
        
        return queryResult

    } catch (error) {
        throw new Error(error.message);
    }
}

User.getLogoUrl = async (userData) =>{
    try {
        let level = userData.user_level;
        let logoUrl = null;
        if(level == "Trust" && userData.trust_id){
            logoUrl = await User.getTrustLogoUrl(userData.trust_id);
        }else if(userData.school_id){
            logoUrl = await User.getSchoolLogoUrl(userData.school_id);
        }
        return logoUrl;
    } catch (error) {
        throw new Error(error.message);
    }
    
}

User.getTrustLogoUrl = async (trust_id) => {
    try {
        const _query = {
            text: QUERY.LOGO.getTrustLogoUrl,
            values: [trust_id]
        };

        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult && queryResult.length > 0 ? queryResult[0].logo_url : null;

    } catch (error) {
        throw new Error(error.message);
    }
}

User.getSchoolLogoUrl = async (school_id) => {
    try {
        const _query = {
            text: QUERY.LOGO.getSchoolLogoUrl,
            values: [school_id]
        };

        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult && queryResult.length > 0 ? queryResult[0].logo_url : null;

    } catch (error) {
        throw new Error(error.message);
    }
}

User.checkUserIdExists = async (user_id, school_id) => {
    try {
        const _query = {
            text: QUERY.USER.checkIfUserIdExist,
            values: [user_id, school_id]
        };
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult.rows.length > 0;
    } catch (error) {
        throw new Error(error.message);
    }
}

User.getUserDetails = async (user_id) => {
    try{
        const query = {
            text: QUERY.USER.getUserStatus,
            values: [user_id]
        };
        const queryResult = await pg.executeQueryPromise(query);
        return queryResult;
    } catch (error) {
        throw new Error(error.message);
    }
}

User.updateUserStatus = async (updateUserStatus,currentStatus) => {
    try {
        const _query = {
            text: QUERY.USER.getUpdateUserStatus,
            values: [currentStatus,updateUserStatus.user_id]
        };
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult;
    } catch (error) {
        throw new Error(error.message);
    }
};

User.checkIfExist = async (username, result) => {
    const _query = {
        text: QUERY.USER.checkIfUserExist,
        values: [username]
    };
    var querySQL = await pg.executeQuery(_query, (err, res) => {
            if (err) {
                logger.error("error: " + err);
                result(err, null);
            } else {
                result(null, res[0].usercount);
            }
        }
    );
};

User.shareOTPDetails = async (userDetails) => {
    try {

        let mobileNumber = userDetails.mobile_no;
        let eduName = await commonService.getEduName(userDetails);
        let message = CONST.SMS_TEMPLATES.ADMIN_UPDATE_MOBILE_NUMBER_OTP.body;
        let templateId = CONST.SMS_TEMPLATES.ADMIN_UPDATE_MOBILE_NUMBER_OTP.template_id;
        let time = CONST.SMS_TEMPLATES.ADMIN_UPDATE_MOBILE_NUMBER_OTP.time;
        message = message.replace("<OTP>", userDetails.otp)
                        .replace("<TIME>", time)
                        .replace("<EDUNAME>", eduName);

        await communicationUtil.sendSMS(message, mobileNumber, templateId);

    } catch (error) {
        throw error;
    }
}

User.updateMobileNumber = async (user, username, result) => {
    const _query = {
        text: QUERY.USER.updateUsername,
        values: [user.username, user.username,username]
    };
    var querySQL = await pg.executeQuery(_query, async (err, res) => {
            if (err) {
                logger.error("error: " + err);
                result(err, null);
            } else {
                // User.setUserInRedisByUserName(user.username, user.password);
                user.user_id_parent = user.user_id;
                user.mobile_number = username;
                user.user_name = username;
                user.account_locked = 1;
                delete user.user_id;
                delete user.mobileNumber;
                delete user.username;
                delete user.invalid_attempts;
                delete user.state;
                delete user.district;
                delete user.state_name;
                delete user.district_name;
                delete user.role;
                delete user.role_name;
                delete user.name;
                let selectQuery = queryUtility.convertObjectIntoSelectQuery(user);

                const _query_dup = `${QUERY.USER.insertUserHistoryQuery} ${selectQuery}`;
                var querySQL_1 = await pg.executeQuery(_query_dup, (err, res) => {
                    if (err) {
                        logger.error("error: " + err);
                        result(err, null);
                    } else {
                        result(null, res);
                    }
                });
            }
        }
    );
};

module.exports = User;



