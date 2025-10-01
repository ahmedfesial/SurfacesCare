import { FolderPlus } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";
import { MdOutlineFileUpload } from "react-icons/md";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";

export default function FolderCreator({ clientId, opened }) {
  let token = localStorage.getItem("userToken");

  let queryClient = useQueryClient();

  // Add New Folder
  function createFolders() {
    axios
      .post(
        `${API_BASE_URL}clients/${clientId}/create-folder`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        toast.success("Create Folder");
        queryClient.invalidateQueries(["ClientFolder"]);
      })
      .catch(() => {
        toast.error("Error Folder");
      });
  }

  // Upload Files
  function uploadFlies() {
    let formData = new FormData();

    if (formik.values.files && formik.values.files.length > 0) {
      for (let i = 0; i < formik.values.files.length; i++) {
        formData.append("files[]", formik.values.files[i]);
      }
    }

    axios
      .post(`${API_BASE_URL}clients/${clientId}/upload-files`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        toast.success("Update Files");
        queryClient.invalidateQueries(["AllFiles"]);
      })
      .catch(() => {
        toast.error("Error Update Files");
      });
  }

  let formik = useFormik({
    initialValues: {
      files: null,
    },
    onSubmit: uploadFlies,
  });

  return (
    <>
      {/* Upload Folder */}
      <div>
        <form onSubmit={formik.handleSubmit} action="">
          <label
            htmlFor="file-upload"
            className={`rounded-md textColor border border-blue-400 transition-all duration-200 py-1 px-4 flex items-center cursor-pointer font-light w-full
        ${
          opened
            ? "bg-blue-100 hover:bg-blue-200"
            : "bg-gray-200 opacity-50 cursor-not-allowed pointer-events-none"
        }`}
          >
            <div className="w-full">
              <span className="flex items-center gap-2">
                Upload Files
                <MdOutlineFileUpload />
              </span>
            </div>
          </label>

          <input
            id="file-upload"
            name="files"
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              if (!opened) return; // لو مش مفتوح ميعملش حاجة
              formik.setFieldValue("files", e.target.files);
              formik.submitForm();
            }}
          />
        </form>
      </div>

      {/* Create Folder */}
      <div className="">
        {/* New Folder Button */}
        <form action="">
          <div className=" flex flex-col gap-2">
            <label
              htmlFor="folder_name"
              className=" bg-blue-100 rounded-md textColor border border-blue-400 hover:bg-blue-200 transition-all duration-200 py-1 px-4 flex items-center  cursor-pointer font-light w-full"
            >
              <span className="flex justify-between items-center gap-2">
                New Folder <FolderPlus size={16} />
              </span>
            </label>
            <input
              id="folder_name"
              name="folder_name"
              type="text"
              className="hidden"
              onClick={() => createFolders()}
            />
          </div>
        </form>
      </div>
    </>
  );
}
