CREATE TABLE public.access_control (
    role_id integer NOT NULL,
    menu_id integer NOT NULL,
    per_id integer NOT NULL,
    date_created timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    date_modified timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by integer,
    updated_by integer
);

CREATE TABLE public.m_app_version (
    app_id SERIAL PRIMARY KEY,
    app_version character varying(10),
    apk_version character varying(10),
    apk_link character varying(255),
    force_update smallint DEFAULT '1'::smallint,
    remarks character varying(255),
    release_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    date_created timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    date_modified timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE public.m_block (
    block_id SERIAL PRIMARY KEY,
    block_name character varying(100) NOT NULL,
    district_id integer NOT NULL,
    date_created timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE public.m_config (
    config_id SERIAL PRIMARY KEY,
    key character varying(50),
    value text,
    date_created timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    date_modified timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE public.m_district (
    district_id integer NOT NULL,
    district_name character varying(100) NOT NULL,
    state_id integer NOT NULL,
    date_created timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE public.m_menus (
    menu_id SERIAL PRIMARY KEY,
    menu_name character varying(100) NOT NULL,
    menu_description character varying(100) DEFAULT NULL::character varying,
    is_active smallint NOT NULL,
    parent_menu_id integer DEFAULT 0,
    menu_order integer DEFAULT 0,
    route_url character varying(100) DEFAULT NULL::character varying,
    icon_class character varying(100) DEFAULT NULL::character varying,
    date_created timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    date_modified timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE public.m_permissions (
    per_id SERIAL PRIMARY KEY,
    per_name character varying(100) NOT NULL
);

CREATE TABLE public.m_pincodes (
    circle_name character varying(100),
    region_name character varying(100),
    division_name character varying(100),
    office_name character varying(100),
    office_type character varying(100),
    pincode character varying(6),
    delivery character varying(100),
    state_id integer,
    state_name character varying(100),
    district_id integer,
    district_name character varying(100),
    latitude numeric(11,8),
    longitude numeric(11,8),
    date_created timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE public.m_roles (
    role_id SERIAL PRIMARY KEY,
    role_name character varying(100) NOT NULL,
    role_description character varying(100) DEFAULT NULL::character varying,
    is_active smallint NOT NULL,
    level character varying(100) NOT NULL,
    date_created timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    date_modified timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by integer,
    updated_by integer
);

CREATE TABLE public.m_state (
    state_id SERIAL PRIMARY KEY,
    state_name character varying(100) NOT NULL,
    country_id integer DEFAULT 1 NOT NULL,
    state_or_ut character varying(100),
    date_created timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE public.m_sub_district (
    sub_district_id SERIAL PRIMARY KEY,
    sub_district_name character varying(100) NOT NULL,
    district_id integer NOT NULL,
    date_created timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE public.m_user_mapping (
    user_id integer NOT NULL,
    trust_id integer,
    school_id integer,
    date_created timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    date_modified timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE public.m_users (
    user_id SERIAL PRIMARY KEY,
    user_name character varying(100) NOT NULL,
    display_name character varying(100),
    first_name character varying(100),
    last_name character varying(100),
    mobile_number bigint NOT NULL,
    email_id character varying(100),
    gender smallint,
    date_of_birth date,
    password character varying(100) NOT NULL,
    password_last_updated timestamp without time zone,
    invalid_attempts integer,
    address character varying(250),
    role_id integer NOT NULL,
    state_id integer,
    district_id integer,
    zip_code character varying(10),
    account_locked smallint NOT NULL,
    is_active smallint NOT NULL,
    profile_picture_url character varying(100),
    is_logged_in smallint,
    last_logged_in_out timestamp without time zone,
    is_deleted smallint DEFAULT 0,
    date_created timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    date_modified timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by integer,
    updated_by integer
);

CREATE TABLE public.m_users_history (
    id SERIAL PRIMARY KEY,
    user_id_parent integer,
    user_name character varying(100) NOT NULL,
    display_name character varying(100),
    first_name character varying(100),
    last_name character varying(100),
    mobile_number bigint NOT NULL,
    email_id character varying(100),
    gender smallint,
    date_of_birth date,
    password character varying(100) NOT NULL,
    password_last_updated timestamp without time zone,
    invalid_attempts integer,
    address character varying(250),
    role_id integer NOT NULL,
    state_id integer,
    district_id integer,
    zip_code character varying(10),
    account_locked smallint NOT NULL,
    is_active smallint NOT NULL,
    profile_picture_url character varying(100),
    is_logged_in smallint,
    last_logged_in_out timestamp without time zone,
    is_deleted smallint DEFAULT 0,
    date_created timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    date_modified timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by integer,
    updated_by integer
);

CREATE TABLE public.m_village (
    village_id SERIAL PRIMARY KEY,
    village_name character varying(100) NOT NULL,
    state_id integer NOT NULL,
    district_id integer NOT NULL,
    block_id integer NOT NULL,
    date_created timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE public.password_complexity (
    id SERIAL PRIMARY KEY,
    password_expiry smallint NOT NULL,
    password_history smallint NOT NULL,
    min_password_length smallint NOT NULL,
    complexity smallint,
    alphabetical smallint,
    "numeric" smallint,
    special_chars smallint,
    allowed_special_chars character varying(50) DEFAULT NULL::character varying,
    max_invalid_attempts integer NOT NULL,
    date_created timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    date_modified timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


-- 23-01-2024

CREATE TABLE public.m_academic_year (
    academic_year_id SERIAL PRIMARY KEY,
    academic_year_name character varying(100),
    school_id integer NOT NULL,
    "start_date" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    end_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "status" smallint,
    created_by integer,
    updated_by integer,
    date_created timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    date_modified timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE m_classroom_student (
    student_id SERIAL PRIMARY KEY,
    student_admission_id INT,
    classroom_id INT,
    roll_no INT,
    house_id INT,
    status INT DEFAULT 1,
    updated_by INT,
    created_by INT,
    date_created timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    date_modified timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE m_house (
    house_id SERIAL PRIMARY KEY,
    academic_year_id INT,
    house_name VARCHAR(50),
    house_description VARCHAR(255),
    status INT DEFAULT 1,
    date_created timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    date_modified timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by integer,
    updated_by integer
);

-- 27-01-2024

ALTER TABLE m_roles ADD COLUMN school_id INTEGER DEFAULT 0;


-- 28-01-2024

CREATE TABLE IF NOT EXISTS m_classroom_subject (
    class_subject_id SERIAL PRIMARY KEY,
    subject_id INTEGER,
    classroom_id INTEGER,
    teacher_id INTEGER,
    status INT DEFAULT 1,
    updated_by INTEGER,
    created_by INTEGER,
    date_created timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    date_modified timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 29-01-2024
CREATE TABLE m_parent (
    parent_id SERIAL PRIMARY KEY,
    school_id INT,
    parent_name VARCHAR(50),
    mobile_no BIGINT,
    email_id VARCHAR(50),
    dob DATE,
    gender INT,
    address VARCHAR(255),
    relationship_to_student VARCHAR(20),
    occupation VARCHAR(255),
    is_govt_employee INT,
    work_address VARCHAR(255),
    emergency_contact BIGINT,
    status INT DEFAULT 1,
    updated_by INT,
    created_by INT,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE m_student_registration (
    student_reg_id SERIAL PRIMARY KEY, 
    school_id INT, 
    first_name VARCHAR(30),
    middle_name VARCHAR(30),
    last_name VARCHAR(30),
    father_name VARCHAR(50),
    mother_name VARCHAR(50),
    class_id INT, 
    gender_id INT, 
    dob TIMESTAMP, 
    age INT,
    email_id VARCHAR(25),
    mobile_number BIGINT,
    alternate_mobile_number BIGINT,
    nationality VARCHAR(25),
    religion VARCHAR(25),
    caste_category VARCHAR(25),
    caste VARCHAR(25),
    current_address VARCHAR(300),
    current_address_state_id INT,
    current_address_district_id INT,
    current_address_city VARCHAR(50),
    current_address_block_id INT,
    current_address_pincode VARCHAR(10),
    permanent_address VARCHAR(300),
    permanent_address_state_id INT,
    permanent_address_district_id INT,
    permanent_address_city VARCHAR(50),
    permanent_address_block_id INT,
    permanent_address_pincode VARCHAR(10),
    blood_group VARCHAR(5),
    father_email VARCHAR(50),
    father_occupation VARCHAR(50),
    mother_email VARCHAR(50),
    mother_occupation VARCHAR(50),
    previous_school_name VARCHAR(50),
    previous_school_board VARCHAR(50),
    previous_class VARCHAR(50),
    previous_school_year INT,
    previous_class_percentage_grade VARCHAR(10),
    student_reg_number varchar(25),
    academic_session INT,
    mothertongue VARCHAR(25),
    status INT DEFAULT 1,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE m_section (
    section_id SERIAL PRIMARY KEY,
    school_id INT NOT NULL,
    section_name VARCHAR(255) NOT NULL,
    status INT DEFAULT 1,
    updated_by INT,
    created_by INT,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
    
CREATE TABLE m_classroom (
    classroom_id SERIAL PRIMARY KEY,
    academic_year_id INT,
    class_teacher INT,
    class_id INT,
    section_id INT,
    capacity INT,
    room_no VARCHAR(50),
    floor VARCHAR(50),
    building VARCHAR(255),
    projector_available INT,
    status INT DEFAULT 1,
    updated_by INT,
    created_by INT,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


--  added by jha(13-02-2024)


CREATE TABLE m_student_admission (
    student_admission_id SERIAL PRIMARY KEY,
	school_id INT,
    parent_id INT,
	student_reg_id int,
    student_admission_number VARCHAR(25),
    first_name VARCHAR(30),
    middle_name VARCHAR(30),
    last_name VARCHAR(30),
    gender_id INT,
    dob TIMESTAMP,
    age INT,
    email_id VARCHAR(25),
    mobile_number BIGINT,
    alternate_mobile_number BIGINT,
    blood_group VARCHAR(5),
    nationality VARCHAR(25),
    birth_certificate_no VARCHAR(20),
    aadhaar_no BIGINT,
    religion VARCHAR(25),
    caste_category VARCHAR(25),
    caste VARCHAR(25),
    father_name VARCHAR(50),
    father_email VARCHAR(50),
    father_occupation VARCHAR(50),
    mother_name VARCHAR(50),
    mother_email VARCHAR(50),
    mother_occupation VARCHAR(50),
    current_address VARCHAR(300),
    current_address_state_id INT,
    current_address_district_id INT,
    current_address_city VARCHAR(50),
	current_address_block_id INT,
    current_address_pincode VARCHAR(10),
    permanent_address VARCHAR(300),
    permanent_address_state_id INT,
    permanent_address_district_id INT,
    permanent_address_city VARCHAR(50),
	permanent_address_block_id INT,
    permanent_address_pincode VARCHAR(10),
    previous_school_name VARCHAR(50),
    previous_school_board VARCHAR(50),
    previous_class VARCHAR(50),
    previous_school_year INT,
    previous_class_percentage_grade VARCHAR(10),
    academic_session INT,
    admission_date TIMESTAMP,
    class_id INT,
    section_id INT,
    mothertongue VARCHAR(25),
    transport_opted BOOLEAN,
    status int,
    created_by int,
    updated_by int,
     date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE m_standard (
    std_id SERIAL PRIMARY KEY,
    std_name VARCHAR(30),
    abbr VARCHAR(10),
    category VARCHAR(50),
    status INT DEFAULT 1,
    updated_by INT,
    created_by INT
);

CREATE TABLE tr_exam_result (
    exam_result_id SERIAL PRIMARY KEY,
    exam_id INTEGER,
    subject_id INTEGER,
    student_id INTEGER,
    maximum_marks INT,
    passing_marks INT,
    marks_obtained INT,
    status INT,
    updated_by INT,
    created_by INT,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE m_transaction_mode (
   transaction_mode_id serial primary key,
   transaction_mode_name VARCHAR(30),
   status INT DEFAULT 1,
   updated_by INT,
   created_by INT
);


CREATE TABLE m_trust (
    trust_id SERIAL PRIMARY KEY,
    trust_name VARCHAR(100),
    contact_no VARCHAR(20),
    email VARCHAR(100),
    address VARCHAR(255),
    logo_url VARCHAR(255),
    status INT DEFAULT 1,
    updated_by INT,
    created_by INT,
    date_created timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    date_modified timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS public.m_school
(
    school_id SERIAL PRIMARY KEY,
    trust_id integer,
    school_name character varying(200),
    contact_no VARCHAR(20),
    address character varying(255),
    pincode character varying(6),
    block integer,
    district integer,
    state integer,
    email_id character varying(100),
    school_type character varying(20),
    school_motto character varying(255),
    logo_url character varying(255),
    status INT DEFAULT 1,
    updated_by integer,
    created_by integer,
    date_created timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_modified timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
	principal_name character varying(50),
    established_year integer,
    school_board character varying(50),
);

CREATE TABLE m_subject
(
    subject_id SERIAL PRIMARY KEY,
    school_id INT,
    subject_name VARCHAR(100),
    status INT DEFAULT 1,
    updated_by INT,
    created_by INT,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE m_examination (
	examination_id SERIAL PRIMARY KEY,
    class_id INT,
    academic_year_id INT,
    subject_id INT,
    description VARCHAR(255),
    exam_type_id INT ,
    exam_date DATE,
    duration INT
    total_marks INT,
    passing_marks INT,
    status INT,
    updated_by INT,
    created_by INT,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE m_examination
ALTER COLUMN exam_date TYPE DATE,
ALTER COLUMN duration TYPE INTEGER USING duration::integer
 

CREATE TABLE m_modules(
    module_id SERIAL PRIMARY KEY,
    module_name VARCHAR(100) NOT NULL,
    module_description VARCHAR(255),
    module_icon VARCHAR(100),
    module_route VARCHAR(100),
    module_order INT DEFAULT 1,
    status INT DEFAULT 1,
    updated_by INT,
    created_by INT,
    date_created TIMESTAMP,
    date_modified TIMESTAMP
);

CREATE TABLE IF NOT EXISTS m_exam_type(
	exam_type_id serial PRIMARY KEY,
	school_id INT ,
	exam_name VARCHAR(50),
	description VARCHAR (100),
	status INT,
	updated_by INT,
	created_by INT,
	date_created timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP ,
	date_updated timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE tr_attendance (
    attendance_id SERIAL PRIMARY KEY,
    student_id INT,
	classroom_id int,
    date DATE,
    attendance_status INT,
    remarks VARCHAR(100),
    status INT,
    updated_by INT,
    created_by INT,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE m_fees_type (
    fees_type_id serial primary key,
    school_id INT,
    fees_type VARCHAR(100),
    status INT,
    updated_by INT,
    created_by INT,
    date_created timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP ,
	date_modified timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE m_route_stop(
    route_stop_id SERIAL PRIMARY KEY,
    route_id INT,
    stop_name VARCHAR(100),
    lattitude FLOAT,
    longitude FLOAT,
    status INT,
    updated_by INT,
    created_by INT,
    date_created TIMESTAMP,
    date_modified TIMESTAMP
);


CREATE TABLE m_route (
    route_id SERIAL PRIMARY KEY,
    school_id INT,
    route_no VARCHAR(200),
    starting_point VARCHAR(100),
    ending_point VARCHAR(100),
    total_stops INT,
    distance INT,
    estimated_travel_time INT,
    status INT,
    updated_by INT,
    created_by INT,
    date_created TIMESTAMP,
    date_modified TIMESTAMP
);


CREATE TABLE m_fees_master (
    fees_master_id serial primary key,
    academic_year_id INT,
	school_id INT,
	class_id INT,
    fees_type_id INT,
	amount INT,
    status INT,
    updated_by INT,
    created_by INT,
    date_created timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP ,
	date_updated timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);




CREATE TABLE m_vehicle (
    vehicle_id SERIAL PRIMARY KEY,
    school_id INT,
    vehicle_code VARCHAR(100),
    vehicle_plate_number VARCHAR(100),
    vehicle_reg_number VARCHAR(100),
    chasis_number VARCHAR(100),
    vehicle_model VARCHAR(100),
    year_made INT,
    vehicle_type VARCHAR(100),
    capacity INT,
    status INT DEFAULT 1,
    updated_by INT,
    created_by INT,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE m_fees_discount (
    fees_discount_id serial primary key,
    school_id INT,
    fees_discount_name VARCHAR(100),
    discount INT,
    status INT,
    updated_by INT,
    created_by INT,
    date_created timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP ,
	date_updated timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE m_driver (
    driver_id SERIAL PRIMARY KEY,
    school_id INT,
    driver_name VARCHAR(100),
    dob date,
    gender int,
    mobile_number bigint,
    driving_licence VARCHAR(100),
    aadhaar_no VARCHAR(100),
    alternate_number bigint,
    address VARCHAR(255),
    status INT DEFAULT 1,
    updated_by INT,
    created_by INT,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
CREATE TABLE IF NOT EXISTS m_holiday(
	holiday_id serial PRIMARY KEY,
	school_id INT ,
	academic_year_id INT,
	holiday_date DATE,
	holiday_name VARCHAR(50),
	holiday_description VARCHAR (100),
	status INT DEFAULT 1,
	updated_by INT,
	created_by INT,
	date_created timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP ,
	date_updated timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE m_fees_config (
    fees_config_id SERIAL PRIMARY KEY,
    academic_year_id INT,
    student_admission_id INT,
    total_amount INT,
    class_id INT,
    is_discount INT DEFAULT 1,
    discount_amount INT,
    discount_note VARCHAR(255),
    status INT,
    updated_by INT,
    created_by INT,
    date_created TIMESTAMP,
    date_modified TIMESTAMP
);

CREATE TABLE m_fees_config_mapping (
    fees_config_map_id SERIAL PRIMARY KEY,
    fees_config_id INT,
    fees_master_id INT,
    amount INT,
    status INT,
    updated_by INT,
    created_by INT,
    date_created TIMESTAMP,
    date_modified TIMESTAMP
);

CREATE TABLE vehicle_driver_mapping (
    vhcl_dvr_map_id SERIAL PRIMARY KEY,
    driver_id INT,
    vehicle_id INT,
    status INT DEFAULT 1,
    updated_by INT,
    created_by INT,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE tr_transaction (
   transaction_id serial primary key,
   student_admission_id INT,
   class_id INT,
   fees_config_id INT,
   invoice_id VARCHAR(30),
   academic_year_id INT,
   total_amount INT,
   paying_amount INT,
   date TIMESTAMP,
   balance_amount INT,
   transaction_mode_id INT,
   status INT DEFAULT 1,
   updated_by INT,
   created_by INT,
   date_created timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP ,
   date_updated timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE tr_transaction
ADD COLUMN invoice_id VARCHAR(30);

CREATE TABLE m_assignment (
    assignment_id SERIAL PRIMARY KEY,
    classroom_id INT,
    subject_id INT,
    assignment_title VARCHAR(50),
    start_date DATE,
    end_date DATE,
    assignment_description VARCHAR(500),
    status INT DEFAULT 1,
    created_by INT,
    updated_by INT,
    date_created timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP ,
	date_updated timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE m_assignment_documents(
    a_d_id SERIAL PRIMARY KEY,
    assignment_id INT,
    classroom_id INT,
	assignment_document varchar(255),
    status INT DEFAULT 1,
    updated_by INT,
    created_by INT,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE m_student_admission_document (
    admission_document_id SERIAL PRIMARY KEY,
    student_admission_id INT,
    document_path VARCHAR(255),
    document_name VARCHAR(50),
	document_type varchar(50),
    status INT DEFAULT 1,
    created_by INT,
    updated_by INT,
    date_created timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP ,
	date_updated timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE m_reg_admission_mapping(
    reg_admission_mapping_id SERIAL PRIMARY KEY,
    student_reg_id INT,
    admission_id INT,
    status INT DEFAULT 1,
    updated_by INT,
    created_by INT,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE m_vehicle_document
(
    v_d_id SERIAL PRIMARY KEY,
    vehicle_id INT,
    vehicle_plate_number VARCHAR(100),
	registration_certificate varchar(100),
    status INT DEFAULT 1,
    updated_by INT,
    created_by INT,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tr_contact_us (
    contact_id SERIAL PRIMARY KEY,
    school_id INTEGER,
    name VARCHAR(30),
    email_address VARCHAR(50),
    mobile_number BIGINT,
    message VARCHAR(1000),
    status INT DEFAULT 1,
    created_by INT,
    updated_by INT,
    date_created timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP ,
	date_updated timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE m_access_key (
    access_key_id SERIAL PRIMARY KEY,
    school_id INT,
    access_key VARCHAR(100),
    client_name VARCHAR(255),
    status INT DEFAULT 1,
    updated_by INT,
    created_by INT,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE m_school_std_mapping (
    school_std_map_id SERIAL PRIMARY KEY,
    school_id INT,
     std_id INT,
    status INT DEFAULT 1,
    updated_by INT,
    created_by INT,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);





CREATE TABLE tr_classroom_reallocation_log (
    reallocation_id SERIAL PRIMARY KEY,
    student_id INT,
    student_admission_id INT,
    classroom_id INT,
    roll_no INT,
    house_id INT,
    prev_updated_by INT,
    prev_date_modified timestamp,
    status INT DEFAULT 1,
    created_by INT,
    updated_by INT,
    date_created timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    date_modified timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);



CREATE TABLE m_vehicle_route_mapping	 (
    vhcl_route_map_id SERIAL PRIMARY KEY,
    route_id INT,
     vehical_id INT,
     pickup_time time,
     drop_off_time time,
    status INT DEFAULT 1,
    updated_by INT,
    created_by INT,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE m_subject_suggestion (
    id SERIAL PRIMARY KEY,
    subject VARCHAR(55) NOT NULL,
    status INT DEFAULT 1,
    updated_by INT,
    created_by INT,
    date_created TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE m_template (
    template_id SERIAL PRIMARY KEY,
    template_name VARCHAR(255),
    template_type_id INT,
    description VARCHAR(255),
    status INT,
    updated_by INT,
    created_by INT,
    date_created TIMESTAMP,
    date_modified TIMESTAMP
);

CREATE TABLE m_template_type (
    template_type_id SERIAL PRIMARY KEY,
    template_type VARCHAR(255),
    status INT,
    updated_by INT,
    created_by INT,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


	CREATE TABLE m_template_config (
    config_id SERIAL PRIMARY KEY,
    school_id INT,
    template_id INT,
    school_name VARCHAR(255),
    school_address VARCHAR(255),
    contact_no VARCHAR(20),
    school_logo VARCHAR(255),
    signature VARCHAR(255),
    status INT,
    updated_by INT,
    created_by INT,
     date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE m_notice (
    notice_id SERIAL PRIMARY KEY,
    school_id int,
    notice_title VARCHAR(50),
    published_on timestamp,
    description VARCHAR(500),
    status INT DEFAULT 1,
    created_by INT,
    updated_by INT,
    date_created timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP ,
	date_updated timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE m_notice_document (
    notice_document_id SERIAL PRIMARY KEY,
	notice_id INT,
    document_name VARCHAR(255),
    document_path VARCHAR(500),
    status INT DEFAULT 1,
    created_by INT,
    updated_by INT,
    date_created timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP ,
	date_updated timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE m_notice_access (
    notice_Access_id SERIAL PRIMARY KEY,
	notice_id INT,
	role_list INT[],
    status INT DEFAULT 1,
    created_by INT,
    updated_by INT,
    date_created timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP ,
	date_updated timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE tr_exam_result (
    exam_result_id SERIAL PRIMARY KEY,
    examination_id INTEGER,
    subject_id INTEGER,
    student_id INTEGER,
    maximum_marks INT,
    passing_marks INT,
    marks_obtained INT,
    status INT,
    updated_by INT,
    created_by INT,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


