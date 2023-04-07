/* eslint-disable prettier/prettier */
import {Platform, StyleSheet} from 'react-native';
import GlobalStyle from '../../style/globalstyle';

export const styles = StyleSheet.create({
  menuContainer: {
    paddingTop: 20,
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  loginInfo: {
    padding: 0,
  },
  userName: {
    fontSize: 15,
    color: '#222222',
    fontFamily: GlobalStyle.fontSet.RedHatDisplay600,
    paddingLeft: 10,
  },
  modalContainer: {
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: '#FBFBFB',
    borderRadius: 6,
    borderBottomWidth: 1,
    borderColor: '#EAEAEA',
    paddingHorizontal: 16,
    paddingVertical: 30,
  },
  statusBox: {
    width: 14,
    height: 12,
    marginLeft: 28,
    borderRadius: 4,
    paddingVertical: 7,
    backgroundColor: '#41F73D',
  },
  statusBoxAway: {
    width: 14,
    height: 12,
    marginLeft: 28,
    borderRadius: 4,
    paddingVertical: 7,
    backgroundColor: '#FF6600',
  },
  statusBoxOffline: {
    width: 14,
    height: 12,
    marginLeft: 40,
    borderRadius: 4,
    paddingVertical: 7,
    backgroundColor: '#808191',
  },
  switchBox: {
    marginLeft: 15,
    marginRight: 15,
  },
  themeBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeText: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    fontSize: 15,
    color: '#1A1A1A',
  },
  addModalBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.isPad === true ? 37 : 20,
    width: '100%',
  },
  spaceBtns: {
    flex: 0,
    flexBasis: '40%',
  },
  cancelBtn: {
    backgroundColor: '#1A1A1A',
    borderRadius: Platform.isPad === true ? 6 : 4,
    width: '100%',
    height: Platform.isPad === true ? 61 : 35,
  },
  confirmBtn: {
    backgroundColor: '#30C6EA',
    borderRadius: Platform.isPad === true ? 6 : 4,
    width: '100%',
    height: Platform.isPad === true ? 61 : 35,
  },
  actionTitle: {
    color: '#FBFBFB',
    textTransform: 'capitalize',
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: Platform.isPad === true ? 16 : 10,
    lineHeight: Platform.isPad === true ? 20 : Platform.OS === 'ios' ? 0 : 15,
    marginTop: Platform.isPad === true ? 16 : 10,
  },
  checkIcon: {
    height: Platform.isPad === true ? 16 : 14,
    width: Platform.isPad === true ? 18 : 14,
    resizeMode: 'contain',
  },
  modalTick: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
