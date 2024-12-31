import { Book, PageItemType } from "../booktypes";
import React from "react";
import { Button } from "../../../../components/ui/button";
import { useBookContext } from "../context/bookContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import { Plus } from "lucide-react";
import { groupClass } from "../[id]/page";

function BookHeader({
  setBookTitle,
  book,
  addNewPageElement,
}: {
  setBookTitle: (e: string) => void;
  book: Book;
  addNewPageElement: (e, f) => void;
}) {
  const { isEditting, setIsEditting } = useBookContext();

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1
          className={`text-3xl font-bold mb-0 book-title text-[#0CA554] ${groupClass}`}
          contentEditable={true}
          suppressContentEditableWarning={true}
          onBlur={(e) => setBookTitle(e.target.textContent)}
        >
          {book?.bookTitle}
        </h1>
        <div className="flex">
          <Button
            variant={isEditting ? "outline" : "default"}
            onClick={() => setIsEditting(!isEditting)}
            className="h-8 text-[14px]"
          >
            {isEditting ? "Stop editting" : "Start Edit"}
          </Button>

          {isEditting && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  variant="outline"
                  className="mx-2 w-6 h-6 p-0 bg-[#0CA554] text-white"
                >
                  <Plus />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {[PageItemType.Chapter].map((item, i) => (
                  <DropdownMenuItem
                    key={i}
                    onClick={() => {
                      addNewPageElement(item as PageItemType, []);
                    }}
                  >
                    <div
                      className={`border-[#e7e7e76d] cursor-pointer capitalize p-2`}
                    >
                      {item}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookHeader;
