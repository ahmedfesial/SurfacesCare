import { createContext, useEffect, useState } from "react";
import Cart from "./../components/Cart/Cart";
import axios from "axios";
import { API_BASE_URL } from "../../config";

// eslint-disable-next-line react-refresh/only-export-components
export let CartContext = createContext();

export default function CartProvider(props) {
  const [cart, setCart] = useState(null);

  const [withPrice, setWithPrice] = useState(false); // Show & hide with price

  const [searchTerm, setSearchTerm] = useState(""); //Search Bar

  // Submit Mode for Baskets

  // get token
  let token = localStorage.getItem("userToken");

  //Baskets
  const [selectedBasket, setSelectedBasket] = useState(() => {
    let basket = localStorage.getItem("selectedBasket");
    return basket ? JSON.parse(basket) : null;
  });

  useEffect(() => {
    if (selectedBasket) {
      localStorage.setItem("selectedBasket", JSON.stringify(selectedBasket));
    }
  }, [selectedBasket]);

  //add to cart
  function addToCart(productId) {
    return axios
      .put(
        `${API_BASE_URL}products/update`,
        { id: productId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => response)
      .catch((error) => error);
  }

  //Quantity increase
  function increaseQuantity(productId) {
    return axios
      .patch(
        `${API_BASE_URL}products/${productId}/update-quantity`,
        { action: "increase", amount: 1 }, //
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => response.data)
      .catch((error) => error.response);
  }

  //Quantity decrease
  function decreaseQuantity(productId) {
    return axios
      .patch(
        `${API_BASE_URL}products/${productId}/update-quantity`,
        { action: "decrease", amount: 1 }, //
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => response.data)
      .catch((error) => error.response);
  }

  // Remove Product
  function removeProduct(productId) {
    return axios
      .delete(`${API_BASE_URL}products/delete/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => response)
      .catch((error) => error);
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeProduct,
        selectedBasket,
        setSelectedBasket,
        withPrice,
        setWithPrice,
        searchTerm,
        setSearchTerm,
      }}
    >
      {props.children}
    </CartContext.Provider>
  );
}
