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
import { IoMenu } from "react-icons/io5";
import { CgMenuGridO } from "react-icons/cg";
import { GoHeartFill } from "react-icons/go";
import { BsShare } from "react-icons/bs";
import { t } from "i18next";

export default function Cards({ filteredProducts }) {
  const token = localStorage.getItem("userToken");
  const location = useLocation();
  // eslint-disable-next-line no-unused-vars
  const { selectedBasket, setSelectedBasket, submitMode  , increaseQuantity, decreaseQuantity } =
    useContext(CartContext);
  const [localQuantities, setLocalQuantities] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [products, setProducts] = useState({});
  const [addedByBasket, setAddedByBasket] = useState({});
  const [basketProductIds, setBasketProductIds] = useState([]);
  const onlyBasketProducts = Boolean(location.state?.fromUpdate);
  const basketId = selectedBasket?.id;
  const currentAdded = basketId ? addedByBasket[basketId] || [] : [];

  // wishlist حالة
  const [wishlist, setWishlist] = useState({});

  const toggleWishlist = (id) => {
    setWishlist((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleShare = (e, product) => {
    e.preventDefault();
    if (navigator.share) {
      navigator.share({
        title: product.product_name,
        text: product.specification,
        url: window.location.origin + `/ProductDetails/${product.id}`,
      });
    } else {
      alert("Sharing not supported in this browser.");
    }
  };

  function getAllProducts() {
    return axios.get(`${API_BASE_URL}products`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  function getBasketDetails(id) {
    return axios.get(`${API_BASE_URL}baskets/show/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  const { data, isLoading } = useQuery({
    queryKey: ["AllProducts"],
    queryFn: getAllProducts,
    select: (res) => res.data.data.data,
  });

  // ✅ تحميل تفاصيل السلة وحفظها محلي + API
  useEffect(() => {
    if (!basketId) {
      setBasketProductIds([]);
      return;
    }

    const stored =
      JSON.parse(localStorage.getItem(`addedProducts:${basketId}`)) || [];

    setAddedByBasket((prev) => ({ ...prev, [basketId]: stored }));
    setBasketProductIds(stored.map((m) => m.productId));

    getBasketDetails(basketId)
      .then((res) => {
        const basketProducts = res.data?.data?.data?.basket_products || [];
        const mapped = basketProducts.map((bp) => ({
          productId: bp.product?.id ?? bp.product_id,
          basketProductId: bp.id,
        }));

        const merged = [
          ...mapped,
          ...stored.filter(
            (s) => !mapped.some((m) => m.productId === s.productId)
          ),
        ];

        setAddedByBasket((prev) => ({ ...prev, [basketId]: merged }));
        setBasketProductIds(merged.map((m) => m.productId));

        localStorage.setItem(
          `addedProducts:${basketId}`,
          JSON.stringify(merged)
        );
      })
      .catch(() => {
        setAddedByBasket((prev) => ({ ...prev, [basketId]: stored }));
        setBasketProductIds(stored.map((m) => m.productId));
      });
  }, [basketId]);

  // إضافة منتج
  async function addProductToBasket(productId, quantity) {
    if (!basketId) {
      toast.error("Please Select Basket First!");
      return;
    }

    setAddedByBasket((prev) => {
      const prevList = prev[basketId] || [];
      const updated = [
        ...prevList,
        { productId, basketProductId: `temp_${Date.now()}` },
      ];
      const next = { ...prev, [basketId]: updated };
      localStorage.setItem(`addedProducts:${basketId}`, JSON.stringify(updated));
      return next;
    });

    try {
      const res = await axios.post(
        `${API_BASE_URL}basket-products/create`,
        {
          basket_id: basketId,
          products: [{ product_id: productId, quantity }],
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const basketProduct = res.data.data[0];
      setAddedByBasket((prev) => {
        const prevList = prev[basketId] || [];
        const updated = prevList.map((item) =>
          item.productId === productId && item.basketProductId.startsWith("temp_")
            ? { productId, basketProductId: basketProduct.id }
            : item
        );
        const next = { ...prev, [basketId]: updated };
        localStorage.setItem(`addedProducts:${basketId}`, JSON.stringify(updated));
        return next;
      });
      toast.success("Add Product To Basket Successfully");
    } catch (err) {
      console.error(err);
      setAddedByBasket((prev) => {
        const updated = (prev[basketId] || []).filter(
          (item) => item.productId !== productId
        );
        const next = { ...prev, [basketId]: updated };
        localStorage.setItem(`addedProducts:${basketId}`, JSON.stringify(updated));
        return next;
      });
      toast.error("Error Add Product To Basket");
    }
  }

  // حذف منتج
  const removeProductFromBasket = useCallback(
  async (productId) => {
    if (!basketId) {
      toast.error("Please Select Basket First!");
      return;
    }

    const currentBasketProducts = addedByBasket[basketId] || [];
    const item = currentBasketProducts.find((p) => p.productId === productId);

    if (!item) {
      toast.error("Product not found in this basket!");
      return;
    }

    try {
      // 🔥 استدعاء API الحذف
      await axios.delete(`${API_BASE_URL}basket-products/delete/${item.basketProductId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ تحديث الحالة محليًا بعد نجاح الحذف
      const updatedProducts = currentBasketProducts.filter(
        (p) => p.productId !== productId
      );

      setAddedByBasket((prev) => {
        const next = { ...prev, [basketId]: updatedProducts };
        localStorage.setItem(
          `addedProducts:${basketId}`,
          JSON.stringify(updatedProducts)
        );
        return next;
      });

      setBasketProductIds((prev) => prev.filter((id) => id !== productId));

      toast.success("Product removed from basket!");
    } catch (error) {
      toast.error("Failed to remove product from basket!");
      console.error(error);
    }
  },
  [basketId, addedByBasket, token]
);



  // Quantity Controls
   function handleIncrease(productId) {
    increaseQuantity(productId)
      .then(() => {
        setLocalQuantities((prev) => ({
          ...prev,
          [productId]: (prev[productId] ?? 1) + 1,
        }));
        toast.success("Item quantity updated (+1)");
      })
      .catch(() => {
        toast.error("Error");
      });
  }



  function handleDecrease(productId) {
    decreaseQuantity(productId)
      .then(() => {
        setLocalQuantities((prev) => {
          const current = prev[productId] ?? 1;
          return {
            ...prev,
            [productId]: current > 1 ? current - 1 : 1,
          };
        });
        toast.success("Item quantity updated (-1)");
      })
      .catch(() => {
        toast.error("Error");
      });
  }



  if (isLoading) {
    return (
      <div className="min-h-96 flex items-center justify-center my-12">
        <FaSpinner className="animate-spin text-5xl textColor" />
      </div>
    );
  }


  // Products to show
  let productsToShow = Array.isArray(filteredProducts)
    ? filteredProducts
    : data || [];
  if (onlyBasketProducts && basketProductIds.length > 0) {
    productsToShow = productsToShow.filter((p) =>
      basketProductIds.includes(p.id)
    );
  }

  if (submitMode && basketId) {
    productsToShow = productsToShow.filter((p) =>
      currentAdded.some((added) => added.productId === p.id)
    );
  }

  return (
    <section>
      <div className="grid grid-cols-4 mt-8 w-[90%] mx-auto gap-6">
        {productsToShow?.length > 0 ? (
          productsToShow.map((product) => {
            const isAdded = currentAdded.some(
              (p) => p.productId === product.id
            );
            return (
              <NavLink key={product.id} to={`/ProductDetails/${product.id}`}>
                <div className="shadow-lg bg-white rounded-xl hover:shadow-2xl duration-300 transition-all h-full flex flex-col relative">
                  <div className="absolute top-2 right-2 flex gap-3">
                    <button onClick={(e) => handleShare(e, product)}>
                      <BsShare className="text-lg text-gray-600 cursor-pointer hover:text-[#11ADD1]" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product.id);
                      }}
                    >
                      <GoHeartFill
                        className={`text-lg cursor-pointer ${
                          wishlist[product.id]
                            ? "text-red-500"
                            : "text-gray-400"
                        }`}
                      />
                    </button>
                  </div>

                  <span>
                    <img
                      src={product.image_url || defultProductImage}
                      alt="Product Image"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </span>
                  <div className="px-5 pb-5 ">
                    <p className="text-[#11ADD1] my-2 text-sm text-left font-semibold flex-grow">
                      {product.specification}
                    </p>
                    <h5 className="text-md font-semibold tracking-tight textColor h-[50px]">
                      {(product?.name_en || "")
                        .split(" ")
                        .slice(0, 4)
                        .join(" ")}
                    </h5>

                    {/* Add To Cart & Update Count */}
                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          const count = products?.[product.id] ?? 1;
                          if (!isAdded) {
                            addProductToBasket(product.id, count);
                          } else {
                            e.preventDefault();
                            removeProductFromBasket(product.id);
                          }
                        }}
                        className={`${
                          isAdded
                            ? "text-white border textColor"
                            : "backGroundColor hover:bg-blue-600 text-white"
                        } relative bottom-0 w-full flex items-center py-2 justify-center rounded-lg font-medium px-1`}
                      >
                        <IoCartOutline className="text-lg" />
                        {isAdded ? t("Basket.Selected") : t("Add To Basket")}
                      </button>

                      <div className="py-1 flex items-center justify-center">
                        <button
                          onClick={(e) => {handleDecrease(product.id) , e.preventDefault()}}
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

                        <span className="textColor">
                          {localQuantities[product.id] ?? product.quantity ?? 1}
                        </span>

                         <button
                          onClick={(e) =>{ handleIncrease(product.id) , e.preventDefault() }}
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
          <p className="text-gray-500 col-span-4 text-center">
            No products found
          </p>
        )}
      </div>
    </section>
  );
}
