import React, { useState } from "react";
import logo from "../../assets/Photos/NewLogo2.png";
import BackGround from "../../assets/Photos/backgroundNavbar.jpg";
import { FaLongArrowAltRight, FaSpinner } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../config";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate(); 

  const [isLoading, setisLoading] = useState(false); 
  const [apiError, setApiError] = useState(""); 

  // Call Login
  function handleLogin(formvalue) {
    setisLoading(true);
    setApiError(""); 

    axios
      .post(`${API_BASE_URL}login`, formvalue, {
        withCredentials: true,
      })
      .then(({ data }) => {
        if (data.message === "Login successful") {
          const user = data.user;
          toast.success("Login successful");
          navigate("/Main");

          // Save user data
          localStorage.setItem("userToken", data.token);
          localStorage.setItem(
            "userData",
            JSON.stringify({
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            })
          );
        }
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.error || "An unexpected error occurred.";
        toast.error(errorMessage);
        setApiError(errorMessage);
        console.log(error);
      })
      .finally(() => {
        setisLoading(false);
      });
  }

  // Validation
  let validationSchema = Yup.object().shape({
    email: Yup.string().email("Email is invalid").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  // Formik
  let formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: handleLogin,
  });

  return (
    <>
      <section>
        <div className="grid lg:grid-cols-2 min-h-screen bg-gray-50">
          {/* Login Form */}
          <div className="w-full flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-md">
              {/* Logo */}
              <img
                src={logo}
                alt="Surfaces Care Logo"
                className="mx-auto w-16 h-16"
              />

              {/* Title */}
              <div className="mt-4 text-center">
                <h1 className="text-2xl sm:text-3xl uppercase textColor">
                  <span className="font-bold">surfaces</span>
                  <span className="font-light">care</span>
                </h1>
                <p className="textColor text-lg mt-1">العــناية بالأسطـــح</p>
              </div>

              {/* Alert Error */}
              {apiError && (
                <div
                  className="p-4 my-4 text-sm text-red-800 rounded-lg bg-red-100"
                  role="alert"
                >
                  {apiError}
                </div>
              )}

              {/* Form */}
              <form onSubmit={formik.handleSubmit} className="mt-8 space-y-6">
                {/* Input Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="text-black font-semibold textColor"
                  >
                    Email Address
                  </label>
                  <input
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="email"
                    value={formik.values.email}
                    type="email"
                    id="email"
                    className="border-gray-300 textColor mt-2 rounded-md block w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border"
                    placeholder="user@email.com"
                    required
                  />
                  {formik.errors.email && formik.touched.email && (
                    <div
                      className="p-2 mt-2 text-sm text-red-800 rounded-lg bg-red-100"
                      role="alert"
                    >
                      {formik.errors.email}
                    </div>
                  )}
                </div>

                {/* Input Password */}
                <div>
                  <div className="flex justify-between items-center">
                    <label
                      htmlFor="Password"
                      className="text-black font-semibold textColor"
                    >
                      Password
                    </label>
                    <NavLink
                      to={"/ForgetPassword"}
                      className="text-sm text-red-600 font-semibold hover:underline"
                    >
                      Forgot password?
                    </NavLink>
                  </div>
                  <input
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="password"
                    value={formik.values.password}
                    type="password"
                    id="Password"
                    className="border-gray-300 textColor mt-2 rounded-md block w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border"
                    placeholder="*********"
                    required
                  />
                  {formik.errors.password && formik.touched.password && (
                    <div
                      className="p-2 mt-2 text-sm text-red-800 rounded-lg bg-red-100"
                      role="alert"
                    >
                      {formik.errors.password}
                    </div>
                  )}
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="backGroundColor flex text-lg items-center cursor-pointer justify-center w-full py-3 rounded-md text-white hover:bg-blue-700 transition-all duration-300 disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <FaSpinner className="animate-spin text-2xl" />
                  ) : (
                    <>
                      Sign in
                      <FaLongArrowAltRight className="ms-2 mt-1" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Background Image */}
          <div className="hidden lg:block relative">
            <div
              className="absolute inset-0 w-full h-full bg-center bg-cover"
              style={{ backgroundImage: `url(${BackGround})` }}
            ></div>
            <div className="absolute inset-x-0 bottom-4 flex justify-center items-end text-white">
              <p>&copy; جميع الحقوق محفوظة 2025</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
