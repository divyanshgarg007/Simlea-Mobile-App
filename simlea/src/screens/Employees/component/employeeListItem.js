/* eslint-disable prettier/prettier */
import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import {Text, Avatar} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import normalize from 'react-native-normalize';
import {useSelector} from 'react-redux';
import GlobalStyle from '../../../style/globalstyle';
import {tr} from 'date-fns/locale';
import * as authStateAction from '../../../redux/action/authActions';

export default function EmployeeListItem(props) {
  const authState = useSelector(state => state.rootReducers?.authState);

  return (
    <TouchableOpacity
      style={styles.listContainer}
      onPress={() => props.onPress(props?.item?.id)}>
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
                : styles.textItemDark
            }>
            {props?.item?.firstName} {props?.item?.lastName}
          </Text>
          <Text style={styles.statusTextItem}>
            {props?.item?.firstName === authState?.signIn?.data?.firstname
              ? authState?.signIn?.data?.status
              : props?.item?.status}
          </Text>
        </View>
        {props?.item?.firstName === authState?.signIn?.data?.firstname ? (
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
        )}
      </View>
    </TouchableOpacity>
  );
}

export const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 15,
  },
  contentBoxDark: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: Platform.isPad === true ? 'space-around' : 'flex-start',
    paddingVertical: Platform.isPad === true ? 10 : 16,
    paddingHorizontal: 10,
    backgroundColor: '#1A1A1A',
    width: '100%',
    marginTop: 17,
    borderRadius: 4,
  },
  contentBoxLight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: Platform.isPad === true ? 'space-around' : 'flex-start',
    paddingVertical: Platform.isPad === true ? 10 : 16,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(129,129,165,.2)',
    width: '100%',
    marginTop: 17,
    borderRadius: 4,
  },
  cardIcon: {
    height: 38,
    width: 38,
    resizeMode: 'contain',
  },
  employeeTextBox: {
    marginLeft: Platform.isPad === true ? 0 : 15,
    width: Platform.isPad === true ? '85%' : '80%',
  },
  textItemDark: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay600,
    fontSize: Platform.isPad === true ? 16 : 14,
    color: '#FBFBFB',
  },
  textItemLight: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay600,
    fontSize: Platform.isPad === true ? 16 : 14,
    color: '#1a1a1a',
  },
  statusTextItem: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay600,
    fontSize: 12,
    color: '#808191',
    marginTop: 5,
  },
  statusBox: {
    width: Platform.isPad === true ? 14 : '4%',
    height: Platform.isPad === true ? 14 : 12,
    borderRadius: 4,
    paddingVertical: 7,
    backgroundColor: '#41F73D',
  },
  statusBoxOffline: {
    width: Platform.isPad === true ? 14 : '4%',
    height: Platform.isPad === true ? 14 : 12,
    borderRadius: 4,
    paddingVertical: 7,
    backgroundColor: '#808191',
  },
  statusBoxAway: {
    width: Platform.isPad === true ? 14 : '4%',
    height: Platform.isPad === true ? 14 : 12,
    borderRadius: 4,
    paddingVertical: 7,
    backgroundColor: '#FF6600',
  },
});
