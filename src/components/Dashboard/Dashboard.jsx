import React, { useState } from "react";
import logo from "../../assets/Photos/NewLogo.png";
import { HiBolt, HiArrowTrendingUp } from "react-icons/hi2";
import { PiSuitcase } from "react-icons/pi";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiBook } from "react-icons/fi";
import { MdOutlineShoppingCart } from "react-icons/md";
import { RiShoppingBag3Line, RiBox3Line } from "react-icons/ri";
import { FaRegSquare } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import axios from "axios";
import { API_BASE_URL } from "./../../../config";
import { useQuery } from "@tanstack/react-query";
import { CiUser } from "react-icons/ci";
import { HiOutlineUsers } from "react-icons/hi";

export default function Dashboard() {
  const [imgError, setImgError] = useState(false);

  function getProfileUser() {
    let token = localStorage.getItem("userToken");

    return axios.get(`${API_BASE_URL}profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  let { data } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfileUser,
    select: (data) => data.data.data,
  });

  

  const navigate = useNavigate();

  function logOut() {
    localStorage.removeItem("userToken");
    navigate("/Login");
  }

  return (
    <section
  className="bg-[#F8F8F8] shadow-xl p-4 flex flex-col text-xs sm:text-sm md:text-base lg:text-lg 
  w-full md:w-[270px] md:h-screen lg:rounded-2xl lg:fixed lg:left-2 lg:top-2 lg:bottom-2 
  lg:h-[calc(100vh-16px)]"
>
        {/* logo & Elements */}
      <div className="w-full md:w-auto md:ms-2 md:pt-4">
        {/* logo */}
        <Link to={'/Main'}>
        <img
          src={logo}
          alt="logo"
          loading="lazy"
          className="w-1/2 mx-auto block md:mx-0 md:w-[60%] md:ms-6 md:mt-6"
        />
        </Link>

        {/* elements */}
        <div className="textColor w-full mt-4 md:w-auto md:mx-4">
          {/* NavLinks */}
          <NavLink
            to={"/Main"}
            className="w-full flex items-center justify-center md:justify-start gap-2 font-medium hover:scale-110 duration-200 transition-all"
          >
            <HiArrowTrendingUp className="me-1 text-lg md:text-xl  md:ms-4" />
            <p className="text-xs sm:text-sm md:text-sm">Dashboard</p>
          </NavLink>

          <NavLink
            to={"/Quotation"}
            className="w-full flex items-center justify-center md:justify-start gap-2 font-medium hover:scale-110 duration-200 transition-all my-2"
          >
            <HiBolt className="me-1 text-lg md:text-xl  md:ms-4" />
            <p className="text-xs sm:text-sm md:text-sm">Quotation</p>
          </NavLink>

          <NavLink
            to={"/Customers"}
            className="w-full flex items-center justify-center md:justify-start gap-2 my-2 font-medium hover:scale-110 duration-200 transition-all"
          >
            <PiSuitcase className="font-bold me-1 text-lg md:text-xl  rounded-lg md:ms-4" />
            <p className="text-xs sm:text-sm md:text-sm">Customers</p>
          </NavLink>

          <NavLink
            to={"/Categories"}
            className="w-full flex items-center justify-center md:justify-start gap-2 my-2 font-medium hover:scale-110 duration-200 transition-all"
          >
            <FiMenu className="font-bold me-1 text-lg md:text-xl  md:ms-4" />
            <p className="text-xs sm:text-sm md:text-sm">Categories</p>
          </NavLink>

          <NavLink
            to={"/Products"}
            className="w-full flex items-center justify-center md:justify-start gap-2 my-2 font-medium hover:scale-110 duration-200 transition-all"
          >
            <MdOutlineShoppingCart className="font-bold me-1 text-lg md:text-xl  md:ms-4" />
            <p className="text-xs sm:text-sm md:text-sm">Products</p>
          </NavLink>

          <NavLink
            to={"/Baskets"}
            className="w-full flex items-center justify-center md:justify-start gap-2 my-2 font-medium hover:scale-110 duration-200 transition-all"
          >
            <RiShoppingBag3Line className="font-bold me-1 text-lg md:text-xl  md:ms-4" />
            <p className="text-xs sm:text-sm md:text-sm">Baskets</p>
          </NavLink>

          <NavLink
            to={"/Catalogs"}
            className="w-full flex items-center justify-center md:justify-start gap-2 my-2 font-medium hover:scale-110 duration-200 transition-all"
          >
            <FiBook className="font-bold me-1 text-lg md:text-xl  md:ms-4" />
            <p className="text-xs sm:text-sm md:text-sm">Catalogs</p>
          </NavLink>

          <NavLink
            to={"/ToDoList"}
            className="w-full flex items-center justify-center md:justify-start gap-2 my-2 font-medium hover:scale-110 duration-200 transition-all pb-12"
          >
            <IoMdCheckmarkCircleOutline className="font-bold me-1 text-lg md:text-xl  md:ms-4" />
            <p className="text-xs sm:text-sm md:text-sm">ToDoList</p>
          </NavLink>
        </div>
      </div>

      {/* Settings */}
      <div
        className={`w-full mt-4 md:w-auto md:mt-0 md:ms-4  ${
          data?.role === "user" ? "invisible" : ""
        } border-t-1 border-[#1243AF]`}
      >
        <p className="font-semibold text-xs sm:text-sm md:text-sm text-center md:text-left md:ms-6 mt-2 text-[#11ADD1] ">
          Settings
        </p>

        <div className="textColor mt-2 w-full md:w-auto">
          <NavLink
            to={"/Members"}
            className="w-full flex items-center justify-center md:justify-start gap-2 my-2 font-medium hover:scale-110 duration-200 transition-all"
          >
            <HiOutlineUsers className="me-1 text-lg md:text-xl  md:ms-6" />
            <p className="text-xs sm:text-sm md:text-base">Members</p>
          </NavLink>

          <NavLink
            to={"/Brands"}
            className="w-full flex items-center justify-center md:justify-start gap-2 my-2 font-medium hover:scale-110 duration-200 transition-all"
          >
            <RiBox3Line className="me-1 text-lg md:text-xl  md:ms-6" />
            <p className="text-xs sm:text-sm md:text-base">Brands</p>
          </NavLink>

          <NavLink
            to={"/ProductManagement"}
            className="w-full flex items-center justify-center md:justify-start gap-2 my-2 font-medium hover:scale-110 duration-200 transition-all"
          >
            <MdOutlineShoppingCart className="font-bold me-1 text-lg md:text-xl  md:ms-6" />
            <p className="text-xs sm:text-sm md:text-base">Product</p>
          </NavLink>

          <NavLink
            to={"/Template"}
            className="w-full flex items-center justify-center md:justify-start gap-2 my-2 mb-8 font-medium hover:scale-110 duration-200 transition-all"
          >
            <FaRegSquare className="me-1 text-lg md:text-xl  md:ms-6" />
            <p className="text-xs sm:text-sm md:text-base">Template</p>
          </NavLink>
        </div>
      </div>

      {/* User */}
      <div className="textColor w-full flex justify-center md:justify-start md:w-auto md:ms-4 border-t-1 py-5">
        <div className="flex items-center gap-2">
          <div className="w-[35px] h-[35px] rounded-lg flex items-center justify-center backGroundColor">
            {!imgError && data?.image ? (
              <img
                src={data.image}
                alt="profile"
                onError={() => setImgError(true)}
                className="w-[35px] h-[35px] rounded-lg object-cover"
              />
            ) : (
              <CiUser className="text-xl md:text-2xl text-white" />
            )}
          </div>
          <div className="text-xs sm:text-sm md:text-base leading-2 mt-2">
            <h1 className="font-bold">{data?.name}</h1>
            <p className="uppercase font-light flex items-center justify-center md:justify-start gap-4 text-xs sm:text-sm md:text-base">
              {data?.role}
              <span onClick={logOut}>
                <IoIosLogOut className="textColor text-lg md:text-xl lg:text-2xl cursor-pointer" />
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
