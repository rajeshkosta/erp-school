import { IconChevronLeft, IconPencil } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import CommanGrid from "../../../../../shared/components/GridTable/CommanGrid";
import { Link, useNavigate } from "react-router-dom";
import * as addFeeDiscountService from "../../FeeDiscount.service";
import './FeeDiscountList.css'

const FeeDiscountList = () => {
  const [feesDiscountGrid, setFeeDiscountGrid] = useState([]);

  const navigate = useNavigate();

  // const goBackToFeeDiscountrPage = () => {
  //   navigate("/feeDiscount");
  // };

  const gridColumns = [
    {
      field: "fees_discount_name",
      header: "Discount type",
      width: "35%",
      sortable: false,
    },
    { field: "discount", header: "Discount", width: "35%", sortable: false },
  ];

  const gridData = [...feesDiscountGrid];

  // Handle the action
  const handleAction = (rowData) => {
    // Your action logic here
    navigate("/feeDiscount/edit", {
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

  const getAllFeesDiscountList = async () => {
    const getResponse = await addFeeDiscountService.getAllFeeDiscount();

    if (!getResponse.error) {
      setFeeDiscountGrid(getResponse.data.data);
    }
  };

  useEffect(() => {
    getAllFeesDiscountList();
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 feeDiscountSection">
        <span className="fw-bold" style={{ fontSize: "20px" }}>
          Fees discount
        </span>
        <button className="btn add-button">
          <Link
            to="/feeDiscount/add"
            style={{ textDecoration: "none", color: "#fff" }}
          >
            Add Discount
          </Link>
        </button>
      </div>
      <CommanGrid
        columns={gridColumns}
        data={gridData}
        paginator
        actionButton={actionButton}
        rows={10}
        rowsPerPageOptions={[10, 20, 30]}

        // paginatorTemplate="PrevPageLink PageLinks NextPageLink  CurrentPageReport RowsPerPageDropdown"
        // currentPageReportTemplate="Showing {first} to {last} of {totalRecords} "
      />
    </div>
  );
};

export default FeeDiscountList;
