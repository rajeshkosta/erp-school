// import React, { useEffect, useState } from "react";
// import CommanGrid from "../../../../../shared/components/GridTable/CommanGrid";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { IconChevronLeft, IconPencil } from "@tabler/icons-react";
// import * as addFeeMasterService from "../../FeeMaster.service";

// const FeeMasterGrid = () => {
//   const navigate = useNavigate();
//   const { state } = useLocation();
//   const [allClassGrid, setAllClassGrid] = useState([]);
//   const [allFeesTypes, setAllFeesTypes] = useState([]);

//   const gridColumns = [
//     { field: "fees_type", header: "Fees type", width: "30%", sortable: false },
//     {
//       field: "amount",
//       header: "Amount (in Rupees)",
//       width: "30%",
//       sortable: false,
//     },
//     //{ field: "due_date", header: "Due date", width: "30%", sortable: false },
//   ];

//   const gridData = [...allFeesTypes];

//   // Handle the action
//   const handleAction = (rowData) => {
//     // Your action logic here
//     navigate("/feeMaster/edit", {
//       state: {
//         rowData: rowData,
//       },
//     });
//   };

//   const getClassGrid = async () => {
//     if (state?.data) {
//       const payload = {
//         // class_id: state?.data.std_id,
//         academic_year_id: state?.academic_year_id,
//       };

//       const getClassListResponse =
//         await addFeeMasterService.getAllClassByClassIdGrid(payload);
//       if (!getClassListResponse.error) {
//         setAllClassGrid(getClassListResponse.data.data);
//       }
//     }
//   };

//   useEffect(() => {
//     getClassGrid();
//     getAllFeeType();
//   }, []);

//   const getAllFeeType = async () => {
//     const getFeeTypeResponse = await addFeeMasterService.getFeeType();
//     if (!getFeeTypeResponse.error) {
//       setAllFeesTypes(getFeeTypeResponse.data.data);
//     }
//   };

//   // Define the action button
//   const actionButton = (rowData) => {
//     return (
//       <div className="d-flex justify-content-between align-items-center w-75">
//         <IconPencil
//           onClick={() => handleAction(rowData)}
//           color="grey"
//           size={20}
//           style={{ cursor: "pointer" }}
//         />
//       </div>
//     );
//   };

//   const goBackToFeeMasterPage = () => {
//     navigate("/feeMaster");
//   };

//   return (
//     <div>
//       <div className="d-flex align-items-center justify-content-between mb-3">
//         <span
//           className="fw-bold"
//           style={{ fontSize: "20px", marginLeft: "10px" }}
//         >
//           Fees Master
//         </span>
//         <button className="btn add-button col-md-3">
//           <Link
//             to="/feeMaster/add"
//             style={{ textDecoration: "none", color: "#fff" }}
//           >
//             Add Fee
//           </Link>
//         </button>
//       </div>
//       <CommanGrid
//         columns={gridColumns}
//         data={gridData}
//         paginator
//         actionButton={actionButton}
//         rows={10}
//         rowsPerPageOptions={[10, 20, 30]}

//         // paginatorTemplate="PrevPageLink PageLinks NextPageLink  CurrentPageReport RowsPerPageDropdown"
//         // currentPageReportTemplate="Showing {first} to {last} of {totalRecords} "
//       />
//     </div>
//   );
// };

// export default FeeMasterGrid;
