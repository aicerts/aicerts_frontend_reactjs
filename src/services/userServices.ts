import API from "./index";
import { serverConfig } from "../config/server-config";

// Define the expected response structure for the registration API call
interface RegisterResponse {
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
  // Make a POST request to the signup endpoint using the API module
  API({
    method: "POST",
    url: `${BASE_URL}/api/signup`,
    data:data
  })
    .then((response) => {
      // If the request is successful, invoke the callback with a success status and the response data
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      // If there is an error, invoke the callback with an error status and the error details
      callback({ status: "ERROR", error: error });
    });
};


const user = {
  register
}
// Export the register function as the default export for this module
export default user;
