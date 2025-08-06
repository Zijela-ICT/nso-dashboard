import React, { useState, useEffect } from "react";

const VideoRenderer = ({ url }: { url: string }) => {
  const [fileBlob, setFileBlob] = useState<Blob | null>(null);

  useEffect(() => {
    const fetchFile = async () => {
      const filePath = url.split("/uploads/")[1];
      const envUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${filePath}`;
      const response = await fetch(envUrl, {
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
    return <div>Loading video...</div>;
  }

  const fileUrl = URL.createObjectURL(fileBlob);
  return (
    <div>
      <video src={fileUrl} controls />
    </div>
  );
};

export default VideoRenderer;
