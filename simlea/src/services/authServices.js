/* eslint-disable prettier/prettier */
import apiInstance from '../config/api/axios';
import { API_ENDPOINTS } from '../constants/constants';
// import { getPrefixUrl } from '../utilities/utils';

export const login = async data => {
  console.log(data);
  let config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      accept: 'application/json',
    },
  };
  let dataString =
    'customerid=' +
    data.customerid +
    '&username=' +
    data.username +
    '&password=' +
    data.password +
    '&deviceid=12BwJfDxFvbs0kYa';
  console.log(dataString);
  const response = await apiInstance.post(
    API_ENDPOINTS.login.replace('<DATA>', dataString),
    config,
  );

  console.log(response);
  return response;
};