import React, { useState, useEffect } from "react";
import CommanGrid from "../../../../../../shared/components/GridTable/CommanGrid";
import * as studentProfileDataService from "../../../StudentProfileData/StudentProfileData.service";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { IconPrinter } from "@tabler/icons-react";
import "./StudentFeesRecord.css";

const StudentFeesRecord = ({ feeRecordDetails }) => {
  const [classroomStudentListGrid, setClassroomStudentListGrid] = useState([]);
  const { state } = useLocation();

  const actionButton = (rowData) => {
    return (
      <IconPrinter
        color="
        #331B73"
      />
    );
  };

  const gridColumns = [
    {
      field: "transaction_id",
      header: "Transaction ID",
      width: "30%",
    },
    {
      field: "paid_amount",
      header: "Paid Amount",
      width: "25%",
    },
    {
      field: "fees_date",
      header: "Date",
      width: "20%",
    },
    {
      field: "fees_mode",
      header: "Mode",
      width: "20%",
    },
    // {
    //   field: "fees_action",
    //   header: "Action",
    //   width: "20%",
    // },
  ];

  useEffect(() => {
    if (feeRecordDetails) {
      const { student_admission_id, academic_year_id } = feeRecordDetails;
      getStudentFeesDetails(student_admission_id, academic_year_id);
    }
  }, [feeRecordDetails]);

  const getStudentFeesDetails = async (studentId, academicYearId) => {
    const payload = {
      student_admission_id: parseInt(studentId),
      academic_year_id: parseInt(academicYearId),
    };
    try {
      const response = await studentProfileDataService.getStudentFeesDetails(
        payload
      );
      if (!response.error) {
        setClassroomStudentListGrid(response.data.transactionList);
      } else {
       }
    } catch (error) {
     }
  };

  return (
    <div className="grid-section">
      <CommanGrid 

        columns={gridColumns}
        actionButton={actionButton}
        data={classroomStudentListGrid?.map((item) => ({
          transaction_id: item.transaction_id,
          paid_amount: item.paying_amount,
          fees_date: moment(item.date).format("DD MMM, YYYY"),
          fees_mode:
            item.transaction_mode_id === 1
              ? "Cash"
              : item.transaction_mode_id === 2
              ? "Credit card"
              : item.transaction_mode_id === 3
              ? "UPI"
              : item.transaction_mode_id === 4
              ? "Debit card"
              : item.transaction_mode_id === 5
              ? "EMI"
              : "N/A",
          fees_action: item.fees_action,
        }))}
        paginator
        rows={20}
        rowsPerPageOptions={[20, 30, 40]}
        paginatorTemplate="PrevPageLink PageLinks NextPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} "
      />
    </div>
  );
};

export default StudentFeesRecord;
