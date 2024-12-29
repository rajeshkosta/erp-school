import React, { useEffect, useState } from "react";
import CommanGrid from "../../../../../shared/components/GridTable/CommanGrid";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IconChevronLeft, IconPencil } from "@tabler/icons-react";
import * as addExamService from "../../Exam.service";

const ExamGrid = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [allClassGrid, setAllClassGrid] = useState([]);

  const gridColumns = [
    {
      field: "exam_type",
      header: "Exam Type",
      width: "20%",
      sortable: false,
    },
    {
      field: "subject_name",
      header: "Subject Name",
      width: "20%",
      sortable: false,
    },
    {
      field: "exam_date",
      header: "Exam Date",
      width: "20%",
      sortable: false,
    },
    {
      field: "duration",
      header: "Duration (Minutes)",
      width: "20%",
      sortable: false,
    },
  ];

  const gridData = [...allClassGrid];

  const handleAction = (rowData) => {
    navigate("/exam/edit", {
      state: {
        rowData: rowData,
      },
    });
  };

  const getClassGrid = async () => {
    if (state?.data) {
      const class_id = state?.data.class_id;
      const academic_year_id = state?.academic_year_id;

      const getClassListResponse =
        await addExamService.getAllClassByClassIdGrid(
          academic_year_id,
          class_id
        );
      if (!getClassListResponse.error) {
        setAllClassGrid(getClassListResponse?.data);
      }
    }
  };

  useEffect(() => {
    getClassGrid();
  }, []);

  const actionButton = (rowData) => {
    return (
      <div className="d-flex justify-content-between align-items-center w-75">
        <IconPencil
          onClick={() => handleAction(rowData)}
          color="grey"
          size={20}
          style={{ cursor: "pointer" }}
        />
      </div>
    );
  };

  const goBackToExamMasterPage = () => {
    navigate("/exam");
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center mb-3">
          <IconChevronLeft
            size={30}
            onClick={goBackToExamMasterPage}
            style={{ cursor: "pointer" }}
            color="black"
          />
          <span
            className="fw-bold"
            style={{ fontSize: "20px", marginLeft: "10px" }}
          >
            Exam Master of {state?.data.std_name}
          </span>
        </div>
        <button
          className="btn add-button col-md-3 mb-3"
          onClick={() => navigate("/exam/add")}
          style={{ color: "#fff", width: "8rem" }}
        >
          Add Exam
        </button>
      </div>
      <CommanGrid
        columns={gridColumns}
        data={gridData}
        paginator
        actionButton={actionButton}
        rows={10}
        rowsPerPageOptions={[10, 20, 30]}
        paginatorTemplate="PrevPageLink PageLinks NextPageLink  CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} "
      />
    </div>
  );
};

export default ExamGrid;
