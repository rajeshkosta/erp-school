import { get, post } from "../../../utility/ApiCall";

const AddExam = async (payload) => {
  const addingExam = await post("/api/v1/admin/examination/create", payload);
  return addingExam;
};

const UpdateExam = async (payload) => {
  const updatingExam = await post("/api/v1/admin/examination/update", payload);
  return updatingExam;
};

const getAllExam = async (payload) => {
  const gettingAllExam = await post(
    "/api/v1/admin/examination/examinationlist/grid",
    payload
  );
  return gettingAllExam;
};

const getAllClassByClassIdGrid = async (academicId, classId) => {
  const gettingAllClassByClassIdGrid = await get(
    `/api/v1/admin/examination/examListByClass/${academicId}/${classId}`
  );
  return gettingAllClassByClassIdGrid;
};

const getClassListByExam = async (id) => {
  const gettingClassListByExam = await get(
    `/api/v1/admin/examination/classList/${id}`
  );
  return gettingClassListByExam;
};

const getExamByExamId = async (id) => {
  const gettingExamByExamId = await get(
    `/api/v1/admin/examination/getByExaminationId/${id}`
  );
  return gettingExamByExamId;
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
    `/api/v1/classroom/getSubjectsByStd`,
    payload
  );
  return gettingSubjectList;
};

const getExamTypeList = async () => {
  const gettingExamTypeList = await get(`/api/v1/admin/exam/getAllExamsType`);
  return gettingExamTypeList;
};

export {
  getAllExam,
  getClassroomList,
  getSubjectList,
  getExamTypeList,
  AddExam,
  UpdateExam,
  getExamByExamId,
  getAcademicList,
  getAllClassByClassIdGrid,
  getClassListByExam,
};
