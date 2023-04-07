import * as FORM_ACTION_TYPE from './actionsType/formActionType.js';
import * as formActionService from '../../database/FormActionDataService';
import {NAVIGATION} from '../../constants';

export const modifyElemntData = currentRecievedElementData => {
  // //console.log('modifyElemntData hefwuhe');
  // //console.log(currentRecievedElementData);
  //  let elementParsed = JSON.stringify(currentRecievedElementData);
  //console.log(currentRecievedElementData);
  let arrayy = [];
  const obj = {};

  //let elementParse = JSON.parse(currentRecievedElementData.elements);
  const recurseElements = element => {
    if (element.hasOwnProperty('children') && element.children.length > 0) {
      if (element.hasOwnProperty('items') && element.type == 'collection') {
        element.items.forEach((singleElementItem, index) => {
          if (index == 0) {
            Object.keys(singleElementItem).forEach(singleKeyItem => {
              obj[singleKeyItem] = '';
            });
            element.children.forEach(recurseElements);
          }
        });
      } else {
        element.children.forEach(recurseElements);
      }
    } else {
      if (
        !element.name == '' &&
        !element.name == '' &&
        !obj.hasOwnProperty(element.name)
      ) {
        //arrayy.push(element.name);
        obj[element.name] = element.value;
      }
    }
  };
  currentRecievedElementData.forEach(recurseElements);

  arrayy[0] = obj;
  return {
    type: FORM_ACTION_TYPE.UPDATE_ELEMENTS_ON_FIRST_TIME_FORM_OPENING,
    payLoad: currentRecievedElementData,
    formId: null,
    keyArray: arrayy,
  };
};

export const modifyElemntDataForFormEdit = currentRecievedElementData => {
  console.log(currentRecievedElementData);
  // let elementParsed = JSON.stringify(currentRecievedElementData);
  let arrayy = [];
  const obj = {};
  // let elementParse = JSON.parse(currentRecievedElementData.elements)
  const recurseElements = element => {
    if (element.hasOwnProperty('children') && element.children.length > 0) {
      if (element.hasOwnProperty('items') && element.type == 'collection') {
        element.items.forEach((singleElementItem, index) => {
          if (index == 0) {
            Object.keys(singleElementItem).forEach(singleKeyItem => {
              if (singleKeyItem != 'id' && singleKeyItem != 'record_id') {
                let tArray = [];
                tArray[0] = singleElementItem[singleKeyItem];
                obj[singleKeyItem] = tArray;
              }
            });
            element.children.forEach(recurseElements);
          } else {
            Object.keys(singleElementItem).forEach(singleKeyItem => {
              if (singleKeyItem != 'id' && singleKeyItem != 'record_id') {
                let tArray = [...obj[singleKeyItem]];
                tArray[index] = singleElementItem[singleKeyItem];
                obj[singleKeyItem] = tArray;
              }
            });
            element.children.forEach(recurseElements);
          }
        });
      } else {
        element.children.forEach(recurseElements);
      }
    } else {
      if (
        !element.name == '' &&
        !element.name == '' &&
        !obj.hasOwnProperty(element.name)
      ) {
        //arrayy.push(element.name);
        obj[element.name] = element.value;
      }
    }
  };
  currentRecievedElementData.forEach(recurseElements);
  arrayy[0] = obj;
  return {
    type: FORM_ACTION_TYPE.UPDATE_ELEMENTS_ON_FIRST_TIME_FORM_OPENING,
    payLoad: currentRecievedElementData,
    formId: null,
    keyArray: arrayy,
  };
};

export const updateFormEditToTrue = () => {
  //console.log('updateCollectionDataToReducers is executed');
  return {
    type: FORM_ACTION_TYPE.MAKE_TRUE_FOR_FORM_EDIT,
  };
};

export const resetValuesOfChildrenForSpecificElement = elementChildrenData => {
  //console.log('resetValuesOfChildrenForSpecificElement is executed');
  let arrayOfElementsNameOfSpecificConatiner = [];
  const recurseElements2 = element => {
    if (element.hasOwnProperty('children') && element.children.length > 0) {
      element.children.forEach(recurseElements2);
    } else {
      if (!element.name == '') {
        arrayOfElementsNameOfSpecificConatiner.push(element.name);
      }
    }
  };
  elementChildrenData.forEach(recurseElements2);
  return {
    type: FORM_ACTION_TYPE.RESET_CHILDREN_VALUES_FOR_SPECIFIC_ELEMENT_CONTAINER,
    childrenElementsNameHolder: arrayOfElementsNameOfSpecificConatiner,
  };
};

export const updateModifiedValuesForFormEdit = data => {
  //console.log('updateModifiedValuesForFormEdit is executed');
  //console.log(data);
  return {
    type: FORM_ACTION_TYPE.UPDATE_VALUES_ARRAY_FOR_FORM_EDIT_REQUIREMENTS,
    data: data,
  };
};

export const makeAllStateAsInitialForFormReducer = () => {
  //console.log('makeAllStateAsInitialForFormReducer is executed');
  return {
    type: FORM_ACTION_TYPE.MAKE_ALL_STATE_AS_INITIAL_FOR_FORM_REDUCER,
  };
};

export const updateActiveFormLanguageMethod = data => {
  //console.log('updateActiveFormLanguageMethod is executed');
  return {
    type: FORM_ACTION_TYPE.UPDATE_ACTIVE_FORM_LANGUAGE,
    data: data,
  };
};

export const makeScrollAbleWhenSignaturePadIsInActive = () => {
  //console.log('makeScrollAbleWhenSignaturePadIsInActive is executed');
  return {
    type: FORM_ACTION_TYPE.MAKE_SCROLL_ABLE_WHEN_SIGNATURE_PAD_IS_INACTIVE,
  };
};

export const makeScrollDisableWhenSignaturePadIsActive = () => {
  //console.log('makeScrollDisableWhenSignaturePadIsActive is executed');
  return {
    type: FORM_ACTION_TYPE.MAKE_SCROLL_DISABLE_WHEN_SIGNATURE_PAD_IS_ACTIVE,
  };
};

export const makeHideSubmitFormIndicatorToTrue = () => {
  //console.log('makeHideSubmitFormIndicatorToTrue is executed');
  return {
    type: FORM_ACTION_TYPE.MAKE_HIDE_SUBMIT_FORM_INDICATOR_TRUE,
  };
};

export const makeHideSubmitFormIndicatorToFalse = () => {
  //console.log('makeHideSubmitFormIndicatorToFalse is executed');
  return {
    type: FORM_ACTION_TYPE.MAKE_HIDE_SUBMIT_FORM_INDICATOR_FALSE,
  };
};

export const makeShowErrorTrueForFormElements = () => {
  //console.log('makeShowErrorTrueForFormElements is executed');
  return {
    type: FORM_ACTION_TYPE.MAKE_SHOW_ERROR_TRUE_FOR_FORM_ELEMENTS,
  };
};

export const updateElementOnFirstOpeningOfApp = currentRecievedElementData => {
  //console.log('updateElementOnFirstOpeningOfApp is executed');
  return {
    type: FORM_ACTION_TYPE.UPDATE_ELEMENTS_ON_FIRST_TIME_FORM_OPENING,
    payLoad: currentRecievedElementData,
  };
};

export const addModificationOfElementsAfterNewTabIsRemoved = (
  activeIndex,
  childrenData,
  collectionName,
) => {
  //console.log('addModificationOfElementsAfterNewTabIsRemoved is executed');

  return {
    type: FORM_ACTION_TYPE.UPDATE_FORM_ELEMENTS_WHEN_NEW_TAB_IS_REMOVED_IN_COLLECTION,
    childrenData: childrenData,
    activeIndex: activeIndex,
    collectionName: collectionName,
  };
};

export const addModificationOfElementsAfterNewTabIsAdded = (
  activeIndex,
  childrenData,
  collectionName,
) => {
  //console.log('addModificationOfElementsAfterNewTabIsAdded is excuted');
  return {
    type: FORM_ACTION_TYPE.UPDATE_FORM_ELEMENTS_WHEN_NEW_TAB_IS_ADDED_IN_COLLECTION,
    childrenData: childrenData,
    activeIndex: activeIndex,
    collectionName: collectionName,
  };
};

export const updateDataOfInputAfterTypingByUser = (
  inputData,
  elementName,
  collectionData,
) => {
  return {
    type: FORM_ACTION_TYPE.UPDATE_DATA_AFTER_USER_WRITES_IN_INPUT_FIELD,
    inputData: inputData,
    elementName: elementName,
    collectionData: collectionData,
  };
};

export const updateValidityOfSingleElementToTrue = singleElementData => {
  //console.log('updateValidityOfSingleElementToTrue is executed');
  return {
    type: FORM_ACTION_TYPE.UPDATE_VALIDITY_OF_SINGLE_ELEMENT_TO_TRUE,
    singleElementData: singleElementData,
  };
};

export const updateValidityOfSingleElementToFalse = singleElementData => {
  //console.log('updateValidityOfSingleElementToFalse is executed');
  return {
    type: FORM_ACTION_TYPE.UPDATE_VALIDITY_OF_SINGLE_ELEMENT_TO_FALSE,
    singleElementData: singleElementData,
  };
};

export const updateValuesOfOCRAndBadgeAndBarcodeElement = (
  scannedData,
  collectionData,
  liveFormDataElements,
) => {
  //console.log('updateValuesOfOCRAndBadgeAndBarcodeElement is executed');
  // //console.log(collectionData[0].collectionName);
  //console.log(liveFormDataElements);
  let collectionChildrenData = [];

  const recurseElements = element => {
    if (element.type == 'collection' && element.hasOwnProperty('children')) {
      //console.log(element.children);
      //collectionChildrenData = collectionChildrenData.push(element.children);
      collectionChildrenData = [...collectionChildrenData, ...element.children];
      element.children.forEach(recurseElements);
    } else {
      if (element.hasOwnProperty('children')) {
        element.children.forEach(recurseElements);
      }
    }
  };

  liveFormDataElements.forEach(recurseElements);
  let collectionChildrenDataArray = [];

  //console.log(collectionChildrenData);

  const recurseElements2 = element => {
    //console.log('recurseElements2');
    if (element.hasOwnProperty('children') && element.children.length > 0) {
      element.children.forEach(recurseElements2);
    } else {
      if (!element.name == '') {
        collectionChildrenDataArray.push(element.name);
      }
    }
  };
  collectionChildrenData.forEach(recurseElements2);

  return {
    type: FORM_ACTION_TYPE.UPDATE_VALUES_OF_OCR_AND_BADGE_AND_BARCODE_ELEMENT,
    scannedData: scannedData,
    collectionData: collectionData,
    collectionChildrenDataArray: collectionChildrenDataArray,
  };
};

// export const updateErrorMessageOfSingleElements = (
//   singleElementData,
//   errorMessage,
// ) => {
//   let result = {};
//   const recurseElements = element => {
//     //    if ((element.type == 'columns' && element.hasOwnProperty('children') && element.children.length > 0 ) || (element.type == 'collection' && element.hasOwnProperty('children') && element.children.length > 0))
//     if (element.hasOwnProperty('children') && element.children.length > 0) {
//       element.children.forEach(recurseElements);
//     } else {
//       if (element.id == singleElementData.id) {
//         element.element_is_valid = false;
//         element.element_error_message = errorMessage;
//       } else {
//         element;
//       }
//     }
//   };
//   liveFormDataElements.forEach(recurseElements);
//   return {
//     type: FORM_ACTION_TYPE.UPDATE_ERROR_MESSAGE_OF_SINGLE_ELEMENT,
//     allElementData: liveFormDataElements,
//   };
// };

export const checkDraftClickButtonExecution = () => {
  //console.log('checkDraftClickButtonExecution is executing');
  return (dispatch, getState) => {
    dispatch(makeFormSubmittingToTrue());
  };
};

// export const submitFormDataAction = async (data) => {
//   alert('sad')
//   try {
//     const response = await formServices.submitFormDataActionService(data);
//     if (response?.status === 200) {
//       let result;
//                     result = JSON.parse(response?.data);
//                 if (result && result.success) {
//                     return this.formDao.setRemoteRecordIds(
//                         result.data,
//                         result.syncDate
//                     );
//                 }
//     } else {
//     }
// } catch (error) {
//     return error?.response?.data;
// }
// }

export const formSubmitClickMethod = (navigation, record, form) => {
  console.log('formSubmitClickMethod is executing');
  return (dispatch, getState) => {
    dispatch(makeShowErrorTrueForFormElements());
    let flagForErrorExistence = false;
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    let valuesHolderOfElements =
      getState().rootReducers.formReducer.valuesHolderOfElements[0];
    let liveFormDataElementsCopy = [
      ...getState().rootReducers.formReducer.liveFormDataElements,
    ];

    // let liveFormDataElementsCopy =
    let iterationCount = 0;
    let arrayElementCount = Object.keys(valuesHolderOfElements).length;
    console.log(valuesHolderOfElements);
    const recurseElements = element => {
      if (element.hasOwnProperty('children') && element.children.length > 0) {
        if (element.type == 'collection' && element.hasOwnProperty('items')) {
          element.items.map((singleElementItem, indexx) => {
            Object.keys(singleElementItem).map((singleKeyItem, index) => {
              if (singleKeyItem != 'id' && singleKeyItem != 'record_id') {
                element.items[indexx][singleKeyItem] =
                  valuesHolderOfElements[singleKeyItem][indexx];
              }

              if (
                indexx == element.items.length - 1 &&
                index == Object.keys(singleElementItem).length - 1
              ) {
                // iterationCount = iterationCount + Object.keys(singleElementItem).length;
                element.children.forEach(recurseElements);
              }
            });
          });
        } else {
          element.children.forEach(recurseElements);
        }
      } else {
        if (
          !element.name == '' &&
          valuesHolderOfElements.hasOwnProperty(element.name)
        ) {
          if (!Array.isArray(valuesHolderOfElements[element.name])) {
            //            flagForErrorExistence = true;

            element.value = valuesHolderOfElements[element.name];
          } else {
            element.value = '';
          }
          if (
            element.required == true &&
            (valuesHolderOfElements[element.name] == '' ||
              (typeof valuesHolderOfElements[element.name] == 'array' &&
                valuesHolderOfElements[element.name].indexOf('') > -1))
          ) {
            console.log(element);
            flagForErrorExistence = true;
          }

          if (element.type == 'email') {
            if (Array.isArray(valuesHolderOfElements[element.name])) {
              for (
                let i = 0;
                i <= valuesHolderOfElements[element.name].length - 1;
                i++
              ) {
                if (
                  reg.test(valuesHolderOfElements[element.name][i]) === false
                ) {
                  if (
                    element.required == true &&
                    valuesHolderOfElements[element.name] != '' &&
                    valuesHolderOfElements[element.name] != null
                  ) {
                    flagForErrorExistence = true;
                  }
                }
              }
            } else {
              if (reg.test(valuesHolderOfElements[element.name]) == false) {
                if (
                  element.required == true &&
                  valuesHolderOfElements[element.name] != '' &&
                  valuesHolderOfElements[element.name] != null
                ) {
                  flagForErrorExistence = true;
                }
              }
            }
          }

          iterationCount = iterationCount + 1;
          console.log(iterationCount);
          console.log(arrayElementCount);
          console.log(flagForErrorExistence);
          if (iterationCount == arrayElementCount) {
            if (flagForErrorExistence == false) {
              //arrayElementCount
              dispatch(makeHideSubmitFormIndicatorToTrue());
              console.log('jhdsjhf', record);
              console.log('liveFormDataElementsCopy', liveFormDataElementsCopy);
              let isDraft = 0;
              // jhdsjhf {"_data": [0, 1675429758000, "ts2-Test2-82-0008", 1675423948000, 9], "_displayText": "", "draft": 0, "id": 9, "lead_id": "ts2-Test2-82-0008", "sync_on": 1675429758000, "timestamp": 1675423948000}
              let formStatus = formActionService.checkSave(
                liveFormDataElementsCopy,
                record,
                form,
                isDraft,
              );

              navigation.navigate(NAVIGATION.dashboard);
            } else {
              dispatch(makeHideSubmitFormIndicatorToTrue());
            }
          }
        }
      }
    };

    //    //console.log(liveFormDataElements);

    //   recurseElements = element => {
    //     if (element.hasOwnProperty('children') && element.children.length > 0) {
    //       element.children.forEach(recurseElements);
    //     } else {
    //       if (element.name != '') {
    //         iterationCount = iterationCount + 1;
    //       }

    //       if (element.required == true &&(valuesHolderOfElements[0][element.name] == '' ||(typeof valuesHolderOfElements[0][element.name] === 'array' && valuesHolderOfElements[0][element.name].length == 0)))
    //       {
    //         flagForErrorExistence = true;

    //       }
    //       else {

    //     }
    //   };
    // };

    liveFormDataElementsCopy.forEach(recurseElements);
  };
};

export const draftSubmitMethod = (navigation, record, form, isDraft) => {
  return (dispatch, getState) => {
    //  dispatch(makeShowErrorTrueForFormElements());
    let flagForErrorExistence = false;
    let valuesHolderOfElements =
      getState().rootReducers.formReducer.valuesHolderOfElements[0];
    let liveFormDataElementsCopy = [
      ...getState().rootReducers.formReducer.liveFormDataElements,
    ];

    // let liveFormDataElementsCopy =
    let iterationCount = 0;
    let arrayElementCount = Object.keys(valuesHolderOfElements).length;

    const recurseElements = element => {
      if (element.hasOwnProperty('children') && element.children.length > 0) {
        if (element.type == 'collection' && element.hasOwnProperty('items')) {
          element.items.map((singleElementItem, indexx) => {
            Object.keys(singleElementItem).map((singleKeyItem, index) => {
              if (singleKeyItem != 'id' && singleKeyItem != 'record_id') {
                element.items[indexx][singleKeyItem] =
                  valuesHolderOfElements[singleKeyItem][indexx];
              }

              if (
                indexx == element.items.length - 1 &&
                index == Object.keys(singleElementItem).length - 1
              ) {
                // iterationCount = iterationCount + Object.keys(singleElementItem).length;
                element.children.forEach(recurseElements);
              }
            });
          });
        } else {
          element.children.forEach(recurseElements);
        }
      } else {
        if (
          !element.name == '' &&
          valuesHolderOfElements.hasOwnProperty(element.name)
        ) {
          if (!Array.isArray(valuesHolderOfElements[element.name])) {
            element.value = valuesHolderOfElements[element.name];
          } else {
            element.value = '';
          }
          iterationCount = iterationCount + 1;
          console.log('isDraft' + isDraft);

          if (iterationCount == arrayElementCount) {
            if (flagForErrorExistence == false) {
              dispatch(makeHideSubmitFormIndicatorToTrue());
              let draftIsTrue = 1;
              //  alert('isDraft' + isDraft);
              let formStatus = formActionService.checkSave(
                liveFormDataElementsCopy,
                record,
                form,
                draftIsTrue,
              );

              navigation.navigate(NAVIGATION.dashboard);
            } else {
              dispatch(makeHideSubmitFormIndicatorToTrue());
            }
          }
        }
      }
    };

    liveFormDataElementsCopy.forEach(recurseElements);
  };
};
