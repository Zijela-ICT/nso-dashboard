import React from "react";
import { Button } from "../../../../components/ui/button";
import { Plus, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import {
  FlattenedObj,
  IDecisionTree,
  Linkable,
  PageItemType,
  TableData,
} from "../booktypes";
import { InfographicData } from "./AddInfographicModal";
import AddDropdown from "./AddDropdown";
import { useBookContext } from "../context/bookContext";
import { groupClass } from "@/constants";

function SectionHeader({
  updateElementAtPath,
  index,
  chapter,
  flattenBookData,
  removeElement,
  addNewPageElement,
  addNewElement,
}: {
  updateElementAtPath: (e, f) => void;
  index: number;
  chapter: FlattenedObj;
  flattenBookData: FlattenedObj[];
  removeElement: (e: number) => void;
  addNewPageElement: (e, f) => void;
  addNewElement: (e, f, g, h) => void;
}) {
  const { isEditting } = useBookContext();
  const pageItems: PageItemType[] = [
    PageItemType.Chapter,
    PageItemType.SubChapter,
    PageItemType.SubSubChapter,
    PageItemType.Page,
  ];

  const handleInput = (
    event: React.FormEvent<HTMLDivElement>,
    elementIndex
  ) => {
    const newText = event.currentTarget.textContent || "";
    if (newText !== flattenBookData[elementIndex].data) {
      updateElementAtPath(newText, elementIndex);
    }
  };

  return (
    <h3
      onBlur={(e) => handleInput(e, index)}
      contentEditable={isEditting}
      suppressContentEditableWarning={true}
      className={`group  text-[18px] font-medium chapter-title text-[#0CA554] flex justify-between items-center ${groupClass}`}
    >
      <p>{chapter.data as string}</p>

      {isEditting && (
        <div className="group-hover:opacity-100 flex opacity-0 items-center">
          <Button
            className="mx-2 w-6 h-6 p-0 text-white"
            variant="destructive"
            onClick={() => removeElement(index)}
          >
            <Trash />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="mx-2 w-6 h-6 p-0 bg-[#0CA554] text-white">
                <Plus />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {pageItems.map((item, i) => (
                <DropdownMenuItem
                  key={i}
                  onClick={() => {
                    addNewPageElement(
                      item as PageItemType,
                      chapter.parentIndex
                    );
                  }}
                >
                  <div
                    className={`border-b-[${
                      i === pageItems.length - 1 ? 0 : 1
                    }px] border-[#e7e7e76d] cursor-pointer capitalize p-2`}
                  >
                    {item}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {chapter.parentIndex.length !== 3 && (
            <AddDropdown
              addNewElement={(e, f) =>
                addNewElement(
                  e,
                  f as InfographicData | TableData | Linkable | IDecisionTree,
                  index,
                  true
                )
              }
            />
          )}
        </div>
      )}
    </h3>
  );
}

export default SectionHeader;