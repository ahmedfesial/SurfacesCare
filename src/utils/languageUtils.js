import { toast } from "react-hot-toast";
import axios from "axios";

/**
 * Standardized language switching function for all navbar components
 * @param {Object} i18n - i18n instance from useTranslation hook
 * @param {Function} switchLanguage - switchLanguage function from NotificationContext
 * @returns {Function} toggleLanguage function
 */
export const createLanguageToggle = (i18n, switchLanguage) => {
  return async () => {
    const currentLang = localStorage.getItem("lang") || i18n.language || "ar";
    const newLang = currentLang.startsWith("ar") ? "en" : "ar";

    // 1) Change UI immediately
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLang;

    // 2) Try to save preference in backend and refresh notifications if available
    try {
      if (switchLanguage) await switchLanguage(newLang);
      toast.success(newLang === "ar" ? "تم تغيير اللغة إلى العربية" : "Language switched to English");
    } catch (err) {
      console.error(err);
      toast.error(newLang === "ar" ? "فشل حفظ اللغة" : "Failed to save language");
    }
  };
};

/**
 * Standardized notification action functions
 * @param {Function} t - translation function
 * @param {string} token - user token
 * @param {string} API_BASE_URL - API base URL
 * @returns {Object} Object containing ApprovedPrice and RejectPrice functions
 */
export const createNotificationActions = (t, token, API_BASE_URL) => {
  const ApprovedPrice = (client) => {
    return axios
      .post(
        `${API_BASE_URL}clients/${client}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        toast.success(t('messages.approved_price') || 'Approved Price');
      })
      .catch(() => {
        toast.error(t('messages.error_approved_price') || 'Error Approved Price');
      });
  };

  const RejectPrice = (client) => {
    return axios
      .post(
        `${API_BASE_URL}clients/${client}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        toast.success(t('messages.rejected_price') || 'Rejected Price');
      })
      .catch(() => {
        toast.error(t('messages.error_rejected_price') || 'Error Reject Price');
      });
  };

  return { ApprovedPrice, RejectPrice };
};
