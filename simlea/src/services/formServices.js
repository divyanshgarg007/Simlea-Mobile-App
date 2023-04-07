// eslint-disable prettier/prettier /
import apiInstance from '../config/api/axios';
import {API_ENDPOINTS} from '../constants/constants';
// import { getPrefixUrl } from '../utilities/utils';

export const getNestedListValuesServiceMethod = async id => {
  let config = {
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
  };
  config.headers['X-AUTH-TOKEN'] =
    'd73093e9e150698b9f086a1ca5144623bedb101f20ec3c41bc11539744cf8988f2768b5290a3fde97a0e8e4b2cd34ec17b4c6012c07ac0119c4d0ed8e15dab6c';

  const response = await apiInstance.get(
    API_ENDPOINTS.nestedListForElementsApi.replace('<ID>', id),
    config,
  );
  return response;
};

export const getEmployesListForUserElementMethod = async eventId => {
  let config = {
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
  };
  config.headers['X-AUTH-TOKEN'] =
    'd73093e9e150698b9f086a1ca5144623bedb101f20ec3c41bc11539744cf8988f2768b5290a3fde97a0e8e4b2cd34ec17b4c6012c07ac0119c4d0ed8e15dab6c';
  const response = await apiInstance.get(
    API_ENDPOINTS.employesListForUserElement.replace(
      '<ID>',
      'eventid=' + eventId,
    ),
    config,
  );
  return response;
};

export const getFormRecordDataForEdit = async recordId => {
  console.log('getFormRecordDataForEdit' + recordId);

  let config = {
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
  };
  apiInstance.interceptors.request.use(async config => {
    config.headers['X-AUTH-TOKEN'] =
      'd73093e9e150698b9f086a1ca5144623bedb101f20ec3c41bc11539744cf8988f2768b5290a3fde97a0e8e4b2cd34ec17b4c6012c07ac0119c4d0ed8e15dab6c';
    return config;
  });

  const response = await apiInstance.post(
    API_ENDPOINTS.formRecordForEdit.replace('<ID>', 'record_id=' + recordId),
    config,
  );
  console.log(response);
  return response;
};

export const getDataForBadgeElementBasedOnTicketId = async recordId => {
  let config = {
    auth: {
      username: 'simlea',
      password: 'XAK.Sbx9u~f3^2:"',
    },
  };

  const response = await apiInstance.get(
    API_ENDPOINTS.badgeElementData.replace('<ID>', 'tiketId=' + recordId),
    config,
  );
  return response;
};

export const submitFormDataActionService = async (data, token) => {
  console.log(data);
  let config = {
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
  };
  config.headers['X-AUTH-TOKEN'] = token; //'d73093e9e150698b9f086a1ca5144623bedb101f20ec3c41bc11539744cf8988f2768b5290a3fde97a0e8e4b2cd34ec17b4c6012c07ac0119c4d0ed8e15dab6c';

  const response = await apiInstance.post(
    API_ENDPOINTS.saveFormData,
    data,
    config,
  );
  return response;
};

export const checkFilesActionService = async (data, token) => {
  console.log(data);
  let config = {
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
  };
  config.headers['X-AUTH-TOKEN'] = token
  const response = await apiInstance.post(
    API_ENDPOINTS.checkFiles,
    data,
    config,
  );
  return response;
};

export const getFormsActionService = async (URL, token) => {
  let config = {
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
  };
  config.headers['X-AUTH-TOKEN'] = token; //'d73093e9e150698b9f086a1ca5144623bedb101f20ec3c41bc11539744cf8988f2768b5290a3fde97a0e8e4b2cd34ec17b4c6012c07ac0119c4d0ed8e15dab6c';

  const response = await apiInstance.get(URL, config);
  return response;
};

export const getNestedFormActionService = async URL => {
  let config = {
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
  };
  config.headers['X-AUTH-TOKEN'] =
    'd73093e9e150698b9f086a1ca5144623bedb101f20ec3c41bc11539744cf8988f2768b5290a3fde97a0e8e4b2cd34ec17b4c6012c07ac0119c4d0ed8e15dab6c';

  const response = await apiInstance.get(URL, config);
  return response;
};

export const getRecordActionService = async (URL, token) => {
  let config = {
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
  };
  config.headers['X-AUTH-TOKEN'] = token; //'d73093e9e150698b9f086a1ca5144623bedb101f20ec3c41bc11539744cf8988f2768b5290a3fde97a0e8e4b2cd34ec17b4c6012c07ac0119c4d0ed8e15dab6c';

  const response = await apiInstance.get(URL, config);
  return response;
};

export const getEmployeeDataActionService = async (URL, token) => {
  let config = {
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
  };
  config.headers['X-AUTH-TOKEN'] = token; //'d73093e9e150698b9f086a1ca5144623bedb101f20ec3c41bc11539744cf8988f2768b5290a3fde97a0e8e4b2cd34ec17b4c6012c07ac0119c4d0ed8e15dab6c';

  const response = await apiInstance.get(URL, config);
  return response;
};

export const getCardDataFromAbbyFineReader = async uri => {
  console.log('getCardDataFromAbbyFineReaderis executed');
  var formData = new FormData();
  let photo = {
    uri: uri,
    type: 'image/jpeg',
    name: uri.split('/').pop(),
  };
  formData.append('image', photo);
  let config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      accept: 'application/json',
    },
  };

  const response = await apiInstance.post(
    API_ENDPOINTS.abbyFineReaderApi,
    formData,
    config,
  );
  return response;
};

export const getWaitlistRecord = async (id,token) => {
  let config = {
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
  };
  config.headers['X-AUTH-TOKEN'] = token; //'d73093e9e150698b9f086a1ca5144623bedb101f20ec3c41bc11539744cf8988f2768b5290a3fde97a0e8e4b2cd34ec17b4c6012c07ac0119c4d0ed8e15dab6c';
  let URL = API_ENDPOINTS.getWaitlist + '?eventid='+id;
  console.log(URL)
  const response = await apiInstance.get(URL, config);
  return response;
};
