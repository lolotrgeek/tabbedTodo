import React from 'react';
import { StyleSheet, View, Text, Button, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { FontAwesome5 } from '@expo/vector-icons'


export function TimerList(props) {
    return (
        <View style={styles.listContainer}>
            <View style={{ flexDirection: 'column', alignItems: 'center', width: '50%' }}>
                <Text style={styles.listItem} onPress={props.onPress}>
                    {props.project}
                </Text>
            </View>
            <View style={{ flexDirection: 'column', alignItems: 'center', width: '20%' }}>
                <Text style={styles.listItem} onPress={props.onEdit}>
                    {props.total}
                </Text>
            </View>
            <View style={{ flexDirection: 'column', alignItems: 'center', width: '10%' }}>
                <FontAwesome5 style={{ fontSize: 20 }} name={props.mood.name} color={props.mood.color} />
            </View>
            <View style={{ flexDirection: 'column', alignItems: 'center', width: '15%' }}>

                <Text style={styles.listItem} onPress={props.onEdit}>
                    <FontAwesome5 style={{ fontSize: 20 }} name="bolt" color="green" /> {props.energy}
                </Text>
            </View>
        </View >
    );
}


const styles = StyleSheet.create({
    listContainer: {
        flex: 1,
        marginTop: '5%',
        flexDirection: 'row',
        width: '100%',
        alignItems: 'flex-start',
        padding: 10
    },
    listItem: {
        paddingBottom: 20,
        marginTop: 6,
        fontSize: 15,
    }
});