import { NumberInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconChevronLeft,
  IconCoinRupee,
  IconCurrencyRupee,
} from "@tabler/icons-react";
import { IconPlus } from "@tabler/icons-react";
import { IconTrash } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as addFeeDiscountService from "../../FeeDiscount.service";
import ToastUtility from "../../../../../utility/ToastUtility";

const FeeDiscountForm = () => {
  const [additionalDiscountTypes, setAdditionalDiscountTypes] = useState([]);
  const [feeDiscountData, setFeesDiscountData] = useState({});
  const [errorMsg, setErorMsg] = useState(false);

  const { state } = useLocation();

  const navigate = useNavigate();
  const goBackToFeeDiscountPage = () => {
    navigate("/feeDiscount");
  };

  const form = useForm({
    initialValues: {
      fees_discount_name: "",
      discount: "",
    },

    validate: {},
  });

  const onSubmit = async () => {
    if (state?.rowData.fees_discount_id) {
      const { fees_discount_name, discount } = form.values;

      const payload = {
        fees_discount_id: state?.rowData.fees_discount_id,
        fees_discount_name: fees_discount_name,
        discount: discount,
      };
      const updateResponse = await addFeeDiscountService.updateFeeDiscount(
        payload
      );

      if (!updateResponse.error) {
        ToastUtility.success("Fees discount updated Successfully");

        navigate("/feeDiscount");
      }
    } else {
      const payload = {
        fees_discounts: additionalDiscountTypes,
      };
      const addResponse = await addFeeDiscountService.AddFeeDiscount(payload);

      if (!addResponse.error) {
        ToastUtility.success("Fees discount added Successfully");

        navigate("/feeDiscount");
      }
    }
  };

  const addMoreTypes = () => {
    if (form.values.fees_discount_name !== "" && form.values.discount !== "") {
      setErorMsg(false);
      const newDiscountType = {
        fees_discount_name: form.values.fees_discount_name,
        discount: form.values.discount,
      };

      setAdditionalDiscountTypes([...additionalDiscountTypes, newDiscountType]);
      form.reset();
    } else {
      setErorMsg(true);
    }
  };

  const deleteAddMoreTypes = (id) => {
    const updatedDiscountTypes = additionalDiscountTypes.filter(
      (type, index) => index !== id
    );
    setAdditionalDiscountTypes(updatedDiscountTypes);
  };

  const getFeesDiscountById = async (feesDiscountId) => {
    const getFeesDiscountByIdResponse =
      await addFeeDiscountService.getFeeDiscountById(feesDiscountId);
    if (!getFeesDiscountByIdResponse.error) {
      setFeesDiscountData(...getFeesDiscountByIdResponse.data.data);
    }
  };

  useEffect(() => {
    if (state?.rowData.fees_discount_id) {
      getFeesDiscountById(state?.rowData.fees_discount_id);
    }
  }, []);

  useEffect(() => {
    form.setValues({ ...feeDiscountData });
  }, [feeDiscountData]);

  return (
    <div className="container-fluid ">
      <div className="d-flex align-items-center">
        <IconChevronLeft
          size={30}
          onClick={goBackToFeeDiscountPage}
          style={{ cursor: "pointer" }}
          color="blue"
        />
        <span
          className="fw-bold "
          style={{ fontSize: "20px", marginLeft: "10px" }}
        >
          {state?.rowData.fees_discount_id
            ? "Update Discount type"
            : "Add Discount type"}
        </span>
      </div>
      <div className="add-organization-container mx-2">
        <form onSubmit={form.onSubmit(onSubmit)}>
          <div className="row">
            <div className="form-group text-start mb-3 col-12 col-lg-6">
              <label className="fw-bold text-secondary" htmlFor="discount_name">
                Discount name
              </label>
              <TextInput
                placeholder="Discount name"
                {...form.getInputProps("fees_discount_name")}
                className="text-danger mt-1"
                id="discount_name"
                size="lg"
              />
            </div>

            <div className="form-group text-start mb-3 col-11 col-lg-5">
              <label className="fw-bold text-secondary" htmlFor="amount">
                Amount
              </label>
              <NumberInput
                placeholder="Amount"
                {...form.getInputProps("discount")}
                className="text-danger mt-1"
                id="amount"
                size="lg"
                hideControls
                maxLength={6}
              />
            </div>
            {state?.rowData.fees_discount_id ? null : (
              <div className="col-1 col-lg-1" style={{ outline: "none" }}>
                <IconPlus
                  style={{ marginTop: "35px", cursor: "pointer" }}
                  size={30}
                  color="blue"
                  onClick={() => addMoreTypes()}
                />
              </div>
            )}
          </div>
          {errorMsg ? (
            <p style={{ color: "red", fontSize: "12px" }}>
              Please fill all fields
            </p>
          ) : null}
          {additionalDiscountTypes?.map((eachType, index) => (
            <div className="row" key={index}>
              <div className="form-group text-start mb-3 col-12 col-lg-6">
                <TextInput
                  placeholder="Enter here"
                  value={eachType.fees_discount_name}
                  disabled
                  className="text-danger mt-1"
                  id={`fee_type_${index}`}
                  size="lg"
                />
              </div>

              <div className="form-group text-start mb-3 col-11 col-lg-5">
                <NumberInput
                  placeholder="Enter here"
                  value={eachType.discount}
                  className="text-danger mt-1"
                  id="fine"
                  size="lg"
                  hideControls
                  disabled
                />
              </div>
              <div className="form-group text-start col-1 col-lg-1">
                <IconTrash
                  color="red"
                  style={{ marginTop: "15px", cursor: "pointer" }}
                  onClick={() => deleteAddMoreTypes(index)}
                />
              </div>
            </div>
          ))}

          {state?.rowData.fees_discount_id ? (
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
              disabled={additionalDiscountTypes.length === 0}
            >
              Save
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default FeeDiscountForm;
