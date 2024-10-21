import API from "./index";
import { serverConfig } from "../config/server-config";
import { encryptData } from "@/utils/reusableFunctions";

// Define the expected response structure for the registration API call
interface Response {
  status: "SUCCESS" | "ERROR";
  data?: any;
  error?: any;
  message?: any;
}

// Set the base URL for the app server using the configuration
const APP_URL = serverConfig.appServerUrl;
const BASE_URL = serverConfig.appUserUrl;
const ADMIN_API_URL = serverConfig.appApiUrl;

// Define the encryption key from the environment variable
const secretKey = process.env.NEXT_PUBLIC_BASE_ENCRYPTION_KEY;

/**
 * Function to encrypt the payload data
 * @param data - The data to encrypt
 * @param key - The secret key used for encryption
 * @returns Encrypted data as a string
 */


/**
 * Function to register a user
 * @param data - The data to be sent in the registration request
 * @param callback - Callback function to handle the registration response
 */
const register = (data: any, callback: (response: Response) => void) => {
  const encryptedData = encryptData(data);
  
  API({
    method: "POST",
    url: `${BASE_URL}/api/signup`,
    data: { data: encryptedData },
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
};

const verifyOtp = (data: any, callback: (response: Response) => void) => {
  const encryptedData = encryptData(data);
  
  API({
    method: "POST",
    url: `${BASE_URL}/api/verify-issuer`,
    data: { data: encryptedData },
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error?.response });
    });
};

const sendLink = (data: any, callback: (response: Response) => void) => {
  const encryptedData = encryptData({ email: data });
  
  API({
    method: "POST",
    url: `${BASE_URL}/api/forgot-password`,
    data: { data: encryptedData },
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
};

const changePassword = (data: any, callback: (response: Response) => void) => {
  const encryptedData = encryptData(data);
  
  API({
    method: "POST",
    url: `${BASE_URL}/api/reset-password`,
    data: { data: encryptedData },
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
};

const refreshToken = (data: any, callback: (response: Response) => void) => {
  const encryptedData = encryptData({ token: data?.refreshToken, email: data?.email });
  
  API({
    method: "POST",
    url: `${BASE_URL}/api/refresh`,
    data: { data: encryptedData },
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
};

// const issuersLog = (data: any, callback: (response: Response) => void) => {
//   const encryptedData = encryptData(data);
  
//   API({
//     method: "POST",
//     url: `${APP_URL}/api/get-issuers-log`,
//     data: { data: encryptedData },
//   })
//     .then((response) => {
//       callback({ status: "SUCCESS", data: response.data });
//     })
//     .catch((error) => {
//       callback({ status: "ERROR", error: error });
//     });
// }

const creditLimit = (data: any, callback: (response: Response) => void) => {
  const encryptedData = encryptData(data);
  
  API({
    method: "POST",
    url: `${APP_URL}/api/get-credits-by-email`,
    data: { data: encryptedData },
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
}

const appIssuersLog = (data: any, callback: (response: Response) => void) => {
  const encryptedData = encryptData(data);
  
  API({
    method: "POST",
    url: `${APP_URL}/api/get-issuers-log`,
    data: { data: encryptedData },
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
}

const updateCertsStatus = (data: any, callback: (response: Response) => void) => {
  const encryptedData = encryptData(data);
  
  API({
    method: "POST",
    url: `${APP_URL}/api/update-cert-status`,
    data: { data: encryptedData },
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
}

const renewCert = (data: any, callback: (response: Response) => void) => {
  const encryptedData = encryptData(data);
  
  API({
    method: "POST",
    url: `${APP_URL}/api/renew-cert`,
    data: { data: encryptedData },
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
}

const downloadImage = (data: any, callback: (response: Response) => void) => {
  const encryptedData = encryptData(data);
  
  API({
    method: "POST",
    url: `${APP_URL}/api/downloadImage`,
    data: { data: encryptedData },
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
}

const uploadCertificate = (data: any, callback: (response: Response) => void) => {
  const encryptedData = encryptData(data);
  
  API({
    method: "POST",
    url: `${APP_URL}/api/upload-certificate`,
    data: { data: encryptedData },
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
}

const batchCertificates = (data: any, callback: (response: Response) => void) => {
  const encryptedData = encryptData(data);
  
  API({
    method: "POST",
    url: `${APP_URL}/api/upload-certificate`,
    data: { data: encryptedData },
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
}

const batchCertificateIssue = (data: any, callback: (response: Response) => void) => {
  const encryptedData = encryptData(data);
  
  API({
    method: "POST",
    url: `${ADMIN_API_URL}/api/batch-certificate-issue`,
    data: { data: encryptedData },
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
}


const apidownloadImage = (data: any, callback: (response: Response) => void) => {
  const encryptedData = encryptData(data);
  
  API({
    method: "POST",
    url: `${ADMIN_API_URL}/api/downloadImage`,
    data: { data: encryptedData },
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
}


const apiuploadCertificate = (data: any, callback: (response: Response) => void) => {
  const encryptedData = encryptData(data);
  
  API({
    method: "POST",
    url: `${ADMIN_API_URL}/api/upload-certificate`,
    data: { data: encryptedData },
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
}

const dynamicBatchIssue = (data: any, callback: (response: Response) => void) => {
  const encryptedData = encryptData(data);
  
  API({
    method: "POST",
    url: `${APP_URL}/api/dynamic-batch-issue`,
    data: { data: encryptedData },
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
}

const bulkBatchIssue = (data: any, callback: (response: Response) => void) => {
  const encryptedData = encryptData(data);
  
  API({
    method: "POST",
    url: `${APP_URL}/api/bulk-batch-issue`,
    data: { data: encryptedData },
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
}


const issueDynamicPdf = (data: any, callback: (response: Response) => void) => {
  const encryptedData = encryptData(data);
  
  API({
    method: "POST",
    url: `${ADMIN_API_URL}/api/issue-dynamic-pdf`,
    data: { data: encryptedData },
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
}

const provideInputs = (data: any, callback: (response: Response) => void) => {
  const encryptedData = encryptData(data);
  
  API({
    method: "POST",
    url: `${ADMIN_API_URL}/api/provide-inputs`,
    data: { data: encryptedData },
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
}

const adminFilteredIssues = (data: any, callback: (response: Response) => void) => {
  const encryptedData = encryptData(data);
  
  API({
    method: "POST",
    url: `${APP_URL}/api/admin-filtered-issues`,
    data: { data: encryptedData },
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
}

const filteredIssues = (data: any, callback: (response: Response) => void) => {
  const encryptedData = encryptData(data);
  
  API({
    method: "POST",
    url: `${APP_URL}/api/get-filtered-issues`,
    data: { data: encryptedData },
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
}

const getbulkFiles = (data: any, callback: (response: Response) => void) => {
  const encryptedData = encryptData(data);
  
  API({
    method: "POST",
    url: `${APP_URL}/api/get-bulk-files`,
    data: { data: encryptedData },
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
}

const getIssue = (data: any, callback: (response: Response) => void) => {
  const encryptedData = encryptData(data);
  
  API({
    method: "POST",
    url: `${APP_URL}/api/get-issue`,
    data: { data: encryptedData },
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
}



const user = {
  register,
  verifyOtp,
  sendLink,
  changePassword,
  refreshToken,
  // issuersLog,
  creditLimit,
  appIssuersLog,
  updateCertsStatus,
  renewCert,
  downloadImage,
  uploadCertificate,
  batchCertificates,
  batchCertificateIssue,
  apidownloadImage,
  apiuploadCertificate,
  dynamicBatchIssue,
  bulkBatchIssue,
  issueDynamicPdf,
  provideInputs,
  adminFilteredIssues,
  filteredIssues,
  getbulkFiles,



};

export default user;
