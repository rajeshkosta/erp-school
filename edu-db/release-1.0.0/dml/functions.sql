CREATE FUNCTION update_date_modified_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
  BEGIN
    NEW.date_modified = NOW();
    RETURN NEW;
  END;
$$;




--===============[added by jha 14-02-2024]==========================================

CREATE OR REPLACE FUNCTION public.insert_student_admission(
	json_data jsonb)
    RETURNS integer
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
 
Declare 
	    inserted_id INT;
        inserted_parent_id INT;
		first_name varchar(100);
		middle_name varchar(100);
		last_name varchar(100);
        gender_id INT;
        email_id varchar(100);
        mobile_number BIGINT;
        alternate_mobile_number BIGINT;
        blood_group varchar(100);
        nationality varchar(100);
        religion varchar(100);
        caste_category varchar(100);
        caste varchar(100);
        dob DATE;
        aadhaar_no BIGINT;
        father_name varchar(100);
        father_email varchar(100);
        father_occupation varchar(100);
        mother_name varchar(100);
        mother_email varchar(100);
        mother_occupation varchar(100);
        current_address varchar(100);
        current_address_city varchar(100);
        current_address_pincode varchar(100);
        permanent_address varchar(100);
        permanent_address_city varchar(100);
        permanent_address_pincode varchar(100);
        current_address_state_id INT;
        current_address_district_id INT;
        permanent_address_state_id INT;
        permanent_address_district_id INT;
        previous_school_name varchar(100);
        previous_school_board varchar(100);
        previous_class varchar(100);
        previous_school_year INT;
        previous_class_percentage_grade varchar(100);
        academic_session varchar(100);
        admission_date DATE;
        class_id INT;
        v_student_reg_id INT;
        v_parent_id INT;	
		school_id INT;
  		created_by INT;
  		updated_by INT;
		mothertongue varchar(100);
  		student_admission_number varchar(100);
		admission_code varchar(100);
		status INT;
		guardian_name varchar(100);
		guardian_mobile_no BIGINT;
		guardian_email_id varchar(100);
		guardian_address varchar(100);
		guardian_relation varchar(100);

	BEGIN

		first_name := json_data->>'first_name';
		middle_name := json_data->>'middle_name';
		last_name := json_data->>'last_name';
		gender_id := CAST(json_data->>'gender_id' AS INT);
		email_id := json_data->>'email_id';
		mobile_number :=CAST(json_data->>'mobile_number' AS BIGINT);
		alternate_mobile_number := CAST(json_data->>'alternate_mobile_number' AS BIGINT);
		blood_group := json_data->>'blood_group';
		nationality := json_data->>'nationality';
		religion := json_data->>'religion';
		caste_category := json_data->>'caste_category';
		caste := json_data->>'caste';
		dob := CAST(json_data->>'dob' AS DATE);
		aadhaar_no := CAST(json_data->>'aadhaar_no' AS BIGINT);
		father_name := json_data->>'father_name';
		father_email := json_data->>'father_email';
		father_occupation := json_data->>'father_occupation';
		mother_name := json_data->>'mother_name';
		mother_email := json_data->>'mother_email';
		mother_occupation := json_data->>'mother_occupation';
		current_address := json_data->>'current_address';
		current_address_city := json_data->>'current_address_city';
		current_address_pincode := json_data->>'current_address_pincode';
		permanent_address := json_data->>'permanent_address';
		permanent_address_city := json_data->>'permanent_address_city';
		permanent_address_pincode := json_data->>'permanent_address_pincode';
		current_address_state_id := CAST(json_data->>'current_address_state_id' AS INT);
		current_address_district_id := CAST(json_data->>'current_address_district_id' AS INT);
		permanent_address_state_id := CAST(json_data->>'permanent_address_state_id' AS INT);
		permanent_address_district_id := CAST(json_data->>'permanent_address_district_id' AS INT);
		previous_school_name := json_data->>'previous_school_name';
		previous_school_board := json_data->>'previous_school_board';
		previous_class := json_data->>'previous_class';
		previous_school_year := CAST(json_data->>'previous_school_year' AS INT);
		previous_class_percentage_grade := json_data->>'previous_class_percentage_grade';
		academic_session := json_data->>'academic_session';
		admission_date := CAST(json_data->>'admission_date' AS DATE);
		class_id := CAST(json_data->>'class_id' AS INT);
		v_student_reg_id := CAST(json_data->>'student_reg_id' AS INT);
		v_parent_id := CAST(json_data->>'parent_id' AS INT);
		school_id := CAST(json_data->>'school_id' AS INT);
		created_by := CAST(json_data->>'created_by' AS INT);
		updated_by := CAST(json_data->>'updated_by' AS INT);
		mothertongue :=json_data->>'mothertongue';
		student_admission_number := json_data->>'student_admission_number';
		admission_code := json_data->>'admission_code';
		status := CAST(json_data->>'status' AS INT);
		guardian_name := json_data->>'guardian_name';
		guardian_mobile_no := json_data->>'guardian_mobile_no';
		guardian_email_id := json_data->>'guardian_email_id';
		guardian_address := json_data->>'guardian_address';
		guardian_relation := json_data->>'guardian_relation';


	IF v_student_reg_id IS NULL THEN
		INSERT INTO m_student_registration (
			first_name, middle_name, last_name, father_name, mother_name, gender_id, 
			mobile_number, alternate_mobile_number, dob, current_address, permanent_address,
			father_email, religion, caste, caste_category, class_id,mothertongue,
			nationality, status, school_id
		)
		VALUES (first_name,middle_name, last_name,father_name, mother_name ,gender_id, mobile_number,
			alternate_mobile_number,dob,current_address,permanent_address,email_id,
			religion,caste,caste_category,class_id,mothertongue, nationality,
		    status,school_id
		)
		RETURNING student_reg_id INTO v_student_reg_id;
    END IF;


	--IF v_parent_id IS NULL THEN 
		insert INTO m_parent (school_id,parent_name,mobile_no,email_id,address,status,updated_by,created_by,relationship_to_student)
		values (school_id,guardian_name,guardian_mobile_no,email_id,current_address,status,updated_by,created_by,guardian_relation)
		 RETURNING parent_id INTO v_parent_id;
	--END IF;
 
	INSERT INTO m_student_admission (
        first_name, middle_name, last_name, gender_id, email_id, mobile_number, alternate_mobile_number,
		blood_group,nationality,religion, caste_category, caste, dob, aadhaar_no, father_name,
		father_email, father_occupation, mother_name, mother_email, mother_occupation,
		current_address, current_address_city, current_address_pincode, permanent_address,
		permanent_address_city, permanent_address_pincode, current_address_state_id, 
		current_address_district_id, permanent_address_state_id, permanent_address_district_id, 
		previous_school_name, previous_school_board, previous_class, previous_school_year, 
		previous_class_percentage_grade, academic_session, admission_date, class_id, 
		student_reg_id, parent_id, school_id, created_by, updated_by, 
		student_admission_number,admission_code, status,mothertongue

    ) VALUES (
		first_name,middle_name,last_name,gender_id, email_id, mobile_number, alternate_mobile_number, blood_group,
		nationality, religion, caste_category, caste, dob, aadhaar_no, father_name,
		father_email, father_occupation, mother_name, mother_email, mother_occupation,
		current_address, current_address_city, current_address_pincode, permanent_address,
		permanent_address_city, permanent_address_pincode, current_address_state_id, 
		current_address_district_id, permanent_address_state_id, permanent_address_district_id,
		previous_school_name, previous_school_board, previous_class, previous_school_year, 
		previous_class_percentage_grade, academic_session, admission_date, class_id,
		v_student_reg_id, v_parent_id, school_id, created_by, updated_by,
		student_admission_number,admission_code, status,mothertongue
    ) 

	 RETURNING student_admission_id INTO inserted_id; 
     
	    insert INTO m_reg_admission_mapping (student_reg_id,admission_id,updated_by,created_by)
		values (v_student_reg_id,inserted_id,updated_by,created_by);

	 
	 RETURN inserted_id;
	 
	 
	 
END;
$BODY$;








CREATE OR REPLACE FUNCTION addAttendance(p_attendanceData json, p_created_by int, p_updated_by int, OUT resultVal integer) 
RETURNS INTEGER 
LANGUAGE plpgsql AS $$
DECLARE v_attendance_id INTEGER; i JSON;
BEGIN
    
    FOR i IN SELECT * FROM json_array_elements(p_attendanceData)
    LOOP

      SELECT attendance_id INTO v_attendance_id FROM tr_attendance 
      WHERE date =  (i->>'attendance_date')::DATE AND student_id = (i->>'student_id')::INT 
      AND classroom_id = (i->>'classroom_id')::INT;
      RAISE NOTICE 'attendance_id%', v_attendance_id;
		  
		  IF v_attendance_id > 0 THEN

        UPDATE tr_attendance 
        SET attendance_status = (i->>'attendance_status')::INT, 
        remarks = (i->>'remarks')::VARCHAR,
        updated_by = p_updated_by,
        date_modified = NOW()
        WHERE attendance_id = v_attendance_id;

		  ELSE

		  	INSERT INTO public.tr_attendance(student_id, classroom_id, date, attendance_status,
        remarks, updated_by, created_by, date_created, date_modified)
        VALUES ((i->>'student_id')::INT,(i->>'classroom_id')::INT,(i->>'attendance_date')::DATE, 
            (i->>'attendance_status')::INT,(i->>'remarks')::VARCHAR, p_updated_by, p_created_by, NOW(), NOW() );
            
		  END IF;
        
    END LOOP;
SELECT INTO resultVal 1;
END $$;




-- 18-02-2024
CREATE OR REPLACE FUNCTION reassignRollNumber(p_classroom_id int, p_assign_type int, OUT resultVal integer) 
RETURNS INTEGER 
LANGUAGE plpgsql AS $$
begin
	
	if p_assign_type = 1 then
		WITH cte_students AS (
			SELECT c.student_admission_id, student_id, 
			ROW_NUMBER() OVER (ORDER BY s.first_name) AS new_roll_no, 
			c.roll_no , s.first_name, s.gender_id 
			FROM m_classroom_student c
			join m_student_admission s on s.student_admission_id = c.student_admission_id 
			where c.classroom_id = p_classroom_id )
		UPDATE m_classroom_student
	    SET roll_no = cte_students.new_roll_no
	    FROM cte_students
	    WHERE m_classroom_student.classroom_id = p_classroom_id 
	    AND  m_classroom_student.student_admission_id = cte_students.student_admission_id;
	end if;
    

	if p_assign_type = 2 then
	    WITH cte_students AS (
			SELECT c.student_admission_id, student_id, 
			ROW_NUMBER() OVER (ORDER BY CASE WHEN s.gender_id = 2 then 3 when s.gender_id = 3 
			then 2 else s.gender_id END DESC, s.first_name) AS new_roll_no, 
			c.roll_no , s.first_name, s.gender_id 
			FROM m_classroom_student c
			join m_student_admission s on s.student_admission_id = c.student_admission_id 
			where c.classroom_id = p_classroom_id )
		UPDATE m_classroom_student
	    SET roll_no = cte_students.new_roll_no
	    FROM cte_students
	    WHERE m_classroom_student.classroom_id = p_classroom_id 
	    AND  m_classroom_student.student_admission_id = cte_students.student_admission_id;
	 end if;

SELECT INTO resultVal 1;
END $$;






-----======[added by jha 21-01-2024]=========
CREATE OR REPLACE FUNCTION public.insert_student_document(
	p_student_admission_id integer,
	p_aadhar_document character varying,
	p_birth_certificate character varying,
	p_student_photo character varying,
	p_father_photo character varying,
	p_mother_photo character varying,
	p_utc_certificate character varying,
	p_created_by_id integer,
	p_updated_by_id integer)
    RETURNS integer
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
  
 Declare
 	V_aadhar_document_id INT;
    V_birth_certificate_id INT;
	V_student_photo_id INT;
	V_father_photo_id INT;
	V_mother_photo_id INT;
	V_utc_certificate_id INT;
  
  BEGIN
 IF p_aadhar_document IS NOT NULL THEN
	SELECT admission_document_id INTO V_aadhar_document_id
	FROM m_student_admission_document 
	WHERE student_admission_id = p_student_admission_id AND document_name = 'AADHAR';
	IF V_aadhar_document_id > 0 THEN 
	UPDATE m_student_admission_document SET document_path = p_aadhar_document, updated_by = p_updated_by_id, date_updated = now()
	WHERE admission_document_id = V_aadhar_document_id;
	ELSE
	INSERT INTO m_student_admission_document(student_admission_id,document_path,document_name,document_type,status,created_by,updated_by) 
	VALUES (p_student_admission_id,p_aadhar_document,'AADHAR',UPPER(SPLIT_PART(p_aadhar_document, '.', -1)),1,p_created_by_id,p_updated_by_id);
	END IF;
END IF;
  IF p_birth_certificate IS NOT NULL THEN
	SELECT admission_document_id INTO V_birth_certificate_id
	FROM m_student_admission_document 
	WHERE student_admission_id = p_student_admission_id AND document_name = 'BIRTH_CERTIFICATE';
	IF V_birth_certificate_id > 0 THEN 
	UPDATE m_student_admission_document SET document_path = p_birth_certificate, updated_by = p_updated_by_id, date_updated = now()
	WHERE admission_document_id = V_birth_certificate_id;
	ELSE
	INSERT INTO m_student_admission_document(student_admission_id,document_path,document_name,document_type,status,created_by,updated_by) 
	VALUES (p_student_admission_id,p_birth_certificate,'BIRTH_CERTIFICATE',UPPER(SPLIT_PART(p_birth_certificate, '.', -1)),1,p_created_by_id,p_updated_by_id);
	END IF;
END IF;
 IF p_student_photo IS NOT NULL THEN
	SELECT admission_document_id INTO V_student_photo_id
	FROM m_student_admission_document 
	WHERE student_admission_id = p_student_admission_id AND document_name = 'STUDENT_PHOTO';
	IF V_student_photo_id > 0 THEN 
	UPDATE m_student_admission_document SET document_path = p_student_photo, updated_by = p_updated_by_id, date_updated = now()
	WHERE admission_document_id = V_student_photo_id;
	ELSE
	INSERT INTO m_student_admission_document(student_admission_id,document_path,document_name,document_type,status,created_by,updated_by) 
	VALUES (p_student_admission_id,p_student_photo,'STUDENT_PHOTO',UPPER(SPLIT_PART(p_student_photo, '.', -1)),1,p_created_by_id,p_updated_by_id);
	END IF;
END IF; 
  IF p_father_photo IS NOT NULL THEN
	SELECT admission_document_id INTO V_father_photo_id
	FROM m_student_admission_document 
	WHERE student_admission_id = p_student_admission_id AND document_name = 'FATHER_PHOTO';
	IF V_father_photo_id > 0 THEN 
	UPDATE m_student_admission_document SET document_path = p_father_photo, updated_by = p_updated_by_id, date_updated = now()
	WHERE admission_document_id = V_father_photo_id;
	ELSE
	INSERT INTO m_student_admission_document(student_admission_id,document_path,document_name,document_type,status,created_by,updated_by) 
	VALUES (p_student_admission_id,p_father_photo,'FATHER_PHOTO',UPPER(SPLIT_PART(p_father_photo, '.', -1)),1,p_created_by_id,p_updated_by_id);
	END IF;
END IF;
  IF p_mother_photo IS NOT NULL THEN
	SELECT admission_document_id INTO V_mother_photo_id
	FROM m_student_admission_document 
	WHERE student_admission_id = p_student_admission_id AND document_name = 'MOTHER_PHOTO';
	IF V_mother_photo_id > 0 THEN 
	UPDATE m_student_admission_document SET document_path = p_mother_photo, updated_by = p_updated_by_id, date_updated = now()
	WHERE admission_document_id = V_mother_photo_id;
	ELSE
	INSERT INTO m_student_admission_document(student_admission_id,document_path,document_name,document_type,status,created_by,updated_by) 
	VALUES (p_student_admission_id,p_mother_photo,'MOTHER_PHOTO',UPPER(SPLIT_PART(p_mother_photo, '.', -1)),1,p_created_by_id,p_updated_by_id);
	END IF;
END IF;
IF p_utc_certificate IS NOT NULL THEN
	SELECT admission_document_id INTO V_utc_certificate_id
	FROM m_student_admission_document 
	WHERE student_admission_id = p_student_admission_id AND document_name = 'UTC_CERTIFICATE';
	IF V_utc_certificate_id > 0 THEN 
	UPDATE m_student_admission_document SET document_path = p_utc_certificate, updated_by = p_updated_by_id, date_updated = now()
	WHERE admission_document_id = V_utc_certificate_id;
	ELSE
	INSERT INTO m_student_admission_document(student_admission_id,document_path,document_name,document_type,status,created_by,updated_by) 
	VALUES (p_student_admission_id,p_utc_certificate,'UTC_CERTIFICATE',UPPER(SPLIT_PART(p_utc_certificate, '.', -1)),1,p_created_by_id,p_updated_by_id);
	END IF;
END IF; 
   RETURN 1;
  
  END;
$BODY$;




-- 27-02-2024
CREATE OR REPLACE FUNCTION reAllocateStudent(p_prev_allocation json, p_student_details json, OUT resultVal integer) 
RETURNS INTEGER 
LANGUAGE plpgsql AS $$
DECLARE v_attendance_id INTEGER; i JSON;
BEGIN
    raise notice 'student_id%', p_prev_allocation->>'student_id';
   
   INSERT INTO public.tr_classroom_reallocation_log
(student_id, student_admission_id, classroom_id, roll_no, house_id, prev_updated_by, prev_date_modified, created_by, updated_by)
VALUES((p_prev_allocation->>'student_id')::INT, (p_prev_allocation->>'student_admission_id')::INT, (p_prev_allocation->>'classroom_id')::INT, (p_prev_allocation->>'roll_no')::INT,(p_prev_allocation->>'house_id')::INT,(p_prev_allocation->>'prev_updated_by')::INT,(p_prev_allocation->>'prev_date_modified')::TIMESTAMP,(p_prev_allocation->>'created_by')::INT,(p_prev_allocation->>'updated_by')::INT);

delete from m_classroom_student where student_id = (p_prev_allocation->>'student_id')::INT;
   
INSERT INTO public.m_classroom_student (student_admission_id, classroom_id, roll_no,updated_by, created_by)
    VALUES((p_student_details->>'student_admission_id')::INT,(p_student_details->>'classroom_id')::INT,(p_student_details->>'roll_no')::INT, (p_student_details->>'created_by')::INT,(p_student_details->>'updated_by')::INT);
    
SELECT INTO resultVal 1;
END $$;




	
CREATE OR REPLACE FUNCTION importStudent(p_studentData json, p_school_id int, p_user_id int, OUT resultVal integer) 
RETURNS INTEGER 
LANGUAGE plpgsql AS $$
DECLARE v_parent_id INTEGER; v_student_reg_id INTEGER; v_student_admission_id INTEGER;
BEGIN

		INSERT INTO m_student_registration ( first_name, father_name, mother_name, gender_id, mobile_number, current_address, class_id, school_id)
		VALUES ((p_studentData->>'name')::TEXT,(p_studentData->>'father_name')::TEXT,(p_studentData->>'mother_name')::TEXT,(p_studentData->>'gender')::INT,
			(p_studentData->>'mobile')::bigint,(p_studentData->>'address')::text,(p_studentData->>'class_id')::INT,p_school_id)
			RETURNING student_reg_id INTO v_student_reg_id;
			

		SELECT parent_id INTO v_parent_id from m_parent where parent_name = (p_studentData->>'father_name')::text 
			and mobile_no = (p_studentData->>'mobile')::bigint;
		RAISE NOTICE 'sel v_parent_id%', v_parent_id;
		IF v_parent_id IS NULL THEN
    
			INSERT INTO m_parent (school_id,parent_name,mobile_no,address,updated_by,created_by)
				values (p_school_id,(p_studentData->>'father_name')::TEXT,(p_studentData->>'mobile')::bigint,(p_studentData->>'address')::text,p_user_id,p_user_id)
				RETURNING parent_id INTO v_parent_id;
				RAISE NOTICE 'v_parent_id%', v_parent_id;
		END IF;


		
INSERT INTO m_student_admission ( first_name, gender_id, mobile_number, father_name, mother_name, current_address, 
	academic_session, class_id, student_reg_id, parent_id, school_id, created_by, updated_by, student_admission_number
    ) VALUES (
		(p_studentData->>'name')::TEXT,(p_studentData->>'gender')::INT, (p_studentData->>'mobile')::bigint, (p_studentData->>'father_name')::TEXT, 
		(p_studentData->>'mother_name')::TEXT, (p_studentData->>'address')::text,(p_studentData->>'academic_year_id')::int,(p_studentData->>'class_id')::INT,
		v_student_reg_id, v_parent_id, p_school_id, p_user_id, p_user_id, (p_studentData->>'admission_no')::text
    ) 
	 RETURNING student_admission_id INTO v_student_admission_id; 

	   INSERT INTO m_reg_admission_mapping (student_reg_id,admission_id,updated_by,created_by)
		VALUES (v_student_reg_id,v_student_admission_id,p_user_id,p_user_id);
   
SELECT INTO resultVal v_parent_id;
END $$;