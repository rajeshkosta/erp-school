import React, { useEffect, useState } from "react";
import "./SubjectListComponent.css";
import CommanGrid from "../../../../shared/components/GridTable/CommanGrid";
import { Link, useNavigate } from "react-router-dom";
import { IconPencil } from "@tabler/icons-react";
import * as addSubjectService from "../../Subject.service";
import ToastUtility from "../../../../utility/ToastUtility";
import "./SubjectListComponent.css";
import { Switch } from "@mantine/core";

const SubjectListComponent = () => {
  const navigate = useNavigate();
  const [subjectGrid, setSubjectGrid] = useState([]);
  const [subjectStates, setSubjectStates] = useState(
    Array(subjectGrid.length).fill(false)
  );

  // const gridData = [...subjectGrid];

  // const gridColumns = [
  //   // { field: "code", header: "Code", sortable: true, width: "25%" },
  //   {
  //     field: "subject_name",
  //     header: "Subject name",
  //     width: "80%",
  //     sortable: true,
  //   },
  // ];

  // // Handle the action
  // const handleAction = (rowData) => {
  //   // Your action logic here
  //   navigate("/subjectmanagement/edit", {
  //     state: {
  //       rowData: rowData,
  //     },
  //   });
  // };

  // Define the action button
  // const actionButton = (rowData) => {
  //   return (
  //     <div className="d-flex justify-content-between align-items-center w-75">
  //       {/* <IconEye onClick={() => handleAction(rowData)} color="grey" size={20} /> */}
  //       <IconPencil
  //         onClick={() => handleAction(rowData)}
  //         color="grey"
  //         size={20}
  //         style={{ cursor: "pointer" }}
  //       />
  //       {/* <IconCircle
  //         onClick={() => handleAction(rowData)}
  //         color="grey"
  //         size={20}
  //       /> */}
  //     </div>
  //   );
  // };

  const getSubjectsList = async () => {
    const getSubjectResponse = await addSubjectService.getSubject();
    if (!getSubjectResponse.error) {
      setSubjectGrid(getSubjectResponse.data.data);
    } else {
    }
  };

  useEffect(() => {
    getSubjectsList();
  }, []);

  const goToSubjectEditPage = (subject) => {
    navigate("/subjectmanagement/edit", {
      state: {
        subject: subject,
      },
    });
  };

  // const handleSwitchChange = (index) => {
  //   const newSubjectStates = [...subjectStates];
  //   newSubjectStates[index] = !newSubjectStates[index];
  //   setSubjectStates(newSubjectStates);
  // };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-3 subjectSection">
        <span className="fw-bold" style={{ fontSize: "20px" }}>
          Subject Management
        </span>
        <button
          className="btn add-button"
          onClick={() => navigate("/subjectmanagement/add")}
          style={{ color: "#fff" }}
        >
          Add Subjects
          {/* <Link
            to="/subjectmanagement/add"
            style={{ textDecoration: "none", color: "#fff" }}
          >
            Add Subjects
          </Link> */}
        </button>
      </div>
      <div className="row mt-5">
        {subjectGrid?.map((subject, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-3 mb-4">
            <div className="subject-list-container-info">
              <div className="academic_year_img">
                <img src="/Assets/subject.svg" />
              </div>
              <h1>{subject.subject_name}</h1>
              <button
                onClick={() => goToSubjectEditPage(subject)}
                className="btn btnEdit"
              >
                Edit
              </button>
              {/* <div className="sub-subject-list">
                <IconPencil
                  size={18}
                  style={{ marginRight: "10px", cursor: "pointer" }}
                  onClick={() => goToSubjectEditPage(subject)}
                /> */}
              {/* <Switch
                  checked={subjectStates[index]}
                  onChange={() => handleSwitchChange(index)}
                /> */}
              {/* </div> */}
            </div>
          </div>
        ))}
      </div>
      {/* <CommanGrid
        columns={gridColumns}
        data={gridData}
        paginator
        actionButton={actionButton}
        rows={10}
        rowsPerPageOptions={[10, 20, 30]}
        paginatorTemplate="PrevPageLink PageLinks NextPageLink  CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} "
      /> */}
    </div>
  );
};

export default SubjectListComponent;
