import { useEffect } from "react";
import apiClient from "@/services/apiClient";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";

// Mapping for action dropdowns
const actionMap: Record<number, string> = {
  1: "New Member application",
  2: "New Member Approved",
  3: "New Resource",
};

// Email validation helper - supports comma-separated emails
const validateCommaSeparatedEmails = (value: string | undefined) => {
  if (!value || value.trim() === "") return true;

  const emails = value.split(",").map((email) => email.trim());
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emails.every((email) => emailRegex.test(email));
};

const EmailConfiguration = () => {
  // Formik setup with validation schema
  const formik = useFormik({
    initialValues: {
      action1_notify: "",
      action2_approval: "",
      action2_finalApproval: "",
      action3_approval: "",
      action3_notify: "",
    },
    validateOnMount: false,
    validationSchema: Yup.object({
      action1_notify: Yup.string().test(
        "valid-emails",
        "Please enter valid email(s). Multiple emails should be comma-separated",
        validateCommaSeparatedEmails
      ),
      action2_approval: Yup.string().test(
        "valid-emails",
        "Please enter valid email(s). Multiple emails should be comma-separated",
        validateCommaSeparatedEmails
      ),
      action2_finalApproval: Yup.string().test(
        "valid-emails",
        "Please enter valid email(s). Multiple emails should be comma-separated",
        validateCommaSeparatedEmails
      ),
      action3_approval: Yup.string().test(
        "valid-emails",
        "Please enter valid email(s). Multiple emails should be comma-separated",
        validateCommaSeparatedEmails
      ),
      action3_notify: Yup.string().test(
        "valid-emails",
        "Please enter valid email(s). Multiple emails should be comma-separated",
        validateCommaSeparatedEmails
      ),
    }),
    onSubmit: async (values) => {
      try {
        const body = [
          {
            action: 1,
            notify: values.action1_notify || "",
          },
          {
            action: 2,
            approval: values.action2_approval || "",
            finalApproval: values.action2_finalApproval || "",
          },
          {
            action: 3,
            approval: values.action3_approval || "",
            notify: values.action3_notify || "",
          },
        ];

        await apiClient.post("/EmailConfig/SetEmailConfig", body);
        toast.success("Email configuration updated successfully");
      } catch (error: any) {
        console.error("Error updating email configuration:", error);
        toast.error(error?.message || "Failed to update email configuration");
      }
    },
  });

  // GET API
  useEffect(() => {
    const fetchEmailConfig = async () => {
      try {
        const response = await apiClient.get("/EmailConfig/GetEmailConfig");
        if (response.data?.status && response.data?.data) {
          const data = response.data.data;

          const action1 = data.find((c: any) => c.action === 1);
          const action2 = data.find((c: any) => c.action === 2);
          const action3 = data.find((c: any) => c.action === 3);

          formik.setValues({
            action1_notify: action1?.notify || "",
            action2_approval: action2?.approval || "",
            action2_finalApproval: action2?.finalApproval || "",
            action3_approval: action3?.approval || "",
            action3_notify: action3?.notify || "",
          });
        }
      } catch (error: any) {
        console.error("Error fetching email configuration:", error);
        toast.error(error?.message || "Failed to load email configuration");
      }
    };

    fetchEmailConfig();
  }, []);

  return (
    <div className="font-inter mt-5 overflow-visible">
      <Card className="bg-[#3e3e3e] border-[#3e3e3e] max-w-[900px] overflow-visible">
        <CardHeader>
          <CardTitle className="text-[#C6A95F] text-3xl font-semibold">
            Email Configuration
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 overflow-visible">
          <form onSubmit={formik.handleSubmit}>
            {/* New Member Application */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Action</Label>
                <Select value="1" disabled>
                  <SelectTrigger className="max-w-md bg-white! text-black border-none">
                    <SelectValue className="bg-white">
                      {actionMap[1]}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">{actionMap[1]}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Notify</Label>
                <Input
                  type="text"
                  name="action1_notify"
                  value={formik.values.action1_notify}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full max-w-lg bg-white text-black border-none"
                  placeholder="email@example.com, email2@example.com"
                />
                {formik.touched.action1_notify &&
                  formik.errors.action1_notify && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.action1_notify}
                    </p>
                  )}
              </div>
            </div>

            <Separator className="bg-gray-600 my-6" />

            {/* New Member Approved */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Action</Label>
                <Select value="2" disabled>
                  <SelectTrigger className="max-w-md bg-white text-black border-none">
                    <SelectValue>{actionMap[2]}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">{actionMap[2]}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">First Approval</Label>
                  <Input
                    type="text"
                    name="action2_approval"
                    value={formik.values.action2_approval}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full bg-white text-black border-none"
                    placeholder="email@example.com, email2@example.com"
                  />
                  {formik.touched.action2_approval &&
                    formik.errors.action2_approval && (
                      <p className="text-red-500 text-sm">
                        {formik.errors.action2_approval}
                      </p>
                    )}
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Final Approval</Label>
                  <Input
                    type="text"
                    name="action2_finalApproval"
                    value={formik.values.action2_finalApproval}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full bg-white text-black border-none"
                    placeholder="email@example.com, email2@example.com"
                  />
                  {formik.touched.action2_finalApproval &&
                    formik.errors.action2_finalApproval && (
                      <p className="text-red-500 text-sm">
                        {formik.errors.action2_finalApproval}
                      </p>
                    )}
                </div>
              </div>
            </div>

            <Separator className="bg-gray-600 my-6" />

            {/* New Resource */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Action</Label>
                <Select value="3" disabled>
                  <SelectTrigger className="max-w-md bg-white text-black border-none">
                    <SelectValue>{actionMap[3]}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">{actionMap[3]}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Approval</Label>
                  <Input
                    type="text"
                    name="action3_approval"
                    value={formik.values.action3_approval}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full bg-white text-black border-none"
                    placeholder="email@example.com, email2@example.com"
                  />
                  {formik.touched.action3_approval &&
                    formik.errors.action3_approval && (
                      <p className="text-red-500 text-sm">
                        {formik.errors.action3_approval}
                      </p>
                    )}
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Notify</Label>
                  <Input
                    type="text"
                    name="action3_notify"
                    value={formik.values.action3_notify}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full bg-white text-black border-none"
                    placeholder="email@example.com, email2@example.com"
                  />
                  {formik.touched.action3_notify &&
                    formik.errors.action3_notify && (
                      <p className="text-red-500 text-sm">
                        {formik.errors.action3_notify}
                      </p>
                    )}
                </div>
              </div>
            </div>

            {/* Button */}
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                variant="site_btn"
                disabled={formik.isSubmitting}
                className="cursor-pointer disabled:cursor-not-allowed px-6"
              >
                {formik.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailConfiguration;
