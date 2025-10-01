import axios from "axios";
import { createContext } from "react";
import { API_BASE_URL } from "../../config";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// eslint-disable-next-line react-refresh/only-export-components
export let NotificationtContext = createContext();



export default function NotificationProvider(props) {
  let token = localStorage.getItem("userToken");

  const queryClient = useQueryClient();

  // Get All notification
  function getNotification() {
    return axios.get(`${API_BASE_URL}notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  let { data } = useQuery({
    queryKey: ["AllNotification"],
    queryFn: getNotification,
    refetchInterval: 1000,
    select: (data) => data.data.data,
  });

  async function markAllRead() {
    try {
      await axios.post(
        `${API_BASE_URL}notifications/mark-all-as-read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // فورًا حدث الكاش وخلي كله read
      queryClient.setQueryData(["AllNotification"], (oldData) => {
        if (!oldData) return [];
        return oldData.map((n) => ({ ...n, status: "read" }));
      });

      queryClient.invalidateQueries(["AllNotification"]);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  }

  //language
  function switchLanguage(lang = "ar") {
    axios
      .get(`${API_BASE_URL}lang`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": lang,
        },
      })
      .then(() => {
        localStorage.setItem("lang", lang);
      })
      .catch((error) => {
        console.error("Error switching language:", error);
        toast.error("error");
      });
  }

  // Hide notification count
  function hideNotificationCount() {
    queryClient.setQueryData(["AllNotification"], (oldData) => {
      if (!oldData) return [];
      return oldData.map((n) => ({ ...n, status: "read" }));
    });
  }

  return (
    <NotificationtContext.Provider
      value={{
        notifications: data || [],
        markAllRead,
        switchLanguage,
        hideNotificationCount,
      }}
    >
      {props.children}
    </NotificationtContext.Provider>
  );
}

