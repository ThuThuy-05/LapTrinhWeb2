// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:8080/api",
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });
// export default api;

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  
  if (token) {
    // Đảm bảo là 'Bearer ' (có dấu cách ở giữa)
    config.headers.Authorization = `Bearer ${token.replace(/['"]/g, '')}`; 
  }
  
  console.log("Request Headers gửi lên:", config.headers); // Log ra để xem nó có thực sự đính kèm header không
  return config;
});

export default api;