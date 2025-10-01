import React from "react";
const Navbar = React.lazy(() => import("../Navbar/Navbar"));
const Footer = React.lazy(() => import("../Footer/Footer"));
import bucket from "../../assets/Photos/bucket.jpg";
import trust from "../../assets/Photos/trust.png";
import { FaArrowDownLong } from "react-icons/fa6";
import { FaArrowLeft } from "react-icons/fa";
import { NavLink } from "react-router-dom";

export default function Trust() {
  return (
    <>
      <Navbar />

      <section>
        {/*BackGround */}
        <div
          className="md:w-[90%] mt-6 mx-auto h-[250px] bg-center bg-cover rounded-2xl bg-no-repeat"
          style={{ backgroundImage: `url(${bucket})` }}
        >
          <div className="text-center flex justify-center pt-15">
            <img src={trust} alt="trust" loading="lazy" className="w-[10%]" />
          </div>
          <div className="w-[80%] mx-auto flex justify-between mt-4 gap-2">
            <div className="mt-4 text-white">
              <button className="bg-[#CB0022] cursor-pointer flex items-center uppercase font-bold rounded-xl p-2 px-6 hover:bg-red-800 duration-300 transition-all">
                download catalog <FaArrowDownLong className="ms-1" />
              </button>
            </div>
            <p className="w-[50%] text-white text-center me-20 font-bold">
              ندعم أعمال عملائنا بمجموعة واسعة من أدوات التنظيف الذاتية المندرجة
              تحت العلامة التجارية "trust" لتلبية احتياجاتهم اليومي والتي تساهم
              في عملية التنظيف والوصول الى أضيق الأماكن لإزالة الضرر من الأوساخ
              وللحفاظ على بيئة نظيفة وأمنة.
            </p>
          </div>
        </div>

        {/*Cards */}

        {/*Buttom Product  */}
        <NavLink to={"/Brands"}>
          <button className="py-2 border-b-1 border-[#CB0022]  font-bold ms-20 my-4 cursor-pointer flex items-center text-[#CB0022] hover:scale-90 duration-500 transition-all">
            <FaArrowLeft className="me-2" /> Bact To Brands
          </button>
        </NavLink>

        {/* Products */}
      </section>

      <Footer />
    </>
  );
}
