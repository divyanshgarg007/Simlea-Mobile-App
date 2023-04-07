import React, {useState, useEffect} from 'react';
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import GlobalStyle from '../../../style/globalstyle';
import {useDispatch, useSelector} from 'react-redux';

import ColumnsElement from './columnsElement';
import FieldsetElement from './fieldsetElement';
import PanelElement from './panelElement';
import ContainerElement from './containerElement';

import TextElement from './textElement';
import TextareaElement from './textareaElement';
import DateElement from './dateElement';
import EmaillanguageElement from './emaillanguageElement';
import EmailElement from './emailElement';
import HeadlineElement from './headlineElement';
import LabelElement from './labelElement';
import NumberElement from './numberElement';
import PhotoElement from './photoElement';
import SelectElement from './selectElement';
import SendleadtoElement from './sendleadtoElement';
import SendmailElement from './sendmailElement';
import SignatureElement from './signatureElement';
import SliderElement from './sliderElement';
import SuperselectElement from './superselectElement';
import TabsElement from './tabsElement';
import TimeElement from './timeElement';
import UserElement from './userElement';
import CopytomeElement from './copytomeElement';
import * as formAction from '../../../redux/action/formAction';
import CheckboxElement from './checkboxElement';

import CheckedElement from './checkedElement';
import BarcodeElement from './barcodeElement';
import BadgeElement from './badgeElement';
import CardElement from './cardElement';
import CalculatorElement from './calculatorElement';
import CommonPopup from '../../../components/CommonPopup';

export default function CollectionElement(props) {
  var arr = [];

  const dispatch = useDispatch();
  const formReducer = useSelector(state => state.rootReducers.formReducer);
  const eventReducer = useSelector(state => state.rootReducers.eventState);
  /** store buttons list when new tab is added or removed*/
  const [tabButtonData, setTabButtonData] = useState([
    {
      buttonDescription: 'collection label',
      buttonIsSelected: false,
    },
  ]);

  /**this is used to count increase the no. of operation performed i.e add or remove of tab */
  const [noOfOperationPerformed, setNoOfOperationPerformed] = useState(1);
  const themeState = useSelector(
    state => state.rootReducers?.appComponentReducer,
  );
  /** store active index of the tab showing*/
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  const togglePopup = () => {
    setVisible(!visible);
  };
  const handleReset = () => {
    //console.log('gettingInError');
    dispatch(
      formAction.resetValuesOfChildrenForSpecificElement(props.elements),
    );
  };

  useEffect(() => {
    if (formReducer.liveFormDataElements.length > 0) {
      let tempArray = [...formReducer.liveFormDataElements];
      let buttonData = [];

      if (props.selfElement[0].hasOwnProperty('items')) {
        props.selfElement[0].items.map((singleItemsList, indexx) => {
          buttonData[indexx] = {
            buttonDescription: 'collection label',
            buttonIsSelected: false,
          };
          if (props.selfElement[0].items.length - 1 == indexx) {
            setTabButtonData(buttonData);
          }
        });
      }
    }
  }, [formReducer.liveFormDataElements]);

  var tabButtonHolder = tabButtonData.map((item, index) => {
    return (
      <View style={styles.tabButtonHolder} key={index}>
        <Pressable
          style={
            index == activeIndex
              ? styles.tabButtonActive
              : styles.tabButtonInactive
          }
          onPress={() => {
            return setActiveIndex(index);
          }}>
          <Text
            style={
              index == activeIndex
                ? styles.tabButtonTextActive
                : styles.tabButtonTextInactive
            }>
            {props.selfElement[0].label[formReducer.activeFormLanguage]}{' '}
            {index + 1}
          </Text>
        </Pressable>
      </View>
    );
  });
  const noOfChildrenPerIndex = props.elements.length / tabButtonData.length;

  const lists = props.elements.map((item, index) => {
    let arr = [];
    arr.push(item);

    var collectionData = [
      {collectionName: props.selfElement[0].name, activeIndex: activeIndex},
    ];
    // if (index >= noOfChildrenPerIndex  activeIndex && index < noOfChildrenPerIndex  activeIndex + noOfChildrenPerInd)
    //  {
    if (item.hasOwnProperty('children') && item.children.length > 0) {
      // if (item.type == 'collection') {
      //   return (
      //     <CollectionElement
      //       key={item.id}
      //       selfElement={arr}
      //       elements={item.children}
      //       collectionData={collectionData}
      //     />
      //   );
      // }
      if (item.type == 'panel') {
        return (
          <PanelElement
            key={item.id}
            selfElement={arr}
            elements={item.children}
            collectionData={collectionData}
          />
        );
      }
      if (item.type == 'columns') {
        return (
          <ColumnsElement
            key={item.id}
            selfElement={arr}
            elements={item.children}
            collectionData={collectionData}
          />
        );
      }
      if (item.type == 'fieldset') {
        return (
          <FieldsetElement
            key={item.id}
            selfElement={arr}
            elements={item.children}
            collectionData={collectionData}
          />
        );
      }
      if (item.type == 'container') {
        return (
          <ContainerElement
            key={item.id}
            selfElement={arr}
            elements={item.children}
            collectionData={collectionData}
          />
        );
      }
      if (item.type == 'tabs') {
        return (
          <TabsElement
            key={item.id}
            selfElement={arr}
            elements={item.children}
            collectionData={collectionData}
          />
        );
      }
    } else {
      if (item.type == 'checked') {
        return (
          <CheckedElement
            key={item.id}
            elements={arr}
            collectionData={collectionData}
          />
        );
      }

      if (item.type == 'barcode') {
        return (
          <BarcodeElement
            key={item.id}
            elements={arr}
            collectionData={collectionData}
          />
        );
      }

      if (item.type == 'badge') {
        return (
          <BadgeElement
            key={item.id}
            elements={arr}
            collectionData={collectionData}
          />
        );
      }

      if (item.type == 'card') {
        return (
          <CardElement
            key={item.id}
            elements={arr}
            collectionData={collectionData}
          />
        );
      }
      if (item.type == 'text') {
        return (
          <TextElement
            key={item.id}
            elements={arr}
            collectionData={collectionData}
          />
        );
      }
      if (item.type == 'checkbox') {
        return (
          <CheckboxElement
            key={item.id}
            elements={arr}
            collectionData={collectionData}
          />
        );
      }

      if (item.type == 'user') {
        return (
          <UserElement
            key={item.id}
            elements={arr}
            collectionData={collectionData}
          />
        );
      }

      if (item.type == 'textarea') {
        return (
          <TextareaElement
            key={item.id}
            elements={arr}
            collectionData={collectionData}
          />
        );
      }

      if (item.type == 'date') {
        return (
          <DateElement
            key={item.id}
            elements={arr}
            collectionData={collectionData}
          />
        );
      }

      if (item.type == 'time') {
        return (
          <TimeElement
            key={item.id}
            elements={arr}
            collectionData={collectionData}
          />
        );
      }
      if (item.type == 'emaillanguage') {
        return (
          <EmaillanguageElement
            key={item.id}
            elements={arr}
            collectionData={collectionData}
          />
        );
      }

      if (item.type == 'email') {
        return (
          <EmailElement
            key={item.id}
            elements={arr}
            collectionData={collectionData}
          />
        );
      }

      if (item.type == 'headline') {
        return (
          <HeadlineElement
            key={item.id}
            elements={arr}
            collectionData={collectionData}
          />
        );
      }
      if (item.type == 'label') {
        return (
          <LabelElement
            key={item.id}
            elements={arr}
            collectionData={collectionData}
          />
        );
      }

      if (item.type == 'number') {
        return (
          <NumberElement
            key={item.id}
            elements={arr}
            collectionData={collectionData}
          />
        );
      }
      if (item.type == 'photo') {
        return (
          <PhotoElement
            key={item.id}
            elements={arr}
            collectionData={collectionData}
          />
        );
      }

      if (item.type == 'select') {
        return (
          <SelectElement
            key={item.id}
            elements={arr}
            collectionData={collectionData}
          />
        );
      }

      if (item.type == 'sendleadto') {
        return (
          <SendleadtoElement
            key={item.id}
            elements={arr}
            collectionData={collectionData}
          />
        );
      }
      if (item.type == 'sendmail') {
        return (
          <SendmailElement
            key={item.id}
            elements={arr}
            collectionData={collectionData}
          />
        );
      }
      if (item.type == 'signature') {
        return (
          <SignatureElement
            key={item.id}
            elements={arr}
            collectionData={collectionData}
          />
        );
      }

      if (item.type == 'slider') {
        return (
          <SliderElement
            key={item.id}
            elements={arr}
            collectionData={collectionData}
          />
        );
      }

      if (item.type == 'superselect') {
        return (
          <SuperselectElement
            key={item.id}
            elements={arr}
            collectionData={collectionData}
          />
        );
      }
      if (item.type == 'calculator') {
        return (
          <CalculatorElement
            key={item.id}
            elements={arr}
            collectionData={collectionData}
          />
        );
      }

      if (item.type == 'copytome') {
        return (
          <CopytomeElement
            key={item.id}
            elements={arr}
            collectionData={collectionData}
          />
        );
      }
    }
    // }
  });
  return (
    <View style={styles.mainView}>
      <View style={styles.topButtonsHolder}>
        {tabButtonHolder}

        <View style={styles.addOrRemoveButtonHolder}>
          <Pressable
            style={styles.addOrRemoveButton}
            onPress={() => {
              let tempArray3 = [...tabButtonData];
              tempArray3.push({
                buttonDescription: 'collection label',
                buttonIsSelected: false,
              });
              setTabButtonData(tempArray3);
              dispatch(
                formAction.addModificationOfElementsAfterNewTabIsAdded(
                  activeIndex,
                  props.selfElement[0].children,
                  props.selfElement[0].name,
                ),
              );
            }}>
            <Image
              source={require('../../../assets/images/add.png')}
              style={styles.addBtn}
            />
          </Pressable>

          {tabButtonData.length >= 2 ? (
            <Pressable
              style={styles.addOrRemoveButton}
              onPress={() => {
                let tempArray1 = [...tabButtonData];
                tempArray1.splice(activeIndex, 1);
                if (activeIndex == 0) {
                  setActiveIndex(0);
                } else {
                  setActiveIndex(activeIndex - 1);
                }
                //setNoOfOperationPerformed(noOfOperationPerformed + 1);
                dispatch(
                  formAction.addModificationOfElementsAfterNewTabIsRemoved(
                    activeIndex,
                    props.selfElement[0].children,
                    props.selfElement[0].name,
                  ),
                );
                setTabButtonData(tempArray1);
              }}>
              <Image
                source={require('../../../assets/images/remove.png')}
                style={styles.addBtn}
              />
            </Pressable>
          ) : (
            ''
          )}
        </View>
      </View>
      <View
        style={
          themeState?.activeTheme === 'light'
            ? styles.formContainerLight
            : styles.formContainer
        }>
        <TouchableOpacity onPress={() => togglePopup()} style={{zIndex: 1111}}>
          <Image
            source={require('../../../assets/images/delete.png')}
            style={
              themeState?.activeTheme === 'light'
                ? styles.deleteIconLight
                : styles.deleteIcon
            }
          />
        </TouchableOpacity>
        {lists}
      </View>

      <CommonPopup
        visible={visible}
        toggleOverlay={togglePopup}
        handle={handleReset}
        title="Do you really want to reset fields!"
      />
    </View>
  );
}

export const styles = StyleSheet.create({
  topButtonsHolder: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    flexWrap: 'wrap',
  },
  tabButtonHolder: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  addOrRemoveButtonHolder: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  addOrRemoveButton: {
    marginRight: 15,
    marginTop: 10,
  },
  tabButtonActive: {
    marginRight: 10,
    justifyContent: 'center',
    height: Platform.isPad === true ? 29 : 25,
    borderRadius: 3,
    width: 85,
    backgroundColor: '#30C6EA',
    marginTop: 10,
    marginBottom: 10,
  },
  tabButtonInactive: {
    marginRight: 10,
    justifyContent: 'center',
    height: Platform.isPad === true ? 29 : 25,
    width: 85,
    borderRadius: 3,
    backgroundColor: '#4B4D54',
    marginTop: 10,
    marginBottom: 10,
  },
  tabButtonTextActive: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: Platform.isPad === true ? 14 : 12,
    textAlign: 'center',
    color: '#FBFBFB',
  },
  tabButtonTextInactive: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: Platform.isPad === true ? 14 : 12,
    textAlign: 'center',
    color: '#a3a4a7',
  },
  addBtn: {
    width: Platform.isPad === true ? 29 : 25,
    height: Platform.isPad === true ? 29 : 25,
    resizeMode: 'contain',
  },
  tabDescriptionHolder: {
    flexDirection: 'column',
  },
  formContainer: {
    borderColor: '#EAEAEA',
    borderRadius: 5,
    borderWidth: 1,
    marginHorizontal: 15,
    position: 'relative',
  },
  formContainerLight: {
    borderColor: '#8F92A133',
    borderRadius: 5,
    borderWidth: 1,
    marginHorizontal: 15,
    position: 'relative',
  },
  deleteIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
    width: 38,
    height: 38,
    resizeMode: 'contain',
  },
  deleteIconLight: {
    position: 'absolute',
    right: 15,
    top: 15,
    width: 38,
    height: 38,
    resizeMode: 'contain',
    backgroundColor: '#515151',
    borderRadius: 10,
  },
});
