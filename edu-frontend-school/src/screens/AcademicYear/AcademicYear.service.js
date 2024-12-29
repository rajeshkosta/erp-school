import { get, post } from "../../utility/ApiCall";

const AddAcademicYear = async (payload) => {
  const addingAcademicYear = await post(
    "/api/v1/admin/academic_year/add",
    payload
  );
  return addingAcademicYear;
};

const AcademicYearList = async () => {
  const gettingAcademicYearList = await get("/api/v1/admin/academic_year/list");
  return gettingAcademicYearList;
};

const getAcademicYearByAcademicId = async (id) => {
  const gettingAcademicYearByAcademicId = await get(
    `/api/v1/admin/academic_year/getById/${id}`
  );
  return gettingAcademicYearByAcademicId;
};

const updateAcademicYear = async (payload) => {
  const updatingAcademiYear = await post(
    `/api/v1/admin/academic_year/add`,
    payload
  );
  return updatingAcademiYear;
};

export {
  AddAcademicYear,
  AcademicYearList,
  getAcademicYearByAcademicId,
  updateAcademicYear,
};
