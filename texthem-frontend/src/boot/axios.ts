import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import { authManager } from 'src/services';
import { Notify } from 'quasar';
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $axios: AxiosInstance;
        $api: AxiosInstance;
    }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({
    baseURL: process.env.API_URL,
    withCredentials: true,
    headers: {},
});

const DEBUG = process.env.NODE_ENV === 'development';

api.interceptors.request.use(
    (config) => {
        const token = authManager.getToken();

        if (token !== null) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (DEBUG) {
            console.info('-> ', config);
        }

        return config;
    },
    (error) => {
        if (DEBUG) {
            console.error('-> ', error);
        }

        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        if (DEBUG) {
            console.info('<- ', response);
        }

        return response;
    },
    (error) => {
        if (DEBUG) {
            console.error('<- ', error.response);
        }
        if (typeof error.response?.data == 'string') {
            Notify.create({
                message: error.response.data,
                color: 'negative',
                icon: 'error',
                timeout: 2000,
                position: 'top',
            });
        }

        // server api request returned unathorized response so we trrigger logout
        if (
            error.response.status === 401 &&
            !error.response.config.dontTriggerLogout
        ) {
            authManager.logout();
        }

        return Promise.reject(error);
    }
);

export default boot(({ app }) => {
    // for use inside Vue files (Options API) through this.$axios and this.$api

    app.config.globalProperties.$axios = axios;
    // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
    //       so you won't necessarily have to import axios in each vue file

    app.config.globalProperties.$api = api;
    // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
    //       so you can easily perform requests against your app's API
});

export { api };
