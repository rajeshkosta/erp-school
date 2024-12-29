import { get, post } from "../../../../utility/ApiCall";

const getStudentPersonalInfo = async (payload) => {
  const gettingStudentPersonalInfo = await post(
    `api/v1/registration/admission/getStudentProfileDetailsById`,payload
  );
  return gettingStudentPersonalInfo;
};

const getStudentFeesDetails = async (payload) => {
  const gettingStudentFeesDetails = await post(
    `api/v1/registration/transaction/getTransctionListByStudAdmissionId`,
    payload
  );
  return gettingStudentFeesDetails;
};
const getAttendanceRecord = async (payload) => {
  const gettingAttendanceRecord = await post(
    `/api/v1/classroom/attendance/getAttendance`,
    payload
  );
  return gettingAttendanceRecord;
};

export { getStudentPersonalInfo, getStudentFeesDetails, getAttendanceRecord };
