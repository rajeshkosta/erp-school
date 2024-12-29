import { get, post } from "../../utility/ApiCall";

const AddRole = async (payload) => {
  const addingRole = await post("/api/v1/admin/role/addRole", payload);
  return addingRole;
};

const getAllRoles = async () => {
  try {
    const gettingAllRoles = await get("/api/v1/admin/role/getRoles");
    return gettingAllRoles;
  } catch (error) {
    console.error("Error organizations :", error);
    throw error;
  }
};

const getMenuList = async () => {
  const gettingMenu = await get(`/api/v1/admin/role/getMenuList/1`);
  return gettingMenu;
};

const getLevelsList = async () => {
  const gettingLevels = await get(`/api/v1/admin/role/getLevels`);
  return gettingLevels;
};

const upDateRole = async (payload) => {
  try {
    const updatingRole = await post(
      "/api/v1/admin/role/updateRoleDetails",
      payload
    );
    return updatingRole;
  } catch (error) {
    console.error("Error updating :", error);
    throw error;
  }
};

const getRoleByRoleId = async (id) => {
  const gettingTrustByTrustId = await get(`/api/v1/admin/role/getRole/${id}`);
  return gettingTrustByTrustId;
};

const getRoleAccess = async (id) => {
  const gettingRoleAccess = await get(
    `/api/v1/admin/role/getRoleAccessList/${id}`
  );
  return gettingRoleAccess;
};

export {
  getMenuList,
  getLevelsList,
  AddRole,
  getAllRoles,
  upDateRole,
  getRoleByRoleId,
  getRoleAccess,
};
