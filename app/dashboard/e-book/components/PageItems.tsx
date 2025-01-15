import React, { useRef, useState } from "react";
import {
  Data,
  FlattenedObj,
  IDecisionTree,
  Item,
  LinkableContent,
  TableData,
} from "../booktypes";
import { generateRandomString, getLocalizedText } from "../helpers";
import AddDropdown from "./AddDropdown";
import { Trash, X } from "lucide-react";
import TableRender from "./TableRender";
import DecisionTreeRenderer from "./DecisionTree";
import { Button } from "../../../../components/ui/button";
import AddDecisionTreeModal from "./AddDecisiontreeModal";
import { useBookContext } from "../context/bookContext";
import ImageRenderer from "./ImageRenderer";
import { groupClass } from "@/constants";

interface NestedListItem {
  content: string | NestedContent[];
  type: string;
}

interface NestedContent {
  text?: string;
  linkTo?: string;
  nestedItems?: Item[];
  parentIndex?: number[];
}

function PageItems({
  items,
  data,
  addNewElement,
  removeElement,
  elementIndex,
  updateElementAtPath,
  createNewItem,
}: {
  items: FlattenedObj[];
  data: Data;
  addNewElement: (
    type: string,
    createData?: unknown,
    itemPath?: number
  ) => void;
  removeElement: (e: number) => void;
  elementIndex: number;
  updateElementAtPath: (e, f) => void;
  createNewItem: (type: string, newItemKey: string) => void;
}) {
  const { isEditting } = useBookContext();
  const itemData = items[0].data as Item;
  const itemPath = items[0].dataPath;
  const contentRef = useRef<HTMLParagraphElement | null>(null);
  const [edittingDecisionTree, setEdittingDecisionTree] = useState(false);

  const handleInputChange = (
    event: React.FormEvent<HTMLDivElement>,
    newValue?: string[]
  ) => {
    const newText = event?.currentTarget?.textContent || "";
    if (itemData.content === newText) return;
    const value = newValue
      ? {
          type: itemData.type || "unorderedList",
          items: newValue,
        }
      : createNewItem("text", newText);
    updateElementAtPath(value, elementIndex);
  };

  const handleListContentChange = (newText: string, index: number) => {
    const updatedItems = [...(itemData.items as string[])];
    updatedItems[index] = newText;

    handleInputChange(null, updatedItems);
  };

  const deleteListItem = (e: number) => {
    const listItems = [...(itemData.items as string[])];
    listItems.splice(e, 1);
    handleInputChange(null, listItems);
  };

  if (!items[0] || !itemData) return <></>;

  const convertToFlattenedObj = (
    item: Item,
    parentIndex: number[]
  ): FlattenedObj => {
    return {
      data: item,
      parentIndex: parentIndex,
      // Add other properties as needed
    };
  };

  const renderNestedList = (listItem: NestedListItem, itemIndex: number) => {
    return (
      <ul
        className={`${
          listItem.type === "unorderedList" ? "list-disc" : "list-decimal"
        } ml-2 w-full mb-4`}
        data-text_path={generateRandomString(10)}
      >
        <li
          data-text_path={listItem.content === "string" ? listItem.content : ""}
          data-text_type={itemData.type}
          className=""
        >
          <div className="flex justify-between items-center">
            {typeof listItem.content === "string" ? (
              <div
                onBlur={(e) =>
                  handleListContentChange(
                    e.currentTarget.textContent || "",
                    itemIndex
                  )
                }
                contentEditable={isEditting}
                suppressContentEditableWarning
              >
                {getLocalizedText(data, listItem.content)}
              </div>
            ) : (
              <ul
                className={`${
                  listItem.type === "unorderedList"
                    ? "list-disc"
                    : "list-decimal"
                } pl-[30px] w-full mb-4`}
                data-text_path={listItem.content[0]}
                data-text_type={"unorderedlist"}
              >
                {listItem.content.map(
                  (innerList: NestedContent, innerIndex: number) => (
                    <li
                      className={`text-[14px] ${groupClass}`}
                      key={innerIndex}
                    >
                      <div className="flex justify-between items-center">
                        <div
                          onBlur={(e) =>
                            handleListContentChange(
                              e.currentTarget.textContent || "",
                              innerIndex
                            )
                          }
                          contentEditable={isEditting}
                          suppressContentEditableWarning
                        >
                          {innerList.linkTo ? (
                            <a
                              className="text-[#2a39c5]"
                              href={innerList.linkTo}
                            >
                              {getLocalizedText(data, innerList.text || "")}
                            </a>
                          ) : (
                            getLocalizedText(data, innerList.text || "")
                          )}
                          {innerList.nestedItems.length > 0 &&
                            renderItems(
                              innerList.nestedItems.map((item) =>
                                convertToFlattenedObj(
                                  item,
                                  innerList.parentIndex
                                )
                              )
                            )}
                        </div>

                        <button
                          onClick={() => deleteListItem(innerIndex)}
                          className="p-1 bg-red-500 text-white w-6 h-6 text-[14px]  flex items-center justify-center rounded-full mr-[50px]"
                        >
                          <X />
                        </button>
                      </div>
                    </li>
                  )
                )}
              </ul>
            )}

            <button
              onClick={() => deleteListItem(itemIndex)}
              className="p-1 bg-red-500 text-white w-6 h-6 text-[14px]  flex items-center justify-center rounded-full mr-[50px]"
            >
              <X />
            </button>
          </div>
        </li>
      </ul>
    );
  };

  const renderItems = (items: FlattenedObj[]) => {
    return items.map((item, index) => {
      let element;
      if (itemData?.type === "text") {
        element = (
          <p
            ref={contentRef}
            key={index}
            className={`text-[14px] w-[100%] ${groupClass}`}
            contentEditable={isEditting}
            suppressContentEditableWarning={true}
            style={{ lineHeight: "160%" }}
            data-text_path={itemPath}
            data-text_type={"text"}
            onBlur={handleInputChange}
          >
            {getLocalizedText(data, (itemData.content || "") as string)}
          </p>
        );
      } else if (
        itemData.type === "unorderedList" ||
        itemData.type === "orderedList"
      ) {
        element = (
          <ul
            key={index}
            className={`${
              itemData.type === "unorderedList" ? "list-disc" : "list-decimal"
            } pl-[30px] mb-4 w-full`}
            data-text_path={itemData.items?.[0]}
            data-text_type={itemData.type}
          >
            {Array.isArray(itemData.items) &&
              itemData?.items?.map((listItem, listItemIndex) => {
                if (typeof listItem === "string") {
                  return (
                    <li
                      key={listItemIndex}
                      className={`text-[14px] ${groupClass}`}
                      data-text_path={listItem}
                      data-text_type={itemData.type}
                    >
                      <div className="flex justify-between items-center">
                        <div
                          onBlur={(e) =>
                            handleListContentChange(
                              e.currentTarget.textContent || "",
                              listItemIndex
                            )
                          }
                          contentEditable={isEditting}
                          suppressContentEditableWarning
                        >
                          {getLocalizedText(data, listItem)}
                        </div>

                        {isEditting && (
                          <button
                            onClick={() => deleteListItem(listItemIndex)}
                            className="p-1 bg-red-500 text-white w-6 h-6 text-[14px]  flex items-center justify-center rounded-full mr-[50px]"
                          >
                            <X />
                          </button>
                        )}
                      </div>
                    </li>
                  );
                } else {
                  return renderNestedList(listItem, listItemIndex);
                }
              })}
          </ul>
        );
      } else if (itemData.type === "infographic") {
        element = (
          <div
            data-text_path={itemPath}
            data-text_type={itemData.type}
            key={index}
            className="flex justify-center items-center w-full my-4"
          >
            <ImageRenderer url={itemData.src} key={index} />
          </div>
        );
      } else if (itemData.type === "table") {
        element = (
          <div
            className="w-full overflow-x-auto py-[40px]"
            key={index}
            data-text_path={itemData.title}
            data-text_type={itemPath}
          >
            <TableRender
              tableData={itemData as TableData}
              onSave={(e: TableData) => {
                updateElementAtPath(e, elementIndex);
              }}
              edit
            />
          </div>
        );
      } else if (itemData.type === "linkable") {
        element = (
          <div style={itemData.style} data-text_path={itemPath}>
            {Array.isArray(itemData.content) &&
              itemData.content.map((link, index) => (
                <a
                  key={index}
                  href={link.linkTo}
                  target={link.linkType === "external" ? "_blank" : "_self"}
                  style={link.textStyle}
                  className="block mb-1"
                >
                  {link.text}
                </a>
              ))}
          </div>
        );
      } else if (itemData.type === "decision") {
        element = (
          <div className="mt-4 group" key={index}>
            {isEditting && (
              <div className="flex justify-end mb-2">
                <Button
                  onClick={() => setEdittingDecisionTree(true)}
                  className="mb-2 border-[#0CA554] text-[#0CA554] hidden group-hover:flex"
                  variant="outline"
                >
                  Edit decision tree
                </Button>
              </div>
            )}
            <div className="">
              <DecisionTreeRenderer decisionTree={itemData as IDecisionTree} />
              <AddDecisionTreeModal
                showDecisionTreeModal={edittingDecisionTree}
                decisionTreeData={itemData as IDecisionTree}
                elementIndex={elementIndex}
                editElement={(e, f) => {
                  updateElementAtPath(e, f);
                  setEdittingDecisionTree(false);
                }}
                onClose={() => setEdittingDecisionTree(false)}
              />
            </div>
          </div>
        );
      } else if (itemData.type === "space") {
        element = (
          <div
            className="w-full hover:bg-[#fafafa]"
            style={{ height: `${itemData.content}` }}
          ></div>
        );
      } else {
        element = <></>;
      }

      return (
        <div className="group relative flex" key={index}>
          {isEditting && (
            <button
              className="group-hover:flex hidden w-8 h-8 bg-white rounded-full  items-center justify-center border border-[#e7e7e7] absolute bottom-0 -left-[10px]"
              onClick={() => {
                removeElement(elementIndex);
              }}
            >
              <Trash className="w-4" />
            </button>
          )}

          {element}

          {isEditting && (
            <div className="group-hover:opacity-100 opacity-0 absolute bottom-0 pl-4 right-[10px]">
              <AddDropdown
                addNewElement={(e, f) => addNewElement(e, f, elementIndex)}
                isList={["unorderedList", "orderedList"].includes(
                  itemData.type
                )}
              />
            </div>
          )}
        </div>
      );
    });
  };

  return <div className="text-[#344054] font-light">{renderItems(items)}</div>;
}

export default PageItems;
