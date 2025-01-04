// src/types/permissions.ts
export enum Permissions {
  // Users
  CREATE_USERS = "create_users",
  READ_USERS_ID = "read_users:id",
  UPDATE_USERS_ID = "update_users:id",
  DELETE_USERS_ID = "delete_users:id",
  READ_USERS_PERMISSIONS = "read_users:id/permissions",
  CREATE_USERS_ENABLE_2FA = "create_users:enable-2fa",
  CREATE_USERS_DISABLE_2FA = "create_users:disable-2fa",
  READ_USERS_ME = "read_users:me",
  UPDATE_USERS_ME = "update_users:me/update",
  UPDATE_USERS_2FA_AUTH = "update_users:userId/2fa-auth",
  UPDATE_USERS_PASSWORD = "update_users:password-change",

  // App Settings
  READ_APP_SETTINGS = "read_app-settings",
  READ_APP_SETTINGS_KEY = "read_app-settings:key",
  CREATE_APP_SETTINGS_WALLETS = "create_app-settings:default-wallets",
  READ_APP_SETTINGS_WALLETS = "read_app-settings:default-wallets",
  CREATE_APP_SETTINGS_WITHDRAWAL = "create_app-settings:maximum-withdrawal-limit",
  READ_APP_SETTINGS_WITHDRAWAL = "read_app-settings:maximum-withdrawal-limit",
  CREATE_APP_SETTINGS_MAINTENANCE = "create_app-settings:maintenance-mode",
  READ_APP_SETTINGS_MAINTENANCE = "read_app-settings:maintenance-mode",
  CREATE_APP_SETTINGS_SUPPORT = "create_app-settings:support-email",
  READ_APP_SETTINGS_SUPPORT = "read_app-settings:support-email",
  CREATE_APP_SETTINGS_FEES = "create_app-settings:fee-structure",
  READ_APP_SETTINGS_FEES = "read_app-settings:fee-structure",

  // Permissions
  READ_PERMISSIONS = "read_permissions",

  // Payments
  CREATE_PAYMENTS_INITIATE = "create_payments:provider/initiate",
  READ_PAYMENTS_VERIFY = "read_payments:provider/verify/transaction_id",
  CREATE_PAYMENTS_WEBHOOK = "create_payments:provider/webhook",

  // Notifications
  CREATE_NOTIFICATIONS = "create_notifications",
  READ_NOTIFICATIONS_USER = "read_notifications:user",
  UPDATE_NOTIFICATIONS_READ = "update_notifications:read",

  // Audit Logs
  CREATE_AUDIT_LOGS = "create_audit-logs",

  // Admin Users
  CREATE_ADMIN_USERS = "create_admin/users",
  UPDATE_ADMIN_USERS = "update_admin/users:userId",
  UPDATE_ADMIN_USERS_RESET_PASSWORD = "update_admin/users:userId/reset-password",
  UPDATE_ADMIN_USERS_DEACTIVATE = "update_admin/users:userId/deactivate",
  READ_ADMIN_USERS_APP = "read_admin/users:app",
  READ_ADMIN_USERS_SYSTEM = "read_admin/users:system",

  // Admin Roles
  READ_ADMIN_ROLES_PERMISSIONS = "read_admin/roles:permissions",
  READ_ADMIN_ROLES = "read_admin/roles",
  READ_ADMIN_ROLES_ID = "read_admin/roles:roleId",
  CREATE_ADMIN_ROLES = "create_admin/roles",
  UPDATE_ADMIN_ROLES = "update_admin/roles:roleId",
  DELETE_ADMIN_ROLES = "delete_admin/roles:roleId",

  // Admin Ebooks
  CREATE_ADMIN_EBOOKS = "create_admin/ebooks",
  UPDATE_ADMIN_EBOOKS = "update_admin/ebooks:ebookId",
  READ_ADMIN_EBOOKS = "read_admin/ebooks",
  UPDATE_ADMIN_EBOOKS_APPROVE = "update_admin/ebooks:approve/versionId",
  READ_ADMIN_EBOOKS_VERSIONS = "read_admin/ebooks:ebookId/versions",
  READ_ADMIN_EBOOKS_HISTORY = "read_admin/ebooks:ebookId/versions/history",
  DELETE_ADMIN_EBOOKS = "delete_admin/ebooks:ebookId",

  // Uploads
  CREATE_UPLOADS = "create_uploads",
  READ_UPLOADS = "read_uploads:fileKey",
  DELETE_UPLOADS = "delete_uploads:fileKey",

  // Facilities
  CREATE_ADMIN_FACILITIES = "create_admin/facilities",
  UPDATE_ADMIN_FACILITIES = "update_admin/facilities:facilityId",
  READ_ADMIN_FACILITIES = "read_admin/facilities",
  READ_ADMIN_FACILITIES_ID = "read_admin/facilities:facilityId",
  DELETE_ADMIN_FACILITIES = "delete_admin/facilities:facilityId",
  READ_FACILITIES = "read_facilities",
  READ_FACILITIES_ID = "read_facilities:facilityId"
}

// Type to use in function parameters and hooks
export type PermissionType = `${Permissions}`;

// Helper type for arrays of permissions
export type PermissionArray = PermissionType[];

// Updated Permission interface
export interface Permission {
  id: number;
  permissionString: PermissionType;
}
