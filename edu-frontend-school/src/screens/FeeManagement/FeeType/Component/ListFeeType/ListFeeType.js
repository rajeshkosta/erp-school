import "./ListFeeType.css";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconPencil } from "@tabler/icons-react";
import * as addFeeTypeService from "../../FeeType.service";
const ListFeeType = () => {
  const navigate = useNavigate();
  const [feeTypeGrid, setfeeTypeGrid] = useState([]);
  const getFeeTypeList = async () => {
    const getFeeTypeResponse = await addFeeTypeService.getFeeType();
    if (!getFeeTypeResponse.error) {
      setfeeTypeGrid(getFeeTypeResponse.data.data);
    } else {
    }
  };

  useEffect(() => {
    getFeeTypeList();
  }, []);

  const goTofeeTypeEditPage = (feeType) => {
    navigate("/feeType/edit", {
      state: {
        feeType: feeType,
      },
    });
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-3 feeTypeSection">
        <span className="fw-bold" style={{ fontSize: "20px" }}>
          Fee Type 
        </span>
        <button
          className="btn add-button"
          onClick={() => navigate("/feeType/add")}
          style={{ color: "#fff" }}
        >
          Add Fee Type
          {/* <Link
            to="/feeType/add"
            style={{ textDecoration: "none", color: "#fff" }}
          >
            Add Fee Type
          </Link> */}
        </button>
      </div>
      <div className="row mt-5">
        {feeTypeGrid?.map((feeType, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-3 mb-4">
            <div className="feeType-list-container-section">
              <div className="academic_year_img">
                <img src="/Assets/feetype.svg" />
              </div>
              <h1>{feeType.fees_type}</h1>
              <div className="sub-feeType-list">
                <button
                  onClick={() => goTofeeTypeEditPage(feeType)}
                  className="btn btnEdit"
                >
                  Edit
                </button>

                {/* <IconPencil
                  size={18}
                  style={{ marginRight: "10px", cursor: "pointer" }}
                  onClick={() => goTofeeTypeEditPage(feeType)}
                /> */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListFeeType;
