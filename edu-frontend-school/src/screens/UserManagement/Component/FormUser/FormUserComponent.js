import React, { useEffect, useState } from "react";
import { IconCalendar, IconChevronLeft } from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router-dom";
import "./FormUserComponent.css";
import { NativeSelect, NumberInput, TextInput, rem } from "@mantine/core";
import { useForm } from "@mantine/form";
import * as addUserService from "../../UserManagement.service";
import { Calendar } from "primereact/calendar";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import ToastUtility from "../../../../utility/ToastUtility";
import { encrypt, encryptUserID } from "../../../../utility/EncrytDecrypt";
import { useAuth } from "../../../../context/AuthContext";

const FormUserComponent = () => {
  const [date, setDate] = useState(null);

  const [rolesList, setRolesList] = useState([]);
  const [trustsList, setTrustsList] = useState([]);
  const [schoolsList, setSchoolsList] = useState([]);

  const [trusts, setTrusts] = useState([]);
  const [roles, setRoles] = useState([]);
  const [schools, setSchools] = useState([]);

  const [roleLevel, setRoleLevel] = useState([]);
  const [showUser, setShowUser] = useState(false);

  const [userData, setUserData] = useState({});

  const [roleID, setRoleID] = useState(null);
  const [trustID, setTrustID] = useState(null);
  const [schoolID, setSchoolID] = useState(null);

  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const navigate = useNavigate();

  const { state } = useLocation();
  const { userDetails, logout } = useAuth();
  const goBackToUserManagementPage = () => {
    navigate("/usermanagement");
  };

  const form = useForm({
    initialValues: {
      first_name: "",
      last_name: "",
      email_id: "",
      mobile_number: "",
      role_name: "--Select--",
      gender: "--Select--",
      organization_name: "--Select--",
      school_name: "--Select--",
      dateOfBirth: "",
    },

    validate: {
      first_name: (value) =>
        value.length < 3 ? "First Name is too short" : null,

      email_id: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      mobile_number: (value) =>
        value.toString().length !== 10
          ? "Mobile No. should be 10 digits"
          : null,
    },
  });

  const getRoles = async () => {
    const getLevelsResponse = await addUserService.getRolesList();
    const rolesData = [getLevelsResponse.data];
    setRolesList(...rolesData);
  };

  const getTrusts = async () => {
    const getTrustsResponse = await addUserService.getTrustsList();
    const trustData = [getTrustsResponse.data];
    setTrustsList(...trustData);
  };

  const getSchools = async () => {
    const getSchoolsResponse = await addUserService.getSchoolList();
    const schoolData = [getSchoolsResponse.data];
    setSchoolsList(...schoolData);
  };

  useEffect(() => {
    getRoles();
    if (userDetails.role_name == "Super Admin") {
      getTrusts();
    }
    if (userDetails.user_level == "Trust") {
      getSchools();
    }
  }, []);

  useEffect(() => {
    trustsList?.map((trust) =>
      setTrusts((prevData) => [...prevData, trust.trust_name])
    );
    rolesList?.map((roleArray) =>
      setRoles((prevData) => [...prevData, roleArray.role_name])
    );
    schoolsList?.map((school) =>
      setSchools((prevData) => [...prevData, school.school_name])
    );
  }, [trustsList, rolesList, schoolsList]);

  useEffect(() => {
    rolesList?.map((roleArray) =>
      setRoleLevel((prevData) => [...prevData, roleArray.level])
    );
  }, [roleID]);

  const onSelectRole = async (e) => {
    setRoleID(e.target.value);
    setShowUser(true);
  };

  const onSelectTrustName = async (e) => {
    setTrustID(e.target.value);
  };

  const onSelectSchoolName = async (e) => {
    setSchoolID(e?.target?.value);
  };

  useEffect(() => {
    form.setValues({
      first_name: userData?.first_name || "",
      last_name: userData?.last_name || "",
      email_id: userData?.email_id || "",
      mobile_number: userData?.mobile_number || "",
    });

    setRoleID(userData?.role_id || null);
    if (userData.school_id != null) {
      setShowUser(true);
    }
    setSchoolID(userData.school_id);
    if (userData.trust_id && userData.school_id == null) {
      setShowUser(true);
      setTrustID(userData.trust_id || null);
    }
  }, [userData]);

  const onSubmit = async () => {
    if (state?.rowData.user_id) {
      const { first_name, last_name, email_id, is_active } = form.values;
      const userID = state?.rowData.user_id;
      const hashedUserID = await encrypt(userID.toString());

      const payload = {
        user_id: hashedUserID,
        first_name: first_name,
        last_name: last_name,
        email_id: email_id,
        role_id: parseInt(roleID),
        trust_id: parseInt(trustID),
        school_id: parseInt(schoolID),
        is_active: is_active,
      };

      const updateResponse = await addUserService.updateUser(payload);
      if (!updateResponse.error) {
        ToastUtility.success("User updated successfully");
        if (updateResponse.data) {
          navigate("/usermanagement");
        }
      } else {
        ToastUtility.info("Please try again with proper details");
      }
    } else {
      const {
        first_name,
        last_name,
        email_id,
        mobile_number,
        dateOfBirth,
        gender,
      } = form.values;
      const payload = {
        first_name: first_name,
        last_name: last_name,
        email_id: email_id,
        mobile_number: mobile_number,
        date_of_birth: dateOfBirth,
        gender: gender,
        role_id: parseInt(roleID),
        trust_id: parseInt(trustID),
        school_id: parseInt(schoolID),
      };

      const addresponse = await addUserService.addUser(payload);
      if (!addresponse.error) {
        ToastUtility.success("User Created Succesfully");
        navigate("/usermanagement");
      } else {
        ToastUtility.info("Please try again with proper details");
      }
    }
  };

  const getDataByUserId = async (userID) => {
    const getUserByUserIdResponse = await addUserService.getUserByUserId(
      userID
    );
    if (!getUserByUserIdResponse.error) {
      setUserData(getUserByUserIdResponse.data);
      setIsUpdateMode(true);
    } else {
      ToastUtility.error("No data found for this Trust ID!");
    }
  };

  useEffect(() => {
    if (state?.rowData.user_id) {
      getDataByUserId(state?.rowData.user_id);
    }
  }, []);

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center">
        <IconChevronLeft
          size={30}
          onClick={goBackToUserManagementPage}
          style={{ cursor: "pointer" }}
          color="black"
        />
        <span
          className="fw-bold"
          style={{ fontSize: "20px", marginLeft: "10px" }}
        >
          {state?.rowData.user_id ? "Update Staff" : "Add Staff"}{" "}
        </span>
      </div>
      <div className="add-organization-container mx-2 pt-2">
        <form onSubmit={form.onSubmit(onSubmit)}>
          <div className="row mt-5">
            <div className="form-group text-start mb-3 col-lg-6">
              <label className="fw-bold text-secondary" htmlFor="first-name">
                First Name *
              </label>
              <TextInput
                size="lg"
                placeholder="Enter here"
                {...form.getInputProps("first_name")}
                required
                className="text-danger mt-1"
                id="first-name"
              />
            </div>
            <div className="form-group text-start mb-3 col-lg-6">
              <label className="fw-bold text-secondary" htmlFor="last-name">
                Last Name
              </label>
              <TextInput
                size="lg"
                placeholder="Enter here"
                {...form.getInputProps("last_name")}
                className="text-danger mt-1"
                id="last-name"
              />
            </div>

            <div className="form-group text-start mb-3 col-lg-6">
              <label className="fw-bold text-secondary" htmlFor="email">
                Email *
              </label>
              <TextInput
                size="lg"
                placeholder="Enter here"
                {...form.getInputProps("email_id")}
                required
                className="text-danger mt-1"
                id="email"
              />
            </div>
            <div className="form-group text-start mb-3 col-lg-6">
              <label className="fw-bold text-secondary" htmlFor="mobileNumber">
                Mobile Number *
              </label>
              <NumberInput
                size="lg"
                placeholder="Enter here"
                {...form.getInputProps("mobile_number")}
                maxLength={10}
                hideControls
                disabled={isUpdateMode}
                required
                className="text-danger mt-1"
                id="mobileNumber"
              />
            </div>

            <div className="form-group text-start mb-3 col-lg-6">
              <label
                className="fw-bold text-secondary mb-1"
                htmlFor="role-type"
              >
                Role *
              </label>
              <br />
              <select
                className="normalSelect"
                onChange={(e) => onSelectRole(e)}
                value={roleID !== null ? roleID : ""}
                disabled={isUpdateMode}
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

            {roleLevel.includes("Trust") && showUser ? (
              <div className="form-group text-start mb-3 col-lg-6">
                <label
                  className="fw-bold text-secondary mb-1"
                  htmlFor="role-type"
                >
                  Organization Name *
                </label>
                <br />
                <select
                  className="normalSelect"
                  onChange={(e) => onSelectTrustName(e)}
                  value={trustID !== null ? trustID : ""}
                >
                  <option>--Select--</option>
                  {trustsList?.map((trust, index) => (
                    <option key={index} value={trust.trust_id}>
                      {" "}
                      {trust.trust_name}{" "}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            {roleLevel.includes("School") && showUser ? (
              <div className="form-group text-start mb-3 col-lg-6">
                <label
                  className="fw-bold text-secondary mb-1"
                  htmlFor="role-type"
                >
                  School Name *
                </label>
                <br />
                <select
                  className="normalSelect"
                  onChange={(e) => onSelectSchoolName(e)}
                  value={schoolID !== null ? schoolID : ""}
                >
                  <option>--Select--</option>
                  {schoolsList?.map((school, index) => (
                    <option key={index} value={school.school_id}>
                      {" "}
                      {school.school_name}{" "}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
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
              Add
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default FormUserComponent;
