import React, { useState, useEffect } from "react";
import "./BasicDetails.scss";
import * as RegistrationService from "../../RegistrationService";
import * as Yup from "yup";
import { useForm, yupResolver } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import {
  categoryOptions,
  genderList,
  genderOptions,
  nationalityOptions,
  religionOptions,
} from "../../../../Const/Constants";
import { Text } from "@mantine/core";
import ToastUtility from "../../../../utility/ToastUtility";
import moment from "moment";

const BasicDetails = () => {
  const [presentAddressCheck, setPresentAddressCheck] = useState(false);
  const [statesList, setStatesList] = useState();
  const [permanentDistrictsList, setPermanentDistrictsList] = useState([]);
  const [currentDistrictsList, setCurrentDistrictsList] = useState([]);
  const [sameAsCurrent, setSameAsCurrent] = useState(false);
  const [permanentBlockList, setPermanentBlockList] = useState([]);
  const [currentBlockList, setCurrentBlockList] = useState([]);
  const [classList, setClassList] = useState([]);

  const [payLoad, setPayLoad] = useState({
    first_name: "",
    father_name: "",
    mother_name: "",
    current_address: "",
    permanent_address: "",
    gender_id: "",
    mobile_number: "",
    alternate_mobile_number: "",
    email_id: "",
    religion: "",
    caste: "",
    class_id: " ",
    caste_category: "",
    dob: "",
    nationality: "",
    current_address_state_id: "",
    current_address_district_id: "",
    current_address_city: "",
    current_address_pincode: "",
    permanent_address_state_id: "",
    permanent_address_district_id: "",
    permanent_address_city: "",
    permanent_address_pincode: "",
  });

  const schema = Yup.object().shape({
    first_name: Yup.string().required("Full name is required"),
    father_name: Yup.string().required("Father name is required"),
    mother_name: Yup.string().required("Mother name is required"),
    class_id: Yup.number()
      .required("Class is required")
      .typeError("Class is required"),
    gender_id: Yup.number()
      .required("Gender is required")
      .typeError("Gender is required"),
    mobile_number: Yup.string()
      .matches(/^[6-9]\d{9}$/, "Invalid Mobile Number")
      .required("Invalid Mobile Number"),
    // alternate_mobile_number: Yup.string()
    //   .matches(/^[6-9]\d{9}$/, "Invalid Mobile Number")
    //   .required("Mobile Number Required"),
    //  age: Yup.number().integer().required("Age is required"),

    // email_id: Yup.string()
    //   .email()
    //   .required("Email-id is required")
    //   .matches(
    //     /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/,
    //     "Email-id is required "
    //   ),
    religion: Yup.string().required("Religion is required"),
    caste: Yup.string().required("Caste is required"),
    // photo_url: Yup.string().trim(),
    caste_category: Yup.string()
      .typeError("Caste is required")
      .required("Caste is required"),
    current_address_state_id: Yup.number()
      .required("State is required")
      .typeError("State is required"),

    current_address_district_id: Yup.number()
      .typeError("District is required")
      .required("District is required"),
    current_address_city: Yup.string().required("City is required"),
    current_address: Yup.string().required("Address is  required"),
    current_address_pincode: Yup.string().required("Pincode is required")
    .matches(/^\d{6}$/, 'Pincode must be exactly 6 digits'),

    permanent_address: Yup.string().required("Address is required"),
    permanent_address_state_id: Yup.number()
      .required("State is required")
      .typeError("State is required"),
    permanent_address_district_id: Yup.number()
      .required("District is required")
      .typeError("District is required"),
    permanent_address_pincode: Yup.string().required("Pincode is required")
    .matches(/^\d{6}$/, 'Pincode must be exactly 6 digits'),
    permanent_address_city: Yup.string().required("City is required"),
    dob: Yup.string().required("Select Dob"),

    nationality: Yup.string()
      .typeError("Nationality is required")
      .required("Nationality is required"),
  });

  const form = useForm({
    validate: yupResolver(schema),
    initialValues: payLoad,
  });

  const getStatesList = async () => {
    const getStatesListResponse = await RegistrationService.getStatesList();
    if (!getStatesListResponse.error) {
      setStatesList(getStatesListResponse.data);
    }
  };

  const getClassesList = async () => {
    const getClassResponse = await RegistrationService.getClassList();
    setClassList(getClassResponse.data);
  };

  useEffect(() => {
    getStatesList();
  }, []);

  useEffect(() => {
    getClassesList();
  }, []);

  const handleDistrictChange = async (districtId, type) => {
    try {
      const response = await RegistrationService.getBlocksList(districtId);
      if (type === "current") setCurrentBlockList(response.data || []);
      else if (type === "permanent") setPermanentBlockList(response.data || []);
    } catch (error) {
      console.error("Error fetching districts for ${type} address:", error);
    }
  };

  const handleStateChange = async (stateId, type) => {
    try {
      const response = await RegistrationService.getDistrictsList(stateId);
      if (type === "current") setCurrentDistrictsList(response.data || []);
      else if (type === "permanent")
        setPermanentDistrictsList(response.data || []);
    } catch (error) {
      console.error("Error fetching districts for ${type} address:", error);
    }
  };

  const handleSameAsCurrent = () => {
    setSameAsCurrent(!sameAsCurrent);
  };

  useEffect(() => {
    if (form.values.current_address_state_id)
      handleStateChange(form.values.current_address_state_id, "current");
  }, [form.values.current_address_state_id, "current"]);

  useEffect(() => {
    if (form.values.permanent_address_state_id)
      handleStateChange(form.values.permanent_address_state_id, "permanent");
  }, [form.values.permanent_address_state_id, "permanent"]);

  useEffect(() => {
    if (form.values.current_district_id)
      handleDistrictChange(form.values.current_address_district_id, "current");
  }, [form.values.current_address_district_id, "current"]);

  useEffect(() => {
    if (form.values.permanent_district_id)
      handleDistrictChange(
        form.values.permanent_address_district_id,
        "permanent"
      );
  }, [form.values.permanent_address_district_id, "permanent"]);

  useEffect(() => {
    if (sameAsCurrent) {
      form.setFieldValue("permanent_address", form.values.current_address);
      form.setFieldValue(
        "permanent_address_state_id",
        form.values.current_address_state_id
      );
      form.setFieldValue(
        "permanent_address_district_id",
        form.values.current_address_district_id
      );
      form.setFieldValue(
        "permanent_address_city",
        form.values.current_address_city
      );
      form.setFieldValue(
        "permanent_address_pincode",
        form.values.current_address_pincode
      );
    }
  }, [
    form.values.current_address,
    form.values.current_address_state_id,
    form.values.current_address_district_id,
    form.values.current_address_block_id,
    form.values.current_address_city,
    form.values.current_address_pincode,
    sameAsCurrent,
  ]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    form.setFieldValue(name, value);
  };

  const handleSubmit = async (payload) => {
    const addStudentRegistrationResponse =
      await RegistrationService.addStudentRegistration(payload);

    if (!addStudentRegistrationResponse.error) {
      ToastUtility.success("Student registration successful.");
      navigate("/");
    } else {
      // ToastUtility.error(
      //   "Failed to register student. Please check the details."
      // );
    }
  };

  const navigate = useNavigate();

  return (
    <div className="container mt-5 basicDetails">
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        
        <h2>Basic Details</h2>

        <div className="row mb-3">
          <div className="col-md-4">
            <label htmlFor="first_name" className="form-label">
              Full Name*
            </label>
            <input
              type="text"
              className="form-control form-input"
              id="first_name"
              name="first_name"
              placeholder="Enter here"
              onChange={handleChange}
            />
            {form.errors && form.isTouched && form.errors.first_name && (
              <p class="form-error">{form.errors.first_name}</p>
            )}
          </div>
          <div className="col-md-4">
            <label htmlFor="father_name" className="form-label">
              Father's Name*
            </label>
            <input
              type="text"
              className="form-control  form-input"
              id="father_name"
              name="father_name"
              placeholder="Enter here"
              onChange={handleChange}
            />
            {form.errors && form.errors.father_name && (
              <p class="form-error">{form.errors.father_name}</p>
            )}
          </div>
          <div className="col-md-4">
            <label htmlFor="mother_name" className="form-label">
              Mother's Name*
            </label>
            <input
              type="text"
              className="form-control  form-input"
              id="mother_name"
              name="mother_name"
              placeholder="Enter here"
              onChange={handleChange}
            />
            {form.errors && form.errors.mother_name && (
              <p class="form-error">{form.errors.mother_name}</p>
            )}
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-md-4">
            <label for="class_id" class="form-label">
              Class*
            </label>
            <select
              className="form-select form-input"
              id="class_id"
              name="class_id"
              onChange={handleChange}
            >
              <option key="default" value="">
                --Select--
              </option>{" "}
              {classList &&
                classList.length > 0 &&
                classList.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
            </select>
            {form.errors && form.errors.class_id && (
              <p class="form-error">{form.errors.class_id}</p>
            )}
          </div>
          <div className="col-md-4">
            <label htmlFor="gender_id" className="form-label">
              Gender*
            </label>
            <select
              className="form-select form-input"
              id="gender_id"
              name="gender_id"
              onChange={handleChange}
            >
              <option key="default" value="">
                --Select--
              </option>{" "}
              {genderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {form.errors && form.errors.gender_id && (
              <p class="form-error">{form.errors.gender_id}</p>
            )}
          </div>
          <div class="col-md-4">
            <label for="dob" class="form-label">
              Date of Birth*
            </label>

            <input
              type="date"
              class="form-control form-input"
              id="dob"
              name="dob"
              onChange={handleChange}
              min={moment().subtract(18, "years").format("YYYY-MM-DD")}
            />
            {form.errors && form.errors.dob && (
              <p class="form-error">{form.errors.dob}</p>
            )}
          </div>
        </div>
        <div class="row mb-3">
          {/* <div class="col-md-4">
            <label for="age" class="form-label">
              Age
            </label>
            <input
              type="text"
              class="form-control form-input"
              id="age"
              name="age"
              placeholder="Enter your age"
              onChange={handleChange}
              // disabled
              values={moment().diff(form.values.dob, 'years')}
            />
            {form.errors && form.errors.age && (
              <Text color="red">{form.errors.age}</Text>
            )}
          </div> */}
          <div class="col-md-4">
            <label for="email_id" class="form-label">
              Email
            </label>
            <input
              type="email_id"
              class="form-control form-input"
              id="email_id"
              placeholder="Enter here"
              onChange={handleChange}
              name="email_id"
            />
            {/* {form.errors && form.errors.email_id && (
              <p class="form-error">{form.errors.email_id}</p>
            )} */}
          </div>
          <div class="col-md-4">
            <label for="mobile_number" class="form-label">
              Mobile Number*
            </label>
            <input
              type="text"
              class="form-control form-input"
              id="mobile_number"
              name="mobile_number"
              placeholder="Enter here"
              onChange={handleChange}
              maxLength={10}
            />
            {form.errors && form.errors.mobile_number && (
              <p class="form-error">{form.errors.mobile_number}</p>
            )}
          </div>
          <div className="col-md-4">
            <label htmlFor="alternate_mobile_number" className="form-label">
              Alternate Number
            </label>
            <input
              type="tel"
              className="form-control form-input"
              id="alternate_mobile_number"
              name="alternate_mobile_number"
              placeholder="Enter here"
              onChange={handleChange}
              maxLength={10}
            />
            {/* {form.errors && form.errors.alternate_mobile_number && (
              <p class="form-error">{form.errors.alternate_mobile_number}</p>
            )} */}
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-4">
            <label htmlFor="nationality" className="form-label">
              Nationality*
            </label>
            <select
              className="form-select form-input"
              id="nationality"
              name="nationality"
              onChange={handleChange}
            >
              <option key="default" value="">
                --Select--
              </option>{" "}
              {nationalityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {form.errors && form.errors.nationality && (
              <p class="form-error">{form.errors.nationality}</p>
            )}
          </div>
          <div className="col-md-4">
            <label htmlFor="religion" className="form-label">
              Religion*
            </label>
            <select
              className="form-select form-input"
              id="religion"
              name="religion"
              onChange={handleChange}
            >
              <option key="default" value="">
                --Select--
              </option>{" "}
              {religionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {form.errors && form.errors.religion && (
              <p class="form-error">{form.errors.religion}</p>
            )}
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-4">
            <label htmlFor="caste_category" className="form-label">
              Caste Category*
            </label>
            <select
              className="form-select form-input"
              id="caste_category"
              name="caste_category"
              onChange={handleChange}
            >
              <option key="default" value="">
                --Select--
              </option>{" "}
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {form.errors && form.errors.caste_category && (
              <p class="form-error">{form.errors.caste_category}</p>
            )}
          </div>
          <div className="col-md-4">
            <label htmlFor="caste" className="form-label">
              Caste*
            </label>
            <input
              type="text"
              className="form-control form-input"
              id="caste"
              name="caste"
              placeholder="Enter here"
              onChange={handleChange}
            />
            {form.errors && form.errors.caste && (
              <p class="form-error">{form.errors.caste}</p>
            )}
          </div>
        </div>

        <h2>Current Address</h2>

        <div className="row mb-3">
          <div className="col-md-12">
            <label htmlFor="current_address" className="form-label">
              House Number*
            </label>
            <input
              type="text"
              className="form-control form-input"
              id="current_address"
              name="current_address"
              placeholder="Enter here"
              onChange={handleChange}
            />
            {form.errors && form.errors.current_address && (
              <p class="form-error">{form.errors.current_address}</p>
            )}
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-4">
            <label htmlFor="current_address_state_id" className="form-label">
              State*
            </label>
            <select
              className="form-select form-input"
              id="current_address_state_id"
              name="current_address_state_id"
              onChange={handleChange}
            >
              <option key="default" value="">
                --Select--
              </option>{" "}
              {statesList &&
                statesList.length > 0 &&
                statesList.map((option) => (
                  <option key={option.state_id} value={option.state_id}>
                    {option.state_name}
                  </option>
                ))}
            </select>
            {form.errors && form.errors.current_address_state_id && (
              <p class="form-error">{form.errors.current_address_state_id}</p>
            )}
          </div>

          <div className="col-md-4">
            <label htmlFor="current_address_district_id" className="form-label">
              District*
            </label>
            <select
              className="form-select form-input"
              id="current_address_district_id"
              name="current_address_district_id"
              onChange={handleChange}
            >
              <option key="default" value="">
                --Select--
              </option>{" "}
              {currentDistrictsList &&
                currentDistrictsList.length > 0 &&
                currentDistrictsList.map((option) => (
                  <option key={option.district_id} value={option.district_id}>
                    {option.district_name}
                  </option>
                ))}
            </select>
            {form.errors && form.errors.current_address_district_id && (
              <p class="form-error">
                {form.errors.current_address_district_id}
              </p>
            )}
          </div>
          {/* <div className="col-md-4">
            <label htmlFor="current_block_id" className="form-label">
              Block
            </label>

            <input
              type="text"
              className="form-control form-input"
              id="current_address_city"
              placeholder="Enter here"
              name="current_address_city"
              onChange={handleChange}
            />
            {form.errors && form.errors.current_address_block_id && (
              <Text color="red">{form.errors.current_address_block_id}</Text>
            )}
          </div> */}
        </div>

        <div className="row mb-3">
          <div className="col-md-4">
            <label htmlFor="current_address_city" className="form-label">
              City*
            </label>
            <input
              type="text"
              className="form-control form-input"
              id="current_address_city"
              placeholder="Enter here"
              name="current_address_city"
              onChange={handleChange}
            />
            {form.errors && form.errors.current_address_city && (
              <p class="form-error">{form.errors.current_address_city}</p>
            )}
          </div>
          <div className="col-md-4">
            <label htmlFor="current_address_pincode" className="form-label">
              Pincode*
            </label>
            <input
              type="text"
              className="form-control form-input"
              id="current_address_pincode"
              placeholder="Enter here"
              name="current_address_pincode"
              onChange={handleChange}
              maxLength={6}
            />
            {form.errors && form.errors.current_address_pincode && (
              <p class="form-error">{form.errors.current_address_pincode}</p>
            )}
          </div>
        </div>
        <h2>Permanent Address</h2>
        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            id="sameAsCurrent"
            checked={sameAsCurrent}
            onChange={handleSameAsCurrent}
          />
          <label className="form-check-label" htmlFor="sameAsCurrent">
            Same as Current Address
          </label>
        </div>
        <div className="row mb-3">
          <div className="col-md-12">
            <label htmlFor="permanent_address" className="form-label">
              House Number*
            </label>
            <input
              type="text"
              className="form-control form-input"
              id="permanent_address"
              placeholder="Enter here"
              name="permanent_address"
              onChange={handleChange}
              disabled={sameAsCurrent}
              value={form.values.permanent_address}
            />
            {form.errors && form.errors.permanent_address && (
              <p class="form-error">{form.errors.permanent_address}</p>
            )}
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-4">
            <label htmlFor="permanent_state_id" className="form-label">
              State*
            </label>
            <select
              className="form-select form-input"
              id="permanent_address_state_id"
              name="permanent_address_state_id"
              onChange={handleChange}
              disabled={sameAsCurrent}
              value={form.values.permanent_address_state_id}
            >
              <option key="default" value="">
                --Select--
              </option>{" "}
              {statesList &&
                statesList.length > 0 &&
                statesList.map((option) => (
                  <option key={option.state_id} value={option.state_id}>
                    {option.state_name}
                  </option>
                ))}
            </select>
            {form.errors && form.errors.permanent_address_state_id && (
              <p class="form-error">{form.errors.permanent_address_state_id}</p>
            )}
          </div>
          <div className="col-md-4">
            <label htmlFor="permanent_district_id" className="form-label">
              District*
            </label>
            <select
              className="form-select form-input"
              id="permanent_address_district_id"
              name="permanent_address_district_id"
              onChange={handleChange}
              disabled={sameAsCurrent}
              value={form.values.permanent_address_district_id}
            >
              <option key="default" value="">
                --Select--
              </option>{" "}
              {permanentDistrictsList &&
                permanentDistrictsList.length > 0 &&
                permanentDistrictsList.map((option) => (
                  <option key={option.district_id} value={option.district_id}>
                    {option.district_name}
                  </option>
                ))}
            </select>
            {form.errors && form.errors.permanent_address_district_id && (
              <p class="form-error">
                {form.errors.permanent_address_district_id}
              </p>
            )}
          </div>
          {/* <div className="col-md-4">
                <label
                  htmlFor="permanent_address_block_id"
                  className="form-label"
                >
                  Block
                </label>
                <input
                  type="text"
                  className="form-control form-input"
                  id="permanent_address_block_id"
                  placeholder="Enter here"
                  name="permanent_address_block_id"
                  onChange={handleChange}
                />

                {form.errors && form.errors.permanent_address_block_id && (
                  <Text color="red">
                    {form.errors.permanent_address_block_id}
                  </Text>
                )}
              </div> */}
        </div>

        <div className="row mb-3">
          <div className="col-md-4">
            <label htmlFor="permanent_address_city" className="form-label">
              City*
            </label>
            <input
              type="text"
              className="form-control form-input"
              id="permanent_address_city"
              placeholder="Enter here"
              name="permanent_address_city"
              onChange={handleChange}
              disabled={sameAsCurrent}
              value={form.values.permanent_address_city}
            />
            {form.errors && form.errors.permanent_address_city && (
              <p class="form-error">{form.errors.permanent_address_city}</p>
            )}
          </div>
          <div className="col-md-4">
            <label htmlFor="permanent_address_pincode" className="form-label">
              Pincode*
            </label>
            <input
              type="text"
              className="form-control form-input"
              id="permanent_address_pincode"
              placeholder="Enter here"
              name="permanent_address_pincode"
              onChange={handleChange}
              disabled={sameAsCurrent}
              value={form.values.permanent_address_pincode}
              maxLength={6}
            />
            {form.errors && form.errors.permanent_address_pincode && (
              <p class="form-error">{form.errors.permanent_address_pincode}</p>
            )}
          </div>
        </div>

        <div className="pb-4">
          <button type="submit" className="btn btn-danger">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default BasicDetails;
