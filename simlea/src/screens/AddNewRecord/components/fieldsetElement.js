/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import GlobalStyle from '../../../style/globalstyle';
import {
  TextInput,
  Image,
  Pressable,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {IconButton} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import CommonPopup from '../../../components/CommonPopup';
import ColumnsElement from './columnsElement';
import CollectionElement from './collectionElement';
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
import CheckboxElement from './checkboxElement';

import CheckedElement from './checkedElement';
import BarcodeElement from './barcodeElement';
import BadgeElement from './badgeElement';
import CardElement from './cardElement';
import CalculatorElement from './calculatorElement';
import * as formAction from '../../../redux/action/formAction';

export default function FieldsetElement(props) {
  const dispatch = useDispatch();
  /** boolean to show if field set is in expanded mode or compress */
  const [showFieldSetExpanded, setFieldSetExpanded] = useState(true);

  /** boolean to show hide tooltip text */
  const [showToolTipText, setToolTipTextShowHide] = useState(false);
  const formReducer = useSelector(state => state.rootReducers.formReducer);
  const themeState = useSelector(
    state => state.rootReducers?.appComponentReducer,
  );
  const [visible, setVisible] = useState(false);
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
      if (item.type == 'calculator') {
        return (
          <CalculatorElement
            key={item.id}
            elements={arr}
            collectionData={props.collectionData}
          />
        );
      }
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
  const togglePopup = () => {
    setVisible(!visible);
  };
  const handleReset = () => {
    //console.log('ufbhs');
    dispatch(
      formAction.resetValuesOfChildrenForSpecificElement(props.elements),
    );
  };

  return (
    <View
      style={
        themeState?.activeTheme === 'light'
          ? styles.mainViewLight
          : styles.mainViewDark
      }>
      <View style={styles.topMenuHolder}>
        <View style={styles.leftContainer}>
          <Pressable
            style={styles.closeAndOpenFieldGroupButton}
            onPress={() => {
              return setFieldSetExpanded(!showFieldSetExpanded);
            }}>
            <Image
              style={styles.arrow}
              source={
                showFieldSetExpanded === true
                  ? require('../../../assets/images/upIcon.png')
                  : require('../../../assets/images/downIcon.png')
              }
            />
          </Pressable>
          <View style={styles.labelTextHolder}>
            <Text style={styles.labelTextStyle}>
              {props.selfElement[0].label[formReducer.activeFormLanguage]}
            </Text>
          </View>
        </View>
        {/* <IconButton
          icon="delete"
          size={20}
          iconColor="#30C6EA"
          onPress={() => {
            return setToolTipTextShowHide(!showToolTipText);
          }}
        /> */}
        {/* <IconButton
          icon="information-variant"
          size={20}
          iconColor="#30C6EA"
          onPress={() =>{
            return setToolTipTextShowHide(!showToolTipText);
          }}
        /> */}
        <TouchableOpacity
          style={{zIndex: 11111111}}
          onPress={() => togglePopup()}>
          <Image
            style={
              themeState?.activeTheme === 'light'
                ? styles.deleteLight
                : styles.delete
            }
            source={require('../../../assets/images/delete.png')}
          />
        </TouchableOpacity>
      </View>

      {showToolTipText == true ? (
        <View style={styles.toolTipHolder}>
          <View style={styles.toolTipTextHolder}>
            <Text style={styles.toolTipTextStyle}>this is a tooltip text</Text>
          </View>
        </View>
      ) : (
        ''
      )}
      {showFieldSetExpanded == true ? (
        <View style={styles.contentHolder}>{lists}</View>
      ) : (
        ''
      )}

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
  mainViewDark: {
    borderColor: '#EAEAEA',
    borderRadius: Platform.isPad === true ? 6 : 5,
    borderWidth: 1,
    marginTop: 15,
    paddingVertical: Platform.isPad === true ? 14 : 10,
    width: '93%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  mainViewLight: {
    borderColor: '#8F92A133',
    borderRadius: Platform.isPad === true ? 6 : 5,
    borderWidth: 1,
    marginTop: 15,
    // paddingHorizontal: 15,
    paddingVertical: Platform.isPad === true ? 14 : 10,
    width: '100%',
  },
  topMenuHolder: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  leftContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  closeAndOpenFieldGroupButton: {},
  labelTextHolder: {
    marginTop: 0,
    marginLeft: Platform.isPad === true ? 12 : 7,
  },
  labelTextStyle: {
    fontSize: Platform.isPad === true ? 16 : 12,
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    color: '#30C6EA',
  },
  toolTipHolder: {
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  toolTipTextHolder: {
    backgroundColor: 'white',
    marginLeft: 5,
    borderRadius: 3,
  },
  toolTipTextStyle: {
    fontSize: Platform.isPad === true ? 16 : 12,
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
  },
  contentHolder: {
    // marginLeft: 10,
    // backgroundColor: '#FFF',
    // flexDirection: 'column',
  },
  arrow: {height: 10, width: 7, resizeMode: 'contain'},
  delete: {
    height: 38,
    width: 38,
    resizeMode: 'contain',
  },
  deleteLight: {
    height: 38,
    width: 38,
    resizeMode: 'contain',
    backgroundColor: '#515151',
    borderRadius: 10,
  },
});
