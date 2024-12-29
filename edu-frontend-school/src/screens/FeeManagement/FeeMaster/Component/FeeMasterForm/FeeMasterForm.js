import React, { useEffect, useState } from "react";
import { NativeSelect, NumberInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconChevronLeft, IconPlus, IconTrash } from "@tabler/icons-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Calendar } from "primereact/calendar";
import * as addFeeMasterService from "../../FeeMaster.service";
import * as addClassService from "../../../../Class/Class.service";
import moment from "moment";
import ToastUtility from "../../../../../utility/ToastUtility";
import { useAuth } from "../../../../../context/AuthContext";

const FeeMasterForm = () => {
  const navigate = useNavigate();
  const [dueDate, setDueDate] = useState(null);
  const [additionalFeeTypes, setAdditionalFeeTypes] = useState([]);
  const [allClasses, setAllClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [selectedFeesId, setSelectedFeesId] = useState(null);
  const [selectedAcademicId, setSelectedAcademicId] = useState(null);
  const [allFeeTypes, setAllFeeTypes] = useState([]);
  const [academicList, setAcademicList] = useState([]);
  const [feesData, setFeesData] = useState({});
  const { userDetails,academicYear } = useAuth();

  const form = useForm({
    initialValues: {
      amount: "",
      fine_amount: "",
    },

    validate: {},
  });

  const { state } = useLocation();

  const onSubmit = async () => {
    if (state?.rowData.fees_master_id) {
      if (
        form.values.amount !== "" &&
        form.values.amount !== 0 &&
        !isNaN(selectedFeesId) &&
        selectedAcademicId != ""
      ) {
        const { amount, fine_amount } = form.values;

        const payload = {
          fees_master_id: state?.rowData.fees_master_id,
          fees_type_id: selectedFeesId,

          amount: amount,
          academic_year_id: parseInt(selectedAcademicId),
          // due_date: dueDate ? moment(dueDate).format("YYYY/MM/DD") : null,
          // fine_amount: fine_amount,
        };
        const updateResponse = await addFeeMasterService.updateFeeMaster(
          payload
        );

        if (!updateResponse.error) {
          ToastUtility.success("Fee master updated Successfully");

          navigate("/feeMaster");
        }
      } else {
        ToastUtility.warning("Please select all mandatory fields");
      }
    } else {
      if (selectedAcademicId) {
        const payload = {
          academic_year_id: parseInt(selectedAcademicId),

          fee_master: additionalFeeTypes,
        };
        const addResponse = await addFeeMasterService.AddFeeMaster(payload);

        if (!addResponse.error) {
          ToastUtility.success("Fee master added Successfully");

          navigate("/feeMaster", {
            state: {
              academic_year_id: selectedAcademicId,
            },
          });
        }
      } else {
        ToastUtility.warning("Please select all mandatory fields");
      }
    }
  };

  const goBackToFeeMasterPage = () => {
    navigate("/feeMaster");
  };

  const addMoreTypes = () => {
    if (
      form.values.amount != "" &&
      selectedFeesId !== "" &&
      selectedAcademicId !== undefined
    ) {
      const selectedFeeType = allFeeTypes.find(
        (fee) => fee.fees_type_id === selectedFeesId
      );

      const newFeeType = {
        // classId: selectedClassId,
        fees_type_id: selectedFeesId,
        fee_type: selectedFeeType?.fees_type,
        amount: form.values.amount,
        // due_date: moment(dueDate).format("YYYY/MM/DD"),
        // fine_amount: form.values.fine_amount,
      };

      setAdditionalFeeTypes([...additionalFeeTypes, newFeeType]);

      form.reset();
      // setDueDate(null);
      setSelectedFeesId(null);
      // setSelectedClassId(null);
      // setSelectedAcademicId(null);
    } else {
      ToastUtility.info("Please select all fields");
    }
  };

  const getAllClassList = async () => {
    const getClassResponse = await addFeeMasterService.getAllClass();
    if (!getClassResponse.error) {
      setAllClasses(getClassResponse.data);
    }
  };

  const getAllFeeType = async () => {
    const getFeeTypeResponse = await addFeeMasterService.getFeeType();
    if (!getFeeTypeResponse.error) {
      setAllFeeTypes(getFeeTypeResponse.data.data);
    }
  };

  useEffect(() => {
    getAllClassList();
    getAllFeeType();
  }, []);

  const getClassId = (e) => {
    const classId = e.target.value;
    setSelectedClassId(parseInt(classId));
  };

  const getFeesTypeId = (e) => {
    const feesId = e.target.value;
    setSelectedFeesId(parseInt(feesId));
  };

  const deleteAddMoreTypes = (id) => {
    const updatedFeeTypes = additionalFeeTypes.filter(
      (type, index) => index !== id
    );
    setAdditionalFeeTypes(updatedFeeTypes);
  };

  const getAcademicList = async () => {
    const getAcademicListResponse = await addClassService.getAcademicList();

    setAcademicList(getAcademicListResponse.data);
  };

  useEffect(() => {
    getAcademicList();
  }, []);

  const getAcademicId = (e) => {
    setSelectedAcademicId(e.target.value);
  };

  const getDataByClassId = async (feesMasterId) => {
    const getFeesByFeesIdResponse = await addFeeMasterService.getFeesByFeesId(
      feesMasterId
    );
    if (!getFeesByFeesIdResponse.error) {
      setFeesData(getFeesByFeesIdResponse.data);
    }
  };

  useEffect(() => {
    if (state?.rowData.fees_master_id) {
      getDataByClassId(state?.rowData.fees_master_id);
    }
  }, []);

  useEffect(() => {
    form.setValues({ ...feesData });
    setSelectedAcademicId(feesData.academic_year_id);
    setSelectedClassId(feesData.class_id);
    setSelectedFeesId(feesData.fees_type_id);

    if (feesData.due_date) {
      const dueDateObject = moment(feesData.due_date).toDate();
      setDueDate(dueDateObject);
    }
  }, [feesData]);

  useEffect(() => {
    getAcademicList();
    setSelectedAcademicId(academicYear);
   
  }, [academicYear]);

  return (
    <div className="container-fluid ">
      <div className="d-flex align-items-center">
        <IconChevronLeft
          size={30}
          onClick={goBackToFeeMasterPage}
          style={{ cursor: "pointer" }}
          color="blue"
        />
        <span
          className="fw-bold "
          style={{ fontSize: "20px", marginLeft: "10px" }}
        >
          {state?.rowData.fees_master_id
            ? "Update Fee Master"
            : "Add Fee Master"}
        </span>
      </div>
      <div className="add-organization-container mx-2">
        <form onSubmit={form.onSubmit(onSubmit)}>
          <div className="row">
            <div className="form-group text-start mb-3 col-lg-3">
              <label className="fw-bold text-secondary mb-1" htmlFor="academic">
                Academic Session *
              </label>
              <br />
              <select
                onChange={getAcademicId}
                size="lg"
                className="normalSelect"
                value={selectedAcademicId}
                id="academic"
                disabled={state?.rowData.fees_master_id}
              >
                <option value="">Select</option>
                {academicList?.map((eachAcademic, index) => (
                  <option key={index} value={eachAcademic.academic_year_id}>
                    {eachAcademic.academic_year_name}
                  </option>
                ))}
              </select>
            </div>
            {/* <div className="form-group text-start mb-3 col-lg-3">
              <label className="fw-bold text-secondary mb-1" htmlFor="class">
                Class *
              </label>
              <br />
              <select
                onChange={getClassId}
                size="lg"
                className="normalSelect"
                value={selectedClassId}
                id="class"
                disabled={state?.rowData.fees_master_id}
              >
                <option value={null}>Select</option>
                {allClasses?.map((eachClass, index) => (
                  <option key={index} value={eachClass.id}>
                    {eachClass.name}
                  </option>
                ))}
              </select>
            </div> */}
          </div>

          <div className="row">
            <div className="form-group text-start mb-3 col-md-4 col-lg-3">
              <label className="fw-bold text-secondary" htmlFor="fee_type">
                Fee Type *
              </label>
              <br />
              <select
                onChange={getFeesTypeId}
                size="lg"
                className="normalSelect"
                value={selectedFeesId || ""}
                id="fee_type"
                disabled={state?.rowData.fees_master_id}
              >
                <option value="">Select</option>
                {allFeeTypes?.map((eachFees, index) => (
                  <option key={index} value={eachFees.fees_type_id}>
                    {eachFees.fees_type}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group text-start mb-3 col-md-4 col-lg-3">
              <label className="fw-bold text-secondary" htmlFor="amount">
                Amount *
              </label>
              <NumberInput
                placeholder="Enter here"
                {...form.getInputProps("amount")}
                className="text-danger mt-1"
                id="amount"
                size="lg"
                hideControls
                maxLength={6}
              />
            </div>
            {/* <div className="form-group text-start mb-3 col-md-4 col-lg-3">
              <label className="fw-bold text-secondary mb-1" htmlFor="due_date">
                Due date *
              </label>
              <Calendar
                placeholder="--Select--"
                value={dueDate}
                onChange={(e) => setDueDate(e.value)}
                showIcon
                dateFormat="dd/mm/yy"
                id="due_date"
                minDate={currentDate}
              />
            </div> */}
            {/* <div
              className="form-group text-start mb-3 col-11  col-md-3 col-lg-2"
              style={{ padding: "0px" }}
            >
              <label className="fw-bold text-secondary" htmlFor="fine">
                Fine amount
              </label>
              <NumberInput
                placeholder="Enter here"
                {...form.getInputProps("fine_amount")}
                className="text-danger mt-1"
                id="fine"
                size="lg"
                hideControls
                maxLength={5}
              />
            </div> */}
            {state?.rowData.fees_master_id ? null : (
              <div
                className="col-1 col-md-1 col-lg-1"
                style={{ outline: "none" }}
              >
                <IconPlus
                  style={{ marginTop: "35px", cursor: "pointer" }}
                  size={30}
                  color="blue"
                  onClick={() => addMoreTypes()}
                />
              </div>
            )}
          </div>

          {additionalFeeTypes?.map((eachType, index) => (
            <div className="row" key={index}>
              <div className="form-group text-start mb-3 col-lg-3">
                <TextInput
                  placeholder="Enter here"
                  value={eachType.fee_type}
                  disabled
                  className="text-danger mt-1"
                  id={`fee_type_${index}`}
                  size="lg"
                />
              </div>
              <div className="form-group text-start mb-3 col-lg-3">
                <TextInput
                  placeholder="Enter here"
                  value={eachType.amount}
                  disabled
                  className="text-danger mt-1"
                  id="amount"
                  size="lg"
                  hideControls
                />
              </div>
              {/* <div className="form-group text-start mb-3 col-lg-3">
                <TextInput
                  placeholder="--Select--"
                  value={eachType.due_date}
                  id="due_date"
                  disabled
                  size="lg"
                  className="mt-1"
                />
              </div>
              <div className="form-group text-start mb-3 col-11 col-lg-2">
                <NumberInput
                  placeholder="Enter here"
                  value={eachType.fine_amount}
                  className="text-danger mt-1"
                  id="fine"
                  size="lg"
                  hideControls
                  disabled
                />
              </div> */}
              <div className="form-group text-start col-1 mb-3 col-lg-1">
                <IconTrash
                  color="red"
                  style={{ marginTop: "15px", cursor: "pointer" }}
                  onClick={() => deleteAddMoreTypes(index)}
                />
              </div>
            </div>
          ))}
          {state?.rowData.fees_master_id ? (
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
              disabled={additionalFeeTypes?.length === 0}
            >
              Save
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default FeeMasterForm;
