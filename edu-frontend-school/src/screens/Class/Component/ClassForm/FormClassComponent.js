import { Checkbox, NativeSelect, NumberInput, TextInput } from "@mantine/core";
import { IconChevronLeft, IconPlus, IconTrash } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { useLocation, useNavigate } from "react-router-dom";
import * as addClassService from "../../Class.service";
import ToastUtility from "../../../../utility/ToastUtility";
import { useAuth } from "../../../../context/AuthContext";
import { Dropdown } from "primereact/dropdown";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";

const FormClassManagement = () => {
  const [projectorValue, setProjectorValue] = useState(null);
  const [classAbbr, setClassAbbr] = useState(null);
  const [sectionID, setSectionID] = useState(null);
  const [classTeacherID, setClassTeacherID] = useState(null);
  const [academicId, setAcademicId] = useState(null);
  const [subjectID, setSubjectID] = useState(null);
  const [teacherID, setTeacherID] = useState(null);

  const [subjectsList, setSubjectsList] = useState([]);
  const [academicList, setacademicList] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [teacherList, setTeacherList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const { userDetails, academicYear } = useAuth();

  const [additionalSubjectTeacher, setAdditionalSubjectTeacher] = useState([]);

  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const [classroomData, setClassroomData] = useState({});

  const navigate = useNavigate();

  const { state } = useLocation();

  const goBackToClassManagementPage = () => {
    navigate("/class");
  };

  const form = useForm({
    initialValues: {
      capacity: "",
      room_no: "",
      floor: "",
      building: "",
    },

    validate: {},
  });

  const addMoreSubjects = () => {
    const selectedSubject = subjectList.find(
      (subject) => subject.subject_id === subjectID
    );

    const selectedTeacher = teacherList.find(
      (teacher) => teacher.user_id === teacherID
    );

    const newSubjectTeacher = {
      subject_name: selectedSubject?.subject_name,
      subject_id: selectedSubject?.subject_id,
      teacher_name: selectedTeacher?.display_name,
      teacher_id: selectedTeacher?.user_id,
    };

    setAdditionalSubjectTeacher([
      ...additionalSubjectTeacher,
      newSubjectTeacher,
    ]);

    setSubjectID(null);
    setTeacherID(null);
  };

  const deleteSubjectTeacher = (id) => {
    const updatedStudentTeacher = additionalSubjectTeacher.filter(
      (type, index) => index !== id
    );
    setAdditionalSubjectTeacher(updatedStudentTeacher);
  };

  const getSection = async () => {
    const getSectionResponse = await addClassService.getSectionList();
    const sectionData = [getSectionResponse.data?.data];
    setSectionList(...sectionData);
  };

  const getClassTeacher = async () => {
    let payload = {
      level: "Faculty",
    };

    const getClassTeacherResponse = await addClassService.getClassTeacherList(
      payload
    );
    const classTeacherData = [getClassTeacherResponse.data?.data];
    setTeacherList(...classTeacherData);
  };

  const getAcademicList = async () => {
    const getAcademicListResponse = await addClassService.getAcademicList();
    const academicData = [getAcademicListResponse?.data];
    setacademicList(...academicData);
  };

  const getSubject = async () => {
    const getSubjectResponse = await addClassService.getSubjectList();
    const subjectData = [getSubjectResponse.data?.data];
    setSubjectList(...subjectData);
  };

  const getClass = async () => {
    const getClassResponse = await addClassService.getClassList();
    const classData = [getClassResponse?.data];
    setClassList(...classData);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getAcademicList();
      setAcademicId(academicYear);
    };
    fetchData();
    getSection();
    getSubject();
    getClass();
    getClassTeacher();
  }, [academicYear]);

  const onSelectClass = (e) => {
    setClassAbbr(e.target.value);
  };

  const onSelectSection = (e) => {
    setSectionID(e.target.value);
  };

  const onSelectClassTeacher = (e) => {
    setClassTeacherID(e.target.value);
  };

  const onSelectAcademic = (e) => {
    setAcademicId(e.target.value);
  };

  const onSelectProjectorAvailability = (e) => {
    setProjectorValue(e.target.value);
  };

  const onSelectSubject = (e) => {
    setSubjectID(e.target.value);
  };

  const onSelectTeacher = (e) => {
    setTeacherID(e.target.value);
  };

  // const onSelectCheckboxes = (e) => {
  //   const selectedSubjectId = parseInt(e.target.value);

  //   setSubjectsList((prevSubjects) => {
  //     const updatedSubjects = [...prevSubjects];

  //     const existingIndex = updatedSubjects.findIndex(
  //       (subject) => subject.subject_id === selectedSubjectId
  //     );

  //     if (existingIndex !== -1) {
  //       updatedSubjects.splice(existingIndex, 1);
  //     } else {
  //       updatedSubjects.push({ subject_id: selectedSubjectId });
  //     }
  //     return updatedSubjects;
  //   });
  // };

  // const onSelectAllCheckboxes = () => {
  //   setSelectAllChecked((prev) => !prev);
  //   if (!selectAllChecked) {
  //     const allSubjectIds = subjectList?.map((subject) => subject.subject_id);
  //     setSubjectsList(allSubjectIds?.map((subject_id) => ({ subject_id })));
  //   } else {
  //     setSubjectsList([]);
  //   }
  // };

  const onSubmit = async () => {
    if (state?.rowData.classroom_id) {
      const { capacity, room_no, floor, building } = form.values;
      const classroomID = state?.rowData.classroom_id;

      const payload = {
        classroom_id: classroomID,
        academic_year_id: academicId,
        class_id: parseInt(classAbbr),
        class_teacher: parseInt(classTeacherID),
        section_id: parseInt(sectionID),
        capacity: capacity,
        room_no: room_no,
        floor: floor,
        building: building,
        projector_available: parseInt(projectorValue),
        subjectList: additionalSubjectTeacher,
      };

      const updateResponse = await addClassService.UpdateClass(payload);
      if (!updateResponse.error) {
        ToastUtility.success("Classroom updated successfully");
        if (updateResponse.data) {
          navigate("/class");
        }
      } else {
        ToastUtility.info("Please add proper Class Room Details");
      }
    } else {
      const { capacity, room_no, floor, building } = form.values;

      const payload = {
        academic_year_id: academicId,
        class_id: parseInt(classAbbr),
        class_teacher: parseInt(classTeacherID),
        section_id: parseInt(sectionID),
        capacity: capacity,
        room_no: room_no,
        floor: floor,
        building: building,
        projector_available: parseInt(projectorValue),
        subjectList: additionalSubjectTeacher,
      };

      if (academicId && classAbbr && sectionID) {
        const addClassResponse = await addClassService.AddClass(payload);
        if (!addClassResponse.error) {
          ToastUtility.success("Classroom added successfully.");
          navigate("/class");
        }
      } else {
        ToastUtility.error("Please select Academic Year, Class and Section");
      }
    }
  };

  const getDataByUserId = async (classroomID) => {
    const getClassroomByClassroomIdResponse =
      await addClassService.getClassroomByClassroomId(classroomID);
    if (!getClassroomByClassroomIdResponse.error) {
      setClassroomData(getClassroomByClassroomIdResponse.data);
      setIsUpdateMode(true);
    } else {
      ToastUtility.error("No data found for this classroom ID!");
    }
  };

  useEffect(() => {
    if (state?.rowData.classroom_id) {
      getDataByUserId(state?.rowData.classroom_id);
    }
  }, []);

  useEffect(() => {
    form.setValues({
      capacity: classroomData.capacity || "",
      room_no: classroomData.room_no || "",
      floor: classroomData.floor || "",
      building: classroomData.building || "",
    });

    setAcademicId(classroomData.academic_year_id || null);
    setClassAbbr(classroomData.class_id || null);
    setSectionID(classroomData.section_id || null);
    setProjectorValue(classroomData.projector_available || null);
    setClassTeacherID(classroomData.class_teacher || null);
    setAdditionalSubjectTeacher(classroomData.subjectList || []);

    // setSubjectsList(classroomData.subjectList || []);
  }, [classroomData]);

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center">
        <IconChevronLeft
          size={30}
          onClick={goBackToClassManagementPage}
          style={{ cursor: "pointer" }}
          color="black"
        />
        <span
          className="fw-bold"
          style={{ fontSize: "20px", marginLeft: "10px" }}
        >
          {state?.rowData ? "Update Class" : "Add Class"}{" "}
        </span>
      </div>
      <div className="add-organization-container mx-2 pt-2">
        <form onSubmit={form.onSubmit(onSubmit)}>
          <div className="row mt-2">
            <div className="form-group text-start mb-3 col-lg-4">
              <label className="fw-bold text-secondary" htmlFor="role-name">
                Academic Year *
              </label>
              <br />
              <select
                className="normalSelect"
                onChange={(e) => onSelectAcademic(e)}
                value={academicId !== null ? academicId : "selectOpion"}
                disabled={isUpdateMode}
              >
                <option value="selectOpion">-Select-</option>
                {academicList?.map((nameClass, index) => (
                  <option key={index} value={nameClass.academic_year_id}>
                    {" "}
                    {nameClass.academic_year_name}{" "}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group text-start mb-3 col-lg-4">
              <label className="fw-bold text-secondary" htmlFor="role-name">
                Class *
              </label>
              <br />
              <select
                className="normalSelect"
                onChange={(e) => onSelectClass(e)}
                value={classAbbr !== null ? classAbbr : "selectOpion"}
                disabled={isUpdateMode}
              >
                <option value="selectOpion">-Select-</option>
                {classList?.map((nameClass, index) => (
                  <option key={index} value={nameClass.id}>
                    {" "}
                    {nameClass.name}{" "}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group text-start mb-3 col-lg-4">
              <label className="fw-bold text-secondary" htmlFor="role-type">
                Section *
              </label>
              <br />
              <select
                className="normalSelect"
                onChange={(e) => onSelectSection(e)}
                value={sectionID !== null ? sectionID : "selectOpion"}
                disabled={isUpdateMode}
              >
                <option value="selectOpion">-Select-</option>
                {sectionList?.map((sections, index) => (
                  <option key={index} value={sections.section_id}>
                    {" "}
                    {sections.section_name}{" "}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group text-start mb-3 col-lg-4">
              <label
                className="fw-bold text-secondary mb-1"
                htmlFor="role-type"
              >
                Assign Class Teacher
              </label>
              <br />
              <select
                className="normalSelect"
                onChange={(e) => onSelectClassTeacher(e)}
                value={classTeacherID !== null ? classTeacherID : "selectOpion"}
              >
                <option value="selectOpion">-Select-</option>
                {teacherList?.map((teacher, index) => (
                  <option key={index} value={teacher.user_id}>
                    {" "}
                    {teacher.display_name}{" "}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group text-start mb-3 col-lg-4">
              <label className="fw-bold text-secondary" htmlFor="mobileNumber">
                Capacity
              </label>
              <NumberInput
                size="lg"
                placeholder="Enter here"
                {...form.getInputProps("capacity")}
                maxLength={5}
                hideControls
                className="text-danger mt-1"
                id="mobileNumber"
              />
            </div>

            <div className="form-group text-start mb-3 col-lg-4">
              <label className="fw-bold text-secondary" htmlFor="mobileNumber">
                Room No.
              </label>
              <TextInput
                size="lg"
                placeholder="Enter here"
                {...form.getInputProps("room_no")}
                hideControls
                className="text-danger mt-1"
                id="mobileNumber"
              />
            </div>

            <div className="form-group text-start mb-3 col-lg-4">
              <label className="fw-bold text-secondary" htmlFor="role-name">
                Floor
              </label>
              <TextInput
                size="lg"
                placeholder="Enter here"
                {...form.getInputProps("floor")}
                className="text-danger mt-1"
                id="role-name"
              />
            </div>

            <div className="form-group text-start mb-3 col-lg-4">
              <label className="fw-bold text-secondary" htmlFor="role-name">
                Building
              </label>
              <TextInput
                size="lg"
                placeholder="Enter here"
                {...form.getInputProps("building")}
                className="text-danger mt-1"
                id="role-name"
              />
            </div>

            <div className="form-group text-start mb-3 col-lg-4">
              <label
                className="fw-bold text-secondary mb-1"
                htmlFor="role-type"
              >
                Projector Available
              </label>
              <br />
              <select
                className="normalSelect"
                onChange={(e) => onSelectProjectorAvailability(e)}
                value={projectorValue !== null ? projectorValue : "selectOpion"}
              >
                <option value="selectOpion">-Select-</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>
          </div>
          <div className="row mt-4">
            <div className="form-group text-start mb-3 col-12">
              <label
                className="fw-bold text-secondary"
                htmlFor="role-description"
              >
                Subject and Teacher
              </label>
            </div>
            <div className="form-group text-start mb-3 col-lg-4 d-flex justify-content-start align-items-center">
              <Dropdown
                className="normalSelect"
                placeholder="Select Subject"
                value={subjectID}
                options={subjectList}
                optionLabel="subject_name"
                optionValue="subject_id"
                onChange={(e) => onSelectSubject(e)}
                filter
                filterPlaceholder="Search Subject"
                filterMatchMode="contains"
              />
            </div>

            <div className="form-group text-start mb-3 col-lg-4 d-flex justify-content-start align-items-center">
              <Dropdown
                className="normalSelect"
                placeholder="Select Teacher"
                value={teacherID}
                options={teacherList}
                optionLabel="display_name"
                optionValue="user_id"
                onChange={(e) => onSelectTeacher(e)}
                filter
                filterPlaceholder="Search Subject"
                filterMatchMode="contains"
              />
            </div>
            {subjectID && teacherID ? (
              <div
                className="col-1 col-md-1 col-lg-1"
                style={{ marginTop: "10px", outline: "none" }}
              >
                <IconPlus
                  style={{ cursor: "pointer" }}
                  size={30}
                  color="blue"
                  onClick={() => addMoreSubjects()}
                />
              </div>
            ) : (
              ""
            )}
          </div>
          {additionalSubjectTeacher?.map((subjectTeacher, index) => (
            <div className="row" key={index}>
              <div className="form-group text-start mb-3 col-lg-4">
                <TextInput
                  placeholder="Enter here"
                  value={subjectTeacher.subject_name}
                  disabled
                  className="text-danger fw-bold mt-1"
                  id={`fee_type_${index}`}
                  size="lg"
                />
              </div>
              <div className="form-group text-start mb-3 col-lg-4">
                <TextInput
                  placeholder="Enter here"
                  value={subjectTeacher.teacher_name}
                  disabled
                  className="text-danger fw-bold mt-1"
                  id={`fee_type_${index}`}
                  size="lg"
                  hideControls
                />
              </div>
              <div className="form-group text-start col-1 mb-3 col-lg-1">
                <IconTrash
                  color="red"
                  style={{ marginTop: "15px", cursor: "pointer" }}
                  onClick={() => deleteSubjectTeacher(index)}
                />
              </div>
            </div>
          ))}

          {/* <div className="row mt-4">
            <div className="form-group text-start mb-3 col-12">
              <label
                className="fw-bold text-secondary"
                htmlFor="role-description"
              >
                Select subject *
              </label>
            </div>
            <div className="form-group text-start mb-5 col-lg-4 d-flex justify-content-start align-items-center">
              <Checkbox
                iconColor="#de5631"
                size="md"
                style={{ marginRight: "1rem" }}
                onChange={onSelectAllCheckboxes}
                checked={selectAllChecked}
              />
              <label className="fw-bold">Select All</label>
            </div>
          </div>
          <div className="row">
            {subjectList?.map((subject) => (
              <div
                key={subject.subject_id}
                className="form-group text-start mb-3 col-lg-4 d-flex justify-content-start align-items-center"
              >
                <Checkbox
                  iconColor="#de5631"
                  size="md"
                  style={{ marginRight: "1rem" }}
                  onChange={(e) => onSelectCheckboxes(e)}
                  value={subject.subject_id}
                  checked={subjectsList.some(
                    (selectedSubject) =>
                      selectedSubject.subject_id === subject.subject_id
                  )}
                />
                <label>{subject.subject_name}</label>
              </div>
            ))}
          </div> */}

          {state?.rowData ? (
            <button
              className="btn add-button mt-3"
              type="submit"
              style={{ color: "#fff" }}
            >
              Update
            </button>
          ) : (
            <button
              className="btn add-button mt-3"
              type="submit"
              style={{ color: "#fff" }}
            >
              Save
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default FormClassManagement;
