"use client";

import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { userApi } from "@/services/userApi";
import type { User } from "@/services/userApi";
import { ServiceCheckbox } from "@/components/custom/ui/ServiceCheckbox";
import { toast } from "react-toastify";
import { Eye, EyeOff, RefreshCw } from "lucide-react";

interface Permission {
  id: number;
  name: string;
  key: string;
  parentId: number | null;
  parent: Permission | null;
}

interface PermissionGroup {
  parent: Permission;
  children: Permission[];
}

// Generate random password
const generatePassword = (length: number = 12): string => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*';
  const allChars = uppercase + lowercase + numbers + special;

  let password = '';
  // Ensure at least one of each type
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

const AddMember = () => {
  const [permissions, setPermissions] = useState<PermissionGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [isAddExisting, setIsAddExisting] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [formikKey, setFormikKey] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [initialValues, setInitialValues] = useState({
    name: '',
    phone: '',
    email: '',
    role: 'member',
    password: '',
    selectedPermissions: [] as number[],
    permissionLevels: {} as Record<number, string>,
  });

  const handleSubmit = async (values: typeof initialValues) => {
    const userId = isAddExisting ? selectedUserId : '';
    const updateData: any = {
      userId,
      name: values.name,
      phone: values.phone,
      email: values.email,
      role: values.role === 'member' ? 1 : 2,
      permissionIds: values.selectedPermissions,
    };

    // Only include name and password if creating a new user
    if (!userId) {
      updateData.name = values.name;
      updateData.password = values.password;
    }
    setLoading(true);
    try {
      const response = await userApi.updateUser(updateData);
      // Check response status for proper toast
      if (response.status) {
        toast.success(response.message || 'User updated successfully');
      } else {
        toast.error(response.message || 'Failed to update user');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to update user, please try again');
      console.error('Failed to update user:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const allPermissions = await userApi.getAllPermissions();
        const grouped = allPermissions
          .filter(p => p.parentId === null)
          .map(parent => ({
            parent,
            children: allPermissions.filter(p => p.parentId === parent.id)
          }));
        setPermissions(grouped);
      } catch (error: any) {
        console.error('Failed to fetch permissions:', error);
        toast.error(error?.message || 'Failed to fetch permissions');
      }
    };

    const fetchUsers = async () => {
      try {
        setUsersLoading(true);
        const response = await userApi.getUsersWithoutFilter();
        setUsers(response.data);
      } catch (error: any) {
        console.error('Failed to fetch users:', error);
        toast.error(error?.message || 'Failed to fetch users');
      } finally {
        setUsersLoading(false);
      }
    };

    fetchPermissions();
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (selectedUserId && isAddExisting) {
        try {
          const response = await userApi.getUserById(selectedUserId);
          const userData = response.data;

          // Extract permission IDs from permissions array
          const permissionIds = userData.permissions ? userData.permissions.map((p: Permission) => p.id) : [];

          // Update form values with fetched user data
          setInitialValues({
            name: userData.fullName || '',
            phone: userData.phoneNumber || '',
            email: userData.email || '',
            role: userData.role === 1 ? 'member' : 'admin',
            password: '',
            selectedPermissions: permissionIds,
            permissionLevels: {},
          });

          // Increment key to force Formik to reinitialize with new values
          setFormikKey(prev => prev + 1);
        } catch (error: any) {
          console.error('Failed to fetch user data:', error);
          toast.error(error?.message || 'Failed to load user data');
        }
      }
    };

    fetchUserData();
  }, [selectedUserId, isAddExisting]);

  return (
    <Formik key={formikKey} initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
      {({ values, handleChange, setFieldValue }) => (
        <Form>
          <div className="mt-5 font-inter overflow-visible px-4 sm:px-0">
            <Card className="w-full max-w-[680px] bg-[#3e3e3e] border-none overflow-visible">
              {/* Header */}
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-2xl sm:text-3xl font-semibold text-[#C6A95F]">
                  Add / Manage Member
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-5 overflow-visible p-4 sm:p-6 pt-0 sm:pt-0">
                {/* User Selection */}
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                    <Label className="text-white">
                      {isAddExisting ? 'Select Existing User' : 'Add New User'}
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddExisting(!isAddExisting)}
                      className="cursor-pointer text-white border-white hover:bg-white hover:text-black w-full sm:w-auto text-sm"
                    >
                      {isAddExisting ? 'Add Member' : 'Add an existing user'}
                    </Button>
                  </div>

                  {isAddExisting ? (
                    <Select
                      value={selectedUserId}
                      onValueChange={(value) => setSelectedUserId(value)}
                    >
                      <SelectTrigger className="bg-white text-black w-full cursor-pointer">
                        <SelectValue placeholder="Select a user" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {usersLoading ? (
                          <SelectItem value="" disabled>
                            Loading users...
                          </SelectItem>
                        ) : users.length === 0 ? (
                          <SelectItem value="" disabled>
                            No users exist
                          </SelectItem>
                        ) : (
                          users.map((user) => (
                            <SelectItem key={user.userId} value={user.userId}>
                              {user.name ? `${user.name} (${user.email})` : user.email}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      placeholder="Karthik"
                      className="bg-white text-black"
                    />
                  )}
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label className="text-white">Phone Number</Label>
                    <Input
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                      placeholder="+91-987-654-3210"
                      className="bg-white text-black"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Email</Label>
                    <Input
                      name="email"
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      placeholder="xyz@gmail.com"
                      className="bg-white text-black"
                      disabled={isAddExisting}
                    />
                  </div>
                </div>

                {/* Role & Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label className="text-white">Role</Label>
                    <Select
                      value={values.role}
                      onValueChange={(value) => handleChange({ target: { name: 'role', value } })}
                    >
                      <SelectTrigger className="bg-white text-black cursor-pointer w-full">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="member" className="cursor-pointer">Member</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {!isAddExisting && (
                    <div className="space-y-2">
                      <Label className="text-white">Password</Label>
                      <div className="relative">
                        <Input
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={values.password}
                          onChange={handleChange}
                          placeholder="Enter password"
                          className="bg-white text-black pr-20"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              const newPassword = generatePassword();
                              setFieldValue('password', newPassword);
                              setShowPassword(true);
                            }}
                            className="p-1 text-gray-500 hover:text-gray-700"
                            title="Generate password"
                          >
                            <RefreshCw size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="p-1 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Permissions */}
                <div className="space-y-4 pt-2">
                  {permissions.map((group) => (
                    <div key={group.parent.id} className="space-y-3">
                      {/* Parent Permission with Checkbox */}
                      <div className="flex items-center">
                        <ServiceCheckbox
                          label={group.parent.name}
                          checked={values.selectedPermissions.includes(group.parent.id)}
                          onChange={() => {
                            const isChecked = values.selectedPermissions.includes(group.parent.id);
                            if (isChecked) {
                              // When unchecking parent, also uncheck all children
                              const childIds = group.children.map(c => c.id);
                              setFieldValue('selectedPermissions',
                                values.selectedPermissions.filter(id => id !== group.parent.id && !childIds.includes(id))
                              );
                            } else {
                              setFieldValue('selectedPermissions', [...values.selectedPermissions, group.parent.id]);
                            }
                          }}
                          id={`parent-${group.parent.id}`}
                          transparent={true}
                        />
                      </div>

                      {/* Child Permissions with Checkboxes */}
                      {group.children && group.children.length > 0 && (
                        <div className="ml-8 space-y-2">
                          {group.children.map((child) => (
                            <div key={child.id} className="flex items-center">
                              <ServiceCheckbox
                                label={child.name}
                                checked={values.selectedPermissions.includes(child.id)}
                                onChange={() => {
                                  const isSelected = values.selectedPermissions.includes(child.id);
                                  if (isSelected) {
                                    setFieldValue('selectedPermissions',
                                      values.selectedPermissions.filter(id => id !== child.id)
                                    );
                                  } else {
                                    // When selecting child, also select parent if not already selected
                                    const newPermissions = [...values.selectedPermissions, child.id];
                                    if (!values.selectedPermissions.includes(group.parent.id)) {
                                      newPermissions.push(group.parent.id);
                                    }
                                    setFieldValue('selectedPermissions', newPermissions);
                                  }
                                }}
                                id={`child-${child.id}`}
                                transparent={true}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Action */}
                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    className="cursor-pointer disabled:cursor-not-allowed bg-[#C6A95F] text-white hover:bg-[#b99a52] w-full sm:w-auto"
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AddMember;
