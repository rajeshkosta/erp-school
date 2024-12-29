import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "@mantine/form";
import { IconChevronLeft, IconEye, IconTrash } from "@tabler/icons-react";
import { IconCloudUpload } from "@tabler/icons-react";
import { Modal, NumberInput, TextInput, Tooltip } from "@mantine/core";
import * as addSchoolService from "../../School.service";
import ToastUtility from "../../../../utility/ToastUtility";
import ImageUploader from "../../../../shared/components/ImageUploader/ImageUploader";
import CustomModal from "../../../../shared/components/CustomModal/CustomModal";

const FormSchoolManagement = () => {
  const [fileUpload, setFileUpload] = useState(null);
  const [imageUploader, setImageUploader] = useState(false);
  const [fileError, setFileError] = useState(false);
  const [schoolData, setSchoolData] = useState({});
  const [schoolImagePopUp, setSchoolImagePopUp] = useState(false);

  const formData = new FormData();
  const { state } = useLocation();

  const navigate = useNavigate();
  const goBackToSchoolManagementPage = () => {
    navigate("/school");
  };
  const removeSection = () => {
    setFileUpload(null);
  };

  const form = useForm({
    initialValues: {
      school_name: "",
      email_id: "",
      contact_no: "",
      address: "",
      principal_name: "",
      established_year: "",
    },

    validate: {
      school_name: (value) =>
        value.length < 5 ? "Please enter atleast 5 letters" : null,
      email_id: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid Email id",

      contact_no: (value) =>
        value.length <= 3 || value.length > 15
          ? "Please enter valid contact number"
          : null,

      address: (value) =>
        value.length < 5 ? "Please enter atleast 5 letters" : null,
      principal_name: (value) =>
        value.length < 5 ? "Please enter atleast 5 letters" : null,
      established_year: (value) =>
        value.toString().length !== 4 ? "Please enter valid year" : null,
    },
  });

  const handleUploadedImage = (e) => {
    console.log(e);
    handleImageUploader();
  };

  const handleImageUploader = () => {
    setImageUploader(!imageUploader);
  };

  const handleDigits = (e) => {
    const isAllowedKey = /^[0-9()-]$/.test(e.key);
    const isAllowedAction = [
      "Backspace",
      "Delete",
      "Cut",
      "Copy",
      "Paste",
      "ArrowRight",
      "ArrowLeft",
      "Tab",
    ].includes(e.nativeEvent.code);

    if (!isAllowedKey && !isAllowedAction) {
      e.preventDefault();
    }
  };

  const onSubmit = async () => {
    if (state?.rowData.school_id) {
      const {
        school_name,
        email_id,
        contact_no,
        address,
        principal_name,
        established_year,
      } = form.values;
      const school_data = {
        school_id: state?.rowData.school_id,
        school_name: school_name,
        address: address,
        email_id: email_id,
        principal_name: principal_name,
        established_year: established_year,
        contact_number: contact_no,
        trust_id: 1,
      };
      formData.append("school_data", JSON.stringify(school_data));
      formData.append("logo_url", fileUpload);
      const upDateSchoolResponse = await addSchoolService.upDateSchool(
        formData
      );
      if (!upDateSchoolResponse.error) {
        ToastUtility.success("School updated successfully");
        if (upDateSchoolResponse.data) {
          navigate("/school");
        }
      } else {
        ToastUtility.info("Please try again with proper details");
      }
    } else {
      const {
        school_name,
        email_id,
        contact_no,
        address,
        principal_name,
        established_year,
      } = form.values;

      const school_data = {
        school_name: school_name,
        contact_number: contact_no,
        email_id: email_id,
        address: address,
        established_year: established_year,
        principal_name: principal_name,
        trust_id: 1,
      };
      formData.append("school_data", JSON.stringify(school_data));
      formData.append("logo_url", fileUpload);

      const addSchoolResponse = await addSchoolService.AddSchool(formData);

      if (!addSchoolResponse.error) {
        ToastUtility.success("School added successfully");
        if (addSchoolResponse.data) {
          navigate("/school");
        }
      } else {
        ToastUtility.info(addSchoolResponse.errorMessage.response.data);
      }
    }
  };

  const getDataBySchoolId = async (schoolId) => {
    const getSchoolBySchoolIdResponse =
      await addSchoolService.getSchhoByScholId(schoolId);
    if (!getSchoolBySchoolIdResponse.error) {
      setSchoolData(getSchoolBySchoolIdResponse.data);
    } else {
      ToastUtility.warning("No data found for this Trust ID!");
    }
  };

  useEffect(() => {
    if (state?.rowData.school_id) {
      getDataBySchoolId(state?.rowData.school_id);
    }
  }, []);

  useEffect(() => {
    form.setValues(schoolData);
  }, [schoolData]);

  const [opened, setOpened] = useState(false);

  const open = () => {
    setOpened(true);
    setSchoolImagePopUp(true);
  };

  const closeModal = () => {
    setOpened(false);
  };

  return (
    <div className="container-fluid ">
      <Modal
        opened={opened}
        onClose={closeModal}
        centered
        withCloseButton={false}
      >
        <div className="d-flex justify-content-center align-items-center">
          {schoolImagePopUp ? (
            <img
              src={
                fileUpload
                  ? URL.createObjectURL(fileUpload)
                  : schoolData.logo_url_cdn
              }
              alt=""
              className="pop-up-image"
            />
          ) : null}
        </div>
      </Modal>
      <div className="d-flex align-items-center">
        <IconChevronLeft
          size={30}
          onClick={goBackToSchoolManagementPage}
          style={{ cursor: "pointer" }}
          color="blue"
        />
        <span
          className="fw-bold "
          style={{ fontSize: "20px", marginLeft: "10px" }}
        >
          {state?.rowData.school_id ? "Update School" : "Add School"}
        </span>
      </div>
      <div className="add-organization-container mx-2">
        <div className="d-flex align-items-center">
          <div
            className="upload-logo"
            onClick={(e) => {
              handleUploadedImage(e);
            }}
          >
            {fileUpload || schoolData.logo_url_cdn ? (
              <>
                <img
                  src={
                    fileUpload
                      ? URL.createObjectURL(fileUpload)
                      : schoolData.logo_url_cdn
                  }
                  alt="profile"
                  className="uploaded-image"
                />
                <IconCloudUpload className="uploadIcon" />
              </>
            ) : (
              <IconCloudUpload size={40} color="grey" />
            )}
          </div>
          <div className="upload-image-container">
            {fileUpload || schoolData ? (
              <>
                <label
                  htmlFor="upload"
                  className="fw-bold"
                  style={{ cursor: "pointer" }}
                >
                  {fileUpload
                    ? fileUpload.name
                    : schoolData && schoolData.logo_url_cdn
                    ? schoolData.logo_url_cdn.split("/").pop()
                    : ""}
                </label>
                <>
                  {fileUpload || schoolData.logo_url_cdn ? (
                    <Tooltip
                      label="Preview"
                      color="#DB3525"
                      arrowSize={6}
                      withArrow
                      position="right"
                    >
                      <IconEye
                        style={{ marginLeft: "20px", cursor: "pointer" }}
                        onClick={() => open()}
                        color="#DB3525"
                      />
                    </Tooltip>
                  ) : null}
                  {fileUpload ? (
                    <IconTrash
                      style={{
                        paddingBottom: "1px",
                        marginLeft: "10px",
                        color: "red",
                        cursor: "pointer",
                      }}
                      onClick={() => removeSection()}
                    />
                  ) : null}
                </>
              </>
            ) : (
              <label
                htmlFor="upload"
                className="fw-bold"
                onClick={(e) => {
                  handleUploadedImage(e);
                }}
                style={{ cursor: "pointer" }}
              >
                Click here to upload logo
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
            cropWidth={456}
            cropHeight={100}
          />
        </CustomModal>
        {fileError ? (
          <span className="m-8f816625 mt-2">Upload jpg, jpeg, png only. </span>
        ) : null}

        <form onSubmit={form.onSubmit(onSubmit)}>
          <div className="row mt-5">
            <div className="form-group text-start mb-3 col-lg-6">
              <label className="fw-bold text-secondary" htmlFor="org-name">
                School Name *
              </label>
              <TextInput
                placeholder="Enter here"
                {...form.getInputProps("school_name")}
                required
                className="text-danger mt-1"
                id="org-name"
              />
            </div>
            <div className="form-group text-start mb-3 col-lg-6">
              <label className="fw-bold text-secondary" htmlFor="email">
                Email *
              </label>
              <TextInput
                placeholder="Enter here"
                {...form.getInputProps("email_id")}
                required
                className="text-danger mt-1"
                id="email"
              />
            </div>
            <div className="form-group text-start mb-3 col-lg-6">
              <label className="fw-bold text-secondary" htmlFor="mobileNumber">
                School Contact No. *
              </label>
              <TextInput
                placeholder="Enter here"
                {...form.getInputProps("contact_no")}
                maxLength={15}
                hideControls
                required
                className="text-danger mt-1"
                id="mobileNumber"
                onKeyDown={handleDigits}
              />
            </div>
            <div className="form-group text-start mb-3 col-lg-6">
              <label className="fw-bold text-secondary" htmlFor="address">
                Address *
              </label>
              <TextInput
                placeholder="Enter here"
                {...form.getInputProps("address")}
                required
                className="text-danger mt-1"
                id="address"
              />
            </div>

            <div className="form-group text-start mb-3 col-lg-6">
              <label className="fw-bold text-secondary" htmlFor="principal">
                Principal name *
              </label>
              <TextInput
                placeholder="Enter here"
                {...form.getInputProps("principal_name")}
                required
                className="text-danger mt-1"
                id="principal"
              />
            </div>

            <div className="form-group text-start mb-3 col-lg-6">
              <label className="fw-bold text-secondary" htmlFor="est_year">
                Established Year *
              </label>
              <NumberInput
                placeholder="Enter here"
                {...form.getInputProps("established_year")}
                required
                className="text-danger mt-1"
                maxLength={4}
                id="est_year"
                hideControls
              />
            </div>
          </div>
          {state?.rowData.school_id ? (
            <button
              className="btn add-button mt-3"
              type="submit"
              style={{ color: "#fff" }}
            >
              Update
            </button>
          ) : (
            <button
              className="btn add-button mt-3"
              type="submit"
              style={{ color: "#fff" }}
            >
              Create
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default FormSchoolManagement;
