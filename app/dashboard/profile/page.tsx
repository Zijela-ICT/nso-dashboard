"use client";
import { PasswordChangeModal } from "@/components/modals/profile";
import { Avatar, AvatarFallback, Icon, Switch } from "@/components/ui";
import { useChangePassword } from "@/hooks/api/mutations/auth";
import { useUpdate2Fa } from "@/hooks/api/mutations/profile";
import { useFetchProfile } from "@/hooks/api/queries/settings";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

const SettingsSection = ({ title, children }: SettingsSectionProps) => (
  <div className="mt-4">
    <h2 className="text-lg font-semibold text-[#212B36] mb-2">{title}</h2>
    <div className="bg-white border p-4 space-y-4 border-[#919EAB33] rounded-[12px]">
      {children}
    </div>
  </div>
);

interface SettingsRowProps {
  label: string;
  children: React.ReactNode;
}

const SettingsRow = ({ label, children }: SettingsRowProps) => (
  <div className="flex items-center justify-between">
    <span className="text-gray-600 text-base">{label}</span>
    {children}
  </div>
);

interface SettingsToggleProps {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const SettingsToggle = ({
  label,
  checked,
  onCheckedChange
}: SettingsToggleProps) => (
  <SettingsRow label={label}>
    <Switch checked={checked} onCheckedChange={onCheckedChange} />
  </SettingsRow>
);
const Page = () => {
  const updateTwoFa = useUpdate2Fa();
  const changePassword = useChangePassword();
  const [soundNotifications, setSoundNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [biometricLogin, setBiometricLogin] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const { data } = useFetchProfile();
    const router = useRouter();
  

  const profile = data?.data;

  const handleTwoFactorToggle = (value: boolean) => {
    if (value) {
      updateTwoFa.mutate(
        { type: "enabled" },
        {
          onSuccess: () => {
            setTwoFactorAuth(true);
          }
        }
      );
    } else {
      updateTwoFa.mutate(
        { type: "disabled" },
        {
          onSuccess: () => {
            setTwoFactorAuth(false);
          }
        }
      );
    }
  };

  const handlePasswordChange = async (
    oldPassword: string,
    newPassword: string
  ) => {
    await changePassword.mutateAsync({ oldPassword, newPassword });
  };

  const handleLogout = () => {
    localStorage.removeItem("chprbn");
    window.location.href = "/login";
  };

  useEffect(() => {
    setTwoFactorAuth(profile?.isTwoFAEnabled);
  }, [twoFactorAuth, data]);

  return (
    <div className="mt-10">
      <div className="flex flex-row items-center cursor-pointer" onClick={() => router.back()}>
        <Icon name="arrow-left" />
        <span className="text-[#0CA554] text-base font-normal">Back</span>
      </div>
      <h3 className="text-[#303030] text-xl font-semibold my-4">My account</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
        <div className=" bg-white col-span-1 flex flex-col items-center justify-center rounded-[12px] py-5 px-4 md:py-10 md:px-8 shadow-md">
          <div className="flex flex-col items-center justify-start ">
            <div className="relative">
              <Avatar className="w-40 h-40 rounded-full">
                {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                <AvatarFallback className="text-xl md:text-5xl font-bold">
                  {profile?.firstName[0].toUpperCase() +
                    profile?.lastName[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Icon
                name="camera"
                className="absolute bottom-0 right-0 cursor-pointer"
              />
            </div>
            <span className="font-semibold text-2xl text-[#303030] hidden md:block mt-5">
              {profile?.firstName} {profile?.lastName}
            </span>
            <p className="mt-3 text-[#606060] text-base">{profile?.email}</p>
            <p className="mt-3 text-[#606060] text-base">{profile?.mobile}</p>
          </div>
        </div>
        <div className=" bg-white col-span-1 md:col-span-2 py-5 px-4 md:py-10 md:px-8 rounded-[12px] shadow-md">
          <SettingsSection title="Details and Password">
            <PasswordChangeModal onPasswordChange={handlePasswordChange} />
          </SettingsSection>

          <SettingsSection title="Settings">
            <SettingsToggle
              label="Sound Notification"
              checked={soundNotifications}
              onCheckedChange={setSoundNotifications}
            />
            <div className="border-t border-gray-200" />
            <SettingsToggle
              label="Push Notification"
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
            <div className="border-t border-gray-200" />
            <SettingsToggle
              label="Login with Biometric"
              checked={biometricLogin}
              onCheckedChange={setBiometricLogin}
            />
            <div className="border-t border-gray-200" />
            <SettingsToggle
              label="2FA"
              checked={twoFactorAuth}
              onCheckedChange={handleTwoFactorToggle}
            />
          </SettingsSection>

          <SettingsSection title="">
            <div className="flex items-center justify-between cursor-pointer" onClick={handleLogout}>
              <span className="text-[#FF3B30]">Sign Out</span>
              <Icon name="arrow-left" className="rotate-180 text-[#FF3B30]" fill='#FF3B30' stroke="#FF3B30"/>
            </div>
          </SettingsSection>
        </div>
      </div>
    </div>
  );
};

export default Page;
