import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { styles } from '../constants/Styles'

export default function RunningTimer(props) {
    return (
        <TouchableOpacity style={{display: props.display}} onPress={props.onPress}>
            <View style={{ backgroundColor: props.color , padding: 10 }}  >
                <Text style={styles.subheader}>
                    {props.title}
                </Text>
                <Text>
                    {props.project}
                </Text>
                <Text>
                    {props.timer}
                </Text>
            </View>
        </TouchableOpacity>
    )
} 
