import React from "react";
const CustomersNavbar = React.lazy(() =>
  import("./CustomersNavbar/CustomersNavbar")
);
const Dashboard = React.lazy(() =>
  import("../../components/Dashboard/Dashboard")
);
const DataTableCustomers = React.lazy(() =>
  import("./DataTableCustomers/DataTableCustomers")
);

export default function Customers() {
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
          <CustomersNavbar/>

          {/* Content DataTables*/}
          <div className="relative top-40">
            <DataTableCustomers/>
          </div>
        </div>
      </div>
    </section>
  );
}
