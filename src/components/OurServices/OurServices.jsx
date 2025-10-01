import React from "react";
const Navbar = React.lazy(() => import("../Navbar/Navbar"));
const Footer = React.lazy(() => import("../Footer/Footer"));
import BackGround2 from "../../assets/Photos/BackGround2.png";
import NewBackGround from "../../assets/Photos/NewBackGround.jpeg";
import Icon from "../../assets/Photos/Icon3.png";

// BackGround2
export default function OurServices() {
  return (
    <>
      <Navbar />
      <section
        className="w-full h-[200px] md:h-[300px] bg-cover bg-no-repeat bg-center"
        style={{
          backgroundImage: `linear-gradient( #1243AF99) , url(${BackGround2})`,
        }}
      ></section>
      <div
        lang="ar"
        className="w-[90%] md:w-[70%] text-white relative md:absolute md:right-1/2 md:translate-x-1/2 flex flex-col md:flex-row justify-around items-center bg-cover object-center rounded-3xl translate-y-[-30%] md:translate-y-[-70%] h-auto md:h-[200px] mx-auto p-10 md:p-0"
        style={{ backgroundImage: `url(${NewBackGround})` }}
      >
        {/*Desc */}
        <div className="text-right mb-10 md:mb-0">
          <p lang="ar" dir="rtl" className="font-bold text-lg md:text-2xl">
            ”تقنيات حديثة, <br /> نتائـج{" "}
            <span className="text-[#11ADD1]">مستـــــــدامة</span>“
          </p>
        </div>

        {/*Title  */}
        <div className="flex text-right gap-4 items-center">
          <div className="text-xl md:text-2xl font-bold">
            <h1 lang="ar" className="text-2xl md:text-3xl">
              الخدمات
            </h1>
            <h1 lang="en" className="uppercase">
              our Services
            </h1>
          </div>
          <div>
            <img src={Icon} alt="" />
          </div>
        </div>
      </div>

      <section className="mb-20 md:my-30 w-[90%] md:w-[60%] mx-auto font-semibold text-base md:text-xl">
        <div dir="rtl" lang="ar">
          <p className="text-lg md:text-xl">
            نحن نقدم خدمات متميزة في مجال الحلول البيئية والنظافة، معتمدين على
            فريق متخصص من الخبراء المدربين بكفاءة عالية. <br /> <br />{" "}
            <span className="text-[#11ADD1] ">تشمل خدماتنا :</span>
          </p>
          <p>
            <ul className="list-disc list-inside font-semibold mt-4">
              <li>حلول بيئية متكاملة و مبتكرة</li>
              <li>استشارات متخصصة فى منتجات التنظيف عالية الجودة</li>
              <li>دعم فنى شامل لتلبية احتياجات عملائنا و ضمان رضاهم</li>
            </ul>
          </p>
          <p className="mt-10 text-justify">
            إدراكاً منا للعلاقة الوثيقة بين الصحة والنظافة، نلتزم بتوفير حلول
            بيئية متكاملة تضمن بيئة نظيفة وآمنة. كما نهدف إلى الحفاظ على المنشآت
            وإطالة عمرها الافتراضي من خلال خدماتنا المتخصصة. <br /> <br />
            على مدار سنوات عملنا، طورنا خبرات عميقة في مواجهة التحديات البيئية
            المعقدة، مما مكننا من ابتكار أساليب مثلى للتعامل معها بكفاءة
            وفعالية. نسعى باستمرار، وبكل جد وإصرار، لتطوير حلول بيئية شاملة تلبي
            أعلى المعايير العالمية. <br /> <br />
            يدفعنا التزامنا الراسخ بالتميز والابتكار نحو تحقيق نتائج استثنائية
            في مجال الحلول البيئية المستدامة. نحن نؤمن بأن جهودنا المتواصلة في
            هذا المجال تساهم في خلق مستقبل أكثر نظافة واستدامة للجميع.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
