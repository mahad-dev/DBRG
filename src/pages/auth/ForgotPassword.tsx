import React, { useState } from "react";
import { Formik, Form, Field, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/* ================= VALIDATION ================= */
const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address"
    )
    .required("Email is required"),
});

/* ================= COMPONENT ================= */
const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const initialValues = { email: "" };

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: FormikHelpers<typeof initialValues>
  ) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/Account/SendPasswordResetEmail`,
        values.email, // Send email as string
        { headers: { "Content-Type": "application/json" } }
      );

      const data = res.data;

      if (data.status) {
        toast.success(data.message, { autoClose: 4000 });
      } else {
        toast.error(data.message, { autoClose: 4000 });
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message, { autoClose: 4000 });
      } else {
        toast.error("Failed to send reset email. Please try again.", { autoClose: 4000 });
      }
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#121212] flex-col md:flex-row">
      {/* LEFT SIDE */}
      <div className="flex md:w-1/2 w-full items-center justify-center bg-[#121212] p-10 md:p-0 relative">
        <img
          src="/static/DBRGLOGO.png"
          alt="DBRG Logo"
          className="max-w-[60%] md:max-w-[65%] object-contain z-10"
        />
      </div>

      {/* SUPER THIN PARTITION LINE (Desktop Only) */}
      <div className="hidden md:flex w-px bg-linear-to-b from-white via-gray-400 to-white opacity-80"></div>

      {/* RIGHT SIDE */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-6 sm:p-10 bg-[#121212]">
        <div className="w-full max-w-md">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center text-white">
            Forgot Password
          </h2>

          <Formik
            initialValues={initialValues}
            validationSchema={ForgotPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="space-y-5 sm:space-y-6">
                {/* EMAIL */}
                <div>
                  <Label htmlFor="email" className="text-white text-sm tracking-wide">
                    Email Address
                  </Label>
                  <Field
                    as={Input}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="w-full mt-2 bg-[#1a1a1a] border border-gray-700 text-white placeholder-gray-500 py-4 sm:py-6 rounded-xl focus:ring-2 focus:ring-[#C6A95F]"
                  />
                  {errors.email && touched.email && (
                    <div className="text-red-400 text-sm mt-1">{errors.email}</div>
                  )}
                </div>

                {/* SUBMIT BUTTON */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 sm:py-6 text-lg rounded-xl bg-[#C6A95F] hover:bg-[#b9974f] transition-all duration-300 shadow-lg cursor-pointer"
                >
                  {loading ? "Sending..." : "Send Reset Email"}
                </Button>
              </Form>
            )}
          </Formik>

          {/* LINKS */}
          <div className="mt-5 text-center">
            <Link
              to="/login"
              className="text-[#C6A95F] hover:underline text-sm sm:text-base cursor-pointer"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
