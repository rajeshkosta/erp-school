import React, { useEffect, useRef, useState } from "react";
import { Stepper, Button, Group } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import { useNavigate, useLocation } from "react-router-dom";
import StudentDetails from "./StudentDetails/StudentDetails";
import AddressDetails from "./AddressDetails/AddressDetails";
import ParentDetails from "./ParentDetails/ParentDetails";
import OtherDetails from "./OtherDetails/OtherDetails";
import AcademicDetails from "./AcademicDetails/AcademicDetails";
import "./FormStudentComponent.css";
import FeeDetails from "./FeeDetails/FeeDetails";
import ToastUtility from "../../../../utility/ToastUtility";
import * as addStudentService from "../../Student.service";
import moment from "moment";

const FormStudentManagement = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [active, setActive] = useState(0);
  const [payLoad, setPayLoad] = useState({});
  const [payment, setPayment] = useState(false);
  const [studentData, setStudentData] = useState({});
  const [studentAdmissionId, setStudentAdmissionId] = useState("");
  const [fileUpload, setFileUpload] = useState(null);
  const [aadharImage, setAadhaarImage] = useState(null);
  const [birthImage, setBirthImage] = useState(null);
  const [fatherImage, setFatherImage] = useState(null);
  const [motherImage, setMotherImage] = useState(null);
  const [tcImage, setTcImage] = useState(null);
  const formData = new FormData();

  const nextStep = () =>
    setActive((current) => (current < 6 ? current + 1 : current));
  const prevStep = () => {
    setActive((current) => (current > 0 ? current - 1 : current));
    setPayLoad({ ...payLoad });
  };

  const goBackToSchoolManagementPage = () => {
    navigate("/student");
  };

  const addStudentRegistration = async () => {
    formData.append("student_data", JSON.stringify(payLoad));
    formData.append("student_photo", fileUpload);
    formData.append("birth_certificate", birthImage);
    formData.append("aadhar_document", aadharImage);
    formData.append("father_photo", fatherImage);
    formData.append("mother_photo", motherImage);
    formData.append("utc_certificate", tcImage);

    const addStudentResponse = await addStudentService.addStudent(formData);
    if (!addStudentResponse.error) {
      ToastUtility.success("Student added successfully");

      navigate("/student");
      // setStudentAdmissionId(
      //   addStudentResponse.data.data[0].student_admission_id
      // );
    } else {
      ToastUtility.warning(addStudentResponse.errorMessage.response.data.error);
      setActive(0);
    }
  };

  const updateStudentRegistration = async () => {
    delete payLoad.student_photo;
    delete payLoad.birth_certificate;
    delete payLoad.aadhar_document;
    delete payLoad.father_photo;
    delete payLoad.mother_photo;
    delete payLoad.utc_certificate;
    formData.append("student_data", JSON.stringify(payLoad));
    formData.append("student_photo", fileUpload);
    formData.append("birth_certificate", birthImage);
    formData.append("aadhar_document", aadharImage);
    formData.append("father_photo", fatherImage);
    formData.append("mother_photo", motherImage);
    formData.append("utc_certificate", tcImage);
    const updateStudentResponse = await addStudentService.updateStudent(
      formData
    );
    if (!updateStudentResponse.error) {
      ToastUtility.success("Student updated successfully");

      navigate("/student");
    } else {
      ToastUtility.error(
        updateStudentResponse.errorMessage.response.data.error
      );
      setActive(0);
    }
  };

  const getDataByStudentAdmissionId = async (studentId) => {
    const getStudentByStudentIdResponse =
      await addStudentService.getStudentByStudentId(studentId);
    if (!getStudentByStudentIdResponse.error) {
      setStudentData(getStudentByStudentIdResponse.data);
    } else {
    }
  };

  useEffect(() => {
    if (state?.rowData.student_admission_id) {
      getDataByStudentAdmissionId(state?.rowData.student_admission_id);
    }
  }, []);

  useEffect(() => {
    if (active === 5) {
      if (state?.rowData?.student_admission_id) {
        updateStudentRegistration();
      } else {
        addStudentRegistration();
      }
    }
  }, [active]);

  useEffect(() => {
    // form.setValues(studentData);
    setPayLoad(studentData);
  }, [studentData]);

  return (
    <div>
      <div className="container-fluid ">
        <div className="d-flex align-items-center">
          <IconChevronLeft
            size={30}
            onClick={goBackToSchoolManagementPage}
            style={{ cursor: "pointer" }}
            color="blue"
          />
          <span
            className="fw-bold "
            style={{ fontSize: "20px", marginLeft: "10px" }}
          >
            {state?.rowData.student_admission_id
              ? "Update Student"
              : "Add Student"}
          </span>
        </div>

        <div className="add-organization-container mx-2">
          <Stepper
            active={active}
            onStepClick={state?.rowData.student_admission_id ? setActive : null}
          >
            <Stepper.Step label="Student Details">
              <StudentDetails
                active={active}
                nextStep={nextStep}
                prevStep={prevStep}
                setPayLoad={setPayLoad}
                payLoad={payLoad}
                studentData={studentData}
                formData={formData}
                fileUpload={fileUpload}
                setFileUpload={setFileUpload}
                aadharImage={aadharImage}
                setAadhaarImage={setAadhaarImage}
                birthImage={birthImage}
                setBirthImage={setBirthImage}
              />
            </Stepper.Step>
            <Stepper.Step label="Parent Details">
              <ParentDetails
                active={active}
                nextStep={nextStep}
                prevStep={prevStep}
                setPayLoad={setPayLoad}
                payLoad={payLoad}
                studentData={studentData}
                formData={formData}
                fatherImage={fatherImage}
                setFatherImage={setFatherImage}
                motherImage={motherImage}
                setMotherImage={setMotherImage}
              />
            </Stepper.Step>
            <Stepper.Step label="Address Details">
              <AddressDetails
                active={active}
                nextStep={nextStep}
                prevStep={prevStep}
                setPayLoad={setPayLoad}
                payLoad={payLoad}
                studentData={studentData}
              />
            </Stepper.Step>

            <Stepper.Step label="Other Details">
              <OtherDetails
                active={active}
                nextStep={nextStep}
                prevStep={prevStep}
                setPayLoad={setPayLoad}
                payLoad={payLoad}
                tcImage={tcImage}
                setTcImage={setTcImage}
              />
            </Stepper.Step>
            <Stepper.Step label="Admission Details">
              <AcademicDetails
                active={active}
                nextStep={nextStep}
                prevStep={prevStep}
                setPayLoad={setPayLoad}
                payLoad={payLoad}
              />
            </Stepper.Step>
            {/* <Stepper.Step label="Fees Configuration">
              <FeeDetails
                active={active}
                nextStep={nextStep}
                prevStep={prevStep}
                setPayment={setPayment}
                // addStudentRegistration={addStudentRegistration}
                // updateStudentRegistration={updateStudentRegistration}
                // studentData={state?.rowData}
                studentAdmissionId={studentAdmissionId}
                payLoad={payLoad}
              />
            </Stepper.Step> */}
            {/* <Stepper.Completed>
              Completed, click back button to get to previous step
            </Stepper.Completed> */}
          </Stepper>
        </div>
      </div>
    </div>
  );
};

export default FormStudentManagement;
