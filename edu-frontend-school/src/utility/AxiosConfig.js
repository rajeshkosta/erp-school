import { useEffect } from "react";
import axios from "axios";
import * as AppPreference from "./AppPreference.js";
import * as authService from "../screens/auth/auth.service.js";
import ToastUtility from "./ToastUtility.js";
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_EDU_BASE_URL,
});

const useInterceptors = (logout, navigate, toastUtility) => {
  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        if (process.env.REACT_APP_ENV == 'local') {
          if (config.url.indexOf("/api/v1/auth") != -1) {
            config.baseURL = process.env.REACT_APP_AUTH_EDU_BASE_URL;
          } else if (config.url.indexOf("/api/v1/admin") != -1) {
            config.baseURL = process.env.REACT_APP_ADMIN_EDU_BASE_URL;
          } else if (config.url.indexOf("/api/v1/user") != -1) {
            config.baseURL = process.env.REACT_APP_USER_EDU_BASE_URL;
          } else if (config.url.indexOf("/api/v1/classroom") != -1) {
            config.baseURL = process.env.REACT_APP_CLASSROOM_EDU_BASE_URL;
          }
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
     async (error) => {

        if (error.response && error.response.status === 400) {
          let message = "";
          if (error.response.data instanceof Object) {
            message = error.response.data.error;
          } else if (error.response.data instanceof String) {
            try {
              const data = JSON.parse(error.response.data);
              message = data.error;
            } catch (e) {
              console.error(e);
            }
          }
          if (message) {
            toastUtility.error(message);
          }
        }
        return Promise.reject(error);
      }
      
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [logout, navigate, toastUtility]);

  return null;
};

export { axiosInstance, useInterceptors };
