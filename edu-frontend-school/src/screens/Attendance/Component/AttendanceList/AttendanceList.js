import { Calendar } from "primereact/calendar";
import React, { useEffect, useState } from "react";
import "./AttendanceList.css";
import CommanGrid from "../../../../shared/components/GridTable/CommanGrid";
import * as addClassService from "../../../Class/Class.service";
import * as addAssignmentService from "../../../Assignment/Assignment.service";
import * as addAttendanceService from "../../Attendance.service";
import ToastUtility from "../../../../utility/ToastUtility";
import moment from "moment";
import { CiStreamOn } from "react-icons/ci";
import { attendanceList } from "../../../../Const/Constant";
import { useAuth } from "../../../../context/AuthContext";
import { Tooltip } from "@mantine/core";

const AttendanceList = () => {
  const defaultDate = new Date();
  const [classGrid, setClassGrid] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [academicId, setAcademicId] = useState("");
  const [date, setDate] = useState(defaultDate);
  const [academicList, setacademicList] = useState([]);
  const [allocateclassId, setallocateclassId] = useState(null);
  const [allocatesectionID, setallocateSectionID] = useState(null);
  const [studentsList, setStudentsList] = useState([]);
  const [liveButton, ShowLiveButton] = useState(false);
  const [attendanceStatusList, setAttendanceStatusList] = useState({});
  const [attendanceFormat, setAttendanceFormat] = useState({});
  const [allStudentsAttendanceStatus, setAllStudentsAttendanceStatus] =
    useState(0);
  const [count, setCount] = useState(0);
  const { userDetails, academicYear } = useAuth();
  const gridColumns = [
    {
      field: "roll_no",
      header: "Roll no.",
      width: "12%",
      sortable: false,
    },
    { field: "first_name", header: "Name", width: "18%", sortable: false },
    {

      field: "father_name",
      header: "Father's Name",
      width: "17%",
      sortable: false,
    },
  
    // {
    //   field: "attendance",
    //   header: "Attendance",
    //   width: "45%",
    //   sortable: false,
    // },
    // { field: "note", header: "Note", width: "18%", sortable: false },
  ];

  const gridData = [...studentsList];

  useEffect(() => {
    const studentAttendanceStatus = getAllAttendanceList();
    const allStudentsHavingSameStatus = studentAttendanceStatus.every(
      (student, index, array) =>
        student.attendance_status === array[0].attendance_status
    );

    if (allStudentsHavingSameStatus) {
      setAllStudentsAttendanceStatus(
        studentAttendanceStatus[0]?.attendance_status
      );
    } else {
      setAllStudentsAttendanceStatus(0);
    }
  }, [attendanceStatusList]);

  const getAcademicList = async () => {
    const getAcademicListResponse = await addClassService.getAcademicList();
    const academicData = [getAcademicListResponse?.data];
    setacademicList(...academicData);
  };

  const getAllClass = async (academicId) => {
    const getAllClassResponse = await addClassService.getClassList();
    if (!getAllClassResponse.error) {
      const classData = [getAllClassResponse?.data];
      setClassGrid(...classData);
    }
  };

  const onSelectClass = async (value) => {
    setallocateclassId(value);
    if (allocatesectionID) {
      setallocateSectionID("");
    }
    if (value) {
      getSection(value);
    }
  };

  const onSelectSection = async (value) => {
    setallocateSectionID(value);
  };

  const getSection = async (classroomID) => {
    const payload = {
      academic_year_id: parseInt(academicId),
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

  useEffect(() => {
    getAcademicList();
    setAcademicId(academicYear);
    if (academicYear) {
      getAllClass(academicYear);
    }
  }, [academicYear]);

  const getAllStudentsListOfClass = async () => {
    const payload = {
      classroom_id: parseInt(allocatesectionID),
      attendance_date: moment(date).format("YYYY-MM-DD"),
    };
    const getAllStudentsListOfClassResponse =
      await addAttendanceService.getStudentListOfClass(payload);
    const studentsListData = getAllStudentsListOfClassResponse?.data?.data;
    setCount(getAllStudentsListOfClassResponse?.data?.count);
    if (studentsListData) {
      ShowLiveButton(true);
      setStudentsList(studentsListData?.data);
      studentsListData.data.forEach((element, index) => {
        setAttendanceStatusList((prevStatus) => ({
          ...prevStatus,
          [element.student_id]: {
            student_id: element.student_id,
            attendance_status: element.attendance_status,
            remarks: element.remarks,
          },
        }));
      });
    }
    if (studentsListData?.data.length === 0) {
      ShowLiveButton(false);
      ToastUtility.warning("No Student allocated for this section.");
    }
  };

  const saveAttendance = async () => {
    const payload = {
      classroom_id: parseInt(allocatesectionID),
      attendance_date: moment(date).format("YYYY-MM-DD"),
      student_list: getAllAttendanceList(),
    };

    const attendanceClassResponse =
      await addAttendanceService.addStudentClassAttendance(payload);
    if (!attendanceClassResponse.error) {
      ToastUtility.success("Marked Attendance Successfully!");
      getAllStudentsListOfClass();
    }
  };

  useEffect(() => {
    if (academicId && allocateclassId && allocatesectionID && date)
      getAllStudentsListOfClass();
  }, [academicId, allocateclassId, allocatesectionID, date]);

  const onSelectAcademic = async (value) => {
    setAcademicId(value);
    if (allocateclassId) {
      setallocateclassId("");
      setallocateSectionID("");
    }
    if (value) {
      await getAllClass(value);
    }
  };

  const handleAttendanceChange = (studentId, status, attendanceStatus) => {
    const allAttendanceStatus = getAllAttendanceList();
    if (status === "markAll") {
      const markAllStatus = getSelectedMarkAllStatus(attendanceStatus);
      setAttendanceStatusList((prevStatus) => {
        const updatedStatusList = {};
        gridData.forEach((rowData) => {
          const { student_id } = rowData;
          updatedStatusList[student_id] = {
            student_id: student_id,
            attendance_status: markAllStatus,
            // remarks: "",
            remarks: prevStatus[student_id]?.remarks || "",
          };
        });
        return { ...prevStatus, ...updatedStatusList };
      });
    } else {
      setAttendanceStatusList((prevStatus) => ({
        ...prevStatus,
        [studentId]: {
          student_id: studentId,
          attendance_status: status,
          // remarks: "",
          remarks: prevStatus[studentId]?.remarks || "",
        },
      }));
    }
    // setAttendanceStatusList((prevStatus) => ({
    //   ...prevStatus,
    //   [studentId]: { status, remarks: "" }, // You can add remarks if needed
    // }));
  };

  const getAllAttendanceList = () => {
    const allAttendanceList = Object.entries(attendanceStatusList).map(
      ([studentId, { attendance_status, remarks }]) => ({
        student_id: parseInt(studentId),
        attendance_status: attendance_status,
        remarks: remarks,
      })
    );

    return allAttendanceList;
  };

  useEffect(() => {
    getAllAttendanceList();
  }, [attendanceStatusList]);

  const getSelectedMarkAllStatus = (attendanceStatus) => {
    switch (attendanceStatus) {
      case "Present":
        return 1;
      case "Absent":
        return 2;

      case "Halfday":
        return 3;

      case "Holiday":
        return 4;
      default:
        break;
    }
  };

  // const formattedAttendance = {
  //   Present: [],
  //   Absent: [],

  //   Halfday: [],
  //   Holiday: [],
  // };

  // Object.entries(attendanceStatusList).forEach(
  //   ([studentId, { status, remarks }]) => {
  //     const entry = { student_id: studentId, remarks };
  //     formattedAttendance[status]?.push(entry);
  //   }
  // );

  // console.log(formattedAttendance);

  const attendanceStatus = (rowData) => {
    const { student_id, attendance_status } = rowData;

    return (
      <div className="d-flex align-items-center justify-content-between">
        {attendanceList.map((attendance) => (
          <div
            className="d-flex align-items-center"
            key={attendance.attendance_status}
          >
            <input
              name={`attendance-${student_id}`}
              type="radio"
              id={attendance.attendance_name}
              onChange={() =>
                handleAttendanceChange(
                  student_id,
                  attendance.attendance_status,
                  null
                )
              }
              checked={
                attendanceStatusList[student_id]?.attendance_status ===
                attendance.attendance_status
              }
            />
            <label
              htmlFor={attendance.attendance_name}
              style={{ marginLeft: "5px" }}
            >
              {attendance.attendance_name}
            </label>
          </div>
        ))}
      </div>
    );
  };

  const remarkStatus = (rowData) => {
    const studentId = rowData.student_id;

    // const handleRemarkChange = (event) => {
    //   const remarks = event.target.value;
    //   setAttendanceStatusList((prevStatus) => ({
    //     ...prevStatus,
    //     [studentId]: {
    //       status: prevStatus[studentId]?.status || "",
    //       remarks: remarks,
    //     },
    //   }));
    // };

    const handleRemarkChange = (event) => {
      const remarks = event.target.value;
      const currentDate = moment(date).format("YYYY-MM-DD");
      setAttendanceStatusList((prevStatus) => ({
        ...prevStatus,
        [studentId]: {
          student_id: studentId,
          attendance_status: prevStatus[studentId]?.attendance_status || "",
          remarks: remarks,
        },

        // ...prevStatus,
        // [studentId]: {
        //   ...prevStatus[studentId],
        //   [currentDate]: {
        //     attendance_status:
        //       prevStatus[studentId]?.[currentDate]?.attendance_status || "",
        //     remarks: remarks,
        //   },
        // },
      }));
    };

    return (
      <input
        type="text"
        onChange={handleRemarkChange}
        value={attendanceStatusList[studentId]?.remarks || ""}
      />
    );
  };

  return (
    <div className="container-fluid  mb-3">
      <div className="row mt-2">
        <div className="col-md-12 col-lg-3 mt-2">
          <span
            className="fw-bold"
            style={{ fontSize: "20px", marginRight: "20px" }}
          >
            Class Room
          </span>
          {/* {liveButton && (
            <Tooltip
              label="Go live"
              color="#DB3525"
              arrowSize={6}
              withArrow
              position="right"
            >
              <a href="https://link.aieze.in/home" target="_blank">
                <CiStreamOn size={30} color="red" />
              </a>
            </Tooltip>
          )} */}
        </div>
        <div className="col-md-6 col-lg-3 mb-2">
          <select
            className="normalSelect"
            onChange={(e) => onSelectAcademic(e.target.value)}
            value={academicId}
          >
            <option value=""> Select Academic year</option>
            {academicList?.map((academic, index) => (
              <option key={index} value={academic.academic_year_id}>
                {academic.academic_year_name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6 col-lg-2 mb-2">
          <select
            className="normalSelect"
            onChange={(e) => onSelectClass(e.target.value)}
            value={allocateclassId}
          >
            <option value=""> Select Class</option>
            {classGrid?.map((nameClass, index) => (
              <option key={index} value={nameClass.id}>
                {nameClass.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6 col-lg-2 mb-2">
          <select
            className="normalSelect"
            onChange={(e) => onSelectSection(e.target.value)}
            value={allocatesectionID}
          >
            <option value="">Select Section</option>
            {sectionList?.map((section, index) => (
              <option key={index} value={section.classroom_id}>
                {section.section_name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6 col-lg-2">
          <Calendar
            placeholder="Date"
            value={date}
            onChange={(e) => setDate(e.value)}
            showIcon
            dateFormat="dd/mm/yy"
            id="due_date"
            maxDate={defaultDate}
            className="normalSelect"
            style={{ border: "none" }}
          />
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-12 ">
          <CommanGrid
            columns={gridColumns}
            data={gridData}
            attendanceStatus={attendanceStatus}
            remarkStatus={remarkStatus}
            // paginator
            // status={status}
            // actionButton={actionButton}
            rows={count}
            // rowsPerPageOptions={[10, 20, 30]}
            // paginatorTemplate=" PrevPageLink PageLinks NextPageLink  CurrentPageReport RowsPerPageDropdown"
            // currentPageReportTemplate="Showing {first} to {last} of {totalRecords} "
          />
          <div className="row mt-2">
            <div className="col-12 ">
              <div className="attendence-left-container p-3">
                <div
                  className="d-flex align-items-center justify-content-between"
                  style={{ fontSize: "14px", color: "grey", fontWeight: "500" }}
                >
                  <div className="d-flex align-items-center markAsAllSection">
                    <span className="fw-bold" style={{ marginRight: "15px" }}>
                      Mark as all
                    </span>

                    {attendanceList.map((attendance) => (
                      <div
                        className="d-flex align-items-center"
                        key={attendance.attendance_status}
                        style={{ marginRight: "10px" }}
                      >
                        <input
                          name={attendance}
                          type="radio"
                          id={attendance.attendance_name}
                          onChange={() =>
                            handleAttendanceChange(
                              null,
                              "markAll",
                              attendance.attendance_name
                            )
                          }
                          checked={
                            attendance.attendance_status ===
                            allStudentsAttendanceStatus
                          }
                        />
                        <label
                          htmlFor={attendance.attendance_status}
                          style={{ marginLeft: "5px" }}
                        >
                          {attendance.attendance_name}
                        </label>
                      </div>
                    ))}
                  </div>

                  <button
                    className="btn add-button p-2"
                    style={{ color: "#fff" }}
                    type="button"
                    onClick={() => saveAttendance()}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceList;
