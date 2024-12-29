// CommanGrid.js

import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "./CommanGrid.css";

const CommanGrid = ({
  columns,
  data,
  actionButton,
  gender,
  paginator,
  admissionStatus,
  status,
  selection,
  dataKey,
  onSelectionChange,
  rows,
  rowsPerPageOptions,
  paginatorTemplate,
  currentPageReportTemplate,
  feeTransactionDate,
  paymentMode,
  attendanceStatus,
  selectionMode,
  remarkStatus,
  metaKeySelection,
  academicYear,
  endDate,
  startDate,
  route,
  className,
  feesStatus,
  onPageChange,
  lazyLoad = true,
  totalRecords = 0,
  lazyState = {
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
  },
  onSort
}) => {
  const [gridData, setGridData] = useState([]);

  useEffect(() => {
    if (data) {
      setGridData(data);
    }
  }, [data]);

  return (
    <div className="card">
      <DataTable
        selectionMode={selectionMode}
        dataKey={dataKey}
        value={gridData}
        //lazy={lazyLoad}
        first={lazyState.first}
        onSort={onSort} 
        sortField={lazyState.sortField} 
        sortOrder={lazyState.sortOrder}
        // onFilter={onFilter} 
        filters={lazyState.filters}
        //onPage={onPageChange}
        tableStyle={{ minWidth: "56rem" }}
        totalRecords={totalRecords}
        paginator={paginator}
        metaKeySelection={metaKeySelection}
        selection={selection}
        onSelectionChange={onSelectionChange}
        rows={lazyState.rows}
        rowsPerPageOptions={rowsPerPageOptions}
        // paginatorTemplate={paginatorTemplate}
        currentPageReportTemplate={currentPageReportTemplate}
      >
        {/* {selectionMode == 'multiple' && (
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
          ></Column>
        )} */}
        {columns?.map((column) => (
          <Column
            key={column.field}
            field={column.field}
            header={column.header}
            sortable={column.sortable}
            style={{ width: column.width }}
          />
        ))}
        {/* Add a condition to include the action button if provided */}
        {status && (
          <Column
            body={status}
            exportable={false}
            style={{ minWidth: "8rem" }}
            header={"Status"}
          />
        )}
        {admissionStatus && (
          <Column
            body={admissionStatus}
            exportable={false}
            style={{ minWidth: "8rem" }}
            header={"Status"}
          />
        )}

        {feeTransactionDate && (
          <Column
            body={feeTransactionDate}
            exportable={false}
            style={{ minWidth: "13rem" }}
            header={"Transaction date"}
          />
        )}

        {paymentMode && (
          <Column
            body={paymentMode}
            exportable={false}
            style={{ minWidth: "13rem" }}
            header={"Transaction mode"}
          />
        )}

        {academicYear && (
          <Column
            body={academicYear}
            exportable={false}
            style={{ minWidth: "10rem" }}
            header={"Academic Year"}
          />
        )}

        {startDate && (
          <Column
            body={startDate}
            exportable={false}
            style={{ minWidth: "5rem" }}
            header={"Start Date"}
          />
        )}

        {route && (
          <Column
            body={route}
            exportable={false}
            style={{ minWidth: "5rem" }}
            header={"Route"}
          />
        )}

        {endDate && (
          <Column
            body={endDate}
            exportable={false}
            style={{ minWidth: "5rem" }}
            header={"End Date"}
          />
        )}

        {className && (
          <Column
            body={className}
            exportable={false}
            style={{ minWidth: "10rem" }}
            header={"Class (Section)"}
          />
        )}

        {feesStatus && (
          <Column
            body={feesStatus}
            exportable={false}
            style={{ minWidth: "7rem" }}
            header={"Fee Status"}
          />
        )}

        {actionButton && (
          <Column
            body={actionButton}
            exportable={false}
            style={{ minWidth: "7rem" }}
            header={"Action"}
          />
        )}

        {gender && (
          <Column
            body={gender}
            exportable={false}
            style={{ minWidth: "10rem" }}
            header={"Gender"}
          />
        )}

        {attendanceStatus && (
          <Column
            body={attendanceStatus}
            exportable={false}
            style={{ minWidth: "23rem" }}
            header={"Attendance"}
          />
        )}

        {remarkStatus && (
          <Column
            body={remarkStatus}
            exportable={false}
            style={{ minWidth: "7rem" }}
            header={"Remark"}
          />
        )}
      </DataTable>
    </div>
  );
};

export default CommanGrid;
