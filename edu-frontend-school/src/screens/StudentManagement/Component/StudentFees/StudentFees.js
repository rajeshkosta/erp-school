import React, { useEffect, useState } from "react";
import "./StudentFees.css";
import { IconChevronLeft, IconPrinter } from "@tabler/icons-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "@mantine/form";
import { Modal, NativeSelect, NumberInput, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import * as addStudentService from "../../Student.service";
import { transactionsList, genderList } from "../../../../Const/Constant";
import { Calendar } from "primereact/calendar";
import moment from "moment";
import CommanGrid from "../../../../shared/components/GridTable/CommanGrid";
import FeeDetails from "../StudentForm/FeeDetails/FeeDetails";
import ToastUtility from "../../../../utility/ToastUtility";

const StudentFees = () => {
  const currentDate = new Date();

  const [feesConfigurationCard, setFeesConfigurationHistoryCard] =
    useState(false);
  const [feesHistoryCard, setFeesHistoryCard] = useState(false);
  const [feesDetailsCard, setFeesDetailsCard] = useState(true);
  const [feesConfigurationData, setFeesConfigurationData] = useState({});
  const [transactionId, setTransactionId] = useState(null);
  const [transactionRequestId, setTransactionRequestId] = useState("");
  const [feesPaid, setFeesPaid] = useState(0);
  const [feesBalance, setFeesBalance] = useState(0);
  const [allTransactionData, setAllTransactionData] = useState([]);
  const [transactionDate, setTransactionDate] = useState(currentDate);
  const [errorMsg, setErrorMsg] = useState(false);
  const [showBalanceCard, setShowBalanceCard] = useState(false);
  const [payingAmount, setPayingAmount] = useState();
  const [configId, setConfigId] = useState("");
  const [feesDetails, setFeesDetails] = useState([]);

  const form = useForm({
    initialValues: {
      paying_amount: "",
    },

    validate: {},
  });

  const { state } = useLocation();

  const navigate = useNavigate();

  const goBackToStudentManagementPage = () => {
    navigate("/student");
  };

  const showFeesHistoryCard = () => {
    setFeesHistoryCard(true);
    setFeesDetailsCard(false);
    setFeesConfigurationHistoryCard(false);
  };

  const showFeesDetailsCard = () => {
    setFeesDetailsCard(true);
    setFeesHistoryCard(false);
    setFeesConfigurationHistoryCard(false);
  };

  const showFeesConfigurationCard = () => {
    setFeesConfigurationHistoryCard(true);
    setFeesHistoryCard(false);
    setFeesDetailsCard(false);
  };

  const [opened, { open, close }] = useDisclosure(false);

  const getAllFeesConfigurationByConfigurationId = async () => {
    const payload = {
      // academic_year_id: state?.rowData?.academic_year_id,
      academic_year_id: state?.academicId,
      student_admission_id: state?.rowData?.student_admission_id,
    };

    const getFeesConfigurationByConfigurationIdResponse =
      await addStudentService.getFeesConfigurationByConfigurationId(payload);
    if (!getFeesConfigurationByConfigurationIdResponse.error) {
      const dataToSpread =
        getFeesConfigurationByConfigurationIdResponse?.data?.data;

      const isDataEmpty =
        !dataToSpread || Object.keys(dataToSpread).length === 0;

      if (isDataEmpty) {
        ToastUtility.warning("No data found. Kindly configure your fee");
        setShowBalanceCard(true);
      } else {
        setFeesConfigurationData(dataToSpread[0]);
        setShowBalanceCard(false);
      }

      // setShowBalanceCard(false);
    } else {
      // setShowBalanceCard(true);
    }
  };

  useEffect(() => {
    if (feesDetailsCard) {
      getAllFeesConfigurationByConfigurationId();
    }
  }, [feesDetailsCard]);

  const getTransactiondetails = async () => {
    const payload = {
      // fees_config_id: feesDetails ? feesDetails[0].fees_config_id : "",
      fees_config_id: feesConfigurationData?.fees_config_id,
    };
    const getTransactiondetailsResponse =
      await addStudentService.getTransactionData(payload);
    if (!getTransactiondetailsResponse.error) {
      setAllTransactionData(getTransactiondetailsResponse?.data?.fees_list);
      if (getTransactiondetailsResponse?.data?.fees_list.length === 0) {
        ToastUtility.warning("No transaction details available.");
      }
    } else {
      ToastUtility.info("No transactions found for this Student");
    }
  };

  const getAllFeesConfiguration = async () => {
    const payload = {
      // academic_year_id: state?.rowData.academic_year_id,
      academic_year_id: state?.academicId,
      student_admission_id: state?.rowData.student_admission_id,
    };

    const getFeesConfigurationByConfigurationIdResponse =
      await addStudentService.getFeesConfigurationByConfigurationId(payload);
    if (!getFeesConfigurationByConfigurationIdResponse.error) {
      const dataToSpread =
        getFeesConfigurationByConfigurationIdResponse?.data?.data;
      setFeesDetails(dataToSpread);
    }
  };

  useEffect(() => {
    getAllFeesConfiguration();
  }, []);

  useEffect(() => {
    if (feesHistoryCard && feesConfigurationData?.fees_config_id) {
      getTransactiondetails();
    }
  }, [feesHistoryCard]);

  const makePayment = async () => {
    if (transactionId && transactionDate) {
      const amt = feesConfigurationData?.balance_amount;
      if (payingAmount <= parseInt(amt)) {
        const payload = {
          student_admission_id: feesConfigurationData.student_admission_id,
          class_id: feesConfigurationData.class_id,
          academic_year_id: feesConfigurationData.academic_year_id,
          total_amount: feesConfigurationData.total_amount,
          paying_amount: payingAmount,
          transaction_mode_id: transactionId,
          date: moment(transactionDate).format("YYYY-MM-DD"),
          fees_config_id: feesConfigurationData.fees_config_id,
        };

        const addTransactionResponse = await addStudentService.addTransaction(
          payload
        );
        if (!addTransactionResponse.error) {
          setTransactionRequestId(addTransactionResponse?.data[0]);
          close();
          setPayingAmount(0);
          setTransactionId(null);

          getAllFeesConfigurationByConfigurationId();
          ToastUtility.success(
            `We are pleased to inform you that your recent payment of ${payingAmount} has been successfully processed.`
          );
        }
      } else {
        ToastUtility.warning(
          "Paying amount should not be more than total amount"
        );
      }
    } else {
      ToastUtility.warning("Please  select Transaction mode");
    }
  };

  const gridData = [...allTransactionData];

  const gridColumns = [
    {
      field: "invoice_id",
      header: "Transaction Id",
      width: "25%",
      sortable: true,
    },
    // {
    //   field: "date",
    //   header: "Transaction date",
    //   width: "25%",
    //   sortable: true,
    // },

    {
      field: "paying_amount",
      header: "Paid amount",
      width: "30%",
      sortable: false,
    },
    // {
    //   field: "balance_amount",
    //   header: "Balance",
    //   width: "20%",
    //   sortable: false,
    // },
  ];

  const payingAmountInputValues = (e) => {
    setPayingAmount(e.target.value);
  };

  const handleDigits = (e) => {
    const isAllowedKey = /^[0-9]$/.test(e.key);
    const isAllowedAction = [
      "Backspace",
      "Delete",
      "Cut",
      "Copy",
      "Paste",
      "ArrowRight",
      "ArrowLeft",
      "Tab",
    ].includes(e.nativeEvent.code);

    if (!isAllowedKey && !isAllowedAction) {
      e.preventDefault();
    }
  };

  const feeTransactionDate = (rowData) => {
    const paymentDate = moment(rowData?.date).format("DD-MM-YYYY");
    return <span>{paymentDate}</span>;
  };

  const paymentMode = (rowData) => {
    const paymentGateway = transactionsList.find(
      (transaction) =>
        transaction?.transaction_id === rowData?.transaction_mode_id
    );
    return <span>{paymentGateway?.transaction_name}</span>;
  };

  const actionButton = (rowData) => {
    return (
      <IconPrinter
        color="
      #DB3525"
      />
    );
  };

  return (
    <div className="container-fluid">
      {/* <form> */}
      <Modal opened={opened} onClose={close} centered title="Fee Details">
        <div className="p-3">
          <div className="d-flex justify-content-between align-items-center mb-2 fw-bold">
            <label className="mb-1 " style={{ fontSize: "15px" }}>
              Amount to be paid
            </label>
            <span>{feesConfigurationData?.balance_amount}</span>
          </div>
          <div
            style={{ borderBottom: "1px solid #ccc", marginBottom: "1rem" }}
          ></div>
          <div className="row mb-3">
            <div className="col-md-6">
              <label
                className="mb-1 fw-bold"
                style={{ fontSize: "15px", display: "block" }}
              >
                Amount paying now
              </label>
              <TextInput
                placeholder="Enter amount"
                size={"lg"}
                hideControls
                className="w-100"
                maxLength={10}
                onChange={payingAmountInputValues}
                onKeyDown={handleDigits}
              />
            </div>

            <div className="col-md-6">
              <label
                className="mb-1 fw-bold"
                style={{ fontSize: "15px", display: "block" }}
              >
                Date
              </label>
              <Calendar
                placeholder="Date"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.value)}
                showIcon
                dateFormat="dd/mm/yy"
                id="due_date"
                maxDate={currentDate}
                className="w-100"
              />
            </div>
          </div>
          {/* <div className="d-flex justify-content-between align-items-center">
            
          </div> */}
          <div className="mb-3 mt-3">
            <label className="mb-1 fw-bold" style={{ fontSize: "15px" }}>
              Payment mode
            </label>
            <select
              className="normalSelect"
              onChange={(e) => setTransactionId(e.target.value)}
              value={transactionId}
            >
              <option>Select</option>
              {transactionsList?.map((eachTransaction, index) => (
                <option key={index} value={eachTransaction.transaction_id}>
                  {eachTransaction.transaction_name}
                </option>
              ))}
            </select>
          </div>
          {errorMsg ? (
            <span style={{ color: "red", fontSize: "12px" }}>
              Paying amount should not be more than the total amount.
            </span>
          ) : null}

          <button
            className="btn add-button w-100 mt-3 mb-4"
            type="button"
            style={{ color: "#fff" }}
            onClick={() => makePayment()}
          >
            Pay now
          </button>
        </div>
      </Modal>
      <div className="d-flex align-items-center">
        <IconChevronLeft
          size={30}
          onClick={goBackToStudentManagementPage}
          style={{ cursor: "pointer" }}
          color="black"
        />
        <span
          className="fw-bold"
          style={{ fontSize: "20px", marginLeft: "10px" }}
        >
          Student fees details
        </span>
      </div>
      <div className="row mt-3 mx-2 p-3 student_fee-profile-container">
        <div className="col-md-12 col-lg-2 mb-3 profile-pic-container">
          <div className="mr-3">
            <img src="/images/profile-pic.png" alt="profile-pic" />
          </div>
        </div>
        <div className="col-12 col-md-12 col-lg-10 ">
          <div className="row">
            <div className="col-sm-4 col-md-4 col-lg-3 mb-2">
              <label className="label-name">Name</label>
              <br />
              <span className="label-data">{state?.rowData.full_name}</span>
            </div>
            <div className="col-sm-4 col-md-3 col-lg-2 mb-2">
              <label className="label-name">DOB</label>
              <br />
              <span className="label-data ">{state?.rowData.dob}</span>
            </div>

            <div className="col-sm-4 col-md-2 col-lg-2 mb-2">
              <label className="label-name">Gender</label>
              <br />
              <span className="label-data ">
                {
                  genderList.find(
                    (gender) => gender.gender_id === state?.rowData.gender_id
                  )?.gender_name
                }
              </span>
            </div>
            <div className="col-sm-4 col-md-2 col-lg-2 mb-2">
              <label className="label-name">Class</label>
              <br />
              <span className="label-data ">
                {state?.rowData.std_name_admission}
              </span>
            </div>

            <div className="col-sm-4 col-md-4 col-lg-3 mb-2">
              <label className="label-name">Mobile number</label>
              <br />
              <span className="label-data ">
                {state?.rowData.mobile_number}
              </span>
            </div>
            <div className="col-sm-4 col-md-3 col-lg-3 mb-2">
              <label className="label-name">Admission date</label>
              <br />
              <span className="label-data ">
                {state?.rowData.admission_date}
              </span>
            </div>
            <div className="col-sm-4 col-md-3 col-lg-4">
              <label className="label-name">Admission number</label>
              <br />
              <span className="label-data ">
                {state?.rowData.student_admission_number}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="feeSectionInfo">
        <div className="d-flex align-items-center justify-content-between mt-4 mb-4">
          <div>
            <button
              className={
                feesDetailsCard
                  ? "btn fees-details-button"
                  : "btn fees-history-button"
              }
              type="button"
              onClick={() => showFeesDetailsCard()}
              style={{ marginRight: "15px", marginTop: "10px" }}
            >
              Fees details
            </button>

            <button
              className={
                feesHistoryCard
                  ? "btn fees-details-button"
                  : "btn fees-history-button"
              }
              type="button"
              onClick={() => showFeesHistoryCard()}
              style={{ marginTop: "10px" }}
            >
              Fees history
            </button>
          </div>

          {showBalanceCard ? null : (
            <button
              title="Update fee configuration"
              className={
                feesConfigurationCard
                  ? "btn fees-details-button"
                  : "btn fees-history-button"
              }
              style={{ marginTop: "10px" }}
              type="button"
              onClick={() => showFeesConfigurationCard()}
            >
              <img
                className="editIconInfo"
                src="/Assets/edit-clipboard.svg"
                alt=""
              />
            </button>
          )}
        </div>
        {feesHistoryCard ? (
          <div className="student-fees-bottom-container mb-3 mt-4">
            <span className="fees-details-label fees-history-label">
              Fees History
            </span>
            <div className="row  ">
              <div className=" mt-3 px-3 col-lg-12">
                <div className="extra px-3" style={{ overflow: "auto" }}>
                  <CommanGrid
                    columns={gridColumns}
                    data={gridData}
                    // className={className}
                    // paginator
                    actionButton={actionButton}
                    feeTransactionDate={feeTransactionDate}
                    paymentMode={paymentMode}
                    rows={10}
                    // rowsPerPageOptions={[10, 20, 30]}
                    // paginatorTemplate=" PrevPageLink PageLinks NextPageLink  CurrentPageReport RowsPerPageDropdown"
                    // currentPageReportTemplate="Showing {first} to {last} of {totalRecords} "
                  />
                </div>
              </div>
            </div>
          </div>
        ) : feesDetailsCard ? (
          <div className="student-fees-bottom-container confirmation-container mt-4">
            <span className="fees-details-label">Fees details</span>
            <div className="row px-3">
              <div className="mt-3 col-lg-12 extra">
                {feesConfigurationData?.fees_list &&
                feesConfigurationData?.fees_list.length > 0
                  ? feesConfigurationData?.fees_list?.map((eachFees, index) => (
                      <div
                        className="col-lg-12 d-flex align-items-center justify-content-between feeTypeSection"
                        key={index}
                      >
                        <div className="col-12 d-flex align-items-center justify-content-between">
                          <span>{eachFees.fees_type}</span>
                          <span>{eachFees.amount}</span>
                        </div>
                      </div>
                    ))
                  : null}

                <div className="balance">
                  {!showBalanceCard ? (
                    <>
                      <div
                        className="mb-1 col-lg-12 fw-bold d-flex align-items-center justify-content-between feeTypeSection"
                        style={{
                          borderTop: "2px dashed grey",
                          fontSize: "15px",
                        }}
                      >
                        <div className="col-12 d-flex align-items-center justify-content-between">
                          <span className="mt-2">Total Amount</span>
                          <span className="mt-2">
                            {feesConfigurationData.fees_total_amount}
                          </span>
                        </div>
                      </div>
                      <div
                        className="mb-1 col-lg-12 d-flex align-items-center justify-content-between feeTypeSection"
                        style={{ fontSize: "15px" }}
                      >
                        <div className="col-12 d-flex align-items-center justify-content-between">
                          <span>
                            Discount ({feesConfigurationData.discount_note})
                          </span>
                          <span>- {feesConfigurationData.discount_amount}</span>
                        </div>
                      </div>
                      <div
                        className=" fw-bold col-lg-12 mb-1 d-flex align-items-center justify-content-between feeTypeSection"
                        style={{ fontSize: "15px" }}
                      >
                        <div className="col-12 d-flex align-items-center justify-content-between">
                          <span>Discounted Amount</span>
                          <span>
                            {feesConfigurationData.fees_total_amount -
                              feesConfigurationData.discount_amount}
                          </span>
                        </div>
                      </div>
                      <div
                        className="mb-1 col-lg-12 d-flex align-items-center justify-content-between feeTypeSection"
                        style={{ fontSize: "15px" }}
                      >
                        <div className="col-12 d-flex align-items-center justify-content-between">
                          <span>Paid</span>
                          <span>{feesConfigurationData.paid_amount}</span>
                        </div>
                      </div>
                      <div
                        className="fw-bold col-lg-12 d-flex align-items-center justify-content-between paySection"
                        style={{
                          fontSize: "15px",
                          color: "#db3525",
                          borderTop: "2px dashed grey",
                        }}
                      >
                        <div className="col-12 d-flex align-items-center justify-content-between">
                          <span>Balance</span>
                          <span>{feesConfigurationData?.balance_amount}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="noDataSection d-flex justify-content-center align-items-center m-0 p-0">
                      <img
                        src="/images/nodata.png"
                        alt="no-data"
                        className="no-data"
                      />

                      {showBalanceCard ? (
                        <button
                          className={
                            feesConfigurationCard
                              ? "btn fees-details-button"
                              : "btn fees-history-button"
                          }
                          type="button"
                          onClick={() => showFeesConfigurationCard()}
                        >
                          Add fee configuration
                        </button>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <FeeDetails
            stateData={state?.rowData}
            setFeesDetailsCard={setFeesDetailsCard}
            setShowBalanceCard={setShowBalanceCard}
            feesConfigurationData={feesConfigurationData}
            showBalanceCard={showBalanceCard}
            allTransactionData={allTransactionData}
          />
        )}

        {feesDetailsCard ? (
          <div className="row mt-2">
            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="btn save-button"
                style={{ color: "#fff", marginRight: "0px" }}
                onClick={open}
                disabled={
                  showBalanceCard || feesConfigurationData?.balance_amount == 0
                }
              >
                Pay
              </button>
            </div>
          </div>
        ) : null}
        {/* </form> */}
      </div>
    </div>
  );
};

export default StudentFees;
