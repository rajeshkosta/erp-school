import { get, post } from "../../utility/ApiCall";

const getStatessList = async () => {
  const gettingStatesList = await get(`/api/v1/admin/location/states`);
  return gettingStatesList;
};

const getDistrictsList = async (id) => {
  const gettingDistrictsList = await get(
    `/api/v1/admin/location/districts/${id}`
  );
  return gettingDistrictsList;
};

const getBlocksList = async (id) => {
  const gettingBlocksList = await get(`/api/v1/admin/location/blocks/${id}`);
  return gettingBlocksList;
};

const addStudent = async (payload) => {
  const addingStudent = await post(
    "/api/v1/registration/admission/studentAdmission",

    payload
  );
  return addingStudent;
};

const getAllStudents = async (payload) => {
  const gettingAllStudents = await post(
    "/api/v1/registration/admission/getAllStudentList",
    payload
  );
  return gettingAllStudents;
};

const getStudentByStudentId = async (id) => {
  const gettingStudentByStudentId = await get(
    `/api/v1/registration/admission/getStudent/${id}`
  );
  return gettingStudentByStudentId;
};

const updateStudent = async (payload) => {
  const updatingStudent = await post(
    "/api/v1/registration/admission/update",
    payload
  );
  return updatingStudent;
};

const getSectionAndSubjectByClassID = async (payload) => {
  const getSectionAndSubjectByClassID = await post(
    "/api/v1/classroom/getCountsByClass",
    payload
  );
  return getSectionAndSubjectByClassID;
};

const getSectionList = async () => {
  const gettingSectionsList = await get(`/api/v1/admin/section/getAllSection`);
  return gettingSectionsList;
};

const saveFeesConfiguration = async (payload) => {
  const savingFeesConfiguration = await post(
    `/api/v1/registration/feeconfig/create`,
    payload
  );
  return savingFeesConfiguration;
};

const updateFeesConfiguration = async (payload) => {
  const updateFeesConfiguration = await post(
    `/api/v1/registration/feeconfig/update`,
    payload
  );
  return updateFeesConfiguration;
};

const getFeesConfigurationByConfigurationId = async (payload) => {
  const gettingFeesConfigurationByConfigurationId = await post(
    `api/v1/registration/feeconfig/getStudentdetailsinFeeConfig`,
    payload
  );
  return gettingFeesConfigurationByConfigurationId;
};

const addTransaction = async (payload) => {
  const addingTransaction = await post(
    `api/v1/registration/transaction/create`,
    payload
  );
  return addingTransaction;
};

const getTransactionData = async (payload) => {
  const gettingTransactionData = await post(
    `/api/v1/registration/transaction/getalltransaction`,
    payload
  );
  return gettingTransactionData;
};

const getFeesHistory = async () => {
  const gettingFeesList = await get(
    "/api/v1/registration/feeconfig/getFeeConfig/feeConfigId"
  );
  return gettingFeesList;
};

export {
  getStatessList,
  getDistrictsList,
  getBlocksList,
  addStudent,
  getAllStudents,
  getStudentByStudentId,
  updateStudent,
  getSectionAndSubjectByClassID,
  getSectionList,
  saveFeesConfiguration,
  getFeesConfigurationByConfigurationId,
  addTransaction,
  getTransactionData,
  updateFeesConfiguration,
  getFeesHistory,
};
