exports.CLASSROOM = {
    HOUSE: {
        insertHouseQuery: 'INSERT INTO m_house ( academic_year_id, house_name, house_description, status, updated_by, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING house_id',

        updateHouseQuery: 'UPDATE m_house SET  academic_year_id = $2, house_name = $3, house_description = $4 WHERE house_id = $1',

        checkIfIdExistQuery: 'SELECT COUNT(*) FROM m_house WHERE house_id = $1',

        checkIfExistQuery: 'SELECT COUNT(*) FROM m_house WHERE house_name = $1 AND academic_year_id = $2',

        getAllHouseQuery: `select * from m_house`,

        getHouseByIdQuery: 'SELECT * FROM m_house where house_id = $1',

        checkIfHouseIdExists: 'SELECT COUNT(*) FROM m_house where house_id = $1',

    }

}
exports.SUBJECT = {
    insertSubjectQuery: `
        INSERT INTO m_classroom_subject (classroom_id, teacher_id, subject_name, status, updated_by, created_by)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `,

    checkIfExist: `SELECT COUNT(*) FROM m_classroom_subject WHERE classroom_id = $1 AND upper(subject_name) = upper($2)`,
    getAllSubjectsQuery: `
    SELECT CS.class_subject_id, CS.subject_id, CS.classroom_id, CS.teacher_id ,
    S.subject_name
    FROM m_classroom_subject CS 
    INNER JOIN m_subject S ON S.subject_id = CS.subject_id
    WHERE CS.classroom_id = $1 AND CS.status > 0;
    `,


    getSubjectByIDQuery: `
    SELECT
        subject_id,
        classroom_id,
        teacher_id,
        subject_name,
        status
    FROM m_classroom_subject
    WHERE subject_id = $1;
    
`



}

exports.CLASSROOM_STUDENT = {
    insertClassroomStudentQuery: `
    INSERT INTO m_classroom_student (student_admission_id, classroom_id, roll_no, house_id,status,created_by,updated_by)
    VALUES ($1, $2, $3, $4,$5,$6,$7) returning student_id
    
     `,

    getAllClassroomStudentQuery: `
        SELECT * FROM m_classroom_student
    `,

    getAllClassroomStudentByIdQuery: `
        SELECT * FROM m_classroom_student WHERE student_id = $1
    `,

    updateClassroomStudentByIdQuery: `
        UPDATE m_classroom_student SET classroom_id = $1, roll_no = $2, house_id = $3,student_admission_id = $4
        WHERE student_id = $5;
    `,

    isRollNoExists: `
        SELECT COUNT(*) FROM m_classroom_student WHERE roll_no = $1 AND classroom_id = $2;
    `,

    isRollNoExistsForUpdate: `
        FROM m_classroom_student WHERE roll_no = $1 AND classroom_id = $2 AND student_id <> $3
    `,

    isStudentExists: `
        SELECT COUNT(*) AS count FROM m_classroom_student WHERE student_id = $1
    `,

    ischeckAdmissionIdExist: `SELECT COUNT(*) AS count FROM m_classroom_student WHERE student_admission_id = $1`,

    getAllClassroomStudentCount: `SELECT count(*) AS count FROM m_classroom_student CS #WHERE_CLAUSE#`,
    getAllClassroomStudents: `select  C.academic_year_id, CS.student_id , CS.roll_no , CS.student_admission_id, SA.school_id, SA.student_admission_number,
                SA.first_name, SA.middle_name, SA.last_name, SA.father_name,SA.gender_id, SAD.document_path
                from m_classroom_student CS
                inner join m_classroom C ON C.classroom_id = CS.classroom_id
                inner join m_student_admission SA on CS.student_admission_id  = SA.student_admission_id
                LEFT JOIN m_student_admission_document SAD ON SAD.student_admission_id = SA.student_admission_id AND SAD.document_name = 'STUDENT_PHOTO'
                #WHERE_CLAUSE# ORDER BY CS.roll_no #LIMIT_CLAUSE# #OFFSET_CLAUSE#`
};

exports.CLASSROOM_QUERIES = {
    checkAcademicYearIdValid: `SELECT COUNT(*) AS count FROM m_academic_year WHERE school_id = $1 AND  academic_year_id = $2`,
    checkClassIdExists: `SELECT COUNT(*) AS count FROM m_standard WHERE std_id = $1`,
    checkSectionIdExists: `SELECT COUNT(*) AS count FROM m_section WHERE section_id = $1 AND school_id = $2`,
    addClassroom: `INSERT INTO public.m_classroom(academic_year_id, class_teacher, class_id, section_id, capacity, room_no, floor, building, projector_available, status, updated_by, created_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING classroom_id`,
    addClassroomSubject: `INSERT INTO public.m_classroom_subject(subject_id, classroom_id, teacher_id, updated_by, created_by)
            VALUES ($1, $2, $3, $4, $5);`,
    getAllClassroomCount: `SELECT COUNT(*) AS count FROM m_classroom C #WHERE_CLAUSE#`,
    getAllClassrooms: `SELECT C.classroom_id, C.academic_year_id, C.class_teacher, U.display_name AS class_teacher_name,  C.class_id, C.section_id, C.capacity,
    C.room_no, C.floor, C.building, C.projector_available, C.status, ST.std_name, ST.abbr, 
    ST.category, SC.section_name
    FROM m_classroom C
    INNER JOIN m_standard ST ON ST.std_id = C.class_id
    INNER JOIN m_section SC ON SC.section_id = C.section_id
    LEFT JOIN m_users U ON U.user_id = C.class_teacher
    #WHERE_CLAUSE# ORDER BY C.date_modified DESC #LIMIT_CLAUSE# #OFFSET_CLAUSE#`,
    updateClassroom: "UPDATE m_classroom SET ",
    getSectionsByStd: `SELECT classroom_id, class_id, C.section_id, S.section_name
    FROM m_classroom C INNER JOIN m_section S ON S.section_id = C.section_id
    WHERE academic_year_id = $1 AND class_id = $2`,
    getCountsByClassScrap: `select C.class_id, C.classroom_id, C.capacity as total_seats, SEC.section_id, SEC.section_name,
    S.std_name, S.abbr, STRING_AGG(initcap(SUB.subject_name), ', ') as subjects,
    count(CS.student_id) as seats_reserved, C.capacity - count(CS.student_id) as seats_left
    from m_classroom C
    inner join m_standard S on S.std_id = C.class_id and C.class_id = $1
    inner join m_section SEC on SEC.section_id = C.section_id
    left join m_classroom_student CS on CS.classroom_id = C.classroom_id
    left join m_classroom_subject CSUB on CSUB.classroom_id = C.classroom_id
    left join m_subject SUB on SUB.subject_id = CSUB.subject_id
    and C.academic_year_id = $2
    AND C.status = 1
    group by C.class_id, C.classroom_id, C.capacity, SEC.section_id, SEC.section_name,
    S.std_name, S.abbr`,
    getCountsByClass: `select C.class_id, C.classroom_id, C.capacity, SEC.section_id, SEC.section_name,
    S.std_name, S.abbr, STRING_AGG(initcap(SUB.subject_name), ', ') as subjects
    from m_classroom C
    inner join m_standard S on S.std_id = C.class_id and C.status = 1
    and C.class_id = $1 and C.academic_year_id = $2
    inner join m_section SEC on SEC.section_id = C.section_id
    left join m_classroom_subject CSUB on CSUB.classroom_id = C.classroom_id
    left join m_subject SUB on SUB.subject_id = CSUB.subject_id
    group by C.class_id, C.classroom_id, C.capacity, SEC.section_id, SEC.section_name,
    S.std_name, S.abbr`,
    getClassByYear: `SELECT S.std_id , S.std_name , S.abbr , S.category  FROM m_classroom C
    inner join m_standard S on S.std_id = C.class_id 
    where C.academic_year_id = $1
    group by S.std_id `,
    getSubjectsByStd: `SELECT S.subject_id , S.subject_name 
    FROM m_classroom C 
    INNER JOIN m_classroom_subject CS ON CS.classroom_id = C.classroom_id 
    inner join m_subject S on S.subject_id  = CS.subject_id 
    WHERE academic_year_id = $1 AND class_id = $2
    group by S.subject_id order by S.subject_name;`,
    getSubjectsByClassroomId: `SELECT S.subject_id , S.subject_name 
    FROM m_classroom_subject CS
    inner join m_subject S on S.subject_id  = CS.subject_id 
    WHERE CS.classroom_id = $1`,
    getSubjectDetails: `select cl.classroom_id, csb.class_subject_id, csb.subject_id, sb.subject_name,
    csb.teacher_id, u.display_name, u.mobile_number 
    from m_classroom cl
    inner join m_classroom_subject csb on csb.classroom_id = cl.classroom_id 
    inner join m_subject sb on sb.subject_id = csb.subject_id 
    left join m_users u on csb.teacher_id  = u.user_id 
    where cl.classroom_id = $1`,
    getClassTeacher: `select  cl.classroom_id, cl.class_id , cl.section_id , cl.class_teacher,
    st.std_name, st.abbr, sc.section_name,
    u.display_name, u.mobile_number 
    from m_classroom cl
    inner join m_standard st on st.std_id = cl.class_id 
    inner join m_section sc on sc.section_id = cl.section_id 
    left join m_users u on cl.class_teacher = u.user_id 
    where cl.classroom_id = $1`

}



exports.ATTENDANCE_QUERY = {
    getClassroomStudent: `SELECT student_id, classroom_id, 1 AS attendance_status, $2 AS attendance_date  FROM m_classroom_student WHERE classroom_id = $1`,
    getAllAttendance: `SELECT S.student_id, S.student_admission_id, S.classroom_id, S.roll_no,
    SA.first_name , SA.student_admission_number ,SA.father_name, SA.gender_id , SA.dob,
    A.attendance_id, TO_CHAR(COALESCE(A.date, '#SELECT_CLAUSE#')::date, 'YYYY-MM-DD') AS attendance_date, 
    coalesce(A.attendance_status, 1) as attendance_status, A.remarks
    FROM m_classroom_student S
    INNER JOIN m_student_admission SA on S.student_admission_id = SA.student_admission_id
    LEFT JOIN tr_attendance A ON A.student_id = S.student_id #JOIN_CLAUSE#
     #WHERE_CLAUSE# ORDER BY S.roll_no, SA.first_name, SA.student_admission_number #LIMIT_CLAUSE# #OFFSET_CLAUSE#`,
    getAttendanceCount: `SELECT COUNT(*) AS count FROM m_classroom_student S #WHERE_CLAUSE# `,
    attendanceAddUpdateCheck: `SELECT COUNT(*) AS count FROM tr_attendance S #WHERE_CLAUSE# `,
    getAttendance: `WITH DateSequence AS (
        SELECT generate_series(start_date, end_date, interval '1 day') AS date
        FROM m_academic_year
        WHERE academic_year_id = $1
      )
      
      SELECT 
          EXTRACT(DAY FROM ds.date) AS day_of_month,
          MAX(CASE WHEN EXTRACT(MONTH FROM ds.date) = 1 
          THEN CASE 
          WHEN COALESCE(t.attendance_status, 0) = 1 AND c.classroom_id = s.classroom_id THEN 'P' 
          WHEN COALESCE(t.attendance_status, 0) = 2 AND c.classroom_id = s.classroom_id THEN 'A' 
          WHEN COALESCE(t.attendance_status, 0) = 3 AND c.classroom_id = s.classroom_id THEN 'HD' 
          WHEN COALESCE(t.attendance_status, 0) = 4 AND c.classroom_id = s.classroom_id THEN 'H' 
          ELSE '-' END ELSE NULL END) AS Jan, 
          
          MAX(CASE WHEN EXTRACT(MONTH FROM ds.date) = 2 
          THEN CASE 
          WHEN COALESCE(t.attendance_status, 0) = 1 AND c.classroom_id = s.classroom_id THEN 'P' 
          WHEN COALESCE(t.attendance_status, 0) = 2 AND c.classroom_id = s.classroom_id THEN 'A' 
          WHEN COALESCE(t.attendance_status, 0) = 3 AND c.classroom_id = s.classroom_id THEN 'HD' 
          WHEN COALESCE(t.attendance_status, 0) = 4 AND c.classroom_id = s.classroom_id THEN 'H' 
          ELSE '-' END ELSE NULL END) AS Feb, 
      
          MAX(CASE WHEN EXTRACT(MONTH FROM ds.date) = 3 
          THEN CASE 
          WHEN COALESCE(t.attendance_status, 0) = 1 AND c.classroom_id = s.classroom_id THEN 'P' 
          WHEN COALESCE(t.attendance_status, 0) = 2 AND c.classroom_id = s.classroom_id THEN 'A' 
          WHEN COALESCE(t.attendance_status, 0) = 3 AND c.classroom_id = s.classroom_id THEN 'HD' 
          WHEN COALESCE(t.attendance_status, 0) = 4 AND c.classroom_id = s.classroom_id THEN 'H' 
          ELSE '-' END ELSE NULL END) AS Mar, 
      
          MAX(CASE WHEN EXTRACT(MONTH FROM ds.date) = 4 
          THEN CASE 
          WHEN COALESCE(t.attendance_status, 0) = 1 AND c.classroom_id = s.classroom_id THEN 'P' 
          WHEN COALESCE(t.attendance_status, 0) = 2 AND c.classroom_id = s.classroom_id THEN 'A' 
          WHEN COALESCE(t.attendance_status, 0) = 3 AND c.classroom_id = s.classroom_id THEN 'HD' 
          WHEN COALESCE(t.attendance_status, 0) = 4 AND c.classroom_id = s.classroom_id THEN 'H' 
          ELSE '-' END ELSE NULL END) AS Apr, 
      
          MAX(CASE WHEN EXTRACT(MONTH FROM ds.date) = 5 
          THEN CASE 
          WHEN COALESCE(t.attendance_status, 0) = 1 AND c.classroom_id = s.classroom_id THEN 'P' 
          WHEN COALESCE(t.attendance_status, 0) = 2 AND c.classroom_id = s.classroom_id THEN 'A' 
          WHEN COALESCE(t.attendance_status, 0) = 3 AND c.classroom_id = s.classroom_id THEN 'HD' 
          WHEN COALESCE(t.attendance_status, 0) = 4 AND c.classroom_id = s.classroom_id THEN 'H' 
          ELSE '-' END ELSE NULL END) AS May, 
      
          MAX(CASE WHEN EXTRACT(MONTH FROM ds.date) = 6 
          THEN CASE 
          WHEN COALESCE(t.attendance_status, 0) = 1 AND c.classroom_id = s.classroom_id THEN 'P' 
          WHEN COALESCE(t.attendance_status, 0) = 2 AND c.classroom_id = s.classroom_id THEN 'A' 
          WHEN COALESCE(t.attendance_status, 0) = 3 AND c.classroom_id = s.classroom_id THEN 'HD' 
          WHEN COALESCE(t.attendance_status, 0) = 4 AND c.classroom_id = s.classroom_id THEN 'H' 
          ELSE '-' END ELSE NULL END) AS Jun, 
      
          MAX(CASE WHEN EXTRACT(MONTH FROM ds.date) = 7 
          THEN CASE 
          WHEN COALESCE(t.attendance_status, 0) = 1 AND c.classroom_id = s.classroom_id THEN 'P' 
          WHEN COALESCE(t.attendance_status, 0) = 2 AND c.classroom_id = s.classroom_id THEN 'A' 
          WHEN COALESCE(t.attendance_status, 0) = 3 AND c.classroom_id = s.classroom_id THEN 'HD' 
          WHEN COALESCE(t.attendance_status, 0) = 4 AND c.classroom_id = s.classroom_id THEN 'H' 
          ELSE '-' END ELSE NULL END) AS Jul, 
      
          MAX(CASE WHEN EXTRACT(MONTH FROM ds.date) = 8 
          THEN CASE 
          WHEN COALESCE(t.attendance_status, 0) = 1 AND c.classroom_id = s.classroom_id THEN 'P' 
          WHEN COALESCE(t.attendance_status, 0) = 2 AND c.classroom_id = s.classroom_id THEN 'A' 
          WHEN COALESCE(t.attendance_status, 0) = 3 AND c.classroom_id = s.classroom_id THEN 'HD' 
          WHEN COALESCE(t.attendance_status, 0) = 4 AND c.classroom_id = s.classroom_id THEN 'H' 
          ELSE '-' END ELSE NULL END) AS Aug, 
      
          MAX(CASE WHEN EXTRACT(MONTH FROM ds.date) = 9 
          THEN CASE 
          WHEN COALESCE(t.attendance_status, 0) = 1 AND c.classroom_id = s.classroom_id THEN 'P' 
          WHEN COALESCE(t.attendance_status, 0) = 2 AND c.classroom_id = s.classroom_id THEN 'A' 
          WHEN COALESCE(t.attendance_status, 0) = 3 AND c.classroom_id = s.classroom_id THEN 'HD' 
          WHEN COALESCE(t.attendance_status, 0) = 4 AND c.classroom_id = s.classroom_id THEN 'H' 
          ELSE '-' END ELSE NULL END) AS Sep, 
      
          MAX(CASE WHEN EXTRACT(MONTH FROM ds.date) = 10 
          THEN CASE 
          WHEN COALESCE(t.attendance_status, 0) = 1 AND c.classroom_id = s.classroom_id THEN 'P' 
          WHEN COALESCE(t.attendance_status, 0) = 2 AND c.classroom_id = s.classroom_id THEN 'A' 
          WHEN COALESCE(t.attendance_status, 0) = 3 AND c.classroom_id = s.classroom_id THEN 'HD' 
          WHEN COALESCE(t.attendance_status, 0) = 4 AND c.classroom_id = s.classroom_id THEN 'H' 
          ELSE '-' END ELSE NULL END) AS Oct, 
      
          MAX(CASE WHEN EXTRACT(MONTH FROM ds.date) = 11 
          THEN CASE 
          WHEN COALESCE(t.attendance_status, 0) = 1 AND c.classroom_id = s.classroom_id THEN 'P' 
          WHEN COALESCE(t.attendance_status, 0) = 2 AND c.classroom_id = s.classroom_id THEN 'A' 
          WHEN COALESCE(t.attendance_status, 0) = 3 AND c.classroom_id = s.classroom_id THEN 'HD' 
          WHEN COALESCE(t.attendance_status, 0) = 4 AND c.classroom_id = s.classroom_id THEN 'H' 
          ELSE '-' END ELSE NULL END) AS Nov, 
      
          MAX(CASE WHEN EXTRACT(MONTH FROM ds.date) = 12 
          THEN CASE 
          WHEN COALESCE(t.attendance_status, 0) = 1 AND c.classroom_id = s.classroom_id THEN 'P' 
          WHEN COALESCE(t.attendance_status, 0) = 2 AND c.classroom_id = s.classroom_id THEN 'A' 
          WHEN COALESCE(t.attendance_status, 0) = 3 AND c.classroom_id = s.classroom_id THEN 'HD' 
          WHEN COALESCE(t.attendance_status, 0) = 4 AND c.classroom_id = s.classroom_id THEN 'H' 
          ELSE '-' END ELSE NULL END) AS Dec
      FROM 
          DateSequence ds
      LEFT JOIN 
          tr_attendance t ON ds.date = t.date
      LEFT JOIN 
          m_classroom_student s ON t.student_id = s.student_id
      LEFT JOIN 
          m_classroom c ON s.classroom_id = c.classroom_id
      WHERE 
          (s.student_admission_id = $2 OR s.student_admission_id IS NULL)
      GROUP BY 
          day_of_month
      ORDER BY 
          day_of_month;`,
    getAttendanceCount1: `WITH DateSequence AS (
        SELECT generate_series(start_date, end_date, interval '1 day') AS date
        FROM m_academic_year
        WHERE academic_year_id = $1
      )
      SELECT 
          COUNT(CASE WHEN t.attendance_status = 1 AND c.classroom_id = s.classroom_id THEN 1 END) AS "present",
          COUNT(CASE WHEN t.attendance_status = 2 AND c.classroom_id = s.classroom_id THEN 1 END) AS "absent",
          COUNT(CASE WHEN t.attendance_status = 3 AND c.classroom_id = s.classroom_id THEN 1 END) AS "half_day",
          COUNT(CASE WHEN t.attendance_status = 4 AND c.classroom_id = s.classroom_id THEN 1 END) AS "holiday"
      FROM 
          DateSequence ds
      LEFT JOIN 
          tr_attendance t ON ds.date = t.date
      LEFT JOIN 
          m_classroom_student s ON t.student_id = s.student_id
      LEFT JOIN 
          m_classroom c ON s.classroom_id = c.classroom_id
      WHERE 
         (s.student_admission_id = $2 OR s.student_admission_id IS NULL)`,
    
    getAttendanceCount2: `WITH DateSequence AS (
        SELECT generate_series(start_date, end_date, interval '1 day') AS date
        FROM m_academic_year
        WHERE academic_year_id = $1
    ),
    AttendanceCounts AS (
        SELECT 
            TO_CHAR(ds.date, 'Mon') AS month_name,
            EXTRACT(MONTH FROM ds.date) AS month_of_year,
            EXTRACT(YEAR FROM ds.date) AS year_of_academic,
            CASE 
                WHEN COALESCE(t.attendance_status, 0) = 1 AND c.classroom_id = s.classroom_id THEN 'P' 
                WHEN COALESCE(t.attendance_status, 0) = 2 AND c.classroom_id = s.classroom_id THEN 'A' 
                WHEN COALESCE(t.attendance_status, 0) = 3 AND c.classroom_id = s.classroom_id THEN 'HD' 
                WHEN COALESCE(t.attendance_status, 0) = 4 AND c.classroom_id = s.classroom_id THEN 'H' 
                ELSE '-' 
            END AS attendance_status
        FROM 
            DateSequence ds
        LEFT JOIN 
            tr_attendance t ON ds.date = t.date
        LEFT JOIN 
            m_classroom_student s ON t.student_id = s.student_id
        LEFT JOIN 
            m_classroom c ON s.classroom_id = c.classroom_id
        WHERE 
            (s.student_admission_id = $2 OR s.student_admission_id IS NULL)
    )
    SELECT 
        year_of_academic,
        month_name,
        month_of_year,
        SUM(CASE WHEN attendance_status = 'P' THEN 1 ELSE 0 END) AS present,
        SUM(CASE WHEN attendance_status = 'A' THEN 1 ELSE 0 END) AS absent,
        SUM(CASE WHEN attendance_status = 'HD' THEN 1 ELSE 0 END) AS half_day,
        SUM(CASE WHEN attendance_status = 'H' THEN 1 ELSE 0 END) AS holiday,
        SUM(CASE WHEN attendance_status IN ('P', 'A', 'HD', 'H') THEN 1 ELSE 0 END) AS total_count
    FROM 
        AttendanceCounts
    GROUP BY 
        year_of_academic, month_name, month_of_year
    ORDER BY 
        year_of_academic, month_of_year;
    `

}

exports.HOLIDAY = {
    getHolidayDetails: 'SELECT COUNT(*) FROM m_holiday WHERE school_id = $1 AND holiday_name = $2 AND academic_year_id = $3 AND holiday_date = $4',
    addHolidayQuery: 'INSERT INTO m_holiday (school_id, holiday_name,holiday_description, academic_year_id, holiday_date, created_by, updated_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING holiday_id;',
    getHolidayDetailsforUpdate: 'SELECT COUNT(*) FROM m_holiday WHERE holiday_id = $1 AND school_id = $2;',
    updateHolidayQuery: 'UPDATE m_holiday SET school_id = $2, holiday_name = $3, holiday_description = $4, academic_year_id = $5, holiday_date = $6, updated_by = $7 WHERE holiday_id = $1;',
    getAllHolidayQuery: 'SELECT * FROM m_holiday WHERE school_id = $1',
    ischeckHolidayIdExistsQuery: 'SELECT COUNT (*) FROM m_holiday WHERE holiday_id = $1',
    getHolidayByIdQuery: 'SELECT * FROM m_holiday WHERE holiday_id = $1',


}

exports.ASSIGNMENT = {
    addAssignmentDetails: `insert INTO m_assignment (classroom_id,subject_id,assignment_title,start_date,end_date,assignment_description,created_by,updated_by)
    values ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING assignment_id`,
    checkAssignmentExist:`select count(*) from m_assignment where classroom_id = $1 AND subject_id = $2 AND assignment_title = $3`,
    addAssignmentDocument: `insert INTO m_assignment_documents(assignment_id,classroom_id,assignment_document,created_by,updated_by)
    values ($1,$2,$3,$4,$5)`,
    // isClassRoomExistInTab:`select count(*) from m_classroom where classroom_id = $1 AND academic_year_id = $2`,
    isClassRoomExistInTab:`
    SELECT COUNT(*) AS count FROM m_classroom C
        INNER JOIN m_academic_year AY ON C.academic_year_id = AY.academic_year_id
        INNER JOIN m_school S ON S.school_id = AY.school_id
        WHERE S.school_id = $1 AND C.classroom_id = $2`,
    isSubjectExistInTab:`select count(school_id) from m_subject where subject_id = $1`,
    getAssignmentCount: `SELECT count(*) as count
    FROM m_assignment ma
    inner join m_classroom mcl on mcl.classroom_id = ma.classroom_id
    inner join m_standard ms on ms.std_id = mcl.class_id
    inner join m_section msc on msc.section_id = mcl.section_id
    inner join m_subject msb on msb.subject_id = ma.subject_id  #WHERE_CLAUSE#`,
    getAllAssignment:`SELECT 
    ma.assignment_id,ma.classroom_id,ma.subject_id,ma.assignment_title,
    ma.start_date,ma.end_date,ma.assignment_description,mcl.class_id,
    ms.std_id,ms.std_name,ms.abbr,msc.section_name,msb.subject_name
    FROM m_assignment ma
    inner join m_classroom mcl on mcl.classroom_id = ma.classroom_id
    inner join m_standard ms on ms.std_id = mcl.class_id
    inner join m_section msc on msc.section_id = mcl.section_id
    inner join m_subject msb on msb.subject_id = ma.subject_id #WHERE_CLAUSE#
     ORDER BY ma.date_updated DESC #LIMIT_CLAUSE# #OFFSET_CLAUSE#`,
    checkAssignmentById:`SELECT count(*) from m_assignment where assignment_id = $1`,
    getAssignmentById:`SELECT 
    ma.assignment_id,ma.classroom_id,ma.subject_id,ma.assignment_title,
    ma.start_date,ma.end_date,ma.assignment_description,mcl.class_id,
    ms.std_id,ms.std_name,ms.abbr,msc.section_name,msb.subject_name,
    mcl.academic_year_id,mcl.section_id,mad.assignment_document
    FROM m_assignment ma
    inner join m_classroom mcl on mcl.classroom_id = ma.classroom_id
    inner join m_standard ms on ms.std_id = mcl.class_id
    inner join m_section msc on msc.section_id = mcl.section_id
    inner join m_subject msb on msb.subject_id = ma.subject_id
    left join m_assignment_documents mad on mad.assignment_id = ma.assignment_id 
    where ma.assignment_id = $1`,
    updateQuery:`UPDATE m_assignment SET`,
    updatedAssignmentDocument:`UPDATE m_assignment_documents
    SET assignment_document = $2
    WHERE assignment_id = $1`,
    isClassRoomExistUpdate:`select count(*) from m_classroom where classroom_id = $1`,
    getAssDocDetail:`select * from m_assignment_documents where a_d_id = $1`,
    getAssignmentClassList:`select ms.std_id,ms.std_name,ms.abbr from m_assignment ma
	inner join m_classroom mc  on ma.classroom_id = mc.classroom_id
	inner join m_academic_year AY on mc.academic_year_id = AY.academic_year_id
	inner join m_standard ms on ms.std_id = mc.class_id
	where mc.academic_year_id = $1 group by ms.std_id`,
    checkAssDoc:`select count(assignment_document) from m_assignment_documents where assignment_id = $1 `,
    addAssignmentDocumentIfnot:`insert INTO m_assignment_documents(assignment_id,assignment_document) values ($1,$2)`,
    getAssDocDetailsByAssId: `select * from m_assignment_documents where assignment_id = $1`,
    isUpdateAssExistWithId:`select count(*) from m_assignment where assignment_id = $1 and subject_id = $2 and assignment_title = $3`,
    isUpdateAssExist:`select count(*) from m_assignment where subject_id = $1 and assignment_title = $2`
}

exports.STUDENT_ALLOCATION_QUERIES = {
    checkStudentExists: `SELECT COUNT(*) AS count FROM m_student_admission WHERE school_id = $1 AND student_admission_id = $2`,
    checkRollNoExistsInClassroom: `SELECT COUNT(*) AS count FROM m_classroom_student WHERE roll_no = $1 AND classroom_id = $2`,
    addClassroomStudent: `INSERT INTO public.m_classroom_student (student_admission_id, classroom_id, roll_no,updated_by, created_by)
    VALUES($1,$2,$3,$4,$5)`,
    checkAcademicYearIdValid: `SELECT COUNT(*) AS count FROM m_academic_year WHERE school_id = $1 AND  academic_year_id = $2`,
    checkClassroomIdValid: `SELECT COUNT(*) AS count FROM m_classroom WHERE academic_year_id = $1 AND classroom_id = $2`,
    checkClassroomFromValidSchool: `SELECT COUNT(*) AS count FROM m_classroom C
    INNER JOIN m_academic_year AY ON C.academic_year_id = AY.academic_year_id
    INNER JOIN m_school S ON S.school_id = AY.school_id
    WHERE S.school_id = $1 AND C.classroom_id = $2`,
    reassignRollNo: `SELECT * FROM reassignRollNumber($1, $2);`
}


exports.TEACHER_QUERIES = {
        getClassTeacherDetails:`select c.academic_year_id ,
        c.classroom_id, c.class_id,  std.std_id , std.std_name , std.abbr ,
        c.section_id , sc.section_name 
        from m_classroom c
        left join m_standard std on std.std_id  = c.class_id
        left join m_section sc on sc.section_id = c.section_id 
        where c.class_teacher = $1 and c.academic_year_id = $2;`,
        getSubjectDetails: `select c.classroom_id, c.class_id, std.std_id, std.std_name, 
        std.abbr, c.section_id, sc.section_name, cs.subject_id, sub.subject_name 
        from m_classroom_subject cs 
        left join m_subject sub on sub.subject_id = cs.subject_id 
        left join m_classroom c on c.classroom_id  = cs.classroom_id 
        left join m_standard std on std.std_id  = c.class_id
        left join m_section sc on sc.section_id = c.section_id 
        where cs.teacher_id =$1 and academic_year_id =$2;`
}