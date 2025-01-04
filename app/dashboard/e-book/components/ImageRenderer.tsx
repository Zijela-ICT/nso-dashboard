import { getFile } from "@/utils/book.services";
import React, { useState, useEffect } from "react";

const BinaryImageRenderer = ({ url }: { url: string }) => {
  const [fileBlob, setFileBlob] = useState<Blob | null>(null);

  useEffect(() => {
    const fetchFile = async () => {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("@chprbn")}`,
        },
      });
      if (!response.ok) {
        console.error("Failed to fetch the file");
        return;
      }

      const blob = await response.blob();
      setFileBlob(blob);
    };

    fetchFile();
  }, [url]);

  if (!fileBlob) {
    return <div>Loading...</div>;
  }

  const fileUrl = URL.createObjectURL(fileBlob);
  return (
    <div>
      <img src={fileUrl} alt="" />
    </div>
  );
};

export default BinaryImageRenderer;
