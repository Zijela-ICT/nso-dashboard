import axios from "axios";
import { bareAxios, chpbrnAxios } from "./apis";

export const loginUser = (data) => {
  return axios({
    method: "POST",
    url: "https://chprbn-dev.zijela.com/v1/auth/login",
    data,
  });
};
