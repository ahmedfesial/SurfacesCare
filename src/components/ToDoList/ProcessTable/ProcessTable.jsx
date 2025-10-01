import React from "react";

export default function ProcessTable() {
  return (
    <div className="mt-2 p-4 leading-8">
   <table>
  <thead className="text-[#1243AF]">
    <tr>
      <th className="px-4 py-2 pe-4">Baskets's Name</th>
      <th className="px-4 py-2">Customers's Name</th>
      <th className="px-4 py-2 pe-4">Date</th>
      <th className="px-4 py-2 pe-4">Priority</th>
      <th className="px-4 py-2 pe-4">Status</th>
      <th className="px-4 py-2">Note</th>
    </tr>
  </thead>
  <tbody className="text-center">
    <tr>
      <td className="px-4 py-2">Create figma community file</td>
      <td className="px-4 py-2">care</td>
      <td className="px-4 py-2 pe-4">Nov 11-25</td>
      <td className="px-4 py-2">  </td>
      <td className="px-4 py-2 pe-4">Created</td>
      <td className="px-4 py-2">
        <input type="text" className="border rounded-2xl ps-4" placeholder="Note" />
      </td>
    </tr>
  </tbody>
</table>

    </div>
  );
}
