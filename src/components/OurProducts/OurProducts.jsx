import React from "react";
const Navbar = React.lazy(() => import("../Navbar/Navbar"));
const Footer = React.lazy(() => import("../Footer/Footer"));
const AllBrandsMain = React.lazy(() => import("./AllBrandsMain/AllBrandsMain"));
import backGround from "../../assets/Photos/NewBackGround.jpeg";
import tissue from "../../assets/Photos/tissue-bg.jpg";
import Asset from "../../assets/Photos/Asset.png";
import bucket from "../../assets/Photos/BackGroundTrust.jpeg";
import trust from "../../assets/Photos/trust.png";
import background2 from "../../assets/Photos/background2.png";
import { LuBox } from "react-icons/lu";
import { FaArrowDownLong } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";

export default function OurProducts() {
  return (
    <>
      <Navbar />
      {/*Header */}
      <section>
        <div
          className="h-[250px] md:h-[400px] bg-cover rou bg-no-repeat bg-center"
          style={{
            backgroundImage: `linear-gradient( #1243AF99) , url(${background2})`,
          }}
        ></div>
        <div className="relative">
          <Link to={"/Cart"}>
            <div className="absolute w-[80px] h-[80px] md:w-[100px] md:h-[100px] flex justify-center items-center translate-y-[-50%] rounded-xl right-4 md:right-18 backGroundColor text-white">
              <FiShoppingBag className="text-4xl md:text-5xl" />
            </div>
          </Link>
        </div>
      </section>

      {/*Our Products */}
      <section>
        <div
          className=" w-[90%] md:w-[80%] lg:w-[70%] bg-cover object-center rounded-3xl translate-y-[-25%] sm:translate-y-[-20%] md:translate-y-[-30%] lg:translate-y-[-50%] mx-auto"
          style={{ backgroundImage: `url(${backGround})` }}
        >
          {/*main Desc  */}
          <div className="p-6 md:p-8 w-full mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 rounded-xl">
            {/* Brands */}
            <div className="flex justify-center gap-4 order-2 lg:order-1 mt-8 lg:mt-0">
              {/* Tissue */}
              <div
                className="h-[320px] w-[150px] sm:h-[370px] sm:w-[120px] rounded-xl bg-no-repeat bg-cover bg-top p-2 flex flex-col justify-end"
                style={{
                  backgroundImage: `linear-gradient(#ffffff20 , #1294CC90) , url(${tissue})`,
                }}
              >
                <img
                  src={Asset}
                  alt="Qtissue"
                  className="w-[75%] mx-auto mt-4"
                />
                <p
                  lang="ar"
                  className="font-medium text-center text-sm pt-4 text-white"
                >
                  الورق و المناشف الصحية لعناية شخصية و روتين تنظيف يومــــــى
                </p>
              </div>

              {/* Trust */}
              <div
                className="h-[320px] w-[150px] sm:h-[370px] sm:w-[120px] shadow-2xl-white rounded-xl object-center bg-center p-2 flex flex-col justify-end"
                style={{
                  backgroundImage: `linear-gradient( #FF000040 , #ff0000) , url(${bucket})`,
                  backgroundSize: "400%",
                }}
              >
                <img src={trust} alt="Qtissue" className="w-[75%] mx-auto" />
                <p
                  lang="ar"
                  className="text-center font-medium text-sm w-[90%] mx-auto pt-4 text-white"
                >
                  مجموعة واسعة من أدوات التنظيف الذاتيـــــــــــــة
                </p>
              </div>
            </div>

            {/*desc*/}

            <div className="w-full lg:w-[50%] text-center lg:text-right text-white order-1 lg:order-2 me-20">
              <div className="flex justify-center lg:justify-end items-center gap-4">
                <div className="font-semibold text-2xl">
                  <h1 lang="ar">المنتجات</h1>
                  <h1 lang="en">Our Products</h1>
                </div>
                <LuBox className="text-6xl text-[white]" />
              </div>

              <p lang="ar" className="text-sm font-semibold mt-8">
                نحن نقدم مجموعة متاكملة من المنتجات المتقدمة فى مجال النظافة و
                العناية البيئية, معتمدين على أحدث التقنيات و أفضل المنتجات لضمان
                جودة استثنائية تشمل حياتنا
              </p>

              <button className="uppercase mx-auto lg:mx-0 font-semibold text-lg py-2 rounded-md px-8 mt-8 border text-white flex justify-end items-center w-full">
                <button
                  lang="en"
                  className="w-full flex justify-center items-center gap-2"
                >
                  Download Catalog <FaArrowDownLong />
                </button>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/*import Trust & Qtissue*/}
      <div className="w-[90%] mx-auto mb-32">
        <AllBrandsMain />
      </div>

      <Footer />
    </>
  );
}
