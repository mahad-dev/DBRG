import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (values: { email: string; password: string }) => {
    console.log('Login values:', values);
    navigate('/dashboard');
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
      <div className="hidden md:flex w-[1px] bg-gradient-to-b from-white via-gray-400 to-white opacity-80"></div>

      {/* RIGHT SIDE */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-6 sm:p-10 bg-[#121212]">
        <div className="w-full max-w-md">

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center font-gilroy text-white tracking-wide">
            Welcome Back
          </h2>

          <Formik
            initialValues={{ email: '', password: '' }}
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

                  <Field
                    as={Input}
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    className="w-full mt-2 bg-[#1a1a1a] border border-gray-700 text-white placeholder-gray-500 py-4 sm:py-6 rounded-xl focus:ring-2 focus:ring-[#C6A95F]"
                  />

                  {errors.password && touched.password && (
                    <div className="text-red-400 text-sm mt-1">{errors.password}</div>
                  )}
                </div>

                {/* SUBMIT BUTTON */}
                <Button
                  type="submit"
                  className="w-full py-4 sm:py-6 text-lg rounded-xl bg-[#C6A95F] hover:bg-[#b9974f] transition-all duration-300 shadow-lg"
                >
                  Login
                </Button>

              </Form>
            )}
          </Formik>

          {/* LINKS */}
          <div className="mt-5 text-center">
            <Link to="/signup" className="text-[#C6A95F] hover:underline text-sm sm:text-base">
              Don't have an account? Sign up
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Login;
