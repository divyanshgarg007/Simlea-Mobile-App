/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {View, Image, StyleSheet, Platform} from 'react-native';
import {Text, Avatar} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import GlobalStyle from '../../../style/globalstyle';
import {CustomButton, DropdownPicker} from '../../../components';
import * as authStateAction from '../../../redux/action/authActions';

export default function EmployeeDetailsItem(props) {
  const authState = useSelector(state => state.rootReducers?.authState);
  const [visible, setVisible] = useState(false);
  const [openPicker, setOpenPicker] = useState(false);
  const [value, setValue] = useState(null);
  const hideModal = () => setVisible(!visible);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const handleText = () => {
    setTitle(title);
    setDesc(desc);
  };
  return (
    <View style={styles.listContainer}>
      <View
        style={
          props.theme.activeTheme === 'light'
            ? styles.contentBoxLight
            : styles.contentBoxDark
        }>
        {
          props?.item?.userImage?.data ? (
            <FastImage
              source={{
                uri: `data:image/props?.item?.userImage?.extension;base64,${props?.item?.userImage?.data}`,
              }}
              style={styles.cardIcon}
              resizeMode={FastImage.resizeMode.contain}
            />
          ) : (
            <Avatar.Text
              size={38}
              label={props?.item?.firstName[0] + props?.item?.lastName[0]}
              color="#30C6EA"
            />
          ) //<Avatar.Icon size={38} icon="account-outline" color="#30C6EA" />
        }
        <View style={styles.employeeTextBox}>
          <Text
            style={
              props.theme.activeTheme === 'light'
                ? styles.textItemLight
                : styles.textItem
            }>
            {props?.item?.firstName + ' ' + props?.item?.lastName}
          </Text>
          <View style={styles.statusBoxWithStatusText}>
            {Platform.isPad === true &&
              (props?.item?.firstName === authState?.signIn?.data?.firstname ? (
                <View
                  style={
                    authState?.signIn?.data?.status === 'available'
                      ? styles.statusBox
                      : authState?.signIn?.data?.status === 'offline'
                      ? styles.statusBoxOffline
                      : styles.statusBoxAway
                  }
                />
              ) : (
                <View
                  style={
                    props?.item?.status === 'available'
                      ? styles.statusBox
                      : styles.statusBoxOffline
                  }
                />
              ))}

            <Text style={styles.statusTextItem}>
              {props?.item?.firstName === authState?.signIn?.data?.firstname
                ? authState?.signIn?.data?.status
                : props?.item?.status}
            </Text>
          </View>

          {Platform.isPad !== true && (
            <DropdownPicker
              open={openPicker}
              value={value}
              items={[
                {label: 'Duty Roster', value: 'Presence'},
                {label: 'Appointments', value: 'Events'},
              ]}
              style={styles.dropdown}
              setOpen={setOpenPicker}
              setValue={setValue}
              placeholder="Select Option"
              zIndex={1}
            />
          )}
        </View>
        {Platform.isPad !== true &&
          (props?.item?.firstName === authState?.signIn?.data?.firstname ? (
            <View
              style={
                authState?.signIn?.data?.status === 'available'
                  ? styles.statusBox
                  : authState?.signIn?.data?.status === 'unavailable'
                  ? styles.statusBoxOffline
                  : styles.statusBoxAway
              }
            />
          ) : (
            <View
              style={
                props?.item?.status === 'available'
                  ? styles.statusBox
                  : styles.statusBoxOffline
              }
            />
          ))}
      </View>
      {Platform.isPad === true && (
        <DropdownPicker
          open={openPicker}
          value={value}
          items={[
            {label: 'Duty Roster', value: 'Presence'},
            {label: 'Appointments', value: 'Events'},
          ]}
          style={styles.dropdown}
          setOpen={setOpenPicker}
          setValue={setValue}
          placeholder="Select Option"
          zIndex={1}
        />
      )}
    </View>
  );
}

export const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 15,
    zIndex: 1,
  },
  contentBoxDark: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: Platform.isPad === true ? 'center' : 'flex-start',
    paddingVertical: 16,
    paddingHorizontal: 14,
    backgroundColor: '#1A1A1A',
    width: '100%',
    marginTop: 17,
    borderRadius: 4,
    zIndex: 1,
  },
  contentBoxLight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: Platform.isPad === true ? 'center' : 'flex-start',
    paddingVertical: 16,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(129,129,165,.2)',
    width: '100%',
    marginTop: 17,
    borderRadius: 4,
    zIndex: 1,
  },
  cardIcon: {
    height: Platform.isPad === true ? 43 : 38,
    width: Platform.isPad === true ? 42 : 37,
    resizeMode: 'contain',
  },
  employeeTextBox: {
    flexDirection: 'column',
    paddingLeft: 15,
  },
  textItem: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay600,
    fontSize: Platform.isPad === true ? 16 : 14,
    color: '#EAEAEA',
  },
  textItemLight: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay600,
    fontSize: Platform.isPad === true ? 16 : 14,
    color: '#1a1a1a',
  },
  statusBoxWithStatusText: {
    flexDirection: 'row',
    marginTop: Platform.isPad === true ? 5 : 0,
  },
  statusTextItem: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay600,
    fontSize: 12,
    color: '#808191',
    marginLeft: Platform.isPad === true ? 10 : 0,
  },
  statusBox: {
    width: Platform.isPad === true ? 14 : '4%',
    height: Platform.isPad === true ? 14 : 12,
    borderRadius: 4,
    paddingVertical: Platform.isPad === true ? 0 : 7,
    marginLeft: Platform.isPad === true ? '0%' : '20%',
    backgroundColor: '#41F73D',
  },
  statusBoxOffline: {
    width: Platform.isPad === true ? 14 : '4%',
    height: Platform.isPad === true ? 14 : 12,
    borderRadius: 4,
    paddingVertical: Platform.isPad === true ? 0 : 7,
    marginLeft: Platform.isPad === true ? '0%' : '20%',
    backgroundColor: '#808191',
  },
  statusBoxAway: {
    width: Platform.isPad === true ? 14 : '4%',
    height: Platform.isPad === true ? 14 : 12,
    borderRadius: 4,
    paddingVertical: Platform.isPad === true ? 0 : 7,
    marginLeft: Platform.isPad === true ? '0%' : '20%',
    backgroundColor: '#FF6600',
  },
  dropdown: {
    backgroundColor: '#808191',
    borderRadius: 12,
    width: '100%',
    marginTop: 5,
    paddingBottom: 5,
    justifyContent: 'center',
  },
  calenderButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  calenderBtn: {
    backgroundColor: '#1A1A1A',
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 42,
    marginTop: 14,
  },
  calenderActiveBtn: {
    backgroundColor: '#30C6EA',
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 42,
    marginTop: 14,
  },
  calenderBtnText: {
    fontFamily: GlobalStyle.fontSet.Lato700,
    fontSize: 12,
    color: '#EAEAEA',
    textTransform: 'capitalize',
  },

  addEventBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  spaceBtns: {
    flex: 0,
    flexBasis: '45%',
  },
  confirmBtn: {
    backgroundColor: '#30C6EA',
    borderRadius: 4,
    width: '100%',
    height: 35,
  },
  actionTitle: {
    color: '#FBFBFB',
    textTransform: 'capitalize',
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: 10,
    lineHeight: Platform.OS === 'ios' ? 0 : 15,
  },
});
