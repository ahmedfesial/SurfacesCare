import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { API_BASE_URL } from "../../../../config";



const COLORS = ["#EB7015", "#1243AF", "#11ADD1"];

export default function ChartCompanies() {


  let token = localStorage.getItem("userToken");

  function getAllAnalyticsCompanies() {
    return axios.get(`${API_BASE_URL}analytics`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }


  let { data: MostCompanies } = useQuery({
    queryKey: ["allAnalyticsCompanies"],
    queryFn: getAllAnalyticsCompanies,
    select: (data) => data.data.mostPreferredCompanies, 
  });

   // لو الـ API لسه محملتش
  if (!MostCompanies) {
    return (
      <section className="mt-8 rounded-2xl w-full h-auto pb-2 px-4 md:w-[440px] md:h-[350px] lg:max-w-[350px] lg:h-[470px] duration-300 transition-all font-extralight">
        <p className="textColor my-4 text-xl font-light">Most Used Companies</p>
      </section>
    );
  }






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
              <p className="textColor my-4 text-xl font-light">Most Used Companies</p>
      
              {/* Chart */}
              <div className="flex justify-center items-center mb-9">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={MostCompanies}
                      innerRadius={60}
                      outerRadius={90}
                      dataKey="percentage" // جاي من الـ API
                      nameKey="name"
                    >
                      {MostCompanies.map((entry, index) => (
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
              {MostCompanies.map((item, i) => (
                <div
                  key={i}
                  className="mt-2 flex justify-between items-center border-b border-gray-300 me-8"
                >
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-[10px] h-[10px] rounded-full`}
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    ></div>
                    <p>{item?.name ? item.name.split(" ").slice(0, 4).join(" ") : "No Name"}</p>
                  </div>
                  <p className="text-[#9A9A9A]">{item.percentage}%</p>
                </div>
              ))}
            </section>
    </>
  );
}
