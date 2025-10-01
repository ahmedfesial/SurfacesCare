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

export default function Cards({ filteredProducts }) {


  const token = localStorage.getItem("userToken");
  const location = useLocation();
  const { selectedBasket, setSelectedBasket, submitMode } =
    useContext(CartContext);

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

  function getAllBaskets() {
    return axios.get(`${API_BASE_URL}baskets`, {
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

  const { data: basketsData } = useQuery({
    queryKey: ["baskets", !!token],
    queryFn: getAllBaskets,
    select: (res) => res.data.data,
  });

  // لما يدخل من صفحة تانية ويكون باعت basketId أو basketName
  useEffect(() => {
    if (location.state?.basketId && basketsData) {
      const found = basketsData.find((b) => b.id === location.state.basketId);
      if (found) setSelectedBasket({ id: found.id, name: found.name });
    } else if (location.state?.basketName && basketsData) {
      const foundByName = basketsData.find(
        (b) => b.name === location.state.basketName
      );
      if (foundByName)
        setSelectedBasket({ id: foundByName.id, name: foundByName.name });
    }
  }, [location.state, basketsData]);

  // تحميل تفاصيل السلة
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
      toast.error("Error Add Product To Basket Successfully");
    }
  }

  // حذف منتج
  const removeProductFromBasket = useCallback(async (productId) => {
    if (!basketId) {
      toast.error("Please Select Basket First!");
      return;
    }

    const currentBasketProducts = addedByBasket[basketId] || [];
    const item = currentBasketProducts.find((p) => p.productId === productId);
    
   

    // تحديث الحالة المحلية فوراً
    const updatedProducts = currentBasketProducts.filter((p) => p.productId !== productId);
    
    setAddedByBasket((prev) => {
      const next = { ...prev, [basketId]: updatedProducts };
      localStorage.setItem(`addedProducts:${basketId}`, JSON.stringify(updatedProducts));
      return next;
    });
    
    setBasketProductIds(updatedProducts.map((m) => m.productId));

    // إذا كان المنتج مؤقت، لا نحتاج لحذفه من API
    if (item.basketProductId.startsWith("temp_")) {
      toast.success("Delete Product from Basket");
      return;
    }

    // حذف من API
    try {
      await axios.delete(
        `${API_BASE_URL}basket-products/delete/${item.basketProductId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Delete Product from Basket");
    } catch {
      // في حالة فشل API، نعيد المنتج للحالة المحلية
      setAddedByBasket((prev) => {
        const restored = [...(prev[basketId] || []), item];
        const next = { ...prev, [basketId]: restored };
        localStorage.setItem(`addedProducts:${basketId}`, JSON.stringify(restored));
        return next;
      });
      setBasketProductIds([...updatedProducts.map((m) => m.productId), productId]);
      toast.error("Error Add Basket");
    }
  }, [basketId, addedByBasket, token]);

  // Quantity Controls
  function increaseProductQuantity(productId) {
    setProducts((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 1) + 1,
    }));
  }
  function decreaseProductQuantity(productId) {
    setProducts((prev) => ({
      ...prev,
      [productId]: prev[productId] > 1 ? prev[productId] - 1 : 1,
    }));
  }

  if (isLoading) {
    return (
      <div className="min-h-96 flex items-center justify-center my-12">
        <FaSpinner className="animate-spin text-5xl textColor" />
      </div>
    );
  }

  // Select All Products
  async function toggleSelectAll() {
    if (!basketId) {
      toast.error("Please Select Basket First");
      return;
    }

    const allSelected = productsToShow.every((product) =>
      currentAdded.some((p) => p.productId === product.id)
    );

    if (allSelected) {
      for (let product of productsToShow) {
        await removeProductFromBasket(product.id);
      }
      toast.success("All products removed from basket");
    } else {
      for (let product of productsToShow) {
        const count = products?.[product.id] ?? 1;
        await addProductToBasket(product.id, count);
      }
      toast.success("All products added to basket");
    }
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
      <div className="w-[80%] flex justify-end items-center gap-8 ms-8">
        <p
          onClick={toggleSelectAll}
          className="backGroundColor flex items-center gap-2 px-4 py-1 text-white rounded-lg text-sm cursor-pointer"
        >
          <IoCartOutline className="text-xl" />
          {productsToShow.every((p) =>
            currentAdded.some((c) => c.productId === p.id)
          )
            ? "Unselect all"
            : "Select all"}
        </p>
        <p className="text-gray-500">Count : {productsToShow?.length}</p>
       
        <div className="flex items-center gap-2 ">
          <IoMenu className="text-2xl  cursor-pointer text-[#1243AF90]" />
          <CgMenuGridO className="text-2xl  cursor-pointer text-[#1243AF]" />
        </div>
      </div>

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
      removeProductFromBasket(product.id); // ✅ هنا بتستدعي API delete
    }
  }}
  className={`${
    isAdded
      ? " text-white  border textColor cursor-pointer duration-300 transition-all"
      : "backGroundColor hover:bg-blue-600 text-white  cursor-pointer duration-300 transition-all"
  } relative bottom-0 w-full flex items-center py-2 gap-2 justify-center rounded-lg font-medium`}
>
  <IoCartOutline className="text-lg" />
  {isAdded ? "Selected" : "Add to cart"}
</button>


                      <div className="py-1 flex items-center justify-center">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            decreaseProductQuantity(product.id);
                          }}
                          className="backGroundColor mb-1 cursor-pointer text-white inline-flex items-center justify-center me-2 text-sm font-medium h-8 py-4 w-8 rounded-lg hover:scale-110 transition-all duration-300"
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
                          {products?.[product.id] ?? 1}
                        </span>

                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            increaseProductQuantity(product.id);
                          }}
                          className="backGroundColor mb-1 cursor-pointer text-white inline-flex items-center justify-center ms-2 text-sm font-medium h-8 py-4 w-8 rounded-lg hover:scale-110 transition-all duration-300"
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
