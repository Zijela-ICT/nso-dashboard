import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Icon,
  SidebarTrigger
} from "../ui";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const isMobile = useIsMobile();

  const router = useRouter();
  return (
    <div className="w-full flex flex-row justify-between md:justify-end px-4 md:px-10 py-4 bg-white border-b border-b-[#EAEDFF]">
      {isMobile && (
        <img
          src="/svgs/logo.svg"
          width={130}
          height={30}
          className="cursor-pointer"
          alt="logo"
        />
      )}
      
      <div className="flex flex-row items-center gap-2 md:gap-5">
        <div className="w-5 h-5">
          <Icon name="bell" className="w-5 h-5" />
        </div>

        <div className="flex flex-row items-center gap-3 justify-start">
          <Avatar className="w-6 h-6 rounded-full">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className="font-medium text-sm text-primary hidden md:block">
            Danny Johnson
          </span>
        </div>

        {isMobile && <SidebarTrigger className="" />}
      </div>
    </div>
  );
};

export default Navbar;
