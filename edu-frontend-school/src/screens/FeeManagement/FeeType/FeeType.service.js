 import { post, get } from "../../../utility/ApiCall";

const addFeeType = async (payload) => {
  const addingFeeType = await post("/api/v1/admin/feetype/create", payload);
  return addingFeeType;
};

const getFeeType = async () => {
  const gettingFeeType = await get("/api/v1/admin/feetype/getAllfees");
  return gettingFeeType;
};

const updateFeeType = async (payload) => {
  const updatingFeeType = await post(
    "/api/v1/admin/feetype/update",
    payload
  );
  return updatingFeeType;
};

const getFeeTypeById = async (id) => {
  const gettingFeeTypeByFeeId = await get(
    `/api/v1/admin/feetype/getFeeTypeById/${id}`
  );
  return gettingFeeTypeByFeeId;
};

export { addFeeType, getFeeType, updateFeeType, getFeeTypeById };
