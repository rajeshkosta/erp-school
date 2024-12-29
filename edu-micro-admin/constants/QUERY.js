exports.ANDROIDAPP = {
    selectAppVersionQuery: "SELECT app_id, app_version, apk_version, apk_link, force_update, remarks, release_date from m_app_version ORDER BY release_date DESC LIMIT 1",
    selectAppVersionNumber: "SELECT apk_version FROM m_app_version ORDER BY release_date DESC LIMIT 1"
};

exports.ADMIN = {
    checkIfCityExist: "SELECT COUNT(city_id) as count FROM m_city WHERE city_name=$1 and district_id = $2 ",
    checkIfCityNameExist: "SELECT COUNT(city_id) as count FROM m_city WHERE city_name=$1 and district_id = $2 and city_id != $3 ",
    selectStateQuery: "SELECT state_id,state_name from m_state ORDER BY state_name asc",
    selectDistrictQuery: "SELECT district_id,district_name from m_district WHERE state_id = $1 ORDER BY district_name asc",
    selectBlockQuery: "SELECT block_id, block_name from m_block WHERE district_id = $1 ORDER BY block_name asc",
    selectVillageQuery: "SELECT village_id, village_name from m_village WHERE block_id = $1 ORDER BY village_name asc",
    selectCityQuery: "SELECT city_id,city_name from m_city  WHERE district_id= $1 ORDER BY city_name asc",
    updateStateQuery: "UPDATE m_state set state_name = $1, latitude = $2, longitude = $3, updated_by = $4, date_modified = NOW() where state_id = $5",
    updateDistrictQuery: "UPDATE m_district set district_name = $1, latitude = $2, longitude = $3, updated_by = $4, date_modified = NOW() where district_id = $5",
    updateCityQuery: "UPDATE m_city set city_name = $1, latitude = $2, longitude = $3, updated_by = $4, date_modified = NOW() where city_id = $5",
    selectCityDataQuery: `SELECT b.city_name AS name, b.latitude AS latitude, b.longitude AS longitude,b.city_id AS block_id,b.district_id AS district_id , d.state_id AS state_id FROM m_city b,m_district d WHERE b.district_id=d.district_id AND b.city_id = $1`,
    selectDistrictDataQuery: `SELECT d.district_name AS name, d.latitude AS latitude, d.longitude AS longitude,d.district_id AS district_id,d.state_id AS state FROM m_district d WHERE d.district_id = $1`,
    selectAllDistrictQuery: "SELECT state_id,district_id,district_name from m_district ORDER BY district_name asc",
    selectAllCityQuery: "SELECT city_id, city_name, district_id from m_city  ORDER BY city_name asc",
    checkIfUserExist: "SELECT COUNT(user_id) AS usercount from m_users WHERE user_name=$1",
    updateUserStatusQuery: "UPDATE m_users SET is_active = $1, date_modified=NOW() WHERE user_id = $2",
    insertUserQuery: `INSERT INTO public.m_users(
        user_name, first_name, last_name, display_name, mobile_number, password, role_id, created_by, account_locked, email_id, is_active, date_created)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 1, now()) returning user_id;`,
    selectConfigQuery: "SELECT c.key ,c.value FROM m_config c WHERE c.key=$1",
    selectStateDataQuery: "SELECT state_name, latitude,longitude,state_id AS state, country_id AS country FROM m_state WHERE state_id = $1",
    getPasswordComplexityQuery: "SELECT id, password_expiry, password_history, min_password_length, complexity, alphabetical, numeric, special_chars, allowed_special_chars, max_invalid_attempts FROM password_complexity",
    createPasswordComplexityQuery: `INSERT INTO password_complexity(password_expiry, password_history, min_password_length, complexity, alphabetical, "numeric", special_chars, allowed_special_chars, max_invalid_attempts, date_created, date_modified)
	                                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())`,
    updatePasswordComplexity: `UPDATE password_complexity
                                SET password_expiry=$1, password_history=$2, min_password_length=$3, complexity=$4, alphabetical=$5, "numeric"=$6, special_chars=$7, allowed_special_chars=$8, max_invalid_attempts=$9, date_modified=NOW()
                                WHERE id=$10`,
    getPasswordHistory: "SELECT password FROM m_users_history WHERE user_name = $1 ORDER BY id DESC LIMIT 3",
    selectProfileDtlsQuery: "SELECT m.user_id as user_id,m.profile_picture_url as profile_picture_url, m.user_name as username,m.display_name as display_name,m.gender AS gender,m.date_of_birth AS date_of_birth,m.mobile_number as mobile_number," +
        "m.facility_id AS facility_id,m.role_id as role_id, " +
        "m.state_id as state,m.district_id as district,m.block_id as block, m.password as currentPassword, m.password_last_updated as password_last_updated, m.invalid_attempts as invalid_attempts," +
        "m.date_created as date_created, m.is_active as is_active FROM m_users m WHERE m.user_id =$1",
    userStatistics: "SELECT COUNT(*) as totalUsers, sum(m_users.is_active=1) as activeUsers, (sum(m_users.is_active=1)/COUNT(*))*100 AS avgActiveUsers, sum(m_users.is_active=1 AND is_logged_in = 0) as notLoggedInActiveUsers, (sum(m_users.is_active=1 AND is_logged_in = 0)/COUNT(*))*100 AS avgNotLoggedInActiveUsers, sum(m_users.is_active=0) as deactiveUsers, (sum(m_users.is_active=0)/COUNT(*))*100 AS avgDeactiveUsers, sum(m_users.is_active=1 AND is_logged_in = 1) as loggedInActiveUsers, (sum(m_users.is_active=1 AND is_logged_in = 1)/COUNT(*))*100 AS avgLoggedInActiveUsers from m_users left join  m_roles on m_users.role_id = m_roles.role_id ",
    viewUserGrid: "select * from vw_m_users ",
    userById: "select * from vw_m_users WHERE user_id = $1",
    viewUserGridbyUpdatedate: "select * from vw_m_users where date_created >= NOW() - INTERVAL 1 DAY or date_modified >= NOW() - INTERVAL 1 DAY",
    updateUserQuery: "UPDATE m_users SET first_name = $1, last_name = $2, display_name = $3, is_active = $4, email_id = $5, updated_by = $6, date_modified = NOW() WHERE user_id = $7",
    viewLFGrid: "select * from vw_m_location_facility ",
    viewLFGridGetStateId: "select state_id from vw_m_location_facility",
    viewLFGridbyUpdatedate: "select * from vw_m_location_facility where date_created >= NOW() - INTERVAL 1 MINUTE or date_modified >= NOW() - INTERVAL 1 MINUTE;",
    insertIntoQuery: "INSERT INTO ",
    getUserMobileQuery: "SELECT count(*) FROM m_users WHERE user_id = $1 LIMIT 1",
    updateUserPasswordbyAdminQuery: "UPDATE m_users SET password=$1 WHERE user_id = $2",
    updateUserProfilePicQuery: "UPDATE m_users SET profile_picture_url=$1 WHERE user_id = $2",
    getUserProfilePicQuery: "SELECT profile_picture_url FROM m_users WHERE user_id = $1",
    getUserLocations: "select * from vw_m_location_facility where 1=1 ",
    getLocalitybyPincode: "select * from m_pincodes where pincode = $1",
    deleteUserFromUsersQuery: "update m_users set is_deleted = 1, date_modified = now() where mobile_number = $1 ",
    selectUser: "SELECT * from m_users WHERE user_name= $1 AND is_active = 1",
    checkIfRoleIsValid: "select count(*) as count from m_roles where role_id=$1",
    countUserGrid: "select count(*) as count from vw_m_users ",
    countLFGrid: "select count(*) as count from vw_m_location_facility ",
    insertUserMappingQuery: `INSERT INTO public.m_user_mapping(
        user_id, trust_id, school_id, date_created, date_modified)
        VALUES ($1, $2, $3, now(), now()) returning user_id;`,
    addPermissions: "INSERT INTO user_access_control(user_id,menu_id,per_id,date_created, created_by) values($1, $2, $3, now(), $4)",
    deletePermissions: "DELETE from user_access_control where user_id = $1",
    getSpecIDs: `select spec_id from m_user_speciality_mapping where user_id = $1`,
    updateUserMappingQuery: `UPDATE m_user_mapping SET reporting_to = $1, date_modified = now() where user_id = $2`,
    getUserHierarchy: `SELECT U.user_id as user_id,
                              U.profile_picture_url,
                              U.display_name as data ,
                              R.role_name as label, 
                              true AS expanded,
                              'person' AS type,
                              'ui-person' AS styleClass FROM m_users U
    INNER JOIN m_roles R ON U.role_id = R.role_id
    WHERE U.user_id= $1`,
    getUserHierarchyChild: `SELECT U.user_id as user_id,
                              U.profile_picture_url,
                              U.display_name as data ,
                              R.role_name as label, 
                              true AS expanded,
                              'person' AS type,
                              'ui-person' AS styleClass FROM m_users U
    INNER JOIN m_roles R ON U.role_id = R.role_id
    WHERE UM.reporting_to= $1`,
    getUserParent: `SELECT U.user_id as user_id,
                              UM.reporting_to
    FROM m_users U
    INNER JOIN m_user_mapping UM ON U.user_id = UM.user_id
    WHERE U.user_id= $1`,
    getPincodeByDistrictId: `select distinct pincode from m_pincodes where district_id = $1 order by pincode`
};

exports.ROLE = {
    selectRoleDetails: `SELECT role_id, initcap(role_name) as role_name, role_description, "level", is_active FROM m_roles where role_id != 1 and school_id = $1`,
    selectSpecificRoleDetails: "SELECT role_id, initcap(role_name) as role_name, role_description, level, is_active from m_roles where role_id = $1",
    selectSpecificMenuDetails: "SELECT menu_id, menu_name, menu_description, parent_menu_id, is_active from m_menus where menu_id = $1",
    checkRoleExist: "select COUNT(*) AS count from m_roles where upper(role_name) = upper($1) and school_id = $2",
    checkMenuExist: "select COUNT(*) AS count from m_menus where menu_name = $1",
    checkRoleNameExist: "select COUNT(*) AS count from m_roles where upper(role_name) = upper($1) and role_id != $2 and school_id = $3",
    insertRoleQuery: "INSERT INTO m_roles(role_name,role_description,level,is_active, school_id, created_by, updated_by) values($1, $2, $3, $4, $5, $6, $7) RETURNING role_id",
    insertMenuQuery: "INSERT INTO m_menus ",
    countActiveUsersQuery: "select COUNT(um.user_id) AS activeusers FROM m_user_mapping um inner join m_users u on um.user_id = u.user_id WHERE u.role_id = $1 and um.school_id = $2 AND u.is_active = 1 ",
    selectRoleStatusQuery: "SELECT is_active FROM m_roles WHERE role_id = $1 ",
    updateRoleQuery: "UPDATE m_roles SET role_name = $1, role_description = $2, is_active = $3, level = $4, updated_by = $5, date_modified = now()  WHERE role_id = $6",
    updateMenuQuery: "UPDATE m_menus SET menu_name = $1, menu_description = $2, is_active = $3 WHERE menu_id = $4",
    updateRoleStatusQuery: "update m_roles set is_active = $1, updated_by = $2, date_modified = now() where role_id = $3",
    getActiveRolesQuery: "SELECT role_id,initcap(role_name) as role_name, level from m_roles where is_active = 1 and role_id != 1 ",
    getRoleListBySchool: "SELECT role_id,initcap(role_name) as role_name, level from m_roles where school_id = $1 and is_active = 1 and level in ('NonFaculty', 'Vendor')  ORDER BY role_name asc",
    selectAllRolesQuery: "SELECT role_id,initcap(role_name) as role_name, level from m_roles where role_id != 1 ORDER BY role_name asc",
    getMenuList: `SELECT menu_id, menu_name as label, route_url as link, icon_class as icon, is_active, 'true' as initiallyOpened from m_menus where 1=1`,
    defaultAccessList: "select menu_id, menu_name, route_url,icon_class, per_id, per_name from m_menus cross join m_permissions where is_active = 1 order by parent_menu_id, menu_id, per_id;",
    addPermissions: "INSERT INTO access_control(role_id,menu_id,per_id,date_created, date_modified, created_by) values($1, $2, $3, now(), now(), 1)",
    deletePermissions: "DELETE from access_control where role_id = $1",
    getRoleAccessList: `SELECT mm.menu_id, 
                            mm.menu_name,
                            mm.route_url,
                            mm.icon_class,
                            sum(CASE WHEN (ac.per_id) = 1 THEN 1 ELSE 0 END) write_permission,
                            sum(CASE WHEN (ac.per_id) = 2 THEN 1 ELSE 0 END) read_permission,
                            (CASE WHEN sum(COALESCE(ac.per_id, 0)) > 0 THEN 1 ELSE 0 END) display_permission
                        FROM m_menus mm 
                        LEFT OUTER JOIN access_control ac ON mm.menu_id = ac.menu_id AND ac.role_id=$1
                        LEFT OUTER JOIN m_permissions mp ON ac.per_id = mp.per_id
                        WHERE mm.is_active=1
                        GROUP BY mm.menu_id, mm.menu_name, mm.route_url, mm.icon_class, mm.menu_order
                        ORDER BY mm.menu_order ASC`,

    getCombinedAccessList1: `SELECT mm.menu_id, 
                                    mm.menu_name,
                                    mm.route_url,
                                    mm.icon_class,
                                    sum(
                                        CASE 
                                            WHEN (ac.per_id) = 1 
                                            THEN 1 
                                            WHEN (uac.per_id) = 1
                                            THEN 1
                                            ELSE 0 
                                        END
                                    ) write_permission,
                                    sum(
                                        CASE 
                                            WHEN (ac.per_id) = 2 
                                            THEN 1 
                                            WHEN (uac.per_id) = 2
                                            THEN 1
                                            ELSE 0 
                                        END
                                    ) read_permission,
                                    (
                                        CASE 
                                            WHEN sum(COALESCE(ac.per_id, 0)) > 0 
                                            THEN 1 
                                            WHEN sum(COALESCE(uac.per_id, 0)) > 0
                                            THEN 1
                                            ELSE 0 
                                        END
                                    ) display_permission
                                FROM m_menus mm 
                                LEFT OUTER JOIN user_access_control uac ON mm.menu_id = uac.menu_id AND uac.user_id=$1
                                LEFT OUTER JOIN access_control ac ON mm.menu_id = ac.menu_id AND ac.role_id=$2
                                LEFT OUTER JOIN m_permissions mp ON ac.per_id = mp.per_id
                                LEFT OUTER JOIN m_permissions mp1 ON uac.per_id = mp1.per_id
                                WHERE mm.is_active=1
                                GROUP BY mm.menu_id, mm.menu_name, mm.route_url, mm.icon_class, mm.menu_order
                                ORDER BY mm.menu_order ASC`,

    getCombinedAccessList: `SELECT * FROM (
        SELECT M.menu_id, M.menu_name, M.route_url, M.icon_class,
            MD.module_id, MD.module_name, MD.module_icon, MD.module_route,MD.module_order, M.menu_order,
            SUM(CASE WHEN (ac.per_id) = 1 THEN 1 WHEN (uac.per_id) = 1 THEN 1 ELSE 0 END ) AS write_permission,
            SUM(CASE WHEN (ac.per_id) = 2 THEN 1 WHEN (uac.per_id) = 2 THEN 1 ELSE 0 END )  AS read_permission,
            (CASE WHEN sum(COALESCE(ac.per_id, 0)) > 0 THEN 1 WHEN sum(COALESCE(uac.per_id, 0)) > 0 THEN 1 ELSE 0 END) AS display_permission
        FROM m_menus M 
        LEFT JOIN m_modules MD ON MD.module_id = M.parent_menu_id 
        LEFT JOIN user_access_control UAC ON M.menu_id = UAC.menu_id AND UAC.user_id=$1
        LEFT JOIN access_control AC ON M.menu_id = AC.menu_id AND AC.role_id=$2
        LEFT JOIN m_permissions P ON AC.per_id = P.per_id
        LEFT JOIN m_permissions P2 ON UAC.per_id = P2.per_id
        WHERE M.is_active=1 
        GROUP BY M.menu_id, M.menu_name, M.route_url, M.icon_class, MD.module_id, 
        MD.module_name, MD.module_icon, MD.module_route, MD.module_order, M.menu_order
        ORDER BY MD.module_order, M.menu_order ASC
            ) T WHERE (write_permission =1 OR read_permission = 1 OR display_permission = 1) `
}

exports.USER = {
    getUserAccessControl: `SELECT mm.menu_id, 
                                mm.menu_name,
                                mm.route_url,
                                mm.icon_class,
                                sum(CASE WHEN (ac.per_id) = 1 THEN 1 ELSE 0 END) write_permission,
                                sum(CASE WHEN (ac.per_id) = 2 THEN 1 ELSE 0 END) read_permission,
                                (CASE WHEN sum(COALESCE(ac.per_id, 0)) > 0 THEN 1 ELSE 0 END) display_permission
                            FROM m_menus mm 
                            LEFT OUTER JOIN user_access_control ac ON mm.menu_id = ac.menu_id AND ac.user_id=$1
                            LEFT OUTER JOIN m_permissions mp ON ac.per_id = mp.per_id
                            WHERE mm.is_active=1
                            GROUP BY mm.menu_id
                            ORDER BY mm.menu_order ASC`,
    getUserCount: `SELECT COUNT(*) AS count FROM vw_m_users #WHERE_CLAUSE#`,
    getAllUsers: `SELECT user_id, display_name, mobile_number, role_name, user_level FROM vw_m_users #WHERE_CLAUSE# ORDER BY date_modified DESC #LIMIT_CLAUSE# #OFFSET_CLAUSE#;`,
    getUsersByRole: `select user_id, user_name, initcap(display_name) as display_name, mobile_number,
    initcap(role_name) as role_name  from vw_m_users 
    where school_id = $1 and role_id = $2 and is_active = 1;`
}

exports.LOCATION = {
    getDistrictMaster: "select district_id,district_name,state_id,latitude,longitude from m_district",
    getCityMaster: "select city_id,city_name,district_id,latitude,longitude from m_city",
    selectCountryQuery: "SELECT country_id, country_name from m_country ORDER BY country_name asc",
};

exports.LANGUAGE = {
    get_all_languages: 'SELECT * FROM m_languages WHERE status = 1'
}

exports.ACADEMIC_YEAR = {
    addAcademicYear: `INSERT INTO m_academic_year(academic_year_name, school_id, "start_date", end_date, "status", created_by)
    VALUES ($1, $2, $3, $4, 1, $5) RETURNING academic_year_id`,
    getActiveAcademicYears: `select academic_year_id, academic_year_name, TO_CHAR("start_date", 'DD-MM-YYYY') AS start_date, TO_CHAR(end_date, 'DD-MM-YYYY') as end_date, case when CURRENT_DATE between "start_date" and end_date then 1 else 0 end as current_academic_year from m_academic_year where school_id = $1 and status = 1  order by "start_date", end_date`,
    getAllAcademicYears: `select academic_year_id, academic_year_name, TO_CHAR("start_date", 'DD-MM-YYYY') AS start_date, TO_CHAR(end_date, 'DD-MM-YYYY') as end_date, status from m_academic_year where school_id = $1 order by "start_date", end_date`,
    getActiveAcademicYearsExceptId: `select count(academic_year_id) from m_academic_year where school_id = $1 and status = 1
    and ($2::DATE, $3::DATE) OVERLAPS (start_date, end_date) and academic_year_id != $4;`,
    academicYearOverlapsCheck: `select count(academic_year_id) from m_academic_year where school_id = $1 and status = 1
    and ($2::DATE, $3::DATE) OVERLAPS (start_date, end_date);`,
    upadteAcademicYear: `UPDATE m_academic_year SET `,
    countActiveClasses: `select count(academic_year_id) from m_classroom where academic_year_id = $1 and status = 1`,
    getAcademicYear: `select academic_year_id, academic_year_name, school_id, "start_date", end_date, "status" from m_academic_year where academic_year_id = $1`
};

exports.FEEDISCOUNT = {
    checkfeeDiscountExist: "select COUNT(*) AS count from m_fees_discount where school_id = $1 AND fees_discount_name = $2",
    createFeeDiscount: `INSERT INTO m_fees_discount(school_id, fees_discount_name,discount,status, updated_by, created_by,date_created,date_updated) values($1, $2, $3, $4, $5, $6 ,now(), now()) RETURNING fees_discount_id`,
    checkIfExistbyId: "select COUNT(*) AS count from m_fees_discount where fees_discount_id = $1",
    updateFeeMasterDetails: "UPDATE m_fees_discount SET ",
    getAllfeediscount: 'SELECT * FROM m_fees_discount WHERE school_id = $1 ORDER BY date_created DESC, date_updated DESC',
    getFeediscountById: 'SELECT * FROM m_fees_discount WHERE fees_discount_id = $1',
}

exports.FEE = {
    checkIfFeeTypeExist:`select count(*) from m_fees_type where school_id = $1 and upper(fees_type) = upper($2) and fees_type_id != $3`,
    insertFeeQuery: 'INSERT INTO m_fees_type (fees_type, status, updated_by, created_by,school_id,date_created,date_modified)  VALUES ($1, $2, $3, $4, $5, now(), now()) RETURNING fees_type_id ',
    checkIfExist: `SELECT COUNT(*) FROM m_fees_type WHERE school_id = $1 AND upper(fees_type) = upper($2)`,
    updateFee: "UPDATE m_fees_type SET ",
    getAllfees: 'SELECT * FROM m_fees_type WHERE school_id = $1 ORDER BY date_created DESC, date_modified DESC',
    getFeeTypeById: 'SELECT fees_type FROM m_fees_type WHERE fees_type_id = $1',
}

exports.FEEMASTER_BACKUP = { 
    checkIfExist: `SELECT COUNT(*) FROM m_fees_master WHERE academic_year_id = $1 AND fees_type_id = $2 AND class_id = $3`,
    insertFeeMasterQuery: 'INSERT INTO m_fees_master (class_id,academic_year_id,fees_type_id,amount, status, updated_by, created_by,school_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING fees_master_id ',
    getAllfeesMaster: 'SELECT fm.*,  ft.fees_type, ms.std_name AS class_name FROM  m_fees_master fm INNER JOIN m_fees_type ft ON fm.fees_type_id = ft.fees_type_id INNER JOIN m_standard ms ON fm.class_id = ms.std_id WHERE fm.class_id = $1 AND fm.academic_year_id = $2 AND fm.school_id = $3 ORDER BY fm.date_created DESC, fm.date_updated DESC;',
    getClassListByFeeConfig: ` select ms.std_id, ms.std_name from m_fees_master fm inner join m_standard ms on fm.class_id = ms.std_id where fm.academic_year_id = $1 group by ms.std_id `,
    getSpecificFeeMasterDetails: `SELECT * from m_fees_master WHERE fees_master_id = $1`,
    updateFeeMasterDetails: "UPDATE m_fees_master SET ",
    checkIfExistbyId: `SELECT COUNT(*) FROM m_fees_master WHERE class_id = $1 AND fees_master_id = $2`,

}

exports.TEMPLATE = {
    checkTamplateDetailsExistByConfigId: "select COUNT(*) AS count from m_template_config where config_id = $1",
    updateTamplate: " UPDATE m_template_config  SET template_id = $1, school_name = $2, school_address = $3,contact_no = $4,school_id = $5,title = $6, school_logo = $7, signature = $8, status = $9,updated_by = $10, date_modified=now() WHERE config_id = $11; ",
    createTemplate: `INSERT INTO m_template_config(template_id, school_name,school_address,contact_no, school_logo, school_id,title, signature, status,updated_by,created_by,date_created,date_modified) values($1, $2, $3, $4, $5, $6 ,$7 ,$8,$9,$10,$11, now(), now()) RETURNING config_id`,
    templateList: `
            SELECT template_id, template_name,template_type_id,description,status
            FROM m_template
             
            ORDER BY date_created`,

    gettemplateDetailsByconfigId: `SELECT
    config.config_id,
    config.school_id,
    config.template_id,
    config.school_name,
    config.school_address,
    config.contact_no,
    config.school_logo,
    config.signature,
    config.status,
    config.updated_by,
    config.created_by,
    config.date_created,
    config.date_modified,
    template.template_name,
    template_type.template_type
FROM
    m_template_config AS config
INNER JOIN
    m_template AS template ON config.template_id = template.template_id
INNER JOIN
    m_template_type AS template_type ON template.template_type_id = template_type.template_type_id
WHERE
    config.config_id = $1;
`,

}

exports.FEEMASTER = { 
    checkIfExist: `SELECT COUNT(*) FROM m_fees_master WHERE academic_year_id = $1 AND fees_type_id = $2`,
    insertFeeMasterQuery: 'INSERT INTO m_fees_master (academic_year_id,fees_type_id,amount, status, updated_by, created_by,school_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING fees_master_id ',
    getAllfeesMaster: 'SELECT fm.*,  ft.fees_type FROM  m_fees_master fm INNER JOIN m_fees_type ft ON fm.fees_type_id = ft.fees_type_id WHERE fm.academic_year_id = $1 AND fm.school_id = $2 ORDER BY fm.date_created DESC, fm.date_updated DESC;',
    getClassListByFeeConfig: ` select fees_master_id, feesacademic_year_id,fees_type_id,amount, status from m_fees_master where academic_year_id = $1`,
    getSpecificFeeMasterDetails: `SELECT * from m_fees_master WHERE fees_master_id = $1`,
    updateFeeMasterDetails: "UPDATE m_fees_master SET ",
    checkIfExistbyId: `SELECT COUNT(*) FROM m_fees_master WHERE academic_year_id = $1 AND fees_type_id = $2 and fees_master_id != $3`,

}


exports.SUBJECT = {
    insertSubjectQuery: `
      INSERT INTO m_subject (school_id,subject_name, status, updated_by, created_by)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `,

    checkIfExist: `SELECT COUNT(*) FROM m_subject WHERE school_id = $1 AND upper(subject_name) = upper($2)`,

    checkIfExistbyId: `SELECT COUNT(*) FROM m_subject WHERE school_id = $1 AND upper(subject_name) = upper($2) AND subject_id != $3`,
    getAllSubjectsQuery: 'SELECT subject_id, school_id, subject_name, status FROM m_subject where school_id = $1 ORDER BY date_created DESC, date_modified DESC',
    getAllActiveSubjects: 'SELECT subject_id, subject_name ,status FROM m_subject where school_id = $1;',

    getSubjectById: `
    SELECT subject_name
    FROM m_subject
    WHERE subject_id = $1;
`,

    updateSubjectNameQuery: `
      UPDATE m_subject SET subject_name = $2,updated_by = $3 WHERE subject_id = $1;
    `,

    getAllSubjectSuggestion: `SELECT subject from m_subject_suggestion `
};

exports.SECTION = {
    insertSectionQuery: `
        INSERT INTO m_section 
        (school_id, section_name, status,updated_by,created_by) 
        VALUES ($1, $2, $3, $4,$5) RETURNING *
    `,
    checkIfExistQuery: `
        SELECT COUNT(*) FROM m_section WHERE school_id = $1 AND section_name = $2
    `,

    getSectionByIdQuery: `
    SELECT * FROM m_section 
    WHERE section_id = $1
    `,

    checkIfExistbyId: `SELECT COUNT(*) FROM m_section WHERE school_id = $1 AND upper(section_name) = upper($2) AND section_id != $3`,


    updateSectionById: `
    UPDATE m_section 
SET 
    section_name = $1, 
    updated_by = $2
WHERE section_id = $3;
    
`,
    getAllSection: 'SELECT * FROM m_section WHERE school_id = $1 ORDER BY section_name',


};

exports.TRUST = {
    checkTrustExist: "select COUNT(*) AS count from m_trust where trust_name = $1",
    createTrust: `INSERT INTO m_trust(trust_name, contact_no,email,address, status,logo_url, created_by, updated_by) values($1, $2, $3, $4, $5, $6 ,$7 ,$8) RETURNING trust_id`,
    // updateTrust: `UPDATE m_trust SET trust_name=$2, contact_no=$3,logo_url=$4, email=$5, address=$6, status=$7 ,updated_by=$8 WHERE trust_id = $1`,
    getSpecificTrustDetails: `SELECT * from m_trust WHERE trust_id = $1 ORDER BY trust_name`,
    getAllTrustsCount: `SELECT COUNT(*) AS count FROM m_trust #WHERE_CLAUSE#`,
    getAllTrusts: `select trust_id, trust_name, contact_no, logo_url, email,address,status from m_trust #WHERE_CLAUSE# order by date_modified desc, date_created desc #LIMIT_CLAUSE# #OFFSET_CLAUSE#`,
    updateTrust: "UPDATE m_trust SET ",
    updateTrustLogo: "UPDATE m_trust set logo_url=$1, updated_by=$2, date_modified=now() where trust_id=$3",
    trustList: `
            SELECT trust_id, trust_name
            FROM m_trust
             
            ORDER BY trust_name
        `

}

exports.EXAMINATION = {
    checkExamTypeidExist: "select COUNT(*) AS count from m_examination where academic_year_id = $1 AND exam_type_id = $2 AND class_id = $3 AND subject_id = $4",
    createExamination: `INSERT INTO m_examination(class_id, academic_year_id, subject_id , description, exam_type_id, exam_date, duration, total_marks, passing_marks, status, created_by, updated_by,date_modified,date_created) values($1, $2, $3, $4, $5, $6 ,$7 ,$8, $9, $10, $11, $12, now(), now()) RETURNING examination_id`,
    updateExamination: "UPDATE m_examination SET ",
    getAllExaminationsCount: `SELECT COUNT(*) AS count FROM m_examination E  inner join m_classroom C on C.classroom_id = E.classroom_id
    inner join m_academic_year AC on AC.academic_year_id = C.academic_year_id
    inner join m_school S on S.school_id = AC.school_id
    left join m_subject SUB on SUB.subject_id = E.Subject_id
    left join m_standard STD on STD.std_id = C.class_id #WHERE_CLAUSE#`,
    checkExamTypeidExist1: "select COUNT(*) AS count from m_examination where academic_year_id = $1 and exam_type_id = $2 AND class_id = $3 AND subject_id = $4 AND examination_id != $5",
    getAllExaminations: `	select examination_id, E.classroom_id, E.subject_id,E.description, E.exam_type_id, E.exam_date
    , E.duration, E.total_marks, E.passing_marks, E.created_by, E.updated_by from m_examination E
    inner join m_classroom C on C.classroom_id = E.classroom_id
    inner join m_academic_year AC on AC.academic_year_id = C.academic_year_id
    inner join m_school S on S.school_id = AC.school_id
    left join m_subject SUB on SUB.subject_id = E.Subject_id
    left join m_standard STD on STD.std_id = C.class_id
     #WHERE_CLAUSE# order by exam_date desc #LIMIT_CLAUSE# #OFFSET_CLAUSE#`,
    getclassList: `select distinct E.class_id, S.std_id, S.std_name, S.abbr from m_examination E
    left join m_standard S on S.std_id = E.class_id
    where E.academic_year_id = $1 and E.status = 1
    order by S.std_id`,
    examListByClass: `
    select E.examination_id, E.academic_year_id, E.class_id, TO_CHAR(E.exam_date, 'DD/MM/YYYY') AS exam_date, (E.duration) AS duration, E.total_marks, E.passing_marks,
    ET.exam_type_id, ET.exam_name as exam_type,
    S.std_name, S.abbr,
    SUB.subject_id, SUB.subject_name from m_examination E
    left join m_standard S on S.std_id = E.class_id
    left join m_exam_type ET on ET.exam_type_id = E.exam_type_id
    left join m_subject SUB on SUB.subject_id = E.subject_id
    where E.academic_year_id = $1 and E.class_id = $2 and E.status = 1
    order by E.exam_date`,
    getByExaminationId: `
    select E.examination_id, E.academic_year_id, E.class_id, TO_CHAR(E.exam_date, 'DD/MM/YYYY') AS exam_date, E.description, (E.duration) AS duration, E.total_marks, E.passing_marks, E.status,
    ET.exam_type_id, ET.exam_name as exam_type,
    S.std_name, S.abbr,
    SUB.subject_id, SUB.subject_name from m_examination E
    left join m_standard S on S.std_id = E.class_id
    left join m_exam_type ET on ET.exam_type_id = E.exam_type_id
    left join m_subject SUB on SUB.subject_id = E.subject_id
    where E.examination_id = $1`,

}


exports.SCHOOL = {
    addSchool: `insert into m_school(trust_id, school_name, contact_no,address,pincode,block,district,state,email_id,school_board,school_type,school_motto,logo_url,status,updated_by,created_by,principal_name,established_year,date_created,date_modified)
    values($1, $2, $3, $4, $5, $6 ,$7 ,$8, $9, $10, $11, $12, $13, $14, $15,$16,$17,$18,now(),now() ) RETURNING school_id`,

    updateSchool: `update m_school set  contact_no=$2,school_name=$3,address=$4,pincode=$5,block=$6,district=$7,
    state=$8,email_id=$9,school_board=$10,school_type=$11,school_motto=$12,logo_url=$13,status=$14,updated_by=$15,principal_name=$16,established_year=$17,date_modified=now() where school_id=$1`,
    updateSchoolLogo: `update m_school set logo_url=$1, updated_by=$2, date_modified=now() where school_id=$3`,

    checkSchoolExist: `select count(*) from m_school where UPPER(school_name)=UPPER($1) and trust_id=$2`,

    checkSchoolId: `select count(*) from m_school where school_id=$1 and trust_id=$2`,

    getSpecificSchoolDetails: `select * from m_school where school_id=$1`,

    getAllSchool: `select school_id, school_name, contact_no, logo_url, email_id,address,status,principal_name,established_year from m_school #WHERE_CLAUSE# ORDER BY date_modified #LIMIT_CLAUSE# #OFFSET_CLAUSE#`,
    getAllSchoolCount: `SELECT COUNT(*) AS count FROM m_school #WHERE_CLAUSE#`,
    schoolListBasedOnTrust: `select school_id, school_name from m_school where trust_id=$1`,

    getStdMappingDetails:`select st.std_id as id,st.std_name as name,st.abbr,st.category from m_school_std_mapping sm
     inner join m_standard st on sm.std_id=st.std_id where sm.school_id=$1`,

     getStdList:`select st.std_id as id,st.std_name as name,st.abbr,st.category from m_standard st`



}

exports.EXAM = {

    insertExamQuery: `insert into m_exam_type(exam_name,school_id,status,created_by,updated_by)
    values($1, $2, $3,$4,$5)  RETURNING exam_type_id`,
    checkIfExamTypeIdExists: `select count(*) from m_exam_type where exam_type_id = $1`,
    checkIfExamExist: `select count(*) from m_exam_type where school_id=$1 AND UPPER(exam_name)=UPPER($2) AND exam_type_id = $3`,
    checkIfExamDetailsExist: `select count(*) from m_exam_type where school_id=$1 AND UPPER(exam_name)=UPPER($2)`,
    getAllExamQuery: `select * from m_exam_type where school_id = $1`,
    getExamByIdQuery: `select * from m_exam_type where exam_type_id = $1`,
    updateExamQuery: " UPDATE m_exam_type SET exam_name = $1 where exam_type_id = $2",
    getActiveExamQuery: "select * from m_exam_type where status = 1 AND school_id = $1"

}

exports.CONTACTFORM = {
    insertContactFormQuery:`insert into tr_contact_us(school_id,name,email_address,mobile_number,message) values($1, $2, $3,$4,$5)  RETURNING contact_id`,
    getContactFormCount: "SELECT COUNT(*) AS count FROM tr_contact_us #WHERE_CLAUSE#",
    getContactFormByIdQuery:"SELECT * FROM tr_contact_us WHERE contact_id = $1",
    checkContactIdQuery:"SELECT COUNT(*) FROM tr_contact_us WHERE contact_id = $1",
    getSchoolAccessDetails:"select school_id from m_access_key where access_key=$1",
    checkAccessKey:"SELECT COUNT(*) AS count FROM m_access_key where access_key=$1"

}

exports.EXAMRESULT = {
    createExamResult: 'INSERT INTO tr_exam_result (examination_id,subject_id,student_id, maximum_marks, passing_marks, marks_obtained,status,created_by,updated_by) VALUES ($1, $2, $3, $4, $5, $6, $7,$8,$9) RETURNING exam_result_id ',
    checkExamResultsExistByExamResultId: "select COUNT(*) AS count from tr_exam_result where exam_result_id = $1",
}

exports.NOTICE ={
    insertNoticeBoard:`INSERT INTO m_notice(school_id,notice_title,published_on,description,created_by,updated_by) values($1,$2,$3,$4,$5,$6) RETURNING notice_id`,
    addNoticeDocument:`INSERT INTO m_notice_document(notice_id,document_name,document_path,created_by,updated_by) values($1,$2,$3,$4,$5)`,
    checkNoticeExist:`SELECT COUNT(*) FROM m_notice WHERE notice_title = $1`,
    checkNoticeIDExist:`SELECT COUNT(*) FROM m_notice WHERE notice_id = $1`,
    getNoticeById:`SELECT mn.notice_id,mn.school_id,mn.notice_title,mn.published_on,
    mn.description,mn.status,mnd.document_path
    FROM m_notice mn
    INNER JOIN m_notice_document mnd ON mnd.notice_id = mn.notice_id 
    WHERE mn.notice_id = $1`,
    getNoticeDocById:`SELECT * FROM m_notice_document where notice_id = $1`,
    getNoticeCount:`select count(*) from m_notice #WHERE_CLAUSE#`,
    getAllNotice:`SELECT * FROM m_notice #WHERE_CLAUSE# ORDER BY date_updated DESC #LIMIT_CLAUSE# #OFFSET_CLAUSE#`,
    checkNoticeDoc:`SELECT COUNT(document_path) FROM m_notice_document where notice_id = $1 `,
    updatedNoticeDocument:`UPDATE m_notice_document
    SET document_name = $2, document_path = $3
    WHERE notice_id = $1`,
    updateNotice:`UPDATE m_notice SET`,
    addNoticeDocumentIfNot:`INSERT INTO m_notice_document (notice_id,document_name,document_path) values ($1,$2,$3)`,
    isUpdateNotExistWithId:`select count(*) from m_notice where notice_id = $1 and notice_title = $2`,
    isUpdateNotExist:`select count(*) from m_notice where notice_title = $1`,
    getNoticeDocDetails:`SELECT * FROM m_notice_document WHERE notice_id = $1`,
    roleAccessInsert:`Insert into m_notice_access (notice_id,role_list,created_by,updated_by) values($1,$2,$3,$4)`,
    getNoticeAccDetails:`select mn.notice_title, mn.published_on,mn.description,mn.notice_id
    from m_notice mn
    inner join m_notice_access mna on mna.notice_id = mn.notice_id
    where  $1 = ANY(mna.role_list) AND mn.school_id = $2 AND DATE(mn.published_on) = CURRENT_DATE`


    
    
}

exports.ASSIGNMARKS = {
    getAssignMarksOfStudent: `SELECT * FROM tr_exam_result WHERE student_id = $1 AND examination_id =$2`,
    getAllAssignMarks:`SELECT  msa.student_admission_id, CONCAT_WS(' ', msa.first_name, msa.middle_name, msa.last_name) AS fullName,
    msa.father_name, msa.mobile_number, me.examination_id,me.subject_id,me.exam_type_id,msa.class_id,mc.section_id
FROM 
    m_student_admission msa
INNER JOIN 
    m_examination me ON me.class_id = msa.class_id
INNER JOIN 
    m_classroom mc ON mc.academic_year_id = me.academic_year_id 
    AND mc.class_id = msa.class_id 
INNER JOIN 
    m_academic_year ay ON ay.academic_year_id = me.academic_year_id

 #WHERE_CLAUSE# ORDER BY msa.date_modified DESC #LIMIT_CLAUSE# #OFFSET_CLAUSE#`,
 
    getAllAssignMarksCount:`select count(*) from m_student_admission msa
    inner join m_examination me on me.class_id = msa.class_id
    inner join m_academic_year ay on ay.academic_year_id = me.academic_year_id
    #WHERE_CLAUSE#`
}
