import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import ColumnsElement from './columnsElement';
import FieldsetElement from './fieldsetElement';
import PanelElement from './panelElement';
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
import TabsElement from './tabsElement';
import TimeElement from './timeElement';
import UserElement from './userElement';
import CopytomeElement from './copytomeElement';
import CheckboxElement from './checkboxElement';

import CheckedElement from './checkedElement';
import BarcodeElement from './barcodeElement';
import BadgeElement from './badgeElement';
import CalculatorElement from './calculatorElement';

export default function ContainerElement(props) {
  const lists = props.elements.map((item, index) => {
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
          // eslint-disable-next-line semi
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

      if (item.type == 'calculator') {
        return (
          <CalculatorElement
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
  });

  return <View style={styles.mainView}>{lists}</View>;
}

export const styles = StyleSheet.create({
  mainView: {
    backgroundColor: '#FBFBFBFB',
    borderWidth: 1,
    borderColor: '#808191',
    borderRadius: 2,
    marginTop: 10,
    flexDirection: 'column',
  },
});
