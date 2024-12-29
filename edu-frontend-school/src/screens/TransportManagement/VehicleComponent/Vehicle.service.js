import { get, post } from "../../../utility/ApiCall";

const getAllVehicles = async (payload) => {
  const gettingAllVehicles = await post(
    "/api/v1/transport/vehicle/getall",
    payload
  );
  return gettingAllVehicles;
};

const AddVehicle = async (payload) => {
  const addingVehicle = await post("/api/v1/transport/vehicle/add", payload);
  return addingVehicle;
};

const UpdateVehicle = async (payload) => {
  const updatingVehicle = await post(
    "/api/v1/transport/vehicle/update",
    payload
  );
  return updatingVehicle;
};

const getVehicleByVehicleId = async (id) => {
  const gettingVehicalByVehicleId = await get(
    `/api/v1/transport/vehicle/getVehicle/${id}`
  );
  return gettingVehicalByVehicleId;
};

const getRolesList = async () => {
  const gettingRoles = await get(`/api/v1/admin/role/getRoleListBySchool`);
  return gettingRoles;
};

const getUsersList = async (id) => {
  const gettingUsers = await get(`/api/v1/admin/user/getUsersByRole/${id}`);
  return gettingUsers;
};

const getRoutesList = async (payload) => {
  const gettingRoutes = await post(
    `/api/v1/transport/route/getAllRoutes`,
    payload
  );
  return gettingRoutes;
};

export {
  getAllVehicles,
  AddVehicle,
  UpdateVehicle,
  getVehicleByVehicleId,
  getUsersList,
  getRolesList,
  getRoutesList,
};
