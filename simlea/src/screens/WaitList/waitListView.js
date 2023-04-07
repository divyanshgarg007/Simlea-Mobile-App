import React, { useCallback } from 'react';
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import WaitListItem from './components/waitListItem';
import home from '../../assets/images/home.png';
import {useSelector} from 'react-redux';
import {styles} from './waitList.style';
import GlobalStyle from '../../style/globalstyle';
import {IconButton} from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import * as syncService from '../../database/SyncService';
import { APLLICATION_RECORD } from '../../database/Constants';

export default function WaitListView(props) {
  const themeState = useSelector(
    state => state.rootReducers?.appComponentReducer,
  );
  const Data = [
    {
      id: 1,
      dateModified: '24.05.2022 15:40:18',
      leadid: 'ts2-GEW-20-0009',
      appUser: 'Ralph lee',
      name: 'Gew Form',
    },
  ];


  useFocusEffect(
    useCallback(() => {
      fetchWaitListData();
    }, []),
  );


  async function fetchWaitListData() {
    console.log('fetchWaitListData called');
    console.log(APLLICATION_RECORD.EVENT);
    console.log( APLLICATION_RECORD.CURRENT_USER.token)
    const response1 = await syncService.getWaitlist();
     console.log('fetchWaitListData called',response1)
  }


  return (
    <View
      style={[
        styles.container,
        themeState?.activeTheme === 'light'
          ? GlobalStyle.lightTheme
          : GlobalStyle.darkTheme,
      ]}>
      <FlatList
        data={Data}
        renderItem={({item}) => <WaitListItem item={item} />}
        keyExtractor={item => item.id}
      />
    </View>
  );
}
