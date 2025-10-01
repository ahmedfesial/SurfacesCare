import React from "react";
const Navbar = React.lazy(() => import("../../Navbar/Navbar"));
const Footer = React.lazy(() => import("../../Footer/Footer"));
import background2 from "../../../assets/Photos/background2.png";

import StaticPhoto from "../../../assets/Photos/StaticPhoto.jpg";
import { FaArrowDownLong } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";
import { FaSpinner } from "react-icons/fa";
import { NavLink, useParams } from "react-router-dom";
import toast from "react-hot-toast";
// import staticPhoto from '../../../assets/Photos/StaticPhoto.jpg'

// Utility function: Determine text color based on background
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

export default function AllMainCategory() {
  const { brandsId } = useParams();

  const token = localStorage.getItem("userToken");

  // Get Main Categories
  const {
    data: mainCategories,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["main-categories", brandsId],
    queryFn: () =>
      axios
        .get(`${API_BASE_URL}main-categories`)
        .then((res) => res.data.data),
  });

  // Get All Sub Categories
  const { data: subCategories } = useQuery({
    queryKey: ["sub-categories"],
    queryFn: () =>
      axios
        .get(`${API_BASE_URL}sub-categories`)
        .then((res) => res.data.data),
  });

  // Get Brand Info
  function getBrandsID() {
    return axios.get(`${API_BASE_URL}brands/${brandsId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  let { data: Brand } = useQuery({
    queryKey: ["GetBrands", brandsId],
    queryFn: getBrandsID,
    select: (res) => res.data.data,
  });



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
    (cat) => cat.brand_id === Number(brandsId)
  );

  return (
    <section>
      <Navbar />

      {/* Header */}
      <section>
        <div
          className="h-[400px] bg-cover bg-no-repeat bg-center"
          style={{
            backgroundImage: `linear-gradient(#1243AF99) , url(${background2})`,
          }}
        ></div>

        {/* Brand Card */}
        <div
          className="overflow-hidden w-[90%] md:w-[80%] lg:w-[70%] h-[500px] bg-cover object-center rounded-3xl -mt-24 sm:-mt-20 md:-mt-32 lg:-mt-48 mx-auto flex justify-between items-center p-6"
          style={{
            backgroundColor: Brand?.color_code,
            color: getContrastColor(Brand?.color_code),
          }}
        >
          <div className="flex justify-around items-center gap-6 w-full">
            <div className="w-[120px] h-[120px] lg:w-[200px] lg:h-[200px] flex justify-center items-center flex-shrink-0">
              {Brand?.logo && (
                <img
                  src={Brand.logo}
                  alt="Brand Logo"
                  loading="lazy"
                  className="w-full max-h-full object-contain"
                />
              )}
            </div>

            <div className="w-[60%]">
              <p
                dir="rtl"
                lang="ar"
                className="font-semibold text-justify leading-relaxed"
              >
                {Brand?.full_description_ar}
              </p>
         <button
  onClick={() => {
    if (Brand?.catalog_pdf_url) {
      window.open(Brand.catalog_pdf_url, "_blank");
    } else {
      toast.error("📄 Catalog not available right now"); 
    }
  }}
  className="uppercase w-full mx-auto lg:mx-0 font-semibold text-lg py-2 rounded-md px-8 mt-8 border flex justify-center items-center gap-2 cursor-pointer hover:bg-opacity-80 transition"
>
  <span lang="en">Download Catalog</span>
  <FaArrowDownLong />
</button>





            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="my-12 md:my-24">
        {filteredMainCategories && filteredMainCategories.length > 0 ? (
          filteredMainCategories.map((category) => {
            // أول sub category للـ main category
            const firstSub = subCategories?.find(
              (sub) => sub.main_category_id === category.id
            );

            return (
              <NavLink
                key={category.id}
                to={`/AllSubCategory/${firstSub?.id ?? 0}`} // لو مفيش sub يحط 0
                className="block"
              >
                <div
                  className="w-[95%] md:w-[70%] h-[250px] lg:h-[250px] mx-auto my-5 rounded-2xl flex flex-col ju md:flex-row items-center "
                  style={{
                    backgroundColor: category.color_code,
                    color: getContrastColor(category.color_code),
                  }}
                >
                  {/* image MainCategory */}
                  <div className="w-[18%]  h-[250px] rounded-l-2xl me-20">
                    <img
                      src={
                        category?.image_url && category.image_url.trim() !== ""
                          ? category.image_url
                          : StaticPhoto
                      }
                      alt="Category"
                      className="w-full h-[250px] object-cover rounded-l-lg"
                      loading="lazy"
                    />
                  </div>

                  {/* محتوى الكارت */}
                  <div className="w-[45%]  mx-auto  flex flex-col md:flex-row justify-between items-center mt-4 md:mt-0 md:ms-4">
                    <h1 className="w-[350px] font-bold uppercase text-xl md:text-2xl text-center md:text-left ">
                      {category.name_en}
                    </h1>

                    {/* Sub Categories */}
                    <div className="w-[400px] text-xs grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4 md:mt-0 text-center md:text-left ">
                      {subCategories
                        ?.filter((sub) => sub.main_category_id === category.id)
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

      <Footer />
    </section>
  );
}
