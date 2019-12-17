import React from 'react';
import { StyleSheet, View, Text, Button, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

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

export function TimerList(props) {
	return (
		<View style={styles.listContainer}>
			<View>
				<Text style={styles.listItem} onPress={props.onPress} >{props.date} - Start : {props.start} Stop : {props.stop} Total: {props.total}</Text>
				<Button title='Edit' style={{ flex: 1, marginLeft: 'auto' }} onPress={props.onEdit} />
			</View>

		</View>
	);
}


const styles = StyleSheet.create({
	header: {
		marginTop: '5%',
		fontSize: 40,
		color: 'black',
		paddingBottom: 10
	  },
	  subheader: {
		fontSize: 20,
		color: 'black',
	  },
	counter: {
		marginTop: '5%',
		fontSize: 70,
		color: 'black',
		paddingBottom: 10
	},
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