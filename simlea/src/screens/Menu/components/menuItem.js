import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import GlobalStyle from '../../../style/globalstyle';

export default function MenuItem(props) {
  return (
    <TouchableOpacity
      key={props.item.id}
      style={[
        styles.menuLists,
        props.theme.activeTheme === 'light'
          ? GlobalStyle.lightTheme
          : GlobalStyle.darkTheme,
      ]}
      onPress={() => props.handleMenu(props.item.name)}>
      <Text
        style={[
          props.theme.activeTheme === 'light'
            ? styles.menuItemsDark
            : styles.menuItemsLight,
        ]}>
        {props.item.name}
      </Text>
    </TouchableOpacity>
  );
}

export const styles = StyleSheet.create({
  menuLists: {
    marginLeft: 18,
    borderBottomColor: '#6C6C6C',
    borderBottomWidth: 1,
    marginBottom: 12,
    paddingBottom: 12,
    paddingLeft: 15,
  },
  menuItemsDark: {
    fontSize: 15,
    color: '#1a1a1a',
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
  },
  menuItemsLight: {
    fontSize: 15,
    color: '#FBFBFB',
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
  },
});
