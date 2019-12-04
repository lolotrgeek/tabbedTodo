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
			<Button title='Start' style={{ marginLeft: 'auto' }} onPress={props.start} />
			<Button title='Pause' style={{ marginLeft: 'auto' }} onPress={props.pause} />
			<Button title='Reset' style={{ marginLeft: 'auto' }} onPress={props.reset} />
		</View>
	);
}

export function TimerList(props) {
	return (
		<View style={styles.listContainer}>
			<View>
				{<View style={styles.verticalLine} />}
				<View style={styles.listItem}>
					<Text>{props.date} - </Text>
					<Text>{props.days}:{props.hours}:{props.minutes}:{props.seconds}</Text>
				</View>
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