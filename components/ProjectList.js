import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'
import {styles} from '../constants/Styles'

export default function ProjectList(props) {
	return (
		<View style={styles.listContainer}>
			<FontAwesome
				name="circle"
				size={30}
				color={props.color}
				style={{ marginRight: 5, marginTop: 5 }}
			/>

			<Text style={styles.listItem} onPress={props.onView}>{props.text}</Text>
		</View>
	);
}