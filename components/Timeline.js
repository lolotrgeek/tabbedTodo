import React from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {styles} from '../constants/Styles'

export function Timeline(props) {
    return (
        <View style={styles.listContainer}>
            <View style={{flex: 1, flexDirection: 'column', width:'50%'}}>
                <Text
                    style={{ color: props.color, fontSize: 20 }}
                    onPress={props.onPress}
                >
                    {props.project}
                </Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'column', width:'50%' }}>
                <Text
                    style={styles.listItem}
                >
                    {props.total}
                </Text>
            </View>
        </View>
    );
}
