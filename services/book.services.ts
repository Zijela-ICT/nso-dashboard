import { chpbrnAxios } from "./apis";

export const getEbooks = () => {
  return chpbrnAxios({
    method: "GET",
    url: "/admin/ebooks",
  });
};

export const createEbooks = (data) => {
  return chpbrnAxios({
    method: "POST",
    url: "/admin/ebooks",
    data,
  });
};

export const updateEbooks = (data, id) => {
  return chpbrnAxios({
    method: "PATCH",
    url: `/admin/ebooks/${id}`,
    data,
  });
};
