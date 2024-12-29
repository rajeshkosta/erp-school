import React, { useEffect, useState } from "react";
import "./ListStudentToSectionAllocation.css";
import CommanGrid from "../../../../shared/components/GridTable/CommanGrid";
import * as addClassService from "../../../Class/Class.service";
import PickGridTable from "../../../../shared/components/PickGridTable/PickGridTable";
import * as addAssignmentService from "../../../Assignment/Assignment.service";
import ToastUtility from "../../../../utility/ToastUtility";
import * as studentSectionService from "../../sectionAllocation.service";
import { Tabs } from "@mantine/core";
import { useAuth } from "../../../../context/AuthContext";
const ListStudentToSectionAllocation = () => {
  const [allocateclassId, setallocateclassId] = useState(null);
  const [allocateacademicId, setAllocateAcademicId] = useState(null);
  const [allocatesectionID, setallocateSectionID] = useState(null);
  const [academicList, setacademicList] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [sectionsearchList, setSectionsearchList] = useState([]);
  const [classGrid, setClassGrid] = useState([]);
  const [academicIdforSearch, setacademicIdforSearch] = useState(null);
  const [classIdforSearch, setclassIdforSearch] = useState(null);
  const [sectionIdforSearch, setsectionIdforSearch] = useState(null);
  const [source, setSource] = useState([]);
  const [target, setTarget] = useState([]);
  const [searchOption, setSeachOption] = useState("admission");
  const [showbutton, setShowButtin] = useState(false);
  const { userDetails, academicYear } = useAuth();

  useEffect(() => {
    getAcademicList();
    setAllocateAcademicId(academicYear);
    if (academicYear) {
      getAllClass(academicYear);
    }
  }, [academicYear]);

  const handleSearchType = (value) => {
    setSeachOption(value);
    setShowButtin(false);
    setacademicIdforSearch("");
    setclassIdforSearch("");
    setSource("");
    setTarget("");
    setsectionIdforSearch("");
  };

  const onChange = (event) => {
    setSource(event.source);
    setTarget(event.target);
  };

  const getAllClass = async (academicId) => {
    if (academicId != "Select Academic year") {
      const payload = {
        academic_year_id: parseInt(academicId),
      };
      const getAllClassResponse = await addAssignmentService.getClassroomList(
        payload
      );
      if (!getAllClassResponse.error) {
        const classData = [getAllClassResponse?.data.data];
        setClassGrid(...classData);
      } else {
        console.error("Error in fetching data");
      }
    }
  };

  const getSection = async (classroomID) => {
    const payload = {
      academic_year_id: parseInt(allocateacademicId),
      class_id: parseInt(classroomID),
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

  const getSectionforSearch = async (classroomID) => {
    const payload = {
      academic_year_id: parseInt(academicIdforSearch),
      class_id: parseInt(classroomID),
    };
    const getAssignmentResponse = await addAssignmentService.getSectionList(
      payload
    );
    const assignmentData = [getAssignmentResponse?.data?.data];

    if (assignmentData[0]?.length === 0) {
      ToastUtility.info("No Section Assigned for Selected Class");
    } else {
      setSectionsearchList(...assignmentData);
    }
  };

  const getAcademicList = async () => {
    const getAcademicListResponse = await addClassService.getAcademicList();
    const academicData = [getAcademicListResponse?.data];
    setacademicList(...academicData);
  };

  const onSelectAcademic = async (e) => {
    setAllocateAcademicId(e.target.value);
    if (allocateclassId) {
      setallocateclassId("");
      setallocateSectionID("");
    }
    if (e.target.value) {
      await getAllClass(e.target.value);
    }
  };

  const onSelectSection = async (e) => {
    setallocateSectionID(e.target.value);
  };

  const onSelectSectionforSearch = async (e) => {
    setsectionIdforSearch(e.target.value);
    setShowButtin(true);
  };
  const onSelectClass = async (e) => {
    setallocateclassId(e.target.value);
    if (allocatesectionID) {
      setallocateSectionID("");
    }
    if (e.target.value) {
      getSection(e.target.value);
    }
  };

  const onSelectAcademictosearch = async (e) => {
    setacademicIdforSearch(e.target.value);
    if (classIdforSearch) {
      setclassIdforSearch("");
      setsectionIdforSearch("");
    }
    if (e.target.value) {
      await getAllClass(e.target.value);
    }
  };

  const onSelectClasstoSearch = async (e) => {
    setclassIdforSearch(e.target.value);
    if (sectionIdforSearch) {
      setsectionIdforSearch("");
    }
    if (
      e.target.value &&
      (searchOption === "class" || searchOption === "reallocation")
    ) {
      getSectionforSearch(e.target.value);
    } else {
      setShowButtin(true);
    }
  };

  const getStudentsForAllocation = async () => {
    const mapGenderIdToString = (genderId) => {
      switch (genderId) {
        case 1:
          return "Male";
        case 2:
          return "Female";
        case 3:
          return "Others";
        default:
          return "Unknown";
      }
    };
    let searchOpt = searchOption == "reallocation" ? "class" : searchOption;
    let payload = {
      search_by: searchOpt,
      academic_year_id: academicIdforSearch,
      class_id: classIdforSearch,
      section_id: sectionIdforSearch,
      allot_year_id: allocateacademicId,
    };

    const responsedata = await studentSectionService.getStudentsForAllocation(
      payload
    );
    const index = 0;
    const arraylist = responsedata?.data?.data;
    const filteredData =
      searchOption == "reallocation"
        ? arraylist
        : arraylist.filter((item) => item.is_alloted == false);
    const studentData = [];
    for (const [idx, item] of filteredData.entries()) {
      const tempdata = {
        student_admission_id: item.student_admission_id,
        student_admission_number: item.student_admission_number,
        first_name: item.first_name,
        gender: mapGenderIdToString(item.gender_id),
        // roll_no : idx +1
      };
      studentData.push(tempdata);
    }
    setSource(studentData);
    // console.log(studentData);
    // const filteredData = arraylist
    // ?.filter(item => item.is_alloted == false) // Filter based on is_alloted condition
    // ?.map(item => ({

    //   student_admission_id: item.student_admission_id,
    //   first_name: item.first_name,
    //   gender: mapGenderIdToString(item.gender_id),
    //   roll_no : 1
    //   }));
    //  setSource(filteredData)
  };

  console.log("allocation");

  const itemTemplate = (item) => {
    return (
      <div className="userItemSection">
        <div className="userInfoSection">
          <div>
            {item.gender == "Male"  ? (item.photo_url ?  <img
                src={item.photo_url}
                alt="maleImage"
                className="userImage"
              /> : (
              <img
                src="./Assets/male.png"
                alt="maleImage"
                className="userImage"
              />
            )) : (item.photo_url ? <img
              src={item.photo_url}
              alt="femaleImage"
              className="userImage"
            /> :(
              <img
                src="./Assets/female.png"
                alt="femaleImage"
                className="userImage"
              />
            ) ) }
          </div>
          {/* <div>
            {item.gender == "Female" && (
              <img
                src="./Assets/female.png"
                alt="Male Image"
                className="userImage"
              />
            )}
          </div> */}

          <div>
            <h1>
              {item.first_name} ({item.gender === "Male" ? "M" : "F"})
            </h1>
            <p className="allocation-sub">
              Admission No. {item.student_admission_number}
            </p>
          </div>
        </div>
        {/* <h6>{item.student_admission_id}</h6> */}
      </div>
    );
  };

  const allocateStudentToSection = async () => {
    let payload = {
      academic_year_id: allocateacademicId,
      classroom_id: allocatesectionID,
      student_list: target,
    };
    let allocateResponse;
    if (searchOption == "reallocation") {
      allocateResponse = await studentSectionService.reallocateStudentToSection(
        payload
      );
    } else {
      allocateResponse = await studentSectionService.allocateStudentToSection(
        payload
      );
    }

    if (!allocateResponse?.error) {
      ToastUtility.success("Students Allocated to Section Succesfully");
      setSource("");
      setTarget("");
      setallocateclassId("");
      setallocateSectionID("");
      setacademicIdforSearch("");
      setclassIdforSearch("");
      setsectionIdforSearch("");
    } else {
      ToastUtility.warning("Please Try again with proper details");
    }
  };

  return (
    <div className="divisionSectionMain">
      <div className="row mb-4" style={{ alignItems: "center" }}>
        <div className="col-md-12 col-lg-4">
          <h1
            className="fw-bold"
            style={{ fontSize: "18px", marginBottom: "0" }}
          >
            Student Allocation
          </h1>
        </div>
        <div className="col-md-12 col-lg-8">
          <div className="row tabsSection search-box-container">
            <div className="col-md-4 pb-3" style={{ textAlign: "center" }}>
              <input
                type="radio"
                value="admission"
                id="admission"
                name="search"
                style={{ marginRight: "5px" }}
                onChange={() => handleSearchType("admission")}
                checked={searchOption === "admission"}
                className="checkedSection"
              />
              <label htmlFor="admission" className="labels">
                New Admission
              </label>
            </div>

            <div className="col-md-4 pb-3" style={{ textAlign: "center" }}>
              <input
                type="radio"
                value="class"
                id="class"
                name="search"
                style={{ marginRight: "5px" }}
                onChange={() => handleSearchType("class")}
                checked={searchOption === "class"}
                className="checkedSection"
              />
              <label htmlFor="class" className="labels">
                Promote
              </label>
            </div>

            <div className="col-md-4 pb-3" style={{ textAlign: "center" }}>
              <input
                type="radio"
                value="reallocation"
                id="reallocation"
                name="search"
                style={{ marginRight: "5px" }}
                onChange={() => handleSearchType("reallocation")}
                checked={searchOption === "reallocation"}
                className="checkedSection"
              />
              <label htmlFor="reallocation" className="labels">
                Re-allocation
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="search-box-container mb-3 p-3">
        <div className="row align-items-center pt-3 divisionSection ">
          <div className="col-md-12 col-lg-3">
            <h1
              className="fw-bold"
              style={{ fontSize: "18px", marginBottom: "0" }}
            >
              Allot Student(s) to
            </h1>
          </div>
          <div className="col-md-4 col-lg-3">
            <div className="form-group text-start mb-3 ">
              <select
                className="normalSelect"
                onChange={(e) => onSelectAcademic(e)}
                value={allocateacademicId}
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
                value={allocateclassId}
              >
                <option>Select Class</option>
                {classGrid?.map((nameClass, index) => (
                  <option key={index} value={nameClass.std_id}>
                    {" "}
                    {nameClass.std_name}{" "}
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
                value={allocatesectionID}
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
        </div>
      </div>
      <div
        className="search-box-container searchSection mb-3 p-3 row"
        style={{ alignItems: "center" }}
      >
        <div className="col-md-3">
          <h1
            className="fw-bold"
            style={{ fontSize: "18px", marginBottom: "0" }}
          >
            Search Student(s) by
          </h1>
        </div>
        {/* <div className="col-md-9"> */}
        {/* <div className="col-md-3 col-lg-3 "> */}
        {/* <span className="fw-bold" style={{ marginRight: "20px" }}>
              Search Student List by
            </span> */}
        {/* <div className="">
              <div className="d-flex  align-items-center curserPointer">
                <input
                  type="radio"
                  value="class"
                  id="class"
                  name="search"
                  style={{ marginRight: "5px" }}
                  onChange={() => handleSearchType("class")}
                  checked={searchOption === "class"}
                  className="checkedSection"
                />
                <label htmlFor="class" className="labels">
                  Existing Student
                </label>
              </div>
              <div className="d-flex align-items-center curserPointer">
                <input
                  type="radio"
                  value="admission"
                  id="admission"
                  name="search"
                  style={{ marginRight: "5px" }}
                  onChange={() => handleSearchType("admission")}
                  checked={searchOption === "admission"}
                  className="checkedSection"
                />
                <label htmlFor="admission" className="labels">
                  New Admission Student
                </label>
              </div>
            </div> */}

        {/* </div> */}

        {/* <div className="row mt-2"> */}
        <div className="col-lg-3">
          {/* <label className="labels">Academic year</label> */}

          <div className="form-group text-start mb-3 ">
            <select
              className="normalSelect"
              onChange={(e) => onSelectAcademictosearch(e)}
              value={academicIdforSearch}
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
        <div className="col-lg-3">
          {/* <label className="labels">Class</label> */}
          <div className="form-group text-start mb-3 ">
            <select
              className="normalSelect"
              onChange={(e) => onSelectClasstoSearch(e)}
              value={classIdforSearch}
            >
              <option>Select Class</option>
              {classGrid?.map((nameClass, index) => (
                <option key={index} value={nameClass.std_id}>
                  {" "}
                  {nameClass.std_name}{" "}
                </option>
              ))}
            </select>
          </div>
        </div>
        {searchOption === "class" || searchOption == "reallocation" ? (
          <>
            <div className="col-lg-3">
              {/* <label className="labels">Section</label> */}
              <div className="form-group text-start mb-3 ">
                <select
                  className="normalSelect"
                  onChange={(e) => onSelectSectionforSearch(e)}
                  value={sectionIdforSearch}
                >
                  <option value="">Select Section</option>
                  {sectionsearchList?.map((section, index) => (
                    <option key={index} value={section.section_id}>
                      {" "}
                      {section.section_name}{" "}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* <div className="col-lg-3">
                  <label className="labels">Student name</label>
                  <div className="form-group text-start mb-3 ">
                    <input
                      type="search"
                      className="normalSelect"
                      placeholder="Search by name"
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <label className="labels">Student code</label>
                  <div className="form-group text-start mb-3 ">
                    <input type="search" className="normalSelect" />
                  </div>
                </div> */}
          </>
        ) : (
          <>
            {/* <div className="col-lg-3">
                  <label className="labels">Student name</label>
                  <div className="form-group text-start mb-3 ">
                    <input
                      type="search"
                      className="normalSelect"
                      placeholder="Search by name"
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <label className="labels">Student code</label>
                  <div className="form-group text-start mb-3 ">
                    <input type="search" className="normalSelect" />
                  </div>
                </div> */}
          </>
        )}
        {showbutton && (
          <div className="col-lg-12">
            {/* <p></p> */}
            <button
              className="btn add-button searchBtn"
              onClick={getStudentsForAllocation}
            >
              Search
            </button>
          </div>
        )}
        {/* </div> */}
        {/* </div> */}
      </div>

      <PickGridTable
        dataKey="student_admission_id"
        source={source}
        target={target}
        filter
        filterBy="first_name"
        onChange={onChange}
        itemTemplate={itemTemplate}
        sourceHeader="Student List"
        targetHeader="Student to be Allocated"
        sourceFilterPlaceholder="Search by name"
        targetFilterPlaceholder="Search by name"
      />
      <div className="d-flex justify-content-end">
        <button
          type="submit"
          className="btn add-button"
          onClick={allocateStudentToSection}
          style={{ color: "#fff" }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};
export default ListStudentToSectionAllocation;
