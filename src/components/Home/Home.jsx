import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import backGroundFooter from "../../assets/Photos/backgroundNavbar.jpg";
import NewBackGround from "../../assets/Photos/NewBackGround.jpeg";
import people from "../../assets/Photos/People.png";
import Hand from "../../assets/Photos/Hands2.png";
import Hands from "../../assets/Photos/Hand.jpg";
import logo from "../../assets/Photos/NewText.png";
import Card1 from "../../assets/Photos/Card_1.jpg";
import Card2 from "../../assets/Photos/Card2.png";
import Card3 from "../../assets/Photos/Cards3.png";
import { FaInfoCircle } from "react-icons/fa";
import { GoArrowUpLeft } from "react-icons/go";
import { FaGears, FaQuoteLeft } from "react-icons/fa6";
import { LuMessageCircle } from "react-icons/lu";
import { IoMdEye } from "react-icons/io";
import { FaAward } from "react-icons/fa";
import Settings from "../../assets/Photos/Layer_1.png";
import TASKI from "../../assets/Photos/Taski.png";
import trusr2 from "../../assets/Photos/trusr2.png";
import diverseylogo from "../../assets/Photos/diverseylogo.png";
import hedgehog_logo from "../../assets/Photos/hedgehog_logo.png";
import qt from "../../assets/Photos/qt.png";
import Greenest from "../../assets/Photos/Greenest.png";
import text from "../../assets/Photos/NewText2.png";
import { NavLink } from "react-router-dom";

export default function Home() {
  const [activeTab, setActiveTab] = useState("رسالتنا");

  // Cards
  const tabs = [
    {
      id: "رسالتنا",
      icon: <LuMessageCircle size={20} />,
      title: "رسالتنا",
      preview: "نلتزم بتقديم أفضل الخدمات...",
      content:
        "نحن نجمع بين أهدافنا المتمثله في تقديم خدمات ومنتجات فريدة في مجال الحلول الصديقة للبيئة. وانطلاقًا من التحدي المتمثل في الابتكار، نسعى جاهدين لتطوير حلول متطورة تواكب التطورات التكنولوجية، وتحويلها إلى خدمات ومنتجات مصممة لمواجهة كافة التحديات البيئية.",
    },
    {
      id: "حولنا",
      title: "حولنا",
      icon: <FaInfoCircle size={20} />,
      preview: "تأسست مؤسسة العناية بالأسطح في عام 2009 ....",
      content:
        "أنشئت مؤسسة العناية بالأسطح للتجارة عام 2009 متخصصة في تقنيات ومنتجــــــــــــــات الحلول البيئية الحديثة والتي تستند على النظم المتطورة ذات الجودة العالية لتلبية حاجـــــــــــــــــــة عملائها بأسلوب حديث وفعال ومن خلال عدت علامة تجارية مملوكة لمؤسسة العناية بالأسطح للتجارة نقدم حلولنا البيئية المواكبة للاستدامة البيئية .",
    },
    {
      id: "قيمنا",
      title: "قيمنا",
      icon: <FaAward size={20} />,
      preview: "الابتكار – الجودة – الاستدامة...",
      content:
        "الجودة والفعالية: نسعى لتقديم منتجات عالية الجودة تلبي احتياجات عملائنا وتحقق النتائج المرجوة. نحن نؤمن بأن المنظفات الصديقة للبيئة يمكن أن تكون فعالة بنفس القدر مثل المنتجات التقليدية.الشفافية والنزاهة: نحن نتعامل مع عملائنا وشركائنا بنزاهة وشفافية. نقدم معلومات دقيقة حول منتجاتنا ونسعى لبناء علاقات مستدامة.الابتكار والبحث والتطوير: نحن نستثمر في البحث والتطوير لتطوير منتجات جديدة ومبتكرة. نسعى للبقاء على أحدث التقنيات والمواد الصديقة للبيئة.المسؤولية الاجتماعية: نحن ندعم المجتمعات التي نعمل فيها من خلال مبادرات اجتماعية وبيئية. نسعى لتحقيق التوازن بين الأرباح والمسؤولية الاجتماعية.",
    },
    {
      id: "رؤيتنا",
      title: "رؤيتنا",
      icon: <IoMdEye size={20} />,
      preview: "أن نكون منظمة رائدة عالميًا...",
      content:
        "أن نكون منظمة رائدة عالميا في تقديم الحلول البيئية المبتكرة التي تعمل على تعزيز الاستدامة وتحسين نوعية الحياة والصحة البشرية.",
    },
  ];

  return (
    <>
      <Navbar />

      {/*Header Frist Section*/}
      <section className="w-full">
        <div
          className="w-[90%] mx-auto mt-10 md:mt-30 h-auto md:h-[420px] mb-10 md:mb-20 rounded-2xl bg-cover bg-center object-cover"
          style={{ backgroundImage: `url(${backGroundFooter})` }}
        >
          {/*Main Div*/}
          <div className="flex flex-col md:flex-row justify-between w-[90%] mx-auto items-center h-full py-10 md:py-0">
            {/* logo */}
            <div className="flex flex-col items-center w-full md:w-[400px] md:me-12 mb-10 md:mb-0">
              <img src={logo} alt="" className="w-[55%]" />
            </div>

            {/*Description*/}
            <div
              className="text-white font-medium text-right w-full md:w-[42%]"
              lang="ar"
            >
              <p dir="rtl" className="font-medium text-lg md:text-xl">
                ”تقنيات حديثة, <br /> نتائـج{" "}
                <span className="text-[#11ADD1]">مستـــــــدامة</span>“
              </p>
              <p className="mt-4 text-justify [text-align-last:right]">
                أنشئت العناية بالأسطح للتجارة عام 2009 متخصصة في تقنيات ومنتجات
                الحلول الصديقة للبيئة والتي تستند على النظم المتطورة ذات الجودة
                العالية لتلبية حاجة عملائها بأسلوب حديث وفعال ومن خلال عدت
                علامات تجارية مملوكة لمؤسسة العناية بالأسطح ونتمثل في تقديم هذه
                الحلول لمواكبة الاستدامة
              </p>
            </div>
          </div>
        </div>
      </section>

      {/*Second Section*/}
      <section
        id="Here"
        className="text-center my-10 md:my-20 uppercase textColor w-[90%] mx-auto"
      >
        {/* Title */}
        <div className="text-2xl md:text-4xl">
          <div className="w-full flex justify-center">
            <img src={text} alt="" className="w-[50%] md:w-[20%]" />
          </div>
          <p
            dir="rtl"
            lang="ar"
            className="font-bold! text-sm! mt-4 w-full md:w-[65%] mx-auto"
          >
            نحن نؤمن بأهمية النظافة كعامل أساسي لحياة صحية و بيئة نظيفة وملتزمون
            دائمًا بتطبيق <br /> أحدث التقنيات الصديقة للبيئة في جميع خدماتنا
            ومنتجاتنا .
          </p>
        </div>

        {/* Change Divs */}
        <div className="flex flex-col lg:flex-row gap-8 w-full mx-auto max-w-5xl mt-8">
          {/* المحتوى الكامل على الشمال */}
          <div className="w-full lg:w-1/2 lg:pr-6">
            <h3
              lang="ar"
              className="font-bold mb-4 text-[#11ADD1] text-2xl md:text-3xl text-right"
            >
              {activeTab}
            </h3>
            <p
              dir="rtl"
              lang="ar"
              className="text-gray-600 font-semibold leading-relaxed text-justify [text-align-last:right]"
            >
              {tabs.find((tab) => tab.id === activeTab)?.content}
            </p>
          </div>

          {/* الكروت على اليمين */}
          <div
            lang="ar"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-1/2"
          >
            {tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`h-[120px] cursor-pointer p-4 rounded-md text-center transition flex flex-col gap-6  justify-center items-end ${
                  activeTab === tab.id
                    ? "bg-[#E0E0E0] text-[#11ADD1]"
                    : "backGroundColor text-white"
                }`}
              >
                <div
                  className={`flex items-center justify-end gap-4 w-full text-xl md:text-2xl font-semibold ${
                    activeTab === tab.id ? "text-[#11ADD1]" : "text-white"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.title}</span>
                </div>
                <p
                  dir="rtl"
                  className={`text-sm text-right ${
                    activeTab === tab.id ? "textColor" : "text-white"
                  }`}
                >
                  {tab.preview}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*Third Section*/}
      <section
        className="relative w-full h-auto md:h-[300px] mt-20 bg-cover bg-no-repeat bg-center"
        style={{
          backgroundImage: `linear-gradient( #1243AF99) , url(${people})`,
        }}
      ></section>
      {/*Follow Section Third*/}
      <div
        className="w-[90%] md:w-[80%] text-white relative md:absolute md:right-1/2 md:translate-x-1/2 flex flex-col md:flex-row justify-around items-center bg-cover object-center rounded-4xl md:translate-y-[-50%] h-auto md:h-[200px] mx-auto p-10 md:p-0"
        style={{ backgroundImage: `url(${NewBackGround})` }}
      >
        {/*Desc */}
        <div className="mb-10 md:mb-0">
          <p
            lang="ar"
            className="font-semibold text-lg md:text-2xl text-center md:text-right"
          >
            “نوفر مزيج فريد من الحلول البيئية <br /> نضمن من خلالها بيئة{" "}
            <span className="text-[#11ADD1]">صحية و امنه</span>”
          </p>
        </div>

        {/*Title  */}
        <div className="flex text-right gap-4 items-center">
          <div className="text-lg md:text-2xl font-light">
            <h1 lang="ar" className="text-2xl md:text-3xl">
              الحلــــول
            </h1>
            <h1 lang="en" className="uppercase">
              our Solutions
            </h1>
          </div>
          <div>
            <img src={Settings} alt="" />
          </div>
        </div>
      </div>

      {/* Forth Section '3 Cards'*/}

      <section
        lang="ar"
        className="w-full max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6 p-4 my-40"
      >
        {/* Card 1 */}
        <NavLink to={"/OurServices"}>
          <div
            className="w-full md:w-[350px] h-[450px] flex justify-end text-white flex-col bg-cover bg-no-repeat bg-center rounded-2xl"
            style={{
              backgroundImage: `linear-gradient( #1243AF40 , #1243AF) , url(${Card2})`,
            }}
          >
            <div className="w-[80%] mx-auto text-right flex-col mb-4">
              <h1 className="flex flex-row-reverse text-3xl md:text-4xl mb-4 gap-2 items-center">
                الخــدمـــــات <GoArrowUpLeft className="text-xl" />
              </h1>
              <p className="text-justify pb-4 [text-align-last:right]">
                نحن نقدم خدمات متميزة في مجال الحلول البيئية والنظافة، معتمدين
              </p>
            </div>
          </div>
        </NavLink>

        {/* Card 2 */}
        <NavLink to={"/OurProducts"}>
          <div
            className="w-full md:w-[350px] h-[450px] flex justify-end text-white flex-col bg-cover bg-no-repeat bg-right rounded-2xl"
            style={{
              backgroundImage: `linear-gradient( #1243AF40 , #1243AF) , url(${Card3})`,
            }}
          >
            <div className="w-[80%] mx-auto text-right flex-col mb-4">
              <h1 className="flex flex-row-reverse text-3xl md:text-4xl mb-4 gap-2 items-center">
                المنتجــــــات <GoArrowUpLeft className="text-xl" />
              </h1>
              <p className="text-justify pb-4 [text-align-last:right]">
                نحن نقدم مجموعة متكاملة من المنتجات المتقدمة في مجال
              </p>
            </div>
          </div>
        </NavLink>

        {/* Card 3 */}
        <NavLink to={"/Sustainability"}>
          <div
            className="w-full md:w-[350px] h-[450px] flex justify-end text-white flex-col bg-cover bg-no-repeat bg-right rounded-2xl"
            style={{
              backgroundImage: `linear-gradient( #1243AF40 , #1243AF) , url(${Card1})`,
            }}
          >
            <div className="w-[80%] mx-auto text-right flex-col mb-4">
              <h1 className="flex flex-row-reverse text-3xl md:text-4xl mb-4 gap-2 items-center">
                الاستـــدامة <GoArrowUpLeft className="text-xl" />
              </h1>
              <p
                dir="rtl"
                className="text-justify pb-4 [text-align-last:right]"
              >
                تلتزم SURFACES CARE دائمًــا بالاستـدامة البيئية لإنتاجها وحماية
                الموارد الطبيعية
              </p>
            </div>
          </div>
        </NavLink>
      </section>

      {/*Fifth Section */}
      <div
        className="w-full h-auto md:h-[300px] bg-cover bg-no-repeat bg-center"
        style={{
          backgroundImage: `linear-gradient( #1243AF99) , url(${Hands})`,
        }}
      ></div>
      <div
        className="w-full text-white flex  bg-cover bg-no-repeat bg-center py-10"
        style={{
          backgroundImage: `linear-gradient( #1243AF99), url(${NewBackGround})`,
        }}
      >
        <div className="w-[90%] md:w-[80%] mx-auto text-center" lang="ar">
          <h1 className="text-3xl md:text-4xl font-bold mt-8">
            شركــاء النجـــاح
          </h1>
          <p className="font-medium text-base md:text-lg mt-4">
            نعتز بشركاء النجاح ونشكر ثقتهم فينا، ونواصل التزامنا بتقديم المزيد
            من الإنجازات لتحقيق رضاهم وتعزيز شراكتنا المثمرة
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 mt-4 font-bold text-2xl pt-8 items-center gap-10 my-12">
            <img src={trusr2} alt="" className="w-[100px] mx-auto" />
            <img src={hedgehog_logo} alt="" className="w-[150px] mx-auto" />
            <img src={diverseylogo} alt="" className="w-[110px] mx-auto" />
            <img src={Greenest} alt="" className="w-[120px] mx-auto" />
            <img src={TASKI} alt="" className="w-[100px] mx-auto" />
            <img src={qt} alt="" className="w-[100px] mx-auto" />
          </div>
        </div>
      </div>

      {/*Last Section */}

      <section
        className="relative w-full h-auto py-40 flex flex-col justify-center bg-cover  items-center bg-white overflow-hidden"
        style={{ backgroundImage: ` url(${Hand})` }}
      >
        {/* المحتوى */}
        <div
          className="text-center flex flex-col justify-center items-center z-10 w-[90%] md:w-auto"
          lang="ar"
        >
          <h1 className="text-6xl md:text-8xl textColor text-center">
            <FaQuoteLeft />
          </h1>
          <p className="my-4 w-full md:w-[50vw] mx-auto text-center font-semibold text-[#183B56]">
            نؤمن أن النظافة ليست مجرد مظهر، بل هي أساس لصحة وحياة أفضل، نسخّر
            أحدث التقنيات ونختار حلولاً صديقة للبيئة لضمان جودة تدوم وأمان
            يُوثق. <br />
            <span className="font-bold">
              مع كل منتج وخدمة، نضع خبرتنا وشغفنا لنخلق بيئات نظيفة، آمنة،
              ومستدامة
            </span>
          </p>
          <h1
            lang="en"
            className="text-[#183B56] font-semibold text-lg md:text-2xl"
          >
            surfaces <span className="font-light">care</span>
          </h1>
        </div>
      </section>

      <Footer />
    </>
  );
}
