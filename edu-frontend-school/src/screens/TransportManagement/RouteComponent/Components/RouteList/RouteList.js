import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import CommanGrid from "../../../../../shared/components/GridTable/CommanGrid";
import { IconChevronLeft, IconPencil } from "@tabler/icons-react";
import * as addRouteService from "../../Route.service";
const RouteList = () => {
  const [allRouteGrid, setAllRouteGrid] = useState([]);
  const navigate = useNavigate();

  const gridColumns = [
    { field: "route_no", header: "Route No.", width: "20%", sortable: false },
    {
      field: "starting_point",
      header: "Starting Point",
      width: "20%",
      sortable: false,
    },
    {
      field: "total_stops",
      header: "No. of stops",
      width: "20%",
      sortable: false,
    },
    {
      field: "ending_point",
      header: "Ending Point",
      width: "20%",
      sortable: false,
    },
  ];

  const gridData = [...allRouteGrid];

  // Handle the action
  const handleAction = (rowData) => {
    // Your action logic here
    navigate("/route/edit", {
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

  const getAllRouteList = async () => {
    const payload = {
      pageSize: 20,
      currentPage: 0,
    };

    const getRouteListResponse = await addRouteService.getAllRoute(payload);
    if (!getRouteListResponse.error) {
      setAllRouteGrid(getRouteListResponse.data.data);
    }
  };

  useEffect(() => {
    getAllRouteList();
  }, []);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mt-3 mb-3 feeMaster">
        <span className="fw-bold" style={{ fontSize: "20px" }}>
          Route Management
        </span>

        <button
          className="btn add-button"
          onClick={() => navigate("/route/add")}
          style={{ color: "#fff" }}
        >
          {" "}
          Add Route
          {/* <Link
            to="/route/add"
            style={{ textDecoration: "none", color: "#fff" }}
          >
            Add Route
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
        paginatorTemplate="PrevPageLink PageLinks NextPageLink  CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} "
      />
    </>
  );
};

export default RouteList;
