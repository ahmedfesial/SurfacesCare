import React from "react";
const Dashboard = React.lazy(() => import("../Dashboard/Dashboard"));
const BasketsNavbar = React.lazy(() => import("./BasketsNavbar/BasketsNavbar"));
const DataTableBaskets = React.lazy(() =>
  import("./DataTableBaskets/DataTableBaskets")
);

export default function Baskets() {
  return (
    <section>
      <div className="grid grid-cols-[270px_1fr] me-4">
        {/*Slilde bar */}
        <div className="mb-14 me-8">
          <Dashboard />
        </div>

        {/*Main Div  */}
        <div>
          {/*Navbar */}
          <BasketsNavbar />

          {/* Content */}
          <div className="mt-52">
            <DataTableBaskets />
          </div>
        </div>
      </div>
    </section>
  );
}
