"use client"

import React, { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Plus, Edit, Trash2, UserCog } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  useDashboard,
} from "@/src/contexts/DashboardContext"
import {
    RoleDto,
    RoleType,
    useGetRolesQuery,
    useCreateRoleMutation,
    useRemoveRoleMutation,
    useEditRoleMutation,
    PermissionsFlagsInput, SortEnumType,
} from "@/graphql/__generated__/graphql"
import { useAuth0 } from "@auth0/auth0-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// --- Zod Schemas ---
const createRoleSchema = z.object({
  streamerUserName: z.string().min(1, "Streamer username is required"),
  roleType: z.nativeEnum(RoleType, {
    errorMap: () => ({ message: "Please select a role type" }),
  }),
  isChat: z.boolean().optional(),
  isStream: z.boolean().optional(),
  isRoles: z.boolean().optional(),
  isAll: z.boolean().optional(),
});

const editRoleSchema = z.object({
  roleId: z.string().uuid("Invalid role ID"),
  isChat: z.boolean().optional(),
  isStream: z.boolean().optional(),
  isRoles: z.boolean().optional(),
  isAll: z.boolean().optional(),
});

type CreateRoleFormValues = z.infer<typeof createRoleSchema>;
type EditRoleFormValues = z.infer<typeof editRoleSchema>;

// --- Helper to format permissions ---
const formatPermissions = (permissions: PermissionsFlagsInput) => {
  if (permissions.isAll) return "All";
  const activePermissions = [];
  if (permissions.isChat) activePermissions.push("Chat");
  if (permissions.isStream) activePermissions.push("Stream");
  if (permissions.isRoles) activePermissions.push("Roles");
  if (activePermissions.length === 0) return "None";
  return activePermissions.join(", ");
};

// --- Create Role Dialog Component ---
interface CreateRoleDialogProps {
  broadcasterId: string;
  refetchRoles: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateRoleDialog: React.FC<CreateRoleDialogProps> = ({
  broadcasterId,
  refetchRoles,
  isOpen,
  onOpenChange,
}) => {
  const [createRoleMutation, { loading: createLoading }] = useCreateRoleMutation();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateRoleFormValues>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      streamerUserName: "",
      roleType: RoleType.Administrator, // Default to Administrator
      isChat: false,
      isStream: false,
      isRoles: false,
      isAll: false,
    },
  });

  const isAllChecked = watch("isAll");

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = async (values: CreateRoleFormValues) => {
    try {
      const permissions: PermissionsFlagsInput = {
        isAll: values.isAll,
        isChat: values.isChat,
        isStream: values.isStream,
        isRoles: values.isRoles,
        isNone: !values.isAll && !values.isChat && !values.isStream && !values.isRoles,
      };

      await createRoleMutation({
        variables: {
          input: {
            broadcasterId,
            streamerId: values.streamerUserName, // Assuming streamerUserName is the streamerId
            roleType: values.roleType,
            permissions,
          },
        },
      });
      refetchRoles();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating role:", error);
      // TODO: Add toast notification for error
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Role</DialogTitle>
          <DialogDescription className="text-gray-400">
            Assign a new role to a streamer for this channel.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="streamerUserName" className="text-right text-white">
              Streamer Username
            </Label>
            <Input
              id="streamerUserName"
              {...register("streamerUserName")}
              className="col-span-3 bg-gray-700 border-gray-600 text-white focus:border-green-500"
            />
            {errors.streamerUserName && (
              <p className="col-span-4 text-red-500 text-sm text-right">
                {errors.streamerUserName.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="roleType" className="text-right text-white">
              Role Type
            </Label>
            <Select
              onValueChange={(value: RoleType) => setValue("roleType", value)}
              defaultValue={watch("roleType")}
            >
              <SelectTrigger className="col-span-3 bg-gray-700 border-gray-600 text-white focus:border-green-500">
                <SelectValue placeholder="Select a role type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                {Object.values(RoleType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.roleType && (
              <p className="col-span-4 text-red-500 text-sm text-right">
                {errors.roleType.message}
              </p>
            )}
          </div>

          <div className="space-y-2 mt-4">
            <Label className="text-white">Permissions</Label>
            <div className="flex items-center justify-between">
              <Label htmlFor="isAll" className="text-gray-300">All Permissions</Label>
              <Switch
                id="isAll"
                checked={isAllChecked}
                onCheckedChange={(checked) => {
                  setValue("isAll", checked);
                  setValue("isChat", checked);
                  setValue("isStream", checked);
                  setValue("isRoles", checked);
                }}
                className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-600"
              />
            </div>
            {!isAllChecked && (
              <>
                <div className="flex items-center justify-between">
                  <Label htmlFor="isChat" className="text-gray-300">Chat Management</Label>
                  <Switch
                    id="isChat"
                    checked={watch("isChat")}
                    onCheckedChange={(checked) => setValue("isChat", checked)}
                    className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-600"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="isStream" className="text-gray-300">Stream Management</Label>
                  <Switch
                    id="isStream"
                    checked={watch("isStream")}
                    onCheckedChange={(checked) => setValue("isStream", checked)}
                    className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-600"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="isRoles" className="text-gray-300">Role Management</Label>
                  <Switch
                    id="isRoles"
                    checked={watch("isRoles")}
                    onCheckedChange={(checked) => setValue("isRoles", checked)}
                    className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-600"
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={createLoading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {createLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Create Role"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// --- Edit Role Dialog Component ---
interface EditRoleDialogProps {
  role: RoleDto;
  refetchRoles: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditRoleDialog: React.FC<EditRoleDialogProps> = ({
  role,
  refetchRoles,
  isOpen,
  onOpenChange,
}) => {
  const [editRoleMutation, { loading: editLoading }] = useEditRoleMutation();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EditRoleFormValues>({
    resolver: zodResolver(editRoleSchema),
    defaultValues: {
      roleId: role.id,
      isChat: role.permissions.isChat,
      isStream: role.permissions.isStream,
      isRoles: role.permissions.isRoles,
      isAll: role.permissions.isAll,
    },
  });

  const isAllChecked = watch("isAll");

  useEffect(() => {
    if (isOpen) {
      reset({
        roleId: role.id,
        isChat: role.permissions.isChat,
        isStream: role.permissions.isStream,
        isRoles: role.permissions.isRoles,
        isAll: role.permissions.isAll,
      });
    }
  }, [isOpen, reset, role]);

  const onSubmit = async (values: EditRoleFormValues) => {
    try {
      const permissions: PermissionsFlagsInput = {
        isAll: values.isAll,
        isChat: values.isChat,
        isStream: values.isStream,
        isRoles: values.isRoles,
        isNone: !values.isAll && !values.isChat && !values.isStream && !values.isRoles,
      };

      await editRoleMutation({
        variables: {
          input: {
            roleId: values.roleId,
            permissions,
          },
        },
      });
      refetchRoles();
      onOpenChange(false);
    } catch (error) {
      console.error("Error editing role:", error);
      // TODO: Add toast notification for error
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Role for {role.streamer?.userName}</DialogTitle>
          <DialogDescription className="text-gray-400">
            Update permissions for this role.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label className="text-white">Permissions</Label>
            <div className="flex items-center justify-between">
              <Label htmlFor="editIsAll" className="text-gray-300">All Permissions</Label>
              <Switch
                id="editIsAll"
                checked={isAllChecked}
                onCheckedChange={(checked) => {
                  setValue("isAll", checked);
                  setValue("isChat", checked);
                  setValue("isStream", checked);
                  setValue("isRoles", checked);
                }}
                className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-600"
              />
            </div>
            {!isAllChecked && (
              <>
                <div className="flex items-center justify-between">
                  <Label htmlFor="editIsChat" className="text-gray-300">Chat Management</Label>
                  <Switch
                    id="editIsChat"
                    checked={watch("isChat")}
                    onCheckedChange={(checked) => setValue("isChat", checked)}
                    className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-600"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="editIsStream" className="text-gray-300">Stream Management</Label>
                  <Switch
                    id="editIsStream"
                    checked={watch("isStream")}
                    onCheckedChange={(checked) => setValue("isStream", checked)}
                    className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-600"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="editIsRoles" className="text-gray-300">Role Management</Label>
                  <Switch
                    id="editIsRoles"
                    checked={watch("isRoles")}
                    onCheckedChange={(checked) => setValue("isRoles", checked)}
                    className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-600"
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={editLoading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {editLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// --- Main Roles Page Component ---
export default function RolesPage() {
  const { isAuthenticated } = useAuth0();
  const { activeStreamer, activeStreamerPermissions } = useDashboard();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editRole, setEditRole] = useState<RoleDto | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const {
    data: rolesData,
    loading: rolesLoading,
    error: rolesError,
    refetch: refetchRoles,
  } = useGetRolesQuery({
    variables: {
      broadcasterId: activeStreamer?.id ?? "",
      roleType: RoleType.Administrator,
      order: [{ id: SortEnumType.Asc }],
    },
    skip: !isAuthenticated || !activeStreamer?.id,
  });

  const [removeRoleMutation, { loading: removeLoading }] = useRemoveRoleMutation();

  const handleRemoveRole = async (roleId: string) => {
    try {
      await removeRoleMutation({
        variables: {
          input: {
            roleId,
          },
        },
      });
      refetchRoles();
    } catch (error) {
      console.error("Error removing role:", error);
      // TODO: Add toast notification for error
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-gray-400">
        Please log in to manage roles.
      </div>
    );
  }

  if (!activeStreamer) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-gray-400">
        Select a channel to manage roles.
      </div>
    );
  }

  if (rolesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
      </div>
    );
  }

  if (rolesError) {
    return (
      <div className="text-red-500">Error loading roles: {rolesError.message}</div>
    );
  }

  const roles = rolesData?.roles?.nodes || [];
  const canManageRoles = activeStreamerPermissions?.isAll || activeStreamerPermissions?.isRoles;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white">Roles Management</h2>
        {canManageRoles && (
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" /> Create New Role
          </Button>
        )}
      </div>

      <CreateRoleDialog
        broadcasterId={activeStreamer.id}
        refetchRoles={refetchRoles}
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />

      {editRole && (
        <EditRoleDialog
          role={editRole}
          refetchRoles={refetchRoles}
          isOpen={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) setEditRole(null);
          }}
        />
      )}

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Current Roles</CardTitle>
        </CardHeader>
        <CardContent>
          {roles.length === 0 ? (
            <p className="text-gray-400">No roles found for this channel.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Streamer</TableHead>
                  <TableHead className="text-gray-300">Role Type</TableHead>
                  <TableHead className="text-gray-300">Permissions</TableHead>
                  {canManageRoles && <TableHead className="text-right text-gray-300">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id} className="border-gray-700 hover:bg-gray-700">
                    <TableCell className="font-medium text-white">
                      {role.streamer?.userName || "N/A"}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {role.type.charAt(0).toUpperCase() + role.type.slice(1).toLowerCase()}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {formatPermissions(role.permissions)}
                    </TableCell>
                    {canManageRoles && (
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-green-500"
                            onClick={() => {
                              setEditRole(role);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-400 hover:text-red-500"
                                disabled={removeLoading}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-white">
                                  Are you sure you want to remove this role?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-400">
                                  This action cannot be undone. The role for{" "}
                                  <span className="font-semibold text-white">
                                    {role.streamer?.userName}
                                  </span>{" "}
                                  will be permanently removed.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleRemoveRole(role.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                  disabled={removeLoading}
                                >
                                  {removeLoading ? "Removing..." : "Remove"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}