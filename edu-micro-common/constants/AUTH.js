exports.SECRET_KEY = "EDU_2021";
exports.SECRET_KEY_CERT = "EDU_CERT_2021";
exports.EXPIRY_DAY = 1;
exports.EXPIRY_HOURS = 8;
exports.EXPIRY_MINS = 15;

exports.API = {
    PUBLIC: [
        "/api/v1/user/health",
        "/api/v1/auth/health",
        "/api/v1/admin/health",
        "/api/v1/auth/login",
        "/api/v1/auth/validateToken",
        "/api/v1/admin/user/password_policy",
        "/api/v1/admin/mobile/appVersion",
        "/api/v1/user/verifyMobileNumber",
        "/api/v1/user/verifyForgotPasswordOtp",
        "/api/v1/user/resetPassword",
        "/api/v1/user/updatePassword",

        "/api/v1/auth/generateOTP",
        "/api/v1/auth/validateOTP",
        "/api/v1/auth/getOtp",
        "/api/v1/auth/verifyOtp",

        "/api/v1/admin/location/states",
        "/api/v1/admin/location/districts/:stateId",
        "/api/v1/admin/location/getPincodes/:districtId",
        "/api/v1/admin/cdn/file",
        "/api/v1/admin/cdn/fileDownload",
        "/api/v1/admin/cdn/fileDisplay",

        "/api/v1/admin/adminService/listBucket",

        "/api/v1/admin/master/getClasses",
      
        "/api/v1/registration/student/createContact",
        "/api/v1/registration/student/importStudents",


        //Documents
        "/api/v1/document/health",


        //Transports
        "/api/v1/transport/health",

        
        "/api/v1/admin/user/chkSMSTemplate",

        //Registartion
        "/api/v1/registration/student/create",

        //RESET FORGET PASSWORD 
        "/api/v1/auth/getForgetPasswordOtp",
        "/api/v1/auth/verifyForgetPasswordOtp",
        "/api/v1/auth/resetForgetPassword",
        

    ],
    ADMIN: [
    ],
    GUEST: [
    ]
};


