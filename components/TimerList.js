import React from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { FontAwesome5 } from '@expo/vector-icons'
import {styles} from '../constants/Styles'


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