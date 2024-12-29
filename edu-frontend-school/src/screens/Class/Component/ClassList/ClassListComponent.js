import { IconPencil } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import CommanGrid from "../../../../shared/components/GridTable/CommanGrid";
import { Link } from "react-router-dom";
import { InputSwitch } from "primereact/inputswitch";
import * as addClassService from "../../Class.service";
import { useAuth } from "../../../../context/AuthContext";
import "./ClassListComponent.css";
import { Checkbox } from "primereact/checkbox";
import ToastUtility from "../../../../utility/ToastUtility";

const ClassListComponent = () => {
  const [classGrid, setClassGrid] = useState({ data: [], count: 0 });
  const [academicId, setacademicId] = useState(null);
  const [academicList, setacademicList] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const { userDetails, academicYear } = useAuth();
  const navigate = useNavigate();
  const [lazyState, setlazyState] = useState({
    // first: 0,
    // rows: 3,
    // page: 0,
    // sortField: null,
    // sortOrder: null,
    first: 0,
    rows: 50,
    page: 1,
    sortField: null,
    sortOrder: null,
  });

  const onSort = (event) => {
    setlazyState(event);
  };

  const onPaginationChange = (event) => {
    // setlazyState(event);
    setlazyState({
      ...lazyState,
      ...event,
      page: event.first / event.rows + 1,
    });
  };

  const getAllClass = async (academicId) => {
    if (academicId) {
      const payload = {
        academic_year_id: parseInt(academicId),
        // pageSize: 20,
        // currentPage: 0,
        page_size: lazyState.rows,
        current_page: lazyState.page,
        sortField: lazyState.sortField,
        sortOrder: lazyState.sortOrder,
      };

      const getAllClassResponse = await addClassService.getAllClass(payload);

      if (!getAllClassResponse.error) {
        setClassGrid(getAllClassResponse?.data);
      } else {
        console.error("Error in fetching data");
      }
    }
  };

  useEffect(() => {
    getAcademicList();
    setacademicId(academicYear);
    if (academicYear) {
      getAllClass(academicYear);
    }
  }, [academicYear, lazyState]);

  // const gridData = [...classGrid];

  const gridColumns = [
    { field: "std_name", header: "Class", width: "25%", sortable: true },
    { field: "section_name", header: "Section", width: "20%", sortable: true },
    {
      field: "class_teacher_name",
      header: "Class Teacher",
      width: "40%",
      sortable: true,
    },
  ];

  const getAcademicList = async () => {
    const getAcademicListResponse = await addClassService.getAcademicList();
    const academicData = [getAcademicListResponse?.data];
    setacademicList(...academicData);
  };
  const onSelectAcademic = async (e) => {
    setacademicId(e.target.value);
    if (e.target.value) {
      await getAllClass(e.target.value);
    }
  };

  const handleAction = (rowData) => {
    navigate("/class/edit", {
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
      <div className="row justify-content-between align-items-center mb-3 ">
        <div className="col-md-4 col-lg-6">
          <span className="fw-bold" style={{ fontSize: "20px" }}>
            Class Configuration
          </span>
        </div>
        <div className="col-md-8 col-lg-6">
          <div
            className="row form-group text-start mb-3 "
            style={{ justifyContent: "end" }}
          >
            <div className="col-md-6">
              <select
                className="normalSelect"
                onChange={(e) => onSelectAcademic(e)}
                value={academicId}
              >
                <option value="">Select Academic Year</option>
                {academicList?.map((nameClass, index) => (
                  <option key={index} value={nameClass.academic_year_id}>
                    {" "}
                    {nameClass.academic_year_name}{" "}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="btn add-button col-md-3"
              onClick={() => navigate("/class/add")}
              style={{ color: "#fff" }}
            >
              Add Class
              {/* <Link
                to="/class/add"
                style={{ textDecoration: "none", color: "#fff" }}
              >
                Add Class
              </Link> */}
            </button>
          </div>
        </div>
      </div>
      <CommanGrid
        columns={gridColumns}
        // data={gridData}
        // selectionMode="multiple"
        data={classGrid.data}
        totalRecords={classGrid.count}
        lazyState={lazyState}
        paginator={true}
        onSort={onSort}
        lazyLoad={true}
        onPageChange={onPaginationChange}
        dataKey="classroom_id"
        selection={selectedClass}
        onSelectionChange={(e) => setSelectedClass(e.value)}
        actionButton={actionButton}
        rows={50}
        rowsPerPageOptions={[50, 80, 100]}
        // paginatorTemplate="PrevPageLink PageLinks NextPageLink  CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} "
      />
    </div>
  );
};

export default ClassListComponent;
