import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../components/ui/popover";
import { Button } from "../../../../components/ui/button";
import { Trash } from "lucide-react";

const DeletePageItemPopover = ({
  children,
  heading,
  hidden = false,
}: {
  children: React.ReactNode;
  heading: string;
  hidden?: boolean;
}) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button
          className={`${
            hidden ? "group-hover:block hidden" : ""
          } p-0 w-6 h-6 bg-red-500`}
        >
          <Trash className="w-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <p className="mb-2">{heading}</p>
        <div className="flex justify-end">{children}</div>
      </PopoverContent>
    </Popover>
  );
};

export default DeletePageItemPopover;
