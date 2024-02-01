// Import necessary modules from the Axios library
import axios, { AxiosRequestConfig, AxiosError } from "axios";

// Import the server configuration from the "server-config" file
import { serverConfig } from "../config/server-config";

// Set the app server URL based on the configuration
const appServerURL = serverConfig.appServerUrl;

/**
 * Function to make HTTP requests using Axios with additional interceptors
 * @param config - AxiosRequestConfig object containing request configuration
 * @returns Promise that resolves to the Axios response
 */
const API = (config: AxiosRequestConfig) => {

  // Add a response interceptor to handle global response behavior
  axios.interceptors.response.use(
    // If the response is successful, return the response
    (response) => {
      return response;
    },
    // If there's an error in the response, handle it
    (error: AxiosError) => {
      // If no response is received (e.g., network error), create a default response object
      if (!error.response) {
        error.response = {
          data: "INTERNAL SERVER ERROR",
          status: 500,
        };
      }

      // If the error status is 401 (Unauthorized), throw the error for further handling
      if (error?.response.status === 401) {
        throw error;
      }

      // If the error status is different from 401, reject the Promise with the error
      return Promise.reject(error);
    }
  );

  // Set the base URL for the request using the configured app server URL
  config.baseURL = appServerURL;

  // Make the request using Axios and return the Promise
  return axios(config);
};

// Export the API function as the default export for this module
export default API;
