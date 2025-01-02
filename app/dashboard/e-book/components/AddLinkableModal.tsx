import React, { useState } from "react";
import { Item, Linkable } from "../booktypes"; // Adjust the import path as necessary
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import { generateRandomString } from "../helpers";

const AddLinkableModal: React.FC<{
  showLinkableModal: boolean;
  addNewElement: (e: string, f: Item) => void;
  onClose: () => void;
}> = ({ addNewElement, showLinkableModal, onClose }) => {
  const [linkText, setLinkText] = useState("");
  const [linkTo, setLinkTo] = useState("");
  const [linkType, setLinkType] = useState<"internal" | "external">("internal");
  const [textStyle, setTextStyle] = useState<{ [key: string]: string }>({});

  const handleAddLinkableItem = () => {
    const newLinkableItem: Linkable = {
      type: "linkable",
      title: generateRandomString(10),
      content: [
        {
          text: linkText,
          linkTo: linkTo,
          linkType: linkType,
          textStyle: textStyle,
        },
      ],
    };

    addNewElement("linkable", newLinkableItem);
    setLinkText("");
    setLinkTo("");
    setLinkType("internal");
    setTextStyle({});
  };

  return (
    <>
      <Dialog open={showLinkableModal} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[605px]">
          <DialogHeader>
            <DialogTitle>Add Linkable</DialogTitle>
          </DialogHeader>
          <div className="linkable-item-creator">
            <h3 className="text-lg font-semibold">Create Linkable Item</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block mb-2">Link Text</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter link text"
                />
              </div>
              <div>
                <label className="block mb-2">Link To</label>
                <input
                  type="text"
                  value={linkTo}
                  onChange={(e) => setLinkTo(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter link destination"
                />
              </div>
              <div>
                <label className="block mb-2">Link Type</label>
                <select
                  value={linkType}
                  onChange={(e) =>
                    setLinkType(e.target.value as "internal" | "external")
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="internal">Internal</option>
                  <option value="external">External</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">Text Style (optional)</label>
                <input
                  type="text"
                  onChange={(e) =>
                    setTextStyle({ ...textStyle, color: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="Enter text color (e.g., red, #ff0000)"
                />
              </div>
              <button
                onClick={handleAddLinkableItem}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              >
                Add Linkable Item
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddLinkableModal;
