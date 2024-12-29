import { get, post } from "../../../utility/ApiCall";

const addExamType = async (payload) => {
  const addingExamType = await post(
    "/api/v1/admin/exam/createExamType",
    payload
  );
  return addingExamType;
};

const getExamType = async () => {
  const gettingExamType = await get("/api/v1/admin/exam/getAllExamsType");
  return gettingExamType;
};

const updateExamType = async (payload) => {
  const updatingExamType = await post(
    "/api/v1/admin/exam/updateExamType",
    payload
  );
  return updatingExamType;
};

const getExamTypeByExamTypeId = async (id) => {
  const gettingExamTypeByExamTypeId = await get(
    `/api/v1/admin/exam/getExamTypeById/${id}`
  );
  return gettingExamTypeByExamTypeId;
};

export { addExamType, getExamType, updateExamType, getExamTypeByExamTypeId };
