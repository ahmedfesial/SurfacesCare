/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CiImageOn } from "react-icons/ci";
import { LuUpload } from "react-icons/lu";
import { FaBarcode } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { HiOutlineSquaresPlus } from "react-icons/hi2";
import { FaBox } from "react-icons/fa";
import { FaRulerCombined } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { FaVectorSquare } from "react-icons/fa6";
import { IoPricetagOutline } from "react-icons/io5";
import defultProductImage from "../../../../assets/Photos/defultProductImage.jpg";
import Dashboard from "../../../Dashboard/Dashboard";
import ManagementNav from "../../ManagementNav/ManagementNav";
import { API_BASE_URL } from '../../../../../config';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import CertificatesDropdown from "../../EditModelProduct/Certificates";
import Legend from "../../EditModelProduct/Legend";
import MainColor from "../../../Legends & Certificates & Color/MainColor";


export default function UpdateProduct() {

    let token = localStorage.getItem("userToken");


    let {id} = useParams()

    const [mainImagePreview, setMainImagePreview] = useState(null);
    const [imagesPreview, setImagesPreview] = useState([null, null, null]);
    const [certificates, setCertificates] = useState([null, null, null]);
    const [legend, setLegend] = useState([null, null, null]);
    const [mainColorsPreview, setMainColorsPreview] = useState([]);
    const mainColorsInputRef = useRef(null);
    const [pdfHsPreview, setPdfHsPreview] = useState(null);
    const [pdfMsdsPreview, setPdfMsdsPreview] = useState(null);
    const [pdfTechPreview, setPdfTechPreview] = useState(null);

    
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



  //Get Product Details
  
  function getProductById(id) {
  return axios.get(`${API_BASE_URL}products/show/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  }

  const { data: productData, isLoading: productLoading, error: productError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    select: (data) => data.data.data, // assuming API response = {data: {...}}
    enabled: !!id, // مينفعش ينفذ غير لما يبقى فيه id
    staleTime: 0, // دائماً اجلب البيانات الطازجة
    cacheTime: 0, // لا تخزن البيانات في الكاش
  });



  // Update Product - إرسال البيانات المتغيرة فقط
  function UpdateProduct(values) {
    const formData = new FormData();
    const originalData = productData || {};

    // مقارنة البيانات وإرسال المتغير منها فقط
    Object.entries(values).forEach(([key, val]) => {
      // تجاهل الحقول الفارغة أو التي لم تتغير
      if (val === null || val === undefined || val === "") return;
      
      // مقارنة النصوص
      if (typeof val === "string" && originalData[key] === val) return;
      
      // مقارنة الأرقام
      if (typeof val === "number" && originalData[key] === val) return;
      
      // مقارنة المصفوفات
      if (Array.isArray(val)) {
        const originalArray = originalData[key] || [];
        if (JSON.stringify(val) === JSON.stringify(originalArray)) return;
        
        // إرسال الملفات الجديدة فقط
        val.forEach((item, index) => {
          if (item instanceof File) {
            formData.append(`${key}[${index}]`, item);
          } else if (typeof item === "object" && item !== null) {
            Object.entries(item).forEach(([subKey, subVal]) => {
              formData.append(`${key}[${index}][${subKey}]`, subVal);
            });
          } else if (item !== originalArray[index]) {
            formData.append(`${key}[${index}]`, item);
          }
        });
        return;
      }
      
      // إرسال الملفات الجديدة فقط
      if (val instanceof File) {
        formData.append(key, val);
        return;
      }
      
      // إرسال البيانات المتغيرة
      formData.append(key, val);
    });


    axios
      .post(`${API_BASE_URL}products/update-by-post/${id}`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
      })
      .then(()=> {
        toast.success("تم تحديث المنتج بنجاح");
        console.log("Updated fields:", Object.keys(formData));
        // إعادة تحميل البيانات المحدثة
        window.location.reload();
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "حدث خطأ في تحديث المنتج");
        console.log(err);
      });
  }

   // Formik Create Product
    let formik = useFormik({
        
      initialValues: {
        brand_id: productData?.brand_id || "",
        sub_category_id: productData?.sub_category_id || "",
        name_en: productData?.name_en || "",
        name_ar: productData?.name_ar || "",
        features: productData?.features || "",
        main_colors: productData?.main_colors || [],
        hs_code: productData?.hs_code || "",
        sku: productData?.sku || "",
        pack_size: productData?.pack_size || "",
        dimensions: productData?.dimensions || "",
        capacity: productData?.capacity || "",
        specification: productData?.specification || "",
        quantity: productData?.quantity || "",
        main_color: productData?.main_color || "", // return this line
        description_ar: productData?.description_ar || "",
        images: [],
        legend_ids: [],
        certificate_ids: [],
        pdf_hs: null,
        pdf_msds: null,
        main_image: null,
        pdf_technical: null,
        prices: productData?.prices?.length
        ? productData.prices
         : [
          { price_type: "A", value: "" },
          { price_type: "B", value: "" },
          { price_type: "C", value: "" },
          { price_type: "D", value: "" },
        ],
      },
      enableReinitialize: true,
      onSubmit: UpdateProduct,
    });



    // -----------------------
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
            setMainImagePreview(URL.createObjectURL(file));
            formik.setFieldValue("main_image", file);
          }
        },
        [formik]
      );
    
      const handleImageChange = useCallback(
        (index, e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setImagesPreview((prev) => {
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


      // ---------------------- Fill previews ----------------------
    useEffect(() => { 
    if (productData) {
      console.log("Loading product data:", productData);
      
      // تحميل الصورة الرئيسية
      if (productData.main_image) {
        setMainImagePreview(`${API_BASE_URL}${productData.main_image}`);
      }
      
      // تحميل صور المعرض
      if (productData.images?.length) {
        const imageUrls = productData.images.map((img) => `${API_BASE_URL}${img}`);
        // التأكد من وجود 3 عناصر في المصفوفة
        const paddedImageUrls = [...imageUrls];
        while (paddedImageUrls.length < 3) {
          paddedImageUrls.push(null);
        }
        setImagesPreview(paddedImageUrls);
      } else {
        // إذا لم تكن هناك صور، قم بتهيئة مصفوفة فارغة من 3 عناصر
        setImagesPreview([null, null, null]);
      }
      
      // تحميل ملفات PDF
      if (productData.pdf_hs)
        setPdfHsPreview(`${API_BASE_URL}${productData.pdf_hs}`);
      if (productData.pdf_msds)
        setPdfMsdsPreview(`${API_BASE_URL}${productData.pdf_msds}`);
      if (productData.pdf_technical)
        setPdfTechPreview(`${API_BASE_URL}${productData.pdf_technical}`);
        
      // تحميل شهادات وأساطير
      if (productData.certificates?.length) {
        const certUrls = productData.certificates.map((cert) => cert ? `${API_BASE_URL}${cert}` : null);
        setCertificates(certUrls);
      }
      
      if (productData.legends?.length) {
        const legendUrls = productData.legends.map((legend) => legend ? `${API_BASE_URL}${legend}` : null);
        setLegend(legendUrls);
      }
      
      // تحميل الألوان الرئيسية
      if (productData.main_colors?.length) {
        const colorUrls = productData.main_colors.map((color) => color ? `${API_BASE_URL}${color}` : null);
        setMainColorsPreview(colorUrls);
      }
    }
  }, [productData]);

  // عرض مؤشر التحميل أو رسالة الخطأ
  if (productLoading) {
    return (
      <section>
        <div className="grid grid-cols-[270px_1fr] me-4">
          <div className="mb-14 me-8">
            <Dashboard />
          </div>
          <div>
            <ManagementNav />
            <div className="mt-52 w-[55%] mx-auto py-10">
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="min-h-96 flex items-center justify-center my-12">
                          <FaSpinner className="animate-spin text-5xl textColor" />
                        </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (productError) {
    return (
      <section>
        <div className="grid grid-cols-[270px_1fr] me-4">
          <div className="mb-14 me-8">
            <Dashboard />
          </div>
          <div>
            <ManagementNav />
            <div className="mt-52 w-[55%] mx-auto py-10">
              <div className="text-center text-red-500">
                <p className="text-lg">حدث خطأ في تحميل بيانات المنتج</p>
                <p className="text-sm mt-2">{productError.message}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
         <div className="grid grid-cols-[270px_1fr] me-4">
           {/*Slilde bar */}
           <div className="mb-14 me-8">
             <Dashboard />
           </div>
   
           {/*Navbar */}
           <div>
             <ManagementNav />
             {/* Content */}
             <div className="mt-52 w-[55%] mx-auto py-10">
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
                        <div className="flex justify-between w-full ">
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
                              <label className="border-2 textColor rounded-lg w-80 flex items-center justify-center cursor-pointer relative group">
                                <img
                                  src={mainImagePreview || defultProductImage}
                                  alt="Main"
                                  className="w-full rounded-lg shadow-lg aspect-square object-cover"
                                />
                                {/* Overlay for upload indication */}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center">
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
                                    <LuUpload className="text-4xl mx-auto mb-2" />
                                    <p className="text-sm">تغيير الصورة</p>
                                  </div>
                                </div>

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
                                {imagesPreview?.map((img, index) => (
                                  <label
                                    key={index}
                                    className="border-2 textColor rounded-md w-20 h-20 flex items-center justify-center cursor-pointer relative group"
                                  >
                                    {img ? (
                                      <>
                                        <img
                                          src={img}
                                          alt={`Gallery ${index}`}
                                          className="w-full h-full object-cover rounded-md"
                                        />
                                        {/* Overlay for upload indication */}
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded-md flex items-center justify-center">
                                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
                                            <LuUpload className="text-lg mx-auto" />
                                          </div>
                                        </div>
                                      </>
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
                                Update Product
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
             </div>
           </div>
         </div>
       </section>
  )
}
