exports.ERROR = {

    SUBJ0001: "schoolid is Required ",
    SUBJ0002: "Teacherid is Required ",
    SUBJ0003: "Subject name is already available ",
    SUBJ0004: "schoolid is already available",
    SUBJ0005: "Subject name is required",
    SUBJ0006: "Please provide valid subject name!",
    SUBJ0007: "Please provide subject name is correct format!",

    SEC0001: "sectionid is required!",
    SEC0002: "academicyear id is required!",
    SEC0003: "this section is already available",


    COMMON0000: "Something Went Wrong",
    COMMON0001: "%s is mandatory",
    COMMON0002: "%s is invalid",
    COMMON0003: "Invalid %s %s",
    COMMON0004: "%s %s does not belong to %s %s",
    COMMON0005: "Address must contain only English Alphabets ('a-z' and 'A-Z'), Numbers '0-9', Dot '.', Comma ',', Hyphen '-', Open parenthesis '(' and Close parenthesis ')'",
    COMMON0006: "Invalid Request",

    ROLE000001: "Role Name already exists",
    ROLE000002: "Role Name must be upto 50 characters",
    ROLE000003: "Role Description must be upto 100 characters",
    ROLE000004: "Name must contain only English Alphabets (“a-z” and “A-Z”), Numbers “0-9”, Dot “.”, Hyphen “-”, Ampersand “&”, Open parenthesis “(” and Close parenthesis “)”",
    ROLE000005: "Description must contain only English Alphabets (“a-z” and “A-Z”), Numbers “0-9”, Dot “.”, Hyphen “-”, Ampersand “&”, Open parenthesis “(” and Close parenthesis “)”",
    ROLE000006: "Menu Name must be upto 50 characters",
    ROLE000007: "Menu Name already exists",
    ROLE000008: "Menu Description must be upto 100 characters",
    ROLE000009: "Menu Name already exists",
    ROLE000010: "You do not have adequate permissions to create/update Role",

    EXAMTP000001: "Validation error",
    EXAMTP000002: "Internal server error",
    EXAMTP000003: "Exam type name already exist",
    EXAMTP000004: "Exam type id already exist",
    EXAMTP000005: "Exam type id not found ",
    EXAMTP000006: "Invalid exam type id",
    EXAMTP000007: "Please provide Exam Type ",


    ADMVER0001: "No record found ",
    ADMROL0002: "Status cannot be changed as X Active Users are associated with the Role In Order to change a Role to Inactive, please make sure no Active Users are associated with it",
    ADMROL0003: "User status cannot be changed to Active as User is associated with Inactive Role",
    ADMROL0004: "isActive value is mandatory ",
    ADMROL0005: "Mobile Number is already registered ",
    ADMROL0006: "Role is Inactive ",
    ADMROL0007: "No files were uploaded. ",
    ADMROL0008: "File format should be PNG, JPEG, JPG ",
    ADMROL0009: "File Upload Success",
    ADMROL0010: "Invalid file name",
    ADMROL0011: "User Id is mandatory",
    ADMROL0012: "Invalid Role",
    ADMROL0013: "Display Name is mandatory",
    ADMROL0014: "Mobile Number is invalid",
    ADMROL0015: "File size should be less than 2MB",

    ADMROS0001: "Slot Already Present within that time range",
    ADMSOS0001: "Shift Already Present within that time range",

    USRRES0001: "Admin Email not found ",
    USRRES0002: "User not found ",
    USRRES0003: "User is already allocated to Session site",
    USRRES0004: "Date Selection is mandatory",
    USRRES0005: "Selected Date is Invalid",
    USRAUT0012: "OTP is Required",
    USRAUT0013: "txnId is Required",
    USRAUT0014: "Invalid OTP",

    LOCVALID01: "Invalid state %s",
    LOCVALID02: "Invalid district %s",
    LOCVALID03: "District %s does not belong to state %s",
    LOCVALID04: "Invalid block %s",
    LOCVALID05: "Block %s does not belong to district %s",
    LOCVALID06: "State %s should be same as logged in user state %s",
    LOCVALID07: "District %s should be same as logged in user district",
    LOCVALID08: "Block %s should be same as logged in user block",
    LOCVALID09: "State Name should not be numeric",
    LOCVALID10: "District Name should not be numeric",
    LOCVALID11: "Block Name should not be numeric",
    LOCVALID12: "Facility Name should not be numeric",

    CONTFORM000001:"Validation error",
    CONTFORM000002:"Contact Id not Exists",

    ASSIGNMARKS001: "Student Details not found",
    ASSIGNMARKS002: "Something went wrong",
    ASSIGNMARKS003: "Invalid Academic year",


}

exports.USER = {
    USRRESULT0001: "User deleted successfully",
    USRPRF00027: "No files were uploaded ",
    USRPRF00028: "Invalid File ",
    USRPRF00029: "File format should be PNG, JPEG ",
    USRPRF00030: "Something went wrong!",
    USRPRF00001: "Invalid Request"
};

exports.LANGUAGE_ERR = {
    LANGSERVC000: "Something Went Wrong",
    LANGSERVC001: "Speciality Name Already Exists",
}

exports.TEMPLATE = {
    TEMPLATESERV005: "You do not have permissions to update this template",
    TEMPLATESERV000: "Something Went Wrong"
}



exports.SCHOOL = {
    SCHOOL0001: "Something Went Wrong",
    SCHOOL0002: "School already exist",
    SCHOOL0003: "invalid school",
    SCHOOL0004: "invalid request",
    SCHOOL0005: "You do not have adequate permissions to create/update School",
  
}
exports.ACADEMIC_YEAR = {
    ACYR000001: "Invaild Request",
    ACYR000002: "Academic Year must be upto 50 characters",
    ACYR000003: "Invalid Academic Year",
    ACYR000004: "Academic Year already exist",
    ACYR000005: "Invalid Academic Year range",
    ACYR000006: "Invalid Start Date",
    ACYR000007: "Invalid End Date",
    ACYR000008: "Status cannot be changed as Classes are associated with the Academic Year In Order to change a Academic Year to Inactive, please make sure no Active Classes are associated with it",
    ACYR000009: "Academic Year range should be atleast 1 month",
}
exports.TRUST = {
    TRUSTSERVC000:"Something Went Wrong",
    TRUSTSERVC001:"Trust already exist",
    TRUSTSERVC002:"Trust added successfully",
    TRUSTSERVC003:"Trust updated successfully",
    TRUSTSERVC004:"Invalid Trust name",
    TRUSTSERVC005:"Invalid Trust",
    TRUSTSERVC006: "You do not have adequate permissions to create/update Trust"
};

exports.FEEMASTER = {
  FEEMASTERSERVC000:"Something Went Wrong",
  FEEMASTERSERVC001:"Fee Type already exist",
  FEEMASTERSERVC002:"Fee type not exist"
};

exports.FEE = {
    FEESERVC000:"Something Went Wrong",
    FEESERVC001:"Fees type already exist",
    FEESERVC002:"Invalid entry",
    FEESERVC003:"fee_type cannot be null",
    FEESERVC004:"fee_type doesn't exist"

}

exports.FEEDISCOUNT = {
    FEEDISCOUNTSERVC000:"Something Went Wrong",
    FEEDISCOUNTSERVCOO2:"Fee discount already exist",
    FEEDISCOUNTSERVCOO3:"Fee discount doesn't exist"


}

exports.EXAMINATION = {
    EXAMINATIONSERVCOOO:"Examination already exist",
    EXAMINATIONSERVCOO1:"Something Went Wrong",
    EXAMINATIONSERVCOO2:"Invalid entry",
    EXAMINATIONSERVCOO3 :"exam_type already exist",
    EXAMINATIONSERVCOO4 :"Please provide Academic Year Id",
    EXAMINATIONSERVCOO5 :"Please provide Class Id",
    EXAMINATIONSERVCOO6 :"Exam date must be today\'s date or a future date"

};

exports.NOTICEBOARD = {
    NOTICESERVC000: "Something Went Wrong",
    NOTICESERVC001: "Notice Already Exist",
    NOTICESERVC002: "Notice Not Exist",
}

