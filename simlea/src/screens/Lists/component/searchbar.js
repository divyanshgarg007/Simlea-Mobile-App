/* eslint-disable prettier/prettier */
import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  Platform,
  TouchableOpacity,
} from 'react-native';
import GlobalStyle from '../../../style/globalstyle';

export default function SearchBar(props) {
  return (
    <View
      style={[
        styles.container,
        props.theme.activeTheme === 'light'
          ? GlobalStyle.lightTheme
          : GlobalStyle.darkTheme,
      ]}>
      <View style={styles.boxWithImage}>
        <Image
          source={require('../../../assets/images/Search.png')}
          style={styles.searchImage}
        />
        <TextInput
          color="#FBFBFB"
          textAlign="left"
          style={[
            styles.searchBox,
            props.theme.activeTheme === 'light'
              ? GlobalStyle.lightTheme
              : GlobalStyle.darkTheme,
          ]}
          placeholder="Search"
          placeholderTextColor={
            props.theme.activeTheme === 'light' ? '#1a1a1a' : '#FBFBFB'
          }
          value={props.value}
          onChangeText={text => props.setSearch(text)}
          keyboardType={props.keyboardType}
        />
      </View>
      <TouchableOpacity onPress={() => props.onPress()}>
        {props.theme.activeTheme === 'light' ? (
          <Image
            source={require('../../../assets/images/downIcon.png')}
            style={styles.downIcon}
          />
        ) : (
          <Image
            source={require('../../../assets/images/down.png')}
            style={styles.downIcon}
          />
        )}
      </TouchableOpacity>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {flexDirection: 'row', justifyContent: 'space-between'},
  boxWithImage: {
    marginTop: Platform.isPad === true ? 28 : 7,
    marginLeft: Platform.isPad === true ? 28 : 20,
    flexDirection: 'row',
    borderColor: '#808191',
    borderWidth: 1,
    borderRadius: Platform.isPad === true ? 9 : 6,
    height: '75%',
  },
  searchBox: {
    width: '75%',
    paddingVertical:
      Platform.isPad === true ? 10 : Platform.OS === 'ios' ? 7 : 5,
    marginLeft: 8,
    padding: 10,
  },
  searchImage: {
    height: Platform.isPad === true ? 22 : 15,
    width: Platform.isPad === true ? 21 : 14,
    marginTop: Platform.isPad === true ? 12 : Platform.OS === 'ios' ? 7 : 9,
    marginLeft: Platform.isPad === true ? 16 : 7,
    resizeMode: 'contain',
  },
  downIcon: {
    height: Platform.isPad === true ? 40 : 24,
    width: Platform.isPad === true ? 22 : 18,
    marginRight: Platform.isPad === true ? 68 : 20,
    marginTop: Platform.isPad === true ? 28 : 10,
    backgroundColor: 'transparent',
    resizeMode: 'contain',
  },
});
