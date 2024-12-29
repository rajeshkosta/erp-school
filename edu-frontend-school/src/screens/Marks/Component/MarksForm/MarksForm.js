import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconChevronLeft } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { NumberInput, Table, TextInput } from "@mantine/core";
import ToastUtility from "../../../../utility/ToastUtility";
import { resultStatus } from "../../../../Const/Constant";
import "./MarksForm.css";

const MarksForm = () => {
  const [formData, setFormData] = useState({
    elements: [
      {
        subject: "Hindi",
        max_marks: 100,
        min_marks: 35,
        obtained_marks: "",
        status: "",
      },
      {
        subject: "English",
        max_marks: 100,
        min_marks: 35,
        obtained_marks: "",
        status: "",
      },
      {
        subject: "Marathi",
        max_marks: 100,
        min_marks: 35,
        obtained_marks: "",
        status: "",
      },
      {
        subject: "Sanskrit",
        max_marks: 100,
        min_marks: 35,
        obtained_marks: "",
        status: "",
      },
      {
        subject: "Maths",
        max_marks: 100,
        min_marks: 35,
        obtained_marks: "",
        status: "",
      },
    ],
  });

  const [maximumMarks, setMaximumMarks] = useState(0);
  const [minimumMarks, setMinimumMarks] = useState(0);
  const [ObtainedMarks, setObtainedMarks] = useState(0);

  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      subject_name: "",
    },
  });

  const onSubmit = () => {
    console.log("hi");
  };

  const goBackToMarksManagementPage = () => {
    navigate("/marks");
  };

  const handleMarksChange = (index, value) => {
    const { max_marks } = formData.elements[index];
    if (value <= max_marks) {
      const updatedElements = [...formData.elements];
      updatedElements[index].obtained_marks = value;

      setFormData({
        ...formData,
        elements: updatedElements,
      });
    } else {
      ToastUtility.info(
        "Obtained marks  should be less than or equal to maximum marks."
      );
    }
  };

  const handleDigits = (e) => {
    const isAllowedKey = /^[0-9]$/.test(e.key);
    const isAllowedAction = [
      "Backspace",
      "Delete",
      "Cut",
      "Copy",
      "Paste",
      "ArrowRight",
      "ArrowLeft",
      "Tab",
    ].includes(e.nativeEvent.code);

    if (!isAllowedKey && !isAllowedAction) {
      e.preventDefault();
    }
  };

  const rows = formData.elements.map((element, index) => (
    <Table.Tr key={element.name}>
      <Table.Td>{element.subject}</Table.Td>
      <Table.Td>{element.max_marks}</Table.Td>
      <Table.Td>{element.min_marks}</Table.Td>
      <Table.Td>
        <input
          onChange={(e) => handleMarksChange(index, e.target.value)}
          maxLength="3"
          value={element.obtained_marks}
          onKeyDown={handleDigits}
        />
      </Table.Td>
      <Table.Td>
        <select className="resultSelect">
          <option value="">Select Result</option>
          {resultStatus.map((result, index) => (
            <option key={index} value={result.result_code}>
              {result.result_status}
            </option>
          ))}
        </select>
      </Table.Td>
    </Table.Tr>
  ));

  const calculateTotalOfMaxMarks = () => {
    const maximum = formData.elements.reduce(
      (total, element) => total + element.max_marks,
      0
    );
    setMaximumMarks(maximum);
  };

  const calculateTotalOfMinMarks = () => {
    const minimum = formData.elements.reduce(
      (total, element) => total + element.min_marks,
      0
    );
    setMinimumMarks(minimum);
  };

  const calculateTotalOfObtainedMarks = () => {
    const obtained = formData.elements.reduce(
      (total, element) =>
        total + (element.obtained_marks ? parseInt(element.obtained_marks) : 0),
      0
    );
    setObtainedMarks(obtained);
  };

  useEffect(() => {
    calculateTotalOfMaxMarks();
    calculateTotalOfMinMarks();
    calculateTotalOfObtainedMarks();
  }, [formData.elements]);

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center">
        <IconChevronLeft
          size={30}
          onClick={goBackToMarksManagementPage}
          style={{ cursor: "pointer" }}
          color="black"
        />
        <span
          className="fw-bold"
          style={{ fontSize: "20px", marginLeft: "10px" }}
        >
          Add Gaurav Kumar's marks
        </span>
      </div>
      <div className="add-organization-container mx-2 pt-2">
        <form onSubmit={form.onSubmit(onSubmit)}>
          <div className="row mt-0">
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Subject</Table.Th>
                  <Table.Th>Max. Marks</Table.Th>
                  <Table.Th>Min. Marks</Table.Th>
                  <Table.Th>Marks Obtained</Table.Th>
                  <Table.Th>Result</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
              <Table.Tfoot style={{ fontWeight: "bold" }}>
                <Table.Tr>
                  <Table.Td>Total</Table.Td>
                  <Table.Td>{maximumMarks}</Table.Td>
                  <Table.Td>{minimumMarks}</Table.Td>
                  <Table.Td>{ObtainedMarks}</Table.Td>
                  <Table.Td>
                    {ObtainedMarks >= minimumMarks ? (
                      <span style={{ color: "green" }}>Pass</span>
                    ) : ObtainedMarks === 0 ? (
                      <span></span>
                    ) : (
                      <span style={{ color: "red" }}>Fail</span>
                    )}
                  </Table.Td>
                  <Table.Td></Table.Td>
                </Table.Tr>
              </Table.Tfoot>
            </Table>
          </div>

          <button
            className="btn add-button mt-3 mb-2"
            type="submit"
            style={{ color: "#fff" }}
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default MarksForm;
