import {
  FileInput,
  Group,
  Modal,
  NativeSelect,
  NumberInput,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { IconCloudUpload, IconEye, IconTrash } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import CustomModal from "../../../../../shared/components/CustomModal/CustomModal";
import ImageUploader from "../../../../../shared/components/ImageUploader/ImageUploader";

const ParentDetails = ({
  prevStep,
  nextStep,
  active,
  setPayLoad,
  payLoad,
  studentData,
  formData,
  motherImage,
  setMotherImage,
  setFatherImage,
  fatherImage,
}) => {
  const [fileError, setFileError] = useState(false);
  const [fatherImageUploader, setFatherImageUploader] = useState(false);

  const [motherImageUploader, setMotherImageUploader] = useState(false);

  const [fatherImagePopUp, setFatherImagePopUp] = useState(false);
  const [motherImagePopUp, setMotherImagePopUp] = useState(false);

  const form = useForm({
    initialValues: {
      father_name: "",
      father_email: null,
      father_occupation: "",
      mother_name: "",
      mother_email: null,
      mother_occupation: "",
      guardian_name: null,
      guardian_mobile_no: null,
      guardian_relation: null,
    },

    validate: {
      father_name: (value) =>
        value.length < 3 ? "Please enter minimum 3 letters" : null,

      father_email: (value) => {
        if (value && value.trim() !== "") {
          return /^\S+@\S+$/.test(value) ? null : "Invalid Email id";
        }
        return null;
      },
      // father_occupation: (value) => (value === "" ? "Please select" : null),
      // mother_name: (value) =>
      //   value.length < 3 ? "Please enter minimum 3 letters" : null,

      mother_email: (value) => {
        if (value && value.trim() !== "") {
          return /^\S+@\S+$/.test(value) ? null : "Invalid Email id";
        }
        return null;
      },

      // mother_occupation: (value) => (value === "" ? "Please select" : null),

      guardian_mobile_no: (value) => {
        if (value && value.toString().trim() !== "") {
          return value.toString().length !== 10
            ? "Please enter 10 digits mobile number"
            : null;
        }
        return null;
      },
    },
  });

  const handleUploadedImage = (e, imageType) => {
    if (imageType === "fatherImage") {
      handleFatherImageUploader();
    }
    if (imageType === "motherImage") {
      handleMotherImageUploader();
    }
  };

  const handleFatherImageUploader = () => {
    setFatherImageUploader(!fatherImageUploader);
  };

  const handleMotherImageUploader = () => {
    setMotherImageUploader(!motherImageUploader);
  };

  const onSubmit = () => {
    setPayLoad((prevData) => ({ ...prevData, ...form.values }));

    nextStep();
  };

  useEffect(() => {
    form.setValues({ ...payLoad });
  }, [payLoad]);

  const [opened, setOpened] = useState(false);

  const open = (number) => {
    if (number == "1") {
      setFatherImagePopUp(true);
      setMotherImagePopUp(false);

      setOpened(true);
    } else {
      setFatherImagePopUp(false);
      setMotherImagePopUp(true);
      setOpened(true);
    }
  };

  const closeModal = () => {
    setOpened(false);
  };
  const removeFatherImage = () => {
    setFatherImage(null);
  };
  const removeMotherImage = () => {
    setMotherImage(null);
  };

  const handleDigits = (e) => {
    const isAllowedKey = /^[0-9]$/.test(e.key);
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

  console.log("student");

  return (
    <div>
      <Modal
        opened={opened}
        onClose={closeModal}
        centered
        withCloseButton={false}
      >
        <div className="d-flex justify-content-center align-items-center">
          {fatherImagePopUp ? (
            <img
              src={
                fatherImage
                  ? URL.createObjectURL(fatherImage)
                  : payLoad.father_photo_cdn
              }
              alt=""
              className="pop-up-image"
            />
          ) : (
            <img
              src={
                motherImage
                  ? URL.createObjectURL(motherImage)
                  : payLoad.mother_photo_cdn
              }
              alt=""
              className="pop-up-image"
            />
          )}
        </div>
      </Modal>
      <div className="container-fluid ">
        <div className="add-organization-container student-details mt-4">
          <span className="student-details-label">Parent Details</span>
          <div className="student-details-sub-container">
          <span className="fw-bold">Parent details</span>

            <div
              className="d-flex align-items-center col-12 col-md-8 col-lg-5 p-2 "
              style={{
                // cursor: "pointer",
                borderRadius: "10px",
                border: "1px solid grey",
              }}
            >
              <div
                className="student-upload-logo"
                onClick={(e) => {
                  handleUploadedImage(e, "fatherImage");
                }}
              >
                {fatherImage || payLoad.father_photo_cdn ? (
                  <>
                    <img
                      src={
                        fatherImage
                          ? URL.createObjectURL(fatherImage)
                          : payLoad.father_photo_cdn
                      }
                      alt="profile"
                      className="student-uploaded-image"
                      style={{ cursor: "pointer" }}
                    />
                    <IconCloudUpload className="uploadIcon" />
                  </>
                ) : (
                  <IconCloudUpload size={40} color="grey" />
                )}
              </div>

              <div className="upload-image-container">
                {/* <input
                  accept="image/png,image/jpeg"
                  type="file"
                  id="upload"
                  onChange={handleUploadedImage}
                /> */}
                {fatherImage || payLoad?.father_photo_cdn ? (
                  <>
                    <label
                      // htmlFor="upload"
                      className="fw-bold"
                      style={{ fontSize: "0.8rem" }}
                    >
                      {fatherImage
                        ? fatherImage.name
                        : payLoad && payLoad.father_photo_cdn
                        ? payLoad.father_photo_cdn.split("/").pop()
                        : ""}
                    </label>
                    {fatherImage || payLoad?.father_photo_cdn ? (
                      <Tooltip
                        label="Preview"
                        color="#DB3525"
                        arrowSize={6}
                        withArrow
                        position="right"
                      >
                        {/* <a
                          href={
                            payLoad?.father_photo_cdn
                              ? payLoad?.father_photo_cdn
                              : URL.createObjectURL(fatherImage)
                          }
                          target="_blank"
                          rel="noreferrer"
                        >
                          <IconEye style={{ marginLeft: "20px" }} />
                        </a> */}
                        <IconEye
                          style={{ marginLeft: "20px" }}
                          onClick={() => open("1")}
                        />
                      </Tooltip>
                    ) : null}{fatherImage ? (
                      <IconTrash
                        style={{
                          paddingBottom: "1px",
                          marginLeft: "10px",
                          color: "red",
                          cursor: "pointer",
                        }}
                        onClick={() => removeFatherImage()}
                      />
                    ) : null}
                  </>
                ) : (
                  <label
                    // htmlFor="upload"
                    className="fw-bold"
                    style={{ cursor: "pointer", fontSize: "0.8rem" }}
                    onClick={(e) => {
                      handleUploadedImage(e, "fatherImage");
                    }}
                  >
                    Click here to upload Father's photo
                  </label>
                )}
              </div>
            </div>
            <CustomModal
              isOpen={fatherImageUploader}
              onRequestClose={handleFatherImageUploader}
              className={"uploadPopupImage"}
              contentLabel={"Upload Image"}
            >
              <ImageUploader
                uploadFile={setFatherImage}
                allowedTypes={["image/png", "image/jpeg"]}
                maxSize={2}
                onClose={handleFatherImageUploader}
                cropWidth={70}
                cropHeight={70}
              />
            </CustomModal>
            {fileError ? (
              <span className="m-8f816625 mt-3">
                Upload jpg, jpeg, png only.{" "}
              </span>
            ) : null}
            <form onSubmit={form.onSubmit(onSubmit)} className="mt-3">
              <div className="row mt-3 student-registration-container">
                <div className="form-group text-start mb-3 col-lg-4">
                  <label
                    className="fw-bold text-secondary"
                    htmlFor="father-name"
                  >
                    Father Full Name *
                  </label>
                  <TextInput
                    size="lg"
                    placeholder="Enter here"
                    {...form.getInputProps("father_name")}
                    required
                    className="text-danger mt-1"
                    id="father-name"
                  />
                </div>

                <div className="form-group text-start mb-3 col-lg-4">
                  <label className="fw-bold text-secondary" htmlFor="email">
                    Email
                  </label>
                  <TextInput
                    size="lg"
                    placeholder="Enter here"
                    {...form.getInputProps("father_email")}
                    // required
                    className="text-danger mt-1"
                    id="email"
                    maxLength={50}
                  />
                </div>

                <div className="form-group text-start mb-3 col-lg-4">
                  <label
                    className="fw-bold text-secondary"
                    htmlFor="blood-group"
                  >
                    Father Occupation
                  </label>
                  <NativeSelect
                    size="lg"
                    placeholder="Select"
                    {...form.getInputProps("father_occupation")}
                    // required
                    data={[
                      "Select",
                      "Business",
                      "Farmer",
                      "Private Sector",
                      "Public Sector",
                    ]}
                    id="occupation"
                  />
                </div>
              </div>
              <div
                className="d-flex align-items-center mt-3 col-12 col-md-8 col-lg-5 p-2 "
                style={{
                  // cursor: "pointer",
                  borderRadius: "10px",
                  border: "1px solid grey",
                }}
              >
                <div
                  className="student-upload-logo"
                  onClick={(e) => {
                    handleUploadedImage(e, "motherImage");
                  }}
                >
                  {motherImage || payLoad.mother_photo_cdn ? (
                    <>
                      <img
                        src={
                          motherImage
                            ? URL.createObjectURL(motherImage)
                            : payLoad.mother_photo_cdn
                        }
                        alt="profile"
                        className="student-uploaded-image"
                        style={{ cursor: "pointer" }}
                      />
                      <IconCloudUpload className="uploadIcon" />
                    </>
                  ) : (
                    <IconCloudUpload size={40} color="grey" />
                  )}
                </div>

                <div className="upload-image-container">
                  {/* <input
                    accept="image/png,image/jpeg"
                    type="file"
                    id="upload"
                    onChange={handleUploadedImage}
                  /> */}
                  {motherImage || payLoad?.mother_photo_cdn ? (
                    <>
                      <label
                        // htmlFor="upload"
                        className="fw-bold"
                        style={{ fontSize: "0.8rem" }}
                      >
                        {motherImage
                          ? motherImage.name
                          : payLoad && payLoad.mother_photo_cdn
                          ? payLoad.mother_photo_cdn.split("/").pop()
                          : ""}
                      </label>
                      {motherImage || payLoad?.mother_photo_cdn ? (
                        <Tooltip
                          label="Preview"
                          color="#DB3525"
                          arrowSize={6}
                          withArrow
                          position="right"
                        >
                          {/* <a
                            href={
                              payLoad?.mother_photo_cdn
                                ? payLoad?.mother_photo_cdn
                                : URL.createObjectURL(motherImage)
                            }
                            target="_blank"
                            rel="noreferrer"
                          >
                           
                          </a> */}
                          <IconEye
                            style={{ marginLeft: "20px" }}
                            onClick={() => open("2")}
                          />
                        </Tooltip>
                      ) : null}{motherImage ? (
                        <IconTrash
                          style={{
                            paddingBottom: "1px",
                            marginLeft: "10px",
                            color: "red",
                            cursor: "pointer",
                          }}
                          onClick={() => removeMotherImage()}
                        />
                      ) : null}
                    </>
                  ) : (
                    <label
                      // htmlFor="upload"
                      className="fw-bold"
                      style={{ cursor: "pointer", fontSize: "0.8rem" }}
                      onClick={(e) => {
                        handleUploadedImage(e, "motherImage");
                      }}
                    >
                      Click here to upload Mother's photo
                    </label>
                  )}
                </div>
              </div>
              <CustomModal
                isOpen={motherImageUploader}
                onRequestClose={handleMotherImageUploader}
                className={"uploadPopupImage"}
                contentLabel={"Upload Image"}
              >
                <ImageUploader
                  uploadFile={setMotherImage}
                  allowedTypes={["image/png", "image/jpeg"]}
                  maxSize={2}
                  onClose={handleMotherImageUploader}
                  cropWidth={70}
                  cropHeight={70}
                />
              </CustomModal>
              {fileError ? (
                <span className="m-8f816625 mt-3">
                  Upload jpg, jpeg, png only.{" "}
                </span>
              ) : null}
              <div className="row mt-3 student-registration-container">
                <div className="form-group text-start mb-3 col-lg-4">
                  <label
                    className="fw-bold text-secondary"
                    htmlFor="mother-name"
                  >
                    Mother Full Name 
                  </label>
                  <TextInput
                    size="lg"
                    placeholder="Enter here"
                    {...form.getInputProps("mother_name")}
                   
                    className="text-danger mt-1"
                    id="mother-name"
                  />
                </div>

                <div className="form-group text-start mb-3 col-lg-4">
                  <label className="fw-bold text-secondary" htmlFor="mother">
                    Email
                  </label>
                  <TextInput
                    size="lg"
                    placeholder="Enter here"
                    {...form.getInputProps("mother_email")}
                    // mandatory

                    className="text-danger mt-1"
                    id="mother"
                    maxLength={50}
                  />
                </div>

                <div className="form-group text-start mb-3 col-lg-4">
                  <label
                    className="fw-bold text-secondary"
                    htmlFor="mother_occupation"
                  >
                    Mother Occupation
                  </label>
                  <NativeSelect
                    size="lg"
                    placeholder="Select"
                    {...form.getInputProps("mother_occupation")}
                    // required
                    data={[
                      "Select",
                      "Housewife",
                      "Private Sector",
                      "Public Sector",
                    ]}
                    id="mother_occupation"
                  />
                </div>
              </div>

              <div className="row mt-3 student-registration-container">
                <span className="fw-bold">Guardian details</span>
                <div className="form-group text-start mb-3 col-lg-4">
                  <label
                    className="fw-bold text-secondary"
                    htmlFor="guardian-name"
                  >
                    Name
                  </label>
                  <TextInput
                    size="lg"
                    placeholder="Enter here"
                    {...form.getInputProps("guardian_name")}
                    className="text-danger mt-1"
                    id="guardian-name"
                    maxLength={100}
                  />
                </div>

                <div className="form-group text-start mb-3 col-lg-4">
                  <label
                    className="fw-bold text-secondary"
                    htmlFor="guardian-mobile-number"
                  >
                    Mobile number
                  </label>
                  <TextInput
                    size="lg"
                    placeholder="Enter here"
                    {...form.getInputProps("guardian_mobile_no")}
                    className="text-danger mt-1"
                    id="guardian-mobile-number"
                    maxLength={10}
                    onKeyDown={handleDigits}
                  />
                </div>

                <div className="form-group text-start mb-3 col-lg-4">
                  <label className="fw-bold text-secondary" htmlFor="relation">
                    Relation
                  </label>
                  <TextInput
                    size="lg"
                    placeholder="Enter here"
                    {...form.getInputProps("guardian_relation")}
                    className="text-danger mt-1"
                    id="relation"
                    maxLength={50}
                  />
                </div>
              </div>

              <Group justify="center">
                {active < 1 ? null : (
                  <button
                    type="button"
                    className="btn prev-button"
                    onClick={prevStep}
                  >
                    Previous
                  </button>
                )}
                <button
                  type="submit"
                  className="btn add-button"
                  style={{ color: "#fff" }}
                >
                  Next
                </button>
              </Group>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDetails;
