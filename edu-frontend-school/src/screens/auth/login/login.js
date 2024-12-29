import React from "react";
import "./login.css";
import { useForm } from "@mantine/form";
import { NumberInput, PasswordInput } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import * as authService from "../auth.service";
import { encrypt } from "../../../utility/EncrytDecrypt";
import { useAuth } from "../../../context/AuthContext";
import * as AppPreference from "../../../utility/AppPreference";
import { getLoggedInUserDetails } from "../../../shared/services/common.service";
import ToastUtility from "../../../utility/ToastUtility";
const Login = () => {
  const { login, addUserDetailsToContext } = useAuth();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      mobile_no: "",
      password: "",
    },

    validate: {
      mobile_no: (value) =>
        value.toString().length !== 10
          ? "Mobile No. should be 10 digits"
          : null,
    },
  });

  const onSubmit = async () => {
    const { mobile_no, password } = form.values;
    const hashedPassword = await encrypt(password);
    const payload = {
      user_name: mobile_no,
      password: hashedPassword,
    };

    const loginResponse = await authService.loginPassword(payload);
    if (!loginResponse.error) {
      AppPreference.setValue("userToken", loginResponse.data);
      login();
      await getLoggedInUserDetails(addUserDetailsToContext);
    } else {
      if (loginResponse?.errorMessage.response.data.errorCode == "USRAUT0007") {
        let user_id = loginResponse?.errorMessage.response.data.userId;
        navigate("/resetpassword", { state: { user_id } });
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
        <div className="col-md-6 col-lg-6 col-xl-8 left-side d-flex justify-content-between flex-column ps-5 pt-5">
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
        <div className="col-md-6 col-lg-6 col-xl-4 right-side">
          <div className="login-container d-flex justify-content-center w-100 p-3">
            <div className="login-page w-100 text-start px-3">
              <div className="school-name-logo d-flex justify-content-center align-items-center mb-5">
                <img src={SchoolLogoUrl} alt="" onClick={goBackToLoginPage} />

                {/* <h3
                  className="fw-bold fs-5"
                  style={{ marginLeft: "10px", marginBottom: "0px" }}
                >
                  Edueze 
                </h3> */}
              </div>
              <h3 className="mb-4 fw-bold">Login</h3>
              <form onSubmit={form.onSubmit(onSubmit)}>
                <div className="form-group text-start mb-3">
                  <label
                    className="fw-bold text-secondary"
                    htmlFor="mobileNumber"
                  >
                    Enter your Mobile Number*
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
                <div className="form-group text-start mb-1">
                  <label
                    component="label"
                    className="fw-bold text-secondary"
                    htmlFor="password"
                  >
                    Enter your Password*
                  </label>
                  <PasswordInput
                    required
                    placeholder="Enter here"
                    {...form.getInputProps("password")}
                    id="password"
                    size="lg"
                  />
                </div>
                <div
                  className="text-end fs-09 mb-3 forgotPassword"
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                  onClick={() => navigate("/forgotpassword")}
                >
                  Forgot Password?
                </div>
                <button
                  className="btn bg-danger text-center text-white w-100 py-2 mt-4"
                  type="submit"
                >
                  Submit
                </button>
              </form>
              <div
                className="d-flex justify-content-center mt-3"
                style={{
                  fontWeight: "900",
                }}
              >
                <Link
                  to="/otp"
                  style={{
                    textDecoration: "none",
                    color: "#DB3525",
                    fontSize: "15px",
                  }}
                >
                  Login with OTP
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
