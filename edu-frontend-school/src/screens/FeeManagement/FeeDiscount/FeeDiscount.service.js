import { get, post } from "../../../utility/ApiCall";

const AddFeeDiscount = async (payload) => {
  const addingFeeDiscount = await post(
    "/api/v1/admin/feeDiscount/create",
    payload
  );
  return addingFeeDiscount;
};

const getAllFeeDiscount = async () => {
  const gettingFeeDiscount = await get(
    "/api/v1/admin/feeDiscount/getAllfeediscount"
  );
  return gettingFeeDiscount;
};

const updateFeeDiscount = async (payload) => {
  const updatingFeeDiscount = await post(
    "/api/v1/admin/feeDiscount/update",
    payload
  );
  return updatingFeeDiscount;
};

const getFeeDiscountById = async (id) => {
  const gettingFeeDiscount = await get(
    `/api/v1/admin/feeDiscount/getFeediscountById/${id}`
  );
  return gettingFeeDiscount;
};

export {
  AddFeeDiscount,
  getAllFeeDiscount,
  updateFeeDiscount,
  getFeeDiscountById,
};
