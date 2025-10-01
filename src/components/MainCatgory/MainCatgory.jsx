import axios from "axios";
import React from "react";
import { NavLink, useParams } from "react-router-dom";
import { API_BASE_URL } from "../../../config";
import { useQuery } from "@tanstack/react-query";
import { FaSpinner } from "react-icons/fa";
import StaticPhoto from "../../assets/Photos/StaticPhoto.jpg";
const Dashboard = React.lazy(() => import("../Dashboard/Dashboard"));
const CategoriesNavbar = React.lazy(() =>
  import("../Categories/CategoriesNavbar/CategoriesNavbar")
);

export default function MainCategory() {
  const { brandId } = useParams();

  const token = localStorage.getItem("userToken");

  // Get Main Categories
  const {
    data: mainCategories,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["main-categories", brandId],
    queryFn: () =>
      axios
        .get(`${API_BASE_URL}main-categories`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => res.data.data),
  });

  // Get All Sub Categories
  const { data: subCategories } = useQuery({
    queryKey: ["sub-categories"],
    queryFn: () =>
      axios
        .get(`${API_BASE_URL}sub-categories`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => res.data.data),
  });

  function getContrastColor(hex) {
    if (!hex) return "#000"; // fallback: black
    hex = hex.replace("#", "");

    // لو 3 أرقام زي #fff نخليها 6 أرقام
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }

    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Formula luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? "#000" : "#fff"; // لو فاتح خليه أسود، لو غامق خليه أبيض
  }

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-96 flex items-center justify-center my-12">
        <FaSpinner className="animate-spin text-5xl textColor" />
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div>
        <h1 className="text-center font-bold">{error.message || error}</h1>
      </div>
    );
  }

  const filteredMainCategories = mainCategories?.filter(
    (cat) => cat.brand_id === Number(brandId)
  );

  return (
    <section>
      <div className="grid grid-cols-[270px_1fr] me-4">
        {/* Sidebar */}
        <div className="mb-14 me-8">
          <Dashboard />
        </div>

        <div>
          {/* Navbar */}
          <CategoriesNavbar />

          {/* Content */}
          <div className="my-12 md:my-60">
            {filteredMainCategories && filteredMainCategories.length > 0 ? (
              filteredMainCategories.map((category) => {
                // أول sub category للـ main category
                const firstSub = subCategories?.find(
                  (sub) => sub.main_category_id === category.id
                );

                return (
                  <NavLink
                    key={category.id}
                    to={`/SubCategory/${firstSub?.id ?? 0}`} // لو مفيش sub يحط 0
                    className="block"
                  >
                    <div
                      className="w-[95%] md:w-[80%] md:h-[200px] 2xl:h-[250px] mx-auto my-5 rounded-md flex flex-col md:flex-row items-center "
                      style={{
                        backgroundColor: category.color_code,
                        color: getContrastColor(category.color_code),
                      }}
                    >
                      {/* image MainCategory */}
                      <div className="w-[18%]  md:h-[200px] 2xl:h-[250px] rounded-l-2xl me-20">
                        <img
                          src={
                            category?.image_url &&
                            category.image_url.trim() !== ""
                              ? category.image_url
                              : StaticPhoto
                          }
                          alt="Category"
                          className="w-full md:h-[200px] 2xl:h-[250px] object-cover rounded-l-md"
                          loading="lazy"
                        />
                      </div>

                      {/* محتوى الكارت */}
                      <div className="w-[45%]  mx-auto  flex flex-col md:flex-row justify-between items-center mt-4 md:mt-0 md:ms-4">
                        <h1 className="w-[350px] font-bold uppercase text-xl md:text-2xl text-center md:text-left ">
                          {category.name_en}
                        </h1>

                        {/* Sub Categories */}
                        <div className="w-[400px] text-xs grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4 md:mt-0 text-center md:text-left">
                          {subCategories
                            ?.filter(
                              (sub) => sub.main_category_id === category.id
                            )
                            .map((sub) => (
                              <div key={sub.id}>
                                <p>{sub.name_en}</p>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </NavLink>
                );
              })
            ) : (
              <div className="textColor flex justify-center items-center h-[400px] text-center text-2xl font-bold">
                Not Found Main Category
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
