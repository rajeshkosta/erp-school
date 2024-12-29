import { get, post } from "../../utility/ApiCall";

const getStatesList = async () => {
  const gettingStatesList = await get(`/api/v1/admin/location/states`);
  return gettingStatesList;
};

const getDistrictsList = async (id) => {
  const gettingDistrictsList = await get(
    `/api/v1/admin/location/districts/${id}`
  );
  return gettingDistrictsList;
};

const getBlocksList = async (id) => {
  const gettingBlocksList = await get(`/api/v1/admin/location/blocks/${id}`);
  return gettingBlocksList;
};

const addStudentRegistration = async (payload) => {
  const addingStudentRegistration = await post(
    `/api/v1/registration/student/create`,
    payload
  );
  return addingStudentRegistration;
};

const getClassList = async () => {
  const gettingClassList = await get(`/api/v1/admin/master/getClasses`);
  return gettingClassList;
};

export {
  getStatesList,
  getDistrictsList,
  getBlocksList,
  addStudentRegistration,
  getClassList,
};
