import React, { useEffect, useState } from "react";
import "./ListofStudent.css";
import * as addAssignmentService from "../../../Assignment/Assignment.service";
import ToastUtility from "../../../../utility/ToastUtility";
import * as addClassService from "../../../Class/Class.service";
import * as studentListService from "../../../StudentList/StudentList.service";
import { navigate, useNavigate } from "react-router-dom";
import { IconPencil } from "@tabler/icons-react";
import CommanGrid from "../../../../shared/components/GridTable/CommanGrid";
import { useAuth } from "../../../../context/AuthContext";

const ListofStudentbyClass = () => {
  const [classId, setclassId] = useState(null);
  const [academicId, setacademicId] = useState(null);
  const [sectionId, setsectionId] = useState(null);
  const [classGrid, setClassGrid] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [academicList, setacademicList] = useState([]);
  const [classroomStudentListGrid, setClassroomStudentListGrid] = useState([
    { data: [], count: 0 },
  ]);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const { userDetails, academicYear } = useAuth();
  const [lazyState, setlazyState] = useState({
    first: 0,
    rows: 20,
    page: 0,
    sortField: null,
    sortOrder: null,
  });
  const navigate = useNavigate();

  const getAllClass = async (academicId) => {
    if (academicId != "Select Academic year") {
      const getAllClassResponse = await addClassService.getClassList();
      if (!getAllClassResponse.error) {
        const classData = [getAllClassResponse?.data];
        setClassGrid(...classData);
      } else {
        console.error("Error in fetching data");
      }
    }
  };
  

  useEffect(() => {
    getAcademicList();
    setacademicId(academicYear);
    getAllClass(academicYear);
  }, [academicYear, lazyState]);

  const getAcademicList = async () => {
    const getAcademicListResponse = await addClassService.getAcademicList();
    const academicData = [getAcademicListResponse?.data];
    setacademicList(...academicData);
  };

  const getSection = async (classId) => {
    const payload = {
      academic_year_id: parseInt(academicId),
      class_id: parseInt(classId),
    };
    const getAssignmentResponse = await addAssignmentService.getSectionList(
      payload
    );
    const assignmentData = [getAssignmentResponse?.data?.data];

    if (assignmentData[0]?.length === 0) {
      ToastUtility.info("No Section Assigned for Selected Class");
    } else {
      setSectionList(...assignmentData);
    }
  };

  const getClassroomStudents = async (classroom_id) => {
    if (classroom_id) {
      const payload = {
        classroom_id: parseInt(classroom_id),
        // pageSize: 20,
        // currentPage: 0,
        pageSize: lazyState.rows,
        currentPage: lazyState.page,
        sortField: lazyState.sortField,
        sortOrder: lazyState.sortOrder
  
      };

      const getClassroomStudentListResponse =
        await studentListService.getClassroomStudents(payload);
      

      if (!getClassroomStudentListResponse.error) {
        setClassroomStudentListGrid(
          getClassroomStudentListResponse?.data?.data
        );
      } else {
        console.error("Error in fetching data");
      }
    }
  };
  
  


  const setClass = (e) => {
    setSelectedClassroom(e);
    navigate(`/studentList/studentProfileData`, {
      state: {
        rowData: e,
        academicId:academicId
      },
    });
    // console.log(e);
    console.log("jsono", JSON.stringify(e));
  };

  // const gridData = [...classroomStudentListGrid];

  const gridColumns = [
    { field: "roll_no", header: "Roll No.", width: "20%", sortable: true },
    { field: "first_name", header: "Name", width: "20%", sortable: true },
    { field: "father_name", header: "Father's Name", width: "20%", sortable: true },
    {
      field: "student_admission_number",
      header: "Admission Number",
      width: "20%",
      sortable: true,
    },
  ];

  const metaKeySelection = true;

  const gender = (rowData) => {};

  const onSelectAcademic = async (e) => {
    setacademicId(e.target.value);
    if (classId) {
      setclassId("");
      setsectionId("");
    }
    if (e.target.value) {
      await getAllClass(e.target.value);
    }
  };

  const onSelectSection = async (e) => {
    setsectionId(e.target.value);

    if (e.target.value) {
      await getClassroomStudents(e.target.value);
    }
  };

  const onSelectClass = async (e) => {
    setclassId(e.target.value);
    if (sectionId) {
      setsectionId("");
    }
    if (e.target.value) {
      getSection(e.target.value);
    }
  };

  const onSort = (event) => {
    setlazyState(event);
  };

  const onPaginationChange = (event) => {
    setlazyState(event);
  };

  return (
    <div className="row align-items-center mb-3 divisionSection ">
      <div className="col-md-12 col-lg-2">
        <h1 className="fw-bold" style={{ fontSize: "18px", marginBottom: "0" }}>
          Student List
        </h1>
      </div>

      <div className="col-md-4 col-lg-3">
        <div className="form-group text-start mb-3 ">
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
      </div>
      <div className="col-md-4 col-lg-3">
        <div className="form-group text-start mb-3 ">
          <select
            className="normalSelect"
            onChange={(e) => onSelectClass(e)}
            value={classId}
          >
            <option>Select Class</option>
            {classGrid?.map((nameClass, index) => (
              <option key={index} value={nameClass.id}>
                {" "}
                {nameClass.name}{" "}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="col-md-4 col-lg-3">
        <div className="form-group text-start mb-3 ">
          <select
            className="normalSelect"
            onChange={(e) => onSelectSection(e)}
            value={sectionId}
          >
            <option value="">Select Section</option>
            {sectionList?.map((section, index) => (
              <option key={index} value={section.classroom_id}>
                {" "}
                {section.section_name}{" "}
              </option>
            ))}
          </select>
        </div>
      </div>

      <CommanGrid
        columns={gridColumns}
        data={classroomStudentListGrid.data} 
        totalRecords={classroomStudentListGrid.count}
        lazyState={lazyState}
        lazyLoad={true}
        onSort={onSort}
        onPageChange={onPaginationChange}
        paginator={true}
        selectionMode="single"
        dataKey="student_id"
        selection={selectedClassroom}
        metaKeySelection={metaKeySelection}
        onSelectionChange={(e) => setClass(e.value)}
        // gender={gender}

        rows={50}
        rowsPerPageOptions={[20, 40, 60]}
        paginatorTemplate="PrevPageLink PageLinks NextPageLink  CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} "
      />
    </div>
  );
};

export default ListofStudentbyClass;
