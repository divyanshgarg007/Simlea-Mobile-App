import * as APP_COMPONENT_ACTION_TYPES from './actionsType/appComponentActionType.js';

// export const makeDatabaseIsReadyTrue = () => {
//   console.log('makeDatabaseIsReadyTrue is executed');
//   return {
//     type: APP_COMPONENT_ACTION_TYPES.MAKE_DB_IS_READY_TRUE,
//   };
// };

// export const makeDatabaseIsReadyFalse = () => {
//   console.log('makeDatabaseIsReadyFalse is executed');
//   return {
//     type: APP_COMPONENT_ACTION_TYPES.MAKE_DB_IS_READY_FALSE,
//   };
// };

export const toggleTheme = () => {
  // console.log('hey action');
  return {
    type: APP_COMPONENT_ACTION_TYPES.TOGGLE_THEME,
  };
};
