import { get, post } from "../../utility/ApiCall";

const addContactUs = async (payload) => {
    const addingContactUs = await post(
      `/api/v1/registration/student/createContact`,
      payload
    );
    return addingContactUs;
  };


  export {
    addContactUs
  };