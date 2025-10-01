import { useCallback, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { API_BASE_URL } from "./../../../../../config";

export function useCreateProductLogic() {
  const token = localStorage.getItem("userToken");

  const mainColorsInputRef = useRef(null);

  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([null, null, null, null]);
  const [mainColorsPreview, setMainColorsPreview] = useState([]);

  // Heavy file blobs kept outside Formik to avoid freezes
  const [mainImageFile, setMainImageFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([null, null, null, null]);
  const [pdfHsFile, setPdfHsFile] = useState(null);
  const [pdfMsdsFile, setPdfMsdsFile] = useState(null);
  const [pdfTdsFile, setPdfTdsFile] = useState(null);
  const [mainColorFiles, setMainColorFiles] = useState([]);

  // Queries
  const getAllBrands = useCallback(() => {
    return axios.get(`${API_BASE_URL}brands`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }, [token]);

  const { data: Brands } = useQuery({
    queryKey: ["brands"],
    queryFn: getAllBrands,
    select: (res) => res?.data?.data,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const getAllMainCategory = useCallback(() => {
    return axios.get(`${API_BASE_URL}main-categories`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }, [token]);

  const { data: MainCategories } = useQuery({
    queryKey: ["mainCategories"],
    queryFn: getAllMainCategory,
    select: (res) => res?.data?.data,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const getAllSubCategory = useCallback(() => {
    return axios.get(`${API_BASE_URL}sub-categories`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }, [token]);

  const { data: SubCategories } = useQuery({
    queryKey: ["subCategories"],
    queryFn: getAllSubCategory,
    select: (res) => res?.data?.data,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const filteredMainCategories = useMemo(() => {
    return MainCategories || [];
  }, [MainCategories]);

  const filteredSubCategories = useMemo(() => {
    if (!SubCategories || !selectedMainCategory) return [];
    return SubCategories.filter((s) => String(s.main_category_id) === String(selectedMainCategory));
  }, [SubCategories, selectedMainCategory]);

  const formik = useFormik({
    initialValues: {
      brand_id: "",
      main_category_id: "",
      sub_category_id: "",
      name_en: "",
      name_ar: "",
      features: "",
      description_ar: "",
      prices: { A: "", B: "", C: "", D: "" },
      hs_code: "",
      sku: "",
      pack_size: "",
      dimensions: "",
      capacity: "",
      specification: "",
      quantity: "",
      main_colors: [],
      certificate_ids: [],
      legend_ids: [],
      // no file blobs in Formik
    },
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();

        formData.append("brand_id", values.brand_id || "");
        formData.append("main_category_id", values.main_category_id || selectedMainCategory || "");
        formData.append("sub_category_id", values.sub_category_id || "");

        formData.append("name_en", values.name_en || "");
        formData.append("name_ar", values.name_ar || "");
        formData.append("features", values.features || "");
        formData.append("description_ar", values.description_ar || "");

        // Prices
        const priceKeys = ["A", "B", "C", "D"];
        priceKeys.forEach((k) => {
          const v = values.prices?.[k] ?? "";
          formData.append(`prices[${k}]`, v);
        });

        formData.append("hs_code", values.hs_code || "");
        formData.append("sku", values.sku || "");
        formData.append("pack_size", values.pack_size || "");
        formData.append("dimensions", values.dimensions || "");
        formData.append("capacity", values.capacity || "");
        formData.append("specification", values.specification || "");
        formData.append("quantity", values.quantity || "");

        // Arrays of IDs
        (values.certificate_ids || []).forEach((id, idx) => {
          formData.append(`certificate_ids[${idx}]`, id);
        });
        (values.legend_ids || []).forEach((id, idx) => {
          formData.append(`legend_ids[${idx}]`, id);
        });
        (values.main_colors || []).forEach((id, idx) => {
          formData.append(`main_colors[${idx}]`, id);
        });

        // Files from local state
        if (mainImageFile) formData.append("main_image", mainImageFile);
        if (pdfHsFile) formData.append("pdf_hs", pdfHsFile);
        if (pdfMsdsFile) formData.append("pdf_msds", pdfMsdsFile);
        if (pdfTdsFile) formData.append("pdf_tds", pdfTdsFile);

        (galleryFiles || []).forEach((f, idx) => {
          if (f) formData.append(`images[${idx}]`, f);
        });

        (mainColorFiles || []).forEach((f, idx) => {
          if (f) formData.append(`main_color_images[${idx}]`, f);
        });

        await axios.post(`${API_BASE_URL}products/create`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Create Product success");
      } catch (err) {
        toast.error("Error Create Product");
      }
    },
  });

  // Handlers
  const handleBrandChange = useCallback(
    (e) => {
      const val = e.target.value;
      formik.setFieldValue("brand_id", val);
    },
    [formik]
  );

  const handleMainCategoryChange = useCallback(
    (e) => {
      const val = e.target.value;
      setSelectedMainCategory(val);
      formik.setFieldValue("main_category_id", val);
      formik.setFieldValue("sub_category_id", "");
    },
    [formik]
  );

  const handleCertificatesChange = useCallback(
    (ids) => {
      formik.setFieldValue("certificate_ids", ids || []);
    },
    [formik]
  );

  const handleLegendsChange = useCallback(
    (ids) => {
      formik.setFieldValue("legend_ids", ids || []);
    },
    [formik]
  );

  const handleMainColorsChange = useCallback(
    (ids) => {
      formik.setFieldValue("main_colors", ids || []);
    },
    [formik]
  );

  const handleMainImage = useCallback(
    (e) => {
      const file = e.currentTarget.files?.[0];
      if (!file) return;
      setMainImagePreview(URL.createObjectURL(file));
      setMainImageFile(file);
    },
    []
  );

  const handleImageChange = useCallback(
    (index, e) => {
      const file = e.currentTarget.files?.[0];
      setGalleryPreviews((prev) => {
        const next = [...prev];
        next[index] = file ? URL.createObjectURL(file) : null;
        return next;
      });
      setGalleryFiles((prev) => {
        const next = [...prev];
        next[index] = file || null;
        return next;
      });
    },
    []
  );

  const handlePdfHsChange = useCallback((e) => {
    const file = e.currentTarget.files?.[0];
    if (file) setPdfHsFile(file);
  }, []);

  const handlePdfMsdsChange = useCallback((e) => {
    const file = e.currentTarget.files?.[0];
    if (file) setPdfMsdsFile(file);
  }, []);

  const handlePdfTdsChange = useCallback((e) => {
    const file = e.currentTarget.files?.[0];
    if (file) setPdfTdsFile(file);
  }, []);

  return {
    // state
    mainColorsInputRef,
    selectedMainCategory,
    mainImagePreview,
    galleryPreviews,
    mainColorsPreview,
    setMainColorsPreview,

    // queries data and filtered lists
    Brands,
    filteredMainCategories,
    filteredSubCategories,

    // formik
    formik,

    // handlers
    handleBrandChange,
    handleMainCategoryChange,
    handleCertificatesChange,
    handleLegendsChange,
    handleMainColorsChange,
    handleMainImage,
    handleImageChange,
    handlePdfHsChange,
    handlePdfMsdsChange,
    handlePdfTdsChange,

    // allow component to push color files
    setMainColorFiles,
  };
}


