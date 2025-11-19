import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";

const MemberSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters"),
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),
  mobile: Yup.string()
    .required("Mobile number is required")
    .matches(/^[0-9]+$/, "Only digits allowed")
    .min(10, "Mobile number must be at least 10 digits")
    .max(15, "Mobile number can't exceed 15 digits"),
  message: Yup.string()
    .required("Message is required")
    .min(10, "Message must be at least 10 characters"),
});

export default function BecomeMemberModal() {
  const [open, setOpen] = React.useState(false);
  const API_BASE = import.meta.env.VITE_API_URL as string;

  const handleSubmit = async (
    values: any,
    { resetForm, setSubmitting }: any
  ) => {
    try {
      await axios.post(`${API_BASE}/ContactUs/Create`, values);
      toast.success("Request sent successfully!", { position: "top-right" });
      resetForm();
      setOpen(false);
    } catch (error) {
      toast.error("Failed to send request!", { position: "top-right" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger Button */}
      <DialogTrigger asChild>
        <Button className="w-full sm:w-[155px] h-[46px] rounded-lg bg-[#C6A95F] text-black font-semibold hover:bg-[#b79a55] transition-colors duration-300">
          Become a Member
        </Button>
      </DialogTrigger>

      {/* Modal Content */}
      <DialogContent className="max-w-lg sm:max-w-xl w-[90vw] p-6 sm:p-10 rounded-xl bg-[#0f0f0f] text-white max-h-[90vh] overflow-y-auto scrollbar-none">
        <DialogHeader>
          <DialogTitle className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#C6A95F] mb-2">
            Become a Member
          </DialogTitle>
          <DialogDescription className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Fill out the form below and our team will contact you regarding DBRG
            membership.
          </DialogDescription>
        </DialogHeader>

        <Formik
          initialValues={{ name: "", email: "", mobile: "", message: "" }}
          validationSchema={MemberSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5 mt-6 font-gilory">
              {/* Name */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm sm:text-base font-medium text-white"
                >
                  Name
                </label>
                <Field
                  as={Input}
                  id="name"
                  name="name"
                  placeholder="Name"
                  className="bg-white mt-2 text-black focus:ring-2 focus:ring-[#C6A95F] transition"
                />
                <ErrorMessage
                  name="name"
                  component="p"
                  className="text-red-500 text-xs"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm sm:text-base font-medium text-white"
                >
                  Email Address
                </label>
                <Field
                  as={Input}
                  id="email"
                  name="email"
                  placeholder="Enter Email"
                  className="bg-white mt-2 text-black focus:ring-2 focus:ring-[#C6A95F] transition"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-500 text-xs"
                />
              </div>

              {/* Mobile */}
              <div className="space-y-2">
                <label
                  htmlFor="mobile"
                  className="text-sm sm:text-base font-medium text-white"
                >
                  Mobile Number
                </label>
                <Field
                  as={Input}
                  id="mobile"
                  name="mobile"
                  placeholder="Enter Mobile Number"
                  className="bg-white mt-2 text-black focus:ring-2 focus:ring-[#C6A95F] transition"
                />
                <ErrorMessage
                  name="mobile"
                  component="p"
                  className="text-red-500 text-xs"
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="text-sm sm:text-base font-medium text-white"
                >
                  Message
                </label>
                <Field
                  as={Textarea}
                  id="message"
                  name="message"
                  placeholder="Message"
                  className="bg-white mt-2 text-black h-28 focus:ring-2 focus:ring-[#C6A95F] transition"
                />
                <ErrorMessage
                  name="message"
                  component="p"
                  className="text-red-500 text-xs"
                />
              </div>

              {/* Submit */}
              <div className="flex justify-end mt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="site_btn"
                  className="w-[145px] h-[52px] rounded-lg text-base sm:text-lg font-semibold transition-colors duration-300"
                >
                  {isSubmitting ? "Sending..." : "Submit"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
