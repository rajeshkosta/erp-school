import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./NoticeList.css";
import { useNavigate } from "react-router-dom";
import { IconEye, IconPencil, IconCircle } from "@tabler/icons-react";
import * as gettingNoticeBoardService from "../../NoticeBoard.service";

const NoticeList = () => {
  const [noticeList, setNoticeList] = useState([]);
  const navigate = useNavigate();

  const noticeData = [...noticeList];
  // const noticeData = [];

  const gettingAllNotices = async () => {
    const payload = {
      pageSize: 10,
      currentPage: 0,
    };

    const response = await gettingNoticeBoardService.getAllNotices(payload);
    setNoticeList(response?.data?.data);
  };

  useEffect(() => {
    gettingAllNotices();
  }, []);

  const handleAction = (data) => {
    navigate("/noticeboard/edit", {
      state: {
        data: data,
      },
    });
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 userManagementSection">
        <span className="fw-bold" style={{ fontSize: "20px" }}>
          Notice Board
        </span>
        <button
          className="btn add-button"
          onClick={() => navigate("/noticeboard/add")}
          style={{ color: "#fff" }}
        >
          Add
        </button>
      </div>
      <div className="row mt-1 ">
        {noticeData.length > 0
          ? noticeData?.map((data, index) => (
              <div className="col-md-6 col-lg-4" key={index}>
                <div className="notice-list-container">
                  <div className="d-flex justify-content-between align-items-top">
                    <div className="d-flex flex-column mt-1">
                      <span className="fw-bold fs-5">{data.notice_title}</span>
                      <span className="fw-lighter">Date</span>
                    </div>
                    <div>
                      <IconPencil
                        onClick={() => handleAction(data)}
                        color="grey"
                        size={20}
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  </div>

                  <div className="d-flex flex-column mt-3">
                    <span className="fw-lighter">Created for</span>
                    <div className="d-flex align-items-center">
                      <span className="fw-bold fs-5">Role Name</span>
                      <span className="fw-lighter ms-1">(Role Type)</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          : ""}
      </div>
    </div>
  );
};

export default NoticeList;
