import React from 'react';
import {SafeAreaView, FlatList} from 'react-native';
import SettingItems from './component/settingItems';
import {styles} from './setting.style';
import GlobalStyle from '../../style/globalstyle';
import { useSelector } from 'react-redux';

const Data = [
  {
    id: '1',
    title: 'Live-Sync',
  },
  {
    id: '2',
    title: 'Stayed logged in',
  },
  {
    id: '3',
    title: 'Download images on demand',
  },
];

export default function SettingView(props) {
  const themeState = useSelector(
    state => state.rootReducers?.appComponentReducer,
  );
  return (
    <SafeAreaView
      style={
        (styles.container,
        themeState?.activeTheme === 'light'
          ? GlobalStyle.lightTheme
          : GlobalStyle.darkTheme)
      }>
      <FlatList
        data={Data}
        renderItem={({item}) => <SettingItems item={item} theme={themeState} />}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
}
