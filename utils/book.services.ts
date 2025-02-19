import { AxiosResponse } from "axios";
import request from "./api";
import { IChprbnBook } from "@/app/dashboard/e-book/hooks/useEBooks";
import { VersionData } from "@/app/dashboard/e-book/approval/page";

export const getEbooks = (): Promise<AxiosResponse<IChprbnBook[]>> => {
  return request("GET", "/admin/ebooks");
};

export const getEbookVersion = (
  id: number,
  version: string = ""
): Promise<AxiosResponse<VersionData>> => {
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
  return request("PATCH", `/admin/ebooks/${id}`, data, null, null, null, true);
};

export const approveEbook = (id) => {
  return request("PATCH", `/admin/ebooks/approve/${id}`);
};

export const unApproveEbook = (id) => {
  return request("PATCH", `/admin/ebooks/disapprove/${id}`);
};

export const uploadFile = (data): Promise<AxiosResponse<string>> => {
  return request("POST", "/uploads", data);
};

export const getFile = (url: string) => {
  return request("GET", `/uploads/${url.split("/uploads/")[1]}`);
};

export const assignEditor = (
  ebookId: number,
  data: { editorIds: number[] },
  isEditor: boolean
) => {
  return request(
    "PATCH",
    `/admin/ebooks/${ebookId}/${isEditor ? "unassign" : "assign"}-editor`,
    data
  );
};

export const assignApprover = (
  ebookId: number,
  data: { approverIds: number[] },
  isApprover: boolean
) => {
  return request(
    "PATCH",
    `/admin/ebooks/${ebookId}/${isApprover ? "unassign" : "assign"}-approver`,
    data
  );
};

export const getDifferenceFromLastApproved = (
  ebookId: string,
  version: string
) => {
  return request("GET", `/admin/ebooks/${ebookId}/compare_version/${version}`);
};
