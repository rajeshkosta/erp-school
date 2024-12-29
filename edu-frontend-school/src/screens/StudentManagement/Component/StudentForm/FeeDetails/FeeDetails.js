import React, { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import {
  Checkbox,
  Group,
  NativeSelect,
  NumberInput,
  TextInput,
} from "@mantine/core";
import "./FeeDetails.css";
import { IconCurrencyRupee, IconInfoCircleFilled } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";

import * as addFeeMasterService from "../../../../FeeManagement/FeeMaster/FeeMaster.service";
import ToastUtility from "../../../../../utility/ToastUtility";
import * as addStudentService from "../../../Student.service";
import { useNavigate } from "react-router-dom";

const FeeDetails = ({
  stateData,
  setFeesDetailsCard,
  setShowBalanceCard,
  // setConfigId,
  feesHistoryCard,
  feesConfigurationData,
  showBalanceCard,
  allTransactionData,
}) => {
  const [discountType, setDiscountType] = useState("no");
  const [errorMsg, setErrorMsg] = useState(false);

  const [totalFees, setTotalFees] = useState(0);
  const [allFeesTypes, setAllFeesTypes] = useState([]);
  const [feesDatailsList, setFeesDetailsList] = useState([]);
  const [showAllFeesList, setShowAllFeesList] = useState([]);
  const [showAllFeesDetailsList, setShowAllFeesDetailsList] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    setTotalFees();
  }, []);

  const form = useForm({
    initialValues: {
      discount_amount: 0,
      discount_note: "",
    },

    // validate: {
    //   prev_school: (value) => (value.length < 3 ? "Please fill " : null),

    //   board: (value) => (value.length < 3 ? "Please fill " : null),

    //   year: (value) =>
    //     value.toString().length < 4 ? "Please enter year" : null,
    //   pincode: (value) =>
    //     value.toString().length !== 6 ? "Enter correct pincode" : null,
    // },
  });

  // const onSubmit = () => {
  //   nextStep();
  // };

  const getAllFeesConfigurationByConfigurationId = async () => {
    const payload = {
      academic_year_id: stateData?.academic_year_id,
      student_admission_id: stateData?.student_admission_id,
    };

    const getFeesConfigurationByConfigurationIdResponse =
      await addStudentService.getFeesConfigurationByConfigurationId(payload);
    if (!getFeesConfigurationByConfigurationIdResponse.error) {
      const dataToSpread =
        getFeesConfigurationByConfigurationIdResponse?.data?.data;
      setFeesDetailsList(dataToSpread);
    }
  };

  useEffect(() => {
    getAllFeesConfigurationByConfigurationId();
  }, []);

  const calculateTotalAmount = () => {
    let total = 0;
    allFeesTypes.forEach((feeType) => {
      if (feeType.checked) {
        total = total + parseFloat(feeType.amount || 0);
      }
    });
    setTotalFees(total);
  };

  useEffect(() => {
    calculateTotalAmount();
  }, [allFeesTypes]);

  const handleAmountChange = (index, newValue) => {
    const updatedFeesData = [...allFeesTypes];
    updatedFeesData[index].amount = newValue;
    setAllFeesTypes(updatedFeesData);
  };

  const handleCheckboxChange = (index) => {
    const updatedFeesData = [...allFeesTypes];
    updatedFeesData[index].checked = !updatedFeesData[index].checked;
    setAllFeesTypes(updatedFeesData);
  };

  const getFeesTypeByClassId = async () => {
    const payload = {
      class_id: stateData?.std_id_admission,
      academic_year_id: stateData?.academic_year_id,
    };

    const getFeesTypeResponse =
      await addFeeMasterService.getAllClassByClassIdGrid(payload);
    if (!getFeesTypeResponse.error) {
      const initialFeesData = getFeesTypeResponse?.data?.data?.map(
        (feeType) => ({
          ...feeType,
          checked: feesDatailsList?.some((detail) =>
            detail?.fees_list?.find(
              (eachFees) => eachFees.fees_master_id === feeType?.fees_master_id
            )
          ),
        })
      );
      if (initialFeesData?.length === 0) {
        ToastUtility.info(
          "No fees type found for this Class and Academic Year"
        );
      }
      setAllFeesTypes(initialFeesData);
    }
  };

  useEffect(() => {
    getFeesTypeByClassId();
  }, [feesDatailsList]);

  const onSubmit = async () => {
    if (feesDatailsList) {
      if (feesDatailsList[0]?.fees_config_id) {
        const { discount_amount, discount_note } = form.values;
        const filteredFeesList = allFeesTypes?.filter(
          (feeType) => feeType.checked
        );
        const feesListPayload = filteredFeesList?.map(
          ({ fees_master_id, amount }) => ({
            fees_master_id,
            amount,
          })
        );
        if (discount_amount <= totalFees) {
          const payload = {
            academic_year_id: parseInt(stateData?.academic_year_id),
            class_id: parseInt(stateData?.std_id),
            student_admission_id: stateData?.student_admission_id,
            total_amount: totalFees,
            is_discount: discountType === "yes" ? 2 : 1,
            discount_amount: discount_amount,
            discount_note: discount_note,
            fees_list: feesListPayload,
            fees_config_id: feesDatailsList[0]?.fees_config_id,
          };

          const updateFeeConfigurationResponse =
            await addStudentService.updateFeesConfiguration(payload);
          if (!updateFeeConfigurationResponse.error) {
            setFeesDetailsCard(true);
            setShowBalanceCard(false);
          }
        } else {
          ToastUtility.warning(
            "Discount amount should not be more than total amount"
          );
        }
      }
    } else {
      const { discount_amount, discount_note } = form.values;
      const filteredFeesList = allFeesTypes.filter(
        (feeType) => feeType.checked
      );
      const feesListPayload = filteredFeesList?.map(
        ({ fees_master_id, amount }) => ({
          fees_master_id,
          amount,
        })
      );
      if (discount_amount <= totalFees) {
        setErrorMsg(false);
        const payload = {
          academic_year_id: parseInt(stateData?.academic_year_id),
          class_id: parseInt(stateData?.std_id),
          student_admission_id: stateData?.student_admission_id,
          total_amount: totalFees,
          is_discount: discountType === "yes" ? 2 : 1,
          discount_amount: discount_amount,
          discount_note: discount_note,
          fees_list: feesListPayload,
        };

        const saveFeeConfigurationResponse =
          await addStudentService.saveFeesConfiguration(payload);
        if (!saveFeeConfigurationResponse.error) {
          setFeesDetailsCard(true);
          setShowBalanceCard(false);
        }
      } else {
        ToastUtility.warning(
          "Discount amount should not be more than total amount"
        );
      }
    }
  };

  const handleDiscountTypeChange = (value) => {
    setDiscountType(value);
  };
  // useEffect(() => {
  //   if (discountType == "no") {
  //     form.reset();
  //   }
  // }, [discountType]);

  useEffect(() => {
    if (feesDatailsList) {
      setDiscountType(feesDatailsList[0]?.is_discount === 2 ? "yes" : "no");
      form.setValues(feesDatailsList[0]);
      // setConfigId(feesDatailsList[0]?.config_id);
    }
  }, [feesDatailsList]);

  return (
    <div>
      {/* <Modal opened={opened} onClose={close} withCloseButton={false} centered>
        <div className="p-4">
          <div className="d-flex justify-content-between align-items-center fw-bold fs-3">
            <span>Received fees</span>
            <span>{totalFees}</span>
          </div>
          <div className="mb-3 mt-3">
            <label className="mb-1">Payment mode</label>
            <TextInput value={"Cash"} size={"lg"} />
          </div>
          <div>
            <label className="mb-1">Payment id</label>
            <TextInput placeholder="Enter here" size={"lg"} />
          </div>
          <button
            className="btn add-button w-100 mt-5 mb-4"
            type="button"
            style={{ color: "#fff" }}
            onClick={() => saveAllDetails()}
          >
            Received payment
          </button>
        </div>
      </Modal> */}

      <div className="container-fluid ">
        <div
          className={
            allFeesTypes?.length === 0
              ? "no-data-found-container mt-0"
              : "add-organization-container student-details mt-5"
          }
        >
          <span className="student-details-label">Fees configuration</span>
          <div className="student-details-sub-container">
            <form className="mt-2" onSubmit={form.onSubmit(onSubmit)}>
              {/* new changes */}
              {allFeesTypes?.length === 0 ? (
                <div className="d-flex flex-column align-items-center">
                  <img
                    src="/images/nodata.png"
                    alt="no-data"
                    className="no-data mt-0 p-0"
                  />
                  <span className="fw-bold mt-0">
                    No Fee found for this Class and Academic Year.
                  </span>
                </div>
              ) : (
                <>
                  <div className="row student-registration-container">
                    <div className=" col-lg-12 mb-3">
                      <div className="fee-details-left-container p-2">
                        <p
                          className="mx-3 mt-2 fw-bold"
                          style={{ fontSize: "18px" }}
                        >
                          Fees configuration for {allFeesTypes[0]?.class_name}
                        </p>
                        <div className="row mt-2 mx-1">
                          <div
                            style={{
                              border: "1px solid #ffb366",
                              borderRadius: "10px",
                            }}
                            className="fees-calculation-container"
                          >
                            <span className="fee-span-tag">Fees Types</span>
                            {allFeesTypes?.map((eachFeesType, index) => (
                              <div
                                className="col-12 d-flex justify-content-between align-items-center mt-3 mb-1 fees-types-checkbox-container"
                                key={index}
                              >
                                <Checkbox
                                  iconColor="#de5631"
                                  size="md"
                                  className="mb-2 checkbox-name"
                                  label={eachFeesType.fees_type}
                                  checked={eachFeesType.checked || false}
                                  onChange={() => handleCheckboxChange(index)}
                                  disabled={
                                    allTransactionData &&
                                    allTransactionData[0]?.invoice_id &&
                                    feesDatailsList &&
                                    feesDatailsList[0]?.fees_list
                                      ?.map((item) => item?.fees_master_id)
                                      ?.some(
                                        (id) =>
                                          id === eachFeesType.fees_master_id
                                      )
                                  }
                                />
                                <TextInput
                                  value={eachFeesType.amount}
                                  className="mb-2 checkbox-amount"
                                  onChange={(e) =>
                                    handleAmountChange(index, e.target.value)
                                  }
                                  maxLength={7}
                                  disabled={
                                    allTransactionData &&
                                    allTransactionData[0]?.invoice_id &&
                                    feesDatailsList &&
                                    feesDatailsList[0]?.fees_list
                                      ?.map((item) => item?.fees_master_id)
                                      ?.some(
                                        (id) =>
                                          id === eachFeesType.fees_master_id
                                      )
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* new changes made here */}
                        {feesDatailsList &&
                        feesDatailsList[0]?.fees_config_id ? null : (
                          <>
                            <div className="row mx-1 mt-3">
                              <div className="col-md-8 col-lg-5 d-flex justify-content-between align-items-center">
                                <span
                                  style={{
                                    fontSize: "15px",

                                    fontWeight: "bold",
                                  }}
                                >
                                  Select Discount
                                </span>
                                <div className="d-flex  align-items-center">
                                  <div
                                    className="d-flex  align-items-center"
                                    style={{ marginRight: "10px" }}
                                  >
                                    <input
                                      type="radio"
                                      value="yes"
                                      id="yes"
                                      name="discount"
                                      style={{ marginRight: "5px" }}
                                      checked={discountType === "yes"}
                                      onChange={() =>
                                        handleDiscountTypeChange("yes")
                                      }
                                    />
                                    <label htmlFor="yes">Yes</label>
                                  </div>
                                  <div className="d-flex align-items-center">
                                    <input
                                      type="radio"
                                      value="no"
                                      id="no"
                                      name="discount"
                                      style={{ marginRight: "5px" }}
                                      checked={discountType === "no"}
                                      onChange={() =>
                                        handleDiscountTypeChange("no")
                                      }
                                    />
                                    <label htmlFor="no">No</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {discountType === "yes" && (
                              <div className="row mx-1 mt-2">
                                <div className="col-lg-6">
                                  <TextInput
                                    size="lg"
                                    placeholder="Discount description"
                                    {...form.getInputProps("discount_note")}
                                    className="text-danger mt-1"
                                    id="note"
                                  />
                                </div>
                                <div className="col-lg-6">
                                  <NumberInput
                                    placeholder="Discount amount"
                                    {...form.getInputProps("discount_amount")}
                                    className="text-danger mt-1"
                                    id="amount"
                                    size="lg"
                                    hideControls
                                    maxLength={6}
                                  />
                                </div>
                              </div>
                            )}
                            {errorMsg ? (
                              <span
                                style={{
                                  fontSize: "12px",
                                  color: "red",
                                  marginLeft: "14px",
                                }}
                              >
                                Discount amount should not be greater than the
                                total amount.
                              </span>
                            ) : null}
                          </>
                        )}
                        {/* new changes made here */}
                        <div className="row mx-1 mt-2">
                          <div className="col-lg-12 d-flex align-items-center justify-content-between">
                            <span>Total Amount</span>
                            <span>{totalFees}</span>
                          </div>
                          <div className="col-lg-12 mb-4 d-flex align-items-center justify-content-between">
                            <span>Discount</span>
                            {/* new changes made here */}
                            <span>-{form.values.discount_amount}</span>
                            {/* new changes made here */}
                          </div>
                          <div
                            className="col-lg-12 d-flex align-items-center justify-content-between"
                            style={{
                              borderTop: "1px solid blue",
                              fontWeight: "bold",
                            }}
                          >
                            <span className="mt-2">Discounted Amount</span>
                            <span className="mt-2">
                              {feesDatailsList &&
                              feesDatailsList[0]?.fees_config_id
                                ? totalFees
                                : totalFees - form.values.discount_amount}
                              {/* {totalFees - form.values.discount_amount} */}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* <div className=" col-lg-6 mb-3">
                  <div className="fee-details-right-container p-2">
                    <div className="row mt-2 mx-1">
                      <div className="d-flex justify-content-between align-items-center col-12 mb-2">
                        <p className="">Admission fees</p>
                        <div className="d-flex align-items-center">
                          <IconCurrencyRupee size={17} />
                          <span>{admissionFess}</span>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center col-12 mb-2">
                        <p className="fw-bold">Select fees type</p>
                        <NativeSelect data={["Select", "Type 1", "Type 2"]} />
                      </div>
                      <div className="d-flex justify-content-between align-items-center col-12 mb-2">
                        <p className="">Tution fees</p>
                        <div className="d-flex align-items-center">
                          <IconCurrencyRupee size={17} />
                          <span>{tutionFess}</span>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center col-12 mb-2">
                        <p className="">Activity fees</p>
                        <div className="d-flex align-items-center">
                          <IconCurrencyRupee size={17} />
                          <span>{activityFees}</span>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center col-12 mb-2">
                        <p className="">Transport fees</p>
                        <div className="d-flex align-items-center">
                          <IconCurrencyRupee size={17} />
                          <span>{transportFees}</span>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center col-12 mb-5">
                        <div>
                          <span className="fw-bold">Discount type</span>
                          <IconInfoCircleFilled style={{ marginLeft: "5px" }} />
                        </div>
                        <div className="d-flex align-items-center">
                          <IconCurrencyRupee size={17} />
                          <span>-{discountType}</span>
                        </div>
                      </div>
                      <div
                        className="d-flex justify-content-between align-items-center col-12"
                        style={{ borderTop: "1px solid grey" }}
                      >
                        <span className="fw-bold mt-2">Total</span>
                        <div className="d-flex align-items-center mt-2">
                          <IconCurrencyRupee size={17} />
                          <span>{totalFees}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
                  </div>

                  <div className="mt-2 mb-2 d-flex align-items-center justify-content-end">
                    <button
                      type="submit"
                      className="btn save-button"
                      style={{ color: "#fff" }}
                      // disabled={
                      //   discountType === "yes"
                      //     ? form.values.discount === "" ||
                      //       form.values.note == "" ||
                      //       allFeesTypes.length === 0
                      //     : allFeesTypes.length === 0
                      // }
                    >
                      {feesDatailsList && feesDatailsList[0]?.fees_config_id
                        ? "Update"
                        : "Save"}
                    </button>
                  </div>
                </>
              )}
              {/* new changes */}
              {/* <button
                  type="button"
                  className="btn draft-button"
                  style={{ color: "#fff" }}
                >
                  Save as draft
                </button> */}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeDetails;
