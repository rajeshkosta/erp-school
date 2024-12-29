import { get, post } from "../../utility/ApiCall";

const AddClass = async (payload) => {
  const addingClass = await post("/api/v1/classroom/addClassroom", payload);
  return addingClass;
};

const UpdateClass = async (payload) => {
  const updatingClass = await post(
    "/api/v1/classroom/updateClassroom",
    payload
  );
  return updatingClass;
};

const getClassroomByClassroomId = async (id) => {
  const gettingClassroomByClassroomId = await get(
    `/api/v1/classroom/getClassroom/${id}`
  );
  return gettingClassroomByClassroomId;
};

const getAllClass = async (payload) => {
  const gettingAllClass = await post(
    "/api/v1/classroom/getAllClassrooms",
    payload
  );
  return gettingAllClass;
};

const getSectionList = async () => {
  const gettingSectionsList = await get(`/api/v1/admin/section/getAllSection`);
  return gettingSectionsList;
};

const getClassTeacherList = async (payload) => {
  const gettingClassTeacherList = await post(
    `/api/v1/admin/user/getUserList`,
    payload
  );
  return gettingClassTeacherList;
};

const getAcademicList = async () => {
  const getAcademicList = await get(`/api/v1/admin/academic_year/activeList`);
  return getAcademicList;
};

const getSubjectList = async () => {
  const gettingSubjectList = await get(`/api/v1/admin/subject/getAllSubjects`);
  return gettingSubjectList;
};

const getClassList = async () => {
  const gettingClassList = await get(`/api/v1/admin/master/getSchoolClasses`);
  return gettingClassList;
};

export {
  AddClass,
  getAllClass,
  getSectionList,
  getSubjectList,
  getClassList,
  UpdateClass,
  getAcademicList,
  getClassroomByClassroomId,
  getClassTeacherList,
};
