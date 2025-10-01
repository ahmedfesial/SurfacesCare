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
      <div className="grid grid-cols-[270px_1fr] me-4">
        {/*Slilde bar */}
        <div className="mb-14 me-8">
          <Dashboard />
        </div>

        {/*Main Div*/}
        <div>
          {/*Navbar */}
          <CustomersNavbar />

          {/* Content */}
          <div className="mt-52">
            <DataTableCustomers />
          </div>
        </div>
      </div>
    </section>
  );
}
