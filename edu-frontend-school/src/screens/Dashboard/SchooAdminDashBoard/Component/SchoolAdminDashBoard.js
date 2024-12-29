import React, { useState } from "react";
import "./SchoolAdminDashBoard.css";
import StudentTab from "../Tabs/StudentTab/StudentTab";
import EarningsTab from "../Tabs/EarninsTab/EarningsTab";
import StaffTab from "../Tabs/StaffTab/StaffTab";
import FacultyTab from "../Tabs/FacultyTab/FacultyTab";

const SchoolAdminDashBoard = () => {
  const [studentTab, setStudentTab] = useState(true);
  const [staffTab, setStaffTab] = useState(false);
  const [earningTab, setEarningTab] = useState(false);
  const [facultyTab, setFacultyTab] = useState(false);

  const selectTab = (TabName) => {
    if (TabName === "studentTab") {
      setStudentTab(!studentTab);
      setStaffTab(false);
      setEarningTab(false);
      setFacultyTab(false);
    } else if (TabName === "staffTab") {
      setStudentTab(false);
      setStaffTab(!staffTab);
      setEarningTab(false);
      setFacultyTab(false);
    } else if (TabName === "earningTab") {
      setStudentTab(false);
      setStaffTab(false);
      setEarningTab(!earningTab);
      setFacultyTab(false);
    } else {
      setStudentTab(false);
      setStaffTab(false);
      setFacultyTab(!facultyTab);
      setEarningTab(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="d-flex justify-content-between align-items-center dashboardSection dash-board-mobile-tab-view">
          <div className="fw-bold" style={{ fontSize: "20px" }}>
            Dashboard
          </div>
          <div className="d-flex align-items-center dashboard-buttons-container">
            <button
              className={
                studentTab
                  ? "btn active-dashboard-button"
                  : "btn dashboard-button"
              }
              style={{ marginRight: "20px" }}
              onClick={() => selectTab("studentTab")}
            >
              Student Overview
            </button>

            <button
              className={
                facultyTab
                  ? "btn active-dashboard-button"
                  : "btn dashboard-button"
              }
              onClick={() => selectTab("facultyTab")}
              style={{ marginRight: "20px" }}
            >
              Class Overview
            </button>
            <button
              className={
                staffTab
                  ? "btn active-dashboard-button"
                  : "btn dashboard-button"
              }
              style={{ marginRight: "20px" }}
              onClick={() => selectTab("staffTab")}
            >
              Staff Overview
            </button>

            <button
              className={
                earningTab
                  ? "btn active-dashboard-button"
                  : "btn dashboard-button"
              }
              onClick={() => selectTab("earningTab")}
            >
              Earnings
            </button>
          </div>
        </div>
      </div>
      {studentTab ? (
        <StudentTab />
      ) : staffTab ? (
        <StaffTab />
      ) : earningTab ? (
        <EarningsTab />
      ) : (
        <FacultyTab />
      )}
    </div>
  );
};

export default SchoolAdminDashBoard;
