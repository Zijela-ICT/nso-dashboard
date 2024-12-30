/* eslint-disable  */

import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { showToast } from "@/utils/toast";
import storageUtil from "./browser-storage";
import CONFIG from "./config";

const api = axios.create({
  baseURL: CONFIG.API_BASE_URL
});

api.interceptors.request.use(async (config) => {
  const headers = config.headers;
  const accessToken = storageUtil.get("access_token");
  headers.authorization = `Bearer ${accessToken}`;
  return config;
});

interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

const formatErrorDetail = (
  detail: string | ValidationError[] | undefined
): string => {
  if (!detail) return "Request failed, Try again later.";

  if (Array.isArray(detail)) {
    // Extract messages from the validation error objects
    return detail.map((error) => error.msg).join("\n");
  }

  // If it's a string, return as is
  return detail;
};

const handleApiError = (
  error: AxiosError,
  showError: boolean,
  show404Error: boolean = true
) => {
  let errorMessage: { message: any; status: any; statusCode: any } = {
    message: "An error occurred. Please try again later.",
    status: false,
    statusCode: null
  };
  if (error.response) {
    const { data, statusCode, status }: any = error.response;
    errorMessage = {
      message:
        statusCode >= 500 || status >= 500
          ? "Oops! Something went wrong on our end. Please try again later."
          : showError && formatErrorDetail(data.detail || data.message),
      status: status,
      statusCode: statusCode
    };

    if (
      status === 401 &&
      (data.detail?.toString().toLowerCase().includes("invalid") || false)
    ) {
      showToast("Session expired. Please login again.", "error");
      window.location.href = "/";
    }
  } else if (error.request) {
    errorMessage = {
      message: "Oops! Something went wrong on our end. Please try again later.",
      status: false,
      statusCode: null
    };
  }
  if (
    errorMessage.status === 401 &&
    (errorMessage.message?.toString().toLowerCase().includes("invalid") ||
      false)
  ) {
    showToast("Session expired. Please login again.", "error");
    window.location.href = "/";
  } else if (
    ((errorMessage.statusCode && errorMessage.statusCode >= 404) ||
      errorMessage.status >= 404) &&
    show404Error
  ) {
    showError && showToast("Resource not found", "error");
  } else if (
    (errorMessage.statusCode && errorMessage.statusCode >= 500) ||
    errorMessage.status >= 500
  ) {
    showToast(errorMessage.message, "error");
  } else if (showError) {
    showToast(errorMessage.message, "error");
  }

  throw errorMessage;
};

let CancelToken = axios.CancelToken;
let source = CancelToken.source();

// Axios request wrapper with loading and toast handling
const request = async <T>(
  method: AxiosRequestConfig["method"],
  url: string,
  data: any = null,
  showSuccessMessage: boolean = false,
  showErrorMessage: boolean = true,
  customMessage: string = "",
  isFormData: boolean = false,
  isFileDownload: boolean = false, // New parameter
  fileName?: string,
  show404Error: boolean = false // New parameter
): Promise<T> => {
  try {
    let requestData = data;
    const headers: any = {};

    if (isFormData && data instanceof FormData) {
      headers["Content-Type"] = "multipart/form-data";
    } else if (!(data instanceof FormData) && data !== null) {
      headers["Content-Type"] = "application/json";
      requestData = JSON.stringify(data);
    }

    // Add responseType for file downloads
    const config: AxiosRequestConfig = {
      method,
      url,
      data: requestData,
      headers,
      cancelToken: source.token,
      transformRequest: isFormData ? [(data) => data] : undefined
    };

    if (isFileDownload) {
      config.responseType = "blob";
    }

    const response = await api.request(config);

    // Handle file download
    if (isFileDownload && response.data) {
      const contentType = response.headers["content-type"];
      const contentDisposition = response.headers["content-disposition"];
      let filename = fileName || "download";

      // Extract filename from Content-Disposition header
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        );
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, "");
        }
      }

      // Create blob and trigger download
      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true } as T;
    }

    if (showSuccessMessage) {
      const message = customMessage || response.data.message;
      showToast(message, "success");
    }
    return response.data;
  } catch (error: any) {
    return handleApiError(error, showErrorMessage, show404Error);
  }
};
export const cancelRequest = () => {
  source.cancel("Request cancelled or undone");
};

export default request;
