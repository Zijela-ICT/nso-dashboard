import React, { useState } from "react";
import AddInfographicModal from "./AddInfographicModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import { Plus } from "lucide-react";
import AddDecisionTreeModal from "./AddDecisiontreeModal";
import AddLinkableModal from "./AddLinkableModal";
import AddTableModal from "./AddTableModal";

function AddDropdown({
  addNewElement,
  isList = false,
}: {
  addNewElement: (type: string, createData?: unknown, index?: number) => void;
  isList?: boolean;
}) {
  const [showDecisionTreeModal, setShowDecisionTreeModal] = useState(false);
  const [showInfographicModal, setShowInfographicModal] =
    useState<boolean>(false);
  const [showLinkableModal, setShowLinkableModal] = useState<boolean>(false);
  const [showTableModal, setShowTableModal] = useState<boolean>(false);
  const dropDownItems: string[] = ["unorderedList", "orderedList", "text"];
  const closeModals = () => {
    setShowDecisionTreeModal(false);
    setShowInfographicModal(false);
    setShowLinkableModal(false);
    setShowTableModal(false);
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div
            className="outline-none flex w-8 h-8 bg-white rounded-full  items-center justify-center border border-[#e7e7e7]"
            onClick={() => {}}
          >
            <Plus />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px]">
          {dropDownItems.map((item, i) => (
            <DropdownMenuItem key={i}>
              <div
                onClick={() => {
                  if (item === "table") {
                    setShowTableModal(true);
                  } else {
                    addNewElement(item);
                  }
                }}
                className={`cursor-pointer capitalize p-2 w-full`}
              >
                {item}
              </div>
            </DropdownMenuItem>
          ))}
          {isList && (
            <DropdownMenuItem>
              <div
                onClick={() => {
                  addNewElement("listitem");
                }}
                className={`cursor-pointer capitalize p-2 w-full`}
              >
                Listitem
              </div>
            </DropdownMenuItem>
          )}
          <div className="px-4 py-2 hover:bg-[#f2f2f2] cursor-pointer w-full">
            <button
              className="text-sm w-full h-full text-left"
              onClick={() => setShowTableModal(true)}
            >
              Add table
            </button>
            <AddTableModal
              onClose={() => setShowTableModal(false)}
              showTableModal={showTableModal}
              addNewElement={(e, f) => {
                addNewElement(e, f);
                closeModals();
              }}
            />
          </div>
          <div className="px-4 py-2 hover:bg-[#f2f2f2] cursor-pointer w-full">
            <button
              className="text-sm w-full h-full text-left"
              onClick={() => setShowInfographicModal(true)}
            >
              Image
            </button>
            <AddInfographicModal
              onClose={() => setShowInfographicModal(false)}
              showInfographicModal={showInfographicModal}
              addNewElement={(e, f) => {
                addNewElement(e, f);
                closeModals();
              }}
            />
          </div>
          <div className="px-4 py-2 hover:bg-[#f2f2f2] cursor-pointer w-full">
            <button
              className="text-sm w-full h-full text-left"
              onClick={() => setShowLinkableModal(true)}
            >
              Linkable
            </button>
            <AddLinkableModal
              onClose={() => setShowLinkableModal(false)}
              showLinkableModal={showLinkableModal}
              addNewElement={(e, f) => {
                addNewElement(e, f);
                closeModals();
              }}
            />
          </div>
          <div className="px-4 py-2 hover:bg-[#f2f2f2] cursor-pointer w-full">
            <button
              className="text-sm w-full h-full text-left"
              onClick={() => setShowDecisionTreeModal(true)}
            >
              Decision tree
            </button>
            <AddDecisionTreeModal
              onClose={() => setShowDecisionTreeModal(false)}
              showDecisionTreeModal={showDecisionTreeModal}
              addNewElement={(e, f) => {
                addNewElement(e, f);
                closeModals();
              }}
            />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default AddDropdown;
