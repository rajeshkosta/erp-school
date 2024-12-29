import { get, post } from "../../utility/ApiCall";

const getStudentsForAllocation = async (payload) => {
  const getStudentsForAllocation = await post(
    "/api/v1/classroom/student/getStudentsForAllocation",
    payload
  );
  return getStudentsForAllocation;
};

const allocateStudentToSection = async (payload) => {
    const allocateStudentToSection = await post(
      "/api/v1/classroom/student/allocateStudents",
      payload
    );
    return allocateStudentToSection;
  };

  const reallocateStudentToSection = async (payload) => {
    const allocateStudentToSection = await post(
      "/api/v1/classroom/student/reAllocateStudents",
      payload
    );
    return allocateStudentToSection;
  };


export { getStudentsForAllocation,allocateStudentToSection,reallocateStudentToSection };
