import axios, { AxiosRequestConfig } from "axios";
import { serverConfig } from "../config/server-config";
import { logout } from "../common/auth";
const apiUrl_User = process.env.NEXT_PUBLIC_BASE_URL_USER;



const API = (config: AxiosRequestConfig) => {
  const localStorageData = JSON.parse(localStorage?.getItem("user") || "{}");

  if (localStorageData) {
    
    const token = localStorageData?.JWTToken;
    if (token != null) {
      config.headers = {
        ...config.headers,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        Authorization: "Bearer " + token,
      };
    }
  }

  axios.interceptors.response.use(
    async (response) => {
        try {
          const response = await axios.post(`${apiUrl_User}/api/refresh`,{
            token: localStorageData?.refreshToken
          })
          console.log('resfreshToken',response.data.data)
          if(response.status === 200) {
            localStorage.setItem('user', JSON.stringify(response.data.data));
            
          }
        } catch (error) {
          logout();
        }
      return response;
    },
    async function (error) {
      if (!error.response) {
        error.response = {
          data: "INTERNAL SERVER ERROR",
          status: 500,
        };
      }
      if (error.response.status === 401) {
        // try {
        //   const response = await axios.post(`${apiUrl_User}/api/refresh`,{
        //     token: localStorageData?.refreshToken
        //   })
        //   console.log('resfreshToken',response.data.data)
        //   if(response.status === 200) {
        //     localStorage.setItem('user', JSON.stringify(response.data.data));
            
        //   }
        // } catch (error) {
          logout();
        // }
      }
      return Promise.reject(error);
    }
  );

  return axios(config);
};

export default API;
