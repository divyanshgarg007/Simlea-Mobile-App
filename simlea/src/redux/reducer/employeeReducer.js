/* eslint-disable prettier/prettier */
import { EMPLOYEE_ACTION_TYPES } from '../action/actionsType';

const initialState = {
    employeeList: {
        loading: false,
        data: [],
        error: null,
    },
};
const employeeReducer = (state = initialState, action) => {
    switch (action.type) {
        case EMPLOYEE_ACTION_TYPES.EMPLOYEE_LIST_REQUEST:
            return {
                ...state,
                employeeList: {
                    ...state.employeeList,
                    data: [],
                    loading: true,
                    error: null,
                },
            };
        case EMPLOYEE_ACTION_TYPES.EMPLOYEE_LIST_SUCCESS:
            return {
                ...state,
                employeeList: {
                    ...state.employeeList,
                    data: action.payload,
                    loading: false,
                    error: null,
                },
            };
        case EMPLOYEE_ACTION_TYPES.EMPLOYEE_LIST_FAILURE:
            return {
                ...state,
                employeeList: {
                    ...state.employeeList,
                    data: null,
                    loading: false,
                    error: action.payload,
                },
            };
        default:
            return state;
    }
};

export default employeeReducer;
