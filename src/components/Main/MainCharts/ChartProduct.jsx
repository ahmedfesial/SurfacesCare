import axios from "axios";
import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { API_BASE_URL } from "./../../../../config";
import { useQuery } from "@tanstack/react-query";

export default function ChartProduct() {


  let token = localStorage.getItem("userToken");

  function getAllAnalyticsProducts() {
    return axios.get(`${API_BASE_URL}analytics`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  let { data: MostProduct } = useQuery({
    queryKey: ["allAnalyticsProducts"],
    queryFn: getAllAnalyticsProducts,
    select: (data) => data.data.mostUsedProducts, 
  });


  // لو الـ API لسه محملتش
  if (!MostProduct) {
    return (
      <section className="mt-8 rounded-2xl w-full h-auto pb-2 px-4 md:w-[440px] md:h-[350px] lg:max-w-[350px] lg:h-[470px] duration-300 transition-all font-extralight">
        <p className="textColor my-4 text-xl font-light">Most Used Product</p>
      </section>
    );
  }

  // pie chart colors
  const COLORS = ["#1243AF", "#EB7015", "#5205F1", "#11ADD1", "#0BA95B"];

  return (
    <>
      <section
        className="mt-8 rounded-2xl
          w-full h-auto pb-2 px-4
          md:w-[440px] md:h-[350px]
          lg:max-w-[350px] lg:h-[470px]
          duration-300 transition-all
          font-extralight
        "
      >
        <p className="textColor my-4 text-xl font-light">Most Used Product</p>

        {/* Chart */}
        <div className="flex justify-center items-center mb-9">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={MostProduct}
                innerRadius={60}
                outerRadius={90}
                dataKey="percentage" // جاي من الـ API
                nameKey="name"
              >
                {MostProduct.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* List Items */}
        {MostProduct.map((item, i) => (
          <div
            key={i}
            className="mt-2 flex justify-between items-center border-b border-gray-300 pb-1"
          >
            <div className="flex items-center gap-1">
              <div
                className={`w-[10px] h-[10px] rounded-full`}
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              ></div>
              <p>{item.name.split(" ").slice(0,4).join(' ')}</p>
            </div>
            <p className="text-[#9A9A9A] pe-2">{item.percentage}%</p>
          </div>
        ))}
      </section>
    </>
  );
}
