import { post, get } from "../../utility/ApiCall";

const addSection = async (payload) => {
  const addingSection = await post("/api/v1/admin/section/addSection", payload);
  return addingSection;
};

const getSection = async () => {
  const gettingSection = await get("/api/v1/admin/section/getAllSection");
  return gettingSection;
};

const getSectionBySectionId = async (id) => {
  const gettingSectionBySectionId = await get(
    `/api/v1/admin/section/getSection/${id}`
  );
  return gettingSectionBySectionId;
};

const updateSection = async (payload) => {
  const updatingSection = await post(
    `/api/v1/admin/section/updateSection`,
    payload
  );
  return updatingSection;
};

export { addSection, getSection, updateSection, getSectionBySectionId };
