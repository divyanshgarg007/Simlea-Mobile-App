/* eslint-disable prettier/prettier */
export const API_CONSTANTS = {
  BASE_URL: 'https://apptest.simlea.com/', //DEV
  // BASE_URL: "https://simlea.com/",//PROD
};

export const API_ENDPOINT_BASE_URL = API_CONSTANTS.BASE_URL;
export const API_ENDPOINTS = {
  base_url: API_ENDPOINT_BASE_URL,
  login: API_ENDPOINT_BASE_URL + 'api/checkReactAppLogin?<DATA>',
  eventInfo: API_ENDPOINT_BASE_URL + 'api/eventInfo?eventid=<ID>',
  checkEvent: API_ENDPOINT_BASE_URL + 'api/checkEventCode',
  eventFormList: API_ENDPOINT_BASE_URL + 'api/getForms?eventid=<ID>',
  reportList: API_ENDPOINT_BASE_URL + 'api/getRecords',
  employeeList: API_ENDPOINT_BASE_URL + 'api/getEmployees',
  nestedListForElementsApi:
    API_ENDPOINT_BASE_URL + 'api/getNestedListValues/<ID>',
  employesListForUserElement: API_ENDPOINT_BASE_URL + 'api/getEmployees?<ID>',
  saveFormData: API_ENDPOINT_BASE_URL + 'api/saveRecords',
  checkFiles: API_ENDPOINT_BASE_URL + 'api/checkFiles',
  //eventInfo: API_ENDPOINT_BASE_URL + 'api/eventInfo',
  getForms: API_ENDPOINT_BASE_URL + 'api/getForms',
  getNestedList: API_ENDPOINT_BASE_URL + 'api/getNestedListValues/',
  formRecordForEdit: API_ENDPOINT_BASE_URL + 'api/getRecord?<ID>',
  badgeElementData:
    'https://api.simlea.com/webhook/5b9e7a7d-4cef-430e-96d3-ffdb366f2ee4?<ID>',
  abbyFineReaderApi: 'http://46.4.135.50/finereader/',
  getImage: API_ENDPOINT_BASE_URL + 'api/getPhoto',
  getWaitlist: API_ENDPOINT_BASE_URL + 'api/getWaitlist',
  getImage: API_ENDPOINT_BASE_URL + 'api/getPhoto',
};
