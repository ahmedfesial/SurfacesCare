import React, { Suspense } from "react";
const Dashboard = React.lazy(() => import("../Dashboard/Dashboard"));
const MainNavbar = React.lazy(() => import("./MainNavbar/MainNavbar"));
const ChartProduct = React.lazy(() => import("./MainCharts/ChartProduct"));
const ChartTemplates = React.lazy(() => import("./MainCharts/ChartTemplates"));
const ChartCompanies = React.lazy(() => import("./MainCharts/ChartCompanies"));
const MainCatalogs = React.lazy(() => import("./MainCatalogs/MainCatalogs"));
const MainBaskets = React.lazy(() => import("./MainBaskets/MainBaskets"));

export default function Main() {
  return (
    <section>
      <div className="grid grid-cols-[270px_1fr]">
        {/*Slid Bar  */}
        <div>
          <Dashboard />
        </div>

        <div>
          {/*Navbar*/}
          <div>
            <MainNavbar />
          </div>

          {/* Content */}
          <div className="mt-58">
            <h1 className="w-[90%] mx-auto font-bold border-t pt-6 border-[#00000030] text-2xl mt-6">
              Analytics
            </h1>
            <div className="w-[95%]! sm:w-[90%]! md:w-[80%]! lg:w-[70%] xl:w-[80%]! shadow  mx-auto mt-8 bg-white rounded-md">
              {/* Title */}

              {/* Charts */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex justify-center">
                  <div className="w-full max-w-sm">
                    <ChartProduct />
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="w-full max-w-sm">
                    <ChartTemplates />
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="w-full max-w-sm">
                    <ChartCompanies />
                  </div>
                </div>
              </div>
            </div>

            {/*Catalogs*/}
            <div className="my-8">
              <MainCatalogs />
            </div>

            {/* Baskets */}
            <div className="mb-20">
              <MainBaskets />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
