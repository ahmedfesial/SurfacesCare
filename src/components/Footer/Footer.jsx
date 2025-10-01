import React from "react";
import backGroundFooter from "../../assets/Photos/backgroundNavbar.jpg";
import backGround from "../../assets/Photos/backGround.png";
import logo from "../../assets/Photos/NewLofo2.png";
import { FaDownload } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import { IoIosText } from "react-icons/io";

export default function Footer() {
  return (
    <>
      <footer
        className="w-full bg-cover bg-center object-cover"
        style={{ backgroundImage: `url(${backGroundFooter})` }}
      >
        <div className="flex flex-col items-center pt-5 text-white">
          {/* Contact Title */}
          <h1 lang="ar" className="text-xl sm:text-2xl font-bold my-4">
            اتصل بنـــا
          </h1>

          {/* Contact Text */}
          <p
            lang="ar"
            dir="rtl"
            className="w-[90%] sm:w-[80%] md:w-[50%] mt-2 text-sm sm:text-base text-justify [text-align-last:center] font-semibold"
          >
            نحن هنا لدعمك وتحويل أفكارك إلى واقع ! فقط املأ النموذج أدناه،
            وسيتواصل معك فريقنا المتخصص في أسرع وقت لتقديم الاستشارة والحلول
            المناسبة لاحتياجاتك .
          </p>

          {/* Form */}
          <form className="w-[90%] sm:w-[80%] md:w-[60%] lg:w-[50%] mx-auto my-8">
            {/* Name & Email */}
            <div className="flex flex-col md:flex-row justify-around gap-4 items-center mb-4">
              {/*User */}
              <div className="relative flex w-full justify-between">
                <input
                  type="text"
                  className="rounded-lg bg-white text-gray-700 w-full p-2.5"
                  placeholder="Full Name"
                />
                <FaUser className="absolute right-4 top-1/2 -translate-y-1/2 textColor" />
              </div>

              {/* Email */}
              <div className="relative flex w-full justify-between">
                <input
                  type="email"
                  className="rounded-lg bg-white text-gray-700 w-full p-2.5"
                  placeholder="Email Address"
                />
                <MdOutlineEmail className="absolute right-4 top-1/2 -translate-y-1/2 textColor text-xl" />
              </div>
            </div>

            {/* Phone & Message */}
            <div className="flex flex-col md:flex-row justify-around gap-4 items-center">
              <div className="relative flex w-full justify-between">
                <input
                  type="tel"
                  className="rounded-lg bg-white text-gray-700 w-full p-2.5"
                  placeholder="Phone Number"
                />
                <FaPhone className="absolute right-4 top-1/2 -translate-y-1/2 textColor text-lg" />
              </div>

              {/* Write Message  */}
              <div className="relative flex w-full justify-between">
                <input
                  type="text"
                  className="rounded-lg bg-white text-gray-700 w-full p-2.5"
                  placeholder="Write Message"
                />
                <IoIosText className="absolute right-4 top-1/2 -translate-y-1/2 textColor text-xl" />
              </div>
            </div>

            {/* Send Button */}
            <div className="w-full flex justify-center pt-2 pb-4">
              <button className="py-2 font-bold px-12 w-full rounded-lg my-4 border text-white cursor-pointer">
                Sent
              </button>
            </div>
          </form>

          {/* About Section */}
          <div
            className="w-full bg-cover bg-[#1243AF] py-8"
            style={{ backgroundImage: `url(${backGround})` }}
            dir="rtl"
          >
            <div className="w-[90%] md:w-[80%] mx-auto flex flex-col lg:flex-row justify-around items-center gap-10 lg:gap-20 py-6">
              {/* Logo */}
              <div className="w-[50%] md:w-[30%] flex items-center text-sm lg:ms-16">
                <img src={logo} className="w-full" alt="logo" />
              </div>

              {/* Desc */}
              <div className="text-center lg:text-right w-full">
                <h2
                  lang="ar"
                  className="text-lg sm:text-lg lg:text-xl font-bold"
                >
                  حلولنا بانتظار مشروعك القادم
                </h2>
                <p
                  lang="ar"
                  className="mt-4 text-sm sm:text-base text-justify w-full"
                >
                  فريقنا المتخصص مستعد لتزويدك بالحلول المبتكرة التي تضمن لك
                  التميز والاستدامة في كل خطوة من خطوات مشروعك. نحن نعمل معك من
                  الفكرة وحتى التنفيذ
                </p>
              </div>

              {/* Download Button */}
              <div className="w-full lg:w-full">
                <button
                  lang="ar"
                  className="cursor-pointer w-full lg:w-[50%] lg:ms-30 text-white border rounded-md flex items-center justify-center gap-4 text-sm sm:text-base px-4 py-2"
                >
                  ملف التعريفى <FaDownload className="text-xl" />
                </button>
              </div>
            </div>

            {/* Footer Bottom */}
            <hr className="w-[90%] md:w-[70%] mx-auto" />

            <div className="w-full md:w-[50%] mx-auto my-6 text-center">
              <p className="text-sm font-bold" lang="ar">
                &copy; جميع الحقوق محفوظة 2025
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
