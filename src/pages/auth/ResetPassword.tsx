import React, { useState, useEffect } from "react";
import { Formik, Form, Field, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

/* ================= VALIDATION ================= */
const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

/* ================= COMPONENT ================= */
const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const token = searchParams.get('t');

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setErrorMessage("Invalid reset link. Token is missing.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/Account/ValidatePasswordResetToken`,
          { token },
          { headers: { "Content-Type": "application/json" } }
        );

        const data = res.data;

        if (data.status) {
          setIsValidToken(true);
        } else {
          setErrorMessage(data.message || "Invalid or expired reset link.");
        }
      } catch (err: any) {
        if (err.response?.data?.message) {
          setErrorMessage(err.response.data.message);
        } else {
          setErrorMessage("Failed to validate reset link. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [token]);

  const initialValues = { password: "", confirmPassword: "" };

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: FormikHelpers<typeof initialValues>
  ) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/Account/RecoverPassword`,
        {
          password: values.password,
          token: token
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = res.data;

      if (data.status) {
        toast.success(data.message || "Password reset successfully!", { autoClose: 4000 });
        navigate("/login");
      } else {
        toast.error(data.message || "Failed to reset password.", { autoClose: 4000 });
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message, { autoClose: 4000 });
      } else {
        toast.error("Failed to reset password. Please try again.", { autoClose: 4000 });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#121212] items-center justify-center">
        <div className="text-white text-lg">Validating reset link...</div>
      </div>
    );
  }

  if (!isValidToken) {
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
          <div className="w-full max-w-md text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center text-white">
              Reset Password
            </h2>
            <div className="text-red-400 text-lg mb-6">{errorMessage}</div>
            <Button
              onClick={() => navigate("/login")}
              className="w-full py-4 sm:py-6 text-lg rounded-xl bg-[#C6A95F] hover:bg-[#b9974f] transition-all duration-300 shadow-lg cursor-pointer"
            >
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
            Reset Password
          </h2>

          <Formik
            initialValues={initialValues}
            validationSchema={ResetPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="space-y-5 sm:space-y-6">
                {/* PASSWORD */}
                <div>
                  <Label htmlFor="password" className="text-white text-sm tracking-wide">
                    New Password
                  </Label>
                  <div className="relative">
                    <Field
                      as={Input}
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
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

                {/* CONFIRM PASSWORD */}
                <div>
                  <Label htmlFor="confirmPassword" className="text-white text-sm tracking-wide">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Field
                      as={Input}
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      className="w-full mt-2 bg-[#1a1a1a] border border-gray-700 text-white placeholder-gray-500 py-4 sm:py-6 rounded-xl focus:ring-2 focus:ring-[#C6A95F] pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 mt-1 text-gray-400 hover:text-white"
                    >
                      {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                  {errors.confirmPassword && touched.confirmPassword && (
                    <div className="text-red-400 text-sm mt-1">{errors.confirmPassword}</div>
                  )}
                </div>

                {/* SUBMIT BUTTON */}
                <Button
                  type="submit"
                  className="w-full py-4 sm:py-6 text-lg rounded-xl bg-[#C6A95F] hover:bg-[#b9974f] transition-all duration-300 shadow-lg cursor-pointer"
                >
                  Reset Password
                </Button>
              </Form>
            )}
          </Formik>

          {/* LINKS */}
          <div className="mt-5 text-center">
            <Button
              onClick={() => navigate("/login")}
              variant="link"
              className="text-[#C6A95F] hover:underline text-sm sm:text-base cursor-pointer"
            >
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
