import React, { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Icon,
  Pagination,
  SidebarTrigger,
} from "../ui";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useFetchProfile } from "@/hooks/api/queries/settings";
import {
  MarkNotificationsAsRead,
  useNotifications,
} from "@/hooks/api/queries/notifications/useNotifications";
import dayjs from "dayjs";
import clsx from "clsx";

const Navbar = () => {
  const { data } = useFetchProfile();
  const isMobile = useIsMobile();
  const [currentPage, setCurrentPage] = useState(1);
  const { data: notificationsData, refetch: refetchNotifications } =
    useNotifications(currentPage);

  const router = useRouter();
  const markAsRead = async () => {
    const notifIDs = notificationsData?.data?.data
      .filter((notif) => notif.unread)
      .map((notif) => notif.id);
    if (!notifIDs.length) {
      return;
    }
    try {
      await MarkNotificationsAsRead(notifIDs);
      refetchNotifications();
    } catch (error) {}
  };

  const hasUnreadMessages =
    notificationsData?.data?.data.filter((notif) => notif.unread).length > 0;

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
        <DropdownMenu
          onOpenChange={(e) => {
            if (e) {
              markAsRead();
            }
          }}
        >
          <DropdownMenuTrigger asChild>
            <div className="w-5 h-5 relative" onClick={markAsRead}>
              <Icon name="bell" className="w-5 h-5" />
              {hasUnreadMessages && (
                <div className="w-2 h-2 bg-red-500 rounded-full absolute -top-1 right-0 animate-ping"></div>
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[280px]">
            {notificationsData?.data?.data?.map((notif, i) => (
              <DropdownMenuItem key={i}>
                <div className="border-b border-[#666666] pb-2 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center">
                    <p className="text-[12px] text-[#666666]">
                      {notif.subject}
                    </p>
                  </div>
                  <p
                    className={clsx("mt-2 text-[#666666]", {
                      "font-semibold text-[#000000]": notif.unread,
                    })}
                  >
                    {notif.content}
                  </p>
                  <p className="text-[10px] text-[#666666]">
                    {dayjs(notif.createdAt).format("DD MMM hh:mma")}
                  </p>
                </div>
              </DropdownMenuItem>
            ))}

            {notificationsData && (
              <Pagination
                currentPage={notificationsData.data.currentPage}
                totalPages={notificationsData?.data?.totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  markAsRead();
                }}
                className="!w-full !p-1"
              />
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <div
          className="flex flex-row items-center gap-3 justify-start cursor-pointer"
          onClick={() => {
            router.push("/dashboard/profile");
          }}
        >
          <Avatar className="w-6 h-6 rounded-full">
            {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
            <AvatarFallback>
              {data?.data?.firstName
                ? `${
                    data?.data?.firstName[0].toUpperCase() +
                    data?.data?.lastName[0].toUpperCase()
                  }`
                : "L"}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-sm text-primary hidden md:block">
            {data?.data?.firstName} {data?.data?.lastName}
          </span>
        </div>

        {isMobile && <SidebarTrigger className="" />}
      </div>
    </div>
  );
};

export default Navbar;
