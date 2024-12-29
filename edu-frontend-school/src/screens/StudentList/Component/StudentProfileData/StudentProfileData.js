import React, { useState, useEffect } from "react";
import "./StudentProfileData.css";

import { useLocation, useNavigate } from "react-router-dom";
import * as studentProfileDataService from "../StudentProfileData/StudentProfileData.service";
import { IconCalendar, IconChevronLeft } from "@tabler/icons-react";
import StudentPersonalInfo from "./component/StudentPersonalInfo/StudentPersonalInfo";
import StudentFeesRecord from "./component/StudentFeesRecord/StudentFeesRecord";
import StudentExamRecord from "./component/StudentExamRecord/StudentExamRecord";
import StudentAttendanceRecord from "./component/StudentAttandanceRecord/StudentAttandanceRecord";

const StudentProfileData = () => {
  const [isPersonalInfoVisible, setPersonalInfoVisible] = useState(true);
  const [isFeesRecordVisible, setFeesRecordVisible] = useState(false);
  const [isAttendanceRecordVisible, setAttendanceRecordVisible] =
    useState(false);
  const [isExamRecordVisible, setExamRecordVisible] = useState(false);
  const [studentPersonalInfoDetails, setStudentPersonalInfoDetails] = useState(
    []
  );
  const [studentDetails, setStudentDetails] = useState(null);
  const { state } = useLocation();

  const selectTab = (tabName) => {
    if (tabName === "StudentPersonalInfo") {
      setPersonalInfoVisible(true);
      setFeesRecordVisible(false);
      setAttendanceRecordVisible(false);
      setExamRecordVisible(false);
    } else if (tabName === "StudentFeesRecord") {
      setPersonalInfoVisible(false);
      setFeesRecordVisible(true);
      setAttendanceRecordVisible(false);
      setExamRecordVisible(false);
    } else if (tabName === "StudentAttendanceRecord") {
      setPersonalInfoVisible(false);
      setFeesRecordVisible(false);
      setAttendanceRecordVisible(true);
      setExamRecordVisible(false);
    } else if (tabName === "StudentExamRecord") {
      setPersonalInfoVisible(false);
      setFeesRecordVisible(false);
      setAttendanceRecordVisible(false);
      setExamRecordVisible(true);
    }
  };

  
  const getStudentPersonalInfo = async (studentId, academicYearId) => {

    try {
      const payload = {
        student_admission_id: parseInt(studentId),
        academic_year_id: parseInt(academicYearId),
      };
    const getStudentPersonalInfoResponse =
      await studentProfileDataService.getStudentPersonalInfo(payload);
    if (!getStudentPersonalInfoResponse.error) {
      setStudentPersonalInfoDetails(
        getStudentPersonalInfoResponse.data?.data[0].studentDetails
      );
    } else {
      // Handle error
    }
  } catch (error) {
    console.error(" ", error);
    // Handle error
  }
};

  const navigate = useNavigate();

  const goBackToStudentListPage = () => {
    navigate("/studentList");
  };

  useEffect(() => {
    if (state?.rowData) {
      getStudentPersonalInfo(state?.rowData.student_admission_id, state?.academicId);
    }
  }, [state]);
 
  return (
    <div className="container-fluid">
     <div className="d-flex align-items-center">
     <IconChevronLeft
          size={30}
          onClick={goBackToStudentListPage}
          style={{ cursor: "pointer" }}
          color="black"
        />
  
  <span className="fw-bold" style={{ fontSize: "20px" }}>
    Student Details
  </span>
</div>
      <div className="add-organization-container mx-2 pt-2">
        <div className="row mt-5 mobile-view-margin">
          <div className="col-12 col-md-6 col-lg-4 mb-4 profile-section">
            <div className="student-profileData-container-section">
              <div className="profile-container">
                {studentPersonalInfoDetails?.student_photo_cdn ? (
                  <img
                    src={studentPersonalInfoDetails?.student_photo_cdn}
                    alt="profile"
                    style={{ borderRadius: "50%", width: "100px" }}
                  />
                ) : (
                  <img
                    src="/images/profile-pic.png"
                    alt="profile-pic"
                    className="profile-pic"
                  />
                )}
              </div>
              <h2 className="student-name">
                {studentPersonalInfoDetails?.full_name}<div className="Father_namee"><h6> s/o { studentPersonalInfoDetails?.father_name } </h6></div>
              </h2>
              
              <div className="border-bottom"></div>
              <div>
                <div className="container">
                  <span className="admission-date">Academic :</span>
                  <span className="personal_details">
                    {" "}
                    {studentPersonalInfoDetails?.academic_year_name}
                  </span>
                </div>
                <div className="container">
                  <span className="admission-date">Admission No. :</span>
                  <span className="personal_details">
                    {" "}
                    {studentPersonalInfoDetails?.student_admission_number}
                  </span>
                </div>
                <div className="container">
                  <span className="admission-date">Class :</span>
                  <span className="personal_details">
                    {studentPersonalInfoDetails?.std_name}
                  </span>
                </div>
                <div className="container">
                  <span className="admission-date">Section :</span>
                  <span className="personal_details">
                    {studentPersonalInfoDetails?.section_name}
                  </span>
                </div>
                <div className="container">
                  <span className="admission-date">Rollno. :</span>
                  <span className="personal_details">
                    {" "}
                    {studentPersonalInfoDetails?.roll_no}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-8 mb-4 profile-section">
            <div className="d-flex align-items-center dashboard-buttons-container">
              <button
                className={` button-tab ${
                  isPersonalInfoVisible
                    ? "active-dashboard-button"
                    : "dashboard-button"
                } button-margin`}
                onClick={() => selectTab("StudentPersonalInfo")}

              >
                Personal Info
              </button>

              <button
                className={` button-tab ${
                  isFeesRecordVisible
                    ? "active-dashboard-button"
                    : "dashboard-button"
                } button-margin`}
                onClick={() => selectTab("StudentFeesRecord")}
              >
                Fees
              </button>

              <button
                className={` button-tab ${
                  isAttendanceRecordVisible
                    ? "active-dashboard-button"
                    : "dashboard-button"
                } button-margin`}
                onClick={() => selectTab("StudentAttendanceRecord")}
              >
                Attendance
              </button>

              {/* <button
                className={`btn ${
                  isExamRecordVisible
                    ? "active-dashboard-button"
                    : "dashboard-button"
                }`}
                onClick={() => selectTab("StudentExamRecord")}
              >
                Exam
              </button> */}
            </div>
            {isPersonalInfoVisible && (
              <StudentPersonalInfo
                studentPersonalInfoDetails={studentPersonalInfoDetails}
              />
            )}
            {isFeesRecordVisible && (
              <StudentFeesRecord feeRecordDetails={state?.rowData} />
            )}
            {/* {isAttendanceRecordVisible && <StudentAttendanceRecord />} */}
            {/* {isPersonalInfoVisible && <StudentPersonalInfo  studentPersonalInfoDetails= {studentPersonalInfoDetails}/>} */}
            {/* {isFeesRecordVisible && <StudentFeesRecord />} */}
            {isAttendanceRecordVisible && (
              <StudentAttendanceRecord attendanceDetail={state?.rowData} />
            )}
            {isExamRecordVisible && <StudentExamRecord />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileData;
