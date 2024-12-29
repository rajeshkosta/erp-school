// import { IconCloudUpload } from "@tabler/icons-react";
// import { NumberInput, TextInput } from "@mantine/core";

// const FormDriverManagement = () => {
//   return (
//     <div className="add-organization-container mx-1">
//       <div className="d-flex align-items-center">
//         <div className="upload-logo">
//           {fileUpload ? (
//             <img
//               src={URL.createObjectURL(fileUpload)}
//               alt="profile"
//               className="uploaded-image"
//             />
//           ) : (
//             <IconCloudUpload size={40} color="grey" />
//           )}
//         </div>

//         <div className="upload-image-container">
//           <input
//             accept="image/png,image/jpeg"
//             type="file"
//             id="upload"
//             //  onChange={handleUploadedImage}
//           />
//           {fileUpload ? (
//             <label
//               htmlFor="upload"
//               className="fw-bold"
//               style={{ cursor: "pointer" }}
//             >
//               {/* {fileUpload.name} */}
//             </label>
//           ) : (
//             <label
//               htmlFor="upload"
//               className="fw-bold"
//               style={{ cursor: "pointer" }}
//             >
//               Click here to upload logo
//             </label>
//           )}
//         </div>
//       </div>
//       {/* {fileError ? (
//           <span className="m-8f816625 mt-2">Upload jpg, jpeg, png only. </span>
//         ) : null} */}

//       <form onSubmit={form.onSubmit(onSubmit)}>
//         <div className="row mt-5">
//           <div className="form-group text-start mb-3 col-lg-99">
//             <label className="fw-bold text-secondary" htmlFor="org-name">
//               Driver Name *
//             </label>
//             <TextInput
//               placeholder="Enter here"
//               {...form.getInputProps("driver_name")}
//               required
//               className="text-danger mt-1"
//               id="org-name"
//             />
//           </div>
//         </div>

//         <div className="row mt">
//           <div className="form-group text-start mb-3 col-lg-6">
//             <label className="fw-bold text-secondar" htmlFor="joinning-date">
//               Joinning Date*
//             </label>
//             <TextInput
//               placeholder="Enter here"
//               {...form.getInputProps("joinning_Date")}
//               required
//               className="text-danger mt"
//               id="org-name"
//             />
//           </div>

//           <div className="form-group text-start mb-3 col-lg-6">
//             <label className="fw-bold text-secondary" htmlFor="email-address">
//               Email-address *
//             </label>
//             <TextInput
//               placeholder="Enter here"
//               {...form.getInputProps("email-address")}
//               required
//               className="text-danger mt-1"
//               id="email"
//             />
//           </div>
//           <div className="form-group text-start mb-3 col-lg-6">
//             <label className="fw-bold text-secondary" htmlFor="mobileNumber">
//               Mobile number *
//             </label>
//             <NumberInput
//               placeholder="Enter here"
//               {...form.getInputProps("contact_no")}
//               maxLength={10}
//               hideControls
//               required
//               className="text-danger mt-1"
//               id="mobileNumber"
//             />
//           </div>
//           <label for="Gender">Gender</label>
//           <select id="Gender" name="Gender">
//             <option>Male</option>
//             <option>Female</option>
//           </select>
//           <TextInput
//             placeholder="--Select--"
//             {...form.getInputProps("address")}
//             required
//             className="text-danger mt-1"
//             id="Gender"
//           />
//         </div>

//         <div className="form-group text-start mb-3 col-lg-6">
//           <label className="fw-bold text-secondary" htmlFor="Date-of-birth">
//             Date of birth*
//           </label>
//           <TextInput
//             placeholder="Enter here"
//             required
//             className="text-danger mt-1"
//             id="principal"
//           />
//         </div>
//         <div>
//           <label for="Assign-Vehicle">Assign Vehicle</label>
//           <select id="Assign-Vehicle" name="Assign-Vehicle"></select>
//           <TextInput
//             placeholder="--Select--"
//             {...form.getInputProps("address")}
//             required
//             className="text-danger mt-1"
//             id="Assign-Vehicle"
//           />
//         </div>
//       </form>
//     </div>
//   );
// };

// export default FormDriverManagement;
