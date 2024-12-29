import React, { useEffect, useState } from "react";
import CommanGrid from "../../../../../src/shared/components/GridTable/CommanGrid";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IconChevronLeft, IconPencil } from "@tabler/icons-react";
import * as addAssignmentService from "../../Assignment.service";
import moment from "moment";

const AssignmentGrid = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [sectionID, setSectionID] = useState(null);
  const [subjectID, setSubjectID] = useState(null);

  const [sectionList, setSectionList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);

  const [allClassGrid, setAllClassGrid] = useState([]);
  const [hideShow, setHideShow] = useState(false);

  const gridColumns = [
    {
      field: "subject_name",
      header: "Subject Name",
      width: "15%",
      sortable: false,
    },
    {
      field: "assignment_title",
      header: "Assignment Title",
      width: "20%",
      sortable: false,
    },
  ];

  const gridData = [...allClassGrid];

  const getClassGrid = async (sectionID, subjectID) => {
    if (state?.data) {
      const payload = {
        academic_year_id: state?.academic_year_id,
        class_id: state?.data.std_id,
        classroom_id: parseInt(sectionID),
        subject_id: parseInt(subjectID),
      };

      const getClassListResponse =
        await addAssignmentService.getAllClassByClassIdGrid(payload);
      if (!getClassListResponse.error) {
        setAllClassGrid(getClassListResponse?.data?.data);
      }
    }
  };

  const getSection = async () => {
    const payload = {
      academic_year_id: state?.academic_year_id,
      class_id: state?.data?.std_id,
    };
    const getAssignmentResponse = await addAssignmentService.getSectionList(
      payload
    );
    const sectionData = [getAssignmentResponse?.data?.data];
    setSectionList(...sectionData);
  };

  const getSubject = async (classroom) => {
    const payload = {
      academic_year_id: state?.academic_year_id,
      classroom_id: classroom,
    };
    const getSubjectResponse = await addAssignmentService.getSubjectList(
      payload
    );
    const subjectData = [getSubjectResponse?.data?.data];
    setSubjectList(...subjectData);
  };

  useEffect(() => {
    getSection();
    console.log(state?.data);
    getClassGrid();
  }, []);

  const onSelectSection = async (e) => {
    const selectedValue = e.target.value;

    if (selectedValue !== "selectOption") {
      setHideShow(true);
      setSectionID(selectedValue);
      getSubject(selectedValue);
      if (selectedValue) {
        await getClassGrid(selectedValue, subjectID);
      }
    } else {
      setHideShow(false);
      setSectionID(null);
      getSubject(null);
    }
  };

  const onSelectSubject = async (e) => {
    const selectedValue = e.target.value;
    setSubjectID(selectedValue);

    if (selectedValue !== "selectOption") {
      await getClassGrid(sectionID, selectedValue);
    }
  };

  const startDate = (rowData) => {
    const start_date = moment(rowData?.start_date).format("DD-MM-YYYY");
    if (rowData?.start_date !== null) {
      return <span>{start_date}</span>;
    } else {
      return <span>N/A</span>;
    }
  };

  const endDate = (rowData) => {
    const end_date = moment(rowData?.end_date).format("DD-MM-YYYY");
    if (rowData?.end_date !== null) {
      return <span>{end_date}</span>;
    } else {
      return <span>N/A</span>;
    }
  };

  const handleAction = (rowData) => {
    navigate("/assignment/edit", {
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

  const goBackToAssignmentPage = () => {
    navigate("/assignment");
  };

  return (
    <div>
      <div className="row justify-content-between align-items-center mb-3 assignmentinationSection">
        <div className="col-md-4 col-lg-4 col-xl-6">
          <div className="d-flex align-items-center">
            <IconChevronLeft
              size={30}
              onClick={goBackToAssignmentPage}
              style={{ cursor: "pointer" }}
              color="black"
            />
            <span
              className="fw-bold"
              style={{ fontSize: "20px", marginLeft: "10px" }}
            >
              Assignments of {state?.data?.std_name}
            </span>
          </div>
        </div>
        <div className="col-md-8 col-lg-8 col-xl-6">
          <div
            className="row form-group d-flex align-items-center text-start"
            style={{ justifyContent: "end" }}
          >
            <div className="col-md-6 col-lg-6 col-xl-4">
              <select
                className="normalSelect"
                onChange={(e) => onSelectSection(e)}
                value={sectionID !== null ? sectionID : ""}
              >
                <option value="selectOption">-Filter By Section-</option>
                {sectionList?.map((section, index) => (
                  <option key={index} value={section.classroom_id}>
                    {" "}
                    {section.section_name}{" "}
                  </option>
                ))}
              </select>
            </div>
            {hideShow ? (
              <div className="col-md-6 col-lg-6 col-xl-4">
                <select
                  className="normalSelect"
                  onChange={(e) => onSelectSubject(e)}
                  value={subjectID !== null ? subjectID : ""}
                >
                  <option value="selectOption">-Filter By Subject-</option>
                  {subjectList?.map((subject, index) => (
                    <option key={index} value={subject.subject_id}>
                      {" "}
                      {subject.subject_name}{" "}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              ""
            )}
            <button
              style={{ color: "#fff" }}
              className="btn add-button col-md-5 col-lg-5 col-xl-3 py-2"
              onClick={() => navigate("/assignment/add")}
              // onClick={() =>
              //   navigate("/assignment/add", {
              //     state: { class_id: state?.data?.std_id },
              //   })
              // }
            >
              Add Assignment
            </button>
          </div>
        </div>
      </div>
      <CommanGrid
        columns={gridColumns}
        data={gridData}
        paginator
        actionButton={actionButton}
        endDate={endDate}
        startDate={startDate}
        rows={10}
        rowsPerPageOptions={[10, 20, 30]}
        paginatorTemplate="PrevPageLink PageLinks NextPageLink  CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} "
      />
    </div>
  );
};

export default AssignmentGrid;
