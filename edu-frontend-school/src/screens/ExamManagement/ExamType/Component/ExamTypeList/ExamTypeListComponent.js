import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconPencil } from "@tabler/icons-react";
import * as addExamTypeService from "../../ExamType.service";
import "./ExamTypeListComponent.css";

const ExamTypeListComponent = () => {
  const navigate = useNavigate();

  const [examTypeCards, setExamTypeCards] = useState([]);

  const [examTypeStates, setExamTypeStates] = useState(
    Array(examTypeCards.length).fill(false)
  );

  const getExamTypeList = async () => {
    const getexamTypeResponse = await addExamTypeService.getExamType();
    if (!getexamTypeResponse.error) {
      setExamTypeCards(getexamTypeResponse.data.data);
    } else {
    }
  };

  useEffect(() => {
    getExamTypeList();
  }, []);

  const goToExamTypeEditPage = (examType) => {
    navigate("/examtype/edit", {
      state: {
        examType: examType,
      },
    });
  };

  // const handleSwitchChange = (index) => {
  //   const newexamTypeStates = [...examTypeStates];
  //   newexamTypeStates[index] = !newexamTypeStates[index];
  //   setExamTypeStates(newexamTypeStates);
  // };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-3 examType">
        <span className="fw-bold" style={{ fontSize: "20px" }}>
          Exam Type
        </span>
        <button
          className="btn add-button"
          onClick={() => navigate("/examtype/add")}
          style={{ color: "#fff" }}
        >
          {" "}
          Add Exam Type
          {/* <Link
            to="/examtype/add"
            style={{ textDecoration: "none", color: "#fff" }}
          >
            Add Exam Type
          </Link> */}
        </button>
      </div>
      <div className="row mt-5">
        {examTypeCards?.map((examType, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-3 mb-4">
            <div className="subject-list-container-examtype">
              <div className="academic_year_img">
                <img src="/Assets/exemtype.svg" />
              </div>
              <h1>{examType.exam_name}</h1>
              <div className="sub-subject-list">
                <button
                  onClick={() => goToExamTypeEditPage(examType)}
                  className="btn btnEdit"
                >
                  Edit
                </button>

                {/* <IconPencil
                  size={18}
                  style={{ marginRight: "10px", cursor: "pointer" }}
                  onClick={() => goToExamTypeEditPage(examType)}
                /> */}
                {/* <Switch
                  checked={examTypeStates[index]}
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

export default ExamTypeListComponent;
