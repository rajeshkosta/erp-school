const SCHOOL_QUERIES = {
    getSchoolDetails: `SELECT school_name, contact_no, address, logo_url FROM m_school WHERE school_id = $1`
}


module.exports = {
    SCHOOL_QUERIES
}