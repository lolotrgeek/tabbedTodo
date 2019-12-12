import React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';


export default function ProjectList(props) {
	return (
		<View style={styles.listContainer}>
			<Icon
				name="package"
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

const styles = StyleSheet.create({
	listContainer: {
		marginTop: '5%',
		flexDirection: 'row',
		borderColor: '#aaaaaa',
		borderBottomWidth: 1.5,
		width: '100%',
		alignItems: 'stretch',
		minHeight: 40,
		paddingBottom: 20,
	},
	listItem: {
		paddingLeft: 10,
		marginTop: 6,
		marginRight: 10,
		borderColor: 'green',
		fontSize: 17,
		fontWeight: 'bold',
		color: 'black'
	},
	verticalLine: {
		borderBottomColor: 'green',
		borderBottomWidth: 4,
		marginLeft: 10,
		width: '100%',
		position: 'absolute',
		marginTop: 15,
	}
});