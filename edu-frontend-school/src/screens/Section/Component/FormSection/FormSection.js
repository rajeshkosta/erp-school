import React, { useEffect, useState } from "react";
import "./FormSection.css";
import { TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconChevronLeft, IconTrash } from "@tabler/icons-react";
import { useNavigate, useLocation } from "react-router-dom";
import * as addSectionService from "../../Section.service";
import ToastUtility from "../../../../utility/ToastUtility";

const FormSectionComponent = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [SectionsList, setSectionsList] = useState([]);
  const [errorMessage, setErrorMessage] = useState(false);
  const [sectionData, setSectionData] = useState({});

  const form = useForm({
    initialValues: {
      section_name: "",
    },
  });

  const onSubmit = async () => {
    if (state?.section.section_id) {
      const { section_name } = form.values;
      const payload = {
        section_name: section_name,
        section_id: state?.section.section_id,
      };

      const updateSectionResponse = await addSectionService.updateSection(
        payload
      );
      if (!updateSectionResponse.error) {
        ToastUtility.success("Section updated successfully");
        navigate("/section");
      } else {
      }
    } else {
      const payload = {
        section_name: SectionsList,
      };

      const addSectionResponse = await addSectionService.addSection(payload);
      if (!addSectionResponse.error) {
        ToastUtility.success("Section added successfully");
        if (addSectionResponse.data) {
          navigate("/section");
        }
      } else {
      }
    }
  };

  const goBackToSectionManagementPage = () => {
    navigate("/section");
  };

  // const addSections = () => {
  //   if (form.values.section_name !== "") {
  //     setErrorMessage(false);
  //     const { section_name } = form.values;
  //     setSectionsList((prevSection) => [
  //       ...prevSection,
  //       section_name.charAt(0).toUpperCase() + section_name.slice(1),
  //     ]);
  //     form.values.section_name = "";
  //   } else {
  //     setErrorMessage(true);
  //   }
  // };

  const addSections = () => {
    const { section_name } = form.values;

    if (/[\w\d]/.test(section_name)) {
      setErrorMessage(false);
      setSectionsList((prevSection) => [
        ...prevSection,
        section_name.charAt(0).toUpperCase() + section_name.slice(1).trim(),
      ]);
      form.values.section_name = "";
    } else {
      setErrorMessage(true);
    }
  };

  const removeSection = (id) => {
    setSectionsList(SectionsList.filter((_, index) => id !== index));
  };

  const getDataBySectionId = async (sectionId) => {
    const getTrustByTrustIdResponse =
      await addSectionService.getSectionBySectionId(sectionId);
    if (!getTrustByTrustIdResponse.error) {
      setSectionData(getTrustByTrustIdResponse.data.data);
    } else {
    }
  };

  useEffect(() => {
    if (state?.section.section_id) {
      getDataBySectionId(state?.section.section_id);
    }
  }, []);

  useEffect(() => {
    form.setValues(sectionData);
  }, [sectionData]);

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center">
        <IconChevronLeft
          size={30}
          onClick={goBackToSectionManagementPage}
          style={{ cursor: "pointer" }}
          color="black"
        />
        <span
          className="fw-bold"
          style={{ fontSize: "20px", marginLeft: "10px" }}
        >
          {state?.section.section_id ? "Update Section" : "Add Section"}
        </span>
      </div>
      <div className="add-organization-container mx-2 pt-2">
        <form onSubmit={form.onSubmit(onSubmit)}>
          <div className="row mt-4">
            <div className="form-group text-start mb-3 col-12 col-lg-6 ">
              <label className="fw-bold text-secondary" htmlFor="role-name">
                Section Name *
              </label>
              <div className="d-flex align-items-center">
                <TextInput
                  size="lg"
                  placeholder="Enter here"
                  {...form.getInputProps("section_name")}
                  maxLength={20}
                  className="text-danger mt-1"
                  id="role-name"
                />
                <button
                  className="btn add-more-button"
                  type="button"
                  onClick={() => addSections()}
                >
                  {SectionsList.length === 0 || state?.section.section_id
                    ? "Add"
                    : "+ Add more"}
                </button>
              </div>
              {errorMessage ? (
                <span className="error-message">Please add Section</span>
              ) : null}
            </div>
          </div>
          <div>
            {SectionsList.length > 0 ? (
              <div className="row mt-3 section-list-main-container">
                {SectionsList?.map((Section, index) => (
                  <div className="col-lg-3 ">
                    <div className="section-list-container">
                      <span>{Section}</span>
                      <IconTrash
                        className="delete-icon"
                        onClick={() => removeSection(index)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          {state?.section.section_id ? (
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
              disabled={!SectionsList.length > 0}
            >
              Save
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default FormSectionComponent;
