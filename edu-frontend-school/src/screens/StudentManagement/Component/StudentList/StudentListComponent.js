import React, { useEffect, useState } from "react";
import CommanGrid from "../../../../shared/components/GridTable/CommanGrid";
import { Link } from "react-router-dom";
import {
  IconAt,
  IconCoinRupee,
  IconPencil,
  IconSearch,
  IconX,
  IconView360,
} from "@tabler/icons-react";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Modal } from "@mantine/core";
import * as addStudentService from "../../Student.service";
import * as addClassService from "../../../Class/Class.service";
import * as addAssignmentService from "../../../Assignment/Assignment.service";
import "./StudentListComponent.css";
import { Collapse, TextInput, Tooltip } from "@mantine/core";
import { useAuth } from "../../../../context/AuthContext";
import { getCurrentScreenPermissin } from "../../../../shared/services/common.service";
import ToastUtility from "../../../../utility/ToastUtility";

const StudentListComponent = () => {
  const [studentGrid, setStudentGrid] = useState({ data: [], count: 0 });
  const [classList, setClassList] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [academicList, setAcademicList] = useState([]);
  const [screenPermission, SetScreenPermission] = useState();
  const [academicId, setAcademicId] = useState(null);
  const { userDetails, academicYear } = useAuth();
  const [allocatedClassId, setallocateclassId] = useState(null);
  const [allocatesectionID, setallocateSectionID] = useState(null);
  const [searchByname, setSearchByname] = useState("");
  const [searchByAdmissionNumber, setSearchByAdmissionNumber] = useState("");
  const navigate = useNavigate();
  const [studentDetailPopUp, setStudentDetailPopUp] = useState();
  const [openedStudentDetail, setOpenedStudentDetail] = useState(false);
  const [lazyState, setlazyState] = useState({
    first: 0,
    rows: 20,
    page: 0,
    sortField: null,
    sortOrder: null,
    // filters: {
    //     name: { value: '', matchMode: 'contains' },
    //     'country.name': { value: '', matchMode: 'contains' },
    //     company: { value: '', matchMode: 'contains' },
    //     'representative.name': { value: '', matchMode: 'contains' }
    // }
  });
  const openStudentDetail = () => {
    setOpenedStudentDetail(true);
  };
  const closeStudentDetail = () => {
    setOpenedStudentDetail(false);
  };

  const getAcademicList = async () => {
    const getAcademicListResponse = await addClassService.getAcademicList();
    const academicData = [getAcademicListResponse?.data];
    setAcademicList(...academicData);
  };

  const getClassesList = async (academicId) => {
    // const getClassResponse = await addClassService.getClassList();
    // setClassList(getClassResponse.data);

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

  useEffect(() => {
    // getClassesList();
    // getSectionsList();
    const CurrentScreenPermissin = getCurrentScreenPermissin(
      userDetails.menu_permission
    );
    console.log(CurrentScreenPermissin);
    SetScreenPermission(CurrentScreenPermissin);
    getAcademicList();
    if (academicYear) {
      setAcademicId(academicYear);
      getClassesList(academicYear);
    }
  }, [academicYear]);

  const gridColumns = [
    {
      field: "full_name",
      header: "Student Name",
      width: "20%",
      sortable: true,
    },
    {
      field: "father_name",
      header: "Father's Name",
      width: "20%",
      sortable: true,
    },
    {
      field: "student_admission_number",
      header: "Admission No.",
      width: "17%",
      sortable: true,
    },

    // {
    //   field: "admission_date",
    //   header: "Admission Date",
    //   width: "17%",
    //   sortable: true,
    // },
    // {
    //   field: "gender",
    //   header: "Gender",
    //   width: "10%",
    //   sortable: true,
    // },

    // { field: "dob", header: "DOB", width: "13%", sortable: false },

    {
      field: "mobile_number",
      header: "Mobile Number",
      width: "15%",
      sortable: false,
    },
    // {
    //   field: "std_name",
    //   header: "Class",
    //   width: "12%",
    //   sortable: false,
    // },

    // {
    //   field: "mobile_number",
    //   header: "Mobile no.",
    //   width: "18%",
    //   sortable: true,
    // },
  ];

  // Handle the action
  const handleAction = (rowData) => {
    console.log(rowData, "sauravvv");
    // Your action logic here
    navigate("/student/edit", {
      state: {
        rowData: rowData,
      },
    });
  };
  // Handle the action
  const handleFees = (rowData) => {
    // Your action logic here
    navigate("/student/fees", {
      state: {
        rowData: rowData,
        academicId: academicId,
      },
    });
  };
  // Handle action
  const handleView = (rowData) => {
    setOpenedStudentDetail(true);
    setStudentDetailPopUp(rowData);
  };

  const getAllStudentsList = async () => {
    const payload = {
      academic_year_id: academicId,
      student_name: searchByname,
      student_std_id: allocatedClassId,
      student_admission_number: searchByAdmissionNumber,
      student_section_id: allocatesectionID,
      pageSize: lazyState.rows,
      currentPage: lazyState.page,
      sortField: lazyState.sortField,
      sortOrder: lazyState.sortOrder,
    };

    const getStudentResponse = await addStudentService.getAllStudents(payload);
    if (!getStudentResponse.error) {
      setStudentGrid(getStudentResponse?.data);
    }
  };

  const onSort = (event) => {
    setlazyState(event);
  };

  const onPaginationChange = (event) => {
    setlazyState(event);
  };

  useEffect(() => {
    if (academicId || allocatedClassId || allocatesectionID) {
      getAllStudentsList();
    }
  }, [academicId, allocatedClassId, allocatesectionID, lazyState]);

  useEffect(() => {
    let timeOutId;
    const handleNameSearchInput = () => {
      getAllStudentsList();
    };

    if (searchByname && searchByname.length >= 3) {
      clearTimeout(timeOutId);
      timeOutId = setTimeout(() => {
        handleNameSearchInput();
      }, 3000);
    }

    return () => clearTimeout(timeOutId);
  }, [searchByname]);

  useEffect(() => {
    let timeOutId;

    const handleAdmissionNumberSearchInput = () => {
      getAllStudentsList();
    };

    if (searchByAdmissionNumber && searchByAdmissionNumber.length >= 1) {
      clearTimeout(timeOutId);
      timeOutId = setTimeout(() => {
        handleAdmissionNumberSearchInput();
      }, 3000);
    }

    return () => clearTimeout(timeOutId); // Cleanup function to clear the timeout on component unmount or dependency change
  }, [searchByAdmissionNumber]);

  const onSelectClass = async (e) => {
    setallocateclassId(e.target.value);
    if (allocatesectionID) {
      setallocateSectionID("");
    }
    if (e.target.value) {
      getSectionsList(e.target.value, academicId);
    }
  };

  // Define the action button
  const actionButton = (rowData) => {
    if (screenPermission?.permission != "Read") {
      return (
        <div className="d-flex justify-content-start align-items-center w-75">
          {/* <IconEye onClick={() => handleAction(rowData)} color="grey" size={20} /> */}
          <Tooltip
            label="Edit"
            color="#DB3525"
            arrowSize={6}
            withArrow
            position="top"
          >
            <FaEye
              onClick={() => handleView(rowData)}
              color="grey"
              size={20}
              style={{ cursor: "pointer", marginRight: "12px" }}
            />
          </Tooltip>
          <Tooltip
            label="Edit"
            color="#DB3525"
            arrowSize={6}
            withArrow
            position="top"
          >
            <IconPencil
              onClick={() => handleAction(rowData)}
              color="grey"
              size={20}
              style={{ cursor: "pointer", marginRight: "12px" }}
            />
          </Tooltip>
          <Tooltip
            label="Fees"
            color="#DB3525"
            arrowSize={6}
            withArrow
            position="top"
          >
            <IconCoinRupee
              onClick={() => handleFees(rowData)}
              color="grey"
              size={23}
              style={{ cursor: "pointer", marginRight: "12px" }}
            />
          </Tooltip>
         
        </div>
      );
    } else {
      return <div></div>;
    }
  };

  const admissionStatus = (rowData) => {
    return (
      <span style={{ color: "#DB3525" }}>
        {rowData.status === 1 ? "Active" : null}
      </span>
    );
  };

  const academicYeargrid = (rowData) => {
    const matchedAcademic = academicList.find(
      (academicItem) =>
        academicItem.academic_year_id == rowData.academic_year_id
    );
    if (matchedAcademic) {
      return <span>{matchedAcademic.academic_year_name}</span>;
    }
  };

  const className = (rowData) => {
    return (
      <span style={{ fontWeight: "bold" }}>
        {rowData.std_name
          ? `${rowData.std_name}  (${rowData.section_name})`
          : "N/A"}
      </span>
    );
  };

  // const section = (rowData) => {
  //   const matchedSection = sectionList.find(
  //     (sectionItem) => sectionItem.section_id == rowData.section_id
  //   );
  //   if (matchedSection) {
  //     return <span>{matchedSection.section_name}</span>;
  //   }
  // };

  const onSelectAcademic = async (value) => {
    setAcademicId(value);
    if (allocatedClassId) {
      setallocateclassId("");
      setallocateSectionID("");
    }
    if (value) {
      await getClassesList(value);
    }
  };

  const onSelectSection = async (e) => {
    setallocateSectionID(e.target.value);
  };

  const feesStatus = (rowData) => {
    // return <div>{rowData.total_amount === 0 && rowData.pending_amount == "0" ? <span>}</div>;

    return (
      <div style={{ fontWeight: "bold" }}>
        {rowData.total_amount ? (
          rowData.pending_amount == "0" ? (
            <span style={{ color: "green" }}>Paid</span>
          ) : (
            <span style={{ color: "red" }}>{rowData.pending_amount}</span>
          )
        ) : (
          "N/A"
        )}
      </div>
    );
  };

  const onNameSearched = (e) => {
    setSearchByname(e.target.value);
  };

  const onAdmissionSearched = (e) => {
    setSearchByAdmissionNumber(e.target.value);
  };

  return (
    <div>
      <Modal
        opened={openedStudentDetail}
        onClose={closeStudentDetail}
        centered
        size={"md"}
        title="Student Details"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        {/* <form>
          <diV className="student-details">
            <div>
              Student Name :{" "}
              {studentDetailPopUp?.full_name ? (
                studentDetailPopUp?.full_name
              ) : (
                <span style={{ color: "red" }}>Not Updated</span>
              )}
            </div>
            <div>
              Admission Date :{" "}
              {studentDetailPopUp?.admission_date ? (
                studentDetailPopUp?.admission_date
              ) : (
                <span style={{ color: "red" }}>Not Updated</span>
              )}
            </div>
            <div>
              Blood Group :{" "}
              {studentDetailPopUp?.blood_group ? (
                studentDetailPopUp?.blood_group
              ) : (
                <span style={{ color: "red" }}>Not Updated</span>
              )}
            </div>
            <div>
              DOB :{" "}
              {studentDetailPopUp?.dob ? (
                studentDetailPopUp?.dob
              ) : (
                <span style={{ color: "red" }}>Not Updated</span>
              )}
            </div>
            <div>
              Roll No :{" "}
              {studentDetailPopUp?.roll_no ? (
                studentDetailPopUp?.roll_no
              ) : (
                <span style={{ color: "red" }}>Not Updated</span>
              )}
            </div>
            <div>
              School Id :{" "}
              {studentDetailPopUp?.school_id ? (
                studentDetailPopUp?.school_id
              ) : (
                <span style={{ color: "red" }}>Not Updated</span>
              )}{" "}
            </div>
            <div>
              Student Admission No. : {""}
              {studentDetailPopUp?.student_admission_number ? (
                studentDetailPopUp?.student_admission_number
              ) : (
                <span style={{ color: "red" }}>Not Updated</span>
              )}{" "}
            </div>
          </diV>

          {console.log(studentGrid, "ashish")}
        </form> */}
        <div className="profile-section">
            <div className="student-profileData-container-section">
              <div className="profile-container">
                {studentDetailPopUp?.student_photo_cdn ? (
                  <img
                    src={studentDetailPopUp?.student_photo_cdn}
                    alt="profile"
                    style={{ borderRadius: "50%", width: "100px" }}
                  />
                ) : (
                  <img
                    src="/images/profile-pic.png"
                    alt="profile-pic"
                    className="profile-pic"
                  />
                )}
              </div>
              <h2 className="student-name">
                {studentDetailPopUp?.full_name}<div className="Father_namee"><h6>  </h6></div>
               
              </h2>
              
              <div className="border-bottom"></div>
              <div>
                <div className="container">
                  <span className="admission-date">Admission Date:</span>
                  <span className="personal_details">
                    {" "}
                    {studentDetailPopUp?.admission_date?studentDetailPopUp?.admission_date: <span>Not Updated</span>}
                  </span>
                </div>
                <div className="container">
                  <span className="admission-date">Admission No. :</span>
                  <span className="personal_details">
                    {" "}
                    {studentDetailPopUp?.student_admission_number}
                  </span>
                </div>
                <div className="container">
                  <span className="admission-date">Class :</span>
                  <span className="personal_details">
                    {studentDetailPopUp?.std_name?studentDetailPopUp?.std_name: <span style={{color:"red"}}>Not Updated</span>}
                  </span>
                </div>
                <div className="container">
                  <span className="admission-date">Section :</span>
                  <span className="personal_details">
                    {studentDetailPopUp?.section_name?studentDetailPopUp?.section_name: <span style={{color:"red"}}>Not Updated</span>}
                  </span>
                </div>
                <div className="container">
                  <span className="admission-date">Rollno. :</span>
                  <span className="personal_details">
                    {" "}
                    {studentDetailPopUp?.roll_no?studentDetailPopUp?.roll_no: <span style={{color:"red"}}>Not Updated</span>}
                  </span>
                </div>
                <div className="container">
                  <span >Blood Group :</span>
                  <span className="personal_details">
                    {studentDetailPopUp?.blood_group?studentDetailPopUp?.blood_group: <span style={{color:"red"}}>Not Updated</span>}
                  </span>
                </div>
                <div className="container">
                  <span >DOB :</span>
                  <span className="personal_details">
                    {studentDetailPopUp?.dob?studentDetailPopUp?.dob: <span style={{color:"red"}}>Not Updated</span>}
                  </span>
                </div>
              </div>
            </div>
          </div>
      </Modal>
      <div className="row justify-content-between align-items-center mb-3 studentSection">
        <div className="col-12 col-md-9 col-lg-10">
          <span className="fw-bold" style={{ fontSize: "20px" }}>
            Student Details
          </span>
        </div>
        {screenPermission?.permission != "Read" && (
          <button
            className="btn add-button col-6 col-md-3 col-lg-2"
            onClick={() => navigate("/student/add")}
            style={{ color: "#fff" }}
          >
            Add Student
            {/* <Link
                to="/student/add"
                style={{ textDecoration: "none", color: "#fff" }}
              >
                Add Student
              </Link> */}
          </button>
        )}
      </div>
      <div className="row mb-3">
        <div className="col-md-4 col-lg-3 mt-2">
          <select
            className="academicSelect w-100  "
            onChange={(e) => onSelectAcademic(e.target.value)}
            value={academicId}
          >
            <option value="">Filter by Academic Year</option>
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
            <option value="">Filter by class</option>
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
            <option value="">Filter by section</option>
            {sectionList?.map((eachSection, index) => (
              <option key={index} value={eachSection.section_id}>
                {eachSection.section_name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group text-start col-md-6 col-lg-2 mt-2">
          <TextInput
            size="lg"
            placeholder="Admission No."
            className="text-danger"
            id="admission-search"
            maxLength={30}
            type="Search"
            onChange={onAdmissionSearched}
            value={searchByAdmissionNumber}
            rightSection={
              searchByAdmissionNumber && searchByAdmissionNumber?.length > 0 ? (
                <IconX
                  size={16}
                  color="red"
                  onClick={() => setSearchByAdmissionNumber("")}
                  style={{ cursor: "pointer" }}
                />
              ) : (
                <IconSearch size={16} />
              )
            }
          />
        </div>

        <div className="form-group text-start col-md-6 col-lg-3 mt-2">
          <TextInput
            size="lg"
            placeholder="Student Name"
            className="text-danger"
            id="name-search"
            maxLength={50}
            type="Search"
            onChange={onNameSearched}
            value={searchByname}
            rightSection={
              searchByname && searchByname?.length > 0 ? (
                <IconX
                  size={16}
                  color="red"
                  onClick={() => setSearchByname("")}
                  style={{ cursor: "pointer" }}
                />
              ) : (
                <IconSearch size={16} />
              )
            }
          />
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
        className={className}
        feesStatus={feesStatus}
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

export default StudentListComponent;
