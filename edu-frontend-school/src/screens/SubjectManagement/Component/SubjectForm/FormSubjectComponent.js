import React, { useEffect, useState } from "react";
import "./FormSubjectComponent.css";
import { TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconChevronLeft, IconTrash } from "@tabler/icons-react";
import { useNavigate, useLocation } from "react-router-dom";
import * as addSubjectService from "../../Subject.service";
import ToastUtility from "../../../../utility/ToastUtility";
import { IconArrowLeft } from "@tabler/icons-react";

const FormSubjectComponent = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [subjectsList, setSubjectsList] = useState([]);
  const [errorMessage, setErrorMessage] = useState(false);
  const [subjectData, setSubjectData] = useState({});
  const [suggestedSubjectsList, setSuggestedSubjectsList] = useState([]);

  const form = useForm({
    initialValues: {
      subject_name: "",
    },
  });

  const onSubmit = async () => {
    if (state?.subject.subject_id) {
      const { subject_name } = form.values;
      const payload = {
        subject_name: subject_name,
        subject_id: state?.subject.subject_id,
      };

      const updateSubjectResponse = await addSubjectService.updateSubject(
        payload
      );
      if (!updateSubjectResponse.error) {
        ToastUtility.success("Subject Updated Successfully");
        if (updateSubjectResponse.data) {
          navigate("/subjectmanagement");
        }
      } else {
      }
    } else {
      const payload = {
        subject_name: subjectsList,
        status: 1,
      };

      const addSubjectResponse = await addSubjectService.addSubject(payload);
      if (!addSubjectResponse.error) {
        ToastUtility.success("Subject added successfully");
        if (addSubjectResponse.data) {
          navigate("/subjectmanagement");
        }
      } else {
      }
    }
  };

  const goBackToSubjectManagementPage = () => {
    navigate("/subjectmanagement");
  };

  // const addSubjects = () => {
  //   if (form.values.subject_name !== "") {
  //     setErrorMessage(false);
  //     const { subject_name } = form.values;
  //     setSubjectsList((prevSubject) => [
  //       ...prevSubject,
  //       subject_name.charAt(0).toUpperCase() + subject_name.slice(1),
  //     ]);
  //     form.values.subject_name = "";
  //   } else {
  //     setErrorMessage(true);
  //   }
  // };

  const addSubjects = () => {
    const { subject_name } = form.values;

    if (/[\w\d]/.test(subject_name)) {
      setErrorMessage(false);
      setSubjectsList((prevSubject) => [
        ...prevSubject,
        subject_name.charAt(0).toUpperCase() + subject_name.slice(1).trim(),
      ]);
      form.values.subject_name = "";
    } else {
      setErrorMessage(true);
    }
  };

  const removeSubject = (id) => {
    setSubjectsList(subjectsList.filter((_, index) => id !== index));
  };

  const getDataBySubjectId = async (subjectId) => {
    const getSubjectBySubjectIdResponse =
      await addSubjectService.getSubjectBySubjectId(subjectId);
    if (!getSubjectBySubjectIdResponse.error) {
      setSubjectData(getSubjectBySubjectIdResponse.data.data);
    } else {
    }
  };

  const getSuggestedSubjectsList = async () => {
    const getSuggestedSubjectsResponse =
      await addSubjectService.getSuggestedSubjects();
    if (!getSuggestedSubjectsResponse.error) {
      setSuggestedSubjectsList(getSuggestedSubjectsResponse?.data);
    } else {
    }
  };

  useEffect(() => {
    if (state?.subject.subject_id) {
      getDataBySubjectId(state?.subject.subject_id);
    }

    getSuggestedSubjectsList();
  }, []);

  useEffect(() => {
    form.setValues(subjectData);
  }, [subjectData]);

  const swipeSubject = (subject) => {
    const updatedForm = { ...form };
    updatedForm.subject_name = subject;
    form.setValues(updatedForm);
  };

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center">
        <IconChevronLeft
          size={30}
          onClick={goBackToSubjectManagementPage}
          style={{ cursor: "pointer" }}
          color="black"
        />
        <span
          className="fw-bold"
          style={{ fontSize: "20px", marginLeft: "10px" }}
        >
          {state?.subject.subject_name ? "Update subject" : "Add subject"}
        </span>
      </div>
      <div className="add-organization-container mx-2 pt-2">
        <form onSubmit={form.onSubmit(onSubmit)}>
          <div className="row mt-0">
            <div className="form-group text-start mb-3 col-12 col-lg-6 ">
              <label className="fw-bold text-secondary" htmlFor="role-name">
                Subject Name *
              </label>
              <div className="d-flex align-items-center">
                <TextInput
                  size="lg"
                  placeholder="Enter here"
                  {...form.getInputProps("subject_name")}
                  className="text-danger mt-1"
                  id="role-name"
                  maxLength={50}
                />
                {state?.subject.subject_id ? null : (
                  <button
                    className="btn add-more-button"
                    type="button"
                    onClick={() => addSubjects()}
                  >
                    {subjectsList.length === 0 || state?.subject.subject_id
                      ? "Add"
                      : "+ Add more"}
                  </button>
                )}
              </div>
              {errorMessage ? (
                <span className="error-message">Please add subject</span>
              ) : null}
              {subjectsList.length > 0 ? (
                <div className="row mt-3 section-list-main-container">
                  {subjectsList?.map((subject, index) => (
                    <div className="col-lg-6 ">
                      <div className="subject-list-container" key={index}>
                        <span className="wordBreak">{subject}</span>
                        <IconTrash
                          className="delete-icon"
                          onClick={() => removeSubject(index)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="col-lg-6 ">
              {suggestedSubjectsList.length > 0 ? (
                <div
                  className="suggested-subjects-containers shadow p-2 rounded"
                  style={{ background: "#F3F2F4" }}
                >
                  <span className="fw-bold" style={{ color: "grey" }}>
                    Suggested Subjects List
                  </span>
                  {suggestedSubjectsList.length > 0 ? (
                    <div className="row mt-3 section-list-main-container">
                      {suggestedSubjectsList?.map((eachSubject, index) => (
                        <div
                          className="col-lg-6 subject-name "
                          onClick={() => swipeSubject(eachSubject)}
                        >
                          <div
                            className="subject-list-container "
                            key={index}
                            style={{ background: "#fff", height: "50px" }}
                          >
                            <IconArrowLeft className="left-icon" color="blue" />
                            <span className="wordBreak">{eachSubject}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>

          {state?.subject.subject_name ? (
            <button
              className="btn add-button mt-3 mb-2"
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
              disabled={!subjectsList.length > 0}
            >
              Save
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default FormSubjectComponent;
