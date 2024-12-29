import React, { useEffect, useState } from "react";
import { TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconChevronLeft, IconTrash } from "@tabler/icons-react";
import { useNavigate, useLocation } from "react-router-dom";
import * as addFeeTypeService from "../../FeeType.service";
import ToastUtility from "../../../../../utility/ToastUtility";

const FormFeeType = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [feeTypeLidt, setfeeTypeLidt] = useState([]);
  const [errorMessage, setErrorMessage] = useState(false);
  const [feeTypeData, setfeeTypeData] = useState({});

  const form = useForm({
    initialValues: {
      fees_type: "",
    },
  });

  const onSubmit = async () => {
    const { fees_type } = form.values;
    const isFirstLetterValid = /^[a-zA-Z0-9]$/.test(fees_type.charAt(0));

    if (state?.feeType.fees_type_id) {
      if (isFirstLetterValid) {
        setErrorMessage(false);
        const { fees_type } = form.values;
        const payload = {
          fees_type: fees_type,
          fees_type_id: state?.feeType.fees_type_id,
        };

        const updatefeeTypeResponse = await addFeeTypeService.updateFeeType(
          payload
        );
        if (!updatefeeTypeResponse.error) {
          ToastUtility.success("Fee type updated successfully");
          if (updatefeeTypeResponse.data) {
            navigate("/feeType");
          }
        }
      } else {
        setErrorMessage(true);
      }
    } else {
      const payload = {
        fees_type: feeTypeLidt,
        status: 1,
      };

      const addfeeTypeResponse = await addFeeTypeService.addFeeType(payload);
      if (!addfeeTypeResponse.error) {
        ToastUtility.success("Fee type added successfully");
        if (addfeeTypeResponse.data) {
          navigate("/feeType");
        }
      } else {
      }
    }
  };

  const goBackTofeeTypePage = () => {
    navigate("/feeType");
  };

  // const addFeeType = () => {
  //   if (form.values.fees_type !== "") {
  //     setErrorMessage(false);
  //     const { fees_type } = form.values;
  //     setfeeTypeLidt((prevfeeType) => [
  //       ...prevfeeType,
  //       fees_type.charAt(0).toUpperCase() + fees_type.slice(1),
  //     ]);
  //     form.values.fees_type = "";
  //   } else {
  //     setErrorMessage(true);
  //   }
  // };

  const addFeeType = () => {
    // if (form.values.fees_type !== "") {
    //   setErrorMessage(false);
    //   const { fees_type } = form.values;
    //   setfeeTypeLidt((prevfeeType) => [
    //     ...prevfeeType,
    //     fees_type.charAt(0).toUpperCase() + fees_type.slice(1),
    //   ]);
    //   form.values.fees_type = "";
    // } else {
    //   setErrorMessage(true);
    // }

    const { fees_type } = form.values;

    if (fees_type.trim() !== "") {
      const firstLetter = fees_type.charAt(0);

      const isFirstLetterValid = /^[a-zA-Z]$/.test(firstLetter);

      if (isFirstLetterValid) {
        setErrorMessage(false);

        setfeeTypeLidt((prevfeeType) => [
          ...prevfeeType,
          fees_type.charAt(0).toUpperCase() + fees_type.slice(1),
        ]);

        form.values.fees_type = "";
      } else {
        setErrorMessage(true);
      }
    } else {
      setErrorMessage(true);
    }
  };

  const removeFeeType = (id) => {
    setfeeTypeLidt(feeTypeLidt.filter((_, index) => id !== index));
  };

  const getDataByFeeTypeId = async (feeTypeId) => {
    const getfeeTypeByfeeTypeIdResponse =
      await addFeeTypeService.getFeeTypeById(feeTypeId);
    if (!getfeeTypeByfeeTypeIdResponse.error) {
      setfeeTypeData(getfeeTypeByfeeTypeIdResponse.data.data[0]);
    } else {
    }
  };

  useEffect(() => {
    if (state?.feeType.fees_type_id) {
      getDataByFeeTypeId(state?.feeType.fees_type_id);
    }
  }, []);

  useEffect(() => {
    form.setValues(feeTypeData);
  }, [feeTypeData]);

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center">
        <IconChevronLeft
          size={30}
          onClick={goBackTofeeTypePage}
          style={{ cursor: "pointer" }}
          color="black"
        />
        <span
          className="fw-bold"
          style={{ fontSize: "20px", marginLeft: "10px" }}
        >
          {state?.feeType.fees_type_id ? "Update Fee Type" : "Add Fee Type"}
        </span>
      </div>
      <div className="add-organization-container mx-2 pt-2">
        <form onSubmit={form.onSubmit(onSubmit)}>
          <div className="row mt-4">
            <div className="form-group text-start mb-3 col-12 col-lg-6 ">
              <label className="fw-bold text-secondary" htmlFor="role-name">
                Fee Type*
              </label>
              <div className="d-flex align-items-center">
                <TextInput
                  size="lg"
                  placeholder="Enter here"
                  {...form.getInputProps("fees_type")}
                  className="text-danger mt-1"
                  id="role-name"
                  maxLength={60}
                />
                {state?.feeType.fees_type_id ? null : (
                  <button
                    className="btn add-more-button"
                    type="button"
                    onClick={() => addFeeType()}
                  >
                    {feeTypeLidt.length === 0 || state?.feeType.fees_type_id
                      ? "Add"
                      : "+ Add more"}
                  </button>
                )}
              </div>
              {errorMessage ? (
                <span className="error-message">
                  Please enter valid fees type
                </span>
              ) : null}
            </div>
          </div>

          {feeTypeLidt.length > 0 ? (
            <div className="row mt-3 section-list-main-container">
              {feeTypeLidt?.map((feeType, index) => (
                <div className="col-lg-3 ">
                  <div className="section-list-container">
                    <span>{feeType}</span>
                    <IconTrash
                      className="delete-icon"
                      onClick={() => removeFeeType(index)}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {state?.feeType.fees_type_id ? (
            <button
              className="btn add-button mt-3 mb-2"
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
              disabled={!feeTypeLidt.length > 0}
            >
              Save
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default FormFeeType;
