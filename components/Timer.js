import React from 'react';
import { View, Text, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {styles} from '../constants/Styles'


export function Timer(props) {
	return (
		<View>
			<View>
				<Text style={styles.counter}>{props.counter}</Text>
			</View>
			<View style={{ display: props.hideStart }}>
				<Button title='Start' style={{ marginLeft: 'auto' }} onPress={props.start} />
			</View>
			<View style={{ display: props.hideStop }}>
				<Button title='Stop' style={{ flex: 1, marginLeft: 'auto' }} onPress={props.stop} />
			</View>
		</View >
	);
}