import React from "react";
import { Icon } from "@/components/ui";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: React.ReactNode;
  className?: string;
  containerClass?: string;
}
const AuthLayout = ({
  children,
  className,
  containerClass
}: AuthLayoutProps) => {
  return (
    <div
      className={cn(
        "bg-[#F8FAFC] w-full overflow-y-scroll h-screen relative px-4 md:px-7 py-4",
        containerClass && containerClass
      )}>
      <div>
        <Image
          src="/svgs/logo.svg"
          alt="logo"
          height={40}
          width={110}
          className="absolute top-0 left-0 mt-4 ml-4 md:ml-20 md:mt-16"
        />
      </div>

      <div
        className={cn(
          "mx-auto h-[80vh] md:py-15 md:px-12 bg-[#FCFCFD] rounded-[20px]  md:max-w-[700px] flex flex-col items-center justify-center mt-16 md:mt-24 relative z-10 overflow-y-screen",
          className
        )}>
        <div className=" h-fit w-full px-4 md:px-8 py-8 md:py-16 bg-white-400 bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-10 border border-white rounded-[40px] flex flex-col items-center justify-center z-40">
          <div className="mb-6 w-44 h-44">
            <Icon name="logo-image" className="w-44 h-44" />
          </div>
          {children}
        </div>

        <Image
          src="/svgs/ellipse.svg"
          alt="ellipse"
          height={100}
          width="120"
          className="absolute bottom-0 left-0 w-full"
        />
      </div>
      <p className="text-[#637381] text-sm font-normal text-end">
        © 2024 chpbrn. All Right Reserved
      </p>
    </div>
  );
};

export { AuthLayout };
