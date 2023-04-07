import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Text, View, SafeAreaView, Pressable, ScrollView } from 'react-native';
import { styles } from './formEdit.style';
import {
  CustomButton,
  HeaderButton,
  HeaderTitle,
  GoBack,
} from '../../components';
import { NAVIGATION } from '../../constants';
import Home from '../../assets/images/home.png';
import { DotIndicator } from 'react-native-indicators';
import * as formServices from '../../services/formServices';
import * as formAction from '../../redux/action/formAction';
import MainParentComponentForRenderingElement from '../AddNewRecord/components/mainParentComponentForRenderingElement';
import * as formActionService from '../../database/FormActionDataService';
import { useFocusEffect } from '@react-navigation/native';

export default function FormEdit(props) {
  console.log('edit open');
  console.log(props?.route?.params?.data);
  console.log(props?.route?.params?.item);
  console.log('edit close');

  const dispatch = useDispatch();
  const formReducer = useSelector(state => state.rootReducers.formReducer);
  const languageKeys =
    eventFormData != null ? Object.keys(eventFormData.languages) : [];

  const eventReducer = useSelector(state => state.rootReducers.eventState);
  const [eventFormData, setEventFormData] = useState(
    props?.route?.params?.data,
  );
  console.log('edit form open');
  console.log(eventFormData);
  console.log('edit form close');
  const [readyToEditForm, setReadyToEditForm] = useState(false);
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const themeState = useSelector(
    state => state.rootReducers?.appComponentReducer,
  );
  //  const [elementValuesRecievedFromBackend, setElementValuesRecievedFromBackend] = useState();
  //const [collectionDataRecievedFromBackend, setCollectionDataRecievedFromBackend] = useState(null);
  //console.log(eventFormData);
  // console.log(elementValuesRecievedFromBackend);

  useEffect(() => {
    setTimeout(() => {
      console.log('settimeout');
      dispatch(formAction.makeScrollAbleWhenSignaturePadIsInActive());
    }, 4000);
  }, [formReducer.scrollAbleOrDisableWhenSignaturePadIsActive]);

  useEffect(() => {
    if (formReducer.valuesHolderOfElements.length > 0) {
      setReadyToEditForm(true);
    }
  }, [formReducer.valuesHolderOfElements]);

  useEffect(() => {
    if (formReducer.hideSubmitFormIndicator == true) {
      setTimeout(() => {
        setShowLoadingIndicator(false);
        dispatch(formAction.makeHideSubmitFormIndicatorToFalse());
      }, 2000);
    }
  }, [formReducer.hideSubmitFormIndicator, showLoadingIndicator]);

  // useEffect(() => {
  //   dispatch(formAction.makeAllStateAsInitialForFormReducer());
  //   dispatch(formAction.updateFormEditToTrue());
  //   getRecordFromSQL();

  // }, []);

  useFocusEffect(
    useCallback(() => {
      dispatch(formAction.makeAllStateAsInitialForFormReducer());
      dispatch(formAction.updateFormEditToTrue());
      getRecordFromSQL();
    }, []),
  );



  async function getRecordFromSQL() {
    let initFrom = await formActionService.initElements1(
      props?.route?.params?.item,
      props?.route?.params?.data,
    );
    let res = await formActionService.getRecordList(
      props?.route?.params?.item,
      props?.route?.params?.data,
    );
    console.log('dfdfdfdf');
    console.log(res);
    console.log('jkjkjkjkj');

    dispatch(formAction.modifyElemntDataForFormEdit(res));
    //setReadyToEditForm(true);
  }

  React.useLayoutEffect(() => {
    props.navigation.setOptions({
      tabBarVisible: false,
      headerBackVisible: false,
      headerShown: true,
      headerLeft: () => <GoBack onPress={() => props.navigation.goBack()} />,
      headerTitle: () => <HeaderTitle title={eventFormData.name} />,
      headerRight: () => (
        <HeaderButton
          onPress={() => props.navigation.navigate(NAVIGATION.dashboard)}
          source={Home}
        />
      ),
    });
  }, [props.navigation]);

  // useEffect(() => {
  //   if (formReducer.valuesHolderOfElements.length > 0 && readyToEditForm == false) {
  //     let tempArray = JSON.parse(JSON.stringify([...formReducer.valuesHolderOfElements]),);

  //     Object.keys(tempArray[0]).forEach(function (key, index) {
  //       if (elementValuesRecievedFromBackend?.[key]) {
  //         tempArray[0][key] = elementValuesRecievedFromBackend[key];
  //       }

  //     });
  //     if (collectionDataRecievedFromBackend != null) {
  //       Object.keys(collectionDataRecievedFromBackend).map((singleCollectionName, index) => {
  //         collectionDataRecievedFromBackend[singleCollectionName].forEach((singleCollectionData, indexx) => {

  //           Object.keys(singleCollectionData).forEach((singleStoredElementsName) => {
  //             if (collectionDataRecievedFromBackend[singleCollectionName][indexx].hasOwnProperty(singleStoredElementsName)) {
  //               if (Array.isArray(tempArray[0][singleStoredElementsName])) {
  //                 tempArray[0][singleStoredElementsName][indexx] = collectionDataRecievedFromBackend[singleCollectionName][indexx][singleStoredElementsName] == '' ? "" : collectionDataRecievedFromBackend[singleCollectionName][indexx][singleStoredElementsName];
  //               }
  //               else {
  //                 let ll = [];
  //                 ll[0] = collectionDataRecievedFromBackend[singleCollectionName][indexx][singleStoredElementsName] == '' ? "" : collectionDataRecievedFromBackend[singleCollectionName][indexx][singleStoredElementsName];
  //                 tempArray[0][singleStoredElementsName] = ll;

  //               }
  //             }
  //           });
  //         })
  //         if (Object.keys(collectionDataRecievedFromBackend).length - 1 == index) {
  //           dispatch(formAction.updateModifiedValuesForFormEdit(tempArray));
  //           setReadyToEditForm(true);
  //         }
  //       })
  //     }
  //     else {
  //       dispatch(formAction.updateModifiedValuesForFormEdit(tempArray));
  //       setReadyToEditForm(true);
  //     }

  //   }
  // }, [formReducer.valuesHolderOfElements, readyToEditForm, elementValuesRecievedFromBackend, collectionDataRecievedFromBackend]);

  const languageList = languageKeys.map((singleLanguageKey, index) => {
    return (
      <Pressable
        key={index}
        style={
          formReducer.activeFormLanguage == singleLanguageKey
            ? styles.activeButton
            : styles.inActiveButton
        }
        onPress={() =>
          dispatch(formAction.updateActiveFormLanguageMethod(singleLanguageKey))
        }>
        <Text style={styles.languageText}>
          {eventFormData?.languages[singleLanguageKey]}
        </Text>
      </Pressable>
    );
  });

  return (
    <SafeAreaView
      style={
        themeState?.activeTheme === 'light'
          ? styles.containerLight
          : styles.containerDark
      }>
      {readyToEditForm == true ? (
        <ScrollView
          overScrollMode="never"
          scrollEnabled={
            formReducer.scrollAbleOrDisableWhenSignaturePadIsActive
          }>
          <Text
            style={
              themeState?.activeTheme === 'light'
                ? styles.headTextLight
                : styles.headText
            }>
            Form language
          </Text>
          <View style={styles.formLanguageButtonHolder}>{languageList}</View>
          <MainParentComponentForRenderingElement
            elements={formReducer.liveFormDataElements}
          />
          {showLoadingIndicator == false ? (
            <View style={styles.buttonGroup}>
              <View style={styles.spaceBtns}>
                <CustomButton
                  style={styles.saveButton}
                  title="Save"
                  labelStyle={styles.actionTitle}
                  onPress={() => {
                    setShowLoadingIndicator(true),
                      dispatch(
                        formAction.formSubmitClickMethod(
                          props?.navigation,
                          props?.route?.params?.item,
                          props?.route?.params?.data,
                        ),
                      );
                  }}
                />
              </View>
              <View style={styles.spaceBtns}>
                <CustomButton
                  style={styles.cancelButton}
                  title="Cancel"
                  labelStyle={styles.actionTitle}
                  onPress={() => props.navigation.goBack()}
                />
              </View>
            </View>
          ) : (
            <View style={styles.loadingForm}>
              <DotIndicator
                animating={showLoadingIndicator}
                color="#30C6EA"
                size={14}
                hidesWhenStopped={true}
              />
            </View>
          )}
        </ScrollView>
      ) : (
        <View style={styles.loadingForm}>
          <DotIndicator
            animating={true}
            color="#30C6EA"
            size={14}
            hidesWhenStopped={true}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
