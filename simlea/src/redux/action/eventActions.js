/* eslint-disable prettier/prettier */
import {EVENT_ACTION_TYPES} from './actionsType';
import * as eventServices from '../../services/eventServices';

import * as eventDAO from '../../database/Tables/eventDAO';
import {APLLICATION_RECORD} from '../../database/Constants';

const checkEventRequest = () => {
  return {
    type: EVENT_ACTION_TYPES.EVENT_LIST_REQUEST,
  };
};

const checkEventSuccess = data => {
  return {
    type: EVENT_ACTION_TYPES.EVENT_LIST_SUCCESS,
    payload: data,
  };
};

const checkEventFailure = error => {
  return {
    type: EVENT_ACTION_TYPES.EVENT_LIST_FAILURE,
    payload: error,
  };
};

export const updateActiveEventId = eventId => {
  console.log(eventId);

  return {
    type: EVENT_ACTION_TYPES.UPDATE_ACTIVE_EVENT_ID,
    eventId: eventId,
  };
};

export const checkEventAction = (data, onErrorEvent) => async dispatch => {
  try {
    const responseData = await eventServices.checkEvent(data);
    //console.log('kejfuhje');
    //console.log(responseData?.status);
    //console.log(responseData?.data?.success);

    if (responseData?.status === 200 && responseData?.data?.success) {
      //console.log('action opennnnnnnnnnnnnnn');
      //console.log(responseData);

      let res = await eventDAO.getEventByEventId(
        responseData,
        data.code,
        dispatch,
      );
      //console.log('action closeeeeeeeeeeeeee', res);
      return 'success';
    } else {
      onErrorEvent(responseData?.data);
      return false;
      //return 'error response in api';
    }
  } catch (error) {
    //console.log(error);
    onErrorEvent(error?.response?.data);
    return false;
  }
};

///Delete Event
export const deleteEventRequest = id => {
  return {
    type: EVENT_ACTION_TYPES.EVENT_DELETE_SUCCESS,
    payload: id,
  };
};
// export const deleteEventAction = eventId => async dispatch => {
//   console.log('iiiii2222', eventId);
//   eventDAO.deleteEventByID(eventId, dispatch);
//   //dispatch(deleteEventRequest(id));
// };

///Event form list
const eventFormListRequest = () => {
  return {
    type: EVENT_ACTION_TYPES.EVENT_FORM_LIST_REQUEST,
  };
};

export const eventFormListSuccess = data => {
  //console.log('eventFormListSuccess');
  return {
    type: EVENT_ACTION_TYPES.EVENT_FORM_LIST_SUCCESS,
    payload: data,
  };
};

const eventFormListFailure = error => {
  return {
    type: EVENT_ACTION_TYPES.EVENT_FORM_LIST_FAILURE,
    payload: error,
  };
};

export const eventFormListAction = id => async dispatch => {
  dispatch(eventFormListRequest());
  try {
    const responseData = await eventServices.eventFormList(id);
    if (responseData?.status === 200) {
      dispatch(eventFormListSuccess(responseData?.data));
    } else {
      dispatch(eventFormListFailure(responseData?.data));
    }
  } catch (error) {
    dispatch(eventFormListFailure(error?.response?.data));
  }
};

export const eventReportListAction =
  (id, onSuccess, onError) => async dispatch => {
    try {
      const token = APLLICATION_RECORD.CURRENT_USER.token;
      const responseData = await eventServices.eventReport(id, token);
      if (responseData?.status === 200) {
        onSuccess(responseData?.data);
      } else {
        onError(responseData?.data);
      }
    } catch (error) {
      onError(error?.response?.data);
    }
  };
