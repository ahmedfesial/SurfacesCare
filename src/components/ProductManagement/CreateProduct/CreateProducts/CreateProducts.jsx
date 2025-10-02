import React, { useCallback, useMemo , useRef, useState } from "react";
import { LuUpload } from "react-icons/lu";
import { FaBarcode } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { HiOutlineSquaresPlus } from "react-icons/hi2";
import { FaBox } from "react-icons/fa";
import { FaRulerCombined } from "react-icons/fa";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { CiImageOn } from "react-icons/ci";
import { FaVectorSquare } from "react-icons/fa6";
import { API_BASE_URL } from "./../../../../../config";
import axios from "axios";
import { useFormik } from "formik";
import { useQuery } from "@tanstack/react-query";
import { IoPricetagOutline } from "react-icons/io5";
import CertificatesDropdown from "../../EditModelProduct/Certificates";
import Legend from "../../EditModelProduct/Legend";
import MainColor from "../../../Legends & Certificates & Color/MainColor";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function CreateProducts() {


  let token = localStorage.getItem("userToken");
  let navigate = useNavigate()

  // Use State All Code

  const [mainImage, setMainImage] = useState(null);
  const [images, setImages] = useState([null, null, null]);
  const [certificates, setCertificates] = useState([null, null, null]);
  const [legend, setLegend] = useState([null, null, null]);
  const [mainColorsPreview, setMainColorsPreview] = useState([]);
  const mainColorsInputRef = useRef(null);

  //Filter
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);

  //Get All Brands
  function getAllBrands() {
    return axios.get(`${API_BASE_URL}brands`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  let { data: Brands } = useQuery({
    queryKey: ["brands"],
    queryFn: getAllBrands,
    select: (data) => data.data.data,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Get All Main Categories
  function getAllMainCategory() {
    return axios.get(`${API_BASE_URL}main-categories`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  let { data: MainCategories } = useQuery({
    queryKey: ["mainCategories"],
    queryFn: getAllMainCategory,
    select: (data) => data.data.data,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Get All Sub Categories
  function getAllSubCategory() {
    return axios.get(`${API_BASE_URL}sub-categories`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  let { data: SubCategories } = useQuery({
    queryKey: ["subCategories"],
    queryFn: getAllSubCategory,
    select: (data) => data.data.data,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Create Product
  function AddProduct(values) {
    const formData = new FormData();

    Object.entries(values).forEach(([key, val]) => {
      if (val instanceof File) {
        formData.append(key, val);
      } else if (Array.isArray(val)) {
        val.forEach((item, index) => {
          if (item instanceof File) {
            formData.append(`${key}[${index}]`, item);
          } else if (typeof item === "object" && item !== null) {
            Object.entries(item).forEach(([subKey, subVal]) => {
              formData.append(`${key}[${index}][${subKey}]`, subVal);
            });
          } else {
            formData.append(`${key}[${index}]`, item);
          }
        });
      } else {
        // هنا بيتحط بقى quantity, sku, hs_code, name_ar, name_en...
        formData.append(key, val);
      }
    });

    axios
      .post(`${API_BASE_URL}products/create`, formData, {
        withCredentials: true,
        headers: {
        Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        toast.success("Create Produtc success");
        navigate('/ProductManagement')
      })
      .catch((err) => {
        console.log(err.response.data.message);
        toast.error(err.response.data.message);
      });
  }

  // Formik Create Product
  let formik = useFormik({
    initialValues: {
      brand_id: "",
      sub_category_id: "",
      name_en: "",
      name_ar: "",
      features: "",
      main_colors: [],
      main_image: null,
      pdf_hs: null,
      pdf_msds: null,
      pdf_technical: null,
      hs_code: "",
      sku: "",
      pack_size: "",
      dimensions: "",
      capacity: "",
      specification: "",
      // price: 100,
      // is_visible: true,
      quantity: "",
      certificate_ids: [],
      legend_ids: [],
      main_color: "", // return this line
      description_ar: "",
      images: [],
      prices: [
        { price_type: "A", value: "" },
        { price_type: "B", value: "" },
        { price_type: "C", value: "" },
        { price_type: "D", value: "" },
      ],
    },
    onSubmit: AddProduct,
  });

  // Add Code This Line

  const handleBrandChange = useCallback(
    (e) => {
      const brandId = e.target.value;
      formik.setFieldValue("brand_id", brandId);
      setSelectedMainCategory(null);
    },
    [formik]
  );

  const handleMainCategoryChange = useCallback((e) => {
    const mainCatId = e.target.value;
    setSelectedMainCategory(mainCatId);
  }, []);

  const filteredMainCategories = useMemo(() => {
    const brandId = formik.values.brand_id;
    if (!brandId) return [];
    return (
      MainCategories?.filter((cat) => cat.brand_id === parseInt(brandId)) || []
    );
  }, [formik.values.brand_id, MainCategories]);

  const filteredSubCategories = useMemo(() => {
    if (!selectedMainCategory) return [];
    return (
      SubCategories?.filter(
        (sub) => sub.main_category_id === parseInt(selectedMainCategory)
      ) || []
    );
  }, [selectedMainCategory, SubCategories]);

  // Certificates
  const handleCertificatesChange =useCallback(
    (values) => {
      // values هنا Array of Numbers (IDs)
      formik.setFieldValue("certificate_ids", values);
    },
    [formik]
  )

  // Legend
  const handleLegendsChange = useCallback((values) => {
    formik.setFieldValue("legend_ids", values);
  }, [formik]);

  const handleMainColorsChange = useCallback((values) => {
    formik.setFieldValue("main_colors", values);
  }, [formik]);

  // handle main image upload
  const handleMainImage = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (file) {
        setMainImage(URL.createObjectURL(file));
        formik.setFieldValue("main_image", file);
      }
    },
    [formik]
  );

  const handleImageChange = useCallback(
    (index, e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setImages((prev) => {
        const next = [...prev];
        next[index] = URL.createObjectURL(file);
        return next;
      });
      const imageFiles = [...(formik.values.images || [])];
      imageFiles[index] = file;
      formik.setFieldValue("images", imageFiles);
    },
    [formik]
  );

  // handle Certifiacton
  const _handleCertificatesImage = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const newCertificates = [...certificates];
      newCertificates[index] = URL.createObjectURL(file);
      setCertificates(newCertificates);
      const certFiles = [...formik.values.certificates];
      certFiles[index] = file;
      formik.setFieldValue("certificates", certFiles);
    }
  };

  // handle legend images (prefixed with underscore to allow unused without lint error)
  const _handleLegendImage = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const newLegend = [...legend];
      newLegend[index] = URL.createObjectURL(file);
      setLegend(newLegend);
      const legendFiles = [...formik.values.legends];
      legendFiles[index] = file;
      formik.setFieldValue("legends", legendFiles);
    }
  };

  return (
    <section className="w-[55%] mx-auto py-10">
      {/*main div */}
      <form
        action=""
        onSubmit={formik.handleSubmit}
        className="flex flex-col items-center text-xs"
      >
        {/* Selected Comment this inputs*/}
        <div className="flex gap-4 w-full mb-4">
          {/* Selected brand  */}
          <select
            onChange={handleBrandChange}
            value={formik.values.brand_id || ""}
            className="w-[33%] rounded-md p-1 border textColor"
          >
            <option value="">Select Brand</option>
            {Brands?.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name_en}
              </option>
            ))}
          </select>

          {/* Selected Main Category */}
          <select
            onChange={handleMainCategoryChange}
            value={selectedMainCategory || ""}
            className="w-[33%] rounded-md p-1 border textColor"
          >
            <option value="">Select Main Category</option>
            {filteredMainCategories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name_en}
              </option>
            ))}
          </select>

          {/* Selected Sub Category */}
          <select
            value={formik.values.sub_category_id || ""}
            onChange={(e) =>
              formik.setFieldValue("sub_category_id", e.target.value)
            }
            className="w-[33%] rounded-md p-1 border textColor"
          >
            <option value="">Select Sub Category</option>
            {filteredSubCategories?.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name_en}
              </option>
            ))}
          </select>
        </div>

        {/*Product Name English */}
        <div className="col-span-6 sm:col-span-3 w-full">
          <label
            htmlFor="PorductNameEN"
            className="block mb-2 text-sm font-medium textColor"
          >
            Product Name
          </label>
          <input
            id="PorductNameEN"
            type="text"
            className="w-full peer focus:outline-none textColor rounded-md border-1 p-2"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name_en}
            name="name_en"
          />
        </div>

        {/*Product Name Arabic */}
        <div className="col-span-6 sm:col-span-3 w-full mt-2">
          <label
            htmlFor="brand"
            className="block mb-2 text-sm font-medium textColor"
          >
            Product Name AR
          </label>
          <input
            dir="rtl"
            type="text"
            className="w-full peer focus:outline-none textColor rounded-md border-1 p-2"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name_ar}
            name="name_ar"
          />
        </div>

        {/* Product Details EN*/}
        <div className="col-span-full my-4 textColor w-full">
          <label
            htmlFor="product-details"
            className="block mb-2 text-sm font-medium"
          >
            Product Details EN
          </label>
          <textarea
            id="product-details"
            rows="6"
            placeholder=""
            name="features"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.features}
            className="block p-4 w-full text-gray-900 border border-gray-300 sm:text-sm rounded-lg focus:ring-2 focus:ring-fuchsia-50 focus:border-fuchsia-300 textColor"
          ></textarea>
        </div>

        {/* Product Details */}
        <div className="col-span-full my-4 textColor w-full">
          <label
            htmlFor="product-details_AR"
            className="block mb-2 text-sm font-medium"
          >
            Product Details AR
          </label>
          <textarea
            id="product-details_AR"
            rows="6"
            placeholder=""
            name="description_ar"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description_ar}
            className="block p-4 w-full text-gray-900 border border-gray-300 sm:text-sm rounded-lg focus:ring-2 focus:ring-fuchsia-50 focus:border-fuchsia-300 textColor"
          ></textarea>
        </div>

        {/*Product Price  */}
        <div className="flex justify-between w-full gap-4">
          {["A", "B", "C", "D"].map((type, index) => (
            <div key={type} className="col-span-6 sm:col-span-3 w-full">
              <label
                htmlFor={`price_${type}`}
                className="block mb-2 text-sm font-medium textColor"
              >
                Price {type}
              </label>
              <input
                type="number"
                id={`price_${type}`}
                name={`prices[${index}].value`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.prices[index]?.value ?? ""}
                required
                className="border border-gray-300 textColor focus:outline-none sm:text-sm rounded-lg w-full p-2.5 shadow-sm"
              />

              {/* hidden input for price_type */}
              <input
                type="hidden"
                name={`prices[${index}].price_type`}
                value={type}
              />
            </div>
          ))}
        </div>

        {/*Legend & Color  &*/}
        <div className="flex justify-between w-full z-20">
           <CertificatesDropdown
              value={formik.values.certificate_ids}
              onChange={handleCertificatesChange}
          />
          <Legend 
            value={formik.values.legend_ids}
            onChange={handleLegendsChange}
          />
          <MainColor 
            value={formik.values.main_colors || []}
            onChange={handleMainColorsChange}
          />
          <div className="flex items-center flex-wrap gap-3 mt-2">
  {/* show previews of main colors if any */}
  {mainColorsPreview?.map((src, idx) => (
    <div key={idx} className="relative">
      <img
        src={src}
        alt={`color-${idx}`}
        className="w-10 h-10 rounded-full object-cover border shadow-sm"
      />
      <button
        type="button"
        onClick={() => {
          const newPreviews = mainColorsPreview.filter((_, i) => i !== idx);
          setMainColorsPreview(newPreviews);

          const existing = formik.values.main_colors || [];
          const newVals = existing.filter((_, i) => i !== idx);
          formik.setFieldValue("main_colors", newVals);
        }}
        className="absolute -top-1 -right-1 bg-white border rounded-full w-5 h-5 text-xs flex items-center justify-center shadow"
      >
        ×
      </button>
    </div>
  ))}

  {/* hidden file input for main colors */}
  <input
    ref={mainColorsInputRef}
    type="file"
    accept="image/*"
    className="hidden"
    multiple
    onChange={(e) => {
      const files = Array.from(e.target.files || []);
      const previews = files.map((f) => URL.createObjectURL(f));
      setMainColorsPreview([...mainColorsPreview, ...previews]);

      const existing = formik.values.main_colors || [];
      const newVals = [...existing, ...files];
      formik.setFieldValue("main_colors", newVals);
    }}
  />

  {/* add new color button */}
  <button
    type="button"
    onClick={() => mainColorsInputRef.current?.click()}
    className="flex items-center justify-center border rounded-full w-10 h-10 text-2xl font-bold textColor hover:bg-gray-100 transition"
  >
    +
  </button>
</div>


        </div>

        <div className="grid grid-cols-2 me-8">
          {/*upload Image  */}
          <div className="w-[600px] mt-8 flex gap-8">
            <div className="flex flex-col gap-4">
              {/* Main Image */}
              {/* Main Image */}
              <label className="border-2 textColor rounded-lg w-80  flex items-center justify-center cursor-pointer">
                <img
                  src={mainImage}
                  alt="Main"
                  className="w-full rounded-lg shadow-lg aspect-square object-cover"
                />

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onBlur={formik.handleBlur}
                  name="main_image"
                  onChange={(e) => {
                    const file = e.currentTarget.files[0];
                    if (file) {
                      handleMainImage(e);
                      formik.setFieldValue("main_image", file);
                    }
                  }}
                />
              </label>

              {/* Gallery */}
              <div className="flex gap-3">
                {images?.map((img, index) => (
                  <label
                    key={index}
                    className="border-2 textColor rounded-md w-20 h-20 flex items-center justify-center cursor-pointer"
                  >
                    {img ? (
                      <img
                        src={img}
                        alt={`Gallery ${index}`}
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <CiImageOn className="textColor text-xl" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      name={`images[${index}]`} // ✅ كده الصور هتتبعت في مصفوفة images
                      onChange={(e) => handleImageChange(index, e)}
                    />
                  </label>
                ))}
              </div>

              {/* Buttom Create Product */}
              <button
                type="submit"
                className="backGroundColor text-xl text-white w-[70%] mt-20 px-4 py-1 mb-8 rounded-lg cursor-pointer hover:scale-95"
              >
                Create Product
              </button>
            </div>

            {/*Title Product */}
          </div>

          {/*Details Product  */}
          <div className=" w-[600px]  textColor ps-20 mb-20">
            {/*3 Buttoms */}
            <div className="mt-4 mb-8 w-[85%] mx-auto space-y-4">
              {/* PIS */}
              <label className="backGroundColor text-white w-full py-2 rounded-full flex items-center justify-center gap-2 cursor-pointer border font-semibold">
                PIS <LuUpload />
                <input
                  type="file"
                  className="hidden"
                  name="pdf_hs"
                  onChange={(e) => {
                    const file = e.currentTarget.files[0];
                    formik.setFieldValue("pdf_hs", file);
                  }}
                  onBlur={formik.handleBlur}
                />
              </label>

              {/* MSDS */}
              <label className="backGroundColor text-white w-full py-2 rounded-full flex items-center justify-center gap-2 cursor-pointer  border font-semibold">
                MSDS <LuUpload />
                <input
                  type="file"
                  className="hidden"
                  name="pdf_msds"
                  onBlur={formik.handleBlur}
                  onChange={(e) => {
                    const file = e.currentTarget.files[0];
                    formik.setFieldValue("pdf_msds", file);
                  }}
                />
              </label>

              {/* Technical Data Sheet */}
              <label className="backGroundColor text-white w-full py-2 rounded-full flex items-center justify-center gap-2 cursor-pointer  border font-semibold">
                Technical Data Sheet <LuUpload />
                <input
                  type="file"
                  className="hidden"
                  name="pdf_technical"
                  onBlur={formik.handleBlur}
                  onChange={(e) => {
                    const file = e.currentTarget.files[0];
                    formik.setFieldValue("pdf_technical", file);
                  }}
                />
              </label>
            </div>

            {/*HS Code*/}
            <div className="border text-left w-[85%] mx-auto p-1 flex items-center gap-2">
              {/* Label */}
              <label className="flex items-center gap-2 border-e-2 pe-10 font-bold">
                <FaBarcode className="text-3xl" />
                <span>HS Code:</span>
              </label>

              {/* Input with Icon in center */}
              <div className="relative flex-1">
                <input
                  type="text"
                  className="w-full peer focus:outline-none focus:ring-0"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.hs_code}
                  name="hs_code"
                />
                <FiEdit2 className="textColor absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xl peer-focus:hidden" />
              </div>
            </div>

            {/*SKU */}
            <div className="border w-[85%] mx-auto p-1 flex items-center gap-2">
              {/* Label */}
              <label className="flex items-center gap-2 border-e-2 pe-16 font-bold">
                <HiOutlineSquaresPlus className="text-3xl" />
                <span>SKU:</span>
              </label>

              {/* Input with Icon in center */}
              <div className="relative flex-1">
                <input
                  type="text"
                  className="w-full peer focus:outline-none focus:ring-0"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.sku}
                  name="sku"
                />
                <FiEdit2 className="textColor absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xl peer-focus:hidden" />
              </div>
            </div>

            {/*Pack size*/}
            <div className="border w-[85%] mx-auto p-1 flex items-center gap-2">
              {/* Label */}
              <label className="flex items-center gap-2 border-e-2 pe-10 font-bold">
                <FaBox className="text-xl my-1 me-2" />
                <span>Pick Size:</span>
              </label>

              {/* Input with Icon in center */}
              <div className="relative flex-1">
                <input
                  type="text"
                  className="w-full peer focus:outline-none focus:ring-0"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.pack_size}
                  name="pack_size"
                />
                <FiEdit2 className="textColor absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xl peer-focus:hidden" />
              </div>
            </div>

            {/*Dimensions*/}
            <div className="border w-[85%] mx-auto p-1 flex items-center gap-2">
              {/* Label */}
              <label className="flex items-center gap-2 border-e-2 pe-7.5 font-bold">
                <FaRulerCombined className="text-xl my-1 me-1" />
                <span>Dimensions:</span>
              </label>

              {/* Input with Icon in center */}
              <div className="relative flex-1">
                <input
                  type="text"
                  className="w-full peer focus:outline-none focus:ring-0"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.dimensions}
                  name="dimensions"
                />
                <FiEdit2 className="textColor absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xl peer-focus:hidden" />
              </div>
            </div>

            {/* Capacity: */}
            <div className="border w-[85%] mx-auto p-1 flex items-center gap-2">
              {/* Label */}
              <label className="flex items-center gap-2 border-e-2 pe-12 font-bold">
                <AiOutlineUnorderedList className="text-2xl" />
                <span>Capacity:</span>
              </label>

              {/* Input with Icon in center */}
              <div className="relative flex-1">
                <input
                  type="text"
                  className="w-full peer focus:outline-none focus:ring-0"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.capacity}
                  name="capacity"
                />
                <FiEdit2 className="textColor absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xl peer-focus:hidden" />
              </div>
            </div>

            {/*Specification  */}
            <div className="border w-[85%] mx-auto p-1 flex items-center gap-2">
              {/* Label */}
              <label className="flex items-center gap-2 border-e-2 pe-6 font-bold">
                <FaVectorSquare className="text-2xl" />
                <span className="text-md">Specification:</span>
              </label>

              {/* Input with Icon in center */}
              <div className="relative flex-1">
                <input
                  type="text"
                  className="w-full peer focus:outline-none focus:ring-0"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.specification}
                  name="specification"
                />
                <FiEdit2 className="textColor absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xl peer-focus:hidden" />
              </div>
            </div>

            {/* quantity */}
            <div className="border w-[85%] mx-auto p-1 flex items-center gap-2">
              {/* Label */}
              <label className="flex items-center gap-2 border-e-2 pe-13 font-bold">
                <IoPricetagOutline className="text-2xl" />
                <span className="text-md">quantity:</span>
              </label>

              {/* Input with Icon in center */}
              <div className="relative flex-1">
                <input
                  type="number"
                  className="w-full peer focus:outline-none focus:ring-0"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.quantity}
                  name="quantity"
                />
                <FiEdit2 className="textColor absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xl peer-focus:hidden" />
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
