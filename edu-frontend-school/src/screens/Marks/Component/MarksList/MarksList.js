import React, { useEffect, useState } from "react";
import * as addClassService from "../../../Class/Class.service";
import * as addAssignmentService from "../../../Assignment/Assignment.service";
import CommanGrid from "../../../../shared/components/GridTable/CommanGrid";
import * as addExamService from "../../../ExamManagement/Exam/Exam.service";
import "./MarksList.css";
import { useAuth } from "../../../../context/AuthContext";
import ToastUtility from "../../../../utility/ToastUtility";
import { useNavigate } from "react-router-dom";

const MarksList = () => {
  const navigate = useNavigate();

  const { userDetails, academicYear } = useAuth();
  const [studentGrid, setStudentGrid] = useState({ data: [], count: 0 });
  const [academicList, setAcademicList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [academicId, setAcademicId] = useState(null);
  const [allocatedClassId, setallocateclassId] = useState(null);
  const [allocatesectionID, setallocateSectionID] = useState(null);
  const [examTypeID, setExamTypeID] = useState(null);
  const [examTypeList, setExamTypeList] = useState([]);

  const [lazyState, setlazyState] = useState({
    first: 0,
    rows: 20,
    page: 0,
    sortField: null,
    sortOrder: null,
  });

  const gridColumns = [
    {
      field: "full_name",
      header: "Student Name",
      width: "30%",
      sortable: true,
    },

    {
      field: "student_admission_number",
      header: "Admission No.",
      width: "20%",
      sortable: true,
    },

    {
      field: "mobile_number",
      header: "Mobile Number",
      width: "20%",
      sortable: false,
    },
  ];

  const getAcademicList = async () => {
    const getAcademicListResponse = await addClassService.getAcademicList();
    const academicData = [getAcademicListResponse?.data];
    setAcademicList(...academicData);
  };

  const getClassesList = async (academicId) => {
    const payload = {
      academic_year_id: parseInt(academicId),
    };

    const getClassResponse = await addAssignmentService.getClassroomList(
      payload
    );

    if (!getClassResponse.error) {
      setClassList(getClassResponse?.data?.data);
    } else {
      console.error("Error in fetching data");
    }
  };

  const getSectionsList = async (allocatedClassId, academicId) => {
    const payload = {
      academic_year_id: parseInt(academicId),
      class_id: parseInt(allocatedClassId),
    };
    const getSectionResponse = await addAssignmentService.getSectionList(
      payload
    );

    const sectionData = [getSectionResponse?.data?.data];
    if (sectionData[0]?.length === 0) {
      ToastUtility.info("No Section Assigned for Selected Class");
    } else {
      setSectionList(sectionData[0]);
    }
  };

  const onSelectClass = async (e) => {
    setallocateclassId(e.target.value);
    if (allocatesectionID) {
      setallocateSectionID("");
    }
    if (e.target.value) {
      getSectionsList(e.target.value, academicId);
    }
  };

  useEffect(() => {
    getAcademicList();
    if (academicYear) {
      setAcademicId(academicYear);
      getClassesList(academicYear);
    }
  }, [academicYear, academicId]);

  const getExamType = async () => {
    const getExamTypeResponse = await addExamService.getExamTypeList();
    const examTypeData = [getExamTypeResponse.data?.data];
    setExamTypeList(...examTypeData);
  };

  useEffect(() => {
    getExamType();
  }, []);

  const onSelectAcademic = (value) => {
    setAcademicId(value);
  };

  const onSort = (event) => {
    setlazyState(event);
  };

  const onPaginationChange = (event) => {
    setlazyState(event);
  };

  const onSelectSection = async (e) => {
    setallocateSectionID(e.target.value);
  };

  const onSelectExamType = async (e) => {
    setExamTypeID(e.target.value);
  };

  const actionButton = (rowData) => {
    return <button className="add-marks-button">Add Marks</button>;
  };

  return (
    <div>
      {/* <div className="row justify-content-between align-items-center mb-3 studentSection">
        <div className="col-12 col-md-9 col-lg-10">
          <span className="fw-bold" style={{ fontSize: "20px" }}>
            Assign Marks
          </span>
        </div>
      </div> */}
      <div className="row justify-content-between align-items-center mb-3 studentSection">
        <div className="col-12 col-md-9 col-lg-2">
          <span
            className="fw-bold"
            style={{ fontSize: "20px" }}
            onClick={() => navigate("/marks/add")}
          >
            Assign Marks
          </span>
        </div>
        <div className="col-md-4 col-lg-3 mt-2">
          <select
            className="academicSelect w-100  "
            onChange={(e) => onSelectAcademic(e.target.value)}
            value={academicId}
          >
            <option value="">Select Academic Year</option>
            {academicList?.map((academic, index) => (
              <option key={index} value={academic.academic_year_id}>
                {academic.academic_year_name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4 col-lg-2 mt-2">
          <select
            className="academicSelect w-100"
            onChange={(e) => onSelectClass(e)}
            value={allocatedClassId}
          >
            <option value="">Select Class</option>
            {classList?.map((eachClass, index) => (
              <option key={index} value={eachClass.std_id}>
                {eachClass.std_name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4 col-lg-2 mt-2">
          <select
            className="academicSelect w-100"
            onChange={(e) => onSelectSection(e)}
            value={allocatesectionID}
          >
            <option value="">Select Section</option>
            {sectionList?.map((eachSection, index) => (
              <option key={index} value={eachSection.section_id}>
                {eachSection.section_name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4 col-lg-2 mt-2">
          <select
            className="normalSelect"
            onChange={(e) => onSelectExamType(e)}
            value={examTypeID}
          >
            <option value="">Select Exam</option>
            {examTypeList?.map((examType, index) => (
              <option key={index} value={examType.exam_type_id}>
                {" "}
                {examType.exam_name}{" "}
              </option>
            ))}
          </select>
        </div>
      </div>

      <CommanGrid
        columns={gridColumns}
        data={studentGrid.data}
        totalRecords={studentGrid.count}
        lazyState={lazyState}
        // admissionStatus={admissionStatus}
        // className={className}
        // academicYear={academicYeargrid}
        lazyLoad={true}
        onSort={onSort}
        onPageChange={onPaginationChange}
        paginator={true}
        actionButton={actionButton}
        rows={20}
        rowsPerPageOptions={[20, 40, 60]}
        // paginatorTemplate=" PrevPageLink PageLinks NextPageLink  CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} "
      />
    </div>
  );
};

export default MarksList;
