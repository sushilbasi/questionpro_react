import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_URL;

// const parsedData = window.location.pathname.split("/");
// const domainName: any = parsedData[1];


const axiosInstance = axios.create({
    baseURL,
    headers: {
        Accept: "application/json",
        'Access-Control-Allow-Origin' : '*',
        // company_domain: domainName === "admin" ? "" : domainName,
    },
    timeout:300000
});

axiosInstance.interceptors.response.use(
    (response: any) => {
        return response;
    },
    (err) => {
        //Handle refresh token here
        const originalRequest = err?.config;
        if (err?.response?.status === 306 && !originalRequest?._retry) {
            originalRequest._retry = true;
            //do some stuff here........
            return axiosInstance(originalRequest);
        }
        // else if(err.response.status === 400){
        //   window.location.href = "/login";
        // }

        return Promise.reject(err);
    }
);

export default axiosInstance;
