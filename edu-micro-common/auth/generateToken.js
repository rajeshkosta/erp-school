const ENCODE = require('../auth/jwt.encoder');
const redis = require("../config/redis");
const pg = require("../config/pg");
const crypto = require('crypto');

const generate = async (userName, userData, roleDetails, req) => {

    if (!userName) {
        throw new Error('UserName is Missing!')
    }

    const userArray = {
        user_id: userData.user_id,
        user_name: userData.user_name,
        display_name: userData.display_name,
        email_id: userData.email_id,
        role: userData.role_id,
        user_role_description: roleDetails.role_description,
        roleModifiedDate: roleDetails.date_modified,
        role_name: roleDetails.role_name,
        user_level: roleDetails.level,
        trust_id: userData.trust_id,
        school_id: userData.school_id,
        //current_academic_year: userData.classroomDetails.currentAcademicYear,
        //classroom_details: userData.classroomDetails.classroomDetails,
        ua: req.headers["user-agent"],
        date_modified: new Date()
    };

    const token = ENCODE.encodeToken30Days(userArray);
    const build = {
        encoded: token,
        plain: userArray
    };

    redis.SetRedis(userData.user_name, token, 60 * 60 * 8).catch(err => { console.error(err) })
    return build;
};

const generateTokenWithRefId = async (userdata, req) => {

    if (!userdata) {
        throw new Error('No Username')
    }

    const userArray = {
        full_name: userdata.full_name,
        _id: userdata._id,
        mobile_number: userdata.mobile_number,
        secret_key: userdata.secret_key,
        source: userdata.source,
        txnId: userdata.txnId,
        user_name: userdata.user_name,
        ua: req.headers["user-agent"],
        date_modified: new Date(),
    };

    const token = ENCODE.encodeGuestToken(userArray);
    const build = {
        encoded: token,
        plain: userArray
    };

    await redis.SetRedis(userdata.user_name, token, 60 * 60 * 8).catch(err => { })
    return build;
};

const generateGuestToken = (guestData, done) => {
    const guestArray = {
        user_name: guestData.username,
        ipaddress: guestData.ipaddress,
        ua: guestData.ua,
        date_modified: new Date()
    };

    const token = ENCODE.encodeGuestToken(guestArray);
    const build = {};
    build.encoded = token;
    build.plain = guestArray;
    var hashKey = crypto.createHash('md5').update(token).digest('hex');

    redis.SetRedis(hashKey, token, process.env.EDU_REDIS_SHORT_TTL)
        .then()
        .catch(err => { })
    return done(null, build);
};

const generateDashboardGuestToken = (guestData, done) => {
    const guestArray = {
        user_name: guestData.username,
        ipaddress: guestData.ipaddress,
        ua: guestData.ua,
        date_modified: new Date()
    };


    const token = ENCODE.encodeDashboardGuestToken(guestArray);
    const build = {};
    build.encoded = token;
    build.plain = guestArray;
    return done(null, build);
};

const generateTokenWithUserData = (userdata, done) => {
    if (userdata) {
        const token = ENCODE.encodeGuestToken(userdata);
        const build = {};
        build.encoded = token;
        build.plain = userdata;
        return done(null, build);
    } else return done('No Username');
};

module.exports = {
    generate,
    generateGuestToken,
    generateTokenWithRefId,
    generateDashboardGuestToken,
    generateTokenWithUserData
};
