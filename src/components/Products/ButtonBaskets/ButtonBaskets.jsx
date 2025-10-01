import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import * as Switch from "@radix-ui/react-switch";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { CartContext } from "../../../Context/CartContext";
import toast from "react-hot-toast";

export default function ButtonBaskets() {
  let token = localStorage.getItem("userToken");

  // Use Cart Context
  let { selectedBasket, setSelectedBasket } = useContext(CartContext);

  // Get All Baskets
  function getAllBaskets() {
    return axios.get(`${API_BASE_URL}baskets`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  let { data: Baskets, isLoading } = useQuery({
    queryKey: ["baskets", !!token],
    queryFn: getAllBaskets,
    select: (data) => data.data.data,
  });

  function handleChange(e) {
    const id = Number(e.target.value);
    if (!id) {
      setSelectedBasket(null);
    }
    const basket = Baskets.find((basket) => basket.id === id);

    if (basket) {
      setSelectedBasket({ id: basket.id, name: basket.name });
      toast.success(`Select ${basket.name}`);
    }
  }

  return (
    <div className="bg-white me-6 p-1 px-4 mt-2 rounded-md textColor">
      <select
        name="baskets"
        id="baskets"
        className="text-center max-h-[50px] overflow-y-auto cursor-pointer"
        value={selectedBasket?.id ?? ""}
        onChange={handleChange}
        disabled={isLoading}
      >
        <option value="">Baskets</option>
        {Baskets &&
          Baskets.map((basket) => (
            <option
              className="focus:outline-none border-none"
              key={basket.id}
              value={basket.id}
            >
              {basket.name}
            </option>
          ))}
      </select>
    </div>
  );
}
