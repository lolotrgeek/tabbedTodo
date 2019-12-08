import React from 'react';
import { StyleSheet, View, Text, Button, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export function Timeline(props) {
    console.log(props.color)
    return (
        <View style={styles.listContainer}>
            <View>
                <Text style={{
                    paddingBottom: 20,
                    paddingLeft: 10,
                    marginTop: 6,
                    fontSize: 15,
                    fontWeight: 'bold',
                    color: 'black',
                    backgroundColor: props.color
                }}
                    onPress={props.onPress}>
                    {props.project} - Total : {props.total}  ({props.date})
                </Text>
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