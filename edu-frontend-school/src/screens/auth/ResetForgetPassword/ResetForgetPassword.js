import React, { useState } from "react";
import { PasswordInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import * as authService from "../auth.service";
import "./ResetForgetPassword.css";
import { useLocation, useNavigate } from "react-router";
import { encrypt } from "../../../utility/EncrytDecrypt";
import ToastUtility from "../../../utility/ToastUtility";

const ResetForgetPassword = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      new_password: "",
      confirm_password: "",
    },

    validate: {
      new_password: (value) =>
        value.toString().length >= 8
          ? null
          : "Password must be at least 8 characters",

      confirm_password: (value, values) =>
        value === values.new_password
          ? null
          : "New Password and Confirm Password must be same",
    },
  });

  const [new_Password, setNewPassword] = useState("");
  const [confirm_Password, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    if (new_Password !== confirm_Password) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("Update Successfully");
    }
  };

  const onSubmit = async () => {
    const { new_password, confirm_password } = form.values;

    const hashedNewPassword = await encrypt(new_password);
    const hashedConfirmPassword = await encrypt(confirm_password);
    const payload = {
      txnId: state?.txnId,
      newPassword: hashedNewPassword,
      confirmNewPassword: hashedConfirmPassword,
    };
    const passwordConfirmationResponse = await authService.ResetPasswordRequest(
      payload
    );
    if (!passwordConfirmationResponse.error) {
      ToastUtility.success("Password updated successfully");
      navigate("/login");
    }
  };

  const goBackToLoginPage = () => {
    navigate("/login");
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
          <div className="login-container d-flex justify-content-center w-100 p-3">
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
              <h3 className="mb-3 fw-bold">Reset your password</h3>
              <h5 className="textAlignment">Your password must be 8 characters including alphanumeric number</h5>
              {/* <p className="text-start fs-09 mb-4">
                Your password must be 8 characters including alphanumeric
                number.
                <span className="fw-bold" style={{ color: "blue" }}>
                  {" "}
                  For example- erpv1123
                </span>
              </p> */}
              <form onSubmit={form.onSubmit(onSubmit)}>
                <div className="form-group text-start mb-3">
                  <label
                    component="label"
                    className="fw-bold text-secondary"
                    htmlFor="password"
                  >
                    New password *
                  </label>
                  <PasswordInput
                    required
                    placeholder="Enter here"
                    {...form.getInputProps("new_password")}
                    id="password"
                    maxLength={12}
                  />
                </div>
                <div className="form-group text-start mb-1">
                  <label
                    component="label"
                    className="fw-bold text-secondary"
                    htmlFor="new_password"
                  >
                    Confirm new password *
                  </label>
                  <PasswordInput
                    required
                    placeholder="Enter here"
                    {...form.getInputProps("confirm_password")}
                    id="new_password"
                    maxLength={12}
                  />
                </div>

                <button
                  className="btn bg-danger text-center text-white w-100 py-2 mt-3"
                  type="submit"
                >
                  Reset Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetForgetPassword;
