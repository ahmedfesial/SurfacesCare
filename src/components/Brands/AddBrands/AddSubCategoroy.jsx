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

  // الفورمات الديناميكية
  const emptySubCategory = () => ({
    id: Date.now() + Math.random(),
    name_en: "",
    name_ar: "",
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
    const { name, value } = e.target;
    setSubCategories((prev) => {
      const copy = [...prev];
      copy[idx][name] = value;
      return copy;
    });
  };

  // ارسال البيانات
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMain) {
      toast.error(t("Brand.Select Main-Category") || "اختر الفئة الرئيسية أولاً");
      return;
    }
    setLoading(true);

    const promises = subCategories.map((sub) => {
      return axios.post(
        `${API_BASE_URL}sub-categories/create`,
        {
          main_category_id: selectedMain,
          name_en: sub.name_en,
          name_ar: sub.name_ar,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    });

    try {
      const results = await Promise.allSettled(promises);
      const successCount = results.filter((r) => r.status === "fulfilled").length;
      const failCount = results.length - successCount;

      if (successCount > 0) {
        toast.success(`${successCount} SubCategories Created`);
        queryClient.invalidateQueries(["AllSubCategory"]);
      }
      if (failCount > 0) toast.error(`${failCount} Failed`);

      // Reset بعد الحفظ
      setSubCategories([emptySubCategory()]);
    } catch (err) {
      console.log(err);
      toast.error("Error Creating SubCategories");
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
            {mainCategories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name_en}
              </option>
            ))}
          </select>
        </div>

        {/* كل SubCategory فورم */}
        <div className="space-y-4">
          {subCategories.map((sub, idx) => (
            <div
              key={sub.id}
              className=" rounded-md p-4 shadow-lg relative bg-white"
            >
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
                    الاسم عربى
                  </label>
                  <input
                    id={`name_ar_${sub.id}`}
                    name="name_ar"
                    value={sub.name_ar}
                    onChange={(e) => handleFieldChange(idx, e)}
                    className="border my-1 p-1.5 rounded-md text-right w-full"
                    placeholder="الاسم عربى"
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
