import { AxiosResponse } from "axios";
import request from "./api";
import { IChprbnBook } from "@/app/dashboard/e-book/hooks/useEBooks";

export const getEbooks = (): Promise<AxiosResponse<IChprbnBook[]>> => {
  return request("GET", "/admin/ebooks");
};

export const getEbookVersion = (
  id: number,
  version: string = ""
): Promise<
  AxiosResponse<{
    fileUrl: string;
    versions: { id: number; version: number }[];
  }>
> => {
  let param = "";
  if (version) {
    param = `?version=${version}`;
  }
  return request("GET", `/admin/ebooks/${id}/versions${param}`);
};

export const createEbooks = (data) => {
  return request("POST", "/admin/ebooks", data);
};

export const updateEbooks = (data, id) => {
  return request("PATCH", `/admin/ebooks/${id}`, data);
};

export const approveEbook = (id) => {
  return request("PATCH", `/admin/ebooks/approve/${id}`);
};

export const uploadFile = (data): Promise<AxiosResponse<string>> => {
  return request("POST", "/uploads", data);
};

export const getFile = (url: string) => {
  return request("GET", `/uploads/${url.split("/uploads/")[1]}`);
};