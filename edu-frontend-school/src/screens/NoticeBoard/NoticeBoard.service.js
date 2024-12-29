import { get, post } from "../../utility/ApiCall";

const getAllNotices = async (payload) => {
  const gettingAllNotices = await post("/api/v1/admin/noticeBoard/getAll", payload);
  return gettingAllNotices;
};

const AddNotice = async (payload) => {
  const addingNotice = await post("/api/v1/admin/noticeBoard/addNotice", payload);
  return addingNotice;
};

const UpdateNotice = async (payload) => {
  const updatingNotice = await post("", payload);
  return updatingNotice;
};

const getNoticeByNoticeId = async (id) => {
  const gettingNoticeByNoticeId = await get(`/api/v1/admin/noticeBoard/getNotice/${id}`);
  return gettingNoticeByNoticeId;
};

const getRolesList = async () => {
  const gettingRoles = await get(``);
  return gettingRoles;
};

export {
  getAllNotices,
  AddNotice,
  UpdateNotice,
  getNoticeByNoticeId,
  getRolesList,
};
