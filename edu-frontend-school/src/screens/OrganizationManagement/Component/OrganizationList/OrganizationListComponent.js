// RoleListComponent.js

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CommanGrid from "../../../../shared/components/GridTable/CommanGrid";
import "./OrganizationListComponent.css";
import { useNavigate } from "react-router-dom";
import { IconEye, IconPencil, IconCircle } from "@tabler/icons-react";
import * as gettingOrganizationService from "../../Organization.service";
import ToastUtility from "../../../../utility/ToastUtility";

const OrganizationListComponent = () => {
  const [grid, setGrid] = useState([]);
  const navigate = useNavigate();

  const getAllTrusts = async () => {
    const payload = {
      pageSize: 20,
      currentPage: 0,
    };

    const getResponse = await gettingOrganizationService.getAllOrganizations(
      payload
    );
    if (!getResponse.error) {
      setGrid(getResponse.data.data);
    } else {
      ToastUtility.info("Please try again with proper details");
    }
  };

  useEffect(() => {
    getAllTrusts();
  }, []);

  const gridData = [...grid];

  const gridColumns = [
    { field: "trust_name", header: "Name", width: "30%", sortable: true },
    { field: "email", header: "Email", width: "23%", sortable: true },
    {
      field: "contact_no",
      header: "Mobile Number",
      width: "18%",
      sortable: true,
    },
    { field: "address", header: "Address", width: "30%", sortable: true },
  ];

  // Handle the action
  const handleAction = (rowData) => {
    // Your action logic here
    navigate("/organizationmanagement/edit", {
      state: {
        rowData: rowData,
      },
    });
  };

  // Define the action button
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

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="fw-bold" style={{ fontSize: "20px" }}>
          Organization Management
        </span>
        <button
          className="btn add-button"
          onClick={() => navigate("/organizationmanagement/add")}
          style={{ color: "#fff" }}
        >
          {" "}
          Add Organization
          {/* <Link
            to="/organizationmanagement/add"
            style={{ textDecoration: "none", color: "#fff" }}
          >
            Add Organization
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

export default OrganizationListComponent;
