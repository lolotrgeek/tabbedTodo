import React from 'react';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';

/**
 * 
 * @param {object} props 
 * @param {date} props.date
 * @param {function} props.onDateChange
 * @param {*} props.label 
 *  
 */
export function DatePicker(props) {
  return (
    <View>
      <DateTimePicker
        mode="date"
        value={props.date}
        onChange={props.onDateChange}
      />
    </View>

  );
}

/**
 * 
 * @param {object} props
 * @param {boolean} props.running
 * @param {function} props.onTimeChange 
 * @param {date} props.time
 *  
 */
export function TimePicker(props) {
  if (props.running === true) {
    return (
      <TextInput
        value="Tracking"
        editable='false'
      />
    )
  }
  return (
    <View>
      {/* <TimePicker
          ref={ref => {
            TimePicker = ref;
          }}
          selectedHour={props.time}
          selectedMinute={props.time}
          onCancel={() => TimePicker.close()}
          onConfirm={(hour, minute) => props.onTimeChange; TimePicker.close()}
        /> */}
      <DateTimePicker
        mode="time"
        value={props.time}
        onChange={props.onTimeChange}
      />
    </View>
  )

}