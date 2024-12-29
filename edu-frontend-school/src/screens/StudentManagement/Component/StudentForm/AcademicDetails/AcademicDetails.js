import {
  Group,
  NativeSelect,
  NumberInput,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import moment from "moment";
import { Calendar } from "primereact/calendar";
import React, { useEffect, useState } from "react";
import * as addClassService from "../../../../Class/Class.service";
import * as academicService from "../../../Student.service";
import CustomModal from "../../../../../shared/components/CustomModal/CustomModal";
import ImageUploader from "../../../../../shared/components/ImageUploader/ImageUploader";
import { IconCloudUpload, IconEye } from "@tabler/icons-react";
import { useAuth } from "../../../../../context/AuthContext";

const AcademicDetails = ({
  prevStep,
  nextStep,
  active,
  setPayLoad,
  payLoad,
}) => {
  const { academicYear } = useAuth();
  const [admissionDate, setAdmissionDate] = useState(null);
  const [classAbbr, setClassAbbr] = useState(null);
  const [academicId, setAcademicId] = useState(null);
  const [academicList, setacademicList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [sectionID, setSectionID] = useState(null);
  const [subjectList, setSubjectList] = useState([]);
  const [list, setAlllist] = useState([]);
  const [sectionsListData, setSectionListData] = useState([]);

  const form = useForm({
    initialValues: {
      class_name: "",
    },
  });

  const getClass = async () => {
    const getClassResponse = await addClassService.getClassList();
    const classData = [getClassResponse?.data];
    setClassList(...classData);
  };
  const currentDate = new Date();
  const getAcademicList = async () => {
    const getAcademicListResponse = await addClassService.getAcademicList();
    const academicData = [getAcademicListResponse?.data];
    setacademicList(...academicData);
  };

  const getSectionList = async () => {
    const getSectionListResponse = await addClassService.getSectionList();

    setSectionListData(getSectionListResponse.data.data);
  };

  const onSelectClass = (e) => {
    if (sectionList) {
      setSectionID(null);
      setSubjectList(null);
    }
    setClassAbbr(e.target.value);
    //  getSectionAndSubjectDetails(e.target.value);
  };

  const onSelectAcademic = (e) => {
    setAcademicId(e.target.value);
    if (classAbbr != null) {
      setClassAbbr(null);
      setSectionID(null);
      // setSubjectList(null);
      //getSectionAndSubjectDetails(classAbbr);
    }
  };
  // const onSelectSection = (e) => {
  //   setSectionID(e.target.value);
  //   const currentAcademicYear = list?.find(
  //     (obj) => obj.section_id == e.target.value
  //   );
  //   setSubjectList(currentAcademicYear?.subjects);
  // };

  // const getSectionAndSubjectDetails = async (class_id) => {
  //   if (class_id && academicId) {
  //     let payLoad = {
  //       class_id: class_id,
  //       academic_year_id: academicId,
  //     };
  //     const getSectionAndSubjectResponse =
  //       await academicService.getSectionAndSubjectByClassID(payLoad);
  //     const sectionData = [getSectionAndSubjectResponse.data];
  //     setAlllist(getSectionAndSubjectResponse.data);
  //     const subjectData = [getSectionAndSubjectResponse.data?.subjects];
  //     setSectionList(...sectionData);
  //   }
  // };

  useEffect(() => {
    setAcademicId(academicYear);
  }, [academicYear]);

  const onSubmit = () => {
    setPayLoad((prevData) => ({
      ...prevData,
      ...form.values,
      admission_date: moment(admissionDate).format("YYYY-MM-DD"),
      class_id: classAbbr,
      // section_id: sectionID,
      academic_session: academicId,
    }));

    nextStep();
  };

  useEffect(() => {
    getClass();
    getAcademicList();
    //getSectionList();
    form.setValues({ ...payLoad });
    if (payLoad?.admission_date) {
      const dateAdmissionObject = moment(payLoad?.admission_date).toDate();
      setAdmissionDate(dateAdmissionObject);
    }
    setSectionID(payLoad?.section_id);
    setClassAbbr(payLoad?.class_id);
    setAcademicId(payLoad?.academic_session);
  }, [payLoad]);

  // const handleUploadedTcImage = (e) => {
  //   handleTcImageUploader();
  // };

  // const handleTcImageUploader = () => {
  //   setTcImageUploader(!tcImageUploader);
  // };

  // const handleDownLoad = (fileName) => {
  //   const downLoadLink = document.createElement("a");
  //   downLoadLink.href = `/download/${fileName}`;
  //   downLoadLink.setAttribute("download", fileName);
  //   document.body.appendChild(downLoadLink); // required for
  //   downLoadLink.click();
  //   document.body.removeChild(downLoadLink);
  // };

  return (
    <div>
      <div className="container-fluid ">
        <div className="add-organization-container student-details mt-4">
          <span className="student-details-label">Admission Details</span>
          <div className="student-details-sub-container">
            <form onSubmit={form.onSubmit(onSubmit)} className="mt-3">
              <div className="row mt-3 student-registration-container">
                <div className="form-group text-start mb-3 col-lg-4">
                  <label className="fw-bold text-secondary" htmlFor="role-name">
                    Academic Year 
                  </label>
                  <br />
                  <select
                    className="normalSelect"
                    onChange={(e) => onSelectAcademic(e)}
                    value={academicId}
                    disabled={payLoad && payLoad?.student_admission_id}
                  >
                    <option value="selectOpion">-Select Academic Year-</option>
                    {academicList?.map((nameClass, index) => (
                      <option key={index} value={nameClass.academic_year_id}>
                        {" "}
                        {nameClass.academic_year_name}{" "}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group text-start mb-3 col-lg-4">
                  <label
                    className="fw-bold text-secondary"
                    htmlFor="admission_date"
                  >
                    Admission Date *
                  </label>
                  <Calendar
                    placeholder="Admission date"
                    value={admissionDate}
                    onChange={(e) => setAdmissionDate(e.value)}
                    showIcon
                    maxDate={currentDate}
                    dateFormat="dd/mm/yy"
                    required
                    
                    id="admission_date"
                    disabled={payLoad && payLoad?.student_admission_id}
                  />
                </div>

                {/* 
                <div className="form-group text-start mb-3 col-lg-4">
                  <label
                    className="fw-bold text-secondary"
                    htmlFor="board_type"
                  >
                    Board Type *
                  </label>
                  <NativeSelect
                    size="lg"
                    placeholder="Select"
                    {...form.getInputProps("board_type")}
                    // required
                    data={["Select", "Autonomus", "Government"]}
                    id="board_type"
                  />
                </div>

               */}

                <div className="form-group text-start mb-3 col-lg-4">
                  <label className="fw-bold text-secondary" htmlFor="role-name">
                    Class Name 
                  </label>
                  <br />
                  <select
                    className="normalSelect"
                    onChange={(e) => onSelectClass(e)}
                    value={classAbbr}
                  >
                    <option value="selectOpion">-Select Class Name-</option>
                    {classList?.map((nameClass, index) => (
                      <option key={index} value={nameClass.id}>
                        {" "}
                        {nameClass.name}{" "}
                      </option>
                    ))}
                  </select>
                </div>

                {/* <div className="form-group text-start mb-3 col-lg-4">
                  <label
                    className="fw-bold text-secondary mb-1"
                    htmlFor="role-type"
                  >
                    Section *
                  </label>
                  <br />
                  <select
                    className="normalSelect"
                    onChange={(e) => onSelectSection(e)}
                    value={sectionID}
                  >
                    <option value="selectOpion">-Select Section-</option>
                    {sectionsListData.map((sections, index) => (
                      <option key={index} value={sections.section_id}>
                        {" "}
                        {sections.section_name}{" "}
                      </option>
                    ))}
                  </select>
                </div> */}
              </div>
              {/* {subjectList && subjectList.length > 0 && (
                <div className="row mt-3 student-registration-container">
                  <span>List of Subject in Selected Class</span>
                  {subjectList}
                </div>
              )} */}
             <Group justify="center" className="mt-3">
                {active < 1 ? null : (
                  <button
                    type="button"
                    className="btn prev-button"
                    onClick={prevStep}
                  >
                    Previous
                  </button>
                )}
                <button
                  type="submit"
                  className="btn add-button"
                  style={{ color: "#fff" }}
                >
                  Save
                </button>
              </Group>
              
            </form>
            
          </div>
          
        </div>
      </div>
  
    </div>
    
    
  );
  
};

export default AcademicDetails;
