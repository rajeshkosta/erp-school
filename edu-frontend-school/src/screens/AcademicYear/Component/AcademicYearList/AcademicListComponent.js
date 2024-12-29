import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CommanGrid from "../../../../shared/components/GridTable/CommanGrid";
import "./AcademicListComponent.css";
import { useNavigate } from "react-router-dom";
import { IconEye, IconPencil, IconCircle } from "@tabler/icons-react";
import ToastUtility from "../../../../utility/ToastUtility";
import * as addAcademicYearService from "../../AcademicYear.service";

const AcademicListComponent = () => {
  const [academiYearGrid, setAcademiYearGrid] = useState([]);
  const navigate = useNavigate();

  const getAcademicYearList = async () => {
    const getAcademicYearListResponse =
      await addAcademicYearService.AcademicYearList();
    if (!getAcademicYearListResponse.error) {
      setAcademiYearGrid(getAcademicYearListResponse.data);
    }
  };

  useEffect(() => {
    getAcademicYearList();
  }, []);

  const handleAction = (rowData) => {
    navigate("/academicyear/edit", {
      state: {
        rowData: rowData,
      },
    });
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 academicYearSection">
        <span className="fw-bold" style={{ fontSize: "20px" }}>
          Academic Year
        </span>
        <button
          className="btn add-button"
          style={{ color: "#fff" }}
          onClick={() => navigate("/academicyear/add")}
        >
          Add Academic Year
          {/* <Link
            to="/academicyear/add"
            style={{ textDecoration: "none", color: "#fff" }}
          >
            
          </Link> */}
        </button>
      </div>
      <div className="row mt-5">
        {academiYearGrid?.map((academic, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="subject-list-container-section">
              <div className="academic-details">
                <div className="academic_year_img">
                  <img src="/Assets/session.svg" />
                </div>
                <h1>
                  <span className="yearInfo">
                    {academic.academic_year_name}
                  </span>
                </h1>
                <div className="dateSection">
                  <p>
                    <b>Start Date:</b> {academic.start_date}
                  </p>
                  <p>
                    <b>End Date:</b> {academic.end_date}
                  </p>
                </div>
              </div>
              <div className="sub-subject-list">
                <button
                  onClick={() => handleAction(academic)}
                  className="btn btnEdit"
                >
                  Edit
                </button>
                {/* <IconPencil
                  size={18}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleAction(academic)}
                /> */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AcademicListComponent;
