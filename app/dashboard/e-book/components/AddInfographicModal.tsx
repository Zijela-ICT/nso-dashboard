import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { uploadFile } from "@/utils/book.services";

export interface InfographicData {
  image: File | string; // Adjust this based on your actual data structure
}

function AddInfographicModal({
  addNewElement,
  showInfographicModal,
  onClose,
}: {
  addNewElement: (e: string, f: InfographicData) => void;
  showInfographicModal: boolean;
  onClose: () => void;
}) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    const form = new FormData();
    form.append("file", selectedImage);

    try {
      const res = await uploadFile(form);
      addNewElement("infographic", { image: res.data });
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <Dialog open={showInfographicModal} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add image</DialogTitle>
        </DialogHeader>
        <div className="bg-white">
          <h2 className="text-xl font-bold mb-4">Upload Image</h2>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mb-4"
          />
          {selectedImage && <p>Selected image: {selectedImage.name}</p>}
          <Button
            // className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleSubmit}
          >
            Add Image
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddInfographicModal;
