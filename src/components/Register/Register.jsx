import React, { useState } from "react";
import logo from "../../assets/Photos/Newlogo2.png";
import BackGround from "../../assets/Photos/backgroundNavbar.jpg";
import { FaLongArrowAltRight } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import { NavLink, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../config";
import axios from "axios";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";

export default function Register() {
  const [isLoading, setisLoading] = useState(false); // Spinner
  const [apiError, setApiError] = useState(""); //Handle Error
  const [profileImage, setProfileImage] = useState(null); //Profile Image
  

  const navigate = useNavigate(); // path

  // Call Register
  function handleRegister(formvalue) {
    setisLoading(true);
    // If an image file is present, send multipart/form-data
    const hasFile = formvalue.image && formvalue.image instanceof File;
    if (hasFile) {
      const fd = new FormData();
      fd.append("name", formvalue.name);
      fd.append("phone", formvalue.phone);
      fd.append("email", formvalue.email);
      fd.append("password", formvalue.password);
      fd.append("password_confirmation", formvalue.password_confirmation);
      fd.append("role", formvalue.role);
      fd.append("image", formvalue.image);

      // Do NOT set Content-Type header; let the browser set the correct
      // multipart/form-data boundary automatically.
      axios.post(`${API_BASE_URL}register`, fd)
        .then(({ data }) => {
          if (data.message === "User registered successfully") {
            toast.success("User registered successfully");
            navigate("/");
            setisLoading(false);
            localStorage.setItem("userToken", data.token);
          }
        })
        .catch((error) => {
          const msg = error?.response?.data?.message || error.message || "Registration failed";
          toast.error(msg);
          setApiError(msg);
          setisLoading(false);
        });
    } else {
      // No file: send JSON
      axios
        .post(`${API_BASE_URL}register`, formvalue)
        .then(({ data }) => {
          if (data.message === "User registered successfully") {
            toast.success("User registered successfully");
            navigate("/");
            setisLoading(false);
            localStorage.setItem("userToken", data.token);
          }
        })
        .catch((error) => {
          const msg = error?.response?.data?.message || error.message || "Registration failed";
          toast.error(msg);
          setApiError(msg);
          setisLoading(false);
        });
    }
  }

  // Validation
  let validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .max(20, "Name must be at most 20 characters")
      .required("Name is required"),

    phone: Yup.string()
      .matches(/^[0-9]{0,13}$/, "Enter a valid phone number")
      .required("Number is required"),

    email: Yup.string().email("Email is invalid").required("Email is required"),
    password: Yup.string()
      .matches(
        /^[A-Z][a-z0-9]{5,9}/,
        "Password must start with an uppercase letter and be 5-20 characters long"
      )
      .required("Password is required"),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
    role: Yup.string()
      .oneOf(["super_admin", "admin", "user"])
      .required("Role is required"),
  });

  // get Data from user
  let formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      role: "",
      password_confirmation: "",
      image: "",
    },
    validationSchema,
    onSubmit: handleRegister,
  });

  const handleMainImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      // create preview and set the file into formik state
      setProfileImage(URL.createObjectURL(file));
      formik.setFieldValue("image", file);
    }
  };

  return (
    <>
      <section>
        <div className="grid lg:grid-cols-2 h-screen">
          {/* Register */}
          <div className="flex justify-center mt-16 w-full">
            <div className="w-[400px]">
              {/* logo */}
              <img src={logo} alt="" className="ms-44 w-[50px]" />

              {/* Title */}
              <div>
                <h1 className="text-2xl text-center uppercase block textColor">
                  <span className="font-bold">surfaces</span>
                  <span className="font-light">care</span>
                </h1>
                <p className="text-center textColor text-xl">
                  العــناية بالأسطـــح
                </p>
              </div>

              {/*Alert Error Register  */}
              {apiError ? (
                <div
                  className="p-2 sm:p-4 my-4 text-xs sm:text-sm text-red-800 rounded-lg bg-red-50 dark:bg-red-200 dark:text-red-400"
                  role="alert"
                >
                  {" "}
                  {apiError}{" "}
                </div>
              ) : (
                ""
              )}

              {/* Form */}
              <form
                onSubmit={formik.handleSubmit}
                className="mt-4 max-w-md mx-auto textColor!"
              >

                {/* Image Profile */}
                {/* Main Image */}
                <div className="w-full flex justify-center items-center">
                <label className="border textColor rounded-full w-20 h-20  flex items-center justify-center cursor-pointer overflow-hidden">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onBlur={formik.handleBlur}
                    name="image"
                    onChange={(e) => {
                      const file = e.currentTarget.files[0];
                      if (file) {
                        handleMainImage(e);
                        // formik.setFieldValue already called in handleMainImage, but keep for safety
                        formik.setFieldValue("image", file);
                      }
                    }}
                  />
                  {profileImage ? (
                    <img src={profileImage} alt="profile preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm">Upload</span>
                  )}
                </label>
                </div>


                {/* Input Name */}
                <div className="mb-2">
                  <label htmlFor="Name" className="font-semibold textColor">
                    Name :
                  </label>
                  <input
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="name"
                    value={formik.values.name}
                    type="text"
                    id="name"
                    className="textColor border-1 mt-2 rounded-lg block w-full p-2 focus:outline-none"
                    placeholder="Ahmed"
                  />
                </div>

                {/* Valid name */}
                {formik.errors.name && formik.touched.name ? (
                  <div
                    className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-red-200 dark:text-red-400"
                    role="alert"
                  >
                    {" "}
                    {formik.errors.name}{" "}
                  </div>
                ) : (
                  ""
                )}

                {/*Input Email */}
                <div className="mb-2">
                  <label htmlFor="email" className="textColor font-semibold">
                    Email :
                  </label>
                  <input
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="email"
                    value={formik.values.email}
                    type="email"
                    id="email"
                    className="textColor border-1 mt-2 rounded-lg block w-full p-2 focus:outline-none"
                    placeholder="ahmed@gmail.com"
                  />
                </div>

                {/*Valid Email  */}
                {formik.errors.email && formik.touched.email ? (
                  <div
                    className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-red-200 dark:text-red-400"
                    role="alert"
                  >
                    {" "}
                    {formik.errors.email}{" "}
                  </div>
                ) : (
                  ""
                )}

                {/*Phone*/}
                <div className="mb-2">
                  <label htmlFor="Phone" className="textColor font-semibold">
                    Phone :
                  </label>
                  <input
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="phone"
                    value={formik.values.phone}
                    type="tel"
                    id="Phone"
                    className="textColor border-1 mt-2 rounded-lg block w-full p-2 focus:outline-none"
                    placeholder="7859847569878"
                  />
                </div>

                {/* Valid Phone */}
                {formik.errors.phone && formik.touched.phone ? (
                  <div
                    className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-red-200 dark:text-red-400"
                    role="alert"
                  >
                    {" "}
                    {formik.errors.phone}{" "}
                  </div>
                ) : (
                  ""
                )}

                {/*Input Password  */}
                <div className="mb-2">
                  <label
                    htmlFor="Password"
                    className="textColor font-semibold"
                  >
                    Password :
                  </label>
                  <input
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="password"
                    value={formik.values.password}
                    type="password"
                    id="Password"
                    className="textColor border-1 mt-2 rounded-lg block w-full p-2 focus:outline-none"
                    placeholder="*********"
                  />
                </div>

                {/*valid Password */}
                {formik.errors.password && formik.touched.password ? (
                  <div
                    className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-red-200 dark:text-red-400"
                    role="alert"
                  >
                    {" "}
                    {formik.errors.password}{" "}
                  </div>
                ) : (
                  ""
                )}

                {/*Input password_confirmation  */}
                <div className="mb-2">
                  <label
                    htmlFor="password_confirmation"
                    className="textColor font-semibold"
                  >
                    Password Confirmation :
                  </label>
                  <input
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="password_confirmation"
                    value={formik.values.password_confirmation}
                    type="password"
                    id="password_confirmation"
                    className="textColor border-1 mt-2 rounded-lg block w-full p-2 focus:outline-none"
                    placeholder="password confirmation"
                  />
                </div>

                {/*valid Password */}
                {formik.errors.password_confirmation &&
                formik.touched.password_confirmation ? (
                  <div
                    className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-red-200 dark:text-red-400"
                    role="alert"
                  >
                    {" "}
                    {formik.errors.password_confirmation}{" "}
                  </div>
                ) : (
                  ""
                )}

                {/* Select role */}

                <h1 className="textColor text-xl my-4 font-bold flex w-full">Role:</h1>

                {/* Role */}
                <div className="flex w-[70%] justify-between">
                    <div className="flex  items-center mb-4">
                  <input
                    id="superAdmin"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    checked={formik.values.role === "super_admin"}
                    type="radio"
                    name="role"
                    value="super_admin"
                    className="textColor w-4 h-4 bg-gray-100 border-gray-300 "
                  />
                  <label
                    htmlFor="superAdmin"
                    className="ms-2 text-sm font-medium"
                  >
                    Super Admin
                  </label>
                </div>
                <div className="flex items-center mb-4">
                  <input
                    id="admin"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    checked={formik.values.role === "admin"}
                    value="admin"
                    type="radio"
                    name="role"
                    className="textColor w-4 h-4 bg-gray-100 border-gray-300 "
                  />
                  <label htmlFor="admin" className="ms-2 text-sm font-medium">
                    Admin
                  </label>
                </div>
                <div className="flex items-center mb-4">
                  <input
                    id="user"
                    type="radio"
                    value="user"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    checked={formik.values.role === "user"}
                    name="role"
                    className="textColor w-4 h-4 bg-gray-100 border-gray-300 "
                  />
                  <label htmlFor="user" className="ms-2 text-sm font-medium">
                    User
                  </label>
                </div>
                </div>
                

                {/* Vaild Role */}

                {formik.errors.role && formik.touched.role ? (
                  <div
                    className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-red-200 dark:text-red-400"
                    role="alert"
                  >
                    {" "}
                    {formik.errors.role}{" "}
                  </div>
                ) : (
                  ""
                )}

                {/* btn sgin up */}
                <button
                  type="submit"
                  className="backGroundColor flex text-xl mt-6 items-center cursor-pointer justify-center w-full  py-2 rounded-md text-white hover:bg-blue-600! duration-300 transition-all"
                >
                  {isLoading ? (
                    <FaSpinner className="animate-spin text-2xl text-blue-500" />
                  ) : (
                    <>
                      {" "}
                      Sgin up <FaLongArrowAltRight className="ms-2 mt-1.5" />{" "}
                    </>
                  )}
                </button>

                <p className=" mt-4 font-semibold mb-8">
                  {" "}
                  You Have Account Ready?
                  <span>
                    {" "}
                    <NavLink className="textColor font-bold" to="/">
                      sgin in
                    </NavLink>
                  </span>
                </p>
              </form>
            </div>
          </div>

          {/* BackGround */}
          <div className="hidden lg:block fixed right-0 w-[50%]">
            <div
              className="h-[692px] me-2 mt-2 bg-center bg-cover bg-repeat rounded-2xl animate-backgroundMove"
              style={{ backgroundImage: `url(${BackGround})` }}
            >
              <div className="flex justify-center items-end h-[670px] text-white">
                <p>&copy; جميع الحقوق محفوظة 2025</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
