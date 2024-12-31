import { CHPBRN_TOKEN } from "@/constants";
import axios from "axios";

export const chpbrnAxios = axios.create({
  baseURL: "https://chprbn-dev.zijela.com/v1",
});

chpbrnAxios.interceptors.request.use(
  (config) => {
    // Modify the request config before sending the request
    const token = localStorage.getItem(CHPBRN_TOKEN); // Example: Get token from local storage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Add token to headers
    }
    return config; // Return the modified config
  },
  (error) => {
    // Handle the error
    console.error("Request error:", error);
    return Promise.reject(error); // Reject the promise with the error
  }
);

export const bareAxios = axios.create({
  baseURL: "https://chprbn-dev.zijela.com/v1",
});

export const uploadFile = (data) => {
  return chpbrnAxios({
    method: "POST",
    url: "/files/upload",
    data,
  });
};
