import React from "react";
import "./StudentPersonalInfo.css";

const StudentPersonalInfo = ({ studentPersonalInfoDetails }) => {
  const {
    email_id,
    admission_date,
    mobile_number,
    gender_id,
    blood_group,
    dob,
    current_address,
    permanent_address,
    father_name,
    father_email,
    father_occupation,
    mother_name,
    mother_email,
    mother_occupation,
  } = studentPersonalInfoDetails;

  return (
    <div className="scroll-container">
      <div>
        <div className="container">
          <span className="admission-date">Addmission Date:</span>
          {admission_date ? (
            <span className="personal_details">{admission_date}</span>
          ) : (
            <span className="personal_details">N/A</span>
          )}
        </div>
        <div className="container">
          <span className="admission-date">Email Address:</span>
          {email_id ? (
            <span className="personal_details">{email_id}</span>
          ) : (
            <span className="personal_details">N/A</span>
          )}
        </div>
        <div className="container">
          <span className="admission-date">Mobile Number:</span>
          {mobile_number ? (
            <span className="personal_details">{mobile_number}</span>
          ) : (
            <span className="personal_details">N/A</span>
          )}
        </div>
        <div className="container">
          <span className="admission-date">Blood Group:</span>

          {blood_group ? (
            <span className="personal_details">{blood_group}</span>
          ) : (
            <span className="personal_details">N/A</span>
          )}
        </div>
        <div className="container">
          <span className="admission-date">Gender:</span>
          <span className="personal_details">
            {" "}
            {gender_id === 1 ? "Male" : "Female"}
          </span>
        </div>
        <div className="container">
          <span className="admission-date">Date of Birth:</span>
          {dob ? (
            <span className="personal_details">{dob}</span>
          ) : (
            <span className="personal_details">N/A</span>
          )}
        </div>
        <div className="container">
          <span className="admission-date">Current Address:</span>
          {current_address ? (
            <span className="personal_details">{current_address}</span>
          ) : (
            <span className="personal_details">N/A</span>
          )}
        </div>
        <div className="container">
          <span className="admission-date">Permanent Address:</span>
          {permanent_address ? (
            <span className="personal_details">{permanent_address}</span>
          ) : (
            <span className="personal_details">N/A</span>
          )}
        </div>
        <div className="container">
          <h1 className="heading">Parents Information</h1>
        </div>

        <div className="container mb-4">
          <div>
            {studentPersonalInfoDetails?.father_photo_cdn ? (
              <img
                src={studentPersonalInfoDetails?.father_photo_cdn}
                alt="profile"
                style={{ borderRadius: "50%", width: "100px" }}
              />
            ) : (
              <img
                src="/images/profile-pic.png"
                alt="profile-pic"
                className="studentProfilePic"
              />
            )}
          </div>
          <div className="studentInfo">
            <div className="infoSection">
              <span className="admission-date">Father's Name</span>
              {father_name ? (
                <span className="personal_details">{father_name}</span>
              ) : (
                <span className="personal_details">N/A</span>
              )}
            </div>
            <div className="infoSection">
              <span className="admission-date">Email Address:</span>
              {father_email ? (
                <span className="personal_details">{father_email}</span>
              ) : (
                <span className="personal_details">N/A</span>
              )}
            </div>
            <div className="infoSection">
              <span className="admission-date">Father's Occupation:</span>
              {father_occupation ? (
                <span className="personal_details">{father_occupation}</span>
              ) : (
                <span className="personal_details">N/A</span>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="container mb-4">
            <div>
              {studentPersonalInfoDetails?.mother_photo_cdn ? (
                <img
                  src={studentPersonalInfoDetails?.mother_photo_cdn}
                  alt="profile"
                  style={{ borderRadius: "50%", width: "100px" }}
                />
              ) : (
                <img
                  src="/images/profile-pic.png"
                  alt="profile-pic"
                  className="studentProfilePic"
                />
              )}
            </div>
            <div className="studentInfo">
              <div className="infoSection">
                <span className="admission-date">Mother's Name:</span>
                {mother_name ? (
                  <span className="personal_details">{mother_name}</span>
                ) : (
                  <span className="personal_details">N/A</span>
                )}
              </div>
              <div className="infoSection">
                <span className="admission-date">Email Address:</span>
                {mother_email ? (
                  <span className="personal_details">{mother_email}</span>
                ) : (
                  <span className="personal_details">N/A</span>
                )}
              </div>

              <div className="infoSection">
                <span className="admission-date">Mother's Occupation:</span>
                {mother_occupation ? (
                  <span className="personal_details">{mother_occupation}</span>
                ) : (
                  <span className="personal_details">N/A</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPersonalInfo;
