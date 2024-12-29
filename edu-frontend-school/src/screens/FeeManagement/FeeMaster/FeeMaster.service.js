import { get, post } from "../../../utility/ApiCall";

const getAllClass = async () => {
  const gettingAllClass = await get("/api/v1/admin/master/getSchoolClasses");
  return gettingAllClass;
};

const getFeeType = async () => {
  const gettingFeeType = await get("/api/v1/admin/feetype/getAllfees");
  return gettingFeeType;
};

const AddFeeMaster = async (payload) => {
  const addingFeeMaster = await post("/api/v1/admin/feemaster/create", payload);
  return addingFeeMaster;
};

const getClassListByFee = async (payload) => {
  const gettingClassListByFee = await post(
    "/api/v1/admin/feemaster/getClassListByFeeConfig",
    payload
  );
  return gettingClassListByFee;
};

const getAllClassByClassIdGrid = async (payload) => {
  const gettingAllClassByClassIdGrid = await post(
    "/api/v1/admin/feemaster/getFeeMasterGridByClassId",
    payload
  );
  return gettingAllClassByClassIdGrid;
};

const getFeesByFeesId = async (id) => {
  const gettingFeesByFeesId = await get(
    `/api/v1/admin/feemaster/getFeeMaster/${id}`
  );
  return gettingFeesByFeesId;
};

const updateFeeMaster = async (payload) => {
  const gettingUpdatedFeeData = await post(
    "/api/v1/admin/feemaster/update",
    payload
  );
  return gettingUpdatedFeeData;
};

export {
  getAllClass,
  getFeeType,
  AddFeeMaster,
  getClassListByFee,
  getAllClassByClassIdGrid,
  getFeesByFeesId,
  updateFeeMaster,
};
