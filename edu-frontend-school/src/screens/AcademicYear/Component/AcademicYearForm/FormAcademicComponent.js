//FormAcademicComponent

import React, { useEffect, useState } from "react";
import { IconChevronLeft } from "@tabler/icons-react";
import { useNavigate, useLocation } from "react-router-dom";
import "./FormAcademicComponent.css";
import { NumberInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Calendar } from "primereact/calendar";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import * as addAcademicYearService from "../../AcademicYear.service";
import ToastUtility from "../../../../utility/ToastUtility";
import moment from "moment";
import { useAuth } from "../../../../context/AuthContext";
import { getLoggedInUserDetails } from "../../../../shared/services/common.service";
import { PatternFormat } from "react-number-format";
import * as authService from "../../../auth/auth.service";

const FormAcademicComponent = () => {
  const { login, addUserDetailsToContext } = useAuth();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [academicYearData, setAcademicYearData] = useState({});
  const [session, setSession] = useState(null);

  const [calculatedStartDate, setCalculatedStartDate] = useState(null);
  const [calculatedEndDate, setCalculatedEndDate] = useState(null);
  const { userDetails, logout, addAcademicYearToContext } = useAuth();
  const navigate = useNavigate();

  const { state } = useLocation();

  const goBackToAcademicYearPage = () => {
    navigate("/academicyear");
  };

  const form = useForm({
    initialValues: {
      academic_year_name: "",
    },
  });

  const logOut = async () => {
    const logoutResponse = await authService.logout();
    if (logoutResponse) {
      await logout();
      navigate("/login");
    }
  };

  const onSubmit = async () => {
    if (state?.rowData.academic_year_id) {
      const payload = {
        academic_year_id: state?.rowData.academic_year_id,
        academic_year_name: session,
        start_date: moment(startDate).format("YYYY-MM-DD"),
        end_date: moment(endDate).format("YYYY-MM-DD"),
      };

      const updateAcademicYearResponse =
        await addAcademicYearService.updateAcademicYear(payload);

      if (!updateAcademicYearResponse.error) {
        await logOut()
        ToastUtility.success("Academic year updated successfully into your system.Kindly Login again");
      }
    } else {
      const payload = {
        academic_year_name: session,
        start_date: moment(
          startDate !== null ? startDate : calculatedStartDate
        ).format("YYYY-MM-DD"),
        end_date: moment(endDate !== null ? endDate : calculatedEndDate).format(
          "YYYY-MM-DD"
        ),
      };

      const addAcademicYearResponse =
        await addAcademicYearService.AddAcademicYear(payload);

      if (!addAcademicYearResponse.error) {
        await getLoggedInUserDetails(addUserDetailsToContext); 
        await logOut()
        ToastUtility.success("Academic year added successfully your system.Kindly Login again");
      } else {
        ToastUtility.error("Please Add Proper Academic Year");
      }
    }
  };

  const getAcademicYearBYId = async (academicYearId) => {
    const getAcademicYearByAcademicYearResponse =
      await addAcademicYearService.getAcademicYearByAcademicId(academicYearId);
    if (!getAcademicYearByAcademicYearResponse.error) {
      setAcademicYearData(getAcademicYearByAcademicYearResponse.data);
    } else {
    }
  };

  useEffect(() => {
    if (state?.rowData.academic_year_id) {
      getAcademicYearBYId(state?.rowData.academic_year_id);
    }
  }, []);

  useEffect(() => {
    if (academicYearData[0]) {
      setSession(academicYearData[0]?.academic_year_name);
      const startDateObject = moment(academicYearData[0]?.start_date).toDate();
      const endDateObject = moment(academicYearData[0]?.end_date).toDate();

      setStartDate(startDateObject);
      setEndDate(endDateObject);
    }
  }, [academicYearData[0]]);

  useEffect(() => {
    if (session) {
      const currentYear = moment().year();
      const startYear = parseInt(session.split("-")[0]);
      const endYear = parseInt(session.split("-")[1]);

      const startDateObject = moment(`${startYear}-04-01`).toDate();
      const endDateObject = moment(`${endYear}-02-28`).toDate();

      setCalculatedStartDate(startDateObject);
      setCalculatedEndDate(endDateObject);
    }
  }, [session]);

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center">
        <IconChevronLeft
          size={30}
          onClick={goBackToAcademicYearPage}
          style={{ cursor: "pointer" }}
          color="black"
        />
        <span
          className="fw-bold"
          style={{ fontSize: "20px", marginLeft: "10px" }}
        >
          {state?.rowData.academic_year_id
            ? "Update Academic Year"
            : "Add Academic Year"}
        </span>
      </div>
      <div className="add-organization-container mx-2 pt-2">
        <form onSubmit={form.onSubmit(onSubmit)}>
          <div className="row mt-5">
            <div className="form-group text-start mb-3 col-lg-6">
              <label className="fw-bold text-secondary" htmlFor="academic-year">
                Academic Year*
              </label>
              {/* <TextInput
                size="lg"
                placeholder="YYYY-YYYY"
                {...form.getInputProps("academic_year_name")}
                required
                className="text-danger mt-1"
                id="academic-year"
              /> */}
              <PatternFormat
                placeholder="YYYY-YYYY"
                className="p-2 mt-1"
                format="####-####"
                value={session}
                onChange={(e) => setSession(e.target.value)}
              />
            </div>
          </div>
          <div className="row mt-2">
            <div className="form-group text-start mb-3 col-lg-6">
              <label
                className="fw-bold text-secondary mb-1"
                htmlFor="role-type"
              >
                Start Date*
              </label>
              <br />
              <Calendar
                placeholder="--Select--"
                // value={startDate}
                // onChange={(e) => setStartDate(e.value)}
                value={startDate || calculatedStartDate}
                onChange={(e) => setStartDate(e.value)}
                showIcon
                dateFormat="dd/mm/yy"
                required
              />
            </div>

            <div className="form-group text-start mb-3 col-lg-6">
              <label
                className="fw-bold text-secondary mb-1"
                htmlFor="role-type"
              >
                End Date*
              </label>
              <br />
              <Calendar
                // value={endDate}
                // placeholder="--Select--"
                // onChange={(e) => setEndDate(e.value)}
                value={endDate || calculatedEndDate}
                placeholder="--Select--"
                onChange={(e) => setEndDate(e.value)}
                showIcon
                dateFormat="dd/mm/yy"
                required
              />
            </div>
          </div>
          {state?.rowData.academic_year_id ? (
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

export default FormAcademicComponent;
