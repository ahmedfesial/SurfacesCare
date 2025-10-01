import React from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import SustainabilityPhoto from "../../assets/Photos/Sustainability.jpg";
import NewBackGround from "../../assets/Photos/NewBackGround.jpeg";
import Icon from "../../assets/Photos/ICon.png";
import foglia from "../../assets/Photos/foglia.png";
import FoglieBackGround from "../../assets/Photos/FoglieBackGround.jpg";

export default function Sustainability() {
  return (
    <>
      <Navbar />
      <div className="bg-[#ffffff]!">
        <section
          className="w-full h-[200px] md:h-[300px] bg-teal-400 bg-cover bg-no-repeat bg-center"
          style={{
            backgroundImage: `linear-gradient( #1243AF99) , url(${SustainabilityPhoto})`,
          }}
        ></section>
        <div
          className="w-[90%] md:w-[70%] text-white relative md:absolute md:right-1/2 md:translate-x-1/2 flex flex-col md:flex-row justify-around items-center bg-cover object-center rounded-3xl translate-y-[-30%] md:translate-y-[-70%] h-auto md:h-[200px] mx-auto p-10 md:p-0"
          style={{ backgroundImage: `url(${NewBackGround})` }}
        >
          {/*Desc */}
          <div className="text-right mb-10 md:mb-0">
            <p dir="rtl" lang="ar" className="font-bold text-lg md:text-2xl">
              ”تقنيات حديثة, <br /> نتائـج{" "}
              <span className="text-[#11ADD1]">مستـــــــدامة</span>“
            </p>
          </div>

          {/*Title  */}
          <div className="flex text-right gap-4 items-center">
            <div className="text-xl md:text-2xl font-bold">
              <h1 lang="ar" className="text-2xl md:text-3xl">
                الاستـــدامة
              </h1>
              <h1 lang="en" className="uppercase">
                Sustainability
              </h1>
            </div>
            <div>
              <img src={Icon} alt="" />
            </div>
          </div>
        </div>

        {/* Section Desc */}
        <div className="md:mt-30">
          <div className="w-[90%] md:w-[70%] mx-auto">
            <div className="flex flex-row-reverse items-center text-[#1CAC79]">
              <img src={foglia} alt="" className="w-[50px] md:w-[70px]" />
              <h1 lang="ar" className="text-2xl md:text-3xl font-bold ">
                اللون الاخضر أفضل
              </h1>
            </div>
            <div lang="ar" className="me-0 md:me-6 mt-2">
              <p
                dir="rtl"
                className="text-right font-medium text-base md:text-lg"
              >
                تلتزم SURFACES CARE دائمًا بالاستدامة البيئية لإنتاجها وحماية
                الموارد الطبيعية، وتتبع دائمًا العديد من معايير الاستدامة
                البيئية: استخدام العلامات البيئية للشركة والمنتج المعترف بها على
                المستوى الأوروبي؛ وتعزيز إعادة تدوير المواد؛ وتصميم أنظمة تقلل
                من التأثير البيئي؛ وتفضيل مصادر الطاقة النظيفة؛ وأكثر من ذلك
                بكثير! <br /> <br />
                تتوافق العديد من هذه الإجراءات مع التوجيهات الأوروبية (GPP -
                المشتريات العامة الخضراء)، والتي تحدد النهج الذي تستخدمه
                الإدارات العامة في دمج المتطلبات البيئية في جميع مراحل عملية
                الشراء، وتعزيز التقنيات البيئية وتطوير منتجات أكثر قبولًا
                بيئيًا.
              </p>
            </div>
            <div className="relative mt-10">
              <button
                lang="en"
                className="bg-teal-600 w-full md:w-auto top-14 z-50 py-2 px-8 rounded-md backGroundColor text-white cursor-pointer"
              >
                BROWSE THE CATALOGUE
              </button>
            </div>
          </div>
          <div className="w-full  flex justify-start mt-10">
            <img
              src={FoglieBackGround}
              alt=""
              className="w-[50%] md:w-[30%] transform scale-x-[-1]"
            />
          </div>
        </div>

        {/*Second Section*/}
        <section
          lang="ar"
          className="w-full bg-[#F2F6FF] h-[200px] flex flex-col justify-center items-center "
          dir="rtl"
        >
          <h1 className="text-[#11ADD1] text-xl md:text-2xl">
            تعمل شركة{" "}
            <span lang="en" className="uppercase textColor font-bold">
              surfaces care
            </span>{" "}
            منذ 30 عامآ فى خدمة العملاء
          </h1>
          <p className="pt-2 textColor font-semibold text-base w-[50%] mx-auto">
            <span className="font-bold">رضاكم هو هدفنا! </span> نعمل باستمرار
            على تزويدكم بمنتجات عالية الجودة وسهلة الاستخدام وطويلة الأمد، حتى
            تتمكنوا من توفير التكاليف وأوقات الخدمة. إن قسم البحث والتطوير لدينا
            مشغول دائمًا بتصميم أنظمة لكم تضمن عمليات تنظيف أكثر كفاءة ونظافة
            واستدامة بيئية لجميع المشغلين!
          </p>
        </section>
      </div>

      <Footer />
    </>
  );
}
