import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../../../../config";
import { useTranslation } from "react-i18next";

export default function AddSubCategoryMulti() {
  const token = localStorage.getItem("userToken");
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // Get All Main Categories
  const getAllMainCategory = () => axios.get(`${API_BASE_URL}main-categories`);
  const { data: mainCategories } = useQuery({
    queryKey: ["AllMainCategory"],
    queryFn: getAllMainCategory,
    select: (res) => res.data.data,
  });

  // الفورم الديناميكية
  const emptySubCategory = () => ({
    id: Date.now() + Math.random(),
    name_en: "",
    name_ar: "",
    cover_image: null,
    background_image: null,
  });

  const [selectedMain, setSelectedMain] = useState("");
  const [subCategories, setSubCategories] = useState([emptySubCategory()]);
  const [loading, setLoading] = useState(false);

  // أضف فورم جديد
  const addSubCategory = () => {
    setSubCategories((prev) => [...prev, emptySubCategory()]);
  };

  // احذف فورم معين
  const removeSubCategory = (idx) => {
    setSubCategories((prev) => prev.filter((_, i) => i !== idx));
  };

  // غيّر بيانات فورم معين
  const handleFieldChange = (idx, e) => {
    const { name, value, files } = e.target;
    setSubCategories((prev) => {
      const copy = [...prev];
      if (files) copy[idx][name] = files[0];
      else copy[idx][name] = value;
      return copy;
    });
  };

  // إرسال البيانات
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMain) {
      toast.error(t("Brand.Select Main-Category") || "اختر الفئة الرئيسية أولاً");
      return;
    }
    setLoading(true);

    const formData = new FormData();

    subCategories.forEach((sub, index) => {
      formData.append(`subcategories[${index}][main_category_id]`, selectedMain);
      formData.append(`subcategories[${index}][name_en]`, sub.name_en);
      formData.append(`subcategories[${index}][name_ar]`, sub.name_ar);
      if (sub.cover_image) formData.append(`subcategories[${index}][cover_image]`, sub.cover_image);
      if (sub.background_image) formData.append(`subcategories[${index}][background_image]`, sub.background_image);
    });

    try {
      await axios.post(`${API_BASE_URL}sub-categories/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Subcategories Created Successfully");
      queryClient.invalidateQueries(["AllSubCategory"]);
      setSubCategories([emptySubCategory()]);
    } catch (err) {
      console.log(err);
      toast.error("Error Creating Subcategories");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[99%] mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* اختيار Main Category */}
        <div>
          <select
            value={selectedMain}
            onChange={(e) => setSelectedMain(e.target.value)}
            className="w-full rounded-md p-2 border textColor"
          >
            <option value="">{t("Brand.Select Main-Category")}</option>
            {Array.isArray(mainCategories) &&
              mainCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name_en}
                </option>
              ))}
          </select>
        </div>

        {/* كل SubCategory فورم */}
        <div className="space-y-4">
          {subCategories.map((sub, idx) => (
            <div key={sub.id} className="rounded-md p-4 shadow-lg relative bg-white">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold textColor">
                  {t("Sub-Category")} {idx + 1}
                </h4>
                {subCategories.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSubCategory(idx)}
                    className="text-sm px-2 py-1 rounded bg-red-100 text-red-600"
                  >
                    {t("Remove")}
                  </button>
                )}
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-center text-[#1243AF]">
                <div className="flex flex-col w-full">
                  <label htmlFor={`name_en_${sub.id}`}>Name EN</label>
                  <input
                    id={`name_en_${sub.id}`}
                    name="name_en"
                    value={sub.name_en}
                    onChange={(e) => handleFieldChange(idx, e)}
                    className="border my-1 p-1.5 rounded-md w-full"
                    placeholder="Name EN"
                  />
                </div>

                <div className="flex flex-col w-full text-left md:text-right mt-1">
                  <label className="text-sm" htmlFor={`name_ar_${sub.id}`}>
                    الاسم عربي
                  </label>
                  <input
                    id={`name_ar_${sub.id}`}
                    name="name_ar"
                    value={sub.name_ar}
                    onChange={(e) => handleFieldChange(idx, e)}
                    className="border my-1 p-1.5 rounded-md text-right w-full"
                    placeholder="الاسم عربي"
                  />
                </div>
              </div>

              {/* الصور */}
              <div className="flex flex-col md:flex-row gap-4 mt-3 textColor">
                <div className="flex flex-col w-full">
                  <label>Cover Image</label>
                  <input
                    type="file"
                    name="cover_image"
                    accept="image/*"
                    onChange={(e) => handleFieldChange(idx, e)}
                    className="border my-1 p-1.5 rounded-md w-full"
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label>Background Image</label>
                  <input
                    type="file"
                    name="background_image"
                    accept="image/*"
                    onChange={(e) => handleFieldChange(idx, e)}
                    className="border my-1 p-1.5 rounded-md w-full"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* الأزرار */}
        <div className="flex justify-between items-center mt-6 gap-4">
          <button
            type="button"
            onClick={addSubCategory}
            className="px-6 py-2 bg-gray-100 border rounded hover:shadow textColor cursor-pointer"
          >
            {t("Add")}
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-8 bg-[#1243AF] text-white rounded-md p-2 cursor-pointer hover:bg-white hover:text-[#1243AF] border duration-300 transition-all"
          >
            {loading ? t("Saving...") : t("Save")}
          </button>
        </div>
      </form>
    </div>
  );
}
