import { NativeSelect, NumberInput, TextInput, Tooltip } from "@mantine/core";
import { IconChevronLeft, IconCloudUpload, IconEye, IconTrash } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { useLocation, useNavigate } from "react-router-dom";
import { Calendar } from "primereact/calendar";
import * as gettingVehicleManagementService from "../../Vehicle.service";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import moment from "moment";
import { years } from "../../../../../Const/Constant";
import ToastUtility from "../../../../../utility/ToastUtility";
import "./VehicleForm.css";

const VehicleForm = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [fileUpload, setFileUpload] = useState(null);
  const [fileError, setFileError] = useState(false);
  const [vehicleData, setVehicleData] = useState({});
  const [roleID, setRoleID] = useState(null);
  const [userID, setUserID] = useState(null);
  const [routeID, setRouteID] = useState(null);
  const [rolesList, setRolesList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [routeList, setRouteList] = useState([]);
  const formData = new FormData();
  const goBackToVehicleManagementPage = () => {
    navigate("/vehicle");
  };

  const form = useForm({
    initialValues: {
      vehicle_number: "",
      vehicle_reg_number: "",
      vehicle_model: "",
      year_made: "--Select--",
      chasis_number: "",
      vehicle_type: "",
      capacity: "",
    },

    validate: {
      vehicle_number: (value) =>
        /^[a-zA-Z0-9]*$/.test(value)
          ? null
          : "Please enter valid vehicle number",
      vehicle_reg_number: (value) =>
        /^[a-zA-Z0-9]*$/.test(value)
          ? null
          : "Please enter valid vehicle register (plate) number",
      vehicle_model: (value) =>
        /^[a-zA-Z0-9\s]*$/.test(value)
          ? null
          : "Please enter valid vehicle model",
      year_made: (value) =>
        value === "--Select--" ? "Please select a year" : null,
      chasis_number: (value) =>
        /^[a-zA-Z0-9]*$/.test(value)
          ? null
          : "Please enter valid chasis number",
      vehicle_type: (value) =>
        /^[a-zA-Z0-9]*$/.test(value) ? null : "Please enter valid vehicle type",
      capacity: (value) => {
        if (value === "") {
          return "Please enter capacity";
        } else if (parseInt(value) <= 0) {
          return "Capacity cannot be negative or zero";
        }
        return null;
      },
    },
  });

  const handleUploadedFile = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const validformats = ["pdf", "png", "jpeg", "jpg", "csv"];
      const fileExtension = selectedFile.name.split(".").pop().toLowerCase();

      if (validformats.includes(fileExtension)) {
        setFileError(false);
        setFileUpload(selectedFile);
      } else {
        setFileError(true);
      }
    } else {
      setFileUpload(null);
      setFileError(false);
    }
  };

  useEffect(() => {
    form.setValues({
      vehicle_number: vehicleData?.vehicle_code || "",
      vehicle_reg_number: vehicleData?.vehicle_plate_number || "",
      vehicle_model: vehicleData?.vehicle_model || "",
      year_made: vehicleData?.year_made || "--Select--",
      chasis_number: vehicleData?.chasis_number || "",
      vehicle_type: vehicleData?.vehicle_type || "",
      capacity: vehicleData?.capacity || "",
    });

    setRoleID(vehicleData?.role_id || null);
    setUserID(vehicleData?.user_id || null);
    setRouteID(vehicleData?.route_id || null);

    if (vehicleData?.role_id) {
      getUsers(vehicleData?.role_id);
    }
  }, [vehicleData]);

  const onSubmit = async () => {
    if (state?.rowData.vehicle_id) {
      const {
        vehicle_number,
        vehicle_model,
        year_made,
        chasis_number,
        vehicle_type,
        capacity,
      } = form.values;
      const vehicle_data = {
        vehicle_id: parseInt(state?.rowData.vehicle_id),
        driver_id: parseInt(userID),
        route_id: parseInt(routeID),
        vehicle_plate_number: vehicle_number,
        vehicle_model: vehicle_model,
        year_made: parseInt(year_made),
        chasis_number: chasis_number,
        vehicle_type: vehicle_type,
        capacity: parseInt(capacity),
      };

      formData.append("vehicle_data", JSON.stringify(vehicle_data));
      formData.append("registration_certificate", fileUpload);

      const updateResponse =
        await gettingVehicleManagementService.UpdateVehicle(formData, {
          "Content-Type": "multipart/form-data",
        });

      if (!updateResponse.error) {
        ToastUtility.success("Vehicle Updated Successfully");
        navigate("/vehicle");
      }
    } else {
      const {
        vehicle_number,
        vehicle_reg_number,
        vehicle_model,
        year_made,
        chasis_number,
        vehicle_type,
        capacity,
      } = form.values;

      const vehicle_data = {
        driver_id: parseInt(userID),
        route_id: parseInt(routeID),
        vehicle_code: vehicle_number,
        vehicle_plate_number: vehicle_reg_number,
        vehicle_model: vehicle_model,
        year_made: parseInt(year_made),
        chasis_number: chasis_number,
        vehicle_type: vehicle_type,
        capacity: parseInt(capacity),
      };

      formData.append("vehicle_data", JSON.stringify(vehicle_data));
      formData.append("registration_certificate", fileUpload);

      if (roleID && userID && routeID) {
        const addResponse = await gettingVehicleManagementService.AddVehicle(
          formData,
          { "Content-Type": "multipart/form-data" }
        );

        if (!addResponse.error) {
          ToastUtility.success("Vehicle added successfully.");
          if (addResponse.data) {
            navigate("/vehicle");
          }
        } else {
          ToastUtility.info("Please add proper Vehicle details");
        }
      } else {
        ToastUtility.error("Please select Role Type, Driver and Route");
      }
    }
  };

  const getDataByVehicleId = async (vehicleID) => {
    const getVehicleByVehicleIdResponse =
      await gettingVehicleManagementService.getVehicleByVehicleId(vehicleID);
    if (!getVehicleByVehicleIdResponse.error) {
      setVehicleData(getVehicleByVehicleIdResponse.data);
    } else {
      ToastUtility.error("No data found for this Vehicle ID!");
    }
  };

  useEffect(() => {
    if (state?.rowData.vehicle_id) {
      getDataByVehicleId(state?.rowData.vehicle_id);
    }
  }, []);

  const getRoles = async () => {
    const getRolesResponse =
      await gettingVehicleManagementService.getRolesList();
    const rolesData = [getRolesResponse.data];
    setRolesList(...rolesData);
  };

  const getUsers = async (id) => {
    const getUsersResponse = await gettingVehicleManagementService.getUsersList(
      id
    );
    const usersData = [getUsersResponse.data];
    setUsersList(...usersData);
  };

  const getRoutes = async (payload) => {
    payload = {
      pageSize: 0,
      currentPage: 0,
    };
    const getRoutesResponse =
      await gettingVehicleManagementService.getRoutesList(payload);
    const routesData = [getRoutesResponse?.data?.data];
    setRouteList(...routesData);
  };

  const onSelectRole = async (e) => {
    setRoleID(e.target.value);
    await getUsers(e.target.value);
  };

  const onSelectUser = async (e) => {
    setUserID(e.target.value);
  };

  const onSelectRoute = async (e) => {
    setRouteID(e.target.value);
  };

  useEffect(() => {
    getRoles();
    getRoutes();
  }, []);
  
  const removeCertificateImage = () => {
    setFileUpload(null);
  };

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center">
        <IconChevronLeft
          size={30}
          onClick={goBackToVehicleManagementPage}
          style={{ cursor: "pointer" }}
          color="black"
        />
        <span
          className="fw-bold"
          style={{ fontSize: "20px", marginLeft: "10px" }}
        >
          {state?.rowData ? "Update Vehicle" : "Add Vehicle"}
        </span>
      </div>
      <div className="add-organization-container mx-2">
        <form onSubmit={form.onSubmit(onSubmit)}>
          <div className="row mt-2" style={{justifyContent:'space-between'}}>
            <div className="col-md-12 col-lg-8 pe-5">
              <div className="row">
            <div className="form-group text-start mb-3 col-lg-4">
              <label
                className="fw-bold text-secondary mb-1"
                htmlFor="role-name"
              >
                Vehicle Code*
              </label>
              <TextInput
                size="lg"
                placeholder="Enter here"
                {...form.getInputProps("vehicle_number")}
                required
                className="text-danger mt-1"
                id="role-name"
                maxLength={20}
              />
            </div>

            <div className="form-group text-start mb-3 col-lg-4">
              <label
                className="fw-bold text-secondary mb-1"
                htmlFor="role-name"
              >
                Vehicle Registered No.*
              </label>
              <TextInput
                size="lg"
                placeholder="Enter here"
                {...form.getInputProps("vehicle_reg_number")}
                required
                className="text-danger mt-1"
                id="role-name"
                maxLength={20}
              />
            </div>

            <div className="form-group text-start mb-3 col-lg-4">
              <label
                className="fw-bold text-secondary mb-1"
                htmlFor="role-name"
              >
                Model*
              </label>
              <TextInput
                size="lg"
                placeholder="Enter here"
                {...form.getInputProps("vehicle_model")}
                required
                className="text-danger mt-1"
                id="role-name"
                maxLength={20}
              />
            </div>

            <div className="form-group text-start mb-3 col-lg-4">
              <label
                className="fw-bold text-secondary mb-1"
                htmlFor="role-type"
              >
                Year Made *
              </label>
              <NativeSelect
                size="lg"
                {...form.getInputProps("year_made")}
                required
                data={["--Select--", ...years]}
                id="years"
              />
            </div>

            <div className="form-group text-start mb-3 col-lg-4">
              <label
                className="fw-bold text-secondary mb-1"
                htmlFor="role-name"
              >
                Chasis No.*
              </label>
              <TextInput
                size="lg"
                placeholder="Enter here"
                {...form.getInputProps("chasis_number")}
                required
                className="text-danger mt-1"
                id="role-name"
                maxLength={20}
              />
            </div>

            <div className="form-group text-start mb-3 col-lg-4">
              <label
                className="fw-bold text-secondary mb-1"
                htmlFor="role-name"
              >
                Vehicle Type*
              </label>
              <TextInput
                size="lg"
                placeholder="Enter here"
                {...form.getInputProps("vehicle_type")}
                required
                className="text-danger mt-1"
                id="role-name"
                maxLength={20}
              />
            </div>

            <div className="form-group text-start mb-3 col-lg-4">
              <label className="fw-bold text-secondary" htmlFor="role-name">
                Seating Capacity *
              </label>
              <NumberInput
                size="lg"
                maxLength={3}
                hideControls
                placeholder="Enter here"
                {...form.getInputProps("capacity")}
                required
                className="text-danger mt-1"
                id="role-name"
              />
            </div>
            <div>
              <div className="col-lg-12 mb-3">
                <span className="fw-bold text-secondary">
                  Upload Registration Certificate
                </span>
                <div className="upload-documents">
                  <div className="upload-logo">
                    {fileUpload || vehicleData.document_url ? (
                      <img
                        src={
                          fileUpload
                            ? URL.createObjectURL(fileUpload)
                            : vehicleData?.document_url
                        }
                        alt=""
                        className="uploaded-vehicle-image"
                      />
                    ) : (
                      <IconCloudUpload size={40} color="grey" />
                    )}
                  </div>

                  <div className="upload-image-container">
                    <input
                      accept=".pdf, .jpg, .jpeg, .csv, .png"
                      type="file"
                      id="upload"
                      onChange={handleUploadedFile}
                    />
                    {fileUpload || vehicleData.document_url ? (
                      <>
                        <label
                          htmlFor="upload"
                          className="fw-bold"
                          style={{ cursor: "pointer" }}
                        >
                          {fileUpload
                            ? fileUpload.name
                            : vehicleData && vehicleData?.document_url
                              ? vehicleData?.registration_certificate.split("/").pop()
                              : "Click here to upload your document (pdf, jpg or png)"}
                        </label>
                        {fileUpload || vehicleData ? (
                          <Tooltip
                            label="Preview"
                            color="#DB3525"
                            arrowSize={6}
                            withArrow
                            position="right"
                          >
                            <a
                              href={
                                vehicleData?.document_url
                                  ? vehicleData?.document_url
                                  : URL.createObjectURL(fileUpload)
                              }
                              target="_blank"
                              rel="noreferrer"
                            >
                              <IconEye style={{ marginLeft: "20px" }} />
                            </a>
                          </Tooltip>
                        ) : null}{fileUpload ? (
                          <IconTrash
                            style={{
                              paddingBottom: "1px",
                              marginLeft: "10px",
                              color: "red",
                              cursor: "pointer",
                            }}
                            onClick={() => removeCertificateImage()}
                          />
                        ) : null}
                      </>
                    ) : (
                      <div className="d-flex flex-column ">
                        <label
                          htmlFor="upload"
                          className="fw-bold"
                          style={{
                            cursor: "pointer",
                            textDecoration: "underline",
                            color: "#002699",
                          }}
                        >
                          Click here to upload
                        </label>

                        <span
                          style={{
                            color: "grey",
                          }}
                        >
                          Supported format: pdf, jpeg, CSV, png
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {fileError ? (
                  <span className="m-8f816625 mt-3">
                    Upload jpg, jpeg, png only.{" "}
                  </span>
                ) : null}
              </div>
            </div>
            </div>
            </div>

            <div className="col-md-12 col-lg-4">
            <div className="row routeDriverSection">
              <label
                className="fw-bold fs-5 text-secondary mb-3"
                htmlFor="role-type"
              >
                Assign Route & Driver
              </label>

              <div className="form-group text-start mb-3 col-lg-12">
                <label
                  className="fw-bold text-secondary mb-1"
                  htmlFor="role-type"
                >
                  Role Type *
                </label>
                <br />
                <select
                  className="normalSelect"
                  onChange={(e) => onSelectRole(e)}
                  value={roleID !== null ? roleID : ""}
                >
                  <option value="">--Select--</option>
                  {rolesList?.map((role, index) => (
                    <option key={index} value={role.role_id}>
                      {" "}
                      {role.role_name}{" "}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group text-start mb-3 col-lg-12">
                <label
                  className="fw-bold text-secondary mb-1"
                  htmlFor="role-type"
                >
                  Driver *
                </label>
                <br />
                <select
                  className="normalSelect"
                  onChange={(e) => onSelectUser(e)}
                  value={userID !== null ? userID : ""}
                >
                  <option value="">--Select--</option>
                  {usersList?.map((user, index) => (
                    <option key={index} value={user.user_id}>
                      {" "}
                      {user.display_name}{" "}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group text-start mb-3 col-lg-12">
                <label
                  className="fw-bold text-secondary mb-1"
                  htmlFor="role-type"
                >
                  Route *
                </label>
                <br />
                <select
                  className="normalSelect"
                  onChange={(e) => onSelectRoute(e)}
                  value={routeID !== null ? routeID : ""}
                >
                  <option value="">--Select--</option>
                  {routeList?.map((routes, index) => (
                    <option key={index} value={routes.route_id}>
                      {" "}
                      {routes.route_no} ({routes.starting_point}-
                      {routes.ending_point}){" "}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            </div>

          </div>




          {state?.rowData.vehicle_id ? (
            <button
              className="btn add-button mt-3"
              type="submit"
              style={{ color: "#fff" }}
            >
              Update
            </button>
          ) : (
            <button
              className="btn add-button mt-3 mb-2"
              type="submit"
              style={{ color: "#fff" }}
            >
              Add
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default VehicleForm;
