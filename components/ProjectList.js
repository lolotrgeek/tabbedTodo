import React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';


export default function ProjectList(props) {
	return (
		<View style={styles.listContainer}>
			<View>
				<Text style={styles.listItem} onPress={props.onPress}>{props.text}</Text>
			</View>
			<Button title='Edit' onPress={props.onEdit} style={{ marginLeft: 10 }} />
			<Icon
				name="trash-2"
				size={30}
				color="red"
				style={{ marginLeft: 'auto' }}
				onPress={props.deleteEntry}
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
		minHeight: 40
	},
	listItem: {
		paddingBottom: 20,
		paddingLeft: 10,
		marginTop: 6,
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