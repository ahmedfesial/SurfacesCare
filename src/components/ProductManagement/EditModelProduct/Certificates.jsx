import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import DropdownCheckboxes from "./DropdownCheckboxes";
import { API_BASE_URL } from "../../../../config";
import AddCertificates from "../../Legends & Certificates & Color/AddCertificates";

export default function CertificatesDropdown({ value = [], onChange }) {
  let token = localStorage.getItem("userToken");
  
  const [openAddLegend, setOpenAddLegend] = useState(false);

  const getAllCertificates = () =>
    axios.get(`${API_BASE_URL}certificates`, {
      headers: { Authorization: `Bearer ${token}` },
    });

  const { data } = useQuery({
    queryKey: ["AllCertificates"],
    queryFn: getAllCertificates,
    select: (res) => res.data.data,
    retry: 1,
  });

  const options = data?.map((cert) => ({
    label: cert.name,
    value: Number(cert.id),
  }));

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-2 textColor">
        Certificates
        <button
          type="button"
          aria-label="Add Certificates"
          onClick={() => setOpenAddLegend(true)}
          className="ms-2 text-xl font-bold textColor"
        >
          +
        </button>
      </h2>

      <DropdownCheckboxes
        options={options || []}
        placeholder="Select certificates"
        value={value}                // خليك دايمًا مستخدم القيمة اللي جايه من برّه
        onChange={onChange}          // أبعتها للـ parent من غير state وسيط
      />

      <p className="mt-4 text-gray-700">
        Selected IDs: {value.length ? value.join(", ") : "None"}
      </p>

      <AddCertificates
        addCertificates={openAddLegend}
        setCertificates={setOpenAddLegend}
        CertificatesId={null}
      />
    </div>
  );
}
