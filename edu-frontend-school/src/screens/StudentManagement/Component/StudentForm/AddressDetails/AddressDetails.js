import {
  Checkbox,
  Group,
  NativeSelect,
  NumberInput,
  TextInput,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import "./AddressDetails.css";
import * as addStudentService from "../../../Student.service";

const AddressDetails = ({
  active,
  prevStep,
  nextStep,
  setPayLoad,
  payLoad,
}) => {
  const [presentAddressCheck, setPresentAddressCheck] = useState(false);
  const [statesList, setStatesList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);

  const [currentDistrictsList, setCurrentDistrictsList] = useState([]);
  const [stateId, setStateId] = useState(null);
  const [districtId, setDistrictId] = useState(null);
  const [currentStateId, setCurrentStateId] = useState(null);
  const [currentDistrictId, setCurrentDistrictId] = useState(null);

  const form = useForm({
    initialValues: {
      current_address: "",
      current_address_city: "",
      current_address_pincode: "",
      permanent_address: "",
      permanent_address_city: "",
      permanent_address_pincode: "",
    },

    validate: {
      // current_address: (value) =>
      //   value.length < 1 ? "Please enter present address " : null,

      // current_address_pincode: (value) =>
      //   value?.toString().length !== 6 ? "Enter correct pincode" : null,
    },
  });

  const onSubmit = () => {
    const payLoadValues = {
      ...form.values,
      current_address_state_id: parseInt(stateId),
      current_address_district_id: parseInt(districtId),
    };

    if (presentAddressCheck) {
      payLoadValues.permanent_address_city = form.values.current_address_city;

      payLoadValues.permanent_address_district_id = parseInt(districtId);
      payLoadValues.permanent_address_state_id = parseInt(stateId);
    } else {
      setCurrentDistrictId(form.values.permanent_address_district_id);
      setCurrentStateId(form.values.permanent_address_state_id);
      payLoadValues.permanent_address_district_id = parseInt(currentDistrictId);
      payLoadValues.permanent_address_state_id = parseInt(currentStateId);
    }

    setPayLoad((prevData) => ({
      ...prevData,
      ...payLoadValues,
    }));

    nextStep();
  };

  const getStatesList = async () => {
    const getStatesListResponse = await addStudentService.getStatessList();
    if (!getStatesListResponse.error) {
      setStatesList(getStatesListResponse.data);
    }
  };

  useEffect(() => {
    getStatesList();
  }, []);

  useEffect(() => {
    if (stateId) {
      getDistrictsWiseList({ target: { value: stateId } }, "current_state");
    }
  }, [stateId]);

  const getDistrictsWiseList = async (e, addressType) => {
    if (addressType === "current_state") {
      setStateId(e.target.value);
      const getDistrictListResponse = await addStudentService.getDistrictsList(
        e.target.value
      );
      if (!getDistrictListResponse.error) {
        setDistrictsList(getDistrictListResponse.data);
      }
    } else {
      setCurrentStateId(e.target.value);
      const getCurrentDistrictListResponse =
        await addStudentService.getDistrictsList(e.target.value);
      if (!getCurrentDistrictListResponse.error) {
        setCurrentDistrictsList(getCurrentDistrictListResponse.data);
      }
    }
  };

  //new changes

  const getCurrentDistrict = async () => {
    const getCurrentDistrictListResponse =
      await addStudentService.getDistrictsList(currentStateId);
    if (!getCurrentDistrictListResponse.error) {
      setCurrentDistrictsList(getCurrentDistrictListResponse.data);
    }
  };

  useEffect(() => {
    if (currentDistrictId) {
      getCurrentDistrict();
    }
  }, [currentDistrictId]);

  //new changes

  const getBlocksWiseList = async (e, districtId) => {
    if (districtId === "current_district") {
      setDistrictId(e.target.value);
    }
    // const getBlocksListResponse = await addStudentService.getBlocksList(
    //   e.target.value
    // );
    // if (!getBlocksListResponse.error) {
    //   setBlocksList(getBlocksListResponse.data);
    // }
    else {
      setCurrentDistrictId(e.target.value);
    }
  };

  const handleCheckboxChange = (e) => {
    // setPresentAddressCheck(e.target.checked);

    if (e.target.checked) {
      setPresentAddressCheck(true);
      form.setValues({
        ...form.values,
        permanent_address: form.values.current_address,
        permanent_address_city: form.values.current_address_city,
        permanent_address_pincode: form.values.current_address_pincode,
        permanent_address_state_id: form.values.current_address_state_id,
        permanent_address_district_id: form.values.current_address_district_id,
      });
    } else {
      setPresentAddressCheck(false);
      form.setValues({
        ...form.values,
        permanent_address: "",
        permanent_address_city: "",
        permanent_address_pincode: "",
        permanent_address_state_id: "",
        permanent_address_district_id: "",
      });
    }
  };

  useEffect(() => {
    form.setValues({ ...payLoad });
    setStateId(payLoad?.current_address_state_id || "");
    setDistrictId(payLoad?.current_address_district_id || "");
    setCurrentDistrictId(payLoad?.permanent_address_district_id || "");
    setCurrentStateId(payLoad?.permanent_address_state_id || "");
  }, [payLoad]);

  useEffect(() => {
    if (
      form.values?.current_address === form.values?.permanent_address &&
      form.values?.current_address !== "" &&
      form.values?.permanent_address !== "" &&
      currentDistrictId === districtId &&
      currentDistrictId !== "" &&
      districtId !== null &&
      currentStateId === stateId &&
      currentStateId !== "" &&
      stateId !== null &&
      form.values?.current_address === form.values?.permanent_address &&
      form.values?.current_address !== "" &&
      form.values?.permanent_address !== "" &&
      form.values?.current_address_pincode ===
        form.values?.permanent_address_pincode &&
      form.values?.current_address_pincode !== "" &&
      form.values?.permanent_address_pincode !== "" &&
      form.values?.current_address_city ===
        form.values?.permanent_address_city &&
      form.values?.current_address_city !== "" &&
      form.values?.permanent_address_city !== ""
    ) {
      setPresentAddressCheck(true);
    } else {
      setPresentAddressCheck(false);
    }
  }, [statesList]);

  return (
    <div>
      <div className="container-fluid ">
        {/* <div className="add-organization-container student-details mt-4 px-3">
          <span className="student-details-label">Address Details</span> */}
        <div className="student-details-sub-container mt-3">
          <form onSubmit={form.onSubmit(onSubmit)} className="mt-3 px-2">
            <div className="current-address-container px-3">
              <span className="current-address-container-label">
                Current address
              </span>
              <div className="row mt-3 student-registration-container">
                <div className="form-group text-start mb-3 col-lg-12">
                  <label className="fw-bold text-secondary" htmlFor="flat_no">
                    House Number
                  </label>
                  <TextInput
                    size="lg"
                    placeholder="House no./ Flat no./ Bldg no."
                    {...form.getInputProps("current_address")}
                    
                    className="text-danger mt-1"
                    id="flat_no"
                  />
                </div>
                <div className="form-group text-start mb-3 col-lg-4">
                  <label className="fw-bold text-secondary" htmlFor="state">
                    State 
                  </label>
                  <br />
                  <select
                    onChange={(e) => getDistrictsWiseList(e, "current_state")}
                    className="col-lg-6"
                    id="state"
                   
                    value={stateId}
                  >
                    <option value="">Select</option>
                    {statesList?.map((state, index) => (
                      <option value={state.state_id} key={index}>
                        {state.state_name}
                      </option>
                    ))}
                  </select>
                  {/* <NativeSelect
                    size="lg"
                    placeholder="Select"
                    {...form.getInputProps("permanent_address_state_id")}
                    // required
                    data={["Select"]}
                    id="state"
                  /> */}
                </div>
                <div className="form-group text-start mb-3 col-lg-4">
                  <label className="fw-bold text-secondary" htmlFor="district">
                    District 
                  </label>
                  {/* <NativeSelect
                    size="lg"
                    placeholder="Select"
                    {...form.getInputProps("permanent_address_district_id")}
                    // required
                    data={["Select"]}
                    id="district"
                  /> */}
                  <br />

                  <select
                    onChange={(e) => getBlocksWiseList(e, "current_district")}
                    id="district"
                    value={districtId}
                  >
                    <option value="">Select</option>
                    {districtsList?.map((district, index) => (
                      <option value={district.district_id} key={index}>
                        {district.district_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* <div className="form-group text-start mb-3 col-lg-4">
                  <label className="fw-bold text-secondary" htmlFor="block">
                    Block *
                  </label>
                  <br />
                  <select onChange={getBlocksWiseList} id="block">
                    <option value="">Select</option>
                    {blocksList.map((block, index) => (
                      <option value={block.block_id} key={index}>
                        {block.block_name}
                      </option>
                    ))}
                  </select>
                </div> */}
                <div className="form-group text-start mb-3 col-lg-4">
                  <label className="fw-bold text-secondary" htmlFor="city">
                    City
                  </label>
                  <TextInput
                    size="lg"
                    placeholder="City"
                    {...form.getInputProps("current_address_city")}
                    // required
                    className="text-danger mt-1"
                    id="city"
                  />
                </div>
                <div className="form-group text-start mb-3 col-lg-4">
                  <label className="fw-bold text-secondary" htmlFor="pincode">
                    Pincode 
                  </label>
                  <NumberInput
                    size="lg"
                    placeholder="Enter here"
                    {...form.getInputProps("current_address_pincode")}
               
                    maxLength={6}
                    className="text-danger mt-1"
                    hideControls
                    id="pincode"
                  />
                </div>
              </div>
            </div>
            <div className="row student-registration-container mb-2">
              <Checkbox
                iconColor="#de5631"
                size="md"
                className="mb-3"
                label="Same as Permanent Address"
                checked={presentAddressCheck}
                onChange={handleCheckboxChange}
              />
            </div>

            <div className="current-address-container px-3">
              <span className="current-address-container-label">
                Permanent Address
              </span>
              <div className="row mt-3 student-registration-container">
                <div className="form-group text-start mb-3 col-lg-12">
                  <label
                    className="fw-bold text-secondary"
                    htmlFor="current_flat_no"
                  >
                    House Number
                  </label>
                  <TextInput
                    size="lg"
                    placeholder="House no./ Flat no./ Bldg no."
                    {...form.getInputProps("permanent_address")}
                    // required
                    className="text-danger mt-1"
                    id="current_flat_no"
                    disabled={presentAddressCheck}
                  />
                </div>
                <div className="form-group text-start mb-3 col-lg-4">
                  <label
                    className="fw-bold text-secondary"
                    htmlFor="current_state"
                  >
                    State
                  </label>
                  {/* <NativeSelect
                    size="lg"
                    placeholder="Select"
                    {...(presentAddressCheck
                      ? { ...form.getInputProps("permanent_address_state_id:") }
                      : { ...form.getInputProps("current_address_state_id:") })}
                    // required
                    data={["Select"]}
                    id="current_state"
                  /> */}

                  {presentAddressCheck ? (
                    <select
                      className="col-lg-6"
                      id="state"
                      disabled
                      value={stateId}
                    >
                      <option value={stateId}>
                        {
                          statesList.find((state) => state.state_id == stateId)
                            ?.state_name
                        }
                      </option>
                    </select>
                  ) : (
                    <select
                      onChange={(e) =>
                        getDistrictsWiseList(e, "permanent_state")
                      }
                      className="col-lg-6"
                      id="state"
                      // required
                      // {...form.getInputProps("current_state_id")}
                      value={currentStateId}
                    >
                      <option value="">Select</option>
                      {statesList?.map((state, index) => (
                        <option value={state.state_id} key={index}>
                          {state.state_name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div className="form-group text-start mb-3 col-lg-4">
                  <label
                    className="fw-bold text-secondary"
                    htmlFor="current_district"
                  >
                    District
                  </label>
                  <br />
                  {presentAddressCheck ? (
                    <select
                      className="col-lg-6 normalSelect"
                      id="current_district"
                      disabled
                      value={districtId}
                    >
                      <option value={districtId}>
                        {
                          districtsList.find(
                            (district) => district.district_id == districtId
                          )?.district_name
                        }
                      </option>
                    </select>
                  ) : (
                    <select
                      onChange={(e) =>
                        getBlocksWiseList(e, "permanent_district")
                      }
                      id="district"
                      // required
                      value={currentDistrictId}
                    >
                      <option value="">Select</option>
                      {currentDistrictsList?.map((district, index) => (
                        <option value={district.district_id} key={index}>
                          {district.district_name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                {/* <div className="form-group text-start mb-3 col-lg-4">
                  <label
                    className="fw-bold text-secondary"
                    htmlFor="current_block"
                  >
                    Block *
                  </label>
                  <NativeSelect
                    size="lg"
                    placeholder="Select"
                    {...form.getInputProps("current_address_city_id")}
                    // required
                    data={["Select"]}
                    id="current_block"
                  />
                </div> */}
                <div className="form-group text-start mb-3 col-lg-4">
                  <label
                    className="fw-bold text-secondary"
                    htmlFor="current_city"
                  >
                    City
                  </label>
                  <TextInput
                    disabled={presentAddressCheck}
                    size="lg"
                    placeholder="City"
                    {...form.getInputProps("permanent_address_city")}
                    // required
                    className="text-danger mt-1"
                    id="current_city"
                  />
                </div>
                <div className="form-group text-start mb-3 col-lg-4">
                  <label className="fw-bold text-secondary" htmlFor="pincode">
                    Pincode
                  </label>
                  <NumberInput
                    disabled={presentAddressCheck}
                    size="lg"
                    placeholder="Enter here"
                    {...form.getInputProps("permanent_address_pincode")}
                    hideControls
                    // required
                    className="text-danger mt-1"
                    maxLength={6}
                    id="pincode"
                  />
                </div>
              </div>
            </div>

            <Group justify="center" className="mt-3">
              {active < 1 ? null : (
                <button
                  type="button"
                  className="btn prev-button"
                  onClick={prevStep}
                >
                  Previous
                </button>
              )}
              <button
                type="submit"
                className="btn add-button"
                style={{ color: "#fff" }}
              >
                Next
              </button>
            </Group>
          </form>
        </div>
        {/* </div> */}
      </div>
    </div>
  );
};

export default AddressDetails;
