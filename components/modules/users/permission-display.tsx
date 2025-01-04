'use client'
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Icon } from "@/components/ui";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface PermissionsDataResponse {
  id: number;
  permissionString: string;
}

interface PermissionWithMetadata extends PermissionsDataResponse {
  action: string;
  resource: string;
  params: string | null;
}

interface GroupedPermissions {
  [key: string]: PermissionWithMetadata[];
}

interface ExpandedSections {
  [key: string]: boolean;
}

interface PermissionsDisplayProps {
  permissions: PermissionsDataResponse[];
  mode?: "list" | "select";
  selectedPermissions?: number[];
  onSelectionChange?: (selectedIds: number[]) => void;
  className?: string;
  columns?: number;
}

// Memoized permission item component
const PermissionItem = React.memo(({ 
  permission, 
  isSelected,
  onToggle,
  mode 
}: { 
  permission: PermissionWithMetadata;
  isSelected: boolean;
  onToggle: (id: number) => void;
  mode: "list" | "select";
}) => {
  const handleClick = useCallback(() => {
    onToggle(permission.id);
  }, [onToggle, permission.id]);

  if (mode === "select") {
    return (
      <div
        className="flex items-center gap-2 ml-4 py-2 text-sm text-gray-600"
        onClick={handleClick}
      >
        <Checkbox
          checked={isSelected}
          onCheckedChange={handleClick}
        />
        <label className="cursor-pointer">
          {permission.permissionString}
        </label>
      </div>
    );
  }

  return (
    <div className="ml-4 py-2 text-sm text-gray-600">
      {permission.permissionString}
    </div>
  );
});

PermissionItem.displayName = 'PermissionItem';

// Memoized resource section component
const ResourceSection = React.memo(({
  resourceName,
  permissions,
  mode,
  isExpanded,
  selectedMap,
  columns,
  onToggleSection,
  onTogglePermission,
  onToggleResource
}: {
  resourceName: string;
  permissions: PermissionWithMetadata[];
  mode: "list" | "select";
  isExpanded: boolean;
  selectedMap: Record<number, boolean>;
  columns: number;
  onToggleSection: (section: string) => void;
  onTogglePermission: (id: number) => void;
  onToggleResource: (permissions: PermissionWithMetadata[]) => void;
}) => {
  const isAllSelected = useMemo(() => 
    permissions.every((p) => selectedMap[p.id]),
    [permissions, selectedMap]
  );

  const handleResourceToggle = useCallback(() => {
    onToggleResource(permissions);
  }, [onToggleResource, permissions]);

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <button
        type="button"
        className="w-full py-5 px-4 flex items-center justify-between hover:bg-gray-50"
        onClick={() => onToggleSection(resourceName)}
      >
        <div className="flex items-center gap-3">
          {mode === "select" && (
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={handleResourceToggle}
            />
          )}
          <h3 className="text-base font-normal capitalize">
            {resourceName.replace(/-/g, " ")}
          </h3>
        </div>
        <Icon
          name="chevron-down"
          className={`w-6 h-6 transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
        />
      </button>
      {isExpanded && (
        <div
          className={cn(
            "border-t border-gray-300 py-2",
            `grid grid-cols-3`
          )}
        >
          {permissions.map((permission) => (
            <PermissionItem
              key={permission.id}
              permission={permission}
              isSelected={!!selectedMap[permission.id]}
              onToggle={onTogglePermission}
              mode={mode}
            />
          ))}
        </div>
      )}
    </div>
  );
});

ResourceSection.displayName = 'ResourceSection';

export const PermissionsDisplay = ({
  permissions,
  mode = "list",
  selectedPermissions = [],
  onSelectionChange,
  className,
  columns = 1,
}: PermissionsDisplayProps) => {
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({});
  const [selectedMap, setSelectedMap] = useState<Record<number, boolean>>(() => {
    // Create a map of all permissions initialized to false
    const initialMap = Object.fromEntries(
      permissions?.map(p => [p.id, false])
    );
    // Set selected permissions to true
    selectedPermissions.forEach(id => {
      initialMap[id] = true;
    });
    return initialMap;
  });

  // Memoize grouped permissions
  const groupedPermissions = useMemo(() => {
    if (!permissions) return {};

    return permissions.reduce((groups: GroupedPermissions, permission) => {
      const [action, resource] = permission.permissionString.split("_");
      const resourceName = resource.split(":")[0];

      if (!groups[resourceName]) {
        groups[resourceName] = [];
      }

      groups[resourceName].push({
        ...permission,
        action,
        resource: resourceName,
        params: resource.includes(":") ? resource.split(":")[1] : null,
      });

      return groups;
    }, {});
  }, [permissions]);

  // Update selected permissions when prop changes
  useEffect(() => {
    const newMap = Object.fromEntries(
      permissions.map(p => [p.id, false])
    );
    selectedPermissions.forEach(id => {
      newMap[id] = true;
    });
    setSelectedMap(newMap);
  }, [selectedPermissions, permissions]);
  

  const toggleSection = useCallback((section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  const togglePermission = useCallback((permissionId: number) => {
    setSelectedMap(prev => {
      const newSelected = { ...prev };
      // Explicitly set to true if not selected, false if selected
      newSelected[permissionId] = !newSelected[permissionId];
      
      // Get all selected IDs
      const selectedIds = Object.entries(newSelected)
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => Number(id));
      
      onSelectionChange?.(selectedIds);
      return newSelected;
    });
  }, [onSelectionChange]);
  
  const toggleResourcePermissions = useCallback((resourcePermissions: PermissionWithMetadata[]) => {
    setSelectedMap(prev => {
      const newSelected = { ...prev };
      const allSelected = resourcePermissions.every(p => newSelected[p.id]);
      
      // Set all permissions in the resource to the opposite of allSelected
      resourcePermissions.forEach(permission => {
        newSelected[permission.id] = !allSelected;
      });
      
      const selectedIds = Object.entries(newSelected)
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => Number(id));
      
      onSelectionChange?.(selectedIds);
      return newSelected;
    });
  }, [onSelectionChange]);

  return (
    <div className={cn("bg-white py-4", className)}>
      <div className="flex flex-col gap-3">
        {Object.entries(groupedPermissions).map(([resourceName, permissions]) => (
          <ResourceSection
            key={resourceName}
            resourceName={resourceName}
            permissions={permissions}
            mode={mode}
            isExpanded={!!expandedSections[resourceName]}
            selectedMap={selectedMap}
            columns={columns}
            onToggleSection={toggleSection}
            onTogglePermission={togglePermission}
            onToggleResource={toggleResourcePermissions}
          />
        ))}
      </div>
    </div>
  );
};