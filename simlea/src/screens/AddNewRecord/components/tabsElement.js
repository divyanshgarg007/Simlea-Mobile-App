import React, { useState } from 'react';
import { Pressable, View, Text, StyleSheet, Platform } from 'react-native';
import GlobalStyle from '../../../style/globalstyle';
import { useDispatch, useSelector } from 'react-redux';

import ColumnsElement from './columnsElement';
import FieldsetElement from './fieldsetElement';
import PanelElement from './panelElement';
import ContainerElement from './containerElement';
import CollectionElement from './collectionElement';

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
import TimeElement from './timeElement';
import UserElement from './userElement';
import CopytomeElement from './copytomeElement';
import CheckboxElement from './checkboxElement';

import CheckedElement from './checkedElement';
import BarcodeElement from './barcodeElement';
import BadgeElement from './badgeElement';
import CardElement from './cardElement';
import CalculatorElement from './calculatorElement';
import { Button } from 'react-native-paper';

export default function TabsElement(props) {

  //const dispatch = useDispatch();
  const formReducer = useSelector(state => state.rootReducers.formReducer);
  //const eventReducer = useSelector(state => state.rootReducers.eventState);

  /** store buttons list when new tab is added or removed*/
  //  const [tabButtonData, setTabButtonData] = useState(initialButtonData);

  /** store active index of the tab showing*/
  const [activeIndex, setActiveIndex] = useState(0);
  var tabButtonHolder = props.elements.map((item, index) => {
    return (
      <View style={styles.tabButtonHolder} key={index}>
        <Button
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
            {
              props.elements[0]._parent.children[index].label[
              formReducer.activeFormLanguage
              ]
            }
          </Text>
        </Button>
      </View>
    );
  });

  const lists = props.elements.map((item, index) => {
    if (activeIndex == index) {
      let arr = [];
      arr.push(item);

      if (item.hasOwnProperty('children') && item.children.length > 0) {
        if (item.type == 'collection') {
          return (
            <CollectionElement
              key={item.id}
              selfElement={arr}
              elements={item.children}
              collectionData={props.collectionData}
            />
          );
        }
        if (item.type == 'panel') {
          return (
            <PanelElement
              key={item.id}
              selfElement={arr}
              elements={item.children}
              collectionData={props.collectionData}
            />
          );
        }
        if (item.type == 'columns') {
          return (
            <ColumnsElement
              key={item.id}
              selfElement={arr}
              elements={item.children}
              collectionData={props.collectionData}
            />
          );
        }
        if (item.type == 'fieldset') {
          return (
            <FieldsetElement
              key={item.id}
              selfElement={arr}
              elements={item.children}
              collectionData={props.collectionData}
            />
          );
        }
        if (item.type == 'container') {
          return (
            <ContainerElement
              key={item.id}
              selfElement={arr}
              elements={item.children}
              collectionData={props.collectionData}
            />
          );
        }
        if (item.type == 'tabs') {
          return (
            <TabsElement
              key={item.id}
              selfElement={arr}
              elements={item.children}
              collectionData={props.collectionData}
            />
          );
        }
      } else {
        if (item.type == 'checked') {
          return (
            <CheckedElement
              key={item.id}
              elements={arr}
              collectionData={props.collectionData}
            />
          );
        }
        if (item.type == 'barcode') {
          return (
            <BarcodeElement
              key={item.id}
              elements={arr}
              collectionData={props.collectionData}
            />
          );
        }

        if (item.type == 'badge') {
          return (
            <BadgeElement
              key={item.id}
              elements={arr}
              collectionData={props.collectionData}
            />
          );
        }

        if (item.type == 'card') {
          return (
            <CardElement
              key={item.id}
              elements={arr}
              collectionData={props.collectionData}
            />
          );
        }
        if (item.type == 'text') {
          return (
            <TextElement
              key={item.id}
              elements={arr}
              collectionData={props.collectionData}
            />
          );
        }
        if (item.type == 'checkbox') {
          return (
            <CheckboxElement
              key={item.id}
              elements={arr}
              collectionData={props.collectionData}
            />
          );
        }

        if (item.type == 'user') {
          return (
            <UserElement
              key={item.id}
              elements={arr}
              collectionData={props.collectionData}
            />
          );
        }

        if (item.type == 'textarea') {
          return (
            <TextareaElement
              key={item.id}
              elements={arr}
              collectionData={props.collectionData}
            />
          );
        }

        if (item.type == 'date') {
          return (
            <DateElement
              key={item.id}
              elements={arr}
              collectionData={props.collectionData}
            />
          );
        }

        if (item.type == 'time') {
          return (
            <TimeElement
              key={item.id}
              elements={arr}
              collectionData={props.collectionData}
            />
          );
        }
        if (item.type == 'emaillanguage') {
          return (
            <EmaillanguageElement
              key={item.id}
              elements={arr}
              collectionData={props.collectionData}
            />
          );
        }

        if (item.type == 'email') {
          return (
            <EmailElement
              key={item.id}
              elements={arr}
              collectionData={props.collectionData}
            />
          );
        }

        if (item.type == 'headline') {
          return (
            <HeadlineElement
              key={item.id}
              elements={arr}
              collectionData={props.collectionData}
            />
          );
        }
        if (item.type == 'label') {
          return (
            <LabelElement
              key={item.id}
              elements={arr}
              collectionData={props.collectionData}
            />
          );
        }

        if (item.type == 'number') {
          return (
            <NumberElement
              key={item.id}
              elements={arr}
              collectionData={props.collectionData}
            />
          );
        }
        if (item.type == 'photo') {
          return (
            <PhotoElement
              key={item.id}
              elements={arr}
              collectionData={props.collectionData}
            />
          );
        }

        if (item.type == 'select') {
          return (
            <SelectElement
              key={item.id}
              elements={arr}
              collectionData={props.collectionData}
            />
          );
        }

        if (item.type == 'sendleadto') {
          return (
            <SendleadtoElement
              key={item.id}
              elements={arr}
              collectionData={props.collectionData}
            />
          );
        }
        if (item.type == 'sendmail') {
          return (
            <SendmailElement
              key={item.id}
              elements={arr}
              collectionData={props.collectionData}
            />
          );
        }
        if (item.type == 'signature') {
          return (
            <SignatureElement
              key={item.id}
              elements={arr}
              collectionData={props.collectionData}
            />
          );
        }

        if (item.type == 'slider') {
          return (
            <SliderElement
              key={item.id}
              elements={arr}
              collectionData={props.collectionData}
            />
          );
        }

        if (item.type == 'superselect') {
          return (
            <SuperselectElement
              key={item.id}
              elements={arr}
              collectionData={props.collectionData}
            />
          );
        }
        if (item.type == 'calculator') {
          return (
            <CalculatorElement
              key={item.id}
              elements={arr}
              collectionData={props.collectionData}
            />
          );
        }
        if (item.type == 'copytome') {
          return (
            <CopytomeElement
              key={item.id}
              elements={arr}
              collectionData={props.collectionData}
            />
          );
        }
      }
    }
  });
  return (
    <View style={styles.mainView}>
      <View style={styles.spaceBtns}>
        <View style={styles.topButtonsHolder}>{tabButtonHolder}</View>
      </View>
      {lists}
    </View>
  );
}

export const styles = StyleSheet.create({
  mainView: {
    width: '92%',
    marginTop: 15,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  topButtonsHolder: {
    flexDirection: 'row',
    width: Platform.OS === 'android' ? '70%' : '100%',
  },

  // tabButtonHolder: {
  //   flexDirection: 'row',
  //   flexWrap: 'wrap',
  // },
  addOrRemoveButtonHolder: {
    justifyContent: 'space-between',
  },
  spaceBtns: {
    flex: 0,
    flexBasis: '45%',
  },
  tabButtonActive: {
    marginRight: 10,
    justifyContent: 'center',
    // height: 25,
    borderRadius: 3,
    width: '100%',
    backgroundColor: '#30C6EA',
    marginBottom: 10,
  },
  tabButtonInactive: {
    marginRight: 10,
    justifyContent: 'center',
    // height: 25,
    width: '100%',
    borderRadius: 3,
    backgroundColor: '#4B4D54',
    marginBottom: 10,
  },
  tabButtonTextActive: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: 14,
    textAlign: 'center',
    color: '#FBFBFB',
  },
  tabButtonTextInactive: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: 14,
    textAlign: 'center',
    color: '#a3a4a7',
  },
});
