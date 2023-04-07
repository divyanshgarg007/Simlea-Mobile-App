import {StyleSheet, Platform} from 'react-native';
import GlobalStyle from '../../style/globalstyle';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#262626',
    flex: 1,
  },
  textItemLight: {
    marginTop: Platform.isPad === true ? 27 : 15,
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: Platform.isPad === true ? 16 : 14,
    color: '#262626',
    textAlign: 'center',
  },
  textItem: {
    marginTop: Platform.isPad === true ? 27 : 15,
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: Platform.isPad === true ? 16 : 14,
    color: '#EAEAEA',
    textAlign: 'center',
  },
});
