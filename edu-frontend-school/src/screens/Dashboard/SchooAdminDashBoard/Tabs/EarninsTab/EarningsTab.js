import React, { useState } from "react";
import EarningChart from "../../Charts/EarningChart/EarningChart";
import { Dropdown } from "primereact/dropdown";
import "./EarningsTab.css";

const EarningsTab = () => {
  const [classCount, setClassCount] = useState("");
  const [monthCount, setMonthCount] = useState("");

  const classList = [
    { class_id: 1, class_name: "All" },
    { class_id: 2, class_name: "Nursery" },
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

  const onSelectClass = (e) => {
    setClassCount(e.target.value);
  };

  const onSelectMonth = (e) => {
    setMonthCount(e.target.value);
  };

  return (
    <>
      <div className="row mt-4 total-students">
        <div className="col-md-4 col-lg-4 d-flex align-items-center ">
          <img
            src="/dashboardImages/money.png"
            alt="total-students"
            style={{ marginRight: "20px" }}
          />
          <div className="d-flex flex-column align-items-start fw-bold">
            <span className="counting" style={{ fontSize: "1.3rem" }}>
              500000
            </span>
            <span className="counting-label">Till Now</span>
          </div>
        </div>
        <div className="col-md-4 col-lg-4 d-flex align-items-center ">
          <img
            src="/dashboardImages/money.png"
            alt="total-students"
            style={{ marginRight: "20px" }}
          />
          <div className="d-flex flex-column align-items-start fw-bold">
            <span className="counting" style={{ fontSize: "1.3rem" }}>
              420000
            </span>
            <span className="counting-label">This Month</span>
          </div>
        </div>
        <div className="col-md-4 col-lg-4 d-flex align-items-center">
          <img
            src="/dashboardImages/money.png"
            alt="total-students"
            style={{ marginRight: "20px" }}
          />
          <div className="d-flex flex-column align-items-start fw-bold">
            <span className="counting" style={{ fontSize: "1.3rem" }}>
              2000000
            </span>
            <span className="counting-label">Last Year</span>
          </div>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-lg-12 p-0">
          <div
            className="dash-board-right-container"
            style={{ marginRight: "20px" }}
          >
            <div className="d-flex align-items-center justify-content-between mb-0 mt-2 mx-2 mobile-dash-board-earning-container">
              <span className="fw-bold" style={{ marginBottom: "10px" }}>
                Earnings
              </span>

              {/* <div className="col-lg-1">Present</div>
              <div className="col-lg-1">Absent</div>
              <div className="col-lg-1">Late</div>
              <div className="col-lg-1">Halfday</div> */}

              <div className="d-felx align-items-center justify-content-between">
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

                <Dropdown
                  placeholder="Month"
                  value={monthCount}
                  options={monthList}
                  optionLabel="month_name"
                  optionValue="month_id"
                  onChange={(e) => onSelectMonth(e)}

                  // filter
                  // filterPlaceholder="Search Subject"
                  // filterMatchMode="contains"
                />
              </div>
            </div>
            <EarningChart />
          </div>
        </div>
      </div>
    </>
  );
};

export default EarningsTab;
