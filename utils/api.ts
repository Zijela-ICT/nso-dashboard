/* eslint-disable  */
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { showToast } from "@/utils/toast";
import storageUtil from "./browser-storage";
import CONFIG from "./config";

class AuthManager {
  private static instance: AuthManager;
  private isRefreshing: boolean = false;
  private failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
  }> = [];

  private constructor() {}

  public static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  private processQueue(error: any = null, token: string | null = null) {
    this.failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else if (token) {
        promise.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  private async refreshAuthToken(): Promise<string | null> {
    try {
      const refreshToken = storageUtil.get("@refresh_token");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await axios.post(
        `${CONFIG.API_BASE_URL}/auth/refresh-token`,
        { refreshToken }
      );

      const { data: newAccessToken } = response.data;

      // Store the new access token
      storageUtil.store("@chprbn", newAccessToken);

      return newAccessToken;
    } catch (error) {
      return null;
    }
  }

  public async handleTokenRefresh(error: any): Promise<string | null> {
    const originalRequest = error.config;

    if (originalRequest._retry) {
      return null;
    }

    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      });
    }

    originalRequest._retry = true;
    this.isRefreshing = true;

    try {
      const newToken = await this.refreshAuthToken();

      if (newToken) {
        this.processQueue(null, newToken);
        return newToken;
      } else {
        this.processQueue(new Error("Failed to refresh token"));
        this.logout();
        return null;
      }
    } catch (refreshError) {
      this.processQueue(refreshError);
      this.logout();
      return null;
    } finally {
      this.isRefreshing = false;
    }
  }

  public logout() {
    storageUtil.delete("@chprbn");
    storageUtil.delete("@refresh_token");
    window.location.href = "/";
  }
}

const api = axios.create({
  baseURL: CONFIG.API_BASE_URL
});

api.interceptors.request.use(async (config) => {
  const headers = config.headers;
  const accessToken = storageUtil.get("@chprbn");
  if (accessToken) {
    headers.authorization = `Bearer ${accessToken}`;
  } else {
    delete headers.authorization;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      const newToken = await AuthManager.getInstance().handleTokenRefresh(
        error
      );

      if (newToken) {
        originalRequest.headers.authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

interface ApiErrorResponse {
  statusCode: number;
  message: string | string[] | ValidationError[];
  error: string | null;
  timestamp?: string;
  path?: string;
  detail?: string | ValidationError[];
}

const formatErrorDetail = (
  detail: string | string[] | ValidationError[] | undefined
): string => {
  if (!detail) return "Request failed, Try again later.";

  if (Array.isArray(detail) && detail.length > 0) {
    if (typeof detail[0] === "object" && "msg" in detail[0]) {
      return (detail as ValidationError[]).map((error) => error.msg).join("\n");
    }
    return (detail as string[]).join("\n");
  }

  return detail.toString();
};

const handleApiError = (
  error: AxiosError<ApiErrorResponse>,
  showError: boolean,
  show404Error: boolean = true
) => {
  let errorMessage: { message: any; status: any; statusCode: any } = {
    message: "An error occurred. Please try again later.",
    status: false,
    statusCode: null
  };

  if (error.response) {
    const { data, status }: any = error.response;
    const statusCode = data.statusCode || status;

    let formattedMessage: string;
    if (statusCode >= 500) {
      formattedMessage =
        "Something went wrong on our end. Please try again later.";
    } else if (showError) {
      const messageContent = data.detail || data.message;
      formattedMessage = formatErrorDetail(messageContent);
    } else {
      formattedMessage = "An error occurred.";
    }

    errorMessage = {
      message: formattedMessage,
      status: status,
      statusCode: statusCode
    };

    // Handle expired token
    if (
      status === 401 &&
      (data.detail?.toString().toLowerCase().includes("expired") ||
        data.message?.toString().toLowerCase().includes("expired"))
    ) {
      showToast("Session expired. Please login again.", "error");
      AuthManager.getInstance().logout();
      return;
    }
  } else if (error.request) {
    errorMessage = {
      message: "Network error. Please check your connection and try again.",
      status: false,
      statusCode: null
    };
  }

  if (errorMessage.status >= 404 && show404Error) {
    showError && showToast("Resource not found", "error");
  } else if (errorMessage.status >= 500) {
    showToast(errorMessage.message, "error");
  } else if (showError) {
    showToast(errorMessage.message, "error");
  }

  throw errorMessage;
};

let CancelToken = axios.CancelToken;
let source = CancelToken.source();

const request = async <T>(
  method: AxiosRequestConfig["method"],
  url: string,
  data: any = null,
  showSuccessMessage: boolean = false,
  showErrorMessage: boolean = true,
  customMessage: string = "",
  isFormData: boolean = false,
  isFileDownload: boolean = false,
  fileName?: string,
  show404Error: boolean = false
): Promise<any> => {
  try {
    let requestData = data;
    const headers: any = {};

    if (isFormData && data instanceof FormData) {
      headers["Content-Type"] = "multipart/form-data";
    } else if (!(data instanceof FormData) && data !== null) {
      headers["Content-Type"] = "application/json";
      requestData = JSON.stringify(data);
    }

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

    if (isFileDownload && response.data) {
      const contentType = response.headers["content-type"];
      const contentDisposition = response.headers["content-disposition"];
      let filename = fileName || "download";

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        );
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, "");
        }
      }

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
