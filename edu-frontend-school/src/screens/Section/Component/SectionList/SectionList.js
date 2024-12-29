import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ToastUtility from "../../../../utility/ToastUtility";
import * as addSectionService from "../../Section.service";
import { IconPencil } from "@tabler/icons-react";
import { Switch } from "@mantine/core";
import "./Section.css";

const SectionList = () => {
  const [sectionGrid, setsectionGrid] = useState([]);
  const [sectionStates, setSectionStates] = useState(
    Array(sectionGrid.length).fill(false)
  );

  const navigate = useNavigate();

  const getSectionList = async () => {
    const getSectionResponse = await addSectionService.getSection();
    if (!getSectionResponse.error) {
      setsectionGrid(getSectionResponse.data.data);
    } else {
    }
  };

  useEffect(() => {
    getSectionList();
  }, []);

  const goToSectionEditPage = (section) => {
    navigate("/section/edit", {
      state: {
        section: section,
      },
    });
  };

  // const handleSwitchChange = (index) => {
  //   const newSectionStates = [...sectionStates];
  //   newSectionStates[index] = !newSectionStates[index];
  //   setSectionStates(newSectionStates);
  // };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 divisionSection">
        <span className="fw-bold" style={{ fontSize: "20px" }}>
          Section/Division Management
        </span>
        <button
          className="btn add-button"
          onClick={() => navigate("/section/add")}
          style={{ color: "#fff" }}
        >
          {" "}
          Add Sections
          {/* <Link
            to="/section/add"
            style={{ textDecoration: "none", color: "#fff" }}
          >
            Add Sections
          </Link> */}
        </button>
      </div>
      <div className="row mt-5">
        {sectionGrid?.map((section, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-3 mb-4 ">
            <div className="subject-list-container-list">
              <div className="academic_year_img">
                <img src="/Assets/division.svg" />
              </div>
              <h1>{section.section_name}</h1>
              <div className="sub-subject-list">
                <button
                  onClick={() => goToSectionEditPage(section)}
                  className="btn btnEdit"
                >
                  Edit
                </button>
                {/* <IconPencil
                  size={18}
                  style={{ marginRight: "10px", cursor: "pointer" }}
                  onClick={() => goToSectionEditPage(section)}
                /> */}
                {/* <Switch
                  checked={sectionStates[index]}
                  onChange={() => handleSwitchChange(index)}
                /> */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionList;
