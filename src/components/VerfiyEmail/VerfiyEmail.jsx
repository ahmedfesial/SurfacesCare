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

export default function VerifyEmail() {
  let navigate = useNavigate();

  const [isLoading, setisLoading] = useState(false); //spinner

  // Call Verify Email
  function handleVerifyEmail() {
    setisLoading(true);

    axios
      .post(
        `${API_BASE_URL}email/verify/send`,
        {
          email: formik.values.code,
        },
        {
          withCredentials: true,
        }
      )
      .then(({ data }) => {
        if (data.message === "Verification code sent") {
          toast.success("Successfully");
          setisLoading(false);
          navigate("/ResetPassword");
        }
      })
      // Back to Catch Error
      .catch(() => {
        toast.error('"Something went wrong"');
        setisLoading(false);
      });
  }

  // Validation
  let validationSchema = Yup.object().shape({
    code: Yup.string().required("Code is required"),
  });

  // get Data from user
  let formik = useFormik({
    initialValues: {
      code: "",
    },
    validationSchema,
    onSubmit: handleVerifyEmail,
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
              Verify Email
            </h1>

            {/* Form */}
            <form onSubmit={formik.handleSubmit} className="mt-4">
              {/* Input Email */}
              <div className="mb-2">
                <label htmlFor="code" className="text-black font-semibold">
                  Enter Verification Code:
                </label>
                <input
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="code"
                  value={formik.values.code}
                  type="tel"
                  id="code"
                  className="border-1 textColor mt-2 rounded-lg block w-full p-2"
                />
              </div>

              {/* Validation Code */}
              {formik.errors.code && formik.touched.code ? (
                <div
                  className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-red-200 dark:text-red-400"
                  role="alert"
                >
                  {formik.errors.code}
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
                  "Send A Code"
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
