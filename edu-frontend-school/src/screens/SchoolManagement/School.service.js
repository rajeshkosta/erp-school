import { get, post } from "../../utility/ApiCall";

const AddSchool = async (payload) => {
  const addingOrganization = await post(
    "/api/v1/admin/school/addSchool",
    payload
  );
  return addingOrganization;
};

const getAllSchools = async () => {
  const gettingAllSchools = await post("/api/v1/admin/school/getAllSchool");
  return gettingAllSchools;
};

const getSchhoByScholId = async (id) => {
  const gettingSchoolBySchoolId = await get(
    `/api/v1/admin/school/getSchool/${id}`
  );
  return gettingSchoolBySchoolId;
};

const upDateSchool = async (payload) => {
  const updatingSchool = await post("/api/v1/admin/school/update", payload);
  return updatingSchool;
};

export { AddSchool, getAllSchools, getSchhoByScholId, upDateSchool };
