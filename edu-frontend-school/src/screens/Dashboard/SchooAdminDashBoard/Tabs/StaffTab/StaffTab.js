import React from "react";
import FacultyChart from "../../Charts/FacultyChart/FacultyChart";
import NonFacultyChart from "../../Charts/NonFacultyChart/NonFacultyChart";

const StaffTab = () => {
  return (
    <>
      <div className="row mt-3 total-students">
        <div className="col-md-4 col-lg-4 d-flex align-items-center ">
          <img
            src="/dashboardImages/totalstaff.png"
            alt="total-students"
            style={{ marginRight: "20px" }}
          />
          <div className="d-flex flex-column align-items-start fw-bold">
            <span className="counting" style={{ fontSize: "1.3rem" }}>
              50
            </span>
            <span className="counting-label">Total Staff</span>
          </div>
        </div>
        <div className="col-md-4 col-lg-4 d-flex align-items-center ">
          <img
            src="/dashboardImages/faculty.png"
            alt="total-students"
            style={{ marginRight: "20px" }}
          />
          <div className="d-flex flex-column align-items-start fw-bold">
            <span className="counting" style={{ fontSize: "1.3rem" }}>
              32
            </span>
            <span className="counting-label">Faculty</span>
          </div>
        </div>
        <div className="col-md-4 col-lg-4 d-flex align-items-center">
          <img
            src="/dashboardImages/nonfaculty.png"
            alt="total-students"
            style={{ marginRight: "20px" }}
          />
          <div className="d-flex flex-column align-items-start fw-bold">
            <span className="counting" style={{ fontSize: "1.3rem" }}>
              20
            </span>
            <span className="counting-label">Non Faculty</span>
          </div>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-lg-6 p-0 mb-3">
          <div
            className="dash-board-right-container"
            style={{ marginRight: "20px" }}
          >
            <span className="fw-bold">Faculty List</span>
            <FacultyChart />
          </div>
        </div>
        <div className="col-lg-6 p-0">
          <div className="dash-board-right-container">
            <span className="fw-bold">Non Faculty List</span>
            <NonFacultyChart />
          </div>
        </div>
      </div>
    </>
  );
};

export default StaffTab;
