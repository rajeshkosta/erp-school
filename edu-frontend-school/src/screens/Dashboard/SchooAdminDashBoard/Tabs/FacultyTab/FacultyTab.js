import React from "react";
import FacultyAttendenceTabChart from "../../Charts/FacultyAttendenceTabChart/FacultyAttendenceTabChart";
import FacultyStudentRatioTabChart from "../../Charts/FacultyStudentRatioTabChart/FacultyStudentRatioTabChart";
const FacultyTab = () => {
  return (
    <div className="mt-4 facultyDashboard">
      <div className="row">
        {/* <div className="col-md-12">
              <h1>Hello, Sourabh singh</h1>
            </div> */}
      </div>

      <div className="row">
        <div className="col-md-12 col-lg-9">
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

        <div className="col-md-12 col-lg-3">
          <div className="classTeacherCard">
            <h3>Class Teacher</h3>
            <img src="./Assets/classIcon.png" />
            <h4>3rd (C)</h4>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card cardHeight">
            <div className="row headingFlex">
              <h2 className="col-md-7">Attendance</h2>
              <div className="col-md-3">
                <div className="classLable">3rd(C)</div>
              </div>
              <div className="col-md-2">
                <div className="classLable">Today</div>
              </div>
            </div>
            <FacultyAttendenceTabChart />
          </div>
        </div>

        <div className="col-md-6">
          <div className="card cardHeight">
            <div className="row headingFlex">
              <h2 className="col-md-9">Student Ratio</h2>
              <div className="col-md-3">
                <div className="classLable">3rd(C)</div>
              </div>
            </div>
            <FacultyStudentRatioTabChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyTab;
