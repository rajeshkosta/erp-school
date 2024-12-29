import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./VehicleList.css";
import { useNavigate } from "react-router-dom";
import { IconEye, IconPencil, IconCircle } from "@tabler/icons-react";
import * as gettingVehicleManagementService from "../../Vehicle.service";
import CommanGrid from "../../../../../shared/components/GridTable/CommanGrid";

const VehicleList = () => {
  const [grid, setGrid] = useState([]);
  const navigate = useNavigate();

  const getAllVehicles = async () => {
    const payload = {
      pageSize: 10,
      currentPage: 0,
    };

    const response = await gettingVehicleManagementService.getAllVehicles(
      payload
    );
    setGrid(response?.data?.data);
  };

  useEffect(() => {
    getAllVehicles();
  }, []);

  const gridData = [...grid];

  const gridColumns = [
    {
      field: "vehicle_code",
      header: "Vehicle Code",
      width: "17.5%",
      sortable: true,
    },
    {
      field: "vehicle_plate_number",
      header: "Vehicle Reg No.",
      width: "20%",
      sortable: true,
    },
    {
      field: "display_name",
      header: "Driver Name",
      width: "17.5%",
      sortable: true,
    },
    {
      field: "mobile_number",
      header: "Mobile No.",
      width: "15%",
      sortable: true,
    },
  ];

  const route = (rowData) => {
    const route_no = rowData?.route_no;
    const starting_point = rowData?.starting_point;
    const ending_point = rowData?.ending_point;

    const route_details = route_no
      ? `${route_no} (${starting_point}-${ending_point})`
      : "";
    return <span>{route_details}</span>;
  };

  const handleAction = (rowData) => {
    navigate("/vehicle/edit", {
      state: {
        rowData: rowData,
      },
    });
  };

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
      <div className="d-flex justify-content-between align-items-center mb-3 userManagementSection">
        <span className="fw-bold" style={{ fontSize: "20px" }}>
          Vehicle Management
        </span>
        <button
          className="btn add-button"
          onClick={() => navigate("/vehicle/add")}
          style={{ color: "#fff" }}
        >
          Add Vehicle
          {/* <Link
            to="/vehicle/add"
            style={{ textDecoration: "none", color: "#fff" }}
          >
            Add Vehicle
          </Link> */}
        </button>
      </div>
      <CommanGrid
        columns={gridColumns}
        data={gridData}
        paginator
        actionButton={actionButton}
        route={route}
        rows={10}
        rowsPerPageOptions={[10, 20, 30]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} "
      />
    </div>
  );
};

export default VehicleList;
