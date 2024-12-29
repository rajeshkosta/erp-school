import React, { useEffect, useState } from "react";
import "./Profile.css";
import { useForm } from "@mantine/form";
import {
  IconChevronLeft,
  IconCloudUpload,
  IconEye,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { Modal, NumberInput, TextInput, Tooltip } from "@mantine/core";
import { Calendar } from "primereact/calendar";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import * as updateProfile from "../../ProfileScreen/Profile.service";
import ToastUtility from "../../../utility/ToastUtility";
import { genderList } from "../../../Const/Constant";
import moment from "moment";
import { encrypt } from "../../../utility/EncrytDecrypt";
import ImageUploader from "../../../shared/components/ImageUploader/ImageUploader";
import CustomModal from "../../../shared/components/CustomModal/CustomModal";
import { getLoggedInUserDetails } from "../../../shared/services/common.service";
import { MuiOtpInput } from "mui-one-time-password-input";

const Profile = () => {
  const [fileUpload, setFileUpload] = useState(null);
  const [imageUploader, setImageUploader] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState({});
  const [fileError, setFileError] = useState(false);
  const { userDetails, addUserDetailsToContext } = useAuth();
  const [genderId, setGenderId] = useState(null);
  const [dob, setDob] = useState(
    userData?.date_of_birth ? moment(userData.date_of_birth).toDate() : null
  );
  const [opened, setOpened] = useState(false);
  const [openedUpdateMobile, setOpenedUpdateMobile] = useState(false);
  const [profileImagePopUp, setProfileImagePopUp] = useState(false);
  const [updateMobilePopUp, setUpdateMobilePopUp] = useState(false);
  const [otpView, setOtpView] = useState(false);
  const[showDeleteButton,setShowDeleteButton]=useState(false);
  const formData = new FormData();
  const currentDate = new Date();

  const [seconds, setSeconds] = useState(59);
  const [minutes, setMinutes] = useState(2);
  const [otp, setOtp] = useState("");

  const form = useForm({
    initialValues: {
      first_name: "",
      last_name: "",
      email_id: "",
      address: "",
      mobile_number: "",
      new_mobile_number: "",
    },

    validate: {
      first_name: (value) =>
        value === "" ? "Please enter valid First Name" : null,
      last_name: (value) =>
        value === "" ? "Please enter valid Last Name" : null,
      email_id: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid Email ID",
    },
  });

  const onSubmit = async () => {
    if (userDetails.user_id) {
      try {
        const { first_name, email_id, last_name } = form.values;
        const userID = userDetails.user_id;
        const hashedUserID = await encrypt(userID.toString());

        const payload = {
          first_name: first_name,
          last_name: last_name,
          email_id: email_id,
          userId: hashedUserID,
          gender: parseInt(genderId),
          date_of_birth: dob ? moment(dob).format("YYYY-MM-DD") : null,
        };

        if (fileUpload) {
          formData.append("file", fileUpload);

          const updateProfilePicResponse = await updateProfile.updateProfilePic(
            formData
          );

          if (updateProfilePicResponse.error) {
            ToastUtility.error("Error updating profile picture");
            return;
          }
        }

        const updateResponse = await updateProfile.updateProfile(payload);

        if (!updateResponse.error) {
          ToastUtility.success("Profile updated Successfully");
          setShowDeleteButton(false);

          setEditMode(false);
          getLoggedInUserDetails(addUserDetailsToContext);
          getDataByUserID(userDetails.user_id);
        } else {
          ToastUtility.error("Please fill the details properly");
        }
      } catch (error) {
        console.error("Error updating user details:", error);
      }
    }
  };

  const sendOtp = async () => {
    const mobileNumber = form.values.new_mobile_number;
    const mobileNumberPattern = /^[6-9]\d{9}$/;

    if (mobileNumberPattern.test(mobileNumber)) {
      try {
        const payload = {
          newMobileNumber: form.values.new_mobile_number.toString(),
          oldMobileNumber: form.values.mobile_number,
        };

        if (
          form.values.new_mobile_number.toString() !== form.values.mobile_number
        ) {
          const sendOtpUpdateResponse =
            await updateProfile.sendOtpUpdateMobileNumber(payload);

          if (!sendOtpUpdateResponse.error) {
            ToastUtility.success("OTP sent successfully");
            setOtpView(true);
          }
        } else {
          ToastUtility.error(
            "New Mobile Number cannot be same as Current Mobile Number"
          );
        }
      } catch (error) {
        console.error("Error sending OTP:", error);
        ToastUtility.error("An error occurred while sending OTP");
      }
    } else {
      ToastUtility.error("Please enter a valid Mobile Number");
    }
  };

  useEffect(() => {
    if (otpView) {
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
  }, [seconds, otpView]);

  const resendOTP = () => {
    sendOtp();
    setMinutes(2);
    setSeconds(59);
  };

  const handleChange = (newValue) => {
    setOtp(newValue);
  };

  const verifyOtp = async () => {
    const payload = {
      newMobileNumber: form.values.new_mobile_number,
      oldMobileNumber: form.values.mobile_number,
      otp: encrypt(otp),
    };

    const getOtpUpdateRequestResponse = await updateProfile.updateMobileNumber(
      payload
    );

    if (!getOtpUpdateRequestResponse.error) {
      ToastUtility.success(getOtpUpdateRequestResponse.data.message);
      setOtpView(false);
      setOpenedUpdateMobile(false);
      getDataByUserID(userDetails?.user_id);
    }
  };

  const getDataByUserID = async (userID) => {
    const getUserByUserIdResponse = await updateProfile.getUserByUserId(userID);
    if (!getUserByUserIdResponse.error) {
      setUserData(getUserByUserIdResponse.data);
    } else {
      // ToastUtility.error("No data found for this User ID!");
    }
  };

  useEffect(() => {
    getDataByUserID(userDetails.user_id);
  }, [userDetails.user_id]);

  const toggleEditMode = () => {
    setEditMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    form.setValues({
      first_name: userData?.first_name || "",
      last_name: userData?.last_name || "",
      email_id: userData?.email_id || "",
      mobile_number: userData?.mobile_number || "",
    });

    setGenderId(userData?.gender || null);
    setDob(
      userData?.date_of_birth
        ? moment(userData.date_of_birth, "DD/MM/YYYY").toDate()
        : null
    );
  }, [userData]);

  const onSelectGenderId = (value) => {
    setGenderId(value);
  };

  const handleUploadedImage = (e) => {
    setImageUploader(true);
   
  };


  const handleImageUploader = () => {
    setImageUploader(!imageUploader);
  };

  const open = () => {
    setProfileImagePopUp(true);
    setOpened(true);
  };

  const closeModal = () => {
    setOpened(false);
  };

  const openUpdateMobile = () => {
    setUpdateMobilePopUp(true);
    setOpenedUpdateMobile(true);
  };

  const closeUpdateMobileModal = () => {
    form.values.new_mobile_number = "";
    setOpenedUpdateMobile(false);
    setOtpView(false);
  };
  
  const removeProfileImage = () => {
    setFileUpload(null);
    setShowDeleteButton(false);
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={closeModal}
        centered
        withCloseButton={false}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <div className="d-flex justify-content-center align-items-center">
          {profileImagePopUp ? (
            <img
              src={
                fileUpload
                  ? URL.createObjectURL(fileUpload)
                  : userData.profile_pic_cdn
              }
              alt=""
              className="pop-up-image"
            />
          ) : (
            ""
          )}
        </div>
      </Modal>

      <Modal
        opened={openedUpdateMobile}
        onClose={closeUpdateMobileModal}
        centered
        size={"md"}
        title="Update Mobile Number"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <form>
          {!otpView ? (
            <>
              <div className="form-group text-start mb-3">
                <label
                  className="fw-bold text-secondary"
                  htmlFor="mobileNumber"
                >
                  Current Mobile Number *
                </label>
                <NumberInput
                  size="lg"
                  type="text"
                  name="mobile_number"
                  maxLength={10}
                  hideControls
                  disabled
                  {...form.getInputProps("mobile_number")}
                />
              </div>

              <div className="form-group text-start mb-3">
                <label
                  className="fw-bold text-secondary"
                  htmlFor="mobileNumber"
                >
                  New Mobile Number *
                </label>
                <NumberInput
                  size="lg"
                  type="text"
                  name="new_mobile_number"
                  maxLength={10}
                  hideControls
                  {...form.getInputProps("new_mobile_number")}
                />
              </div>

              <div>
                <button
                  className="btn bg-danger text-center text-white w-100 py-0.5 mt-4"
                  type="button"
                >
                  <div
                    className="mb-4 fw-bold fs-09 mb-3"
                    style={{
                      cursor: "pointer",
                      textAlign: "centre",
                      marginTop: "10px",
                    }}
                    onClick={() => sendOtp()}
                  >
                    Send OTP
                  </div>
                </button>
              </div>
            </>
          ) : (
            <>
              <div>
                <h5 className="heading-5 text-align-center">
                  We have sent 6-digit OTP on your registered mobile number
                  XXXXXX {form.values.mobile_number.toString().slice(6)}
                </h5>
                <div className="otp-area">
                  <MuiOtpInput
                    length={6}
                    autoFocus={true}
                    onChange={handleChange}
                    value={otp}
                  />
                </div>
              </div>

              <div>
                <button
                  className="btn bg-danger text-center text-white w-100 py-0.5 mt-4"
                  type="button"
                >
                  <div
                    className="mb-4 fw-bold fs-09 mb-3"
                    style={{
                      cursor: "pointer",
                      textAlign: "centre",
                      marginTop: "10px",
                    }}
                    onClick={() => verifyOtp()}
                  >
                    Verify OTP
                  </div>
                </button>
              </div>

              <div className="time">
                {seconds === 0 && minutes === 0 ? (
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => resendOTP()}
                  >
                    <button className="btn bg-danger text-white " type="button">
                      {" "}
                      Resend OTP{" "}
                    </button>
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
            </>
          )}
        </form>
      </Modal>

      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <span
            className="fw-bold"
            style={{ fontSize: "20px", marginLeft: "10px" }}
          >
            Profile Details
          </span>
        </div>
        <div className="add-organization-container mx-2 pt-2">
          <div className="d-flex justify-content-between align-items-center mt-3">
            {editMode ? (
              <div>
                <div className="d-flex align-items-center">
                  <div
                    className="upload-profile-pic"
                    onClick={(e) => {
                      handleUploadedImage(e);
                    }}
                  >
                    {fileUpload || userData.profile_pic_cdn ? (
                      <div>
                        <img
                          src={
                            fileUpload
                              ? URL.createObjectURL(fileUpload)
                              : userData?.profile_pic_cdn
                          }
                          alt="profile"
                          className="uploaded-profile-pic"
                        />
                        <IconCloudUpload className="uploadIconProfile" />
                      </div>
                    ) : (
                      <IconCloudUpload size={40} color="grey" />
                    )}
                  </div>
                  <div className="upload-image-container">
                    {fileUpload || userData ? (
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <label
                            htmlFor="upload"
                            className="fw-bold"
                            onClick={(e) => {
                              handleUploadedImage(e);
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            {fileUpload
                              ? fileUpload.name
                              : userData && userData.profile_pic_cdn
                              ? userData.profile_pic_cdn.split("/").pop()
                              : ""}
                          </label>
                        </div>
                        {fileUpload || userData.profile_pic_cdn ? (
                          <div>
                            <Tooltip
                              label="Preview"
                              color="#DB3525"
                              arrowSize={6}
                              withArrow
                              position="right"
                            >
                              <IconEye
                                style={{ marginLeft: "20px" }}
                                onClick={() => open()}
                                color="#DB3525"
                              />
                            </Tooltip>
                          </div>
                        ) : null}{showDeleteButton ? (
                          <IconTrash
                            style={{
                              paddingBottom: "1px",
                              marginLeft: "10px",
                              color: "red",
                              cursor: "pointer",
                            }}
                            onClick={() => removeProfileImage()}
                          />
                        ) : null}
                      </div>
                    ) : (
                      <label
                        htmlFor="upload"
                        className="fw-bold"
                        onClick={(e) => {
                          handleUploadedImage(e);
                        }}
                        style={{
                          cursor: "pointer",
                          border: "1px solid black",
                          padding: "1rem",
                          borderRadius: "10px",
                        }}
                      >
                        Click here to upload your profile picture
                      </label>
                    )}
                  </div>
                </div>
                <CustomModal
                  isOpen={imageUploader}
                  onRequestClose={handleImageUploader}
                  className={"uploadPopupImage"}
                  contentLabel={"Upload Image"}
                >
                  <ImageUploader
                    uploadFile={setFileUpload}
                    allowedTypes={["image/png", "image/jpeg"]}
                    maxSize={2}
                    onClose={handleImageUploader}
                    cropWidth={150}
                    cropHeight={150}
                  />
                </CustomModal>
                {fileError ? (
                  <span className="m-8f816625 mt-2">
                    Upload jpg, jpeg, png only.{" "}
                  </span>
                ) : null}
              </div>
            ) : userData?.profile_pic_cdn ? (
              <img
                src={userData?.profile_pic_cdn}
                alt="profile"
                className=""
                style={{ borderRadius: "50%", width: "100px" }}
              />
            ) : (
              <img src="/images/profile-pic.png" alt="profilePic" />
            )}

            {editMode ? (
              ""
            ) : (
              <button
                type="button"
                className="edit-button rounded-pill p-2"
                onClick={toggleEditMode}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <IconPencil color="grey" className="ms-2" size={20} />
                  <span className="mx-2 fw-bold fs-6">Edit</span>
                </div>
              </button>
            )}
          </div>
          <form onSubmit={form.onSubmit(onSubmit)}>
            <div className="row mt-3">
              <div className="form-group text-start mt-3 mb-3 col-lg-4">
                <label className="fw-bold text-secondary" htmlFor="role-name">
                  First Name
                </label>
                <br />
                {editMode ? (
                  <TextInput
                    size="lg"
                    type="text"
                    {...form.getInputProps("first_name")}
                  />
                ) : (
                  <span className="fw-bold ">
                    {userData?.first_name ? userData?.first_name : "N/A"}
                  </span>
                )}
              </div>
              <div className="form-group text-start mt-3 mb-3 col-lg-4">
                <label className="fw-bold text-secondary" htmlFor="role-name">
                  Last Name
                </label>
                <br />
                {editMode ? (
                  <TextInput
                    size="lg"
                    type="text"
                    {...form.getInputProps("last_name")}
                  />
                ) : (
                  <span className="fw-bold ">
                    {userData?.last_name ? userData?.last_name : "N/A"}
                  </span>
                )}
              </div>
              <div className="form-group text-start mt-3 mb-3 col-lg-4">
                <label className="fw-bold text-secondary" htmlFor="role-name">
                  Email Address
                </label>
                <br />
                {editMode ? (
                  <TextInput
                    size="lg"
                    type="text"
                    name="email_id"
                    {...form.getInputProps("email_id")}
                  />
                ) : (
                  <span className="fw-bold ">
                    {userData?.email_id ? userData?.email_id : "N/A"}
                  </span>
                )}
              </div>
              <div className="form-group text-start mt-3 mb-3 col-lg-4">
                <label className="fw-bold text-secondary" htmlFor="role-name">
                  Mobile Number
                </label>
                <br />
                {editMode ? (
                  <>
                    <NumberInput
                      size="lg"
                      type="text"
                      name="mobile_number"
                      maxLength={10}
                      hideControls
                      disabled
                      {...form.getInputProps("mobile_number")}
                    />

                    <span
                      className="update-number fw-bold"
                      onClick={() => openUpdateMobile()}
                    >
                      Click here to update Mobile Number
                    </span>
                  </>
                ) : (
                  <span className="fw-bold ">
                    {userData?.mobile_number ? userData?.mobile_number : "N/A"}
                  </span>
                )}
              </div>
              <div className="form-group text-start mt-3 mb-3 col-lg-4">
                <label className="fw-bold text-secondary" htmlFor="gender">
                  Gender
                </label>
                <br />
                {editMode ? (
                  <select
                    className="normalSelect"
                    id="gender"
                    onChange={(e) => onSelectGenderId(e.target.value)}
                    value={genderId !== null ? genderId : ""}
                  >
                    <option value="">Select</option>
                    {genderList?.map((gender, index) => (
                      <option key={index} value={gender.gender_id}>
                        {gender.gender_name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="fw-bold ">
                    {userData?.gender
                      ? userData?.gender === 1
                        ? "Male"
                        : userData?.gender === 2
                        ? "Female"
                        : "Others"
                      : "N/A"}
                  </span>
                )}
              </div>
              <div className="form-group text-start mt-3 mb-3 col-lg-4">
                <label className="fw-bold text-secondary" htmlFor="role-name">
                  Date of Birth
                </label>
                <br />
                {editMode ? (
                  <Calendar
                    showIcon
                    dateFormat="dd/mm/yy"
                    maxDate={currentDate}
                    value={dob}
                    onChange={(e) => setDob(e.value)}
                    style={{ height: "3.2rem" }}
                  />
                ) : (
                  <span className="fw-bold ">
                    {userData?.date_of_birth ? userData?.date_of_birth : "N/A"}
                  </span>
                )}
              </div>
            </div>
            {editMode ? (
              <button
                className="btn add-button mt-3 mb-2"
                type="submit"
                style={{ color: "#fff" }}
              >
                Save
              </button>
            ) : (
              ""
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default Profile;
