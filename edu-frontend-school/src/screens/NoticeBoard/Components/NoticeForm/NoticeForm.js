import { TextInput, Textarea, Tooltip } from "@mantine/core";
import { IconChevronLeft, IconCloudUpload, IconEye } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { useLocation, useNavigate } from "react-router-dom";
import { Calendar } from "primereact/calendar";
import * as gettingNoticeBoardService from "../../NoticeBoard.service";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import moment from "moment";
import "./NoticeForm.css";
import ToastUtility from "../../../../utility/ToastUtility";

const NoticeForm = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [fileUpload, setFileUpload] = useState(null);
  const [fileError, setFileError] = useState(false);
  const [noticeData, setNoticeData] = useState({});
  const [roleID, setRoleID] = useState(null);
  const [rolesList, setRolesList] = useState([]);
  const [noticeDate, setNoticeDate] = useState(null);
  const [publishDate, setPublishDate] = useState(null);
  const formData = new FormData();
  const goBackToNoticeBoardPage = () => {
    navigate("/noticeboard");
  };

  const form = useForm({
    initialValues: {
      notice_title: "",
      description: "",
    },

    validate: {
      notice_title: (value) =>
        value === "" ? "Please enter Notice Title" : null,
      description: (value) =>
        value === "" ? "Please enter Description" : null,
    },
  });

  const handleUploadedFile = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const validformats = ["pdf", "png", "jpeg", "jpg", "csv"];
      const fileExtension = selectedFile.name.split(".").pop().toLowerCase();

      if (validformats.includes(fileExtension)) {
        setFileError(false);
        setFileUpload(selectedFile);
      } else {
        setFileError(true);
      }
    } else {
      setFileUpload(null);
      setFileError(false);
    }
  };

  const onSubmit = async () => {
    if (state?.data?.notice_id) {
      const { notice_title, description } = form.values;

      const notice_data = {
        notice_date: noticeDate
          ? moment(noticeDate).format("YYYY/MM/DD")
          : null,
        published_on: publishDate
          ? moment(publishDate).format("YYYY/MM/DD")
          : null,
        description: description,
        notice_title: notice_title,
      };

      formData.append("notice_data", JSON.stringify(notice_data));
      formData.append("attachment", fileUpload);

      const updateResponse = await gettingNoticeBoardService.UpdateNotice(
        formData
      );

      if (!updateResponse.error) {
        ToastUtility.success("Notice Updated Successfully");
        navigate("/noticeboard");
      }
    } else {
      const { notice_title, description } = form.values;

      const notice_data = {
        notice_date: noticeDate
          ? moment(noticeDate).format("YYYY/MM/DD")
          : null,
        publish_date: publishDate
          ? moment(publishDate).format("YYYY/MM/DD")
          : null,
        description: description,
        notice_title: notice_title,
      };

      formData.append("notice_data", JSON.stringify(notice_data));
      formData.append("notice_document", fileUpload);

      const addResponse = await gettingNoticeBoardService.AddNotice(formData);

      if (!addResponse.error) {
        ToastUtility.success("Notice added successfully.");
        if (addResponse.data) {
          navigate("/noticeboard");
        }
      } else {
        ToastUtility.info("Please add proper Notice details");
      }
    }
  };

  const getDataByNoticeId = async (noticeID) => {
    const getNoticeByNoticeIdResponse =
      await gettingNoticeBoardService.getNoticeByNoticeId(noticeID);
    if (!getNoticeByNoticeIdResponse.error) {
      setNoticeData(getNoticeByNoticeIdResponse.data);
    } else {
      ToastUtility.error("No data found for this Notice ID!");
    }
  };

  useEffect(() => {
    if (state?.data?.notice_id) {
      getDataByNoticeId(state?.data?.notice_id);
    }
  }, []);

  useEffect(() => {
    form.setValues({});
  }, [noticeData]);

  const getRoles = async () => {
    const getRolesResponse = await gettingNoticeBoardService.getRolesList();
    const rolesData = [getRolesResponse.data];
    setRolesList(...rolesData);
  };

  const onSelectRole = async (e) => {
    setRoleID(e.target.value);
  };

  useEffect(() => {
    getRoles();
  }, []);

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center">
        <IconChevronLeft
          size={30}
          onClick={goBackToNoticeBoardPage}
          style={{ cursor: "pointer" }}
          color="black"
        />
        <span
          className="fw-bold"
          style={{ fontSize: "20px", marginLeft: "10px" }}
        >
          {state?.data ? "Update Notice" : "Add Notice"}
        </span>
      </div>
      <div className="add-organization-container mx-2">
        <form onSubmit={form.onSubmit(onSubmit)}>
          <div className="row mt-2" style={{ justifyContent: "space-between" }}>
            <div className="col-md-12 col-lg-8 pe-5">
              <div className="row">
                <div className="form-group text-start mb-3 col-lg-12">
                  <label
                    className="fw-bold text-secondary mb-1"
                    htmlFor="role-name"
                  >
                    Notice Title
                  </label>
                  <TextInput
                    size="lg"
                    placeholder="Enter here"
                    {...form.getInputProps("notice_title")}
                    required
                    className="text-danger mt-1"
                    id="role-name"
                  />
                </div>

                <div className="form-group text-start mb-3 col-lg-6">
                  <label
                    className="fw-bold text-secondary mb-1"
                    htmlFor="role-type"
                  >
                    Notice Date
                  </label>
                  <br />
                  <Calendar
                    value={noticeDate}
                    onChange={(e) => setNoticeDate(e.value)}
                    showIcon
                    dateFormat="dd/mm/yy"
                    id="examDate"
                    style={{ height: "3.2rem" }}
                  />
                </div>

                <div className="form-group text-start mb-3 col-lg-6">
                  <label
                    className="fw-bold text-secondary mb-1"
                    htmlFor="role-type"
                  >
                    Publish Date
                  </label>
                  <br />
                  <Calendar
                    placeholder="--Select--"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.value)}
                    showIcon
                    dateFormat="dd/mm/yy"
                    id="examDate"
                    style={{ height: "3.2rem" }}
                  />
                </div>

                <div className="form-group text-start mb-3 col-lg-12">
                  <label className="fw-bold text-secondary" htmlFor="role-name">
                    Description
                  </label>
                  <Textarea
                    size="lg"
                    placeholder="Enter here"
                    {...form.getInputProps("description")}
                    required
                    className="text-danger mt-1"
                    id="role-name"
                    maxLength={500}
                  />
                </div>

                <div>
                  <div className="col-lg-12 mb-3">
                    <span className="fw-bold text-secondary">Attachment</span>
                    <div className="upload-documents">
                      <div className="upload-logo">
                        {fileUpload || noticeData.document_url ? (
                          <img
                            src={
                              fileUpload
                                ? URL.createObjectURL(fileUpload)
                                : noticeData?.document_url
                            }
                            alt=""
                            className="uploaded-vehicle-image"
                          />
                        ) : (
                          <IconCloudUpload size={40} color="grey" />
                        )}
                      </div>

                      <div className="upload-image-container">
                        <input
                          accept=".pdf, .jpg, .jpeg, .csv, .png"
                          type="file"
                          id="upload"
                          onChange={handleUploadedFile}
                        />
                        {fileUpload || noticeData.document_url ? (
                          <>
                            <label
                              htmlFor="upload"
                              className="fw-bold"
                              style={{ cursor: "pointer" }}
                            >
                              {fileUpload
                                ? fileUpload.name
                                : noticeData && noticeData?.document_url
                                ? noticeData?.registration_certificate
                                    .split("/")
                                    .pop()
                                : "Click here to upload your document (pdf, jpg or png)"}
                            </label>
                            {fileUpload || noticeData ? (
                              <Tooltip
                                label="Preview"
                                color="#DB3525"
                                arrowSize={6}
                                withArrow
                                position="right"
                              >
                                <a
                                  href={
                                    noticeData?.document_url
                                      ? noticeData?.document_url
                                      : URL.createObjectURL(fileUpload)
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <IconEye style={{ marginLeft: "20px" }} />
                                </a>
                              </Tooltip>
                            ) : null}
                          </>
                        ) : (
                          <div className="d-flex flex-column ">
                            <label
                              htmlFor="upload"
                              className="fw-bold"
                              style={{
                                cursor: "pointer",
                                textDecoration: "underline",
                                color: "#002699",
                              }}
                            >
                              Click here to upload
                            </label>

                            <span
                              style={{
                                color: "grey",
                              }}
                            >
                              Supported format: pdf, jpeg, CSV, png
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    {fileError ? (
                      <span className="m-8f816625 mt-3">
                        Upload jpg, jpeg, png only.{" "}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12 col-lg-4">
              <div className="row routeDriverSection">
                <label
                  className="fw-bold fs-5 text-secondary mb-3"
                  htmlFor="role-type"
                >
                  Message to
                </label>

                <div className="form-group text-start mb-3 col-lg-12">
                  <label
                    className="fw-bold text-secondary mb-1"
                    htmlFor="role-type"
                  >
                    Role Type *
                  </label>
                  <br />
                  <select
                    className="normalSelect"
                    onChange={(e) => onSelectRole(e)}
                    value={roleID !== null ? roleID : ""}
                  >
                    <option value="">--Select--</option>
                    {rolesList?.map((role, index) => (
                      <option key={index} value={role.role_id}>
                        {" "}
                        {role.role_name}{" "}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group text-start mb-3 col-lg-12">
                  <label
                    className="fw-bold text-secondary mb-1"
                    htmlFor="role-type"
                  >
                    Role *
                  </label>
                  <br />
                  <select className="normalSelect">
                    <option value="">--Select--</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {state?.data?.notice_id ? (
            <button
              className="btn add-button mt-3"
              type="submit"
              style={{ color: "#fff" }}
            >
              Update
            </button>
          ) : (
            <button
              className="btn add-button mt-3 mb-2"
              type="submit"
              style={{ color: "#fff" }}
            >
              Add
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default NoticeForm;
