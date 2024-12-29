exports.AUTH = {
    selectUser:
        "SELECT u.user_id, user_name, password, display_name, profile_picture_url, role_id, mobile_number, school_id, trust_id, email_id from m_users u left join m_user_mapping um on u.user_id = um.user_id WHERE user_name = $1 AND is_active = 1 AND is_deleted <> 1",
    selectRoleDetailsQueryByRoleId:
        "SELECT * FROM m_roles WHERE role_id = $1",
    getInvalidAttempts:
        "SELECT invalid_attempts from m_users WHERE user_name = $1",
    getMaxInvalidLoginAttempts:
        "SELECT max_invalid_attempts, password_expiry FROM password_complexity ORDER BY date_created DESC LIMIT 1",
    incrementInvalidAttempts:
        "UPDATE m_users SET invalid_attempts = invalid_attempts + 1 WHERE user_name = $1",
    setUserInactive:
        "UPDATE m_users SET account_locked = 1 WHERE user_name = $1",
    updateUserLoggedInOut:
        "UPDATE m_users SET is_logged_in = $1, last_logged_in_out=NOW() WHERE user_name = $2",
    getActiveAcademicYears: `SELECT academic_year_id, academic_year_name
    from m_academic_year 
    where school_id = $1 and status = 1
    and CURRENT_DATE between "start_date" and end_date`,
    getClassroomDetails: `  select mc.classroom_id, mc.class_id, mc.section_id 
    from m_classroom mc where mc.academic_year_id  = $1 and mc.class_teacher  = $2`,
    resetPasswordQuery: 'UPDATE m_users SET password = $1 WHERE mobile_number = $2',
    checkIsPhoneNumberExists:"SELECT * FROM m_users WHERE mobile_number = $1",

}

exports.CONFIG = {
    setApplicationConfig: "INSERT into m_config(key, value) values('APPCONFIG', $1) returning value;"
}