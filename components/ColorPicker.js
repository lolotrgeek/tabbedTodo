import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'

export const ColorPicker = (props) => {
    const defaults = {
        width: 252,
        circleSize: 28,
        circleSpacing: 14,
      }
    const styles = StyleSheet.create({
        swatch: {
            width: props.circleSize,
            height: props.circleSize,
            marginRight: props.circleSpacing,
            marginBottom: props.circleSpacing,
            borderRadius: props.circleSpacing,
            backgroundColor: props.color,
        },
    })
    return (
        <TouchableOpacity onPress={props.onPress}>
            <View
                style={styles.swatch}
                key={props.color}
            />
        </TouchableOpacity>

           

    )
}

