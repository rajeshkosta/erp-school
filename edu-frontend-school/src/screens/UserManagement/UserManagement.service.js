import { get, post } from "../../utility/ApiCall";

const getAllUsers = async (payload) => {
  const gettingAllUsers = await post("/api/v1/admin/user/grid", payload);
  return gettingAllUsers;
};

const addUser = async (payload) => {
  const addingUser = await post("/api/v1/admin/user/createUser", payload);
  return addingUser;
};

const updateUser = async (payload) => {
  const updatingUser = await post(
    "/api/v1/admin/user/editUser",
    payload
  );
  return updatingUser;
};

const getUserByUserId = async (id) => {
  const gettingUserByTrustId = await get(`/api/v1/admin/user/user/${id}`);
  return gettingUserByTrustId;
};

const getRolesList = async () => {
  const gettingRoles = await get(`/api/v1/admin/role/getActiveRoleList`);
  return gettingRoles;
};

const getTrustsList = async () => {
  const gettingTrusts = await post(`/api/v1/admin/trust/trustList`);
  return gettingTrusts;
};

const getSchoolList = async () => {
  const gettingTrusts = await get(`/api/v1/admin/school/schoolList`);
  return gettingTrusts;
};

const defaultPassword = async (payload) => {
  const defaultPassword = await post("/api/v1/admin/user/resetPasswordByAdmin", payload);
  return defaultPassword;
};

const updateUserStatus = async (payload) => {
  const activateStatus = await post("/api/v1/user/updateUserStatus", payload);
 return activateStatus;
};






export { getAllUsers, addUser, getRolesList, getTrustsList, getSchoolList, updateUser, getUserByUserId ,defaultPassword,updateUserStatus};
