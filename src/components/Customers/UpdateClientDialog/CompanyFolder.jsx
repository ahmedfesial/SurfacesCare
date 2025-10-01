/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";
import { CiFolderOn } from "react-icons/ci";
import { FaRegFileImage } from "react-icons/fa";
const FolderCreator = React.lazy(() =>
  import("../FolderCreator/FolderCreator")
);

export default function CompanyFolder({ clientId, onFolderSelect }) {
  const token = localStorage.getItem("userToken");
  const [opened, setOpened] = useState(false);
  const [currentFolder, setCurrentFolder] = useState(null);

  // 📂 Get Client Folders
  const { data: clientFolders } = useQuery({
    queryKey: ["ClientFolders", clientId],
    queryFn: async () => {
      const res = await axios.get(
        `${API_BASE_URL}clients/${clientId}/folders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data.data;
    },
  });

  // 📄 Get All Files
  function getAllFiles() {
    return axios.get(`${API_BASE_URL}clients/${clientId}/files`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  const { data: files, isLoading: filesLoading } = useQuery({
    queryKey: ["AllFiles", clientId],
    queryFn: getAllFiles,
    select: (res) => res.data.data, // ⬅️ هنا بجيب Array الملفات بس
  });

  return (
    <>
      <div className="w-[95%] mx-auto mt-4 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          {/* 🔍 Search */}
          <div className="relative">
            <div className="absolute inset-y-0 ms-4 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 textColor"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              className="block w-[410px] p-1 ms-4 ps-10 textColor border rounded-lg focus:outline-none"
              placeholder="Search Files"
            />
          </div>

          {/* ➕ New Folder */}
          <div className="flex gap-4">
            <FolderCreator clientId={clientId} opened={opened} />
          </div>
        </div>
      </div>

      <div className="w-[95%] mx-auto mt-4 flex flex-col gap-2">
        {/* 🔙 Back Button */}
        {opened && (
          <button
            onClick={() => {
              setOpened(false);
              setCurrentFolder(null);
              onFolderSelect(null);
            }}
            className="text-blue-600 font-medium w-fit cursor-pointer"
          >
            ← Back
          </button>
        )}

        {/* 📂 Folders List */}
        {!opened && (
          <div className="mt-4 textColor grid grid-cols-6 gap-2">
            {clientFolders?.map((folder) => (
              <div
                key={folder.id}
                className="flex flex-col items-center cursor-pointer hover:text-blue-600"
                onClick={() => {
                  setOpened(true);
                  setCurrentFolder(folder);
                  onFolderSelect(folder);
                }}
              >
                <CiFolderOn className="text-4xl mb-2" />
                <span className="text-sm font-medium">{folder?.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* 📄 Files List */}
        {opened && (
          <div className="flex gap-8 flex-wrap mt-4">
            {filesLoading ? (
              <p className="text-gray-500">Loading files...</p>
            ) : files?.length > 0 ? (
              files.map((file) => (
                <div key={file.id} className="flex flex-col items-center">
                  <a
                    href={`${API_BASE_URL}storage/app/public/${file.file_path}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div className="w-16 h-16 flex items-center justify-center rounded">
                      <FaRegFileImage className="textColor text-5xl" />
                    </div>
                  </a>
                  <span className="text-xs mt-1">
                    {file.file_name.split("").slice(0, 5).join("")}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No files found.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
