/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useState } from "react";
import { API_BASE_URL } from "../../../config";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

export default function MainColor({ value = [], onChange }) {
  const [openAddLegend, setOpenAddLegend] = useState(false);
  let token = localStorage.getItem("userToken");
  const { id } = useParams();

  function getProductDetails() {
    return axios.get(`${API_BASE_URL}products/show/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  const { data, error, isLoading } = useQuery({
    queryKey: ["productDetails", id],
    queryFn: getProductDetails,
    select: (data) => data.data.data,
    enabled: !!id,
    retry: 1,
  });


  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2 textColor flex items-start gap-2 flex-wrap">
        Color
        <button
          type="button"
          aria-label="Add Color"
          onClick={() => setOpenAddLegend(true)}
          className="ms-2 text-xl font-bold textColor"
        >
          +
        </button>
      </h2>

      {/* input */}
      <input
        type="text"
        placeholder="Ex: red OR #ff0000"
        className="border rounded-lg px-3 py-2 text-sm w-60 focus:outline-none focus:ring-2 textColor me-4"
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.target.value.trim()) {
            const newColor = e.target.value.trim();
            if (!value.includes(newColor)) {
              onChange([...value, newColor]);
            }
            e.target.value = "";
          }
        }}
      />

      {/* Render selected colors تحت input */}
      <div className="flex flex-wrap gap-3 mt-3">
        {value?.map((color, i) => (
          <div key={i} className="relative group">
            <div
              className="h-8 w-8 rounded-full border shadow-sm"
              style={{ backgroundColor: color }}
              title={color}
            />
            <button
              type="button"
              className="absolute -top-1 -right-1 bg-white border rounded-full w-4 h-4 text-[10px] flex items-center justify-center shadow"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
