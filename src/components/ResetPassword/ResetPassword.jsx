import React, { useState } from "react";
import BackGround from "../../assets/Photos/backgroundNavbar.jpg";
import logo from "../../assets/Photos/Newlogo2.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { API_BASE_URL } from "../../../config";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";

export default function ResetPassword() {
  let navigate = useNavigate();
  const [isLoading, setisLoading] = useState(false);

  // Call Reset Password
  function handleResetPassword() {
    setisLoading(true);

    axios
      .post(
        `${API_BASE_URL}reset-password`,
        {
          code: formik.values.code,
          password: formik.values.password,
          password_confirmation: formik.values.password_confirmation,
        },
        { withCredentials: true }
      )
      .then(({ data }) => {
        if (data.message === "Password reset successful") {
          toast.success("Password reset successfully");
          setisLoading(false);
          navigate("/");
        }
      })
      .catch(() => {
        toast.error("Something went wrong");
        setisLoading(false);
      });
  }

  // Validation
  let validationSchema = Yup.object().shape({
    code: Yup.string().required("Verification code is required"),
    password: Yup.string()
      .matches(
        /^[A-Z][a-z0-9]{5,19}$/,
        "Password must start with uppercase and be 6-20 characters"
      )
      .required("Password is required"),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
  });

  let formik = useFormik({
    initialValues: {
      code: "",
      password: "",
      password_confirmation: "",
    },
    validationSchema,
    onSubmit: handleResetPassword,
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
              {/* Code */}
              <div className="mb-2">
                <label htmlFor="code" className="text-black font-semibold">
                  Verification Code :
                </label>
                <input
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="code"
                  value={formik.values.code}
                  type="text"
                  id="code"
                  className="border-1 textColor mt-2 rounded-lg block w-full p-2"
                  placeholder="Enter your code"
                />
              </div>
              {formik.errors.code && formik.touched.code && (
                <div className="p-2 mb-2 text-sm text-red-800 rounded bg-red-50">
                  {formik.errors.code}
                </div>
              )}

              {/* Password */}
              <div className="mb-2">
                <label htmlFor="password" className="text-black font-semibold">
                  Password :
                </label>
                <input
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="password"
                  value={formik.values.password}
                  type="password"
                  id="password"
                  className="border-1 textColor mt-2 rounded-lg block w-full p-2"
                  placeholder="********"
                />
              </div>
              {formik.errors.password && formik.touched.password && (
                <div className="p-2 mb-2 text-sm text-red-800 rounded bg-red-50">
                  {formik.errors.password}
                </div>
              )}

              {/* Confirm Password */}
              <div className="mb-2">
                <label
                  htmlFor="password_confirmation"
                  className="text-black font-semibold"
                >
                  Confirm Password :
                </label>
                <input
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="password_confirmation"
                  value={formik.values.password_confirmation}
                  type="password"
                  id="password_confirmation"
                  className="border-1 textColor mt-2 rounded-lg block w-full p-2"
                  placeholder="Confirm password"
                />
              </div>
              {formik.errors.password_confirmation &&
                formik.touched.password_confirmation && (
                  <div className="p-2 mb-2 text-sm text-red-800 rounded bg-red-50">
                    {formik.errors.password_confirmation}
                  </div>
                )}

              {/* Submit Button */}
              <button
                type="submit"
                className="backGroundColor flex text-xl mt-6 items-center cursor-pointer justify-center w-full py-2 rounded-md text-white hover:bg-blue-600 duration-300 transition-all"
              >
                {isLoading ? (
                  <FaSpinner className="animate-spin text-2xl" />
                ) : (
                  "Confirm"
                )}
              </button>
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
