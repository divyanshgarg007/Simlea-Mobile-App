/* eslint-disable prettier/prettier */
import React from 'react';
import {View, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {Text, Avatar} from 'react-native-paper';
import normalize from 'react-native-normalize';
import GlobalStyle from '../../../style/globalstyle';

export default function DraftEmployeeListItem(props) {
  return (
    <TouchableOpacity style={styles.listContainer} onPress={props.onPress}>
      <View
        style={
          props.theme.activeTheme === 'light'
            ? [styles.contentBoxLight, props.bgColor]
            : [styles.contentBoxDark, props.bgColor]
        }>
        {
          props?.item?.userImage?.data ? (
            <Image
              source={{
                uri: `data:image/props?.item?.userImage?.extension;base64,${props?.item?.userImage?.data}`,
              }}
              style={styles.cardIcon}
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
          <Text style={styles.statusTextItem}>{props?.item?.status}</Text>
        </View>
        <View
          style={
            props?.item?.status === 'offline'
              ? styles.statusBoxOffline
              : styles.statusBox
          }
        />
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
    paddingVertical: 16,
    paddingHorizontal: 10,
    backgroundColor: '#1A1A1A',
    width: '100%',
    marginTop: 17,
    borderRadius: 4,
  },
  contentBoxLight: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(129,129,165,.2)',
    width: '100%',
    marginTop: 17,
    borderRadius: 4,
  },
  cardIcon: {
    height: 38,
    width: 38,
  },
  employeeTextBox: {
    marginLeft: 15,
    width: '80%',
  },
  textItemDark: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay600,
    fontSize: 14,
    color: '#FBFBFB',
  },
  textItemLight: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay600,
    fontSize: 14,
    color: '#1a1a1a',
  },
  statusTextItem: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay600,
    fontSize: 12,
    color: '#808191',
    marginTop: 5,
  },
  statusBox: {
    width: '4%',
    height: 12,
    borderRadius: 4,
    paddingVertical: 7,
    backgroundColor: '#41F73D',
  },
  statusBoxOffline: {
    width: '4%',
    height: 12,
    borderRadius: 4,
    paddingVertical: 7,
    backgroundColor: '#808191',
  },
});
