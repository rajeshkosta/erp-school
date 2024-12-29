exports.PARENT = {
  insertParentQuery: `
      INSERT INTO m_parent (
        school_id,
        parent_name,
        mobile_no,
        email_id,
        dob,
        gender,
        address,
        relationship_to_student,
        occupation,
        is_govt_employee,
        work_address,
        emergency_contact,
        status,
        updated_by,
        created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *;
    `,


  checkIfExist: `
        SELECT COUNT(*) FROM m_parent
        WHERE mobile_no = $1
        LIMIT 1;
    `,

  getAllParentsQuery: `
  SELECT
    school_id,
    parent_name,
    mobile_no,
    email_id,
    dob,
    gender,
    address,
    relationship_to_student,
    occupation,
    is_govt_employee,
    work_address,
    emergency_contact,
    status,
    updated_by,
    created_by
  FROM m_parent;
`,

  getByMobileQuery: `
SELECT
  parent_id,
  school_id,
  parent_name,
  mobile_no,
  email_id,
  dob,
  gender,
  address,
  relationship_to_student,
  occupation,
  is_govt_employee,
  work_address,
  emergency_contact,
  status,
  updated_by,
  created_by
FROM
  m_parent
WHERE
  mobile_no = $1;
`,

  getParentByIDquery: `
  SELECT
    school_id,
    parent_name,
    mobile_no,
    email_id,
    dob,
    gender,
    address,
    relationship_to_student,
    occupation,
    is_govt_employee,
    work_address,
    emergency_contact,
    status,
    updated_by,
    created_by
  FROM
    m_parent
  WHERE
    parent_id = $1;
`,


  updateParentQuery: `
  UPDATE m_parent
  SET
    school_id = $1,
    parent_name = $2,
    email_id = $3,
    dob = $4,
    gender = $5,
    address = $6,
    relationship_to_student = $7,
    occupation = $8,
    is_govt_employee = $9,
    work_address = $10,
    emergency_contact = $11,
    status = $12,
    updated_by = $13,
    date_modified = $14
  WHERE parent_id = $15
  RETURNING *;
`,


};

exports.STUDENT_REGISTRATION = {
  checkStudentAvailable: `select COUNT(*) AS count from m_student_registration where first_name ilike $1 AND gender_id = $2 AND dob = $3 AND mobile_number = $4`,
  insertContactFormQuery: `insert into tr_contact_us(school_id,name,email_address,mobile_number,message) values($1, $2, $3,$4,$5)  RETURNING contact_id`,
  getSchoolAccessDetails: "select school_id from m_access_key where access_key=$1",
  checkAccessKey: "SELECT COUNT(*) AS count FROM m_access_key where access_key=$1",
  checkStudentExist: 'select COUNT(*) AS count from m_student_registration where aadhaar_no = $1',
  updateStudent: "UPDATE m_student_registration SET ",
  getSpecificStudentDetails: "SELECT * from m_student_registration WHERE student_reg_id = $1",

  createStudent: `INSERT INTO m_student_registration (first_name, middle_name, last_name, father_name,
      mother_name, class_id, gender_id, dob, email_id, mobile_number, alternate_mobile_number,
      nationality, religion, caste_category, caste, current_address, current_address_state_id,
      current_address_district_id, current_address_city, current_address_pincode, current_address_block_id, 
      permanent_address, permanent_address_state_id, permanent_address_district_id, 
      permanent_address_city, permanent_address_pincode, permanent_address_block_id,
      blood_group, father_email, father_occupation, mother_email, mother_occupation,
      previous_school_name, previous_school_board, previous_class, previous_school_year,
      previous_class_percentage_grade, academic_session, mothertongue,student_reg_number,school_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24
          ,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36,$37,$38,$39,$40,$41) RETURNING student_reg_id`
};

exports.FEEC_ONFIG = {
  getAllfeeConfigsCount: `SELECT COUNT(*) AS count FROM m_fees_config fc #WHERE_CLAUSE#`,
  getAllfeeconfigs: `with cte_tr_transaction as(
    select fc.fees_config_id,fc.academic_year_id,fc.total_amount as tr_total_amount
    ,fc.discount_amount,sa.first_name,sa.student_admission_number
    ,sa.gender_id,sum(COALESCE(paying_amount,0)) as paid_amount
    from m_fees_config fc
    inner join m_student_admission sa 
    on fc.student_admission_id = sa.student_admission_id
    left join tr_transaction tr ON fc.fees_config_id = tr.fees_config_id 
    #WHERE_CLAUSE#
    group by fc.fees_config_id , sa.student_admission_id)
    select *,tr_total_amount - coalesce(discount_amount,0)-paid_amount as balance_amount
    from cte_tr_transaction;`,
  getAllFeesconfigCount: `SELECT COUNT(*) AS count FROM m_fees_config fc #WHERE_CLAUSE#`,
  deleteFeesConfigMapping: 'delete from m_fees_config_mapping where fees_config_id = $1',
  updateFeeconfig: " UPDATE m_fees_config  SET  total_amount = $1, is_discount = $2, discount_amount = $3, discount_note = $4, status = $5, updated_by=$6 , date_modified=now() WHERE fees_config_id = $7; ",
  checkisFeeconfigDetailsExist: "select COUNT(*) AS count from m_fees_config where fees_config_id = $1",
  createFeeConfig: `INSERT INTO m_fees_config(academic_year_id, student_admission_id,total_amount,class_id, is_discount,discount_amount, discount_note, status,updated_by,created_by,date_created,date_modified) values($1, $2, $3, $4, $5, $6 ,$7 ,$8,$9, $10, now(), now()) RETURNING fees_config_id`,
  createFeeConfigMapping: `INSERT INTO m_fees_config_mapping(fees_config_id, fees_master_id,amount,status, updated_by,created_by,date_created,date_modified) values($1, $2, $3, $4, $5, $6, now(), now()) RETURNING fees_config_map_id`,
  getSpecificFeeConfigDetails: `SELECT * from m_fees_config WHERE fees_config_id = $1`,
  getAllfeesConfig: `
  select mfcm.fees_config_map_id, 
  mfcm.fees_master_id, mfcm.amount, mfcm.date_created,
  mft.fees_type_id, mft.fees_type
  from m_fees_config_mapping mfcm
  left join m_fees_master mfm on mfcm.fees_master_id = mfm.fees_master_id 
  left join m_fees_type mft on mfm.fees_type_id = mft.fees_type_id 
  where mfcm.fees_config_id = $1`,
  getfeesConfig: `with cte_fees_config as(
    SELECT 
        mfc.fees_config_id,
        mfc.academic_year_id,
        mfc.student_admission_id,
        mfc.total_amount AS fees_total_amount,
        mfc.class_id AS fees_class_id,
        mfc.is_discount,
        mfc.discount_amount,
        mfc.discount_note,
        sum(coalesce(  tt.paying_amount,0)) as paid_amount
      
    FROM 
        m_fees_config AS mfc
    LEFT JOIN 
        tr_transaction AS tt ON mfc.fees_config_id = tt.fees_config_id
      
      where mfc.academic_year_id= $1 AND mfc.student_admission_id= $2
      group by mfc.fees_config_id)
      select *,fees_total_amount - coalesce(discount_amount,0)-paid_amount as balance_amount
      
        from cte_fees_config;
`,
  getFeeConfigByAcademicAndStudentIds: `SELECT COUNT(*) FROM m_fees_config WHERE academic_year_id = $1 AND student_admission_id = $2`,
}

exports.TRANSACTION = {

  transactionList: "select * from tr_transaction where invoice_id = $1 OR transaction_id = $2",
  checkTransactionExist: "select COUNT(*) AS count from tr_transaction where transaction_id = $1",
  checkTransactionExistbyvoiceid: "select COUNT(*) AS count from tr_transaction where invoice_id = $1",
  createTransaction: `INSERT INTO tr_transaction(student_admission_id, class_id,academic_year_id,fees_config_id,total_amount, paying_amount,date,invoice_id, balance_amount, transaction_mode_id,status,updated_by,created_by) values($1, $2, $3, $4, $5, $6 ,$7 ,$8, $9, $10, $11, $12, $13) RETURNING transaction_id`,
  getSpecifictransactionDetails: `SELECT tr.*, trt.transaction_mode_name FROM tr_transaction tr JOIN m_transaction_mode trt ON tr.transaction_mode_id = trt.transaction_mode_id where transaction_id = $1;`,
  getAllTransactions: 'SELECT tr.transaction_mode_id,tr.invoice_id, tr.student_admission_id, tr.class_id, tr.date, tr.fees_config_id, tr.academic_year_id, tr.paying_amount,tr.balance_amount,tr.status, tm.transaction_mode_name FROM tr_transaction tr LEFT JOIN m_transaction_mode tm ON tr.transaction_mode_id = tm.transaction_mode_id WHERE tr.fees_config_id = $1 order by tr.date_created, tr.date_updated',
  checkStudentAdmissionId: `SELECT count(*) from tr_transaction where student_admission_id = $1`,
  getTransactionById: `select transaction_id,paying_amount,date,transaction_mode_id,invoice_id from tr_transaction where student_admission_id = $1 AND academic_year_id = $2`,



}


exports.STUDENT_ADMISSION = {
  getStudentDocumentByAdmissionId: `select document_name,document_path,document_type from m_student_admission_document where student_admission_id =$1`,
  checkStudentExist: 'select COUNT(*) AS count from m_student_admission where aadhaar_no = $1',
  checkStudentExistById: 'select COUNT(*) AS count from m_student_admission where student_admission_id = $1',
  updateStudent: "UPDATE m_student_admission SET ",
  getStudentDetailsByAdmissionId: "SELECT * from m_student_admission WHERE student_admission_id = $1",

  getStudentlistbyAcademicIdAndClassID: `select cs.student_admission_id, sa.student_admission_id from m_student_admission sa
                left join m_classroom_student cs on cs.student_admission_id = sa.student_admission_id
                where sa.class_id=$1 and sa.academic_session=$2`,

  //   getAllStudentList: `SELECT CONCAT(first_name,' ',middle_name,' ',last_name) AS "full_name",
  //   TO_CHAR(dob::TIMESTAMP, 'DD-MM-YYYY') as "dob",
  //   TO_CHAR(admission_date::TIMESTAMP, 'DD-MM-YYYY') as "admission_date",
  //   mobile_number,status,blood_group,
  // (SELECT std_name FROM M_standard WHERE std_id = class_id) as "std_name",
  //   class_id as std_id,student_admission_id,student_admission_number,
  // CASE
  //       WHEN gender_id = 1 THEN 'Male'
  //       WHEN gender_id = 2 THEN 'Female'
  //       ELSE 'Others'
  //   END AS gender,gender_id,nationality,caste,caste_category,religion,academic_session as academic_year_id
  // FROM m_student_admission #WHERE_CLAUSE# ORDER BY student_admission_id #LIMIT_CLAUSE# #OFFSET_CLAUSE#`,



  getAllStudentList: `with cte_student as (
  SELECT school_id,CONCAT(first_name,' ',middle_name,' ',last_name) AS "full_name",
     TO_CHAR(dob::TIMESTAMP, 'DD-MM-YYYY') as "dob",
     TO_CHAR(admission_date::TIMESTAMP, 'DD-MM-YYYY') as "admission_date",
  mobile_number,sa.status,blood_group,st.std_name as std_name_admission,
  class_id as std_id_admission,student_admission_id,student_admission_number,gender_id,
  sa.date_created,sa.date_modified,sa.academic_session,sa.father_name
  FROM m_student_admission sa left join M_standard st on st.std_id=sa.class_id #CTE_STUDENT_WHERE_CLAUSE#
),
cte_class as (
  select cs.student_admission_id,cs.roll_no,cl.classroom_id,cl.section_id,cl.class_id,
  st.std_name,st.abbr,se.section_name,cl.academic_year_id
  from m_classroom_student cs
  inner join m_classroom cl on cl.classroom_id=cs.classroom_id
  inner join m_academic_year ay on ay.academic_year_id=cl.academic_year_id
  inner join m_standard st on st.std_id=cl.class_id
  inner join m_section se on se.section_id=cl.section_id
  #CTE_CLASS_WHERE_CLAUSE#
),
cte_fee as(
  SELECT cf.student_admission_id,cf.fees_config_id,cf.total_amount,
  COALESCE(cf.discount_amount, 0) AS discount_amount,
  SUM(COALESCE(tr.paying_amount, 0)) AS paid_amount
  FROM m_fees_config cf
  LEFT JOIN tr_transaction tr ON tr.fees_config_id = cf.fees_config_id
  #CTE_FEE_WHERE_CLAUSE#
  GROUP BY
  cf.student_admission_id,cf.fees_config_id,cf.total_amount,cf.discount_amount
)
select cs.*,cl.roll_no,cl.std_name,cl.section_name,cf.total_amount,cf.discount_amount,
cf.paid_amount,cf.total_amount - COALESCE(cf.discount_amount, 0) - cf.paid_amount AS pending_amount,
COALESCE(cl.academic_year_id,cs.academic_session::INT) as academic_year_id
from cte_student cs 
left join cte_class cl on cs.student_admission_id=cl.student_admission_id
left join cte_fee cf on cs.student_admission_id=cf.student_admission_id
#CTE_CLAUSE# order by date_modified desc, date_created desc #LIMIT_CLAUSE# #OFFSET_CLAUSE#`,

//  getAllStudentCount: `SELECT COUNT(*) AS count FROM m_student_admission #WHERE_CLAUSE#`,


getAllStudentCount: `with cte_student as (
  SELECT school_id,CONCAT(first_name,' ',middle_name,' ',last_name) AS "full_name",
     TO_CHAR(dob::TIMESTAMP, 'DD-MM-YYYY') as "dob",
     TO_CHAR(admission_date::TIMESTAMP, 'DD-MM-YYYY') as "admission_date",
  mobile_number,sa.status,blood_group,st.std_name as std_name_admission,
  class_id as std_id_admission,student_admission_id,student_admission_number,gender_id,
  sa.date_created,sa.date_modified,sa.academic_session
  FROM m_student_admission sa left join M_standard st on st.std_id=sa.class_id #CTE_STUDENT_WHERE_CLAUSE#
),
cte_class as (
  select cs.student_admission_id,cs.roll_no,cl.classroom_id,cl.section_id,cl.class_id,
  st.std_name,st.abbr,se.section_name,cl.academic_year_id
  from m_classroom_student cs
  inner join m_classroom cl on cl.classroom_id=cs.classroom_id
  inner join m_academic_year ay on ay.academic_year_id=cl.academic_year_id
  inner join m_standard st on st.std_id=cl.class_id
  inner join m_section se on se.section_id=cl.section_id
  #CTE_CLASS_WHERE_CLAUSE#
),
cte_fee as(
  SELECT cf.student_admission_id,cf.fees_config_id,cf.total_amount,
  COALESCE(cf.discount_amount, 0) AS discount_amount,
  SUM(COALESCE(tr.paying_amount, 0)) AS paid_amount
  FROM m_fees_config cf
  LEFT JOIN tr_transaction tr ON tr.fees_config_id = cf.fees_config_id
  #CTE_FEE_WHERE_CLAUSE#
  GROUP BY
  cf.student_admission_id,cf.fees_config_id,cf.total_amount,cf.discount_amount
)
select COUNT(*) AS count from cte_student cs 
left join cte_class cl on cs.student_admission_id=cl.student_admission_id
left join cte_fee cf on cs.student_admission_id=cf.student_admission_id
#CTE_CLAUSE# #LIMIT_CLAUSE# #OFFSET_CLAUSE#`,


  checkStudentAvailavle: `select COUNT(*) AS count from m_student_admission where first_name ilike $1 AND gender_id = $2 AND dob = $3 AND mobile_number = $4 AND school_id=$5`,


  getStudentDataById: `with cte_student as (
    SELECT sa.school_id,CONCAT(first_name,' ',middle_name,' ',last_name) AS "full_name",
      TO_CHAR(dob::TIMESTAMP, 'DD-MM-YYYY') as "dob",
      TO_CHAR(admission_date::TIMESTAMP, 'DD-MM-YYYY') as "admission_date",
      email_id,current_address,permanent_address,
      mobile_number,sa.status,blood_group,st.std_name as std_name_admission,
      class_id as std_id_admission,student_admission_id,student_admission_number,gender_id,
      sa.date_created,sa.date_modified,sa.academic_session,ay.academic_year_name,
      sa.father_name,sa.father_email,sa.father_occupation,sa.mother_name,sa.mother_email,sa.mother_occupation
      FROM m_student_admission sa left join M_standard st on st.std_id=sa.class_id 
      left join m_academic_year ay on ay.academic_year_id=sa.academic_session::INT
    where student_admission_id=$1
  ),
    cte_class as (  
    select ay.academic_year_name,ay.academic_year_id,cs.student_admission_id,cs.roll_no,cl.classroom_id,cl.section_id,cl.class_id,
      st.std_name,st.abbr,se.section_name
      from m_classroom_student cs
      inner join m_classroom cl on cl.classroom_id=cs.classroom_id
      inner join m_academic_year ay on ay.academic_year_id=cl.academic_year_id
      inner join m_standard st on st.std_id=cl.class_id
      inner join m_section se on se.section_id=cl.section_id
     where student_admission_id=$1 and ay.academic_year_id=$2
    )
    select cs.*,cl.roll_no,cl.std_name,cl.section_name,cl.academic_year_name ,
    COALESCE(cl.academic_year_name,cs.academic_year_name)
    from cte_student cs 
    left join cte_class cl on cs.student_admission_id=cl.student_admission_id`,

  getStudentAdmissionDetails: `select admission_document_id,document_path,document_name,document_type from 
                m_student_admission_document where student_admission_id=$1`






};

