import React, { useState } from "react";
import { Formik, Form, Field, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ================= TYPES ================= */
interface SignupFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  membershipType: number | "";
}

/* ================= PASSWORD REGEX ================= */
// Minimum 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

/* ================= VALIDATION ================= */
const SignupSchema: Yup.Schema<SignupFormValues> = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  membershipType: Yup.number()
    .typeError("Membership type is required")
    .required("Membership type is required"),
  password: Yup.string()
    .matches(
      passwordRegex,
      "Password must be at least 8 characters, include uppercase, lowercase, number & special character"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
});

/* ================= COMPONENT ================= */
const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const initialValues: SignupFormValues = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    membershipType: "",
  };

  const handleSubmit = async (
    values: SignupFormValues,
    { setSubmitting }: FormikHelpers<SignupFormValues>
  ) => {
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/Account/Register`,
        {
          email: values.email,
          password: values.password,
          fullName: values.fullName,
          membershipType: values.membershipType,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success("Account created successfully!", { autoClose: 4000 });
      navigate("/login");
    } catch (err: any) {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message, { autoClose: 4000 });
      } else {
        toast.error("Something went wrong. Please try again.", { autoClose: 4000 });
      }
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#121212]">
      {/* LEFT */}
      <div className="hidden md:flex w-1/2 items-center justify-center">
        <img src="/static/DBRGLOGO.png" alt="DBRG Logo" className="max-w-[65%]" />
      </div>

      <div className="hidden md:flex w-px bg-white opacity-70" />

      {/* RIGHT */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-10">
        <div className="w-full max-w-md">
          <h2 className="text-4xl font-bold mb-8 text-center text-white">
            Create Account
          </h2>

          <Formik
            initialValues={initialValues}
            validationSchema={SignupSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, setFieldValue, values }) => (
              <Form className="space-y-6">
                {/* FULL NAME */}
                <div>
                  <Label className="text-white">Full Name</Label>
                  <Field
                    as={Input}
                    name="fullName"
                    placeholder="Enter your full name"
                    className="mt-2 bg-[#1a1a1a] border-gray-700 text-white py-6 rounded-xl"
                  />
                  {errors.fullName && touched.fullName && (
                    <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>

                {/* EMAIL */}
                <div>
                  <Label className="text-white">Email Address</Label>
                  <Field
                    as={Input}
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="mt-2 bg-[#1a1a1a] border-gray-700 text-white py-6 rounded-xl"
                  />
                  {errors.email && touched.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* MEMBERSHIP TYPE */}
                <div>
                  <Label className="text-white">Membership Type</Label>
                  <Select
                    value={values.membershipType.toString()}
                    onValueChange={(val) => setFieldValue("membershipType", Number(val))}
                  >
                    <SelectTrigger className="mt-2 w-full  bg-[#1a1a1a] border-gray-700 text-white py-6 rounded-xl">
                      <SelectValue placeholder="Select membership type" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-gray-700 text-white">
                      <SelectItem value="1">Principal Member</SelectItem>
                      <SelectItem value="2">Member Bank</SelectItem>
                      <SelectItem value="3">Contributing Member</SelectItem>
                      <SelectItem value="4">Affiliate Member</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.membershipType && touched.membershipType && (
                    <p className="text-red-400 text-sm mt-1">{errors.membershipType}</p>
                  )}
                </div>

                {/* PASSWORD */}
                <div>
                  <Label className="text-white">Password</Label>
                  <Field
                    as={Input}
                    name="password"
                    type="password"
                    placeholder="Create a strong password"
                    className="mt-2 bg-[#1a1a1a] border-gray-700 text-white py-6 rounded-xl"
                  />
                  {errors.password && touched.password && (
                    <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                  <Label className="text-white">Confirm Password</Label>
                  <Field
                    as={Input}
                    name="confirmPassword"
                    type="password"
                    placeholder="Re-enter your password"
                    className="mt-2 bg-[#1a1a1a] border-gray-700 text-white py-6 rounded-xl"
                  />
                  {errors.confirmPassword && touched.confirmPassword && (
                    <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-6 text-lg rounded-xl bg-[#C6A95F] hover:bg-[#b9974f]"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </Form>
            )}
          </Formik>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-[#C6A95F] hover:underline text-sm">
              Already have an account? Login
            </Link>
          </div>
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

export default Signup;
