import React, { useState } from "react";
import "react-image-crop/dist/ReactCrop.css";
import { AiOutlineClose } from "react-icons/ai";
import { IconCloudUpload } from "@tabler/icons-react";
import "./ImageUploader.css";
import { Cropper, RectangleStencil } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";

const ImageUploader = ({
  uploadFile,
  allowedTypes,
  maxSize,
  onClose,
  handleSubmit,
  title,
  cropWidth,
  cropHeight,
}) => {
  const [tempFile, setTempFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [croppedImage, setCroppedImage] = useState("");
  const [error, setError] = useState("");

  const onChange = (cropper) => {
    setTimeout(() => {
      const croppedCanvas = cropper.getCanvas();
      if (croppedCanvas) {
        setCroppedImage(croppedCanvas?.toDataURL(`image/${tempFile.type}`));
      }
    }, 100);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      if (allowedTypes && !allowedTypes.includes(selectedFile.type)) {
        setError("Invalid file type. Please select a valid file type.");
        return;
      }
      if (selectedFile.size > maxSize * 1024 * 1024) {
        setError("File size exceeds the maximum limit.");
        return;
      }

      setTempFile(selectedFile);
      setError("");

      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleCropSubmit = () => {
    const byteString = atob(croppedImage.split(",")[1]);
    const mimeString = croppedImage.split(",")[0].split(":")[1].split(";")[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([arrayBuffer], { type: mimeString });
    uploadFile(new File([blob], tempFile.name, { type: blob.type }));

    if (handleSubmit) {
      handleSubmit();
    }

    onClose();
  };

  const cancelCrop = () => {
    setPreviewUrl("");
    setTempFile(null);
  };

  return (
    <div className="dialog-box">
      <div className="close-button-container">
        <button
          style={{
            backgroundColor: "transparent",
            border: "none",
          }}
          onClick={() => onClose()}
        >
          <AiOutlineClose />
        </button>
      </div>
      <div className="uploadFile">
        {previewUrl ? (
          <Cropper
            src={previewUrl}
            stencilComponent={RectangleStencil}
            stencilProps={{
              aspectRatio: cropWidth / cropHeight,
            }}
            onChange={onChange}
            className={"cropper verticalCenter"}
          />
        ) : (
          <>
            <input
              className="uploadInput"
              type="file"
              name="myImage"
              accept={allowedTypes.join(",")}
              onChange={handleFileChange}
            />
            <div className="uploadProfileInfo">
              <IconCloudUpload size={60} color="gray" />
              <p>{tempFile ? tempFile.name : "Upload Picture"}</p>
            </div>
          </>
        )}
      </div>
      <div>
        <p className="imageText">
          For a great profile picture, use{" "}
          {allowedTypes
            .map((type) => {
              return type.replace("image/", "").toUpperCase();
            })
            .join("/")}{" "}
          with recommended dimensions and stay under {maxSize}MB
        </p>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {previewUrl && (
        <div className="uploadImgBtns">
          <button className="img-upload-button cancelBtn" onClick={cancelCrop}>
            Cancel
          </button>
          <button
            className="img-upload-button"
            onClick={handleCropSubmit}
            disabled={!croppedImage}
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
