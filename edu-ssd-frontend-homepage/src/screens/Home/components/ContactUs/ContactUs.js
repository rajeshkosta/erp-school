import React, { useState } from "react";
import "./ContactUs.css";

import * as Yup from "yup";
import * as contactUsRegistration from "../../contactUs.service";
import { useForm, yupResolver } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import ToastUtility from "../../../../utility/ToastUtility";

const ContactUsSection = () => {
  const [payLoad, setPayLoad] = useState({
    name: "",
    email_address: "",
    mobile_number: "",
    message: "",
  });

  const schema = Yup.object().shape({
    name: Yup.string().required("Full name is required"),

    mobile_number: Yup.string()
      .matches(/^[6-9]\d{9}$/, "Invalid Mobile Number")
      .required("Mobile Number Required"),

    email_address: Yup.string()
      .email()
      .required("Email-id is required")
      .matches(
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/,
        "Email-id is required "
      ),
    message: Yup.string()
      .max(150, "Additional field must not exceed 150 characters")
      .required("Message is Required"),
  });

  const handleChange = (event) => {
    console.log(event);
    const { name, value } = event.target;
    form.setFieldValue(name, value);
  };

  const form = useForm({
    validate: yupResolver(schema),
    initialValues: payLoad,
  });

  const navigate=useNavigate();
  const handleContactUs = async (payload) => {
  
    const contactUsResponse = await contactUsRegistration.addContactUs(payload);

    if (!contactUsResponse.error) {
     ToastUtility.success(" Contact request submitted successfully.");
     navigate("/home");
    } else {
      ToastUtility.error(
         "Failed to Contact. Please check the details."
       );
    }
    console.log(contactUsResponse);
  };

   return (
    <div className="container-fluid container-background" id="contact_us">
      <div className="container pt-5 pb-5">
        <div className="contactUs">
          <h1 className="text-center  mb-4">Contact Us</h1>
        </div>
        <form onSubmit={form.onSubmit((values) => handleContactUs(values))}>
          <div className="row">
            <div className="col-md-4 mb-3 nameinputBox">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter Name"
                className="form-control"
                id="name"
                name="name"
                onChange={handleChange}
              />
              {form.errors && form.isTouched && form.errors.name && (
                <p class="form-error">{form.errors.name}</p>
              )}
            </div>

            <div className="col-md-4 mb-3 emailinputBox">
              <label htmlFor="email_address" className="form-label">
                Email Address
              </label>
              <input
                type="email_address"
                placeholder="Enter Email Address"
                className="form-control"
                id="email_address"
                name="email_address"
                onChange={handleChange}
              />
              {form.errors && form.errors.email_address && (
                <p class="form-error">{form.errors.email_address}</p>
              )}
            </div>
            <div className="col-md-4 mb-3 mobileInputBox">
              <label htmlFor="mobile_number" className="form-label">
                Mobile
              </label>
              <input
                type="tel"
                placeholder="Enter Mobile Number "
                className="form-control"
                id="mobile_number"
                name="mobile_number"
                onChange={handleChange}
                maxLength={10}
              />
              {form.errors && form.errors.mobile_number && (
                <p class="form-error">{form.errors.mobile_number}</p>
              )}
            </div>
          </div>
          <div className="mb-2 messageinputBox">
            <label htmlFor="message" className="form-label ">
              Message
            </label>
            <input
              type="message"
              placeholder="Enter here "
              className="form-control"
              id="message"
              style={{ height: "70px" }}
              onChange={handleChange}
              name="message"
            />
            {form.errors && form.errors.message && (
              <p  class="form-error">{form.errors.message}</p>
            )}
          </div>
          <div className="d-flex justify-content-center">
            <button
              type="submit"
              className="btn"
              style={{
                backgroundColor: "#DB3525",
                color: "#fff",
                marginTop: "70px",
              }}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactUsSection;
