/* eslint-disable prettier/prettier */
import * as APP_COMPONENT_ACTION_TYPES from '../action/actionsType/appComponentActionType.js';

const initialState = {
  activeTheme: 'light',
};
const appComponentReducer = (state = initialState, action) => {
  switch (action.type) {
    // case APP_COMPONENT_ACTION_TYPES.MAKE_DB_IS_READY_TRUE:
    //   console.log('MAKE_DB_IS_READY_TRUE part is execting');
    //   return {
    //     dbIsReady: true,
    //   };

    // case APP_COMPONENT_ACTION_TYPES.MAKE_DB_IS_READY_FALSE:
    //   console.log('MAKE_DB_IS_READY_FALSE part is execting');
    //   return {
    //     dbIsReady: false,
    //   };

    case APP_COMPONENT_ACTION_TYPES.TOGGLE_THEME: {
      // console.log('Hey reducer');
      if (state.activeTheme === 'light') {
        return {
          ...state,
          activeTheme: 'dark',
        };
      } else {
        return {
          ...state,
          activeTheme: 'light',
        };
      }
    }



    default:
      return state;
  }
};

export default appComponentReducer;
