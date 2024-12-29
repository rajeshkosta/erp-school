INSERT INTO m_roles (role_id,role_name,role_description,is_active,level,date_created,date_modified,school_id) 
VALUES (1,'Super Admin','Super Admin',1,'Admin','2020-10-05 16:48:32','2020-10-05 16:48:32',0),
(2,'Trustee','Trustee',1,'Trust','2020-10-05 16:48:32','2020-10-05 16:48:32',0),
(3,'School Administrator','School Administrator',1,'School','2020-10-05 16:48:32','2020-10-05 16:48:32',0);

INSERT INTO m_users VALUES
(1,1234567890,'Super Admin',NULL,NULL,1234567890,NULL,1,'2020-11-12T18:30:00.000Z','$2a$10$33gc5zgFfOOKt8Kr5wbPJOYCpq9jWrExEIbw3nw0CuQVf99pdJ0n6','2020-10-30 13:53:57',NULL,NULL,1,NULL,NULL,NULL,0,1,NULL,NULL,NULL,0,'2021-07-19 14:24:45.441688','2021-07-19 19:25:26.87891',NULL,NULL);

INSERT INTO password_complexity VALUES
(1,0,1,5,0,0,0,0,'!@#$&*',100,'2020-10-14 15:03:22','2020-12-29 03:29:22');

INSERT INTO public.m_user_mapping(user_id, date_created, date_modified) VALUES
(1, now(), now());

INSERT INTO public.m_app_version(
	app_id, app_version, apk_version, apk_link, force_update, remarks, release_date, date_created, date_modified)
	VALUES (1, '1.0.0', '1.0', 'edu.apk', 1, 'new', now(), now(), now());

INSERT INTO public.m_permissions(per_id, per_name) VALUES
(1, 'Write');

INSERT INTO public.m_permissions(per_id, per_name) VALUES
(2, 'Read');


INSERT INTO public.m_menus(
	menu_id, menu_name, menu_description, is_active, parent_menu_id, menu_order, route_url, icon_class, date_created, date_modified)
	VALUES (1, 'Dashboard', 'Admin Dashboard', 1, NULL, 0, '/dashboard', 'custom-admin-dashboard', NOW(), NOW()),
		   (2, 'User Management', 'Admin User Management', 1, NULL, 1, '/usermanagement', 'custom-admin-user', NOW(), NOW()),
		   (3, 'Role Management', 'Admin Role Management', 1, NULL, 2, '/rolemanagement', 'custom-admin-roles', NOW(), NOW()),
		   (4, 'Organization', 'Organization', 1, NULL, 3, '/organizationmanagement', 'custom-admin-dashboard', NOW(), NOW()),
		   (5, 'School', 'School', 1, NULL, 4, '/school', 'custom-admin-dashboard', NOW(), NOW()),
		   (6, 'Subject', 'Subject Management', 1, NULL, 5, '/subjectmanagement', 'custom-admin-dashboard', NOW(), NOW());
	
INSERT INTO public.access_control(
	role_id, menu_id, per_id, date_created, date_modified, created_by, updated_by)
	VALUES (1, 1, 1, NOW(), NOW(), 1, 1),
	       (1, 1, 2, NOW(), NOW(), 1, 1),
		   (1, 2, 1, NOW(), NOW(), 1, 1),
	       (1, 2, 2, NOW(), NOW(), 1, 1),
		   (1, 4, 1, NOW(), NOW(), 1, 1),
	       (1, 4, 2, NOW(), NOW(), 1, 1),
		   (2, 1, 1, NOW(), NOW(), 1, 1),
	       (2, 1, 2, NOW(), NOW(), 1, 1),
		   (2, 2, 1, NOW(), NOW(), 1, 1),
	       (2, 2, 2, NOW(), NOW(), 1, 1),
		   (2, 5, 1, NOW(), NOW(), 1, 1),
	       (2, 5, 2, NOW(), NOW(), 1, 1),
		   (3, 1, 1, NOW(), NOW(), 1, 1),
			(3, 1, 2, NOW(), NOW(), 1, 1),
			(3, 2, 1, NOW(), NOW(), 1, 1),
			(3, 2, 2, NOW(), NOW(), 1, 1),
			(3, 3, 1, NOW(), NOW(), 1, 1),
			(3, 3, 2, NOW(), NOW(), 1, 1),
			(3, 6, 1, NOW(), NOW(), 1, 1),
			(3, 6, 2, NOW(), NOW(), 1, 1),
			(3, 7, 1, NOW(), NOW(), 1, 1),
			(3, 7, 2, NOW(), NOW(), 1, 1),
			(3, 8, 1, NOW(), NOW(), 1, 1),
			(3, 8, 2, NOW(), NOW(), 1, 1),
			(3, 9, 1, NOW(), NOW(), 1, 1),
			(3, 9, 2, NOW(), NOW(), 1, 1),
			(3, 10, 1, NOW(), NOW(), 1, 1),
			(3, 10, 2, NOW(), NOW(), 1, 1),
			(3, 11, 1, NOW(), NOW(), 1, 1),
			(3, 11, 2, NOW(), NOW(), 1, 1),
			(3, 12, 1, NOW(), NOW(), 1, 1),
			(3, 12, 2, NOW(), NOW(), 1, 1),
			(3, 13, 1, NOW(), NOW(), 1, 1),
			(3, 13, 2, NOW(), NOW(), 1, 1),
			(3, 14, 1, NOW(), NOW(), 1, 1),
			(3, 14, 2, NOW(), NOW(), 1, 1),
			(3, 16, 1, NOW(), NOW(), 1, 1),
			(3, 16, 2, NOW(), NOW(), 1, 1),
			(3, 17, 2, NOW(), NOW(), 1, 1),
			(3, 17, 1, NOW(), NOW(), 1, 1),
			(3, 18, 2, NOW(), NOW(), 1, 1),
			(3, 18, 1, NOW(), NOW(), 1, 1),
			(3, 19, 1, NOW(), NOW(), 1, 1),
			(3, 19, 2, NOW(), NOW(), 1, 1),
			(3, 21, 2, NOW(), NOW(), 1, 1),
			(3, 21, 1, NOW(), NOW(), 1, 1),
			(3, 22, 1, NOW(), NOW(), 1, 1),
			(3, 22, 2, NOW(), NOW(), 1, 1);



		   
alter table m_school add principal_name varchar(50),add established_year int,add school_board varchar(50);


alter table m_school alter column contact_no type varchar(50)
alter table m_trust alter column contact_no type varchar(50)


-- 02-02-2024

INSERT INTO public.m_menus(
	menu_id, menu_name, menu_description, is_active, parent_menu_id, menu_order, route_url, icon_class, date_created, date_modified)
	VALUES (8, 'Classs', 'Class', 1, NULL, 7, '/class', 'icon_class', NOW(), NOW());

INSERT INTO public.m_menus(
	menu_id, menu_name, menu_description, is_active, parent_menu_id, menu_order, route_url, icon_class, date_created, date_modified)
	VALUES (7, 'Academic Year', 'Academic Year', 1, NULL, 4, '/academicyear', 'icon_academic_year', NOW(), NOW());

INSERT INTO public.m_menus(
	menu_id, menu_name, menu_description, is_active, parent_menu_id, menu_order, route_url, icon_class, date_created, date_modified)
	VALUES (9, 'Student', 'Student', 1, NULL, 8, '/student', 'icon_student', NOW(), NOW()),
		   (10, 'Exam', 'Exam', 1, NULL, 9, '/exam', 'icon_exam', NOW(), NOW());

INSERT INTO public.m_menus(
	menu_id, menu_name, menu_description, is_active, parent_menu_id, menu_order, route_url, icon_class, date_created, date_modified)
	VALUES (11, 'Section/Division', 'Section/Division', 1, NULL, 6, '/section', 'icon_class', NOW(), NOW());

INSERT INTO public.m_menus(
	menu_id, menu_name, menu_description, is_active, parent_menu_id, menu_order, route_url, icon_class, date_created, date_modified)
	VALUES (12, 'Fee Type', 'Fee Type', 1, 8, 9, '/feeType', 'icon_fees', NOW(), NOW());

-- 11-02-2024
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

INSERT INTO m_modules (module_name, module_icon) VALUES ('Dashboard', 'icon_dashboard');
INSERT INTO m_modules (module_name, module_icon) VALUES ('Role Management', 'icon_roles');
INSERT INTO m_modules (module_name, module_icon) VALUES ('User Management', 'icon_users');
INSERT INTO m_modules (module_name, module_icon) VALUES ('Organization', 'icon_organization');
INSERT INTO m_modules (module_name, module_icon) VALUES ('Academic Configuraion', 'icon_organization');
INSERT INTO m_modules (module_name, module_icon) VALUES ('School', 'icon_school');
INSERT INTO m_modules (module_name, module_icon) VALUES ('Class Configuration', 'icon_class');
INSERT INTO m_modules (module_name, module_icon) VALUES ('Fee Configuration', 'icon_fees');
INSERT INTO m_modules (module_name, module_icon) VALUES ('Students', 'icon_student');
INSERT INTO m_modules (module_name, module_icon) VALUES ('Exam Configuration', 'icon_exam');
INSERT INTO m_modules (module_name, module_icon) VALUES ('Certificates', 'icon_certificates');
INSERT INTO m_modules (module_name, module_icon) VALUES ('Transports', 'icon_transports');
INSERT INTO m_modules (module_name, module_icon) VALUES ('Notifications', 'icon_notifications');

---- 12-02-23

INSERT INTO public.m_menus(
	menu_id, menu_name, menu_description, is_active, parent_menu_id, menu_order, route_url, icon_class, date_created, date_modified)
	VALUES (13, 'Fee Master', 'Fee Master', 1, 8, 11, '/feeMaster', 'icon_fees', NOW(), NOW());

INSERT INTO public.m_menus(
	menu_id, menu_name, menu_description, is_active, parent_menu_id, menu_order, route_url, icon_class, date_created, date_modified)
	VALUES (14, 'Exam Type', 'Exam Type', 1, 10, 12, '/examtype', 'icon_exam', NOW(), NOW());

--- 13-02-23
-- INSERT INTO public.m_menus(
-- 	menu_id, menu_name, menu_description, is_active, parent_menu_id, menu_order, route_url, icon_class, date_created, date_modified)
-- 	VALUES (15, 'Fee Discount', 'Fee Discount', 1, 8, 12, '/feeDiscount', 'icon_fees', NOW(), NOW());
---14-02-23
INSERT INTO public.m_menus(
	menu_id, menu_name, menu_description, is_active, parent_menu_id, menu_order, route_url, icon_class, date_created, date_modified)
	VALUES (16, 'Student Allocation', 'tudent Allocation', 1, 7, 13, '/studentAllocation', 'icon_user', NOW(), NOW());

---15-02-23
INSERT INTO m_modules (module_name, module_icon) VALUES ('Assignment', 'icon_assignment');

INSERT INTO public.m_menus(
	menu_id, menu_name, menu_description, is_active, parent_menu_id, menu_order, route_url, icon_class, date_created, date_modified)
	VALUES (17, 'Assignment', 'Assignment', 1, 14, 14, '/assignment', 'icon_assignment', NOW(), NOW());


---17-02-23
INSERT INTO public.m_menus(
	menu_id, menu_name, menu_description, is_active, parent_menu_id, menu_order, route_url, icon_class, date_created, date_modified)
	VALUES (18, 'Attendance', 'Attendance', 1, 9, 18, '/attendance', 'icon_attendance', NOW(), NOW());

---21-02-23
INSERT INTO m_modules (module_name, module_icon) VALUES ('Transport Configuration', 'icon_transport');

INSERT INTO public.m_menus(
	menu_id, menu_name, menu_description, is_active, parent_menu_id, menu_order, route_url, icon_class, date_created, date_modified)
	-- VALUES (20, 'Driver Management', 'Driver Management', 1, 16, 20, '/driver', 'icon_driver', NOW(), NOW()),
	 (22, 'Vehicle Management', 'Vehicle Management', 1, 16, 22, '/vehicle', 'icon_driver', NOW(), NOW()),
	VALUES (21, 'Route Management', 'Route Management', 1, 16, 21, '/route', 'icon_driver', NOW(), NOW());


-- 26-02-2024 (by jha)
insert into m_access_key (school_id,access_key) values
(1,'53a167ef99b474262c6')

--- 05/03/2024 by umar 
INSERT INTO m_subject_suggestion (subject) VALUES
('Mathematics'),
('Science'),
('English'),
('History'),
('Geography'),
('Computer Science'),
('Physics'),
('Chemistry'),
('Biology'),
('Art'),
('Music'),
('Physical Education');

-- 06-03-2024
INSERT INTO m_modules (module_name, module_icon) VALUES ('Notice Board', 'icon_notice');
INSERT INTO public.m_menus(
	menu_id, menu_name, menu_description, is_active, parent_menu_id, menu_order, route_url, icon_class, date_created, date_modified)
	VALUES (23, 'Notice Board', 'Notice Board', 1, 17, 23, '/noticeboard', 'icon_notice', NOW(), NOW());

INSERT INTO public.access_control(
	role_id, menu_id, per_id, date_created, date_modified, created_by, updated_by)
	VALUES (3, 23, 1, NOW(), NOW(), 1, 1),
	 (3, 23, 2, NOW(), NOW(), 1, 1);

INSERT INTO m_template (template_name, template_type_id, description, status, updated_by, created_by, date_created, date_modified) 
VALUES 
('Template1', 1, 'Template1 stands for ID CARD', 1, 3, 3, '2024-03-06 10:00:00', '2024-03-06 10:00:00'),
('Template2', 2, 'Template2 stands for REPORT CARD', 1, 3, 3, '2024-03-06 11:00:00', '2024-03-06 11:00:00'),
('Template3', 3, 'Template3 stands for FEE RECEIPT', 1, 3, 3, '2024-03-06 12:00:00', '2024-03-06 12:00:00');


INSERT INTO m_template_type (template_type, status, updated_by, created_by, date_created, date_modified) 
VALUES 
('ID CARD', 1, 3, 3, '2024-03-06 10:00:00', '2024-03-06 10:00:00'),
('REPORT CARD', 1, 3, 3, '2024-03-06 11:00:00', '2024-03-06 11:00:00'),
('FEE RECEIPT', 1, 3, 3, '2024-03-06 12:00:00', '2024-03-06 12:00:00');


-- 11-03-2024

INSERT INTO m_modules (module_name, module_icon) VALUES ('Templates', 'icon_template');
INSERT INTO public.m_menus(
	menu_id, menu_name, menu_description, is_active, parent_menu_id, menu_order, route_url, icon_class, date_created, date_modified)
	VALUES (24, 'Templates', 'Templates', 1, 18, 24, '/template', 'icon_template', NOW(), NOW());

INSERT INTO public.access_control(
	role_id, menu_id, per_id, date_created, date_modified, created_by, updated_by)
	VALUES (3, 24, 1, NOW(), NOW(), 1, 1),
	 (3, 24, 2, NOW(), NOW(), 1, 1);


INSERT INTO m_modules (module_name, module_icon) VALUES ('Assign Marks', 'icon_template');
INSERT INTO public.m_menus(
	menu_id, menu_name, menu_description, is_active, parent_menu_id, menu_order, route_url, icon_class, date_created, date_modified)
	VALUES (25, 'Assign Marks', 'Assign Marks', 1, 10, 25, '/marks', 'icon_template', NOW(), NOW());

INSERT INTO public.access_control(
	role_id, menu_id, per_id, date_created, date_modified, created_by, updated_by)
	VALUES (3, 25, 1, NOW(), NOW(), 1, 1),
	 (3, 25, 2, NOW(), NOW(), 1, 1);

	----db added by jha (7-march-2024)
alter table m_student_admission add admission_code varchar(100);

ALTER TABLE m_template_config
ADD COLUMN title VARCHAR(255);
