import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import DropdownCheckboxes from "./DropdownCheckboxes";
import { API_BASE_URL } from "../../../../config";

export default function CertificatesDropdown() {
  let token = localStorage.getItem("userToken");

  const [selected, setSelected] = useState([]);

  const getAllCertificates = () =>
    axios.get(`${API_BASE_URL}certificates`, {
      headers: { Authorization: `Bearer ${token}` },
    });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["AllCertificates"],
    queryFn: getAllCertificates,
    select: (res) => res.data.data,
  });

  if (isLoading) return <p>Loading certificates...</p>;
  if (isError) return <p>Failed to load certificates.</p>;

  // نحول الداتا عشان الـDropdownCheckboxes يفهمها (label + value)
  const options = data.map((cert) => ({
    label: cert.name, // لازم الـAPI يكون فيه name
    value: cert.id, // أو أي key بيمثل الـID
  }));

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-2 textColor">C</h2>

      <DropdownCheckboxes
        options={options}
        placeholder="Select certificates"
        onChange={(values) => setSelected(values)}
      />

      <p className="mt-4 text-gray-700">
        Selected IDs: {selected.length ? selected.join(", ") : "None"}
      </p>
    </div>
  );
}
