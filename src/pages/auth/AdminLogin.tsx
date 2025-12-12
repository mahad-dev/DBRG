import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const AdminLoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (values: { email: string; password: string }) => {
    console.log('Admin Login values:', values);
    navigate('/admin/dashboard');
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
          <h2 className="text-4xl font-bold mb-8 text-center font-gilroy text-white tracking-wide">
            Admin Login
          </h2>

          <Formik
            initialValues={{ email: '', password: '' }}
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
                    className="w-full mt-2 bg-[#1a1a1a] border border-gray-700 
                    text-white placeholder-gray-500 py-6 rounded-xl 
                    focus:ring-2 focus:ring-[#C6A95F]"
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
                    className="w-full mt-2 bg-[#1a1a1a] border border-gray-700 
                    text-white placeholder-gray-500 py-6 rounded-xl 
                    focus:ring-2 focus:ring-[#C6A95F]"
                  />

                  {errors.password && touched.password && (
                    <div className="text-red-400 text-sm mt-1">{errors.password}</div>
                  )}
                </div>

                {/* SUBMIT BUTTON */}
                <Button
                  type="submit"
                  className="w-full py-6 text-lg rounded-xl bg-[#C6A95F] 
                  hover:bg-[#b9974f] transition-all duration-300 shadow-lg"
                >
                  Login
                </Button>

              </Form>
            )}
          </Formik>

        </div>
      </div>

    </div>
  );
};

export default AdminLogin;
