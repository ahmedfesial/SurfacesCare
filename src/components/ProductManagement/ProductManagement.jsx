import React, { useState } from "react";
const Dashboard = React.lazy(() => import("../Dashboard/Dashboard"));
const ManagementNav = React.lazy(() => import("./ManagementNav/ManagementNav"));
const CardsManagement = React.lazy(() =>
  import("./CardsManagement/CardsManagement")
);



export default function ProductManagement() {


  const [filteredProducts, setFilteredProducts] = useState(null);

  return (
    <section>
      <div className="grid grid-cols-[270px_1fr] me-4">
        {/*Slilde bar */}
        <div className="mb-14 me-8">
          <Dashboard />
        </div>

        {/*Navbar */}
        <div>
          <ManagementNav onFilter={setFilteredProducts}/>
          {/* Content */}
          <div className="mt-54">
            <CardsManagement filteredProducts={filteredProducts}/>
          </div>
        </div>
      </div>
    </section>
  );
}
