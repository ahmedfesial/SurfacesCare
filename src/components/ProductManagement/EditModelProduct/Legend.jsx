import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import DropdownCheckboxes from "./DropdownCheckboxes";
import AddLegend from "../../Legends & Certificates & Color/AddLegend";
import { API_BASE_URL } from "../../../../config";

export default function Legend({ value = [], onChange }) {
  let token = localStorage.getItem("userToken");

  const [openAddLegend, setOpenAddLegend] = useState(false);

  const getAllLegend = () =>
    axios.get(`${API_BASE_URL}legends`, {
      headers: { Authorization: `Bearer ${token}` },
    });

  const { data } = useQuery({
    queryKey: ["AllLegend"],
    queryFn: getAllLegend,
    select: (res) => res.data.data,
    retry: 1,
  });

  const options = data?.map((legend) => ({
    label: legend.name,
    value: Number(legend.id),
  }));


  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-2 textColor">
        Legend
        <button
          type="button"
          aria-label="Add Legend"
          onClick={() => setOpenAddLegend(true)}
          className="ms-2 text-xl font-bold textColor"
        >
          +
        </button>
      </h2>

      <DropdownCheckboxes
        options={options || []}
        placeholder="Select Legend"
        value={value}          // نفس فكرة CertificatesDropdown
        onChange={onChange}    // مفيش setSelected داخلي
      />

      <p className="mt-4 text-gray-700">
        Selected IDs: {value.length ? value.join(", ") : "None"}
      </p>

      <AddLegend
        updateClient={openAddLegend}
        setUpdateClient={setOpenAddLegend}
        clientId={null}
      />
    </div>
  );
}
