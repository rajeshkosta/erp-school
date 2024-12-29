import React, { useEffect, useState } from "react";
import "./FormExamTypeComponent.css";
import { TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconChevronLeft, IconTrash } from "@tabler/icons-react";
import { useNavigate, useLocation } from "react-router-dom";
import * as addExamTypeService from "../../ExamType.service";
import ToastUtility from "../../../../../utility/ToastUtility";

const FormExamTypeComponent = () => {
  const navigate = useNavigate();

  const { state } = useLocation();

  const [examTypeList, setExamTypeList] = useState([]);
  const [errorMessage, setErrorMessage] = useState(false);
  const [examTypeData, setExamTypeData] = useState({});

  const form = useForm({
    initialValues: {
      exam_name: "",
    },
  });

  const onSubmit = async () => {
    const { exam_name } = form.values;
    const regex = /[\w\d]/.test(exam_name);

    if (state?.examType.exam_type_id) {
      if (regex) {
        setErrorMessage(false);
        const payload = {
          exam_name: exam_name,
          exam_type_id: state?.examType.exam_type_id,
        };

        const updateExamTypeResponse = await addExamTypeService.updateExamType(
          payload
        );
        if (!updateExamTypeResponse.error) {
          ToastUtility.success("Exam Type updated successfully");
          if (updateExamTypeResponse.data) {
            navigate("/examtype");
          }
        }
      } else {
        setErrorMessage(true);
      }
    } else {
      const payload = {
        exam_name: examTypeList,
      };

      const addExamTypeResponse = await addExamTypeService.addExamType(payload);

      if (!addExamTypeResponse.error) {
        ToastUtility.success("Exam Type added successfully");
        if (addExamTypeResponse.data) {
          navigate("/examtype");
        }
      } else {
      }
    }
  };

  const goBackToExamTypePage = () => {
    navigate("/examtype");
  };

  const addExamTypes = () => {
    const { exam_name } = form.values;
    if (/[\w\d]/.test(exam_name)) {
      setErrorMessage(false);
      setExamTypeList((prevExam) => [
        ...prevExam,
        exam_name.charAt(0).toUpperCase() + exam_name.slice(1).trim(),
      ]);
      form.values.exam_name = "";
    } else {
      setErrorMessage(true);
    }
  };

  const removeExamType = (id) => {
    setExamTypeList(examTypeList.filter((_, index) => id !== index));
  };

  const getDataByExamTypeId = async (examId) => {
    const getExamTypeByExamTypeIdResponse =
      await addExamTypeService.getExamTypeByExamTypeId(examId);
    if (!getExamTypeByExamTypeIdResponse.error) {
      setExamTypeData(getExamTypeByExamTypeIdResponse.data.examDetails);
    } else {
    }
  };

  useEffect(() => {
    if (state?.examType.exam_type_id) {
      getDataByExamTypeId(state?.examType.exam_type_id);
    }
  }, []);

  useEffect(() => {
    form.setValues(examTypeData);
  }, [examTypeData]);

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center">
        <IconChevronLeft
          size={30}
          onClick={goBackToExamTypePage}
          style={{ cursor: "pointer" }}
          color="black"
        />
        <span
          className="fw-bold"
          style={{ fontSize: "20px", marginLeft: "10px" }}
        >
          {state?.examType.exam_name ? "Update Exam Type" : "Add Exam Type"}
        </span>
      </div>
      <div className="add-organization-container mx-2 pt-2">
        <form onSubmit={form.onSubmit(onSubmit)}>
          <div className="row mt-4">
            <div className="form-group text-start mb-3 col-12 col-lg-6 ">
              <label className="fw-bold text-secondary" htmlFor="role-name">
                Exam Type *
              </label>
              <div className="d-flex align-items-center">
                <TextInput
                  size="lg"
                  placeholder="Enter here"
                  {...form.getInputProps("exam_name")}
                  className="text-danger mt-1"
                  id="role-name"
                  maxLength={20}
                />
                {state?.examType.exam_type_id ? (
                  ""
                ) : (
                  <button
                    className="btn add-more-button"
                    type="button"
                    onClick={() => addExamTypes()}
                  >
                    {examTypeList.length === 0 || state?.examType.exam_type_id
                      ? "Add"
                      : "+ Add more"}
                  </button>
                )}
              </div>
              {errorMessage ? (
                <span className="error-message">Please add exam type</span>
              ) : null}
            </div>
          </div>

          {examTypeList.length > 0 ? (
            <div className="row mt-3 section-list-main-container">
              {examTypeList?.map((examType, index) => (
                <div className="col-lg-3 ">
                  <div className="section-list-container">
                    <span>{examType}</span>
                    <IconTrash
                      className="delete-icon"
                      onClick={() => removeExamType(index)}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {state?.examType.exam_type_id ? (
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
              disabled={!examTypeList.length > 0}
            >
              Save
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default FormExamTypeComponent;
