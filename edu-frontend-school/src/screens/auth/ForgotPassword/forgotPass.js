import React, { useState } from "react";
import "./forgotPass.css";
import { useForm } from "@mantine/form";
import { IconChevronLeft, IconTrash, IconCopy } from "@tabler/icons-react";
import { NumberInput, TextInput } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { NumberFormatBase } from "react-number-format";
import { encrypt } from "../../../utility/EncrytDecrypt";
import * as authService from "../auth.service";
import { useAuth } from "../../../context/AuthContext";
import * as AppPreference from "../../../utility/AppPreference";
import { getLoggedInUserDetails } from "../../../shared/services/common.service";
import ToastUtility from "../../../utility/ToastUtility";

const ForgotPassword = () => {
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
  const [mobile_no, setMobileNumber] = useState();

  // back to section
  const goBackTologinPage = () => {
    navigate("/login");
  };

  const onSubmit = async () => {
    const mobileNumber = form.values.mobile_no;
    const mobileNumberPattern = /^[6-9]\d{9}$/;
    if (mobileNumberPattern.test(mobileNumber)) {
      const payload = {
        mobile_number: form.values.mobile_no,
      };
      const getOtpRequestResponse = await authService.otpRequest(payload);

      if (!getOtpRequestResponse.error) {
        ToastUtility.success("OTP sent successfully");
        navigate("/OTPverification", {
          state: {
            mobileNumber: form.values.mobile_no,
            txnId: getOtpRequestResponse?.data?.txnId,
          },
        });
      }
    } else {
      ToastUtility.error("Please enter valid Mobile Number");
    }
  };

  const SchoolLogoUrl = process.env.REACT_APP_SCHOOL_LOGO_URL;

  return (
    <div className="container-fluid">
      <div className="row" style={{alignItems:'center'}}>
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
                <img src={SchoolLogoUrl} 
                
                onClick={goBackTologinPage}
                alt="" />
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
                      onClick={goBackTologinPage}
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
                      style={{ fontSize: "30px", marginLeft: "0px" }}
                    ></span>
                  </div>
                </div>
              </div> */}
              <h2 className="mb-4 fw-bold">Forgot Password</h2>
              <div className="mb-5">
                Please enter your registered mobile number to reset your
                password.
              </div>
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
                    <div
                      className="mb-4 fw-bold fs-09 mb-3"
                      style={{
                        cursor: "pointer",
                        textAlign: "centre",
                        marginTop: "10px",
                      }}
                    >
                      Send OTP
                    </div>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
