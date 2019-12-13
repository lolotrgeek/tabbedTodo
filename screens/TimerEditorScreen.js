import React, { useState, useEffect } from 'react';
import { ExpoLinksView } from '@expo/samples';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
} from 'react-native';
import { updateItem } from '../constants/Store'
// import { CommonActions } from '../node_modules/@react-navigation/native/lib/typescript/core/src'

export default function TimerEditorScreen({ route, navigation }) {
    const { timer, project } = route.params

    const [key, setKey] = useState('')
    const [created, setCreated] = useState('')
    const [projectName, setProjectName] = useState('')
    const [start, setStart] = useState('');
    const [stop, setStop] = useState('');

    const timerValid = () => Array.isArray(timer) && timer[1] === 'timer' ? true : false
    const createdValid = () => typeof timer[1].created.charAt(0) === 'number' ? true : false

    const handleRoutedParams = () => {
        if (timer && timerValid) {
            setKey(timer[0])
            setStart(timer[1].start)
            setStop(timer[1].stop)
            setProjectName(project[1].name)
            if (createdValid) {
                setCreated(timer[1].created)
            }
        }
    }

    useEffect(() => {
        handleRoutedParams()
    }, [])

    const handleComplete = () => {
        timer[1].stop = stop
        timer[1].start = start
        timer[1].total = Math.abs(start) + Math.abs(stop) 
        console.log(timer[1])
        if (key) {
            updateItem(key, timer[1])
        }
        navigation.navigate()
    }

    return (
        <View style={styles.container}>
            <Text style={{
                marginTop: '10%',
                fontSize: 40,
                // color: color,
                paddingBottom: 10
            }}>{projectName}</Text>

            <Text style={{
                fontSize: 30,
                // color: color,
                paddingBottom: 10
            }}>{created}</Text>

            <Text style={{fontSize: 20}}>Start</Text>
            <View style={styles.textInputContainer}>
                <Button title='-5' onPress={() => {setStart(start => start - 5)}}></Button>
                <TextInput
                    keyboardType='numeric'
                    style={styles.textInput}
                    multiline={false}
                    placeholder="Start"
                    placeholderTextColor="#abbabb"
                    value={start.toString()}
                    onChangeText={input => setStart(input)}
                />
                <Button title='+5' onPress={() => {setStart(start => start + 5)}}></Button>
            </View>
            <Text style={{fontSize: 20}}>Stop </Text>
            <View style={styles.textInputContainer}>

            <Button title='-5' onPress={() => {setStop(stop => stop - 5)}}></Button>
                <TextInput
                    style={styles.textInput}
                    multiline={false}
                    placeholder="Stop"
                    placeholderTextColor="#abbabb"
                    value={stop.toString()}
                    onChangeText={input => setStop(input)}
                />
                <Button title='+5' onPress={() => {setStop(stop => stop + 5); }}></Button>
            </View>
            <Button title='Done' onPress={() => handleComplete()}></Button>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    header: {
        marginTop: '10%',
        fontSize: 40,
        color: 'black',
        paddingBottom: 10
    },
    textInputContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        borderColor: 'black',
        borderBottomWidth: 1,
        paddingRight: 10,
        paddingBottom: 10
    },
    textInput: {
        flex: 1,
        height: 20,
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        paddingLeft: 10,
        minHeight: '3%',
        paddingBottom: 10
    },
    colorPicker: {
        flex: 1,
        marginTop: 10,
    }
});