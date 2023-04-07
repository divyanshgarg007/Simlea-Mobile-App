/* eslint-disable prettier/prettier */
import {AUTH_ACTION_TYPES} from './actionsType';
import * as authServices from '../../services/authServices';
import * as userDAO from '../../database/Tables/userDao';
import NetInfo from '@react-native-community/netinfo';
import {APLLICATION_RECORD} from '../../database/Constants';
import * as eventDAO from '../../database/Tables/eventDAO';

const initialState = {
  network: false,
};

const loginRequest = () => {
  return {
    type: AUTH_ACTION_TYPES.LOGIN_REQUEST,
  };
};

export const deleteEventActionForNewLogin = id => async dispatch => {
  console.log('deleteEventActionForNewLogin is called');
  eventDAO.deleteEventByID(id, dispatch);
};
export const eventDeleteInNewLoginApi = data => {
  console.log('eventDeleteInNewLoginApi is called');
  console.log(data);
  return {
    type: AUTH_ACTION_TYPES.DELETE_EVENT_IN_NEW_LOGIN_API,
    payload: data,
  };
};

const loginSuccess = (data, event) => {
  return {
    type: AUTH_ACTION_TYPES.LOGIN_SUCCESS,
    payload: data,
    event: event,
  };
};

const loginFailure = error => {
  return {
    type: AUTH_ACTION_TYPES.LOGIN_FAILURE,
    payload: error,
  };
};

export const checkEventAction = data => async dispatch => {
  console.log('checkEventAction is called');
  console.log(data.eventId);
  console.log(data);
  let newData = {data: data};

  try {
    let res = await eventDAO.getEventByEventId(newData, 'testing', dispatch);
    //console.log('action closeeeeeeeeeeeeee', res);
    return 'success';
  } catch (error) {
    console.log(error);
    // onErrorEvent(error?.response?.data);
    return false;
  }
};

export const loginAction = (data, onError) => async dispatch => {
  console.log('loginActionis executed');
  dispatch(loginRequest());
  try {
    const responseData = await authServices.login(data);
    // console.log('update the user details', responseData);
    if (responseData?.status === 200 && responseData?.data?.success) {
      responseData.data.events.forEach((singleEvents, index) => {
        dispatch(checkEventAction(singleEvents));
      });
      dispatch(loginSuccess(responseData?.data));
    } else {
      console.log('eroror');
      onError(responseData?.data);
    }
  } catch (error) {
    console.log(error);

    onError(error?.response?.data);
  }
};

export const loginActionUpdate =
  (data, onError, event, network, user) => async dispatch => {
    dispatch(loginRequest());
    try {
      if (network) {
        const responseData = await authServices.login(data);

        console.log('update the user details', responseData);
        if (responseData?.status === 200 && responseData?.data?.success) {
          let populateUserObject = await userDAO.populateUserObject(
            data.eventid,
            data.username,
            data.password,
            responseData?.data,
          );
          //console.log('update the user details2', responseData?.data);
          APLLICATION_RECORD.APP_USER_ID = populateUserObject.id;
          APLLICATION_RECORD.APP_EVENT_ID = event;
          APLLICATION_RECORD.CURRENT_USER = populateUserObject;
          dispatch(loginSuccess(populateUserObject, event));
        } else {
          onError(responseData?.data);
        }
      } else {
        let checkPassword = await userDAO.paawordcompire(
          data?.password,
          user?.password,
        );
        if (checkPassword) {
          APLLICATION_RECORD.APP_USER_ID = user.id;
          APLLICATION_RECORD.APP_EVENT_ID = event;
          APLLICATION_RECORD.CURRENT_USER = user;
          dispatch(loginSuccess(user, event));
        }
        //console.log('user with checkPassword method', checkPassword);
      }
    } catch (error) {
      onError(error?.response?.data);
    }
  };

//USER LOGOUT ACTION
export const logoutAction = data => {
  // console.log('signInData', data);
  return {
    type: AUTH_ACTION_TYPES.USER_LOGGED_OUT,
    payload: undefined,
  };
};
export const updateStatusOfUserInReducer = value => {
  console.log('hey action' + value);
  return {
    type: AUTH_ACTION_TYPES.UPDATE_STATUS_OF_USER,
    data: value,
  };
};

///Set User Language
export const setLanguage = data => {
  return {
    type: AUTH_ACTION_TYPES.SET_USER_LANGUAGE,
    payload: data,
  };
};
