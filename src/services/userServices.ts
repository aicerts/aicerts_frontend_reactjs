import API from "./index";
import { serverConfig } from "../config/server-config";

// Define the expected response structure for the registration API call
interface RegisterResponse {
  status: "SUCCESS" | "ERROR";
  data?: any;
  error?: any;
}

// Define the expected response structure for the registration API call
interface OtpResponse {
  status: "SUCCESS" | "ERROR";
  data?: any;
  error?: any;
}

// Set the base URL for the app server using the configuration
const BASE_URL = serverConfig.appServerUrl;

/**
 * Function to register a user
 * @param data - The data to be sent in the registration request
 * @param callback - Callback function to handle the registration response
 */
const register = (data: any, callback: (response: RegisterResponse) => void) => {
  API({
    method: "POST",
    url: `${BASE_URL}/api/signup`,
    data: data,
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
};

const verifyOtp = (data: any, callback: (response: OtpResponse) => void) => {
  API({
    method: "POST",
    url: `${BASE_URL}/api/verify-issuer`,
    data: data,
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
};



const user = {
  register,
  verifyOtp
}
// Export the register function as the default export for this module
export default user;
