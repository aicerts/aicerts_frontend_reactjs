import API from "./index";
import { serverConfig } from "../config/server-config";



// Define the expected response structure for the registration API call
interface Response {
  status: "SUCCESS" | "ERROR";
  data?: any;
  error?: any;
  message?: any
}

// Set the base URL for the app server using the configuration
// const BASE_URL = serverConfig.appServerUrl;
const BASE_URL = "localhost:8000/api";
/**
 * Function to register a user
 * @param data - The data to be sent in the registration request
 * @param callback - Callback function to handle the registration response
 */
const verifyCertificate = (data: any, callback: (response: Response) => void) => {
  API({
    method: "POST",
    url: `api/verify-encrypted`,
    data: {
      encryptedData:data.qValue,
      iv:data.ivValue
    },
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
};

const certificate ={
  verifyCertificate
}

export default certificate;