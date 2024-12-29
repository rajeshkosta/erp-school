let CryptoJS = require("crypto-js");
let moment = require("moment");

exports.HEADER = {
    authToken: "authorization"
};

exports.SERVICES = {
    MOBILE: "+91<mobile@anchal.com>",
    OTP_TRIALS: 3,
    NEXT_OTP: 60,
    email_To: "email_To",
    emailTo_feedback: "emailTo_feedback",
    newUser_sms: "newUser_sms",
    forgotPwd_sms: "forgotPwd_sms",
    update_mobno_sms: "update_mobno_sms",
    resetUser_sms: "resetUser_sms",
    verify_mobno_sms: "verify_sms",
    register_sms: "register_sms",
    session_sms: "session_sms",
    default_pass: "EDU_123",
    campaign_id: "3737373",
    EDU_audit_logs_localFile_maxSize: 1
};

exports.OTPREASONS = {
    FORGOTPASSWORD: "FORGOT PASSWORD",
    UPDATEMOBNO: "UPDATE MOBILE NUMBER",
    VERIFYMOBNO: "VERIFY MOBILE NUMBER"
};

exports.decryptPayload = function (reqData) {
    if (reqData) {
        let bytes = CryptoJS.AES.decrypt(reqData, "EDU@$#&*(!@%^&");
        return bytes.toString(CryptoJS.enc.Utf8);
    } else {
        return "";
    }
};

exports.decryptPayloadWithTimestamp = function (reqData, timestamp) {
    let key = "EDU@$#&*(!@%^&" + timestamp;
    if (reqData) {
        let bytes = CryptoJS.AES.decrypt(reqData, key);
        return bytes.toString(CryptoJS.enc.Utf8);
    } else {
        return "";
    }
};

exports.encryptPayload = function (reqData) {
    let key = "EDU@$#&*(!@%^&";
    if (reqData) {
        return CryptoJS.AES.encrypt(JSON.stringify(reqData), key).toString();
    } else {
        return "";
    }
};

exports.SMS_TEMPLATES = {
    ADMIN_USER_CREATION: {
        body: 'Dear <NAME>, Your login has been created successfully and the password is <PASSWORD>. To login, click <URL> - <EDUNAME> -AIEZE',
        template_id: '1107170815266644802'
    },
    ADMIN_FORGOT_PASSWORD: {
        body: '<OTP> is the OTP for forgot password. This is valid for <TIME> mins. Do not share this OTP with anyone. - <EDUNAME> -AIEZE',
        template_id: '1107170815280191750',
        time: '3'
    },
    ADMIN_LOGIN_WITH_OTP: {
        body: '<OTP> is the OTP for admin login. This is valid for <TIME> mins. Do not share this OTP with anyone. - <EDUNAME> -AIEZE',
        template_id: '1107170815280191750',
        time: '3'
    },
    ADMIN_UPDATE_MOBILE_NUMBER_OTP: {
        body: '<OTP> is the OTP for update mobile number. This is valid for <TIME> mins. Do not share this OTP with anyone. - <EDUNAME> -AIEZE',
        template_id: '1107170815280191750',
        time: '3'
    },
    ADMIN_RESET_PASSWORD: {
        body: 'Dear <NAME>, Your password has been reset successfully. Kindly login with password: <PASSWORD> - ERP School',
    },
    VC_LINK: {
        body: 'The video call with <NAME> has been initiated. Please tap the link <LINK> to join the video call<TIME>',
    },
    otpLogin: {
        body: '<otp> is the OTP for ERP School. This is valid for <time> mins. Do not share this OTP with anyone. - ERP School',
        template_id: '1107166520316700843',
        time: '3'
    },
    forgotPasswordOtp: {
        body: 'Your OTP to update password for Application is <otp>. It will be valid for <time> minutes. Please do not share this OTP with anyone',
        template_id: '1707164750832694407',
        time: '3'
    },
}

exports.exceed_attempts_limit = 50

exports.CACHE_TTL = {
    SHORT: 15 * 60,
    MID: 60 * 60,
    LONG: 24 * 60 * 60
};

exports.uniqueID = async function () {
    let d = new Date();
    let timestamp = d.getTime();

    return timestamp;
};

exports.admin_secret_key = {
    secret: '30c85dc9-a5e2-422b-9028-d83378597497'
}

exports.APP_CATEGORY_LEVELS = ['Trust', 'School', 'Faculty', 'NonFaculty']

exports.GENDER = {
    1: 'Male',
    2: 'Female',
    3: 'Others'
}

exports.appendReqUserData = (data, reqUserDetails, insertData = true) => {
    if (insertData) {
        data.created_by = reqUserDetails.user_id;
    }
    data.updated_by = reqUserDetails.user_id;
    return data;
} 

exports.FILE_MIME_TYPES = {
    png: "image/png",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    gif: "image/gif",
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
}