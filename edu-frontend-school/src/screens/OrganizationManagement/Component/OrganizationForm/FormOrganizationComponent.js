import React, { useEffect, useState } from "react";
import { IconChevronLeft, IconCloudUpload } from "@tabler/icons-react";
import { useNavigate, useLocation } from "react-router-dom";
import "./FormOrganizationComponent.css";
import { NumberInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import * as addOrganizationService from "../../Organization.service";
import { toast } from "react-toastify";
import ToastUtility from "../../../../utility/ToastUtility";

const FormOrganizationManagement = () => {
  const [fileUpload, setFileUpload] = useState(null);
  const [fileError, setFileError] = useState(false);
  const [organizationData, setOrganizationData] = useState({});
  const formData = new FormData();
  const { state } = useLocation();

  const navigate = useNavigate();
  const goBackToOrganizationManagementPage = () => {
    navigate("/organizationmanagement");
  };

  const form = useForm({
    initialValues: {
      trust_name: "",
      email: "",
      contact_no: "",
      address: "",
    },

    validate: {
      trust_name: (value) =>
        value.length < 3
          ? "Organization name must be minimum 3 letters "
          : null,
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid Email id"),
      contact_no: (value) =>
        value.length <= 3 || value.length > 15
          ? "Please enter valid contact number"
          : null,
      address: (value) => (value === "" ? "Please enter" : null),
    },
  });

  const handleUploadedImage = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const validformats = ["jpg", "jpeg", "png"];
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

  const handleDigits = (e) => {
    const isAllowedKey = /^[0-9()-]$/.test(e.key);
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

  const onSubmit = async () => {
    if (state?.rowData.trust_id) {
      const { trust_name, address, contact_no, email } = form.values;

      const payload = {
        trust_id: state?.rowData.trust_id,
        trust_name: trust_name,
        address: address,
        contact_no: contact_no,
        email: email,
      };

      formData.append("trust_data", JSON.stringify(payload));

      const upDateResponse = await addOrganizationService.upDateOrganization(
        formData
      );
      if (!upDateResponse.error) {
        ToastUtility.success("Organization updated successfully");
        if (upDateResponse.data) {
          navigate("/organizationmanagement");
        }
      } else {
        ToastUtility.info("Please try again with proper details");
      }
    } else {
      const { trust_name, email, contact_no, address } = form.values;

      const trust_data = {
        trust_name: trust_name,
        contact_no: contact_no,
        email: email,
        address: address,
      };

      formData.append("trust_data", JSON.stringify(trust_data));
      const addResponse = await addOrganizationService.AddOrganization(
        formData
      );

      if (!addResponse.error) {
        toast.success("Trust added successfully");
        if (addResponse?.data[0]?.trust_id !== "") {
          navigate("/organizationmanagement");
        }
      } else {
        ToastUtility.info("Please try again with proper details");
      }
    }
  };

  const getDataByTrustId = async (trustId) => {
    const getTrustByTrustIdResponse =
      await addOrganizationService.getTrustByTrustId(trustId);
    if (!getTrustByTrustIdResponse.error) {
      setOrganizationData(getTrustByTrustIdResponse.data);
    } else {
      console.log("No data found for this Trust ID!");
    }
  };

  useEffect(() => {
    if (state?.rowData.trust_id) {
      getDataByTrustId(state?.rowData.trust_id);
    }
  }, []);

  useEffect(() => {
    form.setValues(organizationData);
  }, [organizationData]);

  return (
    <div className="container-fluid ">
      {/* <div className="d-flex align-items-center">
        <IconChevronLeft
          size={30}
          onClick={goBackToOrganizationManagementPage}
          style={{ cursor: "pointer" }}
          color="blue"
        />
        <span
          className="fw-bold "
          style={{ fontSize: "20px", marginLeft: "10px" }}
        >
          {state?.rowData.trust_id ? "Update Organization" : "Add Organization"}
        </span>
      </div> */}
      <div className="add-organization-container mx-2">
        <span className="fw-bold" style={{ fontSize: "20px" }}>
          Organization
        </span>
        {/* <div className="d-flex align-items-center">
          <div className="upload-logo">
            {fileUpload ? (
              <img
                src={URL.createObjectURL(fileUpload)}
                alt="profile"
                className="uploaded-image"
              />
            ) : (
              <IconCloudUpload size={40} color="grey" />
            )}
          </div>

          <div className="upload-image-container">
            <input
              accept="image/png,image/jpeg"
              type="file"
              id="upload"
              onChange={handleUploadedImage}
            />
            {fileUpload ? (
              <label
                htmlFor="upload"
                className="fw-bold"
                style={{ cursor: "pointer" }}
              >
                {fileUpload.name}
              </label>
            ) : (
              <label
                htmlFor="upload"
                className="fw-bold"
                style={{ cursor: "pointer" }}
              >
                Click here to upload logo
              </label>
            )}
          </div>
        </div>
        {fileError ? (
          <span className="m-8f816625 mt-2">Upload jpg, jpeg, png only. </span>
        ) : null} */}

        <form onSubmit={form.onSubmit(onSubmit)}>
          <div className="row mt-5">
            <div className="form-group text-start mb-3 col-lg-6">
              <label className="fw-bold text-secondary" htmlFor="org-name">
                Organization Name *
              </label>
              <TextInput
                placeholder="Enter here"
                {...form.getInputProps("trust_name")}
                required
                className="text-danger mt-1"
                id="org-name"
              />
            </div>
            <div className="form-group text-start mb-3 col-lg-6">
              <label className="fw-bold text-secondary" htmlFor="email">
                Email *
              </label>
              <TextInput
                placeholder="Enter here"
                {...form.getInputProps("email")}
                required
                className="text-danger mt-1"
                id="email"
              />
            </div>
            <div className="form-group text-start mb-3 col-lg-6">
              <label className="fw-bold text-secondary" htmlFor="mobileNumber">
                Contact Number *
              </label>
              <TextInput
                placeholder="Enter here"
                {...form.getInputProps("contact_no")}
                maxLength={15}
                hideControls
                required
                className="text-danger mt-1"
                id="mobileNumber"
                onKeyDown={handleDigits}
              />
            </div>
            <div className="form-group text-start mb-3 col-lg-6">
              <label className="fw-bold text-secondary" htmlFor="address">
                Address *
              </label>
              <TextInput
                placeholder="Enter here"
                {...form.getInputProps("address")}
                required
                className="text-danger mt-1"
                id="address"
              />
            </div>
          </div>
          {state?.rowData ? (
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
            >
              Create
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default FormOrganizationManagement;
