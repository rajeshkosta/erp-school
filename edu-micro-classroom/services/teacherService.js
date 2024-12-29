const { pg } = require("edu-micro-common");
const { TEACHER_QUERIES } = require('../constants/QUERY');


const getClassSubjectDetails = async (reqParams) => {
    try {

        //TODO: need to implement caching here
        const { user_id, academic_year_id } = reqParams;
        const classTeacherDetails = await getClassTeacherDetails(user_id, academic_year_id);
        const subjectDetails = await getSubjectDetails(user_id, academic_year_id);

        const classObj = subjectDetails.reduce((pv, cv) => {

            const classroomId = pv[cv.classroom_id];

            if (classroomId) {

                const subjectObj = {
                    subject_id: cv.subject_id,
                    subject_name: cv.subject_name,
                }

                classroomId['subject_list'].push(subjectObj)

            } else {

                const is_class_teacher = classTeacherDetails.some(e => e.classroom_id == cv.classroom_id);

                const tempObj = {
                    classroom_id: cv.classroom_id,
                    class_id: cv.class_id,
                    std_id: cv.std_id,
                    std_name: cv.std_name,
                    abbr: cv.abbr,
                    section_id: cv.section_id,
                    section_name: cv.section_name,
                    is_class_teacher,
                    subject_list: [{
                        subject_id: cv.subject_id,
                        subject_name: cv.subject_name,
                    }]
                }

                pv[cv.classroom_id] = tempObj;
            }
            return pv;

        }, {})


        const classSubjectDetails = []
        for (const key in classObj) {
            classSubjectDetails.push(classObj[key])
        }

        return classSubjectDetails;

    } catch (error) {
        throw error;
    }
}

const getClassTeacherDetails = async (teacher_id, academic_year_id) => {
    try {
        const query = {
            text: TEACHER_QUERIES.getClassTeacherDetails,
            values: [teacher_id, academic_year_id],
        };

        console.log(query);
        const queryResult = await pg.executeQueryPromise(query)
        return queryResult

    } catch (error) {
        throw error;
    }
}

const getSubjectDetails = async (teacher_id, academic_year_id) => {
    try {
        const query = {
            text: TEACHER_QUERIES.getSubjectDetails,
            values: [teacher_id, academic_year_id],
        };

        console.log(query);
        const queryResult = await pg.executeQueryPromise(query)
        return queryResult

    } catch (error) {
        throw error;
    }
}

module.exports = {
    getClassSubjectDetails
};



