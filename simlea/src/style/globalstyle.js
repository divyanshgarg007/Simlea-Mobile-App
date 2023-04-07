/* eslint-disable prettier/prettier */
import {Dimensions} from 'react-native';

const _fontSet = {
  Lato400: 'Lato-Regular',
  Lato700: 'Lato-Bold',
  RedHatDisplay900: 'RedHatDisplay-Black',
  RedHatDisplay800: 'RedHatDisplay-ExtraBold',
  RedHatDisplay700: 'RedHatDisplay-Bold',
  RedHatDisplay600: 'RedHatDisplay-SemiBold',
  RedHatDisplay500: 'RedHatDisplay-Medium',
  RedHatDisplay400: 'RedHatDisplay-Regular',
  RedHatDisplay300: 'RedHatDisplay-Light',
  OpenSans400: 'OpenSans-Regular',
};

const GlobalStyle = {
  fontSet: _fontSet,
  width: Dimensions.get('screen').width,
  height: Dimensions.get('screen').height,
  darkTheme: {
    backgroundColor: '#262626',
    color: '#FBFBFB',
  },
  lightTheme: {
    backgroundColor: '#FFFFFF',
    color: '#1A1A1A',
  },
};

export default GlobalStyle;
