import React, { useState } from "react";
import { Item, Space } from "../booktypes"; // Adjust the import path as necessary
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";

const AddSpacerModal: React.FC<{
  showSpacerModal: boolean;
  addNewElement: (e: string, f: Item) => void;
  onClose: () => void;
}> = ({ addNewElement, showSpacerModal, onClose }) => {
  const [spacerValue, setSpacerValue] = useState("");

  const handleAddSpacerItem = () => {
    const newSpacerItem: Space = {
      type: "space",
      content: `${spacerValue}px`,
    };

    addNewElement("space", newSpacerItem);
    setSpacerValue("");
    onClose();
  };

  return (
    <>
      <Dialog open={showSpacerModal} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[605px]">
          <DialogHeader>
            <DialogTitle>Add Spacer</DialogTitle>
          </DialogHeader>
          <div className="spacer-item-creator">
            <div className="flex flex-col gap-4">
              <div>
                <label className="block mb-2">Spacer Value</label>
                <input
                  type="number"
                  value={spacerValue}
                  onChange={(e) => setSpacerValue(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter spacer value"
                />
              </div>
              <button
                onClick={handleAddSpacerItem}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              >
                Add Spacer Item
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddSpacerModal;
