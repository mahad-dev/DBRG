"use client";

import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { userApi, type User, type Permission } from "@/services/userApi";
import { toast } from "react-toastify";
import { ServiceCheckbox } from "@/components/custom/ui/ServiceCheckbox";

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  user: User;
  onSuccess?: () => void;
}

interface AdminUserData {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  role: number;
  permissions: Permission[];
}

interface FormValues {
  name: string;
  phone: string;
  email: string;
  role: number;
  permissionIds: number[];
}

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  phone: Yup.string().required("Phone number is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  role: Yup.number().required("Role is required"),
});

export default function EditUserModal({
  open,
  onClose,
  user,
  onSuccess,
}: EditUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [initialValues, setInitialValues] = useState<FormValues>({
    name: "",
    phone: "",
    email: "",
    role: 1,
    permissionIds: [],
  });

  useEffect(() => {
    if (open && user.userId) {
      fetchUserDetails();
      fetchPermissions();
    }
  }, [open, user.userId]);

  const fetchPermissions = async () => {
    try {
      const permissions = await userApi.getAllPermissions();
      setAllPermissions(permissions);
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
    }
  };

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const response = await userApi.getUserById(user.userId);
      if (response.status && response.data) {
        const userData = response.data as AdminUserData;
        setInitialValues({
          name: userData.fullName || "",
          phone: userData.phoneNumber || "",
          email: userData.email || "",
          role: userData.role ?? 1,
          permissionIds: userData.permissions?.map((p) => p.id) || [],
        });
      }
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      toast.error("Failed to load user details");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: any
  ) => {
    try {
      const response = await userApi.updateUser({
        userId: user.userId,
        name: values.name,
        phone: values.phone,
        email: values.email,
        role: values.role,
        password: "",
        permissionIds: values.permissionIds,
      });

      if (response.status) {
        toast.success("User updated successfully");
        onSuccess?.();
        onClose();
      } else {
        toast.error(response.message || "Failed to update user");
      }
    } catch (error: any) {
      console.error("Update User Error:", error);
      toast.error(
        error?.response?.data?.message || error?.message || "Failed to update user"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setInitialValues({
      name: "",
      phone: "",
      email: "",
      role: 1,
      permissionIds: [],
    });
    onClose();
  };

  // Group permissions by parent
  const groupPermissions = (permissions: Permission[]) => {
    const grouped: { [key: string]: Permission[] } = {};
    const parents: Permission[] = [];

    permissions.forEach((perm) => {
      if (perm.parentId === null) {
        parents.push(perm);
        grouped[perm.key] = [];
      }
    });

    permissions.forEach((perm) => {
      if (perm.parentId !== null) {
        const parent = permissions.find((p) => p.id === perm.parentId);
        if (parent) {
          if (!grouped[parent.key]) {
            grouped[parent.key] = [];
          }
          grouped[parent.key].push(perm);
        }
      }
    });

    return { grouped, parents };
  };

  const { grouped, parents } = groupPermissions(allPermissions);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[700px] max-h-[90vh] overflow-y-auto rounded-[20px] border border-[#C6A95F] bg-black p-8 text-white [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <DialogHeader>
          <DialogTitle className="text-[28px] font-gilory font-semibold text-[#C6A95F]">
            Edit User
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-[#C6A95F] mb-4" />
            <p className="text-white/60">Loading user details...</p>
          </div>
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, values, setFieldValue }) => (
              <Form className="space-y-6">
                {/* Name */}
                <div>
                  <label className="mb-2 block text-sm">Name</label>
                  <Field
                    as={Input}
                    name="name"
                    placeholder="Enter name"
                    className="h-12 rounded-[10px] bg-white text-black"
                  />
                  <ErrorMessage
                    name="name"
                    component="p"
                    className="mt-1 text-xs text-red-400"
                  />
                </div>

                {/* Email + Phone */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm">Email</label>
                    <Field
                      as={Input}
                      name="email"
                      type="email"
                      placeholder="xyz@gmail.com"
                      className="h-12 rounded-[10px] bg-white text-black"
                    />
                    <ErrorMessage
                      name="email"
                      component="p"
                      className="mt-1 text-xs text-red-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm">Phone Number</label>
                    <Field
                      as={Input}
                      name="phone"
                      placeholder="+91-987-654-3210"
                      className="h-12 rounded-[10px] bg-white text-black"
                    />
                    <ErrorMessage
                      name="phone"
                      component="p"
                      className="mt-1 text-xs text-red-400"
                    />
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label className="mb-2 block text-sm">Role</label>
                  <Select
                    value={String(values.role)}
                    onValueChange={(value) => setFieldValue("role", Number(value))}
                  >
                    <SelectTrigger className="h-12 w-full rounded-[10px] bg-white text-black cursor-pointer">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="1" className="cursor-pointer">Member</SelectItem>
                    </SelectContent>
                  </Select>
                  <ErrorMessage
                    name="role"
                    component="p"
                    className="mt-1 text-xs text-red-400"
                  />
                </div>

                {/* Permissions */}
                {allPermissions.length > 0 && (
                  <div>
                    <label className="mb-3 block text-sm font-semibold text-[#C6A95F]">
                      Permissions
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {parents.map((parent) => (
                        <div key={parent.id} className="border border-white/20 rounded-lg p-4 bg-white/5">
                          <div className="mb-3">
                            <ServiceCheckbox
                              label={parent.name}
                              checked={values.permissionIds.includes(parent.id)}
                              onChange={() => {
                                const isChecked = values.permissionIds.includes(parent.id);
                                if (isChecked) {
                                  const childIds = grouped[parent.key]?.map(c => c.id) || [];
                                  setFieldValue(
                                    "permissionIds",
                                    values.permissionIds.filter(
                                      (id) => id !== parent.id && !childIds.includes(id)
                                    )
                                  );
                                } else {
                                  setFieldValue("permissionIds", [...values.permissionIds, parent.id]);
                                }
                              }}
                              id={`parent-${parent.id}`}
                              transparent={true}
                            />
                          </div>

                          {grouped[parent.key] && grouped[parent.key].length > 0 && (
                            <div className="ml-8 space-y-2">
                              {grouped[parent.key].map((perm) => (
                                <ServiceCheckbox
                                  key={perm.id}
                                  label={perm.name}
                                  checked={values.permissionIds.includes(perm.id)}
                                  onChange={() => {
                                    const isSelected = values.permissionIds.includes(perm.id);
                                    if (isSelected) {
                                      setFieldValue(
                                        "permissionIds",
                                        values.permissionIds.filter((id) => id !== perm.id)
                                      );
                                    } else {
                                      const newPermissions = [...values.permissionIds, perm.id];
                                      if (!values.permissionIds.includes(parent.id)) {
                                        newPermissions.push(parent.id);
                                      }
                                      setFieldValue("permissionIds", newPermissions);
                                    }
                                  }}
                                  id={`child-${perm.id}`}
                                  transparent={true}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="flex justify-start pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant={"site_btn"}
                    className="cursor-pointer disabled:cursor-not-allowed h-12 rounded-[10px] px-12"
                  >
                    {isSubmitting ? "Saving Changes..." : "Save Changes"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </DialogContent>
    </Dialog>
  );
}
