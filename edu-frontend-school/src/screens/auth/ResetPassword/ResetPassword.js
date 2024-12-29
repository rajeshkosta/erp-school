import { PasswordInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import * as authService from "../auth.service";
import "./ResetPassword.css";
import { useLocation, useNavigate } from "react-router";
import { encrypt } from "../../../utility/EncrytDecrypt";
import ToastUtility from "../../../utility/ToastUtility";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user_id } = location.state || {};
  const form = useForm({
    initialValues: {
      current_password: "",
      new_password: "",
    },

    validate: {
      new_password: (value) =>
        /^[a-zA-Z0-9]*$/.test(value) ? null : "Password must be alphanumeric",
    },
  });

  const onSubmit = async () => {
    
    const { current_password, new_password } = form.values;
    const hashedcurrentPassword = await encrypt(current_password);
    const hashednewPassword = await encrypt(new_password);
    const hashedUserId = await encrypt(user_id);
    const payload = {
      currentPassword: hashedcurrentPassword,
      newPassword: hashednewPassword,
      userId: hashedUserId,
    };
    const resetpasswordResponse = await authService.resetPassword(payload);
    if (!resetpasswordResponse.error) {
      navigate("/login");
    }else{
      ToastUtility.error(resetpasswordResponse?.errorMessage.response.data.error);
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
                <img src={SchoolLogoUrl} alt="" 
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
                    Current password *
                  </label>
                  <PasswordInput
                    required
                    placeholder="Enter here"
                    {...form.getInputProps("current_password")}
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
                    New password *
                  </label>
                  <PasswordInput
                    required
                    placeholder="Enter here"
                    {...form.getInputProps("new_password")}
                    id="new_password"
                    maxLength={12}
                  />
                </div>

                <button
                  className="btn bg-danger text-center text-white w-100 py-2 mt-3"
                  type="submit"
                >
                  Update Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
