import React, { useState, useEffect, useContext } from "react";
import defultProductImage from "../../../assets/Photos/defultProductImage.jpg";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FaBarcode } from "react-icons/fa";
import { HiOutlineSquaresPlus } from "react-icons/hi2";
import { FaBox } from "react-icons/fa";
import { FaRulerCombined } from "react-icons/fa";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { FaVectorSquare } from "react-icons/fa6";
import { FaSpinner } from "react-icons/fa";
import { API_BASE_URL } from "../../../../config";
import { CartContext } from "../../../Context/CartContext";
import toast from "react-hot-toast";
const ProductNavbar = React.lazy(()=> import('../ProductsNavbar/ProductsNavbar'))
const Dashboard = React.lazy(()=>import('../../Dashboard/Dashboard'))



export default function ProductDetails() {
  let guest_token = localStorage.getItem("guest_token");
  if (!guest_token) {
    guest_token = crypto.randomUUID();
    localStorage.setItem("guest_token", guest_token);
  }


  let { id } = useParams();

  let token = localStorage.getItem("userToken");

  // Cart / Basket state (copied/adapted from Cards.jsx)
  const { selectedBasket } = useContext(CartContext);
  const basketId = selectedBasket?.id;
  const [products, setProducts] = useState({});
  const [addedByBasket, setAddedByBasket] = useState({});
  const currentAdded = basketId ? addedByBasket[basketId] || [] : [];

  useEffect(() => {
    if (!basketId) return;
    const stored =
      JSON.parse(localStorage.getItem(`addedProducts:${basketId}`)) || [];
    setAddedByBasket((prev) => ({ ...prev, [basketId]: stored }));
  }, [basketId]);

  // ------------------ Basket Functions ------------------
  function addProductToBasket(productId, quantity) {
    if (!basketId) {
      toast.error("Please select a basket first!");
      return;
    }
    axios
      .post(
        `${API_BASE_URL}basket-products/create`,
        {
          basket_id: basketId,
          products: [{ product_id: productId, quantity }],
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        const basketProduct = res.data.data[0];
        setAddedByBasket((prev) => {
          const prevList = prev[basketId] || [];
          const updated = [
            ...prevList,
            { productId, basketProductId: basketProduct.id },
          ];
          localStorage.setItem(
            `addedProducts:${basketId}`,
            JSON.stringify(updated)
          );
          return { ...prev, [basketId]: updated };
        });
        toast.success("Product added to basket successfully!");
      })
      .catch(() => toast.error("Failed to add product to basket."));
  }

  function removeProductFromBasket(productId) {
    const item = (addedByBasket[basketId] || []).find(
      (p) => p.productId === productId
    );
    if (!item) return;

    axios
      .delete(`${API_BASE_URL}basket-products/delete/${item.basketProductId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setAddedByBasket((prev) => {
          const updated = prev[basketId].filter(
            (p) => p.productId !== productId
          );
          localStorage.setItem(
            `addedProducts:${basketId}`,
            JSON.stringify(updated)
          );
          return { ...prev, [basketId]: updated };
        });
        toast.success("Product removed from basket!");
      })
      .catch(() => toast.error("Failed to remove product"));
  }

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

  // get product details
  function getProductDetails() {
    return axios.get(`${API_BASE_URL}products/show/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  let { data, isLoading, isError, error } = useQuery({
    queryKey: ["productDetails", id],
    queryFn: getProductDetails,
    select: (data) => data.data.data,
  });

  
  

  // Is Loading
  if (isLoading) {
    return (
      <div className="min-h-96 flex items-center justify-center my-12">
        <FaSpinner className="animate-spin text-5xl textColor" />
      </div>
    );
  }

  // Hnadle Error

  if (isError) {
    return (
      <div>
        <h1 className="text-center font-bold">{error}</h1>
      </div>
    );
  }

  return (
    <section>
      <div className="grid grid-cols-[320px_1fr] me-4">
        {/*Slilde bar */}
        <div className="mb-14 me-8">
          <Dashboard />
        </div>

        {/*Navbar */}
        <div>
            <ProductNavbar/>

          {/* Content */}
          <div className="my-12 md:my-66">
            {/*Main div*/}
            <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start gap-8 lg:gap-16 w-[90%] mx-auto">
              {/* Slider image */}
              <div className="w-full  lg:w-[600px] flex flex-col justify-between xl:h-[700px]">
                <div>
                 {/* Main Image */}
                  <div className="w-[400px] h-[400px]">
                    <img
                      src={data?.main_image || defultProductImage}
                      alt="Product Image"
                      className="w-full rounded-lg shadow-lg aspect-square object-cover"
                    />
                  </div>

                  {/*Main Imgaes */}
                  <div className="w-full flex justify-between mt-6 ">
                    {data?.images?.map((image, i) => {
                      // support different shapes: string URL, { image: url }, { url: url }, { path: url }
                      const getImageUrl = (img) => {
                        if (!img) return null;
                        if (typeof img === "string") return img;
                        if (typeof img === "object") {
                          return img.image || img.url || img.path || img.src || null;
                        }
                        return null;
                      };

                      const imgSrc = getImageUrl(image);

                      return (
                        <div key={i} className="w-24 h-24 object-cover rounded shadow">
                          <img
                            src={imgSrc || defultProductImage}
                            alt={`Product Image ${i}`}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div>
                    {/* Buttons */}
                      <div className="flex items-center justify-between gap-2 mt-4">
                        {/* Basket action buttons: use data.id */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            const count = products?.[data?.id] ?? 1;
                            const isAdded = currentAdded.some(
                              (p) => p.productId === data?.id
                            );
                            if (!isAdded) addProductToBasket(data?.id, count);
                            else removeProductFromBasket(data?.id);
                          }}
                          className={`${
                            currentAdded.some((p) => p.productId === data?.id)
                              ? "textColor border bg-gray-200"
                              : "backGroundColor text-white"
                          } border cursor-pointer duration-300 transition-all w-full flex items-center py-2 justify-center rounded-lg text-sm`}
                        >
                          {currentAdded.some((p) => p.productId === data?.id)
                            ? "Selected"
                            : "Add to cart"}
                        </button>

                        <div className="flex items-center justify-center">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              decreaseProductQuantity(data?.id);
                            }}
                            className="backGroundColor cursor-pointer text-white inline-flex items-center justify-center text-sm font-medium h-9 w-9 rounded-md hover:scale-110 transition-all duration-300"
                          >
                            -
                          </button>
                          <span className="textColor text-xl mx-2">
                            {products?.[data?.id] ?? 1}
                          </span>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              increaseProductQuantity(data?.id);
                            }}
                            className="backGroundColor cursor-pointer text-white inline-flex items-center justify-center text-sm font-medium h-9 w-9 rounded-md hover:scale-110 transition-all duration-300"
                          >
                            +
                          </button>
                        </div>
                      </div>
                  </div>

                </div>
                
              </div>

              {/*Details */}
              <div className="w-full lg:w-[500px] bg-[#ffffff] rounded-md  p-8 shadow">
                <div className="w-full mx-auto">
                  <h1
                    lang="en"
                    className="text-3xl textColor md:text-3xl font-bold text-center lg:text-left"
                  >
                    {data?.name_en}
                  </h1>
                  <h1 className="font-semibold textColor mt-8 text-center lg:text-left">
                    Product Features:
                  </h1>
                  <p className="border-b-1 pb-4 text-center lg:text-left">
                    {data?.features}
                  </p>

                  {/* Legend & Color & Cerfication */}
                  <div className="flex flex-wrap justify-center sm:justify-between mt-4 textColor font-semibold gap-4">
                    {/* Certificates */}
                    <div>
                      <h1 className="flex items-center gap-2">Certificates:</h1>
                      <div className="flex gap-2 mt-2">
                        {data?.certificates?.map((certificates) => (
                          <div key={certificates.id}>
                            {certificates?.image ? (
                              <>
                                <div className="w-6 h-6">
                                  <img
                                    src={certificates.image}
                                    className="w-full"
                                    alt={certificates.name}
                                  />
                                </div>
                              </>
                            ) : (
                              <span className="textColor">
                                {certificates.name}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Legend */}
                    <div>
                      <h1 className="flex items-center gap-2">Legends:</h1>
                      <div className="flex gap-2 mt-2">
                        {data?.legends?.map((legend) => (
                          <div key={legend.id}>
                            {legend?.image ? (
                              <>
                                <div className="w-6 h-6">
                                  <img src={legend.image} alt={legend.name} />
                                </div>
                              </>
                            ) : (
                              <span className="textColor">{legend.name}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h1 className="flex items-center gap-2">Color:</h1>
                      <div className="flex gap-2 mt-2">
                        {data?.main_colors?.map((color, i) => (
                          <div
                            key={i}
                            className="h-6 w-6 rounded-md"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* PDFS */}
                  <div className="my-8">
                    <button
                      onClick={() => window.open(data?.pdf_hs, "_blank")}
                      className="backGroundColor text-white w-full py-2 rounded-full flex items-center justify-center gap-2 cursor-pointer hover:bg-white   font-semibold transition-all duration-300"
                    >
                      PIS
                    </button>
                    <button
                      onClick={() => window.open(data?.pdf_msds, "_blank")}
                      className="backGroundColor text-white w-full py-2 rounded-full flex items-center justify-center gap-2 my-4 cursor-pointer hover:bg-white font-semibold transition-all duration-300"
                    >
                      MSDS
                    </button>
                    <button
                      onClick={() => window.open(data?.pdf_technical, "_blank")}
                      className="backGroundColor text-white w-full py-2 rounded-full flex items-center justify-center gap-2 cursor-pointer hover:bg-white  font-semibold transition-all duration-300"
                    >
                      Technical Data Sheet
                    </button>
                  </div>

                  {/*Table */}
                  <div className="space-y-1">
                    {/* Code */}
                    <div className="border text-left w-full textColor mx-auto p-2 grid grid-cols-[auto_1fr] items-center gap-4">
                      <p className="flex items-center gap-2 font-bold">
                        <FaBarcode className="text-2xl" />
                        <span>HS Code:</span>
                      </p>
                      <p className="text-right">{data?.hs_code}</p>
                    </div>

                    {/* SKU */}
                    <div className="border text-left w-full textColor mx-auto p-2 grid grid-cols-[auto_1fr] items-center gap-4">
                      <p className="flex items-center gap-2 font-bold">
                        <HiOutlineSquaresPlus className="text-2xl" />
                        <span>SKU:</span>
                      </p>
                      <p className="text-right">{data?.sku}</p>
                    </div>

                    {/* Pick size */}
                    <div className="border text-left w-full textColor mx-auto p-2 grid grid-cols-[auto_1fr] items-center gap-4">
                      <p className="flex items-center gap-2 font-bold">
                        <FaBox className="text-2xl" />
                        <span>Pack Size:</span>
                      </p>
                      <p className="text-right">{data?.pack_size}</p>
                    </div>

                    {/*Dimensions*/}
                    <div className="border text-left w-full textColor mx-auto p-2 grid grid-cols-[auto_1fr] items-center gap-4">
                      <p className="flex items-center gap-2 font-bold">
                        <FaRulerCombined className="text-2xl" />
                        <span>Dimensions:</span>
                      </p>
                      <p className="text-right">{data?.dimensions}</p>
                    </div>

                    {/* Capacity: */}
                    <div className="border text-left w-full textColor mx-auto p-2 grid grid-cols-[auto_1fr] items-center gap-4">
                      <p className="flex items-center gap-2 font-bold">
                        <AiOutlineUnorderedList className="text-2xl" />
                        <span>Capacity:</span>
                      </p>
                      <p className="text-right">{data?.capacity}</p>
                    </div>

                    {/*Specification */}
                    <div className="border text-left w-full textColor mx-auto p-2 grid grid-cols-[auto_1fr] items-center gap-4">
                      <p className="flex items-center gap-2 font-bold">
                        <FaVectorSquare className="text-2xl" />
                        <span>Specification:</span>
                      </p>
                      <p className="text-right">{data?.specification}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
