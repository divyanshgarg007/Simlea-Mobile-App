/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {Pressable, Image, View, Text, StyleSheet, Platform} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import GlobalStyle from '../../../style/globalstyle';
import * as formAction from '../../../redux/action/formAction';

export default function CopytomeElement(props) {
  const formReducer = useSelector(state => state.rootReducers.formReducer);
  const dispatch = useDispatch();
  const themeState = useSelector(
    state => state.rootReducers?.appComponentReducer,
  );

  const [copyToMeEmailData, setCopyToMeEmailData] = useState(false);
  // const [copyToMeEmailIsSelected, setCopyToMeEmailIsSelected] = useState(false);
  const authReducer = useSelector(state => state.rootReducers.authState);

  useEffect(() => {
    if (
      Array.isArray(formReducer.valuesHolderOfElements) &&
      formReducer.valuesHolderOfElements.length > 0
    ) {
      if (typeof props.collectionData === 'undefined') {
        setCopyToMeEmailData(
          formReducer.valuesHolderOfElements[0][props.elements[0].name],
        );
      } else {
        setCopyToMeEmailData(
          formReducer.valuesHolderOfElements[0][props.elements[0].name][
            props.collectionData[0].activeIndex
          ],
        );
      }
    } else {
      setCopyToMeEmailData(null);
    }
  }, [
    typeof props.collectionData === 'undefined'
      ? ''
      : props.collectionData[0].activeIndex,
    formReducer.valuesHolderOfElements,
  ]);

  return (
    <View style={styles.mainView}>
      <View style={styles.checkboxHolder}>
        <Pressable
          style={styles.singleCheckBoxButton}
          onPress={() => {
            if (copyToMeEmailData == 'true' || copyToMeEmailData == true) {
              dispatch(
                formAction.updateDataOfInputAfterTypingByUser(
                  'false',
                  props.elements[0].name,
                  props.collectionData,
                ),
              );
              setCopyToMeEmailData(false);
            } else {
              dispatch(
                formAction.updateDataOfInputAfterTypingByUser(
                  'true',
                  props.elements[0].name,
                  props.collectionData,
                ),
              );
              setCopyToMeEmailData(true);
            }
          }}>
          <View
            style={
              copyToMeEmailData == true || copyToMeEmailData == 'true'
                ? styles.tickHolderContainerCheck
                : styles.tickHolderContainer
            }>
            {copyToMeEmailData == true || copyToMeEmailData == 'true' ? (
              <Image
                style={styles.tickIcon}
                source={require('../../../assets/images/tick-white.png')}
              />
            ) : null}
          </View>
          <Text
            style={
              themeState?.activeTheme === 'light'
                ? styles.checkboxOptionTextStyleLight
                : styles.checkboxOptionTextStyle
            }>
            {props.elements[0].label[formReducer.activeFormLanguage]}
          </Text>
        </Pressable>
      </View>

      {copyToMeEmailData == true || copyToMeEmailData == 'true' ? (
        <View style={styles.dropdownHolder}>
          <Text
            style={
              themeState?.activeTheme === 'light'
                ? styles.dropdownTextStyleLight
                : styles.dropdownTextStyle
            }>
            {authReducer.signIn.data.email}
          </Text>
        </View>
      ) : (
        ''
      )}
    </View>
  );
}

export const styles = StyleSheet.create({
  mainView: {
    paddingHorizontal: 15,
    flexDirection: 'column',
  },
  dropdownHolder: {
    height: 60,
    width: '100%',
  },
  dropdownTextStyle: {
    fontSize: 14,
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    marginTop: Platform.isPad === true ? 14 : 10,
    marginLeft: 10,
    color: '#EAEAEA',
  },
  dropdownTextStyleLight: {
    fontSize: 14,
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    marginLeft: Platform.isPad === true ? 14 : 10,
    color: '#1a1a1a',
    marginTop: 10,
  },
  singleCheckBoxButton: {
    flexDirection: 'row',
    marginTop: 15,
    alignItems: 'center',
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
});
