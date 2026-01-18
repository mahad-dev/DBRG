import React, { useState } from "react";
import { Formik, Form, Field, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

/* ================= VALIDATION ================= */
const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

/* ================= COMPONENT ================= */
const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

      // Check userType (0 or 1 = normal user, 3 = special user)
      if (data.userType !== 0 && data.userType !== 1 && data.userType !== 3) {
        toast.error("Admins must login from the admin portal.", { autoClose: 4000 });
        return;
      }

      // Store necessary info in localStorage and set auth context
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("userType", data.userType.toString());

      const userData = {
        userId: data.userId,
        name: data.name || data.email.split('@')[0] || 'User',
        email: data.email,
        userType: data.userType,
        membershipType: data.application?.membershipType?.toString(),
        accessToken: data.accessToken,
        application: data.application || null,
        loginSource: 'member' as const,
      };

      login(userData);

      toast.success("Login successful!", { autoClose: 3000 });

      // Route based on userType - userType 3 is a member user
      navigate("/dashboard");
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
            Welcome Back
          </h2>

          <Formik
            initialValues={initialValues}
            validationSchema={LoginSchema}
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

                {/* PASSWORD */}
                <div>
                  <Label htmlFor="password" className="text-white text-sm tracking-wide">
                    Password
                  </Label>
                  <div className="relative">
                    <Field
                      as={Input}
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="w-full mt-2 bg-[#1a1a1a] border border-gray-700 text-white placeholder-gray-500 py-4 sm:py-6 rounded-xl focus:ring-2 focus:ring-[#C6A95F] pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 mt-1 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                  {errors.password && touched.password && (
                    <div className="text-red-400 text-sm mt-1">{errors.password}</div>
                  )}
                </div>

                {/* SUBMIT BUTTON */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 sm:py-6 text-lg rounded-xl bg-[#C6A95F] hover:bg-[#b9974f] transition-all duration-300 shadow-lg cursor-pointer"
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </Form>
            )}
          </Formik>

          {/* LINKS */}
          <div className="mt-5 text-center">
            <Link
              to="/signup"
              className="text-[#C6A95F] hover:underline text-sm sm:text-base cursor-pointer"
            >
              Don't have an account? Sign up
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Login;
