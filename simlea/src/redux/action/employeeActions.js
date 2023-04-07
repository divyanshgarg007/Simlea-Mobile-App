/* eslint-disable prettier/prettier */
import { EMPLOYEE_ACTION_TYPES } from './actionsType';
import * as employeeServices from '../../services/employeeServices';

const employeeListRequest = () => {
    return {
        type: EMPLOYEE_ACTION_TYPES.EMPLOYEE_LIST_REQUEST,
    };
};

const employeeListSuccess = data => {
    return {
        type: EMPLOYEE_ACTION_TYPES.EMPLOYEE_LIST_SUCCESS,
        payload: data,
    };
};

const employeeListFailure = error => {
    return {
        type: EMPLOYEE_ACTION_TYPES.EMPLOYEE_LIST_FAILURE,
        payload: error,
    };
};

export const employeeAction = (data) => async dispatch => {
    dispatch(employeeListRequest());
    try {
        const responseData = await employeeServices.employeeList({ eventid: data });
        if (responseData?.status === 200) {
            dispatch(employeeListSuccess(responseData?.data));
        } else {
            dispatch(employeeListFailure(responseData?.data));
        }
    } catch (error) {
        dispatch(employeeListFailure(error?.response?.data));
    }
};
