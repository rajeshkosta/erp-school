import { get, post } from "../../utility/ApiCall";

const AddOrganization = async (payload) => {
  const addingOrganization = await post("/api/v1/admin/trust/create", payload);
  return addingOrganization;
};

const getAllOrganizations = async (payload) => {
  const gettingAllOrganizations = await post(
    "/api/v1/admin/trust/getAllTrusts",
    payload
  );
  return gettingAllOrganizations;
};

const getTrustByTrustId = async (id) => {
  const gettingTrustByTrustId = await get(`/api/v1/admin/trust/getTrust/${id}`);
  return gettingTrustByTrustId;
};

const upDateOrganization = async (payload) => {
  const updatingOrganization = await post(
    "/api/v1/admin/trust/update",
    payload
  );
  return updatingOrganization;
};

export {
  getTrustByTrustId,
  AddOrganization,
  getAllOrganizations,
  upDateOrganization,
};
