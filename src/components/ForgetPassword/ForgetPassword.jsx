import React, { useState } from "react";
import BackGround from "../../assets/Photos/backgroundNavbar.jpg";
import logo from "../../assets/Photos/Newlogo2.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { API_BASE_URL } from "../../../config";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";

export default function ForgetPassword() {
  let navigate = useNavigate();

  const [isLoading, setisLoading] = useState(false); //spinner

  // Call Forget Password
  function handleForgetPassword() {
    setisLoading(true);

    axios
      .post(
        `${API_BASE_URL}forgot-password`,
        {
          email: formik.values.email,
        },
        {
          withCredentials: true,
        }
      )
      .then(({ data }) => {
        if (data.message === "Password reset email sent") {
          toast.success("Password reset email sent");
          setisLoading(false);
          navigate("/VerifyEmail");
        }
      })
      .catch(() => {
        toast.error('"Something went wrong"');
        setisLoading(false);
      });
  }

  // Validation
  let validationSchema = Yup.object().shape({
    email: Yup.string().email("Email is invalid").required("Email is required"),
  });

  // get Data from user
  let formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: handleForgetPassword,
  });

  return (
    <section>
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Form Section */}
        <div className="flex flex-col justify-center items-center w-full p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-sm">
            {/* Logo */}
            <div className="flex justify-center">
              <img src={logo} alt="Surfaces Care Logo" className="w-[50px]" />
            </div>

            {/* Title */}
            <div className="mt-4">
              <h1 className="text-2xl text-center uppercase block textColor">
                <span className="font-bold">surfaces</span>
                <span className="font-light">care</span>
              </h1>
              <p className="text-center textColor text-lg">
                العــناية بالأسطـــح
              </p>
            </div>
            <h1 className="text-center my-6 text-3xl font-semibold textColor">
              Reset Password
            </h1>

            {/* Form */}
            <form onSubmit={formik.handleSubmit} className="mt-4">
              {/* Input Email */}
              <div className="mb-2">
                <label htmlFor="email" className="text-black font-semibold">
                  Email :
                </label>
                <input
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="email"
                  value={formik.values.email}
                  type="email"
                  id="email"
                  className="border-1 textColor mt-2 rounded-lg block w-full p-2"
                  placeholder="ahmed@gmail.com"
                />
              </div>

              {/* Validation Email */}
              {formik.errors.email && formik.touched.email ? (
                <div
                  className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-red-200 dark:text-red-400"
                  role="alert"
                >
                  {formik.errors.email}
                </div>
              ) : null}

              {/* Submit Button */}
              <button
                type="submit"
                className="backGroundColor flex text-xl mt-6 items-center cursor-pointer justify-center w-full py-2 rounded-md text-white hover:bg-blue-600 duration-300 transition-all"
              >
                {isLoading ? (
                  <FaSpinner className="animate-spin text-2xl" />
                ) : (
                  "Send"
                )}
              </button>

              {/* Navigate to Sign In */}
              <p className="my-4 font-semibold text-center">
                Remember your password?
                <NavLink className="font-bold textColor ms-1" to="/">
                  Sign in
                </NavLink>
              </p>
            </form>
          </div>
        </div>

        {/* Background Image Section */}
        <div className="hidden lg:block p-2">
          <div
            className="h-full bg-center bg-cover rounded-2xl animate-backgroundMove"
            style={{ backgroundImage: `url(${BackGround})` }}
          >
            <div className="flex justify-center items-end h-full pb-4 text-white">
              <p>&copy; جميع الحقوق محفوظة 2025</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
