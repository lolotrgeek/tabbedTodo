import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../constants/Styles'

export function Timeline(props) {
    return (
        <View style={styles.listContainer}>
            <View style={styles.listParent}>
                <Text style={{ color: props.color, fontSize: 20, }} onPress={props.onPress}>
                    {props.project}
                </Text>
            </View>
            <View style={styles.listParent}>
                <Text style={styles.listItem}>
                    {props.status}
                </Text>
            </View>
            <View style={styles.listParent}>
                <Text style={styles.listItem} onPress={props.onStart}>
                    {props.total}
                </Text>
            </View>
        </View>
    );
}
