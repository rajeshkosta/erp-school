import { get, post } from "../../utility/ApiCall";

const getStudentListOfClass = async (payload) => {
  const addingClass = await post(
    "/api/v1/classroom/attendance/getClassroomAttendance",
    payload
  );
  return addingClass;
};

const addStudentClassAttendance = async (payload) => {
  const addingAttendancetoClass = await post(
    "/api/v1/classroom/attendance/addAttendance",
    payload
  );
  return addingAttendancetoClass;
};

export { getStudentListOfClass, addStudentClassAttendance };
