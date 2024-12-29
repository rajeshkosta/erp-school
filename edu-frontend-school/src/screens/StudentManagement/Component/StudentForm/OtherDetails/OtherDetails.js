import { Group, Modal, NumberInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCloudUpload, IconEye, IconTrash } from "@tabler/icons-react";
import { Tooltip } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";

const OtherDetails = ({
  prevStep,
  nextStep,
  active,
  setPayLoad,
  payLoad,
  tcImage,
  setTcImage,
}) => {
  const [tcFileErrorMessage, setTcFileErrorMessage] = useState("");
  const [tcFileError, setTcFileError] = useState(false);

  const form = useForm({
    initialValues: {
      previous_school_name: "",
      previous_school_board: "",
      previous_class: "",
      previous_school_year: "",
      previous_class_percentage_grade: "",
    },

    validate: {},
  });

  const onSubmit = () => {
    setPayLoad((prevData) => ({ ...prevData, ...form.values }));

    nextStep();
  };

  useEffect(() => {
    form.setValues({ ...payLoad });
  }, [payLoad]);

  const handleTransferCertificateUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      if (
        file.type.includes("pdf") ||
        file.type.includes("jpeg") ||
        file.type.includes("png") ||
        file.type.includes("jpg")
      ) {
        if (file.size <= 2 * 1024 * 1024) {
          setTcImage(file);
          setTcFileError(false);
          setTcFileErrorMessage("");
        } else {
          setTcImage(null);
          setTcFileError(true);
          setTcFileErrorMessage("File size should be less than 2 MB.");
        }
      } else {
        setTcImage(null);
        setTcFileError(true);
        setTcFileErrorMessage(
          "Unsupported file type. Upload jpg, jpeg, png, or pdf only."
        );
      }
    }
  };

  const [opened, { open, close }] = useDisclosure(false);
  const removeTcImage = () => {
    setTcImage(null);
  };

  return (
    <div>
      <Modal opened={opened} onClose={close} centered withCloseButton={false}>
        <div className="d-flex justify-content-center align-items-center">
          <img
            src={
              tcImage
                ? URL.createObjectURL(tcImage)
                : payLoad?.utc_certificate_cdn
            }
            alt=""
            className="pop-up-image"
          />
          
        </div>
      </Modal>
      <div className="container-fluid ">
        <div className="add-organization-container student-details mt-4">
          <span className="student-details-label">Other Details</span>
          <div className="student-details-sub-container">
            <form onSubmit={form.onSubmit(onSubmit)} className="mt-3">
              <div className="row mt-3 student-registration-container">
                <div className="form-group text-start mb-3 col-lg-4">
                  <label
                    className="fw-bold text-secondary"
                    htmlFor="prev_school"
                  >
                    Previous School Name
                  </label>
                  <TextInput
                    size="lg"
                    placeholder="Enter here"
                    {...form.getInputProps("previous_school_name")}
                    // required
                    className="text-danger mt-1"
                    id="prev_school"
                  />
                </div>
                <div className="form-group text-start mb-3 col-lg-4">
                  <label className="fw-bold text-secondary" htmlFor="board">
                    Board
                  </label>
                  <TextInput
                    size="lg"
                    placeholder="Board"
                    {...form.getInputProps("previous_school_board")}
                    // required
                    className="text-danger mt-1"
                    id="board"
                  />
                </div>

                <div className="form-group text-start mb-3 col-lg-4">
                  <label className="fw-bold text-secondary" htmlFor="class">
                    Class
                  </label>
                  <TextInput
                    size="lg"
                    placeholder="Class"
                    {...form.getInputProps("previous_class")}
                    // required
                    className="text-danger mt-1"
                    id="class"
                  />
                </div>
                <div className="form-group text-start mb-3 col-lg-4">
                  <label className="fw-bold text-secondary" htmlFor="year">
                    Year
                  </label>
                  <NumberInput
                    size="lg"
                    placeholder="Enter here"
                    {...form.getInputProps("previous_school_year")}
                    // required
                    maxLength={4}
                    className="text-danger mt-1"
                    hideControls
                    id="pincode"
                  />
                </div>
                <div className="form-group text-start mb-3 col-lg-4">
                  <label
                    className="fw-bold text-secondary"
                    htmlFor="percentage"
                  >
                    Percentage/Grade
                  </label>
                  <TextInput
                    size="lg"
                    placeholder="Percentage"
                    {...form.getInputProps("previous_class_percentage_grade")}
                    // required
                    className="text-danger mt-1"
                    id="percentage"
                    maxLength={2}
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <span className="fw-bold text-secondary">
                  Upload Transfer Certificate
                </span>
                <div className="upload-documents ">
                  <div className="student-upload-logo">
                    {tcImage || payLoad.utc_certificate_cdn ? (
                      <div className="d-flex justify-content-between align-items-center">
                        <>
                          <img
                            src={
                              tcImage
                                ? URL.createObjectURL(tcImage)
                                : payLoad.utc_certificate_cdn
                            }
                            alt="profile"
                            className="student-uploaded-image"
                          />
                          <IconCloudUpload className="uploadIcon" />
                        </>
                        {/* <IconEye
                          onClick={() =>
                            handleDownLoad(payLoad.utc_certificate_cdn)
                          }
                          className="uploadIcon"
                        /> */}
                      </div>
                    ) : (
                      <IconCloudUpload size={40} color="grey" />
                    )}
                  </div>

                  <div className="upload-image-container">
                    {tcImage || payLoad?.utc_certificate_cdn ? (
                      <div className="d-flex align-items-center">
                        <>
                          <input
                            type="file"
                            id="uploadTransfer"
                            accept=".pdf, .jpg, .jpeg, .png, "
                            onChange={handleTransferCertificateUpload}
                            style={{ display: "none" }}
                          />

                          <label
                            htmlFor="uploadTransfer"
                            className="fw-bold"
                            style={{ cursor: "pointer", fontSize: "0.8rem" }}
                          >
                            {tcImage
                              ? tcImage.name
                              : payLoad && payLoad.utc_certificate_cdn
                              ? payLoad.utc_certificate_cdn.split("/").pop()
                              : ""}
                          </label>
                        </>
                        {payLoad || payLoad?.utc_certificate_cdn ? (
                          <Tooltip
                            label="Preview"
                            color="#DB3525"
                            arrowSize={6}
                            withArrow
                            position="right"
                          >
                            {(tcImage && tcImage?.type === "image/png") ||
                            (tcImage && tcImage?.type === "image/jpg") ||
                            (tcImage && tcImage?.type === "image/jpeg") ||
                            (payLoad?.utc_certificate_cdn &&
                              payLoad?.utc_certificate_cdn
                                .split("/")
                                .pop()
                                .split(".")
                                .pop() == "jpg") ||
                            (payLoad?.utc_certificate_cdn &&
                              payLoad?.utc_certificate_cdn
                                .split("/")
                                .pop()
                                .split(".")
                                .pop() == "jpeg") ||
                            (payLoad?.utc_certificate_cdn &&
                              payLoad?.utc_certificate_cdn
                                .split("/")
                                .pop()
                                .split(".")
                                .pop() == "png") ? (
                              <IconEye
                                style={{ marginLeft: "20px" }}
                                onClick={() => open()}
                                color="#DB3525"
                              />
                            ) : (
                              <a
                                href={
                                  payLoad?.utc_certificate_cdn
                                    ? payLoad?.utc_certificate_cdn
                                    : URL.createObjectURL(tcImage)
                                }
                                target="_blank"
                                rel="noreferrer"
                              >
                                <IconEye style={{ marginLeft: "20px" }} />
                              </a>
                            )}
                          </Tooltip>
                        ) : null}{ tcImage ? (
                          <IconTrash
                            style={{
                              paddingBottom: "1px",
                              marginLeft: "10px",
                              color: "red",
                              cursor: "pointer",
                            }}
                            onClick={() => removeTcImage()}
                          />
                        ) : null}
                      </div>
                    ) : (
                      <div className="d-flex flex-column ">
                        <input
                          type="file"
                          id="uploadTransfer"
                          accept=".pdf, .jpg, .jpeg, .png, "
                          onChange={handleTransferCertificateUpload}
                          style={{ display: "none" }}
                        />
                        <label
                          htmlFor="uploadTransfer"
                          className="fw-bold"
                          style={{
                            cursor: "pointer",
                            textDecoration: "underline",
                            color: "#002699",
                            fontSize: "0.8rem",
                          }}
                        >
                          Click here to upload
                        </label>

                        <span
                          style={{
                            color: "grey",
                            fontSize: "0.9rem",
                          }}
                        >
                          Supported format: pdf, jpeg, jpg, png
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {tcFileError ? (
                  <span className="m-8f816625 mt-3">{tcFileErrorMessage}</span>
                ) : null}
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
        </div>
      </div>
    </div>
  );
};

export default OtherDetails;
