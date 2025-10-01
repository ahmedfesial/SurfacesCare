import React, { useState, useContext } from "react";
const Navbar = React.lazy(() => import("../../Navbar/Navbar"));
const Footer = React.lazy(() => import("../../Footer/Footer"));
import background2 from "../../../assets/Photos/background2.png";
import defultProductImage from "../../../assets/Photos/defultProductImage.jpg";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";
import { FaSpinner } from "react-icons/fa";
import { Link, NavLink, useParams } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";
import { CartContext } from "../../../Context/CartContext";
import toast from "react-hot-toast";
import { GoHeartFill } from "react-icons/go";
import { BsShare } from "react-icons/bs";

export default function SubCategoryPage() {
  let guest_token = localStorage.getItem("guest_token");
  if (!guest_token) {
    guest_token = crypto.randomUUID();
    localStorage.setItem("guest_token", guest_token);
  }

  let token = localStorage.getItem("userToken");
  // Route param defined in App.jsx is `SubID` (case-sensitive)
  let { SubID } = useParams();

  const [activeSubId, setActiveSubId] = useState(SubID || "all");
  const {
    products = {},
    increaseQuantity,
    decreaseQuantity,
  } = useContext(CartContext);
  const [localQuantities, setLocalQuantities] = useState({});

  // زيادة الكمية
  function handleIncrease(productId, e) {
    e.preventDefault();
    increaseQuantity(productId)
      .then(() => {
        setLocalQuantities((prev) => ({
          ...prev,
          [productId]:
            (prev[productId] ?? products?.[productId]?.quantity ?? 1) + 1,
        }));
        toast.success("Increase Product Quantity +");
      })
      .catch(() => {
        toast.error("Failed Increase Product Quantity +");
      });
  }
  function handleDecrease(productId, e) {
    e.preventDefault();
    decreaseQuantity(productId)
      .then(() => {
        setLocalQuantities((prev) => {
          const current =
            prev[productId] ?? products?.[productId]?.quantity ?? 1;
          return {
            ...prev,
            [productId]: current > 1 ? current - 1 : 1,
          };
        });
        toast.success("Decrease Product Quantity -");
      })
      .catch(() => {
        toast.error("Failed Decrease Product Quantity -");
      });
  }
  // إضافة للعرض
  function addProductToQout(productId, e) {
    e.preventDefault();
    axios
      .post(`${API_BASE_URL}guest/cart/add`, {
        guest_token,
        product_id: productId,
      })
      .then(() => {
        toast.success("Add Product To cart");
      })
      .catch(() => {
        toast.error("Failed Add Product To cart");
      });
  }



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
            return res.data.data.data;
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
          url: window.location.origin + `/AllSubCategory/${product.id}`,
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
      <Navbar />
      {/*Header */}
      <section>
        <div
          className="h-[200px] bg-cover bg-no-repeat bg-center"
          style={{
            backgroundImage: `linear-gradient(#1243AF99) , url(${background2})`,
          }}
        ></div>
      </section>

      {/* Basket */}
      <div className="relative">
        <Link to={"/Cart"}>
          <div className="absolute translate-y-[-50%] right-4 md:right-18 backGroundColor text-white rounded-lg">
            <FiShoppingBag className="text-5xl md:text-7xl p-2 font-light" />
          </div>
        </Link>
      </div>

      {/* Title */}
      <div className="bg-blue-500 p-4 mt-[-50px] md:mt-0">
        <div className="w-[90%] mx-auto flex items-center justify-between">
          <h1 className="text-white text-xl md:text-2xl">Products</h1>
        </div>
      </div>

      <div className="w-[95%] md:w-[90%] mx-auto mt-10 md:mt-20 mb-52">
        {/* Search Bar */}
        <div className="w-full md:w-[60%] mx-auto mt-6">
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className="block w-full p-4 ps-10 text-gray-900 border border-gray-300 bg-[#C3C3C3] rounded-4xl"
              placeholder="Search for products...."
            />
          </div>
        </div>

        {/* Content */}
        <div className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
            {/* Property Filter */}
            <div className="w-full shadow-lg rounded-2xl h-screen hover:shadow-2xl duration-300 transition-all ">
              {/*title  */}
              <div className="flex items-center justify-between py-6 ps-4 mt-4">
                <h1 className="text-[#4B4B4B] font-semibold">Sub Category</h1>
                <p
                  className="textColor text-md pe-4 cursor-pointer"
                  onClick={() => setActiveSubId("all")}
                >
                  Reset all
                </p>
              </div>

              <p className="text-[#4B4B4B] ps-4 my-4">Amenties</p>
              {/* Buttons */}
              <div className="w-[70%] mx-auto textColor py-4">
                <button
                  className={`${
                    activeSubId === "all"
                      ? "bg-[#F2F4F7] text-Color"
                      : "bg-[#F2F4F7]"
                  } w-full py-1 cursor-pointer hover:scale-110 duration-300 transition-all my-4 rounded-3xl`}
                  onClick={() => setActiveSubId("all")}
                >
                  All
                </button>
                {siblingSubs?.map((sub) => (
                  <button
                    key={sub.id}
                    className={`w-full my-2 rounded-3xl py-1 cursor-pointer hover:scale-110 duration-300 transition-all ${
                      // activeSubId may be string (from params) so compare as numbers
                      Number(activeSubId) === sub.id
                        ? "backGroundColor text-white"
                        : "bg-[#F2F4F7]"
                    }`}
                    onClick={() => setActiveSubId(String(sub.id))}
                  >
                    {sub.name_en}
                  </button>
                ))}
              </div>
            </div>

            {/* Products */}
            <div className="w-full">
              <div className="grid grid-cols-4 mt-8 w-[90%] mx-auto gap-6 me-22">
                {data?.map((product) => {
                  return (
                    <NavLink
                      key={product.id}
                      to={`/SubProductDetails/${product.id}`}
                    >
                      <div className="shadow-lg bg-white rounded-xl hover:shadow-2xl duration-300 transition-all h-full flex flex-col relative">
                        <div className="p-4 w-full flex flex-col flex-grow">
                          <div className="absolute top-2 right-2 flex gap-3 z-10">
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
                          <div className="w-full aspect-square overflow-hidden rounded-lg">
                            <img
                              src={product.image_url || defultProductImage}
                              alt="Product Image"
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div className="flex flex-col justify-between flex-grow mt-4">
                            <p className="text-[#11ADD1] my-2 text-sm text-left font-semibold flex-grow">
                              {product.specification}
                            </p>
                            <p className="textColor text-md text-left font-semibold h-[60px] pb-12">
                                {product?.name_en}
                              </p>

                            <div className="flex  gap-2 mt-4">
                              <button
                                onClick={(e) => addProductToQout(product.id, e)}
                                className={`backGroundColor border cursor-pointer hover:bg-white! hover:text-[#1243AF]! duration-300 transition-all w-full flex items-center py-1 gap-2 justify-center rounded-lg text-white`}
                              >
                                Add Quot
                              </button>
                              <div className="flex items-center justify-center">
                                <button
                                  className="backGroundColor cursor-pointer text-white inline-flex items-center justify-center text-sm font-medium h-6 w-6 rounded-lg hover:scale-110 transition-all duration-300"
                                  onClick={(e) => handleDecrease(product.id, e)}
                                >
                                  <svg
                                    className="w-3 h-3 font-bold"
                                    aria-hidden="true"
                                    fill="none"
                                    viewBox="0 0 18 2"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                  >
                                    <path d="M1 1h16" />
                                  </svg>
                                </button>
                                <span className="textColor mx-2">
                                  {localQuantities[product.id] ??
                                    products?.[product.id]?.quantity ??
                                    1}
                                </span>
                                <button
                                  className="backGroundColor cursor-pointer text-white inline-flex items-center justify-center text-sm font-medium h-6 w-6 rounded-lg hover:scale-110 transition-all duration-300"
                                  onClick={(e) => handleIncrease(product.id, e)}
                                >
                                  <svg
                                    className="w-3 h-3"
                                    aria-hidden="true"
                                    fill="none"
                                    viewBox="0 0 18 18"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M9 1v16M1 9h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
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
      <Footer />
    </section>
  );
}
