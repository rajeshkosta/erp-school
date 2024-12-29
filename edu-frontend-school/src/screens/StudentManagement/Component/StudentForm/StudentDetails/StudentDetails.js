import React, { useEffect, useState } from "react";
import {
  IconChevronLeft,
  IconCloudUpload,
  IconEye,
  IconFileTypePdf,
  IconTrash,
} from "@tabler/icons-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FileInput,
  Group,
  NativeSelect,
  NumberInput,
  TextInput,
  Tooltip,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Calendar } from "primereact/calendar";
import "./StudentDetails.css";
import { IconFileCv } from "@tabler/icons-react";
import moment from "moment";
import {
  nationality,
  religion,
  category,
  bloodGroup,
} from "../../../../../Const/Constant";

import { PatternFormat } from "react-number-format";
import { genderList } from "../../../../../Const/Constant";
import CustomModal from "../../../../../shared/components/CustomModal/CustomModal";
import ImageUploader from "../../../../../shared/components/ImageUploader/ImageUploader";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";

const StudentDetails = ({
  active,
  nextStep,
  prevStep,
  setPayLoad,
  payLoad,
  studentData,
  formData,
  fileUpload,
  setFileUpload,
  aadharImage,
  setAadhaarImage,
  birthImage,
  setBirthImage,
}) => {
  const [fileError, setFileError] = useState(false);
  const [dob, setDob] = useState(null);
  const [age, setAge] = useState(null);
  const [validation, setValidation] = useState(null);
  const [aadharNumber, setAadhaarNumber] = useState(null);
  const [genderId, setGenderId] = useState(null);
  const [imageUploader, setImageUploader] = useState(false);
  const [aadhaarImageUploader, setAadhaarImageUploader] = useState(false);
  const [birthImageUploader, setBirthImageUploader] = useState(false);
  const [fileErrorMessage, setFileErrorMessage] = useState("");
  const [aadhaarFileError, setAadhaarFileError] = useState(false);
  const [aadhaarFileErrorMessage, setAadhaarFileErrorMessage] = useState("");
  const [profileImagePopUp, setProfileImagePopUp] = useState(false);
  const [aadhaarImagePopUp, setAadhaarImagePopUp] = useState(false);
  const [birthImagePopUp, setBirthImagePopUp] = useState(false);

  // const handleUploadedImage = (e) => {
  //   const selectedFile = e.target.files[0];

  //   if (selectedFile) {
  //     const validformats = ["jpg", "jpeg", "png"];
  //     const fileExtension = selectedFile.name.split(".").pop().toLowerCase();

  //     if (validformats.includes(fileExtension)) {
  //       setFileError(false);
  //       setFileUpload(selectedFile);
  //     } else {
  //       setFileError(true);
  //     }
  //   } else {
  //     setFileUpload(null);
  //     setFileError(false);
  //   }
  // };

  useEffect(() => {
    const currentYear = moment(new Date()).format("YYYY");
    const birthYear = moment(dob).format("YYYY");

    setAge(currentYear - birthYear);
  }, [dob]);

  const form = useForm({
    initialValues: {
      first_name: "",

      email_id: null,
      mobile_number: "",
      alternate_mobile_number: "",
      blood_group: "",
      nationality: "Select",
      religion: "",
      caste_category: "",
      caste: "",
    },

    validate: {
      first_name: (value) =>
        value?.length < 3 ? "Please enter minimum 3 letters " : null,

      email_id: (value) => {
        if (value && value.trim() !== "") {
          return /^\S+@\S+$/.test(value) ? null : "Invalid Email id";
        }
        return null;
      },
      mobile_number: (value) =>
        value.toString()?.length !== 10
          ? "Please enter 10 digits mobile number"
          : null,

      alternate_mobile_number: (value) => {
        if (value && value.toString().trim() !== "") {
          return value.toString().length !== 10
            ? "Please enter 10 digits mobile number"
            : null;
        }
        return null;
      },

      // blood_group: (value) => (value === "" ? "Please select" : null),

      // nationality: (value) => (value === "Select" ? "Please select" : null),

      // religion: (values) => (values === "" ? "Please select" : null),
      // caste_category: (values) => (values === "" ? "Please select" : null),
      // caste: (values) =>
      //   values === "" ? "Please enter minimum 3 letters" : null,

      // religion: (value) =>
      //   form.values.nationality === "Indian" && value === ""
      //     ? "Please select"
      //     : null,
      // caste_category: (value) =>
      //   form.values.nationality === "Indian" && value === ""
      //     ? "Please select"
      //     : null,
      // caste: (value) =>
      //   form.values.nationality === "Indian" && value.length < 3
      //     ? "Please enter minimum 3 letters"
      //     : null,
    },
  });

  const handleUploadedImage = (e, imageType) => {
    if (imageType === "profileImage") {
      handleImageUploader();
    }
    if (imageType === "aadharCard") {
      handleAadhaarImageUploader();
    }
    if (imageType === "birthCertificate") {
      handleBirthImageUploader();
    }
  };

  const handleImageUploader = () => {
    setImageUploader(!imageUploader);
  };

  const handleAadhaarImageUploader = () => {
    setAadhaarImageUploader(!aadhaarImageUploader);
  };

  const handleBirthImageUploader = () => {
    setBirthImageUploader(!birthImageUploader);
  };

  const onSubmit = () => {
    // if (aadharNumber !== "" && form.values.nationality === "Indian") {
    //   setPayLoad((prevData) => ({
    //     ...prevData,
    //     ...form.values,
    //     age,
    //     dob: moment(dob).format("YYYY-MM-DD"),
    //     aadhaar_no: aadharNumber,
    //   }));

    //   nextStep();

    // } else {
    //   setPayLoad((prevData) => ({
    //     ...prevData,
    //     ...form.values,
    //     age,
    //     dob: moment(dob).format("YYYY-MM-DD"),
    //   }));

    //   nextStep();
    // }

    if (form.values.nationality === "Indian") {
      if (!validation) {
        setPayLoad((prevData) => ({
          ...prevData,
          ...form.values,
          age,
          dob: moment(dob).format("YYYY-MM-DD"),
          aadhaar_no: aadharNumber?.split("-")?.join(""),
          gender_id: genderId,
          student_reg_id: null,
          parent_id: null,
        }));

        nextStep();
      }
    } else {
      setPayLoad((prevData) => ({
        ...prevData,
        ...form.values,
        age,
        dob: moment(dob).format("YYYY-MM-DD"),
        gender_id: genderId,
        student_reg_id: null,
        parent_id: null,
      }));

      nextStep();
    }
  };

  console.log(fileUpload);

  const icon = (
    <IconFileTypePdf style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
  );

  const aadharValidation = (loginId) => {
    var Verhoeff = {
      d: [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
        [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
        [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
        [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
        [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
        [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
        [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
        [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
        [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
      ],
      p: [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
        [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
        [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
        [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
        [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
        [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
        [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
      ],
      j: [0, 4, 3, 2, 1, 5, 6, 7, 8, 9],
      check: function (str) {
        var c = 0;
        str
          .replace(/\D+/g, "")
          .split("")
          .reverse()
          .join("")
          .replace(/[\d]/g, function (u, i) {
            c = Verhoeff.d[c][Verhoeff.p[i % 8][parseInt(u, 10)]];
          });
        return c;
      },
      get: function (str) {
        var c = 0;
        str
          .replace(/\D+/g, "")
          .split("")
          .reverse()
          .join("")
          .replace(/[\d]/g, function (u, i) {
            c = Verhoeff.d[c][Verhoeff.p[(i + 1) % 8][parseInt(u, 10)]];
          });
        return Verhoeff.j[c];
      },
    };

    return Verhoeff["check"](loginId) === 0;
  };
  const currentDate = new Date();
  useEffect(() => {
    if (aadharNumber) {
      if (!aadharValidation(aadharNumber)) {
        setValidation(true);
      } else {
        setValidation(false);
      }
    }
  }, [aadharNumber]);

  useEffect(() => {
    form.setValues({ ...payLoad });

    setAge(payLoad.age);
    setAadhaarNumber(payLoad.aadhaar_no);
    if (payLoad?.dob) {
      const dateOfBirthObject = moment(payLoad?.dob).toDate();
      setDob(dateOfBirthObject);
    }
    setGenderId(payLoad.gender_id);
  }, [payLoad]);

  const onSelectGenderId = (value) => {
    setGenderId(value);
  };

  const handleBirthCertificateUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      if (
        file.type.includes("pdf") ||
        file.type.includes("jpeg") ||
        file.type.includes("png") ||
        file.type.includes("jpg")
      ) {
        if (file.size <= 2 * 1024 * 1024) {
          setBirthImage(file);
          setFileError(false);
          setFileErrorMessage("");
        } else {
          setBirthImage(null);
          setFileError(true);
          setFileErrorMessage("File size should be less than 2 MB.");
        }
      } else {
        setBirthImage(null);
        setFileError(true);
        setFileErrorMessage(
          "Unsupported file type. Upload jpg, jpeg, png, or pdf only."
        );
      }
    }
  };

  const handleAadhaarCertificateUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      if (
        file.type.includes("pdf") ||
        file.type.includes("jpeg") ||
        file.type.includes("png") ||
        file.type.includes("jpg")
      ) {
        if (file.size <= 2 * 1024 * 1024) {
          setAadhaarImage(file);
          setAadhaarFileError(false);
          setAadhaarFileErrorMessage("");
        } else {
          setAadhaarImage(null);
          setAadhaarFileError(true);
          setAadhaarFileErrorMessage("File size should be less than 2 MB.");
        }
      } else {
        setAadhaarImage(null);
        setAadhaarFileError(true);
        setAadhaarFileErrorMessage(
          "Unsupported file type. Upload jpg, jpeg, png, or pdf only."
        );
      }
    }
  };

  // const [opened, { open, close }] = useDisclosure(false);

  const [opened, setOpened] = useState(false);

  const open = (number) => {
    if (number == "1") {
      setProfileImagePopUp(true);
      setAadhaarImagePopUp(false);
      setBirthImagePopUp(false);
      setOpened(true);
    } else if (number == "2") {
      setAadhaarImagePopUp(true);
      setBirthImagePopUp(false);

      setProfileImagePopUp(false);
      setOpened(true);
    } else {
      setBirthImagePopUp(true);
      setAadhaarImagePopUp(false);
      setProfileImagePopUp(false);
      setOpened(true);
    }
  };

  const closeModal = () => {
    setOpened(false);
  };
  const removeStudentImage = () => {
    setFileUpload(null);
  };
  const removeadharphoto = () => {
    setAadhaarImage(null);
  };
 
  const  removeBirthImage = () => {
    setBirthImage(null);
  };
  

  return (
    <div>
      <Modal
        opened={opened}
        onClose={closeModal}
        centered
        withCloseButton={false}
      >
        <div className="d-flex justify-content-center align-items-center">
          {profileImagePopUp ? (
            <img
              src={
                fileUpload
                  ? URL.createObjectURL(fileUpload)
                  : payLoad?.student_photo_cdn
              }
              alt=""
              className="pop-up-image"
            />
          ) : aadhaarImagePopUp ? (
            <img
              src={
                aadharImage
                  ? URL.createObjectURL(aadharImage)
                  : payLoad?.aadhar_document_cdn
              }
              alt=""
              className="pop-up-image"
            />
          ) : (
            <img
              src={
                birthImage
                  ? URL.createObjectURL(birthImage)
                  : payLoad?.birth_certificate_cdn
              }
              alt=""
              className="pop-up-image"
            />
          )}
        </div>
      </Modal>
      <div className="container-fluid ">
        <div className="add-organization-container student-details mt-4">
          <span className="student-details-label">Student Details</span>
          <div className="student-details-sub-container">
            <div
              className="d-flex align-items-center col-12 col-md-8 col-lg-5  p-2 "
              style={{
                borderRadius: "10px",
                border: "1px solid grey",
              }}
            >
              <div
                className="student-upload-logo"
                onClick={(e) => {
                  handleUploadedImage(e, "profileImage");
                }}
              >
                {fileUpload || payLoad.student_photo_cdn ? (
                  <>
                    <img
                      src={
                        fileUpload
                          ? URL.createObjectURL(fileUpload)
                          : payLoad.student_photo_cdn
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
                {fileUpload || payLoad?.student_photo_cdn ? (
                  <>
                    <label
                      // htmlFor="upload"
                      className="fw-bold"
                      style={{ fontSize: "0.8rem" }}
                    >
                      {fileUpload
                        ? fileUpload.name
                        : payLoad && payLoad.student_photo_cdn
                        ? payLoad.student_photo_cdn.split("/").pop()
                        : ""}
                    </label>

                    {fileUpload || payLoad.student_photo_cdn ? (
                      <Tooltip
                        label="Preview"
                        color="#DB3525"
                        arrowSize={6}
                        withArrow
                        position="right"
                      >
                        {/* <a
                          href={
                            payLoad.student_photo_cdn
                              ? payLoad.student_photo_cdn
                              : URL.createObjectURL(fileUpload)
                          }
                          target="_blank"
                          rel="noreferrer"
                        >
                          
                        </a> */}
                        <IconEye
                          style={{ marginLeft: "20px" }}
                          onClick={() => open("1")}
                          color="#DB3525"
                        />
                      </Tooltip>
                    ) : null}      {fileUpload ? (
                      <IconTrash
                        style={{
                          paddingBottom: "1px",
                          marginLeft: "10px",
                          color: "red",
                          cursor: "pointer",
                        }}
                        onClick={() => removeStudentImage()}
                      />
                    ) : null}
                  </>
                ) : (
                  <label
                    // htmlFor="upload"
                    className="fw-bold"
                    onClick={(e) => {
                      handleUploadedImage(e, "profileImage");
                    }}
                    style={{ cursor: "pointer", fontSize: "0.8rem" }}
                  >
                    Click here to upload student Image
                  </label>
                )}
              </div>
              {/* {payLoad ? (
                <a
                  href={
                    payLoad && payLoad.student_photo_cdn
                      ? payLoad.student_photo_cdn
                      : ""
                  }
                  target="_blank"
                >
                  <IconEye color="grey" style={{ marginLeft: "30px" }} />
                </a>
              ) : null} */}
            </div>
            <CustomModal
              isOpen={imageUploader}
              onRequestClose={handleImageUploader}
              className={"uploadPopupImage"}
              contentLabel={"Student Image"}
            >
              <ImageUploader
                uploadFile={setFileUpload}
                allowedTypes={["image/png", "image/jpeg"]}
                maxSize={2}
                onClose={handleImageUploader}
                cropWidth={70}
                cropHeight={70}
              />
            </CustomModal>
            {fileError ? (
              <span className="m-8f816625 mt-2">
                Upload jpg, jpeg, png only.{" "}
              </span>
            ) : null}
            {fileError ? (
              <span className="m-8f816625 mt-3">
                Upload jpg, jpeg, png only.{" "}
              </span>
            ) : null}
            <form onSubmit={form.onSubmit(onSubmit)} className="mt-3">
              <div className="row mt-3 student-registration-container">
                <div className="form-group text-start mb-3 col-md-6 col-lg-4">
                  <label className="fw-bold text-secondary" htmlFor="org-name">
                    Full Name *
                  </label>
                  <TextInput
                    size="lg"
                    placeholder="Enter here"
                    {...form.getInputProps("first_name")}
                    required
                    className="text-danger mt-1"
                    id="org-name"
                  />
                </div>
                <div className="form-group text-start mb-3 col-md-6 col-lg-4">
                  <label className="fw-bold text-secondary" htmlFor="gender">
                    Gender *
                  </label>
                  <select
                    className="normalSelect"
                    onChange={(e) => onSelectGenderId(e.target.value)}
                    value={genderId}
                    id="gender"
                  >
                    <option value="">Select</option>
                    {genderList?.map((eachGender, index) => (
                      <option value={eachGender.gender_id} key={index}>
                        {eachGender.gender_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group text-start mb-3 col-md-6 col-lg-4">
                  <label className="fw-bold text-secondary" htmlFor="org-name">
                    Date of Birth *
                  </label>
                  <Calendar
                    size="lg"
                    placeholder="Date of birth"
                    value={dob}
                    onChange={(e) => setDob(e.value)}
                    showIcon
                    maxDate={currentDate}
                    dateFormat="dd/mm/yy"
                    required
                
                  />
                </div>
                <div className="form-group text-start mb-3 col-md-6 col-lg-4">
                  <label className="fw-bold text-secondary" htmlFor="age">
                    Age
                  </label>
                  <NumberInput
                    size="lg"
                    placeholder="Enter here"
                    value={age}
                    hideControls
                    readOnly
                    className="text-danger mt-1"
                    id="age"
                  />
                </div>
                <div className="form-group text-start mb-3 col-md-6 col-lg-4">
                  <label className="fw-bold text-secondary" htmlFor="email">
                    Email
                  </label>
                  <TextInput
                    size="lg"
                    placeholder="Email"
                    {...form.getInputProps("email_id")}
                    // required
                    className="text-danger mt-1"
                    id="email"
                    maxLength={50}
                  />
                </div>
                <div className="form-group text-start mb-3 col-md-6 col-lg-4">
                  <label
                    className="fw-bold text-secondary"
                    htmlFor="mobile_number"
                  >
                    Parent Mobile Number *
                  </label>
                  <NumberInput
                    size="lg"
                    placeholder="Mobile number"
                    {...form.getInputProps("mobile_number")}
                    maxLength={10}
                    hideControls
                    required
                    className="text-danger mt-1"
                    id="mobile_number"
                  />
                </div>
                <div className="form-group text-start mb-3 col-md-6 col-lg-4">
                  <label
                    className="fw-bold text-secondary"
                    htmlFor="alt_mobile_number"
                  >
                    Alternate Number
                  </label>
                  <NumberInput
                    size="lg"
                    placeholder="Mobile number"
                    {...form.getInputProps("alternate_mobile_number")}
                    maxLength={10}
                    hideControls
                    // required
                    className="text-danger mt-1"
                    id="alt_mobile_number"
                  />
                </div>
                <div className="form-group text-start mb-3 col-md-6 col-lg-4">
                  <label
                    className="fw-bold text-secondary"
                    htmlFor="blood-group"
                  >
                    Blood Group 
                  </label>
                  <NativeSelect
                    size="lg"
                    placeholder="Blood group"
                    {...form.getInputProps("blood_group")}
                   
                    data={[...bloodGroup]}
                    id="blood-group"
                  />
                </div>
                {/* <div className="form-group text-start mb-3 col-md-6 col-lg-4">
                  <label
                    className="fw-bold text-secondary"
                    htmlFor="mobile_number"
                  >
                    Birth Certificate *
                  </label>
                  <FileInput
                    size="lg"
                    rightSection={icon}
                    placeholder="Upload"
                    rightSectionPointerEvents="none"
                  />
                </div> */}

                <div className="form-group text-start mb-3 col-md-6 col-lg-4">
                  <label
                    className="fw-bold text-secondary"
                    htmlFor="nationality"
                  >
                    Nationality 
                  </label>
                  <NativeSelect
                    size="lg"
                    placeholder="Nationality"
                    {...form.getInputProps("nationality")}
                 
                    data={[...nationality]}
                    id="nationality"
                  />
                </div>
                {form.values.nationality === "Indian" ||
                form.values.nationality === "Select" ? (
                  <div className="form-group text-start mb-3 col-md-6 col-lg-4">
                    <label className="fw-bold text-secondary" htmlFor="aadhar">
                      Aadhar Card Number
                    </label>
                    {/* <NumberInput
                      size="lg"
                     
                      {...form.getInputProps("aadhar_number")}
                      maxLength={12}
                      hideControls
                      // required
                      className="text-danger mt-1"
                      id="aadhar"
                    /> */}
                    <PatternFormat
                      placeholder="XXXX-XXXX-XXXX"
                      format="####-####-####"
                      value={aadharNumber}
                      onChange={(e) => setAadhaarNumber(e.target.value)}
                      style={{ outline: "none", height: "50px" }}
                      // required={form.values.nationality === "Indian"}
                    />
                    {aadharNumber?.length === 14 && validation ? (
                      <span style={{ fontSize: "12px", color: "red" }}>
                        Please enter valid aadhaar number
                      </span>
                    ) : null}
                  </div>
                ) : null}

                {form.values.nationality === "Indian" ||
                form.values.nationality === "Select" ? (
                  <div className="form-group text-start mb-3 col-md-6 col-lg-4">
                    <label
                      className="fw-bold text-secondary"
                      htmlFor="religion"
                    >
                      Religion
                    </label>
                    <NativeSelect
                      size="lg"
                      placeholder="Religion"
                      {...form.getInputProps("religion")}
                      // required
                      data={[...religion]}
                      id="religion"
                    />
                  </div>
                ) : null}
                {form.values.nationality === "Indian" ||
                form.values.nationality === "Select" ? (
                  <div className="form-group text-start mb-3 col-md-6 col-lg-4">
                    <label
                      className="fw-bold text-secondary"
                      htmlFor="category"
                    >
                      Caste Category
                    </label>
                    <NativeSelect
                      size="lg"
                      placeholder="Category"
                      {...form.getInputProps("caste_category")}
                      // required
                      data={[...category]}
                      id="category"
                    />
                  </div>
                ) : null}
                {form.values.nationality === "Indian" ||
                form.values.nationality === "Select" ? (
                  <div className="form-group text-start mb-3 col-md-6 col-lg-4">
                    <label className="fw-bold text-secondary" htmlFor="caste">
                      Caste
                    </label>
                    <TextInput
                      size="lg"
                      placeholder="Enter here"
                      {...form.getInputProps("caste")}
                      // required
                      className="text-danger mt-1"
                      id="caste"
                    />
                  </div>
                ) : null}
              </div>
              <div className="row student-registration-container">
                {form.values.nationality === "Indian" ||
                form.values.nationality === "Select" ? (
                  <div className="col-lg-6">
                    <span className="fw-bold text-secondary">
                      Upload Aadhaar
                    </span>
                    <div className="upload-documents ">
                      <div className="student-upload-logo">
                        {aadharImage || payLoad.aadhar_document_cdn ? (
                          <>
                            <img
                              src={
                                aadharImage
                                  ? URL.createObjectURL(aadharImage)
                                  : payLoad.aadhar_document_cdn
                              }
                              alt="profile"
                              className="student-uploaded-image"
                            />
                            <IconCloudUpload className="uploadIcon" />
                          </>
                        ) : (
                          <IconCloudUpload size={40} color="grey" />
                        )}
                      </div>

                      <div className="upload-image-container">
                        {aadharImage || payLoad?.aadhar_document_cdn ? (
                          <>
                            <input
                              type="file"
                              id="uploadAadhaar"
                              accept=".pdf, .jpg, .jpeg, .png, "
                              onChange={handleAadhaarCertificateUpload}
                              style={{ display: "none" }}
                            />
                            <label
                              htmlFor="uploadAadhaar"
                              className="fw-bold"
                              style={{ cursor: "pointer", fontSize: "0.8rem" }}
                            >
                              {aadharImage
                                ? aadharImage.name
                                : payLoad && payLoad.aadhar_document_cdn
                                ? payLoad.aadhar_document_cdn.split("/").pop()
                                : ""}
                            </label>
                            {payLoad || payLoad.aadhar_document_cdn ? (
                              <Tooltip
                                label="Preview"
                                color="#DB3525"
                                arrowSize={6}
                                withArrow
                                position="right"
                              >
                                {(aadharImage &&
                                  aadharImage?.type === "image/png") ||
                                (aadharImage &&
                                  aadharImage?.type === "image/jpg") ||
                                (aadharImage &&
                                  aadharImage?.type === "image/jpeg") ||
                                (payLoad?.aadhar_document_cdn &&
                                  payLoad?.aadhar_document_cdn
                                    .split("/")
                                    .pop()
                                    .split(".")
                                    .pop() == "jpg") ||
                                (payLoad?.aadhar_document_cdn &&
                                  payLoad?.aadhar_document_cdn
                                    .split("/")
                                    .pop()
                                    .split(".")
                                    .pop() == "jpeg") ||
                                (payLoad?.aadhar_document_cdn &&
                                  payLoad?.aadhar_document_cdn
                                    .split("/")
                                    .pop()
                                    .split(".")
                                    .pop() == "png") ? (
                                  <IconEye
                                    style={{ marginLeft: "20px" }}
                                    onClick={() => open("2")}
                                    color="#DB3525"
                                  />
                                ) : (
                                  <a
                                    href={
                                      payLoad.aadhar_document_cdn
                                        ? payLoad.aadhar_document_cdn
                                        : URL.createObjectURL(aadharImage)
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <IconEye style={{ marginLeft: "20px" }} />
                                  </a>
                                )}
                              </Tooltip>
                            ) : null}{aadharImage ? (
                              <IconTrash
                                style={{
                                  paddingBottom: "1px",
                                  marginLeft: "10px",
                                  color: "red",
                                  cursor: "pointer",
                                }}
                                onClick={() => removeadharphoto()}
                              />
                            ) : null}
                          </>
                        ) : (
                          <div className="d-flex flex-column ">
                            <>
                              {" "}
                              <input
                                type="file"
                                id="uploadNewAadhaar"
                                accept=".pdf, .jpg, .jpeg, .png, "
                                onChange={handleAadhaarCertificateUpload}
                                style={{ display: "none" }}
                              />
                              <label
                                htmlFor="uploadNewAadhaar"
                                className="fw-bold"
                                style={{
                                  cursor: "pointer",
                                  textDecoration: "underline",
                                  color: "#002699",
                                  fontSize: "0.8rem",
                                }}
                              >
                                Click here to upload
                              </label>
                            </>

                            <span
                              style={{
                                color: "grey",
                                fontSize: "0.9rem",
                              }}
                            >
                              Supported format: pdf, jpeg, jpg, png
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {aadhaarFileError ? (
                      <span className="m-8f816625 mt-3">
                        {aadhaarFileErrorMessage}
                      </span>
                    ) : null}
                  </div>
                ) : null}
                <div className="col-lg-6">
                  <span className="fw-bold text-secondary">
                    Upload Birth Certificate
                  </span>
                  <div className="upload-documents">
                    <div className="student-upload-logo">
                      {birthImage || payLoad.birth_certificate_cdn ? (
                        <>
                          <img
                            src={
                              birthImage
                                ? URL.createObjectURL(birthImage)
                                : payLoad.birth_certificate_cdn
                            }
                            alt="profile"
                            className="student-uploaded-image"
                          />
                          <IconCloudUpload className="uploadIcon" />
                        </>
                      ) : (
                        <IconCloudUpload size={40} color="grey" />
                      )}
                    </div>

                    <div className="upload-image-container">
                      {birthImage || payLoad?.birth_certificate_cdn ? (
                        <>
                          <input
                            type="file"
                            id="upload"
                            accept=".pdf, .jpg, .jpeg, .png, "
                            onChange={handleBirthCertificateUpload}
                            style={{ display: "none" }}
                          />
                          <label
                            htmlFor="upload"
                            className="fw-bold"
                            style={{ cursor: "pointer", fontSize: "0.8rem" }}
                          >
                            {birthImage
                              ? birthImage.name
                              : payLoad && payLoad.birth_certificate_cdn
                              ? payLoad.birth_certificate_cdn.split("/").pop()
                              : ""}
                          </label>
                          {payLoad || payLoad.birth_certificate_cdn ? (
                            <Tooltip
                              label="Preview"
                              color="#DB3525"
                              arrowSize={6}
                              withArrow
                              position="right"
                            >
                              {(birthImage &&
                                birthImage?.type === "image/png") ||
                              (birthImage &&
                                birthImage?.type === "image/jpg") ||
                              (birthImage &&
                                birthImage?.type === "image/jpeg") ||
                              (payLoad.birth_certificate_cdn &&
                                payLoad.birth_certificate_cdn
                                  .split("/")
                                  .pop()
                                  .split(".")
                                  .pop() === "png") ||
                              (payLoad.birth_certificate_cdn &&
                                payLoad.birth_certificate_cdn
                                  .split("/")
                                  .pop()
                                  .split(".")
                                  .pop() === "jpg") ||
                              (payLoad.birth_certificate_cdn &&
                                payLoad.birth_certificate_cdn
                                  .split("/")
                                  .pop()
                                  .split(".")
                                  .pop() === "jpeg") ? (
                                <IconEye
                                  style={{ marginLeft: "20px" }}
                                  onClick={() => open("3")}
                                  color="#DB3525"
                                />
                              ) : (
                                <a
                                  href={
                                    payLoad.birth_certificate_cdn
                                      ? payLoad.birth_certificate_cdn
                                      : URL.createObjectURL(birthImage)
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <IconEye style={{ marginLeft: "20px" }} />
                                </a>
                              )}
                            </Tooltip>
                          ) : null}{birthImage ? (
                            <IconTrash
                              style={{
                                paddingBottom: "1px",
                                marginLeft: "10px",
                                color: "red",
                                cursor: "pointer",
                              }}
                              onClick={() => removeBirthImage()}
                            />
                          ) : null}
                        </>
                      ) : (
                        <div className="d-flex flex-column ">
                          <input
                            type="file"
                            id="uploadNewCertificate"
                            accept=".pdf, .jpg, .jpeg, .png, "
                            onChange={handleBirthCertificateUpload}
                            style={{ display: "none" }}
                          />
                          <label
                            htmlFor="uploadNewCertificate"
                            className="fw-bold"
                            style={{
                              cursor: "pointer",
                              textDecoration: "underline",
                              color: "#002699",
                              fontSize: "0.8rem",
                            }}
                          >
                            Click here to upload
                          </label>

                          <span
                            style={{
                              color: "grey",
                              fontSize: "0.9rem",
                            }}
                          >
                            Supported format: pdf, jpeg, jpg, png
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {fileError ? (
                    <span className="m-8f816625 mt-3">{fileErrorMessage}</span>
                  ) : null}
                </div>
              </div>
              <Group justify="center">
                {active < 1 ? null : (
                  <button
                    type="button"
                    style={{ background: "#F8F8F8" }}
                    onClick={prevStep}
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  className="btn add-button mt-3"
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

export default StudentDetails;
