// import axios from '../api/axios';
//
export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// export const clearLocalStorage = () => {
//   localStorage.removeItem(LocalStorageKeys.ACCESS_TOKEN);
// };
//
export const addAuthToLocalStorage = (data: any) => {
  console.log(data)
  localStorage.setItem('token', data._id.toString());
  localStorage.setItem('user_detail', JSON.stringify(data));
  localStorage.setItem('user_active', 'true');
};

// export const setHeaders = () =>{
//     axios.defaults.headers.common['Authorization'] = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImRhdGEiOnsiaWQiOjEsIm5hbWUiOiJBZG1pbiIsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQGVrYmFuYS5pbmZvIiwidG9rZW4iOiJ2aDE0bVY5cGE1WHRTSGtwcmt6YzYxdFIiLCJyb2xlX2lkIjoxLCJjcmVhdGVkX2F0IjoiMjAyMS0wNi0wNyAwNToyNDoxNCIsInVwZGF0ZWRfYXQiOiIyMDIxLTA2LTA3IDA4OjU3OjA0Iiwicm9sZSI6ImFkbWluIiwidXNlcl9wZXJtaXNzaW9uIjpudWxsLCJzdGF0dXMiOm51bGwsImltYWdlIjpudWxsLCJzaXRlX2FjY2VzcyI6bnVsbH0sImlhdCI6MTYyMzc1MzgxNywiZXhwIjoxNjI0MTEzODE3fQ.c6Ew-s4PCNgUfVizBNk4_usGcjTthr19lGhicH7Alig`;
//     if(getAuthToken()){
        
//     }else{
//     delete axios.defaults.headers.common['Authorization']; 
//     }
