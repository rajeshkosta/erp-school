import { get, post } from "../../utility/ApiCall";

const loginPassword = async (payload) => {
  const loginByMobileRes = await post("/api/v1/auth/login", payload);
  return loginByMobileRes;
};

const loginWithMobile = async (payload) => {
  const loginByMobile = await post("/api/v1/auth/getOtp", payload);
  return loginByMobile;
};

const verifyMobileOtp = async (payload) => {
  const verifyByMobileOtp = await post("/api/v1/auth/verifyOtp", payload);
  return verifyByMobileOtp;
};

const resetPassword = async (payload) => {
  const resetPassword = await post("/api/v1/user/updatePassword", payload);
  return resetPassword;
};

const logout = async () => {
  const logoutRes = await post("/api/v1/auth/logout");
  return logoutRes;
};
const otpRequest=async(payload)=>{
  const getOtpRequest=await post("/api/v1/auth/getForgetPasswordOtp",payload);
  return getOtpRequest;
}
const verifyOtpRequest=async(payload)=>{
    const getVerifyOtpRequest=await post("/api/v1/auth/verifyForgetPasswordOtp",payload);
  return getVerifyOtpRequest;
}
const ResetPasswordRequest=async(payload)=>{
  const getResetPasswordRequest=await post("/api/v1/auth/resetForgetPassword",payload);
  return getResetPasswordRequest;
}
 export {  loginPassword, loginWithMobile,verifyMobileOtp,logout,resetPassword,otpRequest,verifyOtpRequest,ResetPasswordRequest };

// export {
//   loginPassword,
//   logout,
//   resetPassword,
//   loginWithMobile,
//   verifyMobileOtp,
// };
