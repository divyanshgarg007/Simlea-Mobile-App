/* eslint-disable prettier/prettier */
import apiInstance from '../config/api/axios';
import {API_ENDPOINTS} from '../constants/constants';

export const employeeList = async data => {
  console.log(data);
  let config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      accept: 'application/json',
    },
  };
  config.headers['X-AUTH-TOKEN'] =
    'd73093e9e150698b9f086a1ca5144623bedb101f20ec3c41bc11539744cf8988f2768b5290a3fde97a0e8e4b2cd34ec17b4c6012c07ac0119c4d0ed8e15dab6c';

  const response = await apiInstance.post(
    API_ENDPOINTS.employeeList,
    data,
    config,
  );
  return response;
};
