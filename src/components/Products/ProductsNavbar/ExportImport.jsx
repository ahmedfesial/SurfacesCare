import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import axios from "axios";
import { MdOutlineFileUpload } from "react-icons/md";
import { CiImport } from "react-icons/ci";
import { API_BASE_URL } from "./../../../../config";
import { CiExport } from "react-icons/ci";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa6";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function ExportImport() {
  let token = localStorage.getItem("userToken");

  // دالة تصدير المنتجات Excel
  function handleExport() {
    axios
      .get(`${API_BASE_URL}products/export`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const data = res.data; // JSON من الـ API

        // تحويل JSON لـ Excel
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

        // توليد ملف Excel
        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });
        const blob = new Blob([excelBuffer], {
          type: "application/octet-stream",
        });
        saveAs(blob, "products.xlsx");

        toast.success("Excel exported successfully");
      })
      .catch((err) => {
        toast.error(" export Excel");
        console.log(err);
      });
  }

  // Import Product
  function importProduct() {
    const formData = new FormData();

    formData.append("file", formik.values.file);

    axios
      .post(`${API_BASE_URL}import/products`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        toast.success("Import Products Added Successfully");
      })
      .catch(() => {
        toast.error("Something went wrong while adding File Products");
      });
  }

  // Formik
  let formik = useFormik({
    initialValues: {
      file: "",
    },
    onSubmit: importProduct,
  });

  return (
    <Dialog.Root>
      <Dialog.Trigger
        lang="en"
        className="bg-white flex items-center gap-2 text-[#1243AF] px-4 sm:px-8 py-1 rounded-md mt-2 cursor-pointer hover:bg-gray-300 duration-300 transition-all me-6 z-50"
      >
        <span className="font-bold">Product</span> Import / Export
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-[#1234AF]/50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md shadow-xl w-[90vw] max-w-2xl max-h-[85vh] overflow-y-auto z-50">
          <form onSubmit={formik.handleSubmit}>
            <Tabs.Root defaultValue="basic">
              <Tabs.List className="flex space-x-4 bg-[#EBEBEB] h-[50px] rounded-t-md mb-6 text-[#1243AF]">
                <Tabs.Trigger
                  value="basic"
                  className="py-2 px-4 ms-4 text-sm font-medium border-b-2 "
                >
                  Product Import and Export
                </Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="basic" className="p-6">
                <div className="space-y-4">
                  <div className="flex textColor gap-2">
                    <button
                      type="button"
                      onClick={handleExport}
                      className="rounded-md textColor border border-blue-400 transition-all duration-200 py-1 px-4 flex items-center cursor-pointer font-light w-full justify-center gap-2"
                    >
                      Export Files <CiExport />
                    </button>
                    {/* Import */}
                    <label
                      htmlFor="fileInput"
                      className="rounded-md textColor border border-blue-400 transition-all duration-200 py-1 px-4 flex items-center cursor-pointer font-light w-full justify-center"
                    >
                      <div className="w-full">
                        <span className="flex items-center justify-center gap-2">
                          Upload Files
                          <CiImport />
                        </span>
                      </div>
                    </label>
                    <input
                      id="fileInput"
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          formik.setFieldValue("file", e.target.files[0]); // تحديث قيمة الفورم
                          formik.submitForm(); // ارسال الفورم مباشرة
                        }
                      }}
                    />{" "}
                  </div>
                </div>
              </Tabs.Content>
            </Tabs.Root>

            <div className="flex justify-end p-6 pt-0"></div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
