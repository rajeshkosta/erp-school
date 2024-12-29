import React, { useEffect, useState } from "react";
import CommanGrid from "../../../../shared/components/GridTable/CommanGrid";
import { Link } from "react-router-dom";
import { IconPencil } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import * as addSchoolService from "../../School.service";

const SchoolListComponent = () => {
  const [schoolsGrid, setSchoolsGrid] = useState([]);

  const navigate = useNavigate();

  const gridData = [...schoolsGrid];

  const gridColumns = [
    {
      field: "school_name",
      header: "School Name",
      width: "25%",
      sortable: true,
    },
    {
      field: "principal_name",
      header: "Principal Name",
      width: "25%",
      sortable: true,
    },
    {
      field: "email_id",
      header: "Email id",
      width: "18%",
      sortable: true,
    },

    { field: "address", header: "Address", width: "30%", sortable: true },
  ];

  const getAllSchools = async () => {
    const payload = {
      pageSize: 20,
      currentPage: 0,
    };

    const getAllSchoolsResponse = await addSchoolService.getAllSchools(payload);
    if (!getAllSchoolsResponse.error) {
      setSchoolsGrid(getAllSchoolsResponse.data.data);
    } else {
      console.error("Error in fetching data");
    }
  };

  useEffect(() => {
    getAllSchools();
  }, []);

  // Handle the action
  const handleAction = (rowData) => {
    // Your action logic here
    navigate("/school/edit", {
      state: {
        rowData: rowData,
      },
    });
  };

  // Define the action button
  const actionButton = (rowData) => {
    return (
      <div className="d-flex justify-content-between align-items-center w-75">
        {/* <IconEye onClick={() => handleAction(rowData)} color="grey" size={20} /> */}
        <IconPencil
          onClick={() => handleAction(rowData)}
          color="grey"
          size={20}
          style={{ cursor: "pointer" }}
        />
        {/* <IconCircle
          onClick={() => handleAction(rowData)}
          color="grey"
          size={20}
        /> */}
      </div>
    );
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="fw-bold" style={{ fontSize: "20px" }}>
          School Management
        </span>
        <button
          className="btn add-button"
          onClick={() => navigate("/school/add")}
          style={{ color: "#fff" }}
        >
          Add School
          {/* <Link
            to="/school/add"
            style={{ textDecoration: "none", color: "#fff" }}
          >
            Add School
          </Link> */}
        </button>
      </div>
      <CommanGrid
        columns={gridColumns}
        data={gridData}
        paginator
        actionButton={actionButton}
        rows={10}
        rowsPerPageOptions={[10, 20, 30]}
        paginatorTemplate=" PrevPageLink PageLinks NextPageLink  CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} "
      />
    </div>
  );
};

export default SchoolListComponent;
