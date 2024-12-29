import { get, post } from "../../utility/ApiCall";

const updateProfile = async (payload) => {
  const updatingProfile = await post("/api/v1/user/updateUser", payload);
  return updatingProfile;
};

const updateProfilePic = async (payload) => {
  const updatingProfilePic = await post(
    "/api/v1/admin/user/uploadProfilePic",
    payload
  );
  return updatingProfilePic;
};

const getUserByUserId = async (id) => {
  const gettingUserByUserId = await get(`/api/v1/admin/user/user/${id}`);
  return gettingUserByUserId;
};

const sendOtpUpdateMobileNumber = async (payload) => {
  const getSendOtpUpdateMobileNumber = await post(
    "/api/v1/user/sendOTPUpdateMobileNumber",
    payload
  );
  return getSendOtpUpdateMobileNumber;
};

const updateMobileNumber = async (payload) => {
  const getUpdateMobileNumber = await post(
    "/api/v1/user/updateMobileNumber",
    payload
  );
  return getUpdateMobileNumber;
};

export {
  updateProfile,
  getUserByUserId,
  updateProfilePic,
  sendOtpUpdateMobileNumber,
  updateMobileNumber,
};
