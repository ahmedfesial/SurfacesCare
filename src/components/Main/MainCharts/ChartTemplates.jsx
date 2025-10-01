import React from "react";
import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { API_BASE_URL } from "../../../../config";
import axios from "axios";

const COLORS = ["#1243AF", "#11ADD1"];

export default function ChartTemplates() {
  let token = localStorage.getItem("userToken");

  // Most Template
  function getAllAnalyticsTemplate() {
    return axios.get(`${API_BASE_URL}analytics`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  let { data: Template } = useQuery({
    queryKey: ["allAnalyticsTemplate"],
    queryFn: getAllAnalyticsTemplate,
    select: (data) => data.data.mostPreferredTemplates,
  });

   

  const fallbackData = [{ name: "No Data", value: 1 }];

  return (
    <>
      <section className=" mt-8 font-extralight rounded-2xl w-[440px] h-[350px] pb-2 px-4  md:max-w-[350px]  md:h-[470px] duration-300 transition-all">
        <p className="textColor my-4 font-light! text-xl">
          Most Prefered Templates
        </p>
        <div className="flex justify-center items-center mt-8">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={Template && Template.length > 0 ? Template : fallbackData}
                innerRadius={80}
                outerRadius={120}
                TemplateKey="value"
              >
                {(Template && Template.length > 0
                  ? Template
                  : fallbackData
                ).map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      Template && Template.length > 0
                        ? COLORS[index % COLORS.length]
                        : "#1243AF"
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Card  */}
        {Template && Template.length > 0 ? (
          <>
            {Template.map((template, i) => (
              <div key={i}>
                <div className="mt-13 flex justify-between items-center border-b-1 border-gray-300 pb-1">
                  <div className="flex items-center gap-1">
                    <div className="w-[10px] h-[10px] rounded-full bg-[#11ADD1]"></div>
                    <p>{template.name.split(" ").slice(0, 4).join(" ")}</p>
                  </div>
                  <p className="text-[#9A9A9A] pe-2">{template.percentage}%</p>
                </div>
              </div>
            ))}
          </>
        ) : (
          <p className="text-gray-400 text-center my-10">
            No preferred templates were found
          </p>
        )}
      </section>
    </>
  );
}
