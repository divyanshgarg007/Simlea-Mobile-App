/* eslint-disable prettier/prettier */
import { AUTH_ACTION_TYPES } from '../action/actionsType';

const initialState = {
  signIn: {
    loading: false,
    data: null,
    error: null,
  },
  //event: {},
  language: 'en',
  activeTheme: 'light',
};
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_ACTION_TYPES.LOGIN_REQUEST:
      return {
        ...state,
        signIn: {
          ...state.signIn,
          data: null,
          loading: true,
          error: null,
        },
      };

    case AUTH_ACTION_TYPES.DELETE_EVENT_IN_NEW_LOGIN_API:
      let tempArray = [...state.signIn.data.events];
      let filteredArray = tempArray.filter(item => item.eventId != action.payload)
      console.log(filteredArray);
      return {
        ...state,
        signIn: {
          ...state.signIn,
          data: {
            ...state.signIn.data,

            events: filteredArray,

          }
        },
        loading: false,
        error: null,
        // event: action.event,
      };

    case AUTH_ACTION_TYPES.LOGIN_SUCCESS:
      return {
        ...state,
        signIn: {
          ...state.signIn,
          data: action.payload,
          loading: false,
          error: null,
        },
        // event: action.event,
      };
    case AUTH_ACTION_TYPES.LOGIN_FAILURE:
      return {
        ...state,
        signIn: {
          ...state.signIn,
          data: null,
          loading: false,
          error: action.payload,
        },
      };

    case AUTH_ACTION_TYPES.UPDATE_STATUS_OF_USER: {
      console.log('Hey reducer' + action.data);
      return {
        ...state,
        signIn: {
          ...state.signIn,
          data: {
            ...state.signIn.data,
            status: action.data,
          }
        },

      };

    }

    case AUTH_ACTION_TYPES.USER_LOGGED_OUT:
      return {
        ...state,
        signIn: {
          ...state.signIn,
          data: null,
          loading: false,
          error: null,
        },
        // event: {},
      };

    case AUTH_ACTION_TYPES.SET_USER_LANGUAGE:
      return {
        ...state,
        language: action.payload,
      };

    default:
      return state;
  }
};

export default authReducer;
