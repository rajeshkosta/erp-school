import { post } from "../../utility/ApiCall";

const getClassroomStudents = async (payload) => {
  const gettingClassroomStudents = await post(
    `api/v1/classroom/student/getClassroomStudents`,
    payload
  );
  return gettingClassroomStudents;
};

export { getClassroomStudents };
