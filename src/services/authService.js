import apiClient from "./apiClient";

const ERROR_TRANSLATIONS = {
  "Email already registered": "כתובת האימייל כבר רשומה במערכת",
  "Invalid email or password": "אימייל או סיסמה שגויים",
  "Authentication required": "נדרשת התחברות למערכת",
  "Authentication token is missing": "חסר טוקן אימות",
  "Authentication token has expired": "פג תוקף החיבור, נא להתחבר מחדש",
  "Authentication token is invalid": "טוקן אימות אינו תקין",
  "Account no longer exists": "החשבון אינו קיים עוד",
};

function formatErrorMessage(err, defaultMessage) {
  if (err.response?.data?.message) {
    const backendMsg = err.response.data.message;
    return ERROR_TRANSLATIONS[backendMsg] || backendMsg;
  }
  if (err.code === "ECONNABORTED" || err.message?.includes("Network Error") || !err.response) {
    return "לא ניתן להתחבר לשרת. נא לוודא ששרת ה-API פעיל.";
  }
  return defaultMessage;
}

export const authService = {
  async signup({ firstName, lastName, email, password }) {
    try {
      const response = await apiClient.post("/auth/signup", {
        firstName,
        lastName,
        email,
        password,
      });
      return response.data;
    } catch (err) {
      throw new Error(formatErrorMessage(err, "שגיאה ביצירת החשבון"));
    }
  },

  async login(email, password) {
    try {
      const response = await apiClient.post("/auth/login", {
        email,
        password,
      });
      return response.data;
    } catch (err) {
      throw new Error(formatErrorMessage(err, "אימייל או סיסמה שגויים"));
    }
  },

  async getUserInfo() {
    try {
      const response = await apiClient.get("/auth/userinfo");
      return response.data.user;
    } catch (err) {
      throw new Error(formatErrorMessage(err, "שגיאה באימות המשתמש"));
    }
  },

  async updateUserInfo(profileData) {
    try {
      const response = await apiClient.patch("/auth/userinfo", profileData);
      return response.data.user;
    } catch (err) {
      const error = new Error(
        formatErrorMessage(err, "שגיאה בעדכון פרטי החשבון"),
      );
      error.status = err.response?.status;
      error.fieldErrors = err.response?.data?.errors || {};
      throw error;
    }
  },
};

export default authService;
