import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../../../../Context/CartContext";


export default function UpdateBasket() {
  const navigate = useNavigate();
  const { selectedBasket } = useContext(CartContext);

  const handleUpdateClick = () => {
    if (selectedBasket && selectedBasket.id) {
      navigate("/Products", {
        state: {
          basketId: selectedBasket.id,
          basketName: selectedBasket.name,
          fromUpdate: true,
        },
      });
    } else {
      navigate("/Products");
    }
  };

  return (
    <button
      className="backGroundColor text-white! gap-2 textColor rounded-lg px-4 py-1 me-2 cursor-pointer hover:bg-white! hover:text-[#1243AF]!  duration-300 transition-all"
      onClick={handleUpdateClick}
    >
      Update
    </button>
  );
}
