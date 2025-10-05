import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
const Dashboard = React.lazy(() => import("./../Dashboard/Dashboard"));
const QuotationNavbar = React.lazy(() =>
  import("./QuotationNavbar/QuotationNavbar")
);
const DataTable = React.lazy(() => import("./DataTable/DataTable"));

export default function Quotation() {
    const { i18n } = useTranslation(); 
  

  //Dir Page Language 
    useEffect(() => {
      document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = i18n.language;
    }, [i18n.language]);

  return (
    <section>
      <div className={`grid grid-cols-[270px_1fr]`}>
        {/*Slilde bar */}
        <div className={`mb-14 `}>
          <Dashboard />
        </div>

        {/* Main Div */}
        <div>
          {/*Navbar */}
          <QuotationNavbar />

          {/* Content DataTables*/}
          <div className="relative top-40">
            <DataTable />
          </div>
        </div>
      </div>
    </section>
  );
}
