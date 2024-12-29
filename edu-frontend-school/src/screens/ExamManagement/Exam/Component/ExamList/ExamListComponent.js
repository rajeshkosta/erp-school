import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import * as addExamService from "../../Exam.service";
import * as addClassService from "../../../../Class/Class.service";
import CommanGrid from "../../../../../shared/components/GridTable/CommanGrid";
import "./ExamListComponent.css";
import { useAuth } from "../../../../../context/AuthContext";

const ExamListComponent = () => {
  const navigate = useNavigate();
  const [examList, setExamList] = useState([]);
  const [academicList, setAcademicList] = useState([]);
  const [academicId, setAcademicId] = useState("");
  const { userDetails, academicYear } = useAuth();

  const examData = [...examList];

  const activateGridScreen = (data) => {
    navigate("/exam/grid", {
      state: {
        data: data,
        academic_year_id: parseInt(academicId),
      },
    });
  };

  const getClassListByExam = async (academicId) => {
    const getExamListByExamResponse = await addExamService.getClassListByExam(
      academicId
    );
    if (!getExamListByExamResponse.error) {
      setExamList(getExamListByExamResponse?.data);
    }
  };

  const getAcademicList = async () => {
    const getAcademicListResponse = await addClassService.getAcademicList();
    setAcademicList(getAcademicListResponse.data);
  };

  useEffect(() => {
    getAcademicList();
    setAcademicId(academicYear);
    if (academicYear) {
      getClassListByExam(academicYear);
    }
  }, [academicYear]);

  const getSelectAcademicId = async (e) => {
    setAcademicId(e.target.value);
    if (e.target.value) {
      await getClassListByExam(e.target.value);
    }
  };

  return (
    <div>
      <div className="row justify-content-between align-items-center mb-3 examinationSection">
        <div className="col-md-4 col-lg-4 col-xl-7">
          <span className="fw-bold" style={{ fontSize: "20px" }}>
            Exam Master
          </span>
        </div>

        <div className="col-md-8 col-lg-8 col-xl-5">
          <div
            className="form-group text-start row"
            style={{ justifyContent: "end" }}
          >
            <div className="col-md-7">
              <select
                size="lg"
                className="normalSelect"
                onChange={getSelectAcademicId}
                value={academicId}
              >
                <option value="">Select Academic Year</option>
                {academicList?.map((eachAcademic, index) => (
                  <option key={index} value={eachAcademic.academic_year_id}>
                    {eachAcademic.academic_year_name}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="btn add-button col-md-3"
              onClick={() => navigate("/exam/add")}
              style={{ color: "#fff" }}
            >
              Add Exam
            </button>
          </div>
        </div>
      </div>
      <div className="row mt-1 ">
        {examData.length > 0 ? (
          examData?.map((data, index) => (
            <div className="col-md-6 col-lg-3" key={index}>
              <div
                className="fee-list-container"
                onClick={() => activateGridScreen(data)}
              >
                <span className="fw-bold">Class</span>
                <p className="sub-subject-list">{data.std_name}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="d-flex align-items-center justify-content-center">
            {academicId !== ""
              ? "No exams assigned yet for this academic year"
              : "Select an academic year to see the list of exams"}
          </p>
        )}
      </div>
    </div>
  );
};

export default ExamListComponent;
