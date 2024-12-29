import React, { useState } from "react";
import { IconCalendarEvent, IconUserCircle } from "@tabler/icons-react";
import { Dropdown } from "primereact/dropdown";
import FeesStatusChart from "../../Charts/FeesStatusChart/FeesStatusChart";
import StudentsCountChart from "../../Charts/StudentsCountsChart/StudentsCountChart";
import RatioChart from "../../Charts/RatioChart/RatioChart";
import AttendanceChart from "../../Charts/AttendanceChart/AttendanceChart";
import "./StudentTab.css";
import { CiStreamOn } from "react-icons/ci";
const StudentTab = () => {
  const statusList = [
    { status_id: 1, status: "Pending" },
    { status_id: 2, status: "Completed" },
    { status_id: 3, status: "Partial paid" },
  ];

  const studentsList = [
    { student_id: 1, student_name: "All" },
    { student_id: 2, student_name: "By Class" },
    { student_id: 3, student_name: "By Section" },
  ];

  const classList = [
    { class_id: 1, class_name: "All" },
    { class_id: 2, class_name: "Nursery" },
  ];

  const sectionList = [
    { section_id: 1, section_name: "All" },
    { section_id: 2, section_name: "A" },
    { section_id: 3, section_name: "B" },
    { section_id: 4, section_name: "C" },
  ];

  const monthList = [
    { month_id: 1, month_name: "January" },
    { month_id: 2, month_name: "February" },
    { month_id: 3, month_name: "March" },
    { month_id: 4, month_name: "April" },
    { month_id: 5, month_name: "May" },
    { month_id: 6, month_name: "June" },
    { month_id: 7, month_name: "July" },
    { month_id: 8, month_name: "August" },
    { month_id: 9, month_name: "September" },
    { month_id: 10, month_name: "October" },
    { month_id: 11, month_name: "November" },
    { month_id: 12, month_name: "December" },
  ];

  const [status, setStatus] = useState("");
  const [studentCount, setStudentCount] = useState("");
  const [classCount, setClassCount] = useState("");
  const [sectionCount, setSectionCount] = useState("");
  const [monthCount, setMonthCount] = useState("");

  const onSelectStatus = (e) => {
    setStatus(e.target.value);
  };

  const onSelectStudent = (e) => {
    setStudentCount(e.target.value);
  };

  const onSelectClass = (e) => {
    setClassCount(e.target.value);
  };

  const onSelectSection = (e) => {
    setSectionCount(e.target.value);
  };

  const onSelectMonth = (e) => {
    setMonthCount(e.target.value);
  };

  return (
    <>
      <div className="row mt-4 total-students">
        <div className="col-md-6 col-lg-4 d-flex align-items-center mt-1">
          <img
            src="/dashboardImages/totalstudents.png"
            alt="total-students"
            style={{ marginRight: "20px" }}
          />
          <div className="d-flex flex-column align-items-start fw-bold">
            <span className="counting" style={{ fontSize: "1.3rem" }}>
              500
            </span>
            <span className="counting-label">Total Students</span>
          </div>
        </div>
        <div className="col-md-6 col-lg-4 d-flex align-items-center mt-1">
          <img
            src="/dashboardImages/newadmission.png"
            alt="total-students"
            style={{ marginRight: "20px" }}
          />
          <div className="d-flex flex-column align-items-start fw-bold">
            <span className="counting" style={{ fontSize: "1.3rem" }}>
              200
            </span>
            <span className="counting-label">New Admissions</span>
          </div>
        </div>
        <div className="col-md-6 col-lg-4 d-flex align-items-center mt-1">
          <img
            src="/dashboardImages/withdrawstudents.png"
            alt="total-students"
            style={{ marginRight: "20px" }}
          />
          <div
            className="d-flex flex-column align-items-start fw-bold"
            style={{ color: "#DB3525" }}
          >
            <span className="counting" style={{ fontSize: "1.3rem" }}>
              30
            </span>
            <span className="counting-label">Withdrawals</span>
          </div>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-lg-4 p-0 mt-3">
          <div className="dash-board-left-container bg-white rounded shadow ">
            <div
              className="d-flex align-items-center justify-content-between mb-3 p-2"
              style={{ fontSize: ".9rem" }}
            >
              <div>
                <span className="fw-bold">Classes</span>
                {/* <CiStreamOn
                  size={25}
                  color="red"
                  style={{
                    marginLeft: "10px",
                    cursor: "pointer",
                  }}
                /> */}
              </div>
              <span
                className="fw-bold"
                style={{ color: "#DB3525", cursor: "pointer" }}
              >
                View All
              </span>
            </div>
            <div className="liveclass-card">
              <div className=" bg-white rounded shadow p-3 mb-5">
                <div className="d-flex align-items-start justify-content-between">
                  <img
                    src="/dashboardImages/liveclass.png"
                    alt="live-class"
                    style={{ marginRight: "15px" }}
                  />
                  {/* <CiStreamOn size={45} color="red" style={{marginRight : '45px'}} /> */}
                  <div className="w-100">
                    <p
                      className="mb-2 fw-bold"
                      style={{
                        fontSize: ".8rem",
                      }}
                    >
                      Guidance model for Algebra
                    </p>
                    <div
                      className="d-flex align-items-center fw-bold mb-2"
                      style={{
                        fontSize: ".7rem",
                        color: "grey",
                      }}
                    >
                      <IconCalendarEvent
                        size={15}
                        style={{ marginRight: "10px" }}
                      />
                      <span>23, Jan, 2024 at 5:00 PM</span>
                    </div>
                    <div
                      className="d-flex align-items-center justify-content-between fw-bold"
                      style={{ fontSize: ".7rem" }}
                    >
                      <div
                        className="d-flex align-items-center fw-bold"
                        style={{ fontSize: ".7rem", color: "grey" }}
                      >
                        <IconUserCircle
                          size={15}
                          style={{ marginRight: "10px" }}
                        />
                        <span style={{ color: "grey" }}>Gaurav Kapoor</span>
                      </div>
                      <span style={{ color: "#331B73" }}>2nd (A)</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" bg-white rounded shadow p-3 mb-5">
                <div className="d-flex align-items-start justify-content-between">
                  <img
                    src="/dashboardImages/liveclass.png"
                    alt="live-class"
                    style={{ marginRight: "15px" }}
                  />
                  {/* <CiStreamOn size={45} color="red" style={{marginRight : '45px'}} /> */}
                  <div className="w-100">
                    <p
                      className="mb-2 fw-bold"
                      style={{
                        fontSize: ".8rem",
                      }}
                    >
                      Ancient History
                    </p>
                    <div
                      className="d-flex align-items-center fw-bold mb-2"
                      style={{
                        fontSize: ".7rem",
                        color: "grey",
                      }}
                    >
                      <IconCalendarEvent
                        size={15}
                        style={{ marginRight: "10px" }}
                      />
                      <span>23, Jan, 2024 at 5:00 PM</span>
                    </div>
                    <div
                      className="d-flex align-items-center justify-content-between fw-bold"
                      style={{ fontSize: ".7rem" }}
                    >
                      <div
                        className="d-flex align-items-center fw-bold"
                        style={{ fontSize: ".7rem", color: "grey" }}
                      >
                        <IconUserCircle
                          size={15}
                          style={{ marginRight: "10px" }}
                        />
                        <span style={{ color: "grey" }}>Gaurav Kapoor</span>
                      </div>
                      <span style={{ color: "#331B73" }}>2nd (A)</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className=" bg-white rounded shadow p-3 mb-5">
                <div className="d-flex align-items-start justify-content-between">
                  <img
                    src="/dashboardImages/liveclass.png"
                    alt="live-class"
                    style={{ marginRight: "15px" }}
                  />
                  <div className="w-100">
                    <p
                      className="mb-2 fw-bold"
                      style={{
                        fontSize: ".8rem",
                      }}
                    >
                      Physics
                    </p>
                    <div
                      className="d-flex align-items-center fw-bold mb-2"
                      style={{
                        fontSize: ".7rem",
                        color: "grey",
                      }}
                    >
                      <IconCalendarEvent
                        size={15}
                        style={{ marginRight: "10px" }}
                      />
                      <span>29, Jan, 2024 at 3:00 PM</span>
                    </div>
                    <div
                      className="d-flex align-items-center justify-content-between fw-bold"
                      style={{ fontSize: ".7rem" }}
                    >
                      <div
                        className="d-flex align-items-center fw-bold"
                        style={{ fontSize: ".7rem", color: "grey" }}
                      >
                        <IconUserCircle
                          size={15}
                          style={{ marginRight: "10px" }}
                        />
                        <span style={{ color: "grey" }}>Sachin Kumar</span>
                      </div>
                      <span style={{ color: "#331B73" }}>10th (C)</span>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
        <div className="col-lg-8 p-0 mt-3">
          <div className="dash-board-right-container bg-white rounded shadow ">
            <div
              className="d-flex align-items-center justify-content-between mb-3 p-2"
              style={{ fontSize: "1rem" }}
            >
              <span className="fw-bold">Students Fees</span>
              <div className="form-group">
                <Dropdown
                  placeholder="Status"
                  value={status}
                  options={statusList}
                  optionLabel="status"
                  optionValue="status_id"
                  onChange={(e) => onSelectStatus(e)}

                  // filter
                  // filterPlaceholder="Search Subject"
                  // filterMatchMode="contains"
                />
              </div>
            </div>
            <div className="">
              <FeesStatusChart />
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-lg-8 p-0 mt-3">
          <div
            className="dash-board-right-container bg-white rounded shadow "
            style={{ marginRight: "20px" }}
          >
            <div
              className="d-flex align-items-center justify-content-between mb-0 p-0"
              style={{ fontSize: "1rem" }}
            >
              <span className="fw-bold">Students Count</span>
              <div className="form-group">
                <Dropdown
                  placeholder="Students"
                  value={studentCount}
                  options={studentsList}
                  optionLabel="student_name"
                  optionValue="student_id"
                  onChange={(e) => onSelectStudent(e)}

                  // filter
                  // filterPlaceholder="Search Subject"
                  // filterMatchMode="contains"
                />
              </div>
            </div>

            <StudentsCountChart />
          </div>
        </div>
        <div className="col-lg-4 p-0 mt-3">
          <div className="dash-board-right-container bg-white rounded shadow ">
            <div
              className="d-flex align-items-center justify-content-between mb-0 p-2"
              style={{ fontSize: "1rem" }}
            >
              <span className="fw-bold">Ratio</span>
              <div className="form-group">
                <Dropdown
                  placeholder="Class"
                  value={classCount}
                  options={classList}
                  optionLabel="class_name"
                  optionValue="class_id"
                  onChange={(e) => onSelectClass(e)}

                  // filter
                  // filterPlaceholder="Search Subject"
                  // filterMatchMode="contains"
                />
              </div>
            </div>
            <RatioChart />
          </div>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-lg-12 p-0">
          <div className="dash-board-right-container mobile-dash-board-right-container-attendance bg-white rounded shadow ">
            <div className="d-flex align-items-center justify-content-between mb-0 mt-0 mx-2 mb-3 mobile-dash-board-attendance">
              <span className="fw-bold">Attendance</span>

              {/* <div className="col-lg-1">Present</div>
              <div className="col-lg-1">Absent</div>
              <div className="col-lg-1">Late</div>
              <div className="col-lg-1">Halfday</div> */}

              <div className="d-felx align-items-center justify-content-between mobile-dash-board-attendance-dropdown">
                <Dropdown
                  placeholder="Class"
                  value={classCount}
                  options={classList}
                  optionLabel="class_name"
                  optionValue="class_id"
                  onChange={(e) => onSelectClass(e)}
                  style={{ marginRight: "15px" }}
                  className="mobile-dropdown"

                  // filter
                  // filterPlaceholder="Search Subject"
                  // filterMatchMode="contains"
                />

                <Dropdown
                  placeholder="Section"
                  value={sectionCount}
                  options={sectionList}
                  optionLabel="section_name"
                  optionValue="section_id"
                  onChange={(e) => onSelectSection(e)}
                  style={{ marginRight: "15px" }}
                  className="mobile-dropdown"

                  // filter
                  // filterPlaceholder="Search Subject"
                  // filterMatchMode="contains"
                />

                <Dropdown
                  placeholder="Month"
                  value={monthCount}
                  options={monthList}
                  optionLabel="month_name"
                  optionValue="month_id"
                  onChange={(e) => onSelectMonth(e)}
                  className="mobile-dropdown"

                  // filter
                  // filterPlaceholder="Search Subject"
                  // filterMatchMode="contains"
                />
              </div>
            </div>

            <AttendanceChart />
          </div>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-lg-12 p-0">
          <div className="dash-board-google-map-container bg-white rounded shadow ">
            <div className="d-flex align-items-center justify-content-between m-3">
              <span className="fw-bold">Student by Location</span>
              <Dropdown
                placeholder="Class"
                value={classCount}
                options={classList}
                optionLabel="class_name"
                optionValue="class_id"
                onChange={(e) => onSelectClass(e)}
                style={{ marginRight: "15px" }}

                // filter
                // filterPlaceholder="Search Subject"
                // filterMatchMode="contains"
              />
            </div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3679.755807076232!2d88.34870107480658!3d22.73731597937482!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f89b1ea939a2f5%3A0xf04353dc5898ef13!2sALCOVE%20NEW%20KOLKATA%20-%20Home%20by%20the%20Ganges!5e0!3m2!1sen!2sin!4v1685084521087!5m2!1sen!2sin"
              width="100%"
              height="250px"
              style={{
                borderRadius: "20px",
                marginBottom: "15px",
              }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="google"
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentTab;
