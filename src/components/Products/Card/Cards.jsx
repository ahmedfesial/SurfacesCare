/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect, useCallback } from "react";
import { IoCartOutline } from "react-icons/io5";
import { NavLink, useLocation } from "react-router-dom";
import defultProductImage from "../../../assets/Photos/defultProductImage.jpg";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "../../../../config";
import { FaSpinner } from "react-icons/fa";
import { CartContext } from "../../../Context/CartContext";
import toast from "react-hot-toast";
import { BsShare } from "react-icons/bs";
import { GoHeartFill } from "react-icons/go";
import { t } from "i18next";

export default function Cards({ filteredProducts }) {
  const token = localStorage.getItem("userToken");
  const location = useLocation();
  const { selectedBasket } = useContext(CartContext);

  const [localQuantities, setLocalQuantities] = useState({});
  const [basketProducts, setBasketProducts] = useState([]); // المنتجات داخل السلة
  const [wishlist, setWishlist] = useState({});
  const basketId = selectedBasket?.id;
  const fromUpdate = location.state?.fromUpdate || false;

  // 📦 تحميل كل المنتجات
  const { data: allProducts, isLoading } = useQuery({
    queryKey: ["AllProducts"],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data.data;
    },
  });

  // 🛒 تحميل المنتجات داخل السلة عند التحديث
  useEffect(() => {
    if (!basketId || !fromUpdate) return;

    axios
      .get(`${API_BASE_URL}baskets/show/${basketId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const basketProds = res.data?.data?.data?.basket_products || [];
        const mapped = basketProds.map((bp) => ({
          productId: bp.product?.id ?? bp.product_id,
          quantity: bp.quantity,
          basketProductId: bp.id,
        }));

        setBasketProducts(mapped);

        // ضبط الكميات المحلية حسب اللي في السلة
        const initialQuantities = {};
        mapped.forEach((p) => {
          initialQuantities[p.productId] = p.quantity;
        });
        setLocalQuantities(initialQuantities);
      })
      .catch((err) => console.error("Error loading basket details", err));
  }, [basketId, fromUpdate]);

  // ❤️ المفضلة
  const toggleWishlist = (id) => {
    setWishlist((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // 📩 إضافة منتج جديد للسلة
  async function addProductToBasket(productId, quantity) {
    if (!basketId) return toast.error("Please select basket first!");
    if (quantity <= 0) return toast.error("Please select quantity before adding!");

    try {
      await axios.post(
        `${API_BASE_URL}basket-products/create`,
        {
          basket_id: basketId,
          products: [{ product_id: productId, quantity }],
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBasketProducts((prev) => [
        ...prev,
        { productId, quantity, basketProductId: `temp_${Date.now()}` },
      ]);

      toast.success("Product added successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Error adding product!");
    }
  }

  // 🔁 تحديث كمية منتج موجود في السلة
  async function updateBasketProduct(productId, newQuantity) {
    const existing = basketProducts.find((p) => p.productId === productId);
    if (!existing) return addProductToBasket(productId, newQuantity);

    try {
      await axios.patch(
        `${API_BASE_URL}basket-products/update/${existing.basketProductId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBasketProducts((prev) =>
        prev.map((p) =>
          p.productId === productId ? { ...p, quantity: newQuantity } : p
        )
      );

      toast.success("Quantity updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update quantity!");
    }
  }

  // ❌ حذف منتج من السلة
  async function removeProductFromBasket(productId) {
    const existing = basketProducts.find((p) => p.productId === productId);
    if (!existing) return toast.error("Product not found!");

    try {
      await axios.delete(
        `${API_BASE_URL}basket-products/delete/${existing.basketProductId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBasketProducts((prev) => prev.filter((p) => p.productId !== productId));
      toast.success("Product removed!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove product!");
    }
  }

  // ➕➖ التحكم في الكمية محليًا
  function handleIncrease(productId) {
    const newQty = (localQuantities[productId] ?? 0) + 1;
    setLocalQuantities((prev) => ({ ...prev, [productId]: newQty }));

    if (basketProducts.some((p) => p.productId === productId)) {
      updateBasketProduct(productId, newQty);
    }
  }

  function handleDecrease(productId) {
    const current = localQuantities[productId] ?? 0;
    const newQty = current > 0 ? current - 1 : 0;
    setLocalQuantities((prev) => ({ ...prev, [productId]: newQty }));

    if (newQty === 0 && basketProducts.some((p) => p.productId === productId)) {
      removeProductFromBasket(productId);
    } else if (basketProducts.some((p) => p.productId === productId)) {
      updateBasketProduct(productId, newQty);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-96 flex items-center justify-center my-12">
        <FaSpinner className="animate-spin text-5xl textColor" />
      </div>
    );
  }

  // 🔍 المنتجات النهائية المعروضة
  const all = Array.isArray(filteredProducts) ? filteredProducts : allProducts || [];

  return (
    <section>
      <div className="grid grid-cols-4 mt-8 w-[90%] mx-auto gap-6">
        {all?.length > 0 ? (
          all.map((product) => {
            const isAdded = basketProducts.some((p) => p.productId === product.id);
            const quantity = localQuantities[product.id] ?? 0;

            return (
              <NavLink key={product.id} to={`/ProductDetails/${product.id}`}>
                <div className="shadow-lg bg-white rounded-xl hover:shadow-2xl duration-300 transition-all h-full flex flex-col relative">
                  <div className="absolute top-2 right-2 flex gap-3">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product.id);
                      }}
                    >
                      <GoHeartFill
                        className={`text-lg cursor-pointer ${
                          wishlist[product.id] ? "text-red-500" : "text-gray-400"
                        }`}
                      />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        navigator.share?.({
                          title: product.name_en,
                          text: product.specification,
                          url: window.location.origin + `/ProductDetails/${product.id}`,
                        });
                      }}
                    >
                      <BsShare className="text-lg text-gray-600 cursor-pointer hover:text-[#11ADD1]" />
                    </button>
                  </div>

                  <img
                    src={product.image_url || defultProductImage}
                    alt="Product"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  <div className="px-5 pb-5">
                    <p className="text-[#11ADD1] my-2 text-sm text-left font-semibold flex-grow">
                      {product.specification}
                    </p>
                    <h5 className="text-md font-semibold tracking-tight textColor h-[50px]">
                      {(product?.name_en || "").split(" ").slice(0, 4).join(" ")}
                    </h5>

                    {/* زر السلة + التحكم بالكمية */}
                    <div className="flex items-center justify-between gap-2">
                      <button
                        disabled={quantity === 0}
                        onClick={(e) => {
                          e.preventDefault();
                          if (!isAdded) {
                            addProductToBasket(product.id, quantity);
                          } else {
                            removeProductFromBasket(product.id);
                          }
                        }}
                        className={`${
                          isAdded
                            ? "text-white border textColor"
                            : quantity === 0
                            ? "bg-gray-300 text-white cursor-not-allowed"
                            : "backGroundColor hover:bg-blue-600 text-white"
                        } w-full flex items-center py-2 justify-center rounded-lg font-medium px-1`}
                      >
                        <IoCartOutline className="text-lg" />
                        {isAdded ? t("Basket.Selected") : t("Add To Basket")}
                      </button>

                      <div className="py-1 flex items-center justify-center">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleDecrease(product.id);
                          }}
                          className="backGroundColor mb-1 cursor-pointer text-white inline-flex items-center justify-center me-2 text-sm font-medium h-6 py-4 w-6 rounded-lg hover:scale-110 transition-all duration-300"
                        >
                          <svg
                            className="w-3 h-3 font-bold"
                            aria-hidden="true"
                            fill="none"
                            viewBox="0 0 18 2"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          >
                            <path d="M1 1h16" />
                          </svg>
                        </button>

                        <span className="textColor">{quantity}</span>

                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleIncrease(product.id);
                          }}
                          className="backGroundColor mb-1 cursor-pointer text-white inline-flex items-center justify-center ms-2 text-sm font-medium h-6 py-4 w-6 rounded-lg hover:scale-110 transition-all duration-300"
                        >
                          <svg
                            className="w-3 h-3"
                            aria-hidden="true"
                            fill="none"
                            viewBox="0 0 18 18"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M9 1v16M1 9h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </NavLink>
            );
          })
        ) : (
          <p className="text-gray-500 col-span-4 text-center">No products found</p>
        )}
      </div>
    </section>
  );
}
