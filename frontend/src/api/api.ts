import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
});

api.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    console.log("TOKEN FROM STORAGE:", token);

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("FINAL REQUEST");

    console.log(config.method);
    console.log(config.url);
    console.log(config.headers);

    return config;
});

export default api;