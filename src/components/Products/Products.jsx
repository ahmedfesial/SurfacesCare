import React, { useState, Suspense } from "react";

const Dashboard = React.lazy(() => import("../Dashboard/Dashboard"));
const ProductsNavbar = React.lazy(() =>
  import("./ProductsNavbar/ProductsNavbar")
);
const Cards = React.lazy(() => import("./Card/Cards"));

export default function Products() {
  const [filteredProducts, setFilteredProducts] = useState(null);


  
  return (
    <section>
      <Suspense>
        <div className="grid grid-cols-[270px_1fr] me-4">
          {/* Sidebar */}
          <div className="mb-14 me-8">
            <Dashboard />
          </div>

          {/* Right column */}
          <div>
            <ProductsNavbar onFilter={setFilteredProducts} />
            <div className="mt-52">
              {/* ✅ المهم هنا اسم الـ prop */}
              <Cards filteredProducts={filteredProducts} />
            </div>
          </div>
        </div>
      </Suspense>
    </section>
  );
}
