import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";

// ✅ Validation Schema
const ContactSchema = Yup.object().shape({
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

export default function ContactForm() {
  return (
    <section className="w-full flex flex-col items-center justify-center py-16 px-4 bg-[#0f0f0f] text-white">
      
 {/* Top description */}
<p className="max-w-7xl mx-auto text-center mb-10 text-[24px] leading-[100%] font-gilory-medium">
  We'd love to hear from you! Whether you have inquiries about DBRG membership, 
  upcoming events, industry insights, or general feedback, our team is here to assist. 
  Below are all the ways you can get in touch with us.
</p>


      {/* Title */}
<h2 className="text-[48px] font-semibold text-[#C6A95F] leading-[100%] mb-10" style={{ fontFamily: 'Inter' }}>
  Contact Form
</h2>


      {/* Card */}
      <div
        className="
          w-full max-w-5xl 
          bg-[#D9D9D926] 
          rounded-xl shadow-2xl 
          p-6 md:p-10 
          flex flex-col md:flex-row 
          gap-8
        "
      >
        {/* Left Gray Box */}
        <div className="w-full md:w-1/2 rounded-lg bg-[#d3d3d3] h-72 md:h-auto" />

        {/* Form */}
        <Formik
          initialValues={{
            name: "",
            email: "",
            mobile: "",
            message: "",
          }}
          validationSchema={ContactSchema}
          onSubmit={async (values, { resetForm }) => {
            try {
              await axios.post(
                "http://dbrgapi.runasp.net/api/ContactUs/Create",
                values
              );

              toast.success("Message sent successfully!", {
                position: "top-right",
              });

              resetForm();
            } catch (error) {
              toast.error("Failed to send message!", {
                position: "top-right",
              });
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="w-full md:w-1/2 space-y-5">

              {/* Name */}
              <div className="space-y-1">
                <label  className="text-[20px] font-normal leading-[100%] font-gilory-regular ">Name</label>
                <Field
                  as={Input}
                  name="name"
                  placeholder="Name"
                  className="bg-white text-black mt-2"
                />
                <ErrorMessage
                  name="name"
                  component="p"
                  className="text-red-500 text-xs"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label  className="text-[20px] font-normal leading-[100%] font-gilory-regular ">Email Address</label>
                <Field
                  as={Input}
                  name="email"
                  placeholder="Enter Email"
                  className="bg-white text-black mt-2"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-500 text-xs"
                />
              </div>

              {/* Mobile */}
              <div className="space-y-1">
                <label  className="text-[20px] font-normal leading-[100%] font-gilory-regular ">Mobile Number</label>
                <Field
                  as={Input}
                  name="mobile"
                  placeholder="Enter Mobile Number"
                  className="bg-white text-black mt-2"
                />
                <ErrorMessage
                  name="mobile"
                  component="p"
                  className="text-red-500 text-xs"
                />
              </div>

              {/* Message */}
              <div className="space-y-1">
               <label 
  className="text-[20px] font-normal leading-[100%] font-gilory-regular "
>
  Message
</label>

                <Field
                  as={Textarea}
                  name="message"
                  placeholder="Message"
                  className="bg-white text-black h-28 mt-2"
                />
                <ErrorMessage
                  name="message"
                  component="p"
                  className="text-red-500 text-xs"
                />
              </div>

              {/* Submit */}
              <Button
  type="submit"
  variant="site_btn"
  disabled={isSubmitting}
  className="w-[145px] h-[52px] rounded-[10px] text-[20px] p-[10px] flex items-center justify-center gap-[10px] opacity-100"
>
  {isSubmitting ? "Sending..." : "Submit"}
</Button>

            </Form>
          )}
        </Formik>

      </div>
    </section>
  );
}
