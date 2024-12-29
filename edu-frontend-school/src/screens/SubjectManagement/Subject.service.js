import { post, get } from "../../utility/ApiCall";

const addSubject = async (payload) => {
  const addingSubject = await post("/api/v1/admin/subject/addSubject", payload);
  return addingSubject;
};

const getSubject = async () => {
  const gettingSubject = await get("/api/v1/admin/subject/getAllSubjects");
  return gettingSubject;
};

const updateSubject = async (payload) => {
  const updatingSubject = await post(
    "/api/v1/admin/subject/updateSubject",
    payload
  );
  return updatingSubject;
};

const getSubjectBySubjectId = async (id) => {
  const gettingSubjectBySubjectId = await get(
    `/api/v1/admin/subject/getSubjectById/${id}`
  );
  return gettingSubjectBySubjectId;
};

const getSuggestedSubjects = async () => {
  const gettingSuggestedSubjects = await get(
    "/api/v1/admin/subject/subjectSuggestion"
  );
  return gettingSuggestedSubjects;
};

export {
  addSubject,
  getSubject,
  updateSubject,
  getSubjectBySubjectId,
  getSuggestedSubjects,
};
