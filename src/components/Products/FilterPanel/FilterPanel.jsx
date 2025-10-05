import { useState } from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CiFilter } from "react-icons/ci";
import { RiResetLeftLine } from "react-icons/ri";
import { t } from "i18next";

export default function FilterPanel({ onFilter }) {
  const token = localStorage.getItem("userToken");

  // eslint-disable-next-line no-unused-vars
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const [filteredMainCategories, setFilteredMainCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);

  const [filters, setFilters] = useState({
    name_en: "",
    brand_id: "",
    sub_category_id: "",
    sku: "",
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // ✅ نضمن نرجّع Array مهما كان شكل الـ response
  const extractProductsArray = (resData) => {
    if (Array.isArray(resData)) return resData;
    if (Array.isArray(resData?.data)) return resData.data;
    if (Array.isArray(resData?.data?.data)) return resData.data.data;
    return [];
  };

  const handleFilter = async () => {
    try {
      // ابعت بس الفيلدز اللي ليها قيم
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== "" && v != null)
      );

      const res = await axios.get(`${API_BASE_URL}products`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      const arr = extractProductsArray(res.data);
      toast.success("Done");
      onFilter(arr);
      return arr;
    } catch (err) {
      console.error("Error filtering products", err);
      toast.error("Filter failed");
    }
  };

  const handleReset = () => {
    setFilters({ name_en: "", brand_id: "", sub_category_id: "", sku: "" });
    setSelectedBrand(null);
    setSelectedMainCategory(null);
    setFilteredMainCategories([]);
    setFilteredSubCategories([]);
    onFilter(null); // يعرض كل المنتجات
  };

  const handleBrandChange = (e) => {
    const brandId = e.target.value;
    setSelectedBrand(brandId);
    setFilters((prev) => ({ ...prev, brand_id: brandId, sub_category_id: "" }));

    const filtered = MainCategories?.filter(
      (cat) => Number(cat.brand_id) === Number(brandId)
    );
    setFilteredMainCategories(filtered || []);
    setFilteredSubCategories([]);
    setSelectedMainCategory(null);
  };

  const handleMainCategoryChange = (e) => {
    const mainCatId = e.target.value;
    setSelectedMainCategory(mainCatId);
    setFilters((prev) => ({ ...prev, sub_category_id: "" }));

    const filteredSub = SubCategories?.filter(
      (sub) => Number(sub.main_category_id) === Number(mainCatId)
    );
    setFilteredSubCategories(filteredSub || []);
  };

  // Queries
  const getAllBrands = () =>
    axios.get(`${API_BASE_URL}brands`, {
      headers: { Authorization: `Bearer ${token}` },
    });

  const { data: Brands } = useQuery({
    queryKey: ["brands"],
    queryFn: getAllBrands,
    select: (r) => r.data.data,
  });

  const getAllMainCategory = () =>
    axios.get(`${API_BASE_URL}main-categories`, {
      headers: { Authorization: `Bearer ${token}` },
    });

  const { data: MainCategories } = useQuery({
    queryKey: ["mainCategories"],
    queryFn: getAllMainCategory,
    select: (r) => r.data.data,
  });

  const getAllSubCategory = () =>
    axios.get(`${API_BASE_URL}sub-categories`, {
      headers: { Authorization: `Bearer ${token}` },
    });

  const { data: SubCategories } = useQuery({
    queryKey: ["subCategories"],
    queryFn: getAllSubCategory,
    select: (r) => r.data.data,
  });

  return (
    <div className="w-[96%] relative mx-auto mt-4 z-30">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="textColor flex w-full justify-between items-center rounded-md cursor-pointer bg-[#ffffff] text-left text-sm font-medium  focus:outline-none p-2">
              <div className="flex items-center gap-4 font-bold ms-4">
                <CiFilter className="text-xl" />
                <span className="text-lg font-light">{t("Filter.Filter")}</span>
              </div>
              <ChevronUpIcon
                className={`${
                  open ? "rotate-180 transform" : ""
                } h-5 w-5 textColor transition-transform`}
              />
            </Disclosure.Button>

            <Disclosure.Panel className="rounded-b-lg px-6 py-4 space-y-4 bg-[#ffffff] h-[240px]">
              <div className="w-[84%] flex gap-4 justify-between mx-auto mt-4">
                <input
                  type="text"
                  name="name_en"
                  value={filters.name_en}
                  onChange={handleChange}
                  placeholder="Product Name"
                  className="text-[#1234AF90] w-full p-2 border rounded-md focus:outline-none focus:border-[#1243AF]"
                />
                <input
                  type="text"
                  name="sku"
                  value={filters.sku}
                  onChange={handleChange}
                  placeholder="SKU"
                  className="text-[#1234AF90] w-full p-2 border rounded-md focus:outline-none focus:border-[#1243AF]"
                />
              </div>

              <div className="flex justify-between gap-4 w-[84%] mb-4 mx-auto">
                <select
                  value={filters.brand_id}
                  onChange={handleBrandChange}
                  className="w-[36%] rounded-md p-2 border text-[#1234AF90]"
                >
                  <option>{t("Filter.Choose Brand")}</option>
                  {Brands?.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name_en}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedMainCategory || ""}
                  onChange={handleMainCategoryChange}
                  className="w-[36%] rounded-md p-2 border text-[#1234AF90]"
                >
                  <option value="">{t("Filter.Choose Main Category")}</option>
                  {filteredMainCategories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name_en}
                    </option>
                  ))}
                </select>

                <select
                  name="sub_category_id"
                  value={filters.sub_category_id}
                  onChange={handleChange}
                  className="w-[36%] rounded-md p-2 border text-[#1234AF90]"
                >
                  <option value="">{t("Filter.Choose Sub Category")}</option>
                  {filteredSubCategories?.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name_en}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-2 mt-6 me-23">
                <button
                  onClick={handleReset}
                  className="bg-white flex items-center justify-center gap-2 text-[#DC2626] px-6 py-2 cursor-pointer rounded-md hover:bg-[#DC2626] hover:text-white border duration-300 transition-all"
                >
                  <RiResetLeftLine className="text-xl" /> {t("Filter.Reset")}
                </button>
                <button
                  onClick={handleFilter}
                  className="backGroundColor flex justify-center items-center gap-2 text-white px-6 py-2 cursor-pointer rounded-md hover:bg-white! hover:text-[#1243AF] border duration-300 transition-all"
                >
                  <CiFilter className="text-xl" /> {t("Filter.Filter")}
                </button>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}
