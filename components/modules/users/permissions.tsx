'use client'
import React from "react";
import {
  useFetchPermissions
} from "@/hooks/api/queries/users";
import { PermissionsDisplay } from "./permission-display";

const Permissions = () => {
  const { data: permissions } = useFetchPermissions();

  return (
    <PermissionsDisplay
      permissions={permissions?.data?.data}
      mode="list"
      columns={4}
      className="px-4 rounded-2xl"
    />
  );
};

export default Permissions;
