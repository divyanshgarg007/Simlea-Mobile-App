import React, {useState} from 'react';
import CustomTextInput from './customTextInput';
import moment from 'moment';

export default function TimeComponent(props) {
  const [time, setTime] = useState(moment().format('HH:MM'));
  return (
    <CustomTextInput
      style={props.style}
      keyboardType="numeric"
      placeholder="Time"
      value={time}
      onChangeText={setTime}
    />
  );
}
