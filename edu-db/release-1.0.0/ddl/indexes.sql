CREATE INDEX idx_pincodes_district_id
ON m_pincodes (district_id);

-- 02-02-2024

CREATE INDEX idx_users_role_id
ON m_users (role_id);

CREATE INDEX idx_user_mapping_user_id
ON m_user_mapping (user_id);

CREATE INDEX idx_access_control_menu_id
ON access_control (menu_id);

CREATE INDEX idx_academic_year_school_id
ON m_academic_year (school_id);

CREATE INDEX idx_school_trust_id
ON m_school (trust_id);