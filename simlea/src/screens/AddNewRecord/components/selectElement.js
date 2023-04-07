/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {Image, StyleSheet, View, Pressable, Text, Platform} from 'react-native';
import GlobalStyle from '../../../style/globalstyle';
import {useSelector, useDispatch} from 'react-redux';
import * as formAction from '../../../redux/action/formAction';

export default function SelectElement(props) {
  const dispatch = useDispatch();
  const formReducer = useSelector(state => state.rootReducers?.formReducer);
  const themeState = useSelector(
    state => state.rootReducers?.appComponentReducer,
  );

  /** boolean to show hide dropdown list of user */
  const [showSelectionDropdown, setShowSelectionDropdown] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    if (formReducer.showFormElementsError && props.elements[0].required) {
      if (selectedData == '' || selectedData == null) {
        setErrorMessage('This field is required');
      } else {
        setErrorMessage();
      }
    }
  }, [formReducer.showFormElementsError]);

  useEffect(() => {
    if (
      Array.isArray(formReducer.valuesHolderOfElements) &&
      formReducer.valuesHolderOfElements.length > 0
    ) {
      if (typeof props.collectionData === 'undefined') {
        setSelectedData(
          formReducer.valuesHolderOfElements[0][props.elements[0].name],
        );
      } else {
        setSelectedData(
          formReducer.valuesHolderOfElements[0][props.elements[0].name][
            props.collectionData[0].activeIndex
          ],
        );
      }
    } else {
      setSelectedData(null);
    }
  }, [
    typeof props.collectionData === 'undefined'
      ? ''
      : props.collectionData[0].activeIndex,
    formReducer.valuesHolderOfElements,
  ]);

  useEffect(() => {
    props.elements[0].options.map((singleOptionItem, index) => {
      if (
        singleOptionItem.selected == true &&
        (selectedData == null || selectedData == '')
      ) {
        setSelectedData(singleOptionItem.value);
        dispatch(
          formAction.updateDataOfInputAfterTypingByUser(
            singleOptionItem.value,
            props.elements[0].name,
            props.collectionData,
          ),
        );
      }
    });
  }, []);

  const optionList = props.elements[0].options.map(
    (singleOptionItem, index) => {
      // if (singleOptionItem.selected == true && (selectedData == null || selectedData == '')) {
      //   setSelectedData(singleOptionItem.value);
      //   dispatch(
      //     formAction.updateDataOfInputAfterTypingByUser(
      //       singleOptionItem.value,
      //       props.elements[0].name,
      //       props.collectionData,
      //     ),
      //   );
      // }
      return (
        <Pressable
          key={index}
          style={styles.singleCheckBoxButton}
          onPress={() => {
            setShowSelectionDropdown(false);
            setSelectedData(singleOptionItem.value);
            dispatch(
              formAction.updateDataOfInputAfterTypingByUser(
                singleOptionItem.value,
                props.elements[0].name,
                props.collectionData,
              ),
            );
          }}>
          <View
            style={
              singleOptionItem.value == selectedData
                ? styles.tickHolderContainerCheck
                : styles.tickHolderContainer
            }>
            {singleOptionItem.value == selectedData ? (
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
            {singleOptionItem.text[formReducer.activeFormLanguage]}
          </Text>
        </Pressable>
      );
    },
  );

  return (
    <View style={styles.mainView}>
      {/* {selectedData == null ? (
        ''
      ) : (
        <View style={styles.selectOptionLabelHolder}>
          <Text>{props.elements[0].label[formReducer.activeFormLanguage]}</Text>
        </View>
      )} */}

      <Pressable
        style={
          themeState?.activeTheme === 'light'
            ? styles.showModalButtonLight
            : styles.showModalButton
        }
        onPress={() => {
          return setShowSelectionDropdown(!showSelectionDropdown);
        }}>
        {selectedData == null || selectedData == '' ? (
          <>
            <Text
              style={
                themeState?.activeTheme === 'light'
                  ? styles.showModalButtonTextLight
                  : styles.showModalButtonText
              }>
              {props.elements[0].label[formReducer.activeFormLanguage]}
            </Text>
            {themeState?.activeTheme === 'light' ? (
              <Image
                style={styles.arrow}
                source={require('../../../assets/images/dropIconDark.png')}
              />
            ) : (
              <Image
                style={styles.arrow}
                source={require('../../../assets/images/dropIcon.png')}
              />
            )}
          </>
        ) : (
          <>
            <Text
              style={
                themeState?.activeTheme === 'light'
                  ? styles.showModalButtonTextLight
                  : styles.showModalButtonText
              }>
              {selectedData}
            </Text>
            {themeState?.activeTheme === 'light' ? (
              <Image
                style={styles.arrow}
                source={require('../../../assets/images/dropIconDark.png')}
              />
            ) : (
              <Image
                style={styles.arrow}
                source={require('../../../assets/images/dropIcon.png')}
              />
            )}
          </>
        )}
      </Pressable>
      {props.elements[0].required === true ? (
        <Text style={{color: 'red', flexWrap: 'wrap'}}>*</Text>
      ) : (
        ''
      )}
      {showSelectionDropdown == true ? (
        <View style={styles.optionsHolder}>{optionList}</View>
      ) : (
        ''
      )}
      <Text style={styles.errorText}>{errorMessage}</Text>
    </View>
  );
}

export const styles = StyleSheet.create({
  mainView: {
    marginBottom: 10,
    marginTop: 15,
  },
  arrow: {height: 7, width: 10, resizeMode: 'contain'},
  tickIcon: {
    height: Platform.isPad === true ? 14 : 10,
    width: Platform.isPad === true ? 14 : 10,
    resizeMode: 'contain',
  },
  showModalButton: {
    height: Platform.isPad === true ? 47 : 40,
    marginHorizontal: 15,
    borderRadius: 4,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    paddingHorizontal: 10,
  },
  showModalButtonLight: {
    height: Platform.isPad === true ? 47 : 40,
    marginHorizontal: 15,
    borderRadius: 4,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
    borderWidth: 1,
    borderColor: '#8F92A133',
    paddingHorizontal: 10,
  },
  showModalButtonTextLight: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    fontSize: Platform.isPad === true ? 18 : 14,
    color: '#1a1a1a',
  },
  showModalButtonText: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    fontSize: Platform.isPad === true ? 18 : 14,
    color: '#fff',
  },
  optionsHolder: {
    marginLeft: 15,
  },

  singleCheckBoxButton: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginTop: 10,
    marginHorizontal: 15,
  },
  tickHolderContainer: {
    height: Platform.isPad === true ? 24 : 20,
    width: Platform.isPad === true ? 24 : 20,
    borderWidth: 1,
    borderColor: '#30C6EA',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tickHolderContainerCheck: {
    height: Platform.isPad === true ? 24 : 20,
    width: Platform.isPad === true ? 24 : 20,
    borderWidth: 1,
    borderColor: '#30C6EA',
    borderRadius: 20,
    backgroundColor: '#30C6EA',
    alignItems: 'center',
    justifyContent: 'center',
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
  errorText: {
    color: 'red',
    fontSize: Platform.isPad === true ? 18 : 14,
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    marginHorizontal: 15,
  },
});
