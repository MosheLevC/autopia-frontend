import { observable, action, runInAction } from "mobx";
import authService from "../services/authService";
import { vehicleStore } from "./vehicleStore";

const TOKEN_KEY = "autopia_auth_token";
const USER_KEY = "autopia_user";

export function createAuthStore() {
  const store = observable({
    user: null,
    token: null,
    isLoading: true,
    isSubmitting: false,
    error: null,

    get isAuthenticated() {
      return Boolean(store.token && store.user);
    },

    clearError: action(function () {
      store.error = null;
    }),

    initAuth: action(function () {
      try {
        const storedToken =
          localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
        const storedUser =
          localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);

        if (storedToken && storedUser) {
          store.token = storedToken;
          store.user = JSON.parse(storedUser);
        }
      } catch {
        store.clearStorage();
      } finally {
        store.isLoading = false;
      }
    }),

    clearStorage() {
      localStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(USER_KEY);
    },

    async login(email, password, rememberMe = true) {
      runInAction(() => {
        store.isSubmitting = true;
        store.error = null;
      });

      try {
        const result = await authService.login(email, password);
        runInAction(() => {
          store.user = result.user;
          store.token = result.token;
          store.error = null;

          const storage = rememberMe ? localStorage : sessionStorage;
          storage.setItem(TOKEN_KEY, result.token);
          storage.setItem(USER_KEY, JSON.stringify(result.user));

          if (!rememberMe) {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
          } else {
            sessionStorage.removeItem(TOKEN_KEY);
            sessionStorage.removeItem(USER_KEY);
          }
        });
        return result;
      } catch (err) {
        runInAction(() => {
          store.error = err.message || "ההתחברות נכשלה";
        });
        throw err;
      } finally {
        runInAction(() => {
          store.isSubmitting = false;
        });
      }
    },

    async signup(userData, rememberMe = true) {
      runInAction(() => {
        store.isSubmitting = true;
        store.error = null;
      });

      try {
        const result = await authService.signup(userData);
        runInAction(() => {
          store.user = result.user;
          store.token = result.token;
          store.error = null;

          const storage = rememberMe ? localStorage : sessionStorage;
          storage.setItem(TOKEN_KEY, result.token);
          storage.setItem(USER_KEY, JSON.stringify(result.user));
        });
        return result;
      } catch (err) {
        runInAction(() => {
          store.error = err.message || "ההרשמה נכשלה";
        });
        throw err;
      } finally {
        runInAction(() => {
          store.isSubmitting = false;
        });
      }
    },

    logout: action(function () {
      store.user = null;
      store.token = null;
      store.error = null;
      store.clearStorage();
      vehicleStore.clear();
    }),
  });

  store.initAuth();

  if (typeof window !== "undefined") {
    window.addEventListener("autopia:unauthorized", () => {
      runInAction(() => {
        store.user = null;
        store.token = null;
        store.error = "פג תוקף החיבור, אנא התחבר מחדש";
        vehicleStore.clear();
      });
    });
  }

  return store;
}

export const authStore = createAuthStore();
