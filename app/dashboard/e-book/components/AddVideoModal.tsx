import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { uploadFile } from "@/utils/book.services";

export interface VideoData {
  video: File | string; // Adjust this based on your actual data structure
}

function AddVideoModal({
  addNewElement,
  showVideoModal,
  onClose,
}: {
  addNewElement: (e: string, f: VideoData) => void;
  showVideoModal: boolean;
  onClose: () => void;
}) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    const form = new FormData();
    form.append("file", selectedImage);
    setLoading(true);
    try {
      const res = await uploadFile(form);
      addNewElement("video", { video: res.data });
      onClose();
    } catch (error) {
      console.log(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={showVideoModal} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add video</DialogTitle>
        </DialogHeader>
        <div className="bg-white">
          <h2 className="text-xl font-bold mb-4">Upload Video</h2>
          <input
            type="file"
            accept="video/*"
            onChange={handleImageChange}
            className="mb-4"
          />
          {selectedImage && <p>Selected file: {selectedImage.name}</p>}
          <Button isLoading={loading} onClick={handleSubmit}>
            Add Video
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddVideoModal;
