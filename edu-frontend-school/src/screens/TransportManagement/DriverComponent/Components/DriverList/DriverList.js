import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";


const DriverList = () => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="fw-bold" style={{ fontSize: "20px" }}>
          Driver Management
        </span>
        <button className="btn add-button">
          <Link
            to="/driver/add"
            style={{ textDecoration: "none", color: "#fff" }}
          >
            Add Driver
          </Link>
        </button>
      </div>
      {/* <CommanGrid
          columns={gridColumns}
          data={gridData}
          paginator
          actionButton={actionButton}
          rows={10}
          rowsPerPageOptions={[10, 20, 30]}
          paginatorTemplate=" PrevPageLink PageLinks NextPageLink  CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} "
        /> */}
    </div>
  );
};
export default DriverList;
