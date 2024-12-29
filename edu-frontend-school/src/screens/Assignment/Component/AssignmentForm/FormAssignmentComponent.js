import "./FormAssignmentComponent.css";
import { TextInput, Textarea, Tooltip } from "@mantine/core";
import { IconChevronLeft, IconCloudUpload, IconEye, IconTrash } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { useLocation, useNavigate } from "react-router-dom";
import { Calendar } from "primereact/calendar";
import * as addAssignmentService from "../../Assignment.service";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import moment from "moment";
import ToastUtility from "../../../../utility/ToastUtility";
import { useAuth } from "../../../../context/AuthContext";

const FormAssignmentComponent = () => {
  const navigate = useNavigate();

  const { state } = useLocation();

  const [classroomID, setClassroomID] = useState(null);
  const [subjectID, setSubjectID] = useState(null);
  const [sectionID, setSectionID] = useState(null);
  const [academicId, setAcademicId] = useState(null);

  const [academicList, setAcademicList] = useState([]);
  const [classroomList, setClassroomList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [sectionList, setSectionList] = useState([]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [fileUpload, setFileUpload] = useState(null);
  const [fileError, setFileError] = useState(false);
  const [dateError, setDateError] = useState(false);

  const [assignmentData, setAssignmentData] = useState({});
  const [assignmentFileErrorMessage, setAssignmentFileErrorMessage] =
    useState("");

  const { userDetails, academicYear } = useAuth();

  const formData = new FormData();
  const currentDate = new Date();

  const goBackToAssignmentManagementPage = () => {
    navigate("/assignment");
  };

  const form = useForm({
    initialValues: {
      assignment_title: "",
      assignment_description: "",
    },

    validate: {
      assignment_title: (value) =>
        value === "" ? "Please enter Assignment Title" : null,
      assignment_description: (value) =>
        value === "" ? "Please enter Assignment Description" : null,
    },
  });

  const getAcademicList = async () => {
    const getAcademicListResponse =
      await addAssignmentService.getAcademicList();
    const academicData = [getAcademicListResponse?.data];
    setAcademicList(...academicData);
  };

  const getClassroom = async (academicId) => {
    const payload = {
      academic_year_id: parseInt(academicId),
    };
    const getClassroomResponse = await addAssignmentService.getClassroomList(
      payload
    );
    const classroomData = [getClassroomResponse?.data?.data];
    setClassroomList(...classroomData);
  };

  const getSubject = async (sectionID, academicId) => {
    const payload = {
      academic_year_id: parseInt(academicId),
      classroom_id: parseInt(sectionID),
    };
    const getSubjectResponse = await addAssignmentService.getSubjectList(
      payload
    );
    const subjectData = [getSubjectResponse?.data?.data];
    setSubjectList(...subjectData);
  };

  const getSection = async (classroomID, academicId) => {
    const payload = {
      academic_year_id: parseInt(academicId),
      class_id: parseInt(classroomID),
    };
    const getAssignmentResponse = await addAssignmentService.getSectionList(
      payload
    );
    const sectionData = [getAssignmentResponse?.data?.data];
    setSectionList(...sectionData);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getAcademicList();
      setAcademicId(academicYear);
      getClassroom(academicYear);
    };
    fetchData();
  }, [academicYear]);

  const onSelectAcademic = async (e) => {
    setAcademicId(e.target.value);
    if (e.target.value) {
      await getClassroom(e.target.value);
    }
  };

  const onSelectClassroom = async (e) => {
    const selectedClassroomID = e.target.value;
    setClassroomID(selectedClassroomID);
    await getSection(selectedClassroomID, academicId);
  };

  const onSelectSubject = async (e) => {
    setSubjectID(e.target.value);
  };

  const onSelectSection = async (e) => {
    const selectedSectionID = e.target.value;
    setSectionID(selectedSectionID);
    await getSubject(selectedSectionID, academicId);
  };

  const handleUploadedFile = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      selectedFile.type.includes("pdf") ||
        selectedFile.type.includes("jpeg") ||
        selectedFile.type.includes("png") ||
        selectedFile.type.includes("jpg") ||
        selectedFile.type.includes("csv");

      if (selectedFile.size <= 2 * 1024 * 1024) {
        setFileUpload(selectedFile);
        setFileError(false);
        setAssignmentFileErrorMessage("");
      } else {
        setFileUpload(null);
        setFileError(true);
        setAssignmentFileErrorMessage("File size should be less than 2 MB.");
      }
    } else {
      setFileUpload(null);
      setFileError(false);
      setAssignmentFileErrorMessage(
        "Unsupported file type. Upload jpg, jpeg, png, csv or pdf only."
      );
    }
  };

  const onSubmit = async () => {
    if (startDate && endDate && endDate < startDate) {
      setDateError(true);
      ToastUtility.error("End date cannot not be before start date.");
    } else {
      setDateError(false);
      if (state?.rowData.assignment_id) {
        const { assignment_title, assignment_description } = form.values;
        const updated_assignment_data = {
          assignment_id: state?.rowData.assignment_id,
          classroom_id: parseInt(sectionID),
          subject_id: parseInt(subjectID),
          start_date: startDate ? moment(startDate).format("YYYY/MM/DD") : null,
          end_date: endDate ? moment(endDate).format("YYYY/MM/DD") : null,
          assignment_description: assignment_description,
          assignment_title: assignment_title,
        };

        formData.append("update_data", JSON.stringify(updated_assignment_data));
        // formData.append("assignment_document", fileBlob, fileUpload.name);
        formData.append("update_document", fileUpload);

        const updateResponse = await addAssignmentService.UpdateAssignment(
          formData
          // { "Content-Type": "multipart/form-data" }
        );

        if (!updateResponse.error) {
          ToastUtility.success("Assignment Updated Successfully");
          navigate("/assignment");
        }
      } else {
        const { assignment_title, assignment_description } = form.values;
        const assignment_data = {
          classroom_id: parseInt(sectionID),
          subject_id: parseInt(subjectID),
          start_date: startDate ? moment(startDate).format("YYYY/MM/DD") : null,
          end_date: endDate ? moment(endDate).format("YYYY/MM/DD") : null,
          assignment_description: assignment_description,
          assignment_title: assignment_title,
        };

        formData.append("assignment_data", JSON.stringify(assignment_data));
        // formData.append("assignment_document", fileBlob, fileUpload.name);
        formData.append("assignment_document", fileUpload);

        const addassignmentResponse = await addAssignmentService.AddAssignment(
          formData
          // { "Content-Type": "multipart/form-data" }
        );

        if (!addassignmentResponse.error) {
          ToastUtility.success("Assignment added successfully.");
          if (addassignmentResponse.data) {
            navigate("/assignment");
          }
        } else {
          ToastUtility.info("Please add proper assignment details");
        }
      }
    }
  };

  const getDataByAssignmentId = async (assignmentID) => {
    const getAssignmentByAssignmentIdResponse =
      await addAssignmentService.getAssignmentByAssignmentId(assignmentID);

    if (!getAssignmentByAssignmentIdResponse.error) {
      setAssignmentData(getAssignmentByAssignmentIdResponse.data);
    } else {
      ToastUtility.error("No data found for this assignment ID!");
    }
  };

  useEffect(() => {
    if (state?.rowData.assignment_id) {
      getDataByAssignmentId(state?.rowData.assignment_id);
    }
  }, []);

  useEffect(() => {
    form.setValues({
      assignment_title: assignmentData?.assignment_title || "",
      assignment_description: assignmentData?.assignment_description || "",
    });

    setAcademicId(assignmentData?.academic_year_id || null);
    setClassroomID(assignmentData?.class_id || null);
    setSectionID(assignmentData?.classroom_id || null);
    setSubjectID(assignmentData?.subject_id || null);

    if (assignmentData?.academic_year_id) {
      getClassroom(assignmentData?.academic_year_id);
    }

    if (assignmentData?.class_id) {
      getSection(assignmentData?.class_id, assignmentData?.academic_year_id);
    }

    if (assignmentData?.classroom_id) {
      getSubject(
        assignmentData?.classroom_id,
        assignmentData?.academic_year_id
      );
    }

    const startDateObject = assignmentData?.start_date
      ? moment(assignmentData?.start_date).toDate()
      : null;

    const endDateObject = assignmentData?.end_date
      ? moment(assignmentData?.end_date).toDate()
      : null;

    setStartDate(startDateObject);
    setEndDate(endDateObject);

    if (startDateObject && endDateObject && endDateObject < startDateObject) {
      setDateError(true);
    } else {
      setDateError(false);
    }

    if (assignmentData?.academic_year_id) {
      getClassroom(assignmentData?.academic_year_id);
    }
  }, [assignmentData]);
  
  const removeAssignmentDocument = () => {
    setFileUpload(null);
  };

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center">
        <IconChevronLeft
          size={30}
          onClick={goBackToAssignmentManagementPage}
          style={{ cursor: "pointer" }}
          color="black"
        />
        <span
          className="fw-bold"
          style={{ fontSize: "20px", marginLeft: "10px" }}
        >
          {state?.rowData ? "Update Assignment" : "Add Assignment"}
        </span>
      </div>
      <div className="add-organization-container mx-2 pt-2">
        <form onSubmit={form.onSubmit(onSubmit)}>
          <div className="row mt-2">
            <div className="form-group text-start mb-3 col-lg-3">
              <label
                className="fw-bold text-secondary mb-1"
                htmlFor="role-name"
              >
                Academic Year*
              </label>
              <br />
              <select
                className="normalSelect"
                onChange={(e) => onSelectAcademic(e)}
                value={academicId}
              >
                <option value="">--Select--</option>
                {academicList.map((academic, index) => (
                  <option key={index} value={academic.academic_year_id}>
                    {" "}
                    {academic.academic_year_name}{" "}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group text-start mb-3 col-lg-3">
              <label
                className="fw-bold text-secondary mb-1"
                htmlFor="role-type"
              >
                Class *
              </label>
              <br />
              <select
                className="normalSelect"
                onChange={(e) => onSelectClassroom(e)}
                value={classroomID !== null ? classroomID : ""}
              >
                <option value="">--Select--</option>
                {classroomList.map((classroom, index) => (
                  <option key={index} value={classroom.std_id}>
                    {" "}
                    {classroom.std_name}{" "}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group text-start mb-3 col-lg-3">
              <label
                className="fw-bold text-secondary mb-1"
                htmlFor="role-type"
              >
                Section *
              </label>
              <br />
              <select
                className="normalSelect"
                onChange={(e) => onSelectSection(e)}
                value={sectionID !== null ? sectionID : ""}
              >
                <option value="">--Select--</option>
                {sectionList.map((section, index) => (
                  <option key={index} value={section.classroom_id}>
                    {" "}
                    {section.section_name}{" "}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group text-start mb-3 col-lg-3">
              <label
                className="fw-bold text-secondary mb-1"
                htmlFor="role-type"
              >
                Subject *
              </label>
              <br />
              <select
                className="normalSelect"
                onChange={(e) => onSelectSubject(e)}
                value={subjectID !== null ? subjectID : ""}
              >
                <option value="">--Select--</option>
                {subjectList.map((subject, index) => (
                  <option key={index} value={subject.subject_id}>
                    {" "}
                    {subject.subject_name}{" "}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group text-start mb-3 col-lg-6">
              <label className="fw-bold text-secondary" htmlFor="role-name">
                Assignment Title *
              </label>
              <TextInput
                size="lg"
                placeholder="Enter here"
                {...form.getInputProps("assignment_title")}
                required
                className="text-danger mt-1"
                id="role-name"
              />
            </div>

            <div className="form-group text-start mb-3 col-lg-3">
              <label
                className="fw-bold text-secondary mb-1"
                htmlFor="role-type"
              >
                Start Date
              </label>
              <br />
              <Calendar
                placeholder="--Select--"
                value={startDate}
                onChange={(e) => setStartDate(e.value)}
                minDate={currentDate}
                showIcon
                dateFormat="dd/mm/yy"
                id="examDate"
                style={{ height: "3.2rem" }}
              />
            </div>

            <div className="form-group text-start mb-3 col-lg-3">
              <label
                className="fw-bold text-secondary mb-1"
                htmlFor="role-type"
              >
                End Date
              </label>
              <br />
              <Calendar
                placeholder="--Select--"
                value={endDate}
                onChange={(e) => setEndDate(e.value)}
                minDate={currentDate}
                showIcon
                dateFormat="dd/mm/yy"
                id="examDate"
                style={{ height: "3.2rem" }}
              />
              {/* {dateError ? (
                <span className="text-danger mt-3">
                  End date should not be before start date.
                </span>
              ) : null} */}
            </div>

            <div className="form-group text-start mb-3 col-lg-12">
              <label className="fw-bold text-secondary" htmlFor="role-name">
                Assignment Description *
              </label>
              <Textarea
                size="lg"
                placeholder="Enter here"
                {...form.getInputProps("assignment_description")}
                required
                className="text-danger mt-1"
                id="role-name"
                maxLength={500}
              />
            </div>
          </div>
          <div className="col-lg-6">
            <span className="fw-bold text-secondary">Upload Assignment</span>
            <div className="upload-documents mt-1">
              <div className="upload-logo">
                {fileUpload || assignmentData.docUrl ? (
                  <>
                    <img
                      src={
                        fileUpload
                          ? URL.createObjectURL(fileUpload)
                          : assignmentData.docUrl
                      }
                      alt=""
                      className="uploaded-vehicle-image"
                    />
                  </>
                ) : (
                  <IconCloudUpload size={40} color="grey" />
                )}
              </div>

              <div className="upload-image-container">
                <input
                  accept=".pdf, .jpg, .jpeg, .doc, .png"
                  type="file"
                  id="upload"
                  onChange={handleUploadedFile}
                />
                {fileUpload || assignmentData?.docUrl ? (
                  <>
                    <label
                      htmlFor="upload"
                      className="fw-bold"
                      style={{ cursor: "pointer" }}
                    >
                      {fileUpload
                        ? fileUpload.name
                        : assignmentData && assignmentData.docUrl
                        ? assignmentData.assignment_document.split("/").pop()
                        : "Click here to upload your document (pdf, jpg, doc or png)"}
                    </label>
                    {fileUpload || assignmentData ? (
                      <Tooltip
                        label="Preview"
                        color="#DB3525"
                        arrowSize={6}
                        withArrow
                        position="right"
                      >
                        <a
                          href={
                            assignmentData.docUrl
                              ? assignmentData.docUrl
                              : URL.createObjectURL(fileUpload)
                          }
                          target="_blank"
                          rel="noreferrer"
                        >
                          <IconEye style={{ marginLeft: "20px" }} />
                        </a>
                      </Tooltip>
                    ) : null}{fileUpload ? (
                      <IconTrash
                        style={{
                          paddingBottom: "1px",
                          marginLeft: "10px",
                          color: "red",
                          cursor: "pointer",
                        }}
                        onClick={() => removeAssignmentDocument()}
                      />
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
                      Supported format: pdf, jpeg, doc & png.
                    </span>
                  </div>
                )}
              </div>
            </div>
            {fileError ? (
              <span className="m-8f816625 mt-3">
                {assignmentFileErrorMessage}
              </span>
            ) : null}
          </div>

          {state?.rowData.assignment_id ? (
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

export default FormAssignmentComponent;
