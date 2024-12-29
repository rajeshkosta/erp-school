import { get, post } from "../../utility/ApiCall";

const getAllAssignMarks = async (payload) => {
  const gettingAllAssignMarks = await post(
    "/api/v1/admin/assignMarks/getAllAssignMarks",
    payload
  );
  return gettingAllAssignMarks;
};

const getAssignedMarks = async (payload) => {
  const addingAssignedMarks = await post(
    "/api/v1/admin/assignMarks/getAssignMarksByStudentId",
    payload
  );
  return addingAssignedMarks;
};

export { getAssignedMarks, getAllAssignMarks };
