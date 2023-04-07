/* eslint-disable prettier/prettier */
import * as FORM_ACTION_TYPE from '../action/actionsType/formActionType';

const initialState = {
    flagTrueIfItIsFormEditing: false,
    liveFormDataElements: [],
    valuesHolderOfElements: [],
    hideSubmitFormIndicator: false,
    showFormElementsError: false,
    activeFormId: null,
    activeFormLanguage: 'en',
    scrollAbleOrDisableWhenSignaturePadIsActive: true, //true means scroll is enabled.
};

const formReducer = (state = initialState, action) => {
    switch (action.type) {
        case FORM_ACTION_TYPE.MAKE_ALL_STATE_AS_INITIAL_FOR_FORM_REDUCER:
            // console.log(
            //     'MAKE_ALL_STATE_AS_INITIAL_FOR_FORM_REDUCER part is execting',
            // );
            return {
                ...state,

                liveFormDataElements: [],
                hideSubmitFormIndicator: false,
                activeFormId: null,
                showFormElementsError: false,
                activeFormLanguage: 'en',
                scrollAbleOrDisableWhenSignaturePadIsActive: true,
                valuesHolderOfElements: [],
                flagTrueIfItIsFormEditing: false,
            };
        case FORM_ACTION_TYPE.MAKE_TRUE_FOR_FORM_EDIT:
            // console.log(
            //     'UPDATE_COLLECTION_DATA_FOR_FORM_EDIT_REQUIREMENTS part is execting',
            // );
            return {
                ...state,
                flagTrueIfItIsFormEditing: true,
            };
        case FORM_ACTION_TYPE.MAKE_SHOW_ERROR_TRUE_FOR_FORM_ELEMENTS:
            //console.log('MAKE_SHOW_ERROR_TRUE_FOR_FORM_ELEMENTS part is execting');
            return {
                ...state,
                showFormElementsError: true,
            };

        case FORM_ACTION_TYPE.RESET_CHILDREN_VALUES_FOR_SPECIFIC_ELEMENT_CONTAINER:
            // console.log(
            //     'UPDATE_VALUES_ARRAY_FOR_FORM_EDIT_REQUIREMENTS part is execting',
            // );
            //console.log(action.childrenElementsNameHolder);
            //tempValuesHolderOfElements = JSON.parse(JSON.stringify([...state.valuesHolderOfElements]));
            tempValuesHolderOfElements = [...state.valuesHolderOfElements];
            action.childrenElementsNameHolder.forEach(singleElementName => {
                if (tempValuesHolderOfElements[0].hasOwnProperty([singleElementName])) {
                    tempValuesHolderOfElements[0][singleElementName] = '';
                }
            });
            return {
                ...state,
                valuesHolderOfElements: tempValuesHolderOfElements,
            };

        case FORM_ACTION_TYPE.UPDATE_VALUES_ARRAY_FOR_FORM_EDIT_REQUIREMENTS:
            return {
                ...state,
                valuesHolderOfElements: action.data,
            };

        case FORM_ACTION_TYPE.UPDATE_ACTIVE_FORM_LANGUAGE:
            //console.log('UPDATE_ACTIVE_FORM_LANGUAGE part is execting');
            return {
                ...state,
                activeFormLanguage: action.data,
            };

        case FORM_ACTION_TYPE.MAKE_SCROLL_ABLE_WHEN_SIGNATURE_PAD_IS_INACTIVE:
            // console.log(
            //     'MAKE_SCROLL_ABLE_WHEN_SIGNATURE_PAD_IS_INACTIVE part is execting',
            // );
            return {
                ...state,
                scrollAbleOrDisableWhenSignaturePadIsActive: true,
            };

        case FORM_ACTION_TYPE.MAKE_SCROLL_DISABLE_WHEN_SIGNATURE_PAD_IS_ACTIVE:
            // console.log(
            //     'MAKE_SCROLL_DISABLE_WHEN_SIGNATURE_PAD_IS_ACTIVE part is execting',
            // );
            return {
                ...state,
                scrollAbleOrDisableWhenSignaturePadIsActive: false,
            };

        case FORM_ACTION_TYPE.MAKE_HIDE_SUBMIT_FORM_INDICATOR_TRUE:
            //console.log('MAKE_HIDE_SUBMIT_FORM_INDICATOR_TRUE  is execting');
            return {
                ...state,
                hideSubmitFormIndicator: true,
            };

        case FORM_ACTION_TYPE.MAKE_HIDE_SUBMIT_FORM_INDICATOR_FALSE:
            //console.log('MAKE_HIDE_SUBMIT_FORM_INDICATOR_FALSE  is execting');
            return {
                ...state,
                hideSubmitFormIndicator: false,

            };

        case FORM_ACTION_TYPE.UPDATE_ELEMENTS_ON_FIRST_TIME_FORM_OPENING:
            //console.log(action.payLoad);
            // const obj = {};
            // console.log('UPDATE_ELEMENTS_ON_FIRST_FORM_OPENING part is execting');
            // action.keyArray.forEach((currentElement, index) => {
            //     obj[currentElement] = "";
            // });
            // let tempArray = [];
            // tempArray[0] = obj;
            return {
                ...state,
                liveFormDataElements: [...action.payLoad],
                activeFormId: action.formId,
                valuesHolderOfElements: action.keyArray,
            };

        case FORM_ACTION_TYPE.UPDATE_FORM_ELEMENTS_WHEN_NEW_TAB_IS_ADDED_IN_COLLECTION: {
            //console.log('UPDATE_FORM_ELEMENTS_WHEN_NEW_TAB_IS_ADDED_IN_COLLECTION');
            // console.log(action.collectionName);
            let arrayTemp = [...state.valuesHolderOfElements];
            let arrayTemp21 = [...state.liveFormDataElements];
            let obj = {};
            action.childrenData.forEach((singleChildrenData, index) => {
                if (singleChildrenData['name'] != "") {
                    if (Array.isArray(arrayTemp[0][singleChildrenData['name']])) {
                        let tempCollectionArray2 = [...arrayTemp[0][singleChildrenData['name']],
                        ];
                        tempCollectionArray2.push('');
                        arrayTemp[0][singleChildrenData['name']] = [...tempCollectionArray2];
                    } else {
                        let tempCollectionArray2 = ['', ''];
                        arrayTemp[0][singleChildrenData['name']] = [...tempCollectionArray2];
                    }
                }
            });

            const recurseElements2 = element => {
                if (element.hasOwnProperty('children') && element.children.length > 0) {
                    if (
                        element.hasOwnProperty('items') &&
                        element.type == 'collection' &&
                        element.name == action.collectionName
                    ) {
                        Object.keys(element.items[0]).forEach((singleKeyItem, indexxx) => {
                            obj[singleKeyItem] = '';
                            if (indexxx == Object.keys(element.items[0]).length - 1) {
                                element.items.push(obj);
                            }
                        });
                    } else {
                        element.children.forEach(recurseElements2);
                    }
                }
            };

            arrayTemp21.forEach(recurseElements2);

            return {
                ...state,
                valuesHolderOfElements: arrayTemp,
                liveFormDataElements: arrayTemp21,
            };
        }

        case FORM_ACTION_TYPE.UPDATE_FORM_ELEMENTS_WHEN_NEW_TAB_IS_REMOVED_IN_COLLECTION: {
            //console.log('UPDATE_FORM_ELEMENTS_WHEN_NEW_TAB_IS_REMOVED_IN_COLLECTION');
            let arrayTemp2 = [...state.valuesHolderOfElements];
            let arrayTemp212 = [...state.liveFormDataElements];
            action.childrenData.forEach((singleChildrenData, index) => {
                if (Array.isArray(arrayTemp2[0][singleChildrenData['name']])) {
                    let tempCollectionArray3 = [
                        ...arrayTemp2[0][singleChildrenData['name']],
                    ];
                    tempCollectionArray3.splice(action.activeIndex, 1);
                    arrayTemp2[0][singleChildrenData['name']] = [...tempCollectionArray3];
                } else {
                    let tempCollectionArray3 = [];

                    arrayTemp2[0][singleChildrenData['name']] = [...tempCollectionArray3];
                }
            });

            const recurseElements3 = element => {
                // console.log(action.activeIndex);
                if (element.hasOwnProperty('children') && element.children.length > 0) {
                    if (
                        element.hasOwnProperty('items') &&
                        element.type == 'collection' &&
                        element.name == action.collectionName
                    ) {
                        element.items.splice(action.activeIndex, 1);
                    } else {
                        element.children.forEach(recurseElements3);
                    }
                }
            };

            arrayTemp212.forEach(recurseElements3);

            return {
                ...state,
                valuesHolderOfElements: arrayTemp2,
                liveFormDataElements: arrayTemp212,
            };
        }

        case FORM_ACTION_TYPE.UPDATE_DATA_AFTER_USER_WRITES_IN_INPUT_FIELD:
            // console.log(
            //     'UPDATE_DATA_AFTER_USER_WRITES_IN_INPUT_FIELD part is execting',
            // );
            let tempValuesArray = [...state.valuesHolderOfElements];
            if (typeof action.collectionData == 'undefined') {
                tempValuesArray[0][action.elementName] = action.inputData;
            } else {
                // console.log('yyyyyyyyy');
                if (Array.isArray(tempValuesArray[0][action.elementName])) {
                    // console.log('ggg', action.inputData);
                    // console.log('ggh', tempValuesArray[0][action.elementName]);
                    // console.log('dddddd', action.elementName);
                    let tempCollectionArray = [...tempValuesArray[0][action.elementName]];
                    tempCollectionArray[action.collectionData[0].activeIndex] =
                        action.inputData;
                    tempValuesArray[0][action.elementName] = [...tempCollectionArray];
                    //console.log('hhh', tempValuesArray);
                } else {
                    //console.log('zzzzzzzzzzzz');

                    let tempCollectionArray = [];
                    tempCollectionArray[action.collectionData[0].activeIndex] =
                        action.inputData;
                    tempValuesArray[0][action.elementName] = [...tempCollectionArray];
                    //  console.log('ghghgh', tempCollectionArray);
                }
            }

            return {
                ...state,
                valuesHolderOfElements: tempValuesArray,
            };
        case FORM_ACTION_TYPE.UPDATE_ERROR_MESSAGE_OF_SINGLE_ELEMENT:
            var newArray2 = [...action.allElementData];

            // console.log('UPDATE_ERROR_MESSAGE_OF_SINGLE_ELEMENT part is execting');

            return {
                ...state,
                liveFormDataElements: newArray2,
            };

        case FORM_ACTION_TYPE.UPDATE_VALIDITY_OF_SINGLE_ELEMENT_TO_TRUE:
            // console.log('UPDATE_VALIDITY_OF_SINGLE_ELEMENT_TO_TRUE part is execting');
            var newArray3 = [...state.liveFormDataElements];

            let newData3 = newArray3.map(item => {
                if (item.id == action.singleElementData.id) {
                    item.element_is_valid = true;
                }
                return item;
            });
            return {
                ...state,
                liveFormDataElements: newData3,
            };

        case FORM_ACTION_TYPE.UPDATE_VALIDITY_OF_SINGLE_ELEMENT_TO_FALSE:
            // console.log(
            //     'UPDATE_VALIDITY_OF_SINGLE_ELEMENT_TO_FALSE part is execting',
            // );
            var newArray4 = [...state.liveFormDataElements];

            let newData4 = newArray4.map(item => {
                if (item.id == action.singleElementData.id) {
                    item.element_is_valid = false;
                }
                return item;
            });
            return {
                ...state,
                liveFormDataElements: newData4,
            };

        case FORM_ACTION_TYPE.UPDATE_VALUES_OF_OCR_AND_BADGE_AND_BARCODE_ELEMENT:
            // console.log(
            //     'UPDATE_VALUES_OF_OCR_AND_BADGE_AND_BARCODE_ELEMENT part is execting',
            // );
            // console.log(action.collectionChildrenDataArray);
            // console.log(action.collectionData);
            var newArray44 = [...state.valuesHolderOfElements];
            Object.keys(newArray44[0]).forEach((singleKey, index) => {
                if (
                    action.scannedData.hasOwnProperty(singleKey) &&
                    newArray44[0].hasOwnProperty(singleKey)
                ) {
                    if (typeof action.collectionData != 'undefined') {
                        if (action.collectionChildrenDataArray.includes(singleKey)) {
                            if (Array.isArray(newArray44[0][singleKey])) {
                                let ll = [...newArray44[0][singleKey]];
                                ll[action.collectionData[0].activeIndex] =
                                    action.scannedData[singleKey];
                                newArray44[0][singleKey] = ll;
                            } else {
                                let ll = [];
                                ll[action.collectionData[0].activeIndex] =
                                    action.scannedData[singleKey];
                                newArray44[0][singleKey] = ll;
                            }
                        }
                    } else {
                        if (!action.collectionChildrenDataArray.includes(singleKey)) {
                            newArray44[0][singleKey] = action.scannedData[singleKey];
                        }
                    }
                }
            });

            return {
                ...state,
                valuesHolderOfElements: newArray44,
            };

        default:
            return state;
    }
};

export default formReducer;
