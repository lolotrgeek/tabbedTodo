import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export default function EntryList(props) {
	return (
		<View style={styles.listContainer}>
			{/* <Icon
				name={props.name}
				size={30}
				color="black"
				style={{ marginLeft: 15 }}
				onPress={props.openEntry}
			/> */}
			<View>
				<Text style={styles.listItem} onPress={props.editItem}>{props.text}</Text>

			</View>

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

	listItem: {
		paddingBottom: 20,
		paddingLeft: 10,
		marginTop: 6,
		borderColor: 'green',
		borderBottomWidth: 1,
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