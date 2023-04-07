/* eslint-disable prettier/prettier */
const AUTH_ACTION_TYPES = {
    LOGIN_REQUEST: 'LOGIN_REQUEST',
    LOGIN_FAILURE: 'LOGIN_FAILURE',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',

    LOGIN_CLEANUP_FAILURE: 'LOGIN_CLEANUP_FAILURE',
    DELETE_EVENT_IN_NEW_LOGIN_API: 'DELETE_EVENT_IN_NEW_LOGIN_API',
    SET_USER_LANGUAGE: 'SET_USER_LANGUAGE',
    USER_LOGGED_OUT: 'USER_LOGGED_OUT',
    SET_ACCOUNT_ID: 'SET_ACCOUNT_ID',
    UPDATE_STATUS_OF_USER: 'UPDATE_STATUS_OF_USER'
};
export default AUTH_ACTION_TYPES;
//export const UPDATE_STATUS_OF_USER = 'UPDATE_STATUS_OF_USER';