import React from "react";
import { Chart } from 'primereact/chart';
import './FacultyDashBoard.css';
import AttendanceChart from "../FacultyCharts/AttendanceChart/AttendanceChart";
import StudentRatioChart from "../FacultyCharts/StudentRatioChart/StudentRatioChart";

const FacultyDashBoard = () => {
  return (
    <div className="container-fluid facultyDashboard">
      <div className="row">
        <div className="col-md-12">
          <h1>Hello, Amit Bohra</h1>
        </div>

      </div>

      <div className="row">
        <div className="col-md-9">
          <div className="row">
            <div className="col-md-4">
              <div className="card cardFlex">
                <div>
                  <h2>2nd (A)</h2>
                  <p>Hindi</p>
                </div>
                <div>
                  <img src="./Assets/classIcon.png" />
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card cardFlex">
                <div>
                  <h2>2nd (A)</h2>
                  <p>Hindi</p>
                </div>
                <div>
                  <img src="./Assets/classIcon.png" />
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card cardFlex">
                <div>
                  <h2>2nd (A)</h2>
                  <p>Hindi</p>
                </div>
                <div>
                  <img src="./Assets/classIcon.png" />
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card cardFlex">
                <div>
                  <h2>2nd (A)</h2>
                  <p>Hindi</p>
                </div>
                <div>
                  <img src="./Assets/classIcon.png" />
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card cardFlex">
                <div>
                  <h2>2nd (A)</h2>
                  <p>Hindi</p>
                </div>
                <div>
                  <img src="./Assets/classIcon.png" />
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card cardFlex">
                <div>
                  <h2>2nd (A)</h2>
                  <p>Hindi</p>
                </div>
                <div>
                  <img src="./Assets/classIcon.png" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="classTeacherCard">
            <h3>Class teacher</h3>
            <img src="./Assets/classIcon.png" />
            <h4>3rd (C)</h4>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card cardHeight">
            <div className="row headingFlex">
              <h2 className="col-md-8">Attendance</h2>
              <div className="col-md-2">
                <div className="classLable">3rd(C)</div>
              </div>
              <div className="col-md-2">
                <div className="classLable">Today</div>
              </div>
            </div>
            <AttendanceChart />
          </div>
        </div>

        <div className="col-md-6">
          <div className="card cardHeight">
            <div className="row headingFlex">
              <h2 className="col-md-10">Student ratio</h2>
              <div className="col-md-2">
                <div className="classLable">3rd(C)</div>
              </div>

            </div>
            <StudentRatioChart />

          </div>
        </div>
      </div>

    </div>
  )
};

export default FacultyDashBoard;
