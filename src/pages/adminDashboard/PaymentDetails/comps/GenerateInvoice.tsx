"use client";

import * as React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { userApi } from "@/services/userApi";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

/* ================= PROPS ================= */

interface GenerateInvoiceProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: () => void;
  userId?: string;
  userName?: string;
  companyName?: string;
  paymentId?: number | null;
  isEditMode?: boolean;
}

/* ================= VALIDATION SCHEMA ================= */

const validationSchema = Yup.object({
  companyName: Yup.string()
    .required("Company/Member name is required")
    .min(2, "Company/Member name must be at least 2 characters")
    .max(100, "Company/Member name must not exceed 100 characters"),
  invoiceNumber: Yup.string()
    .required("Invoice number is required")
    .matches(/^[a-zA-Z0-9-]+$/, "Invoice number can only contain letters, numbers, and hyphens"),
  vatNumber: Yup.string()
    .required("VAT number is required")
    .matches(/^[a-zA-Z0-9-]+$/, "VAT number can only contain letters, numbers, and hyphens"),
  date: Yup.date()
    .required("Date is required")
    .typeError("Invalid date"),
  dueDate: Yup.date()
    .required("Due date is required")
    .typeError("Invalid date")
    .min(Yup.ref('date'), "Due date must be after or equal to the invoice date"),
  amount: Yup.number()
    .required("Amount is required")
    .positive("Amount must be a positive number")
    .max(999999999, "Amount is too large"),
  paymentStatus: Yup.number()
    .required("Payment status is required")
    .oneOf([1, 2, 3], "Invalid payment status"),
});

/* ================= COMPONENT ================= */

export default function GenerateInvoiceModal({
  open,
  onOpenChange,
  onConfirm,
  userId = "",
  companyName = "",
  paymentId = null,
  isEditMode = false,
}: GenerateInvoiceProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [initialValues, setInitialValues] = React.useState({
    companyName: companyName,
    invoiceNumber: "",
    vatNumber: "",
    date: new Date(),
    dueDate: new Date(),
    amount: "",
    paymentStatus: 1,
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log("Form submitted with values:", values);
      try {
        setIsSubmitting(true);

        let payload: any;

        if (isEditMode && paymentId) {
          // Update payload - userId not included
          payload = {
            id: paymentId.toString(),
            companyName: values.companyName,
            date: values.date.toISOString(),
            dueDate: values.dueDate.toISOString(),
            paymentStatus: values.paymentStatus,
            amount: Number(values.amount),
            invoiceNumber: values.invoiceNumber,
            vatNumber: values.vatNumber,
          };
        } else {
          // Create payload
          payload = {
            ...(userId && { userId: userId }),
            companyName: values.companyName,
            invoiceNumber: values.invoiceNumber,
            vatNumber: values.vatNumber,
            date: values.date.toISOString(),
            dueDate: values.dueDate.toISOString(),
            amount: Number(values.amount),
            paymentStatus: values.paymentStatus,
          };
        }

        console.log("Payload:", payload);

        const response = isEditMode
          ? await userApi.updatePayment(payload)
          : await userApi.createPayment(payload);

        if (response.status) {
          toast.success(response.message || (isEditMode ? "Payment updated successfully!" : "Invoice generated successfully!"));
          handleClose();
          if (onConfirm) {
            onConfirm();
          }
        } else {
          toast.error(response.message || (isEditMode ? "Failed to update payment" : "Failed to generate invoice"));
        }
      } catch (error: any) {
        console.error(isEditMode ? "Error updating payment:" : "Error generating invoice:", error);
        toast.error(error?.response?.data?.message || (isEditMode ? "An error occurred while updating the payment" : "An error occurred while generating the invoice"));
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Fetch payment data when in edit mode
  React.useEffect(() => {
    console.log("Effect triggered:", { isEditMode, paymentId, open });

    if (isEditMode && paymentId && open) {
      const fetchPaymentData = async () => {
        console.log("Fetching payment data for ID:", paymentId);
        setIsLoading(true);
        try {
          const response = await userApi.getPaymentById(paymentId);
          console.log("Payment data response:", response);

          if (response.status && response.data) {
            const data = response.data;

            const newValues = {
              companyName: data.companyName || "",
              invoiceNumber: data.invoiceNumber || "",
              vatNumber: data.vatNumber || "",
              date: data.date ? new Date(data.date) : new Date(),
              dueDate: data.dueDate ? new Date(data.dueDate) : new Date(),
              amount: data.amount?.toString() || "",
              paymentStatus: data.paymentStatus ?? 1,
            };
            console.log("Setting initial values:", newValues);
            setInitialValues(newValues);
          }
        } catch (error) {
          console.error("Error fetching payment data:", error);
          toast.error("Failed to load payment data");
        } finally {
          setIsLoading(false);
        }
      };

      fetchPaymentData();
    } else if (!isEditMode && open) {
      // Reset to default values for create mode
      console.log("Resetting to default values for create mode");
      setInitialValues({
        companyName: companyName,
        invoiceNumber: "",
        vatNumber: "",
        date: new Date(),
        dueDate: new Date(),
        amount: "",
        paymentStatus: 1,
      });
    }
  }, [isEditMode, paymentId, open, companyName]);

  const handleClose = () => {
    console.log("Closing modal");
    setInitialValues({
      companyName: companyName,
      invoiceNumber: "",
      vatNumber: "",
      date: new Date(),
      dueDate: new Date(),
      amount: "",
      paymentStatus: 1,
    });
    onOpenChange(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    console.log("handleOpenChange called with:", newOpen);
    if (!isSubmitting) {
      if (!newOpen) {
        handleClose();
      } else {
        onOpenChange(newOpen);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-black text-white border-[#C6A95F] p-6 rounded-lg max-w-lg font-inter">
        {/* ===== HEADER ===== */}
        <DialogTitle className="text-[#C6A95F] text-2xl mb-1">
          {isEditMode ? "Edit Payment" : "Generate Invoice"}
        </DialogTitle>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-[#C6A95F]" />
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            {/* ===== COMPANY & INVOICE ===== */}
            <div className="flex gap-5">
              <div>
                <label className="text-sm mb-2 block">
                  Company/ Members Name
                </label>
                <textarea
                  name="companyName"
                  placeholder="Company/ Members Name"
                  value={formik.values.companyName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isSubmitting}
                  className={cn(
                    "w-60 h-9 rounded-lg border px-3 py-2 text-xs text-black bg-white placeholder:text-gray-400",
                    "outline-none transition-all duration-200 focus:ring-1 resize-none disabled:opacity-50 disabled:cursor-not-allowed",
                    formik.touched.companyName && formik.errors.companyName
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-white focus:border-white"
                  )}
                />
                {formik.touched.companyName && formik.errors.companyName && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.companyName}</p>
                )}
              </div>

              <div>
                <label className="text-sm mb-2 block">Invoice No.</label>
                <textarea
                  name="invoiceNumber"
                  placeholder="#01233"
                  value={formik.values.invoiceNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isSubmitting}
                  className={cn(
                    "w-40 h-9 rounded-lg border px-3 py-2 text-xs text-black bg-white placeholder:text-gray-400",
                    "outline-none transition-all duration-200 focus:ring-1 resize-none disabled:opacity-50 disabled:cursor-not-allowed",
                    formik.touched.invoiceNumber && formik.errors.invoiceNumber
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-white focus:border-white"
                  )}
                />
                {formik.touched.invoiceNumber && formik.errors.invoiceNumber && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.invoiceNumber}</p>
                )}
              </div>
            </div>

            {/* ===== VAT ===== */}
            <div className="mt-2">
              <label className="text-sm mb-2 block">VAT Number</label>
              <textarea
                name="vatNumber"
                placeholder="Enter VAT"
                value={formik.values.vatNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isSubmitting}
                className={cn(
                  "w-40 h-9 rounded-lg border px-3 py-2 text-xs text-black bg-white placeholder:text-gray-400",
                  "outline-none transition-all duration-200 focus:ring-1 resize-none disabled:opacity-50 disabled:cursor-not-allowed",
                  formik.touched.vatNumber && formik.errors.vatNumber
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-white focus:border-white"
                )}
              />
              {formik.touched.vatNumber && formik.errors.vatNumber && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.vatNumber}</p>
              )}
            </div>

            {/* ===== DATES ===== */}
            <div className="flex gap-10">
              <div>
                <label className="text-sm mb-2 mt-4 block">Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isSubmitting}
                      className={cn(
                        "cursor-pointer disabled:cursor-not-allowed w-45 h-9 justify-between bg-white text-black",
                        formik.touched.date && formik.errors.date && "border-red-500"
                      )}
                    >
                      {formik.values.date ? format(formik.values.date, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white">
                    <Calendar
                      mode="single"
                      selected={formik.values.date}
                      onSelect={(date) => {
                        if (date) {
                          formik.setFieldValue("date", date);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {formik.touched.date && formik.errors.date && (
                  <p className="text-red-500 text-xs mt-1">{String(formik.errors.date)}</p>
                )}
              </div>

              <div>
                <label className="text-sm mb-2 mt-4 block">Due Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isSubmitting}
                      className={cn(
                        "cursor-pointer disabled:cursor-not-allowed w-45 h-9 justify-between bg-white text-black",
                        formik.touched.dueDate && formik.errors.dueDate && "border-red-500"
                      )}
                    >
                      {formik.values.dueDate ? format(formik.values.dueDate, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white">
                    <Calendar
                      mode="single"
                      selected={formik.values.dueDate}
                      onSelect={(date) => {
                        if (date) {
                          formik.setFieldValue("dueDate", date);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {formik.touched.dueDate && formik.errors.dueDate && (
                  <p className="text-red-500 text-xs mt-1">{String(formik.errors.dueDate)}</p>
                )}
              </div>
            </div>

            {/* ===== PAYMENT DETAILS ===== */}
            <div className="flex gap-10">
              <div>
                <label className="text-sm mb-2 mt-4 block">Amount</label>
                <textarea
                  name="amount"
                  placeholder="Amount"
                  value={formik.values.amount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isSubmitting}
                  className={cn(
                    "w-46 h-9 rounded-lg border px-3 py-2 text-xs text-black bg-white placeholder:text-gray-400",
                    "outline-none transition-all duration-200 focus:ring-1 resize-none disabled:opacity-50 disabled:cursor-not-allowed",
                    formik.touched.amount && formik.errors.amount
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-white focus:border-white"
                  )}
                />
                {formik.touched.amount && formik.errors.amount && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.amount}</p>
                )}
              </div>

              <div>
                <label className="text-sm mb-2 mt-4 block">
                  Payment Status
                </label>
                <Select
                  value={String(formik.values.paymentStatus)}
                  onValueChange={(value) => {
                    formik.setFieldValue("paymentStatus", Number(value));
                  }}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="bg-white text-black rounded-lg w-45 h-9 focus:ring-2 focus:ring-[#C6A95F] [&_svg]:text-black [&_svg]:opacity-100 [&_svg]:size-5">
                    <SelectValue placeholder="Payment Status" />
                  </SelectTrigger>
                  <SelectContent className="w-full bg-white text-black z-50">
                    <SelectItem value="1">Pending</SelectItem>
                    {isEditMode && (
                      <>
                        <SelectItem value="2">Completed</SelectItem>
                        <SelectItem value="3">Rejected</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
                {formik.touched.paymentStatus && formik.errors.paymentStatus && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.paymentStatus}</p>
                )}
              </div>
            </div>

            {/* ===== ACTION ===== */}
            <div>
              <Button
                type="submit"
                className="cursor-pointer disabled:cursor-not-allowed self-start mt-10"
                variant="site_btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    {isEditMode ? "Updating..." : "Sending..."}
                  </>
                ) : (
                  isEditMode ? "Update Payment" : "Send Invoice"
                )}
              </Button>
            </div>
          </div>
        </form>
        )}

        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}
