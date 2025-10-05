import React, { useState } from "react";
const Dashboard = React.lazy(() => import("../Dashboard/Dashboard"));
const CategoriesNavbar = React.lazy(() =>
  import("../../components/Categories/CategoriesNavbar/CategoriesNavbar")
);
import defultProductImage from "../../assets/Photos/defultProductImage.jpg";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
import { NavLink, useParams } from "react-router-dom";
import { API_BASE_URL } from "../../../config";
import { GoHeartFill } from "react-icons/go";
import { BsShare } from "react-icons/bs";

export default function SubCategory() {


  
  let guest_token = localStorage.getItem("guest_token");
  if (!guest_token) {
    guest_token = crypto.randomUUID();
    localStorage.setItem("guest_token", guest_token);
  }

  let token = localStorage.getItem("userToken");
  // Route param defined in App.jsx is `SubID` (case-sensitive)
  let { SubID } = useParams();

  const [activeSubId, setActiveSubId] = useState(SubID || "all");

  // زيادة الكمية

  // جلب المنتجات
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["sub-categories", activeSubId],
    queryFn: () =>
      axios
        .get(`${API_BASE_URL}products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (activeSubId === "all") {
  // هات كل الـ sub_ids اللي تحت الـ main_category الحالي
  const siblingIds = siblingSubs.map((s) => s.id);

  return res.data.data.data.filter((product) =>
    siblingIds.includes(product.sub_category_id)
  );
} else {
  return res.data.data.data.filter(
    (product) => product.sub_category_id === Number(activeSubId)
  );
}

        }),
  });

  // جلب كل الـ SubCategory
  function getAllSubCategory() {
    return axios.get(`${API_BASE_URL}sub-categories`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  let { data: Sub } = useQuery({
    queryKey: ["AllSubCategory"],
    queryFn: getAllSubCategory,
    select: (data) => data.data.data,
  });

  // wishlist حالة
  const [wishlist, setWishlist] = useState({});

  const toggleWishlist = (id) => {
    setWishlist((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleShare = (e, product) => {
    e.preventDefault(); // ما يروحش على NavLink
    if (navigator.share) {
      navigator.share({
        title: product.product_name,
        text: product.specification,
        url: window.location.origin + `/SubCategory/${product.id}`,
      });
    } else {
      alert("Sharing not supported in this browser.");
    }
  };

  // Determine current sub and siblings: only show subcategories that belong to the
  // same main category as the currently selected SubsId. If SubsId is not present
  // or matching sub not found, fall back to showing all subcategories.
  const subsArray = Sub ?? [];
  const currentSubIdNum = SubID ? Number(SubID) : null;
  const currentSub = subsArray.find((s) => s.id === currentSubIdNum);
  const siblingSubs = currentSub
    ? subsArray.filter(
        (s) => s.main_category_id === currentSub.main_category_id
      )
    : subsArray;

  if (isLoading) {
    return (
      <div className="min-h-96 flex items-center justify-center my-12">
        <FaSpinner className="animate-spin text-5xl textColor" />
      </div>
    );
  }
  if (isError) {
    return (
      <div>
        <h2>Error: {error.message}</h2>
      </div>
    );
  }

  return (
    <section>
      <div className="grid grid-cols-[330px_1fr] me-4">
        {/* Sidebar */}
        <div className="mb-14 me-8">
          <Dashboard />
        </div>

        <div>
          {/*Navbar */}
          <CategoriesNavbar />

          {/* Content */}
          <div className="mt-52 mb-32">
            <div className="grid grid-cols-[260px_1fr] mt-22 me-4">
              {/* Property Filter */}
              <div className="w-[260px] shadow-lg rounded-md text-xs h-screen sticky top-24 mt-2">
                {/*title  */}
                <div className="flex items-center justify-between rounded-t-md border-[#1234AF] py-2 ps-4 mt-2 border-b-1 bg-[#EBEBEB]">
                  <h1 className="textColor font-semibold">Sub Category</h1>
                </div>
                {/* Buttons */}
                <div className="w-[70%] mx-auto textColor py-4">
                  <button
                    className={`w-full text-left my-2 rounded-md px-6 py-1 font-light cursor-pointer hover:scale-110 duration-300 transition-all ${
                      activeSubId === "all"
                        ? "backGroundColor text-white"
                        : "bg-[#F2F4F7]"
                    }`}
                    onClick={() => setActiveSubId("all")}
                  >
                    All
                  </button>

                  {siblingSubs?.map((sub) => (
                    <button
                      key={sub.id}
                      className={`w-full text-left my-2 rounded-md px-6 py-1 font-light cursor-pointer hover:scale-110 duration-300 transition-all ${
                        Number(activeSubId) === sub.id
                          ? "backGroundColor text-white"
                          : "bg-[#F2F4F7]"
                      }`}
                      onClick={() => setActiveSubId(sub.id)}
                    >
                      {sub.name_en}
                    </button>
                  ))}
                </div>
              </div>

              {/* Products */}
              <div className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mt-4 ms-4">
                  {data?.map((product) => {
                    return (
                      <NavLink
                        key={product.id}
                        to={`/ProductDetails/${product.id}`}
                      >
                        <div className="shadow-lg bg-white rounded-xl hover:shadow-2xl duration-300 transition-all h-full flex flex-col relative">
                          <div className="p-4 w-full flex flex-col flex-grow">
                            

                            <div className="w-full aspect-square overflow-hidden rounded-lg">
                              <div className="absolute top-2 right-2 flex gap-3">
                              <button onClick={(e) => handleShare(e, product)}>
                                <BsShare className="text-lg text-gray-600 cursor-pointer hover:text-[#11ADD1]" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  toggleWishlist(product.id);
                                }}
                              >
                                <GoHeartFill
                                  className={`text-lg cursor-pointer ${
                                    wishlist[product.id]
                                      ? "text-red-500"
                                      : "text-gray-400"
                                  }`}
                                />
                              </button>
                            </div>
                              <img
                                src={product.main_image || defultProductImage}
                                alt="Product Image"
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                            <div className="flex flex-col justify-between flex-grow mt-4">
                              <p className="text-[#11ADD1] my-2 text-sm text-left font-semibold flex-grow">
                                {product?.specification}
                              </p>
                              <p className="textColor text-md text-left font-semibold h-[60px] pb-12 mb-4">
                                {product?.name_en}
                              </p>
                            </div>
                          </div>
                        </div>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
