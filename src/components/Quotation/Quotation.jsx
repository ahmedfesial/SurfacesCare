import React from "react";
const Dashboard = React.lazy(() => import("./../Dashboard/Dashboard"));
const QuotationNavbar = React.lazy(() =>
  import("./QuotationNavbar/QuotationNavbar")
);
const DataTable = React.lazy(() => import("./DataTable/DataTable"));

export default function Quotation() {
  return (
    <section>
      <div className="grid grid-cols-[270px_1fr] me-4">
        {/*Slilde bar */}
        <div className="mb-14 me-8">
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
