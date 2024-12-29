DROP VIEW IF EXISTS vw_m_users;
CREATE OR REPLACE VIEW public.vw_m_users
 AS
 SELECT users.user_id, 	
    users.user_name,
    users.first_name,
    users.last_name,
    users.mobile_number,
    users.email_id,
    users.gender,
    TO_CHAR(users.date_of_birth, 'DD/MM/YYYY') AS date_of_birth,
    users.role_id,
    users.zip_code,
    users.date_created,
    users.date_modified,
    users.is_active,
    users.display_name,
    users.is_logged_in,
    TO_CHAR(users.last_logged_in_out + '05:30:00'::interval, 'DD-MON-YYYY HH12:MIPM'::text) AS last_logged_in_out,
    roles.role_name,
    roles.level AS user_level,
    um.trust_id,
    trust.trust_name,
    um.school_id,
    school.school_name,
	 users.profile_picture_url
   FROM m_users users
   LEFT OUTER JOIN m_user_mapping um ON users.user_id = um.user_id
   LEFT OUTER JOIN m_school school ON school.school_id = um.school_id
   LEFT OUTER JOIN m_trust trust ON trust.trust_id = um.trust_id
   LEFT OUTER JOIN m_roles roles ON users.role_id = roles.role_id;