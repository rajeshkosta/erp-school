import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CommanGrid from "../../../../shared/components/GridTable/CommanGrid";
import "./RoleListComponent.css";
import { useNavigate } from "react-router-dom";
import { IconEye, IconPencil, IconCircle } from "@tabler/icons-react";
import * as addRoleService from "../../Role.service";
import { Tooltip } from "@mantine/core";

const RoleListComponent = () => {
  const [rolesGrid, setRolesGrid] = useState([]);
  const navigate = useNavigate();

  const gridData = [...rolesGrid];

  const gridColumns = [
    { field: "role_name", header: "Role Name", width: "30%", sortable: true },
    { field: "level", header: "Level", width: "30%", sortable: true },
  ];

  const getAllRoles = async () => {
    const getAllRolesResponse = await addRoleService.getAllRoles();
    if (!getAllRolesResponse.error) {
      setRolesGrid(getAllRolesResponse.data);
    } else {
      console.error("Error in fetching data");
    }
  };

  useEffect(() => {
    getAllRoles();
  }, []);

  // Handle the action
  const handleAction = (rowData) => {
    // Your action logic here
    navigate("/rolemanagement/edit", {
      state: {
        rowData: rowData,
      },
    });
  };

  const status = (rolesGrid) => {
    return (
      <>
        {rolesGrid.is_active === 1 ? (
          <span>Active</span>
        ) : (
          <span>Inactive</span>
        )}
      </>
    );
  };

  // Define the action button
  const actionButton = (rowData) => {
    return (
      <div className="d-flex justify-content-between align-items-center w-75">
        {/* <IconEye onClick={() => handleAction(rowData)} color="grey" size={20} /> */}
        <Tooltip
            label="Edit"
            color="#DB3525"
            arrowSize={6}
            withArrow
            position="top"
          >
        <IconPencil
          onClick={() => handleAction(rowData)}
          color="grey"
          size={20}
          style={{ cursor: "pointer" }}
        />
        </Tooltip>
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
      <div className="d-flex justify-content-between align-items-center mb-3 roleManagementSection">
        <span className="fw-bold" style={{ fontSize: "20px" }}>
          Role Management
        </span>
        <button
          className="btn add-button"
          onClick={() => navigate("/rolemanagement/add")}
          style={{ color: "#fff" }}
        >
          Add Role
          {/* <Link
            to="/rolemanagement/add"
            style={{ textDecoration: "none", color: "#fff" }}
          >
            Add Roles
          </Link> */}
        </button>
      </div>
      <CommanGrid
        columns={gridColumns}
        data={gridData}
        paginator
        status={status}
        actionButton={actionButton}
        rows={10}
        rowsPerPageOptions={[10, 20, 30]}
        paginatorTemplate=" PrevPageLink PageLinks NextPageLink  CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} "
      />
    </div>
  );
};

export default RoleListComponent;
