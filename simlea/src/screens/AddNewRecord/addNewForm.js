/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {DotIndicator} from 'react-native-indicators';

import {
  Text,
  View,
  Alert,
  ScrollView,
  SafeAreaView,
  Keyboard,
  Pressable,
  Modal,
  Platform,
} from 'react-native';
import {
  CustomButton,
  CustomTextInput,
  GoBack,
  HeaderButton,
  HeaderTestEvent,
  HeaderTestMode,
  HeaderTitle,
} from '../../components';
import {styles} from './addNewForm.style';

import * as formAction from '../../redux/action/formAction';

import Home from '../../assets/images/home.png';
import {NAVIGATION} from '../../constants';
import * as formActionService from '../../database/FormActionDataService';

import MainParentComponentForRenderingElement from './components/mainParentComponentForRenderingElement';
export default function AddNewForm(props) {
  // console.log(props?.route?.params?.data);
  // console.log(props?.route?.params?.item);
  const [eventFormData, setEventFormData] = useState(
    props?.route?.params?.data,
  );
  const [visible, setVisible] = useState(false);
  const [alertPopup, setAlertPopup] = useState(true);
  const alertToggle = () => {
    Alert.alert(
      'Dismiss Changes',
      'Changes to current form will be lost. Are you sure?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => props.navigation.navigate(NAVIGATION.dashboard),
        },
      ],
    );
  };
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);

  const themeState = useSelector(
    state => state.rootReducers?.appComponentReducer,
  );

  useEffect(() => {
    dispatch(formAction.makeAllStateAsInitialForFormReducer());
    fetch();
    // dispatch(formAction.modifyElemntData(initFrom));
  }, []);

  async function fetch() {
    let initForm = await formActionService.initElements1(
      [],
      props?.route?.params?.data,
    );
    console.log('initForminitForminitForminitForminitForm', initForm);
    dispatch(formAction.modifyElemntData(initForm));
  }

  React.useLayoutEffect(() => {
    props.navigation.setOptions({
      tabBarVisible: false,
      headerBackVisible: false,
      headerShown: true,
      headerLeft: () => <GoBack onPress={() => onClickGoBack()} />,
      headerTitle: () => <HeaderTitle title={eventFormData.name} />,
      headerRight: () => (
        <HeaderButton onPress={() => alertToggle()} source={Home} />
      ),
    });
  }, [props.navigation]);

  const onClickGoBack = () => {
    Keyboard.dismiss();
    if (props.navigation.canGoBack()) {
      alertToggle();
    }
  };
  const dispatch = useDispatch();
  const formSubmittingFlag = useSelector(
    state => state.rootReducers.formReducer.formSubmittingFlag,
  );
  const formReducer = useSelector(state => state.rootReducers.formReducer);
  const languageKeys = eventFormData?.languages
    ? Object.keys(JSON.parse(eventFormData.languages))
    : '';
  const languageList =
    languageKeys !== ''
      ? languageKeys.map((singleLanguageKey, index) => {
          return (
            <Pressable
              key={index}
              style={
                formReducer.activeFormLanguage == singleLanguageKey
                  ? styles.activeButton
                  : styles.inActiveButton
              }
              onPress={() =>
                dispatch(
                  formAction.updateActiveFormLanguageMethod(singleLanguageKey),
                )
              }>
              <Text
                style={
                  formReducer.activeFormLanguage == singleLanguageKey
                    ? styles.languageTextActive
                    : styles.languageText
                }>
                {JSON.parse(eventFormData.languages)[singleLanguageKey]}
              </Text>
            </Pressable>
          );
        })
      : '';

  useEffect(() => {
    if (formReducer.hideSubmitFormIndicator == true) {
      setTimeout(() => {
        setShowLoadingIndicator(false);
        dispatch(formAction.makeHideSubmitFormIndicatorToFalse());
      }, 1000);
    }
  }, [formReducer.hideSubmitFormIndicator, showLoadingIndicator]);


  useEffect(() => {
    setTimeout(() => {
      console.log("settimeout");
      dispatch(formAction.makeScrollAbleWhenSignaturePadIsInActive());
    }, 4000);

  }, [formReducer.scrollAbleOrDisableWhenSignaturePadIsActive]);



  return (
    <SafeAreaView
      style={
        themeState?.activeTheme === 'light'
          ? styles.containerLight
          : styles.containerDark
      }>
      <ScrollView
        overScrollMode="never"
        scrollEnabled={formReducer.scrollAbleOrDisableWhenSignaturePadIsActive}>

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
                  setVisible(!visible),
                    setShowLoadingIndicator(true),
                    dispatch(
                      formAction.formSubmitClickMethod(
                        props.navigation,
                        props?.route?.params?.item,
                        props?.route?.params?.data,
                      ),
                      setVisible(!visible),
                    );
                }}
              />
            </View>
            <View style={styles.spaceBtns}>
              <CustomButton
                style={styles.saveButton}
                title="Draft"
                labelStyle={styles.actionTitle}
                onPress={() => {
                  props.navigation.navigate(NAVIGATION.draftSave, {
                    data: formAction.draftSubmitMethod,
                  }),
                    setShowLoadingIndicator(true),
                    dispatch(
                      formAction.draftSubmitMethod(
                        props.navigation,
                        props?.route?.params?.item,
                        props?.route?.params?.data,
                        true,
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
                onPress={() => alertToggle()}
              />
            </View>
          </View>
        ) : (
          <Modal
            transparent={true}
            visible={visible}
            onRequestClose={() => {
              setVisible(!visible);
            }}>
            <View style={styles.loadingSaveForm}>
              <DotIndicator
                animating={showLoadingIndicator}
                color="#30C6EA"
                size={Platform.isPad === true ? 20 : 14}
                hidesWhenStopped={true}
              />
            </View>
          </Modal>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
