import React, {useState, useEffect} from 'react';
import GlobalStyle from '../../../style/globalstyle';
import {useSelector, useDispatch} from 'react-redux';

import {Image, Pressable, View, Text, StyleSheet, Platform} from 'react-native';
import {IconButton} from 'react-native-paper';
import * as formAction from '../../../redux/action/formAction';
import * as formServices from '../../../services/formServices';

export default function CheckboxElement(props) {
  const dispatch = useDispatch();
  const formReducer = useSelector(state => state.rootReducers?.formReducer);
  const themeState = useSelector(
    state => state.rootReducers?.appComponentReducer,
  );
  / store data after user select the checkbox /;
  const [selectedCheckBoxData, setSelectedCheckBoxData] = useState([]);
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    if (formReducer.showFormElementsError && props.elements[0].required) {
      if (selectedCheckBoxData == '' || selectedCheckBoxData == null) {
        setErrorMessage('This field is required');
      } else {
        setErrorMessage();
      }
    }
  }, [formReducer.showFormElementsError, selectedCheckBoxData]);

  useEffect(() => {
    if (
      Array.isArray(formReducer.valuesHolderOfElements) &&
      formReducer.valuesHolderOfElements.length > 0
    ) {
      if (typeof props.collectionData === 'undefined') {
        if (
          typeof formReducer.valuesHolderOfElements[0][
            props.elements[0].name
          ] != 'undefined' &&
          formReducer.valuesHolderOfElements[0][props.elements[0].name] != '' &&
          formReducer.valuesHolderOfElements[0][props.elements[0].name].length >
            0
        ) {
          let ll =
            formReducer.valuesHolderOfElements[0][props.elements[0].name].split(
              ',',
            );
          setSelectedCheckBoxData(ll);
        } else {
          setSelectedCheckBoxData([]);
        }
      } else {
        if (
          typeof formReducer.valuesHolderOfElements[0][props.elements[0].name][
            props.collectionData[0].activeIndex
          ] != 'undefined' &&
          formReducer.valuesHolderOfElements[0][props.elements[0].name][
            props.collectionData[0].activeIndex
          ] != '' &&
          formReducer.valuesHolderOfElements[0][props.elements[0].name][
            props.collectionData[0].activeIndex
          ] != null &&
          formReducer.valuesHolderOfElements[0][props.elements[0].name][
            props.collectionData[0].activeIndex
          ].length > 0
        ) {
          let ll =
            formReducer.valuesHolderOfElements[0][props.elements[0].name][
              props.collectionData[0].activeIndex
            ].split(',');
          setSelectedCheckBoxData(ll);
        }
      }
    } else {
      setSelectedCheckBoxData([]);
    }
  }, [
    typeof props.collectionData === 'undefined'
      ? ''
      : props.collectionData[0].activeIndex,
    formReducer.valuesHolderOfElements,
  ]);

  useEffect(() => {
    let checkBoxSelected = [];
    props.elements[0].options.map((eachOptionItem, index) => {
      if (
        eachOptionItem.selected == true
        //  &&
        // selectedCheckBoxData == [] &&
        // formReducer.flagTrueIfItIsFormEditing == false
      ) {
        if (props.elements[0].single == false) {
          let lm = [...checkBoxSelected];
          lm.push(eachOptionItem.value);
          // setSelectedCheckBoxData(lm);
          let lml = lm.join(',');
          dispatch(
            formAction.updateDataOfInputAfterTypingByUser(
              lml,
              props.elements[0].name,
              props.collectionData,
            ),
          );
          checkBoxSelected = lm;
          if (props.elements[0].options.length - 1 == index) {
            setSelectedCheckBoxData(checkBoxSelected);
          }
        } else {
          let lm = [];
          lm.push(eachOptionItem.value);
          setSelectedCheckBoxData(lm);
          let lml = lm.join(',');
          dispatch(
            formAction.updateDataOfInputAfterTypingByUser(
              lml,
              props.elements[0].name,
              props.collectionData,
            ),
          );
        }
      }
    });
  }, []);

  /*rendering ui for options to be shown in checkbox */ const checkBoxList =
    props.elements[0].options.map((eachOptionItem, index) => {
      return (
        <Pressable
          key={index}
          style={styles.singleCheckBoxButton}
          onPress={() => {
            console.log(eachOptionItem);
            eachOptionItem.selected = !eachOptionItem.selected;
            if (props.elements[0].single == false) {
              let lm = [...selectedCheckBoxData];
              if (lm.indexOf(eachOptionItem.value) > -1) {
                const index = lm.indexOf(eachOptionItem.value);

                lm.splice(index, 1);
                setSelectedCheckBoxData(lm);
                let lml = lm.join(',');
                dispatch(
                  formAction.updateDataOfInputAfterTypingByUser(
                    lml,
                    props.elements[0].name,
                    props.collectionData,
                  ),
                );
              } else {
                lm.push(eachOptionItem.value);
                setSelectedCheckBoxData(lm);
                let lml = lm.join(',');
                dispatch(
                  formAction.updateDataOfInputAfterTypingByUser(
                    lml,
                    props.elements[0].name,
                    props.collectionData,
                  ),
                );
              }
            } else {
              // props.elements[0].options.map((optionItem, index) => {
              //   if (optionItem.value == eachOptionItem.value) {
              //     optionItem.selected = true;
              //       }
              //       else {
              //         optionItem.selected = false;
              //       }
              //   })
              for (let i = 0; i <= props.elements[0].options.length - 1; i++) {
                if (
                  props.elements[0].options[i].value == eachOptionItem.value
                ) {
                  eachOptionItem.selected = true;
                } else {
                  props.elements[0].options[i].selected = false;
                }
              }
              let lm = [];
              lm.push(eachOptionItem.value);
              setSelectedCheckBoxData(lm);
              let lml = lm.join(',');
              dispatch(
                formAction.updateDataOfInputAfterTypingByUser(
                  lml,
                  props.elements[0].name,
                  props.collectionData,
                ),
              );
            }
          }}>
          <View
            style={
              selectedCheckBoxData.indexOf(eachOptionItem.value) > -1
                ? styles.tickHolderContainerCheck
                : styles.tickHolderContainer
            }>
            {selectedCheckBoxData.indexOf(eachOptionItem.value) > -1 ? (
              <Image
                style={styles.tickIcon}
                source={require('../../../assets/images/tick-white.png')}
              />
            ) : (
              ''
            )}
          </View>
          <Text
            style={
              themeState?.activeTheme === 'light'
                ? styles.checkboxOptionTextStyleLight
                : styles.checkboxOptionTextStyle
            }>
            {eachOptionItem.text[formReducer.activeFormLanguage]}
          </Text>
        </Pressable>
      );
    });
  return (
    <View style={styles.mainView}>
      <View style={styles.checkBoxLabelHolder}>
        <Text
          style={
            themeState?.activeTheme === 'light'
              ? styles.checkBoxLabelHolderTextLight
              : styles.checkBoxLabelHolderText
          }>
          {props.elements[0].label[formReducer.activeFormLanguage]}
        </Text>
      </View>
      {/* <Text
        style={{
          color: 'red',
          fontSize: 16,
          paddingLeft: 16,
          paddingBottom: 0,
        }}>
        *
      </Text> */}
      <View style={styles.checkboxOptionHolder}>
        {props.elements[0].required === true ? (
          <Text style={{color: 'red', flexWrap: 'wrap'}}>*</Text>
        ) : (
          ''
        )}
        {checkBoxList}
      </View>
      <Text style={styles.errorText}>{errorMessage}</Text>
    </View>
  );
}

export const styles = StyleSheet.create({
  mainView: {
    flexDirection: 'column',
  },
  checkBoxLabelHolder: {
    flex: 1,
    marginBottom: 10,
    marginHorizontal: 15,
  },
  checkboxOptionHolder: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  singleCheckBoxButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  tickHolderContainer: {
    height: 20,
    width: 20,
    borderWidth: 1,
    borderColor: '#30C6EA',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tickHolderContainerCheck: {
    height: 20,
    width: 20,
    borderWidth: 1,
    borderColor: '#30C6EA',
    borderRadius: 20,
    backgroundColor: '#30C6EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tickIcon: {
    height: 10,
    width: 10,
    resizeMode: 'contain',
  },
  checkboxOptionTextStyle: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: Platform.isPad === true ? 18 : 14,
    marginLeft: 8,
    color: '#EAEAEA',
  },
  checkboxOptionTextStyleLight: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: Platform.isPad === true ? 18 : 14,
    marginLeft: 8,
    color: '#1a1a1a',
  },
  checkBoxLabelHolderTextLight: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: Platform.isPad === true ? 18 : 14,
    marginLeft: 8,
    color: '#1a1a1a',
  },
  checkBoxLabelHolderText: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: Platform.isPad === true ? 18 : 14,
    marginLeft: 8,
    color: '#EAEAEA',
  },
  errorText: {
    color: 'red',
    fontSize: Platform.isPad === true ? 18 : 14,
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    marginHorizontal: 15,
  },
});
