/* eslint-disable prettier/prettier */
import {EVENT_ACTION_TYPES} from '../action/actionsType';

const initialState = {
  eventList: {
    loading: false,
    data: [],
    error: null,
  },
  eventFormList: {
    loading: false,
    data: [],
    error: null,
  },
  eventListFromSQL: {
    loading: false,
    data: [],
    error: null,
  },
  activeEventId: null,
};
const eventReducer = (state = initialState, action) => {
  switch (action.type) {
    case EVENT_ACTION_TYPES.UPDATE_ACTIVE_EVENT_ID:
      return {
        ...state,
        activeEventId: action.eventId,
      };
    case EVENT_ACTION_TYPES.EVENT_LIST_REQUEST:
      return {
        ...state,
        eventList: {
          ...state.eventList,
          data: state.eventList.data,
          loading: true,
          error: null,
        },
      };
    case EVENT_ACTION_TYPES.EVENT_LIST_SUCCESS:
      let filterEventData = state?.eventListFromSQL?.data?.filter(
        data => data?.remote_id === action?.payload,
      );
      console.log('filterEventData', filterEventData);
      return {
        ...state,
        eventList: {
          ...state.eventList,
          data: action.payload,
          loading: false,
          error: null,
        },
      };
    case EVENT_ACTION_TYPES.EVENT_LIST_FAILURE:
      return {
        ...state,
        eventList: {
          ...state.eventList,
          //data: null,
          loading: false,
          error: action.payload,
        },
      };

    ///Event Delete
    case EVENT_ACTION_TYPES.EVENT_DELETE_SUCCESS:
      let filterDeleteEvent = state?.eventList?.data?.filter(
        data => data?.eventId !== action?.payload,
      );
      console.log(
        state?.eventList?.data,
        state?.eventListFromSQL?.data,
        'filterDeleteEvent',
      );
      return {
        ...state,
        eventList: {
          ...state.eventList,
          data: filterDeleteEvent,
          loading: false,
          error: null,
        },
      };

    ////Event Form list
    case EVENT_ACTION_TYPES.EVENT_FORM_LIST_REQUEST:
      return {
        ...state,
        eventFormList: {
          ...state.eventFormList,
          data: [],
          loading: true,
          error: null,
        },
      };
    case EVENT_ACTION_TYPES.EVENT_FORM_LIST_SUCCESS:
      return {
        ...state,
        eventFormList: {
          ...state.eventFormList,
          data: action.payload,
          loading: false,
          error: null,
        },
      };
    case EVENT_ACTION_TYPES.EVENT_FORM_LIST_FAILURE:
      return {
        ...state,
        eventFormList: {
          ...state.eventFormList,
          data: null,
          loading: false,
          error: action.payload,
        },
      };

    // EVENT LIST STORE FROM SQL
    case EVENT_ACTION_TYPES.SQL_EVENT_LIST_SUCCESS:
      //   console.log('from reduser ');
      let arry = [];

      arry = [...action.payload];
      return {
        ...state,
        eventListFromSQL: {
          ...state.eventListFromSQL,
          data: arry,
          loading: false,
          error: null,
        },
      };
    default:
      return state;
  }
};

export default eventReducer;
