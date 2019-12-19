import React from 'react';
import { View, Text, Button } from 'react-native';
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

			<Text style={styles.listItem} onPress={props.onPress}>{props.text}</Text>

			<Button
				title='View'
				onPress={props.onView}
				style={{ marginLeft: 20, paddingBottom: 30 }}
			/>
			<Button
				title='Edit'
				onPress={props.onPress}
				style={{ marginLeft: 20, paddingBottom: 30 }}
			/>
			<Button
				title='Start'
				onPress={props.onStart}
				style={{ marginLeft: 20, paddingBottom: 30 }}
			/>
		</View>
	);
}