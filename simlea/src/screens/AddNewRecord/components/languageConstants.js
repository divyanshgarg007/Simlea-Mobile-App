import React, {useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Image,
  Platform,
  SafeAreaView,
  Touchable,
  TouchableOpacity,
} from 'react-native';
import GlobalStyle from '../../../style/globalstyle';

export const LanguageConstants = () => {
  const Data = [
    {id: 1, langs: 'Chinese Simplified'},
    {id: 2, langs: 'Chinese Traditional'},
    {id: 3, langs: 'Czech'},
    {id: 4, langs: 'Danish'},
    {id: 5, langs: 'Dutch (Netherlands)'},
    {id: 6, langs: 'English'},
    {id: 7, langs: 'Estonian'},
    {id: 8, langs: 'Finnish'},
    {id: 9, langs: 'French'},
    {id: 10, langs: 'German'},
    {id: 11, langs: 'Greek'},
    {id: 12, langs: 'Hungarian'},
    {id: 13, langs: 'Indonesian'},
    {id: 14, langs: 'Italian'},
    {id: 15, langs: 'Japanese'},
    {id: 16, langs: 'Korean'},
    {id: 17, langs: 'NorwegianNynorsk + NorwegianBokmal'},
    {id: 18, langs: 'Norwegian (Bokmal)'},
    {id: 19, langs: 'Norwegian (Nynorsk)'},
    {id: 20, langs: 'Polish'},
    {id: 21, langs: 'Portuguese (Brazil)'},
    {id: 22, langs: 'Portuguese (Portugal)'},
    {id: 23, langs: 'Russian'},
    {id: 24, langs: 'Spanish'},
    {id: 25, langs: 'Swedish'},
    {id: 26, langs: 'Turkish'},
    {id: 27, langs: 'Ukrainian'},
  ];
  const [selectKey, setSelectKey] = useState([]);
  const Item = ({item, onPress}: ItemProps) => (
    <TouchableOpacity onPress={onPress} style={styles.item}>
      <Text style={styles.btnText}>{item.langs}</Text>
      {item.id === selectKey ? (
        <Image
          style={styles.checkIcon}
          source={require('../../../assets/images/tick.png')}
        />
      ) : (
        ''
      )}
    </TouchableOpacity>
  );
  const renderItem = ({item}: {item: ItemData}) => {
    return <Item item={item} onPress={() => setSelectKey(item.id)} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={Data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        extraData={selectKey}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Platform.isPad === true ? '58%' : '80%',
    backgroundColor: '#FBFBFB',
    borderRadius: 6,
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingHorizontal: 17,
    paddingVertical: 23,
    zIndex: 1,
  },
  item: {flexDirection: 'row', justifyContent: 'space-between'},
  btnText: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay600,
    fontSize: Platform.isPad === true ? 14 : 12,
    textAlign: 'left',
    color: '#1a1a1a',
  },
  checkIcon: {
    height: Platform.isPad === true ? 16 : 14,
    width: Platform.isPad === true ? 18 : 14,
    resizeMode: 'contain',
  },
});
