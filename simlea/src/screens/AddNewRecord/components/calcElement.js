import React, {useState} from 'react';
import {View, Text, StyleSheet } from 'react-native';

export default function CalcElement(props) {
  return( 
    <View style={styles.mainView}>
<Text  style={{textDecoration:"underline",fontSize:14,lineHeight:13,color:"#EAEAEA"}}>calc element</Text>
</View>
  )
}

export const styles = StyleSheet.create({
  mainView:
  {
   display:"flex",
   justifyContent:"center",
   alignItems:"center",
 
  }
});

