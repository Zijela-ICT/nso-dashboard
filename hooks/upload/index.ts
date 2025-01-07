import { uploadFile } from "@/utils/book.services";

export const useUpload = () => {
  const getUploadFileUrl = async (file: File): Promise<string> => {
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await uploadFile(form);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  return getUploadFileUrl;
};
