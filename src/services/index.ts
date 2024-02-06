import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { serverConfig } from "../config/server-config";

const appServerURL = serverConfig.appServerUrl;

const instance = axios.create({
  baseURL: appServerURL,
});

// Add a response interceptor to handle global response behavior
instance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // if (!error.response) {
    //   error.response = {
    //     data: "INTERNAL SERVER ERROR",
    //     status: 500,
    //   };
    // }

    // if (error?.response.status === 401) {
    //   throw error;
    // }

    return Promise.reject(error);
  }
);

const API = (config: AxiosRequestConfig) => {
  return instance(config);
};

export default API;
