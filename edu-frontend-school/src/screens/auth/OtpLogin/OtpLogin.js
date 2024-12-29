import React, { useEffect, useState } from "react";
import "./OtpLogin.css";
import { useForm } from "@mantine/form";
import { IconChevronLeft, IconTrash, IconCopy } from "@tabler/icons-react";
import { NumberInput, TextInput } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { NumberFormatBase } from "react-number-format";
import { encrypt } from "../../../utility/EncrytDecrypt";
import * as authService from "../auth.service";
import { useAuth } from "../../../context/AuthContext";
import * as AppPreference from "../../../utility/AppPreference";
import { getLoggedInUserDetails } from "../../../shared/services/common.service";
import ToastUtility from "../../../utility/ToastUtility";
import { MuiOtpInput } from "mui-one-time-password-input";

const OtpLogin = () => {
  const [otp, setOtp] = React.useState("");
  const [otpVerifyScreen, setOtpVerifyScreen] = useState(false);
  const [seconds, setSeconds] = useState(59);
  const [minutes, setMinutes] = useState(2);
  const [transactionId, setTransactionId] = useState(null);
  const { login, addUserDetailsToContext } = useAuth();

  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      mobile_no: "",
    },
    validate: {
      mobile_no: (value) =>
        value.toString().length !== 10
          ? "Mobile No. should be 10 digits"
          : null,
    },
  });

  const onSubmit = async () => {
    const mobileNumber = form.values.mobile_no;
    const mobileNumberPattern = /^[6-9]\d{9}$/;

    if (mobileNumberPattern.test(mobileNumber)) {
      const payload = {
        mobile_number: form.values.mobile_no,
      };

      const loginOtpResponse = await authService.loginWithMobile(payload);
      if (!loginOtpResponse.error) {
        setTransactionId(loginOtpResponse?.data?.txnId);
        ToastUtility.success("OTP sent successfully");
        setOtpVerifyScreen(true);
      }
    } else {
      ToastUtility.error("Please enter valid Mobile Number");
    }
  };

  useEffect(() => {
    if (otpVerifyScreen) {
      // if (seconds > 0) {
      //   const timer = setTimeout(() => {
      //     setSeconds((prevSeconds) => prevSeconds - 1);
      //   }, 1000);

      //   return () => clearTimeout(timer);
      // }

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
    }
  }, [seconds, minutes, otpVerifyScreen]);

  const handleChange = (newValue) => {
    setOtp(newValue);
  };

  const resendOtp = () => {
    onSubmit();
    setMinutes(2);
    setSeconds(59);
  };

  const verifyOtpHandler = async () => {
    if (otp.length !== 6) {
      ToastUtility.error("Please enter a valid OTP");
    } else {
      const payload = {
        txnId: transactionId,
        otp: encrypt(otp),
      };

      const verifyOtpResponse = await authService.verifyMobileOtp(payload);
      if (!verifyOtpResponse.error) {
        ToastUtility.success("OTP verified successfully");
        AppPreference.setValue("userToken", verifyOtpResponse.data);
        login();
        await getLoggedInUserDetails(addUserDetailsToContext);
      }
    }
  };

  const goBackToLoginPage = () => {
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
                <img
                  src={SchoolLogoUrl}
                  alt=""
                  onClick={goBackToLoginPage}
                />
                {/* <h3
                  className="fw-bold fs-5"
                  style={{ marginLeft: "10px", marginBottom: "0px" }}
                >
                  Edueze 
                </h3> */}
              </div>

              {otpVerifyScreen ? (
                <>
                  <div className=" p-3">
                    {/* <IconChevronLeft
                      size={25}
                      onClick={goBackToLoginPage}
                      style={{
                        cursor: "pointer",
                        color: "blue",
                        marginLeft: "-10px",
                        marginBottom: "10px",
                      }}
                      color="blue"
                    /> */}
                    <h4 className="fw-bold mb-0">OTP Verification</h4>
                    <p
                      style={{
                        fontSize: "15px",
                        fontWeight: "700",
                        color: "grey",
                        marginTop: "10px",
                      }}
                    >
                      We have sent 6-digit OTP on your registered mobile number
                      XXXXXX{form.values.mobile_no.toString().slice(6)}
                    </p>
                    <label
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        marginBottom: "10px",
                      }}
                    >
                      Enter OTP
                    </label>
                    <br />
                    <MuiOtpInput
                      value={otp}
                      onChange={handleChange}
                      length={6}
                      autoFocus={true}
                    />
                    <div>
                      <button
                        className="btn bg-danger text-center text-white w-100 py-0.5 mt-4"
                        type="button"
                        onClick={verifyOtpHandler}
                      >
                        Verify OTP
                      </button>
                    </div>
                    <div className="time mt-3 ">
                      {seconds === 0 && minutes === 0 ? (
                        <span
                          onClick={() => resendOtp()}
                          style={{
                            fontWeight: "bold",
                            cursor: "pointer",
                            fontSize: "13px",
                            color: "#DB3525",
                          }}
                        >
                          Resend OTP
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
                </>
              ) : (
                <>
                  <div className="mb-3 fw-bold fs-3">Login</div>
                  <form onSubmit={form.onSubmit(onSubmit)}>
                    <div className="form-group text-start mb-3">
                      <label
                        className="fw-bold text-secondary"
                        htmlFor="mobileNumber"
                      >
                        Enter your Mobile Number *
                      </label>
                      <NumberInput
                        placeholder="Enter here"
                        {...form.getInputProps("mobile_no")}
                        maxLength={10}
                        hideControls
                        required
                        className="text-danger mt-1"
                        id="mobileNumber"
                        size="lg"
                      />
                    </div>

                    <div>
                      <button
                        className="btn bg-danger text-center text-white w-100 py-0.5 mt-4"
                        type="submit"
                      >
                        Send OTP
                      </button>
                      <div
                        className="d-flex justify-content-center mt-3"
                        style={{
                          fontWeight: "900",
                        }}
                      >
                        <Link
                          to="/login"
                          style={{
                            textDecoration: "none",
                            color: "#DB3525",
                            fontSize: "15px",
                          }}
                        >
                          Login with password
                        </Link>
                      </div>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpLogin;
