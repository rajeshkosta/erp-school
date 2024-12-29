exports.USER = {
    verifyMobile:
        "SELECT COUNT(m.mobile_number) as count FROM m_users m WHERE m.mobile_number=$1 AND m.is_active=1",
    selectConfigQuery: "SELECT c.key ,c.value FROM m_config c WHERE c.key=$1",
    selectProfileDtlsbyMobQuery: "SELECT m.user_id as user_id,m.display_name as display_name,m.gender AS gender,m.date_of_birth AS date_of_birth,m.is_active as is_active,password as current_password FROM m_users m WHERE m.mobile_number=$1 and m.is_active=1",
    updateUserPwdQuery:
        "UPDATE m_users SET password=$1, password_last_updated=NOW() WHERE user_id = $2 AND is_active=1",
    selectUser: `SELECT U.user_id AS user_id,
                        U.user_name AS user_name,
                        TO_CHAR(U.date_of_birth, 'DD/MM/YYYY') AS date_of_birth,
                        U.gender AS gender,
                        U.email_id AS email_id,
                        U.first_name AS first_name,
                        U.last_name AS last_name,
                        U.mobile_number AS mobile_number,
                        U.display_name AS display_name,
                        R.role_id AS role,
                        R.role_name AS role_name, 
                        U.is_active AS is_active,
                        U.account_locked AS account_locked,
                        U.profile_picture_url
                    FROM m_users U 
                    LEFT OUTER JOIN m_user_mapping UM ON U.user_id = UM.user_id
                    LEFT OUTER JOIN m_roles R ON U.role_id = R.role_id
                    WHERE U.user_name= $1 AND U.is_active=1`,
    selectUserToUpdateMobileNumber: `SELECT U.user_id AS user_id,
                    U.user_name AS user_name,
                    TO_CHAR(U.date_of_birth, 'DD/MM/YYYY') AS date_of_birth,
                    U.gender AS gender,
                    U.email_id AS email_id,
                    U.first_name AS first_name,
                    U.last_name AS last_name,
                    U.mobile_number AS mobile_number,
                    U.display_name AS display_name,
                    R.role_id AS role_id,
                    U.password AS password, 
                    U.is_active AS is_active,
                    U.account_locked AS account_locked,
                    U.profile_picture_url
                FROM m_users U 
                LEFT OUTER JOIN m_user_mapping UM ON U.user_id = UM.user_id
                LEFT OUTER JOIN m_roles R ON U.role_id = R.role_id
                WHERE U.user_name= $1 AND U.is_active=1`,
    updateUsername:
        "UPDATE m_users SET user_name=$1, mobile_number=$2, date_modified=NOW() WHERE user_name=$3",
    insertUserHistoryQuery: "INSERT INTO m_users_history ",
    updateUserQuery: "UPDATE m_users SET ",
    checkIfUserExist:
        "SELECT COUNT(user_id) AS usercount from m_users WHERE user_name=$1",
    selectProfileDtlsQuery:
        "SELECT m.user_id as user_id,m.profile_picture_url as profile_picture_url, m.user_name as user_name,m.display_name as display_name,m.gender AS gender,m.date_of_birth AS date_of_birth,m.mobile_number as mobile_number," +
        "m.role_id as role_id, " +
        "m.state_id as state,m.district_id as district, m.password as current_password," +
        "m.date_created as date_created, m.is_active as isActive FROM m_users m WHERE m.user_id =$1",
    setPasswordHistory:"INSERT INTO m_users_history ",
    getUserPermissions: `select role_id, menu_id, per_id from access_control where role_id = $1
        union all
        select $2 as role_id, menu_id, per_id from user_access_control where user_id = $3`,
    updateUserQuery: "UPDATE m_users SET ",
    checkIfUserIdExist: "SELECT EXISTS (SELECT 1 FROM m_users WHERE user_id = $1)",
    getUserStatus: 'SELECT is_active FROM m_users WHERE user_id = $1',
    getUpdateUserStatus:'UPDATE m_users SET is_active = $1, date_modified = now() WHERE user_id = $2',

}

exports.ACADEMIC_YEAR = {
    getActiveAcademicYears: `select academic_year_id, academic_year_name, case when CURRENT_DATE between "start_date" and end_date then 1 else 0 end as current_academic_year from m_academic_year where school_id = $1 and status = 1`
};

exports.LOGO = {
    getTrustLogoUrl: `select logo_url from m_trust where trust_id = $1`,
    getSchoolLogoUrl: `select logo_url from m_school where school_id = $1`,
};