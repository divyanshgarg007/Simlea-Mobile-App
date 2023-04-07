/* eslint-disable prettier/prettier */
import axios from 'axios';
// import { getToken } from '../../utilities/utils';
import { API_CONSTANTS } from '../../constants/constants';

const apiInstance = axios.create({
  baseURL: API_CONSTANTS.BASE_URL,
});

// apiInstance.interceptors.request.use(async config => {
//   config.headers['X-AUTH-TOKEN'] = 'd73093e9e150698b9f086a1ca5144623bedb101f20ec3c41bc11539744cf8988f2768b5290a3fde97a0e8e4b2cd34ec17b4c6012c07ac0119c4d0ed8e15dab6c';
//   return config;
// });

apiInstance.interceptors.response.use(
  response => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  error => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  },
);

export default apiInstance;
