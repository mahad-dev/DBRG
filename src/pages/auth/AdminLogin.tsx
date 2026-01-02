import React, { useState } from "react";
import { Formik, Form, Field, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/* ================= VALIDATION ================= */
const AdminLoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

/* ================= COMPONENT ================= */
const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const initialValues = { email: "", password: "" };

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: FormikHelpers<typeof initialValues>
  ) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/Account/Login`,
        values,
        { headers: { "Content-Type": "application/json" } }
      );

      const data = res.data.data;

      // Only allow admin users (userType = 2)
      if (data.userType !== 2) {
        toast.error("Only admin users can login here.", { autoClose: 4000 });
        return;
      }

      // Store necessary info in localStorage and set auth context
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("userType", data.userType.toString());

      const userData = {
        userId: data.userId,
        name: data.name || data.email.split('@')[0] || 'Admin User',
        email: data.email,
        userType: data.userType,
        membershipType: data.application?.result?.membershipType?.toString(),
        accessToken: data.accessToken,
      };

      login(userData);

      toast.success("Admin login successful!", { autoClose: 3000 });
      navigate("/admin/dashboard");
    } catch (err: any) {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message, { autoClose: 4000 });
      } else {
        toast.error("Login failed. Please try again.", { autoClose: 4000 });
      }
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#121212]">

      {/* LEFT SIDE */}
      <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-[#121212]">
        <img
          src="/static/DBRGLOGO.png"
          alt="DBRG Logo"
          className="max-w-[65%] object-contain"
        />
      </div>

      {/* WHITE THIN PARTITION LINE */}
      <div className="hidden md:flex w-px bg-white opacity-70"></div>

      {/* RIGHT SIDE */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-10 bg-[#121212]">
        <div className="w-full max-w-md">

          {/* Title */}
          <h2 className="text-4xl font-bold mb-8 text-center text-white tracking-wide">
            Admin Login
          </h2>

          <Formik
            initialValues={initialValues}
            validationSchema={AdminLoginSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="space-y-6">

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
                    placeholder="Enter admin email"
                    className="w-full mt-2 bg-[#1a1a1a] border border-gray-700 text-white placeholder-gray-500 py-6 rounded-xl focus:ring-2 focus:ring-[#C6A95F]"
                  />
                  {errors.email && touched.email && (
                    <div className="text-red-400 text-sm mt-1">{errors.email}</div>
                  )}
                </div>

                {/* PASSWORD */}
                <div>
                  <Label htmlFor="password" className="text-white text-sm tracking-wide">
                    Password
                  </Label>
                  <Field
                    as={Input}
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter admin password"
                    className="w-full mt-2 bg-[#1a1a1a] border border-gray-700 text-white placeholder-gray-500 py-6 rounded-xl focus:ring-2 focus:ring-[#C6A95F]"
                  />
                  {errors.password && touched.password && (
                    <div className="text-red-400 text-sm mt-1">{errors.password}</div>
                  )}
                </div>

                {/* SUBMIT BUTTON */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-6 text-lg rounded-xl bg-[#C6A95F] hover:bg-[#b9974f] transition-all duration-300 shadow-lg"
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>

              </Form>
            )}
          </Formik>

        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
};

export default AdminLogin;
