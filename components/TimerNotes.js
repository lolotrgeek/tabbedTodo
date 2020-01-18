import React from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { Slider } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { styles } from '../constants/Styles'


export function MoodPicker(props) {
    return (
        <View style={styles.container}>
            <View style={styles.moodContainer}>
                <FontAwesome5
                    name='grin'
                    color='orange'
                    style={{
                        fontWeight: props.selected === 'great' ? 'bold' : 'normal',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        fontSize: props.selected === 'great' ? 60 : 40
                    }}
                    onPress={props.onGreat}
                />
                <FontAwesome5
                    name='smile'
                    size={40}
                    color='green'
                    style={{
                        fontWeight: props.selected === 'good' ? 'bold' : 'normal',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        fontSize: props.selected === 'good' ? 60 : 40
                    }}
                    onPress={props.onGood}
                />
                <FontAwesome5
                    name='meh'
                    size={40}
                    color='purple'
                    style={{
                        fontWeight: props.selected === 'meh' ? 'bold' : 'normal',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        fontSize: props.selected === 'meh' ? 60 : 40
                    }}
                    onPress={props.onMeh}
                />
                <FontAwesome5
                    name='frown'
                    size={40}
                    color='blue'
                    style={{
                        fontWeight: props.selected === 'bad' ? 'bold' : 'normal',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        fontSize: props.selected === 'bad' ? 60 : 40
                    }}
                    onPress={props.onSad}
                />
                <FontAwesome5
                    name='dizzy'
                    size={40}
                    color='grey'
                    style={{
                        fontWeight: props.selected === 'awful' ? 'bold' : 'normal',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        fontSize: props.selected === 'awful' ? 60 : 40
                    }}
                    onPress={props.onAwful}
                />
            </View >
        </View>
    );
}

/**
 * 
 * @param {object} props 
 * @param {function} props.onEnergySet
 * @param {number} props.startingEnergy
 *  
 */
export function EnergySlider(props) {
    return (
        <View style={styles.energyBar}>
            <Text style={styles.subheader}>Energy Level</Text>
            <Slider
                style={{ width: '100%', height: 50 }}
                minimumValue={0}
                maximumValue={100}
                step={1}
                minimumTrackTintColor='#028910'
                maximumTrackTintColor='#000000'
                onSlidingComplete={props.onEnergySet}
                onValueChange={props.onEnergySet}
                value={props.startingEnergy}
            />

        </View>
    )
}

export function MotivationSet(props) {
    return (
        <View>
            <TextInput
                style={styles.listItem}
                multiline={false}
                placeholder='Motivation'
                placeholderTextColor='#abbabb'
                value={props.mood}
                editable={true}
                onChangeText={props.onChangeText}
                onFocus={props.onFocus}
            />
        </View >
    );
}
