import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { useFormik } from "formik";
import { TbUserShare } from "react-icons/tb";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function Forward({ requestId }) {
  let token = localStorage.getItem("userToken");

  // ✅ نقرأ الاسم المخزن في localStorage عند أول تحميل
  const [forwardedTo, setForwardedTo] = React.useState(
    () => localStorage.getItem(`forwardedTo_${requestId}`) || null
  );

  // ✅ Get all members
  function getAllMember() {
    return axios.get(`${API_BASE_URL}users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  let { data: members } = useQuery({
    queryKey: ["AllMember"],
    queryFn: getAllMember,
    select: (res) => res.data.data,
  });

  // ✅ Forward to Member
  function forwardMember(formValue) {
    axios
      .post(`${API_BASE_URL}quotes/${requestId}/forward`, formValue, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        toast.success(res.data.message);

        const selectedUser = members.find(
          (u) => u.id === Number(formValue.forward_to)
        );
        const userName = selectedUser?.name || "Unknown";

        setForwardedTo(userName);

        // ✅ نخزن الاسم في localStorage مربوط بالـ requestId
        localStorage.setItem(`forwardedTo_${requestId}`, userName);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Something went wrong");
      });
  }

  let formik = useFormik({
    initialValues: {
      forward_to: "",
    },
    enableReinitialize: true,
    onSubmit: forwardMember,
  });

  return (
    <Dialog.Root>
      {/* Button Add  */}
      <Dialog.Trigger className="text-[#1243AF]">
        {forwardedTo ? (
          <span className="ms-5 text-sm font-medium">
            Forwarded to <b>{forwardedTo}</b>
          </span>
        ) : (
          <TbUserShare className="text-2xl ms-5" />
        )}
      </Dialog.Trigger>

      {/* Tabs  */}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-[#1243AF]/50 z-50"/>
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl w-[800px] z-50">
          <form onSubmit={formik.handleSubmit}>
            <Tabs.Root defaultValue="basic">
              <Tabs.List className="flex space-x-4 bg-[#EBEBEB] h-[50px] rounded-t-xl mb-6 text-[#1243AF]">
                <Tabs.Trigger
                  value="basic"
                  className="py-2 px-4 ms-4 text-sm font-medium border-b-2 "
                >
                  Forward to Member
                </Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="basic">
                {/* Select Member */}
                <select
                  name="forward_to"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.forward_to}
                  className="textColor text-xs w-[85.5%] ms-14 mb-4 border-1 border-[#1243AF] p-2 rounded-md focus:outline-none"
                >
                  <option>Choose Member</option>
                  {members?.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </Tabs.Content>
            </Tabs.Root>

            <div className="flex justify-end me-8">
              <button
                type="submit"
                className="px-8 mb-6 mt-10 me-7 bg-[#1243AF] text-white rounded-md text-xs p-2 cursor-pointer hover:bg-white hover:text-[#1243AF] border duration-300 transition-all "
              >
                Send
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
