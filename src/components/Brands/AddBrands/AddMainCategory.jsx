import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { FaPalette } from "react-icons/fa";
import { API_BASE_URL } from "../../../../config";
import { useTranslation } from "react-i18next";

export default function AddMainCategoryMulti() {
  const { t } = useTranslation();
  const token = localStorage.getItem("userToken");
  const queryClient = useQueryClient();

  // Get All Brands (كما في كودك)
  function getAllBrands() {
    return axios.get(`${API_BASE_URL}brands`);
  }
  const { data: brands } = useQuery({
    queryKey: ["AllBrands"],
    queryFn: getAllBrands,
    select: (res) => res.data.data,
  });

  // كل كاتيجوري عنصر في المصفوفة
  const emptyCategory = () => ({
    id: Date.now() + Math.random(), // لعمل key فريد ولإعادة تهيئة input type=file
    name_en: "",
    name_ar: "",
    color_code: "#ffffff",
    image_url: null,
  });

  const [selectedBrand, setSelectedBrand] = useState("");
  const [categories, setCategories] = useState([emptyCategory()]);
  const [loading, setLoading] = useState(false);

  const addCategory = () => {
    setCategories((prev) => [...prev, emptyCategory()]);
  };

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
      toast.error(t("Brand.Select Brand") || "اختر ماركة أولاً");
      return;
    }
    setLoading(true);

    // ارسال كل عنصر (يمكن تغييره إلى طلبات متسلسلة إذا أردت)
    const promises = categories.map((cat) => {
      const formData = new FormData();
      formData.append("brand_id", selectedBrand);
      formData.append("name_en", cat.name_en);
      formData.append("name_ar", cat.name_ar);
      formData.append("color_code", cat.color_code || "");
      if (cat.image_url) formData.append("image_url", cat.image_url);

      return axios.post(`${API_BASE_URL}main-categories/create`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    });

    try {
      const results = await Promise.allSettled(promises);
      const successCount = results.filter((r) => r.status === "fulfilled")
        .length;
      const failCount = results.length - successCount;

      if (successCount > 0) {
        toast.success(
          `${successCount} ${t("Brand.Created") || "تم إنشاء الفئات بنجاح"}`
        );
        queryClient.invalidateQueries(["main-categories"]);
      }
      if (failCount > 0) {
        toast.error(
          `${failCount} ${t("Brand.Failed") || "فشل في بعض الإضافات"}`
        );
        console.error("Some requests failed:", results);
      }

      // اترك خيار إعادة التهيئة كما تريد — هنا نعيد سطر واحد فارغ
      setCategories([emptyCategory()]);
    } catch (err) {
      console.error(err);
      toast.error(t("Brand.Error") || "حدث خطأ أثناء الحفظ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[99%] mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Top-level Brand selector */}
        <div>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full rounded-md p-2 border textColor"
          >
            <option value="">{t("Brand.Select Brand") || "اختر ماركة"}</option>
            {brands?.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name_en}
              </option>
            ))}
          </select>
        </div>

        {/* Dynamic categories list */}
        <div className="space-y-4">
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              className="rounded-md p-4 textColor shadow-lg relative"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-extrabold">
                  {t("Brand Main Category") || "Main Category"} {idx + 1}
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
                  <label htmlFor={`name_en_${cat.id}`}>Name EN</label>
                  <input
                    id={`name_en_${cat.id}`}
                    name="name_en"
                    value={cat.name_en}
                    onChange={(e) => handleFieldChange(idx, e)}
                    className="border my-1 p-1.5 rounded-md w-full"
                    placeholder="Name EN"
                  />
                </div>

                <div className="flex flex-col text-right">
                  <label htmlFor={`name_ar_${cat.id}`}>الاسم عربى</label>
                  <input
                    id={`name_ar_${cat.id}`}
                    name="name_ar"
                    value={cat.name_ar}
                    onChange={(e) => handleFieldChange(idx, e)}
                    className="border my-1 p-1.5 rounded-md w-full text-right"
                    placeholder="الاسم عربى"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor={`image_url_${cat.id}`}>
                    {t("Brand.Cover") || "Cover"}
                  </label>
                  <input
                    key={`file-${cat.id}`} // تساعد على إعادة تهيئة الحقل عند إعادة الضبط
                    id={`image_url_${cat.id}`}
                    name="image_url"
                    type="file"
                    onChange={(e) => handleFieldChange(idx, e)}
                    className="border my-1 p-1.5 rounded-md w-full"
                  />
                </div>

                <div className="flex flex-col">
                  {/* hidden color input + custom label */}
                  <input
                    id={`color_code_${cat.id}`}
                    name="color_code"
                    type="color"
                    value={cat.color_code}
                    onChange={(e) => handleFieldChange(idx, e)}
                    className="hidden"
                  />

                  <label
                    htmlFor={`color_code_${cat.id}`}
                    className="cursor-pointer border mt-7 w-full h-9.5 my-1 rounded-md flex items-center justify-between px-4 bg-white shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-2">
                      <FaPalette className="text-lg" />
                      <span className="font-medium">
                        {t("Brand.Choose Color") || "Choose Color"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono">{cat.color_code}</span>
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
            {t("Add") || "Add"}
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
