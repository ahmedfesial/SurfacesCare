import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { FaPalette , FaSpinner } from "react-icons/fa";
import { API_BASE_URL } from "../../../../config";
import { useTranslation } from "react-i18next";

export default function AddMainCategoryMulti() {
  const { t } = useTranslation();
  const token = localStorage.getItem("userToken");
  const queryClient = useQueryClient();
  

  // ✅ Get All Brands safely
  const getAllBrand = () => axios.get(`${API_BASE_URL}brands`);
  const { data: brands } = useQuery({
    queryKey: ["AllMainCategory"],
    queryFn: getAllBrand,
    select: (res) => res.data.data,
  });

  const emptyCategory = () => ({
    name_en: "",
    name_ar: "",
    color_code: "#000000",
    image_url: null,
  });

  const [selectedBrand, setSelectedBrand] = useState("");
  const [categories, setCategories] = useState([emptyCategory()]);
  const [loading, setLoading] = useState(false);

  const addCategory = () => setCategories((prev) => [...prev, emptyCategory()]);

  const removeCategory = (idx) => {
    setCategories((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleFieldChange = (idx, e) => {
    const { name, value, type, files } = e.target;
    setCategories((prev) => {
      const copy = [...prev];
      if (type === "file") copy[idx][name] = files[0] ?? null;
      else copy[idx][name] = value;
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBrand) {
      toast.error(t("Select Brand") || "اختر ماركة أولاً");
      return;
    }
    
    setLoading(true);
    
    try {
      const formData = new FormData();

      categories.forEach((cat, idx) => {
        formData.append(`categories[${idx}][brand_id]`, selectedBrand);
        formData.append(`categories[${idx}][name_en]`, cat.name_en);
        formData.append(`categories[${idx}][name_ar]`, cat.name_ar);
        formData.append(`categories[${idx}][color_code]`, cat.color_code);
        if (cat.image_url) {
          formData.append(`categories[${idx}][image_url]`, cat.image_url);
        }
      });

      await axios.post(`${API_BASE_URL}main-categories/create`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(t("Created successfully") || "تم إنشاء الفئات بنجاح");
      queryClient.invalidateQueries(["main-categories"]);
      setCategories([emptyCategory()]);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        t("Error occurred") ||
        "حدث خطأ أثناء الحفظ"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[99%] mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Brand selector */}
        <div>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full rounded-md p-2 border textColor"
          >
            <option value="">{t("Select Brand") || "اختر ماركة"}</option>
            {Array.isArray(brands) &&
              brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name_en}
                </option>
              ))}
          </select>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="rounded-md p-4 textColor shadow-lg relative"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-extrabold">
                  {t("Main Category") || "Main Category"} {idx + 1}
                </h4>
                {categories.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCategory(idx)}
                    className="text-sm px-2 py-1 rounded bg-red-100 text-red-600 cursor-pointer"
                  >
                    {t("Remove") || "Remove"}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label htmlFor={`name_en_${idx}`}>Name EN</label>
                  <input
                    id={`name_en_${idx}`}
                    name="name_en"
                    value={cat.name_en}
                    onChange={(e) => handleFieldChange(idx, e)}
                    className="border my-1 p-1.5 rounded-md w-full"
                    placeholder="Name EN"
                  />
                </div>

                <div className="flex flex-col text-right">
                  <label htmlFor={`name_ar_${idx}`}>الاسم عربى</label>
                  <input
                    id={`name_ar_${idx}`}
                    name="name_ar"
                    value={cat.name_ar}
                    onChange={(e) => handleFieldChange(idx, e)}
                    className="border my-1 p-1.5 rounded-md w-full text-right"
                    placeholder="الاسم عربى"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor={`image_url_${idx}`}>
                    {t("Cover") || "Cover"}
                  </label>
                  <input
                    key={`file-${idx}`}
                    id={`image_url_${idx}`}
                    name="image_url"
                    type="file"
                    onChange={(e) => handleFieldChange(idx, e)}
                    className="border my-1 p-1.5 rounded-md w-full"
                  />
                </div>

                <div className="flex flex-col">
                  <input
                    id={`color_code_${idx}`}
                    name="color_code"
                    type="color"
                    value={cat.color_code}
                    onChange={(e) => handleFieldChange(idx, e)}
                    className="hidden"
                  />
                  <label
                    htmlFor={`color_code_${idx}`}
                    className="cursor-pointer border mt-7 w-full h-9.5 my-1 rounded-md flex items-center justify-between px-4 bg-white shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-2">
                      <FaPalette className="text-lg" />
                      <span className="font-medium">
                        {t("Choose Color") || "Choose Color"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono">
                        {cat.color_code}
                      </span>
                      <span
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: cat.color_code }}
                      />
                    </div>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 justify-between">
          <button
            type="button"
            onClick={addCategory}
            className="px-4 py-2 bg-gray-100 border rounded hover:shadow textColor cursor-pointer"
          >
            {t("Add")}
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-8 bg-[#1243AF] text-white rounded-md p-2 hover:bg-white hover:text-[#1243AF] border duration-300 transition-all"
          >
            {loading ? (t("Saving") || "Saving...") : t("Save") || "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
