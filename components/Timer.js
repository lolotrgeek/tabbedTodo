import React from 'react';
import { StyleSheet, View, Text, Button, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export function TimerInput(props) {

}

export function Timer(props) {
	return (
		<View>
			{/* <Text style={styles.counter}>{props.days}:{props.hours}:{props.minutes}:{props.seconds}</Text> */}
			<Text style={styles.counter}>{props.counter}</Text>
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
			<Icon
				name="trash-2"
				size={30}
				color="red"
				style={{ marginLeft: 'auto' }}
				onPress={props.deleteTimer}
			/>

		</View>
	);
}


const styles = StyleSheet.create({
	counter: {
		marginTop: '15%',
		fontSize: 40,
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