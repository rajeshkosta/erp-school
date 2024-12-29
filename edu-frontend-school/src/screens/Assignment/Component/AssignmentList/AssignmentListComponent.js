import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import * as addAssignmentService from "../../Assignment.service";
import * as addClassService from "../../../../screens/Class/Class.service";
import CommanGrid from "../../../../../src/shared/components/GridTable/CommanGrid";
import "./AssignmentListComponent.css";
import { useAuth } from "../../../../context/AuthContext";

const AssignmentListComponent = () => {
  const navigate = useNavigate();
  const [assignmentList, setassignmentList] = useState([]);
  const [academicList, setAcademicList] = useState([]);
  const [academicId, setAcademicId] = useState("");
  const { userDetails, academicYear } = useAuth();

  const assignmentData = [...assignmentList];

  const activateGridScreen = (data) => {
    navigate("/assignment/grid", {
      state: {
        data: data,
        academic_year_id: parseInt(academicId),
      },
    });
  };

  const gettingClassListByAssignment = async (academicId) => {
    const payload = {
      academic_year_id: parseInt(academicId),
    };
    const getAssignmentListByAssignmentResponse =
      await addAssignmentService.getClassListByAssignment(payload);
    if (!getAssignmentListByAssignmentResponse.error) {
      setassignmentList(getAssignmentListByAssignmentResponse?.data);
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
      gettingClassListByAssignment(academicYear);
    }
  }, [academicYear]);

  const getSelectAcademicId = async (e) => {
    setAcademicId(e.target.value);
    if (e.target.value) {
      await gettingClassListByAssignment(e.target.value);
    }
  };

  return (
    <div>
      <div className="row justify-content-between align-items-center mb-3 assignmentinationSection">
        <div className="col-md-3 col-lg-6">
          <span className="fw-bold" style={{ fontSize: "20px" }}>
            Assignment
          </span>
        </div>
        <div className="col-md-9 col-lg-6 col-xl-6">
          <div
            className="row form-group text-start mb-3"
            style={{ justifyContent: "end" }}
          >
            <div className="col-md-6 col-lg-7">
              <select
                size="lg"
                className="normalSelect"
                onChange={(e) => getSelectAcademicId(e)}
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
              style={{ color: "#fff" }}
              className="btn add-button col-md-4 col-lg-5 col-xl-3"
              onClick={() => navigate("/assignment/add")}
            >
              Add Assignment
              {/* <Link
                to="/assignment/add"
                style={{ textDecoration: "none", color: "#fff" }}
              >
                Add Assignment
              </Link> */}
            </button>
          </div>
        </div>
      </div>
      <div className="row mt-1 ">
        {assignmentData.length > 0 ? (
          assignmentData.map((data, index) => (
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
              ? "No Assignment added for this Academic session"
              : "Select an academic year to see the list of classes"}
          </p>
        )}
      </div>
    </div>
  );
};

export default AssignmentListComponent;
