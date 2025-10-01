import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/Photos/NewLogo3.png";
Link;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="backGroundColor w-full md:w-[95%] mt-0 md:mt-8 rounded-none md:rounded-md mx-auto text-white fixed top-0 right-0 left-0 z-50 opacity-95">
      <div className="w-full md:w-[80%] mx-auto h-[60px] md:h-[60px] flex items-center justify-between px-4 md:px-0">
        {/* Title */}
        <div className="w-[100px]  lg:w-[8%] flex items-center gap-1">
          <Link to={"/"}>
            <img src={logo} className="w-full" alt="logo" />
          </Link>
        </div>

        {/* Hamburger Button (Mobile only) */}
        <button
          className="md:hidden text-3xl cursor-pointer hover:scale-90 duration-500 transition-all me-4"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>

        {/* Navigation Links */}
        <div
          className={`flex-col md:flex-row md:flex items-center gap-4 ${
            isOpen ? "flex" : "hidden"
          } md:!flex absolute md:static top-[60px] left-0 w-full md:w-auto p-5 md:p-0 justify-around bg-[#0E1527B2] md:bg-transparent `}
        >
          <div>
            <ul
              className="flex flex-col md:flex-row gap-8 md:gap-12 font-bold text-lg md:text-base"
              lang="ar"
            >
              <button
                className="cursor-pointer"
                onClick={() => {
                  window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth",
                  });
                }}
              >
                {" "}
                تواصل بنا
              </button>
              <li>
                <NavLink to="/OurProducts">المنتجات</NavLink>
              </li>
              <li>
                <NavLink to="/OurServices">الحلول</NavLink>
              </li>
              <li>
                <NavLink to="/Sustainability">الاستدامة</NavLink>
              </li>
              <li>
                <a
                  href="#Here"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById("Here");
                    if (el) {
                      const yOffset = -200; // 
                      const y =
                        el.getBoundingClientRect().top +
                        window.pageYOffset +
                        yOffset;
                      window.scrollTo({ top: y, behavior: "smooth" });
                    }
                  }}
                >
                  من نحن
                </a>
              </li>
            </ul>
          </div>
          <button className="block md:hidden bg-[#57B5AA] py-2 px-6 rounded-md font-semibold uppercase cursor-pointer hover:bg-teal-600 transition duration-300 shadow-2xl text-sm mt-4 md:mt-0">
            portfolio
          </button>
        </div>

        {/*Show in DeskTop & Hidden in Mobile  */}
        <button className="hidden md:block bg-white textColor py-1 px-6 rounded-md font-bold uppercase cursor-pointer text-sm mt-4 md:mt-0 hover:text-white! hover:bg-[#1243AF]! border transition-all duration-300  ">
          portfolio
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
