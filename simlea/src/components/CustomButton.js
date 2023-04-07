/* eslint-disable prettier/prettier */
import React from 'react';
import {Button} from 'react-native-paper';

export default function CustomButton(props) {
  return (
    <Button
      mode="contained"
      icon={props.icon}
      contentStyle={props.contentStyle}
      style={props.style}
      labelStyle={props.labelStyle}
      onPress={props.onPress}>
      {props.title}
    </Button>
  );
}
