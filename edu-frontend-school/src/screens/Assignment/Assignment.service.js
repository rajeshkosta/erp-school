import { get, post } from "../../utility/ApiCall";

const AddAssignment = async (payload) => {
  const addingAssignment = await post(
    "/api/v1/classroom/assignment/addAssignment",
    payload
  );
  return addingAssignment;
};

const UpdateAssignment = async (payload) => {
  const updatingAssignment = await post(
    "/api/v1/classroom/assignment/update",
    payload
  );
  return updatingAssignment;
};

const getAllAssignment = async (payload) => {
  const gettingAllAssignment = await post(
    "/api/v1/admin/assignment//grid",
    payload
  );
  return gettingAllAssignment;
};

const getAllClassByClassIdGrid = async (payload) => {
  const gettingAllClassByClassIdGrid = await post(
    `/api/v1/classroom/assignment/getAll`,
    payload
  );
  return gettingAllClassByClassIdGrid;
};

const getClassListByAssignment = async (payload) => {
  const gettingClassListByAssignment = await post(
    `/api/v1/classroom/assignment/assignmentClassList`,
    payload
  );
  return gettingClassListByAssignment;
};

const getAssignmentByAssignmentId = async (id) => {
  const gettingAssignmentByAssignmentId = await get(
    `/api/v1/classroom/assignment/getAssignment/${id}`
  );
  return gettingAssignmentByAssignmentId;
};

const getAcademicList = async () => {
  const getAcademicList = await get(`/api/v1/admin/academic_year/activeList`);
  return getAcademicList;
};

const getClassroomList = async (payload) => {
  const gettingAllClass = await post(
    "/api/v1/classroom/getClassByYear",
    payload
  );
  return gettingAllClass;
};

const getSubjectList = async (payload) => {
  const gettingSubjectList = await post(
    `/api/v1/classroom/getSubjectsByClassroomId`,
    payload
  );
  return gettingSubjectList;
};

const getSectionList = async (payload) => {
  const gettingSectionList = await post(
    `/api/v1/classroom/getSectionsByStd`,
    payload
  );
  return gettingSectionList;
};

export {
  getAllAssignment,
  getClassroomList,
  getSubjectList,
  AddAssignment,
  UpdateAssignment,
  getAssignmentByAssignmentId,
  getAcademicList,
  getAllClassByClassIdGrid,
  getClassListByAssignment,
  getSectionList,
};
