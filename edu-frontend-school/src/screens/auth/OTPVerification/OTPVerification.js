import React from "react";
import "./OTPVerification.css";
import { useForm } from "@mantine/form";
import { IconChevronLeft, IconTrash, IconCopy } from "@tabler/icons-react";
import { NumberInput, TextInput } from "@mantine/core";

import { NumberFormatBase } from "react-number-format";
import { useState, useEffect } from "react";
import "./OTPVerification.css";
import { useLocation, useNavigate } from "react-router-dom";
import ForgotPassword from "../ForgotPassword/forgotPass";
import { MuiOtpInput } from "mui-one-time-password-input";
import { getLoggedInUserDetails } from "../../../shared/services/common.service";
import { encrypt } from "../../../utility/EncrytDecrypt";
import * as AppPreference from "../../../utility/AppPreference";
import ToastUtility from "../../../utility/ToastUtility";
import { useAuth } from "../../../context/AuthContext";
import * as authService from "../auth.service";

const OTPverification = () => {
  const { state } = useLocation();
  const { login, addUserDetailsToContext } = useAuth();
  const [transactionId, setTransactionId] = useState(
    state?.txnId ? state?.txnId : transactionId
  );

  const navigate = useNavigate();
  const goBackToForgotPasswordPage = () => {
    navigate("/ForgotPassword");
  };

  const [otp, setOtp] = useState();

  const handleChange = (newValue) => {
    setOtp(newValue);
  };
  const verifyOtp = async () => {
    const payload = {
      txnId: transactionId,
      otp: encrypt(otp),
    };
    const verifyOtpResponse = await authService.verifyOtpRequest(payload);
    if (!verifyOtpResponse.error) {
      ToastUtility.success("OTP verified successfully");

      navigate("/resetforgetpassword", {
        state: {
          txnId: verifyOtpResponse?.data?.txnId,
        },
      });
    }
  };

  const [seconds, setSeconds] = useState(59);
  const [minutes, setMinutes] = useState(2);

  useEffect(() => {
    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(timer);
        } else {
          setSeconds(59);
          setMinutes(minutes - 1);
        }
      }
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [seconds]);
  const resendOTP = () => {
    resendOtp();
    setMinutes(2);
    setSeconds(59);
  };

  const resendOtp = async () => {
    const payload = {
      mobile_number: state?.mobileNumber,
    };
    const getOtpRequestResponse = await authService.otpRequest(payload);

    if (!getOtpRequestResponse.error) {
      ToastUtility.success("OTP sent successfully");
      setTransactionId(getOtpRequestResponse?.data?.txnId);
    }
  };

  const goBackTologinPage = () => {
    navigate("/login");
  };

  const SchoolLogoUrl = process.env.REACT_APP_SCHOOL_LOGO_URL;

  return (
    <div className="container-fluid">
      <div className="row" style={{ alignItems: "center" }}>
        <div className="col-lg-8 left-side d-flex justify-content-between flex-column ps-5 pt-5">
          <div className="left-side-text text-white fw-bold fs-1">
            <span
              className="px-2"
              style={{
                backgroundColor: "#DB3525",
              }}
            >
              Real-time
            </span>{" "}
            tracking for <br /> Students, Staff & Teachers.
          </div>
          <span className="text-white mb-4 fs-6">
            Copyright@aieze.in. All right reserved.
          </span>
        </div>
        <div className="col-lg-4 right-side">
          <div className="login-container">
            <div className="login-page w-100 text-start px-3">
              <div className="school-name-logo d-flex justify-content-center align-items-center mb-5">
                <img src={SchoolLogoUrl} alt="" 
                  
                  onClick={goBackTologinPage}
                />
                {/* <h3
                  className="fw-bold fs-5"
                  style={{ marginLeft: "10px", marginBottom: "0px" }}
                >
                  Edueze 
                </h3> */}
              </div>
              {/* <div className="row">
                <div className="col-md-12">
                  <div className="d-flex align-items-center">
                    <IconChevronLeft
                      size={35}
                      onClick={goBackToForgotPasswordPage}
                      style={{
                        cursor: "pointer",
                        paddingLeft: 0,
                        marginLeft: "-17px",
                        marginBottom: "15px",
                      }}
                      color="blue"
                    />
                    <span
                      className="fw-bold "
                      style={{ fontSize: "20px", marginLeft: "0px" }}
                    ></span>
                  </div>
                </div>
              </div> */}
              <form>
                <div className="mainnn">
                  <div>
                    <h4 className="mb-4 fw-bold">OTP Verification</h4>
                    <p
                      style={{
                        fontSize: "15px",
                        fontWeight: "700",
                        color: "grey",
                        marginTop: "10px",
                      }}
                    >
                      We have sent 6-digit OTP on your registered mobile number
                      XXXXXX {state?.mobileNumber.toString().slice(6)}
                    </p>
                    <label
                      style={{
                        fontSize: "18px",
                        fontWeight: "600",
                        marginBottom: "10px",
                      }}
                    >
                      Enter OTP
                    </label>

                    <div className="">
                      <MuiOtpInput
                        value={otp}
                        onChange={handleChange}
                        length={6}
                        autoFocus={true}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    className="btn bg-danger text-center text-white w-100 py-0.5 mt-4"
                    type="button"
                    onClick={() => verifyOtp()}
                  >
                    Verify OTP
                  </button>
                </div>
              </form>
              <div className="time ">
                {seconds === 0 && minutes === 0 ? (
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => resendOTP()}
                  >
                    Resend OTP{" "}
                  </span>
                ) : (
                  <span
                    className="resend fw-bold"
                    style={{
                      color: "",
                      fontSize: "15px",
                    }}
                  >
                    Resend OTP in{" "}
                    <span style={{ color: "#DB3525" }}>
                      {minutes < 10 ? `0${minutes}` : minutes}:
                      {seconds < 10 ? `0${seconds}` : seconds}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPverification;
