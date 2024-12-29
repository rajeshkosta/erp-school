import { Checkbox, NativeSelect, NumberInput, TextInput } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { useLocation, useNavigate } from "react-router-dom";
import { Calendar } from "primereact/calendar";
import * as addExamService from "../../Exam.service";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import ToastUtility from "../../../../../utility/ToastUtility";
import moment from "moment";
import { useAuth } from "../../../../../context/AuthContext";

const FormExamComponent = () => {
  const navigate = useNavigate();

  const { state } = useLocation();

  const [classroomID, setClassroomID] = useState(null);
  const [subjectID, setSubjectID] = useState(null);
  const [examTypeID, setExamTypeID] = useState(null);
  const [academicId, setAcademicId] = useState(null);

  const [academicList, setAcademicList] = useState([]);
  const [classroomList, setClassroomList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [examTypeList, setExamTypeList] = useState([]);

  const [examDate, setExamDate] = useState(null);

  const [examData, setExamData] = useState({});
  const { userDetails, academicYear } = useAuth();
  const goBackToExamManagementPage = () => {
    navigate("/exam");
  };

  const form = useForm({
    initialValues: {
      description: "",
      duration: "",
      total_marks: "",
      passing_marks: "",
    },

    validate: {
      description: (value) =>
        value === "" ? "Please enter description" : null,
      duration: (value) => (value === "" ? "Please enter duration" : null),
      total_marks: (value) =>
        value === "" ? "Please enter total marks" : null,
      passing_marks: (value, values) => {
        if (value === "") {
          return "Please enter passing marks";
        }
        const totalMarks = parseInt(values.total_marks, 10);
        const passingMarks = parseInt(value, 10);
        if (passingMarks > totalMarks) {
          return "Passing marks should not be more than total marks";
        }
        return null;
      },
    },
  });

  const getAcademicList = async () => {
    const getAcademicListResponse = await addExamService.getAcademicList();
    const academicData = [getAcademicListResponse?.data];
    setAcademicList(...academicData);
  };

  const getClassroom = async (academicId) => {
    const payload = {
      academic_year_id: parseInt(academicId),
    };
    const getClassroomResponse = await addExamService.getClassroomList(payload);
    const classroomData = [getClassroomResponse?.data?.data];
    setClassroomList(...classroomData);

    if (examData?.class_id) {
      setClassroomID(examData?.class_id || null);
    }
  };

  const getSubject = async (classroomID, academicId) => {
    const payload = {
      academic_year_id: parseInt(academicId),
      class_id: parseInt(classroomID),
    };
    const getSubjectResponse = await addExamService.getSubjectList(payload);
    const subjectData = [getSubjectResponse?.data?.data];
    setSubjectList(...subjectData);

    if (examData?.subject_id) {
      setSubjectID(examData?.subject_id || null);
    }
  };

  const getExamType = async () => {
    const getExamTypeResponse = await addExamService.getExamTypeList();
    const examTypeData = [getExamTypeResponse.data?.data];
    setExamTypeList(...examTypeData);
  };

  useEffect(() => {
    getExamType();
    const fetchData = async () => {
      await getAcademicList();
      setAcademicId(academicYear);
      getClassroom(academicYear);
    };
    fetchData();
  }, [academicYear]);

  const onSelectAcademic = async (e) => {
    setAcademicId(e.target.value);
    await getClassroom(e.target.value);
  };

  const onSelectClassroom = async (e) => {
    const selectedClassroomID = e.target.value;
    setClassroomID(selectedClassroomID);
    await getSubject(selectedClassroomID, academicId);
  };

  const onSelectSubject = async (e) => {
    setSubjectID(e.target.value);
  };

  const onSelectExamType = async (e) => {
    setExamTypeID(e.target.value);
  };

  useEffect(() => {
    form.setValues({
      description: examData?.description || "",
      duration: examData?.duration || "",
      total_marks: examData?.total_marks || "",
      passing_marks: examData?.passing_marks || "",
    });

    setAcademicId(examData?.academic_year_id || null);

    setExamTypeID(examData?.exam_type_id || null);

    setExamDate(
      examData?.exam_date
        ? moment(examData?.exam_date, "DD/MM/YYYY").toDate()
        : null
    );

    if (examData?.academic_year_id) {
      getClassroom(examData?.academic_year_id);
    }

    if (examData?.class_id) {
      getSubject(examData?.class_id, examData?.academic_year_id);
    }
  }, [examData]);

  const onSubmit = async () => {
    if (state?.rowData.examination_id) {
      const { description, duration, total_marks, passing_marks } = form.values;
      const payload = {
        examination_id: parseInt(state?.rowData.examination_id),
        academic_year_id: parseInt(academicId),
        class_id: parseInt(classroomID),
        subject_id: parseInt(subjectID),
        exam_type_id: parseInt(examTypeID),
        exam_date: examDate ? moment(examDate).format("YYYY/MM/DD") : null,
        description: description,
        duration: duration,
        total_marks: total_marks,
        passing_marks: passing_marks,
      };

      const updateResponse = await addExamService.UpdateExam(payload);

      if (!updateResponse.error) {
        ToastUtility.success("Examination updated Successfully");
        navigate("/exam");
      }
    } else {
      const { description, duration, total_marks, passing_marks } = form.values;
      const payload = {
        academic_year_id: parseInt(academicId),
        class_id: parseInt(classroomID),
        subject_id: parseInt(subjectID),
        exam_type_id: parseInt(examTypeID),
        exam_date: moment(examDate).format("YYYY/MM/DD"),
        description: description,
        duration: duration,
        total_marks: total_marks,
        passing_marks: passing_marks,
      };

      const addExamResponse = await addExamService.AddExam(payload);

      if (!addExamResponse.error) {
        ToastUtility.success("Examination added successfully.");
        if (addExamResponse.data) {
          navigate("/exam");
        }
      } else {
        ToastUtility.info("Please add proper Examination Details");
      }
    }
  };

  const getDataByExamId = async (examID) => {
    const getExamByExamIdResponse = await addExamService.getExamByExamId(
      examID
    );
    if (!getExamByExamIdResponse.error) {
      setExamData(getExamByExamIdResponse.data);
    } else {
      ToastUtility.error("No data found for this examination ID!");
    }
  };

  useEffect(() => {
    if (state?.rowData.examination_id) {
      getDataByExamId(state?.rowData.examination_id);
    }
  }, []);

  const currentDate = new Date();

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center">
        <IconChevronLeft
          size={30}
          onClick={goBackToExamManagementPage}
          style={{ cursor: "pointer" }}
          color="black"
        />
        <span
          className="fw-bold"
          style={{ fontSize: "20px", marginLeft: "10px" }}
        >
          {state?.rowData ? "Update Exam Master" : "Add Exam Master"}
        </span>
      </div>
      <div className="add-organization-container mx-2 pt-2">
        <form onSubmit={form.onSubmit(onSubmit)}>
          <div className="row mt-2">
            <div className="form-group text-start mb-3 col-lg-4">
              <label
                className="fw-bold text-secondary mb-1"
                htmlFor="role-name"
              >
                Academic Year *
              </label>
              <br />
              <select
                className="normalSelect"
                onChange={(e) => onSelectAcademic(e)}
                value={academicId !== null ? academicId : ""}
              >
                {academicList?.map((academic, index) => (
                  <option key={index} value={academic.academic_year_id}>
                    {" "}
                    {academic.academic_year_name}{" "}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group text-start mb-3 col-lg-4">
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
                <option value="">-Select-</option>
                {classroomList?.map((classroom, index) => (
                  <option key={index} value={classroom.std_id}>
                    {" "}
                    {classroom.std_name}{" "}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group text-start mb-3 col-lg-4">
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
                <option value="">-Select-</option>
                {subjectList?.map((subject, index) => (
                  <option key={index} value={subject.subject_id}>
                    {" "}
                    {subject.subject_name}{" "}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group text-start mb-3 col-lg-4">
              <label className="fw-bold text-secondary" htmlFor="role-name">
                Description *
              </label>
              <TextInput
                size="lg"
                placeholder="Enter here"
                {...form.getInputProps("description")}
                required
                className="text-danger mt-1"
                id="role-name"
              />
            </div>
            <div className="form-group text-start mb-3 col-lg-4">
              <label
                className="fw-bold text-secondary mb-1"
                htmlFor="role-type"
              >
                Exam Type *
              </label>
              <br />
              <select
                className="normalSelect"
                onChange={(e) => onSelectExamType(e)}
                value={examTypeID !== null ? examTypeID : ""}
              >
                <option value="">-Select-</option>
                {examTypeList?.map((examType, index) => (
                  <option key={index} value={examType.exam_type_id}>
                    {" "}
                    {examType.exam_name}{" "}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group text-start mb-3 col-lg-4">
              <label
                className="fw-bold text-secondary mb-1"
                htmlFor="role-type"
              >
                Exam Date *
              </label>
              <br />
              <Calendar
                placeholder="-Select-"
                value={examDate}
                onChange={(e) => setExamDate(e.value)}
                showIcon
                dateFormat="dd/mm/yy"
                id="examDate"
                minDate={currentDate}
                style={{height:"3.2rem"}}
              />
            </div>

            <div className="form-group text-start mb-3 col-lg-4">
              <label
                className="fw-bold text-secondary mb-1"
                htmlFor="role-type"
              >
                Duration * (in minutes)
              </label>
              <NumberInput
                size="lg"
                placeholder="Enter here"
                {...form.getInputProps("duration")}
                required
                maxLength={3}
                hideControls
                className="text-danger mt-1"
                id="role-name"
              />
            </div>

            <div className="form-group text-start mb-3 col-lg-4">
              <label
                className="fw-bold text-secondary mb-1"
                htmlFor="role-type"
              >
                Total Marks *
              </label>
              <NumberInput
                size="lg"
                placeholder="Enter here"
                {...form.getInputProps("total_marks")}
                required
                maxLength={3}
                hideControls
                className="text-danger mt-1"
                id="role-name"
              />
            </div>

            <div className="form-group text-start mb-3 col-lg-4">
              <label
                className="fw-bold text-secondary mb-1"
                htmlFor="role-type"
              >
                Passing Marks *
              </label>
              <NumberInput
                size="lg"
                placeholder="Enter here"
                {...form.getInputProps("passing_marks")}
                required
                maxLength={3}
                hideControls
                className="text-danger mt-1"
                id="role-name"
              />
            </div>
          </div>
          {state?.rowData.examination_id ? (
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

export default FormExamComponent;
