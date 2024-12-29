import Swal from "sweetalert2";
import { axiosInstance as axios } from "./AxiosConfig";
import * as authService from "../../src/screens/auth/auth.service.js";
import * as AppPreference from "./AppPreference.js";
import "react-toastify/dist/ReactToastify.css";
import ToastUtility from "./ToastUtility";
import withReactContent from "sweetalert2-react-content";

const LoaderSwal = withReactContent(Swal);
const makeRequest = async (
  method,
  url,
  data = null,
  headers = {},
  responseType,
  skipLoader  
) => {
  const jwtToken = AppPreference.getValue("userToken");
  if (jwtToken) {
    headers["Authorization"] = `${jwtToken}`;
  }
  try {
    if (!skipLoader) {
      showLoading();
    }
    const response = await axios({
      method,
      url,
      data,
      headers: {
        ...headers,
      },
      responseType,
    });
    return { error: false, data: response.data };
  } catch (error) {

    if (error.response && error.response.status === 401 && !url.includes("/api/v1/auth/logout")) {
      await authService.logout();
        setTimeout(()=>{
          window.location.href = ""
        },2000)
        ToastUtility.info("Session timed out,signing out.")
        AppPreference.clearAll()
    }

    return { error: true, data: null, errorMessage: error };
  } finally {
    Swal.close();
  }
};



const showLoading = () => {
  LoaderSwal.fire({
    customClass: "swalOverlayLoader",
    background: "rgba(0,0,0,0)",
    color: "#fff",
    didOpen: () => {
      const body = document.body;
      body.style.setProperty("height", "100vh", "important");
      LoaderSwal.showLoading();
    },
    didClose: () => {
      const body = document.body;
      body.style.removeProperty("height");
    },
  });
};

export const get = async (
  url,
  headers = {},
  responseType = "json",
  skipLoader = false
) => {
  try {
    const response = await makeRequest(
      "GET",
      url,
      null,
      headers,
      responseType,
      skipLoader
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const post = async (
  url,
  data,
  headers = {},
  responseType = "json",
  skipLoader = false
) => {
  try {
    const response = await makeRequest(
      "POST",
      url,
      data,
      headers,
      responseType,
      skipLoader
    );
    return response;
  } catch (error) {
    throw error;
  }
};
