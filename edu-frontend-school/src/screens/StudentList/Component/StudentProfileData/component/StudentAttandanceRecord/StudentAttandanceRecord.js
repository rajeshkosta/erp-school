import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import * as studentProfileDataService from "../../StudentProfileData.service";
import "./StudentAttandanceRecord.css";
import { Tabs, rem } from "@mantine/core";

import {
  IconPhoto,
  IconMessageCircle,
  IconSettings,
} from "@tabler/icons-react";

const StudentAttandanceRecord = (attendanceDetail) => {
  const [attendanceData, setAttendanceData] = useState(null);

  const { state } = useLocation();

  const getAttendanceRecord = async (studentId, academicYearId) => {
    try {
      const payload = {
        student_admission_id: parseInt(studentId),
        academic_year_id: parseInt(academicYearId),
      };

      const getAttendanceRecordResponse =
        await studentProfileDataService.getAttendanceRecord(payload);
      if (!getAttendanceRecordResponse.error) {
        setAttendanceData(getAttendanceRecordResponse.data);
      }
    } catch (error) {
      console.error("Error fetching attendance record:", error);
    }
  };

  useEffect(() => {
    if (attendanceDetail) {
      const { student_admission_id, academic_year_id } = state.rowData;
      getAttendanceRecord(student_admission_id, academic_year_id);
    }
   
  }, []);

  return (
    <div>
      <div className="row mt-4 attendance-total ">
        <div className="col-md-3 col-lg-2 d-flex align-items-center mobile-view-center ">
          <div className="d-flex flex-column align-items-center fw-bold attendance-list-section">
          <span className="counting present-section" style={{ fontSize: "1.3rem" }}  >
            {attendanceData &&
              attendanceData.secondQueryResult &&
              attendanceData.secondQueryResult.length > 0 &&
              attendanceData.secondQueryResult[0].present}
              </span>
            <span className="label-counting">Total Present</span>
            
          </div>
        </div>

        <div className="col-md-3 col-lg-2 d-flex align-items-center mobile-view-center ">
          <div className="d-flex flex-column align-items-center fw-bold attendance-list-section">
            <span className="counting absent-section" style={{ fontSize: "1.3rem" }}  >
              {attendanceData &&
                attendanceData.secondQueryResult &&
                attendanceData.secondQueryResult.length > 0 &&
                attendanceData.secondQueryResult[0].absent}
            </span>
            <span className="label-counting">Total Absent</span>
          
          </div>
        </div>

        <div className="col-md-3 col-lg-2 d-flex align-items-center mobile-view-center ">
          <div className="d-flex flex-column align-items-center fw-bold attendance-list-section">
            <span className="counting halfday-section" style={{ fontSize: "1.3rem" }}>
            {attendanceData &&
              attendanceData.secondQueryResult &&
              attendanceData.secondQueryResult.length > 0 &&
              attendanceData.secondQueryResult[0].half_day}
              </span>
            <span className="label-counting">Total Halfday</span>

            
          </div>
        </div>
        <div className="col-md-3 col-lg-2 d-flex align-items-center mobile-view-center ">
          <div className="d-flex flex-column align-items-center fw-bold attendance-list-section">
          <span className="counting holiday-section" style={{ fontSize: "1.3rem" }}>
            {attendanceData &&
              attendanceData.secondQueryResult &&
              attendanceData.secondQueryResult.length > 0 &&
              attendanceData.secondQueryResult[0].holiday}
              </span>
            <span className="label-counting">Total Holiday</span>

            
          </div>
        </div>
      </div>

      <div className="row month-tab">
        <div className="col-md-12">
          {attendanceData &&
            attendanceData.firstQueryResult &&
            attendanceData.firstQueryResult.length > 0 && (
              <Tabs defaultValue="jan">
                <Tabs.List>
                  {Object.keys(attendanceData.firstQueryResult[0])
                    .filter((key) => key !== "day_of_month")
                    .map((key, idx) => (
                      <Tabs.Tab key={idx} value={key}>
                        {key.replace(/\b\w/g, (char) => char.toUpperCase())}
                      </Tabs.Tab>
                    ))}
                </Tabs.List>
                {Object.keys(attendanceData.firstQueryResult[0])
                  .filter((key) => key !== "day_of_month")
                  .map((key, idx) => {
                    const monthData = attendanceData.thirdQueryResult.find(
                      (entry) => entry.month_name.toLowerCase() === key
                    );
                    const monthAttendance =
                      attendanceData.firstQueryResult.reduce((acc, obj) => {
                        acc[obj.day_of_month] = obj[key];
                        return acc;
                      }, {});
                    return (
                      <Tabs.Panel key={idx} value={key}>
                        <div className="month-section">
                          <div className="monthly-record">
                            <h1 className="present-section">
                              Present -
                              <span>{monthData ? monthData.present : 0}</span>
                            </h1>
                            <h1 className="absent-section">
                              Absent -
                              <span>{monthData ? monthData.absent : 0}</span>
                            </h1>
                            <h1 className="halfday-section">
                              Halfday -
                              <span>{monthData ? monthData.half_day : 0}</span>
                            </h1>
                            <h1 className="holiday-section">
                              Holiday -
                              <span>{monthData ? monthData.holiday : 0}</span>
                            </h1>
                          </div>

                          <div className="calendar-section">
                            <ul>
                              {Object.entries(monthAttendance).map(
                                ([day, value]) =>
                                  value !== null && (
                                    <li key={value}>
                                      <span
                                        className={
                                          value === "P"
                                            ? "present"
                                            :value === "A"
                                            ? "absent"
                                            : value === "HD"
                                            ? "halfday"
                                            : value === "H"
                                            ? "holiday"
                                            : "inherit"
                                        }
                                      >
                                        {day}
                                      </span>
                                    </li>
                                  )
                              )}
                            </ul>
                          </div>
                        </div>
                      </Tabs.Panel>
                    );
                  })}
              </Tabs>
            )}
        </div>
      </div>

      {/* <div className="row mt-5 attendance-months">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Jan</th>
              <th>Feb</th>
              <th>Mar</th>
              <th>Apr</th>
              <th>May</th>
              <th>June</th>
              <th>July</th>
              <th>Aug</th>
              <th>Sep</th>
              <th>Oct</th>
              <th>Nov</th>
              <th>Dec</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecord.map((record) => (
              <tr key={record.day_of_month}>
                <td>{record.day_of_month}</td>
                <td>{record.jan}</td>
                <td>{record.feb}</td>
                <td>{record.mar}</td>
                <td>{record.april}</td>
                <td>{record.may}</td>
                <td>{record.jun}</td>
                <td>{record.jul}</td>
                <td>{record.aug}</td>
                <td>{record.sep}</td>
                <td>{record.oct}</td>
                <td>{record.nov}</td>
                <td>{record.dec}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
    </div>
  );
};

export default StudentAttandanceRecord;
