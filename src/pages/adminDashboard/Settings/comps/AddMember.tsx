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

const AddMember = () => {
  const [permissions, setPermissions] = useState<PermissionGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [isAddExisting, setIsAddExisting] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  const initialValues = {
    name: '',
    phone: '',
    email: '',
    role: 'member',
    password: '',
    selectedPermissions: [] as number[],
    permissionLevels: {} as Record<number, string>,
  };

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
      await userApi.updateUser(updateData);
      toast.success('User updated successfully');
    } catch (error) {
      toast.error('Failed to update user, please try again');
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
      } catch (error) {
        console.error('Failed to fetch permissions:', error);
      } 
    };

    const fetchUsers = async () => {
      try {
        setUsersLoading(true);
        const response = await userApi.getUsers();
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setUsersLoading(false);
      }
    };

    fetchPermissions();
    fetchUsers();
  }, []);

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ values, handleChange, setFieldValue }) => (
        <Form>
          <div className="mt-5 font-inter overflow-visible">
            <Card className="w-[680px] bg-[#3e3e3e] border-none overflow-visible">
              {/* Header */}
              <CardHeader>
                <CardTitle className="text-3xl font-semibold text-[#C6A95F]">
                  Add / Manage Member
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-5 overflow-visible">
                {/* User Selection */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-white">
                      {isAddExisting ? 'Select Existing User' : 'Add New User'}
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddExisting(!isAddExisting)}
                      className="text-white border-white hover:bg-white hover:text-black"
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
                              {user.name? user.name : user.userId} 
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
                <div className="grid grid-cols-2 gap-6">
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
                    />
                  </div>
                </div>

                {/* Role & Password */}
                <div className="grid grid-cols-2 gap-6">
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
                      <Input
                        name="password"
                        type="password"
                        value={values.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        className="bg-white text-black"
                      />
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
                              setFieldValue('selectedPermissions', values.selectedPermissions.filter(id => id !== group.parent.id));
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
                                    setFieldValue('selectedPermissions',
                                      [...values.selectedPermissions, child.id]
                                    );
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
                    className="bg-[#C6A95F] text-white hover:bg-[#b99a52]"
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
