import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./FeeMasterList.css";
import * as addFeeMasterService from "../../FeeMaster.service";
import * as addClassService from "../../../../Class/Class.service";
import { useAuth } from "../../../../../context/AuthContext";
import CommanGrid from "../../../../../shared/components/GridTable/CommanGrid";
import { IconPencil } from "@tabler/icons-react";

const FeeMasterList = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [classListByFee, setClassListByFee] = useState([]);
  const [academicList, setAcademicList] = useState([]);
  const [academicId, setAcademicId] = useState("");
  const [allClassGrid, setAllClassGrid] = useState([]);
  const { userDetails, academicYear } = useAuth();
  const classData = [...classListByFee];

  // const [lazyState, setlazyState] = useState({
  //   first: 0,
  //   rows: 2,
  //   page: 0,
  //   sortField: null,
  //   sortOrder: null,
  // });

  const gridColumns = [
    { field: "fees_type", header: "Fees type", width: "30%", sortable: false },
    {
      field: "amount",
      header: "Amount (in Rupees)",
      width: "30%",
      sortable: false,
    },
    //{ field: "due_date", header: "Due date", width: "30%", sortable: false },
  ];

  const gridData = [...allClassGrid];

  // const onSort = (event) => {
  //   setlazyState(event);
  // };

  // const onPaginationChange = (event) => {
  //   setlazyState(event);
  // };

  const activateGridScreen = (data) => {
    navigate("/feeMaster/grid", {
      state: {
        data: data,
        academic_year_id: academicId,
      },
    });
  };

  const getClassListByFeeConfiguration = async (academicId) => {
    const payload = {
      academic_year_id: academicId,
    };

    const getClassListResponse = await addFeeMasterService.getClassListByFee(
      payload
    );

    if (!getClassListResponse.error) {
      setClassListByFee(getClassListResponse?.data?.data);
    }
  };

  const getAcademicList = async () => {
    const getAcademicListResponse = await addClassService.getAcademicList();

    setAcademicList(getAcademicListResponse?.data);
  };

  useEffect(() => {
    getAcademicList();
    setAcademicId(academicYear);
    // getClassListByFeeConfiguration(currentAcademicYear?.academic_year_id);
  }, [academicYear]);

  const getSelectAcademicId = async (e) => {
    setAcademicId(e.target.value);
    // if (e.target.value) {
    //   // await getClassListByFeeConfiguration(e.target?.value);
    // }
  };

  const getClassGrid = async () => {
    if (academicId) {
      const payload = {
        academic_year_id: academicId,
        // pageSize: lazyState.rows,
        // currentPage: lazyState.page,
        // sortField: lazyState.sortField,
        // sortOrder: lazyState.sortOrder,
      };

      const getClassListResponse =
        await addFeeMasterService.getAllClassByClassIdGrid(payload);
      if (!getClassListResponse.error) {
        setAllClassGrid(getClassListResponse?.data?.data);
      }
    }
  };

  useEffect(() => {
    getClassGrid();
  }, [academicId]);

  // Handle the action
  const handleAction = (rowData) => {
    // Your action logic here
    navigate("/feeMaster/edit", {
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
      <div className="row justify-content-between align-items-center mt-3 feeMaster">
        <div className="col-md-4 col-lg-4 col-xl-4">
          <span className="fw-bold" style={{ fontSize: "20px" }}>
            Fee Master
          </span>
        </div>
        <div className="col-md-8 col-lg-8 col-xl-4">
          <div className="row form-group text-start">
            {/* <label className="fw-bold text-secondary mb-1" htmlFor="class">
            Academic session *
          </label> */}
            {/* <br /> */}
            <div className="col-sm-6 col-md-7 mb-2">
              <select
                size="lg"
                className="normalSelect "
                onChange={getSelectAcademicId}
                value={academicId}
              >
                <option value="">Select Academic Year</option>
                {academicList?.map((eachAcademic, index) => (
                  <option key={index} value={eachAcademic.academic_year_id}>
                    {eachAcademic.academic_year_name}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="btn add-button col-sm-6 col-md-5 mb-2"
              onClick={() => navigate("/feeMaster/add")}
              style={{ color: "#fff" }}
            >
              {" "}
              Add Fee Master
              {/* <Link
                to="/feeMaster/add"
                style={{ textDecoration: "none", color: "#fff" }}
              >
                Add Fee
              </Link> */}
            </button>
          </div>
        </div>
      </div>
      {/* <div className="row mt-4">
        <div className="form-group text-start mb-3 col-lg-3">
          <label className="fw-bold text-secondary mb-1" htmlFor="class">
            Academic session *
          </label>
          <br />
          <select
            size="lg"
            className="normalSelect"
            onChange={getSelectAcademicId}
            value={academicId}
          >
            <option value="">Select</option>
            {academicList?.map((eachAcademic, index) => (
              <option key={index} value={eachAcademic.academic_year_id}>
                {eachAcademic.academic_year_name}
              </option>
            ))}
          </select>
        </div>
      </div> */}
      {/* <div className="row mt-1 ">
        {classData.length > 0 ? (
          classData?.map((data, index) => (
            <div className="col-md-6 col-lg-3" key={index}>
              <div
                className="fee-list-container"
                onClick={() => activateGridScreen(data)}
              >
                <span className="fw-bold">Class</span>
                <p className="sub-subject-list">{data.std_name}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="d-flex align-items-center justify-content-center">
            {academicId !== "" ? (
              <div
                className="d-flex flex-column align-items-center"
                style={{ color: "grey" }}
              >
                <p className="mb-0 fw-bold text-center">
                  No Classes configured for the selected academic session.
                </p>
                <img
                  src="./images/nodata.png"
                  alt="no-data"
                  className="no-data mt-0"
                />
              </div>
            ) : (
              <p
                style={{
                  color: "grey",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Choose an academic year to view the Fee configured Class.
              </p>
            )}
          </div>
        )}
      </div> */}
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

export default FeeMasterList;
