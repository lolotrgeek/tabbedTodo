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
import { TimerStopNotes } from '../components/TimerNotes'
import { DatePicker, TimePicker } from '../components/DatePickers'
import { addMinutes } from 'date-fns'
// import { CommonActions } from '../node_modules/@react-navigation/native/lib/typescript/core/src'

export default function TimerEditorScreen({ route, navigation }) {
    const { timer, project } = route.params

    console.log(timer)
    const timerKey = timer[0]
    const timerEntry = timer[1]

    const [key, setKey] = useState('')
    const [created, setCreated] = useState('')
    const [ended, setEnded] = useState('')
    const [projectName, setProjectName] = useState('')
    const [start, setStart] = useState('');
    const [stop, setStop] = useState('');
    const [mood, setMood] = useState('')
    const [energy, setEnergy] = useState(0)

    const timerValid = () => Array.isArray(timer) && timerEntry.type === 'timer' ? true : false
    const createdValid = () => typeof timer[1].created.charAt(0) === 'number' ? true : false

    const handleRoutedParams = () => {
        if (timer && timerValid) {
            setKey(timer[0])
            setStart(timer[1].start)
            setStop(timer[1].stop)
            setMood(timer[1].mood)
            setEnergy(timer[1].energy)
            setProjectName(project[1].name)
            if (createdValid) {
                setCreated(timer[1].created)
                setEnded(timer[1].ended)
            }
        }
    }

    useEffect(() => {
        handleRoutedParams()
    }, [])

    const handleComplete = () => {
        timer[1].created = created
        timer[1].ended = ended
        timer[1].stop = stop
        timer[1].start = start
        timer[1].energy = energy
        timer[1].mood = mood
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

            <DatePicker
                startdate={created}
                onDateChange={newDate => setCreated(newDate)}
            />

            <Text style={{ fontSize: 20 }}>Start</Text>
            <View style={styles.textInputContainer}>
                {/* <Button title='-5' onPress={() => { setStart(start => start - 5) }}></Button> */}
                <Button title='-5' onPress={() => { setCreated(time => addMinutes(new Date(time), -5)) }}></Button>
                <TimePicker
                    time={new Date(created)}
                    onTimeChange={newTime => setCreated(newTime)}
                />
                {/* <Button title='+5' onPress={() => { setStart(start => start + 5) }}></Button> */}
                <Button title='+5' onPress={() => { setCreated(time => addMinutes(new Date(time), 5)) }}></Button>
            </View>
            <Text style={{ fontSize: 20 }}>Stop </Text>
            <View style={styles.textInputContainer}>

            <Button title='-5' onPress={() => { setEnded(time => addMinutes(new Date(time), -5)) }}></Button>

                <TimePicker
                    time={new Date(ended)}
                    onTimeChange={newTime => setEnded(newTime)}
                />
                <Button title='+5' onPress={() => { setEnded(time => addMinutes(new Date(time), 5)) }}></Button>

            </View>

            <TimerStopNotes
                onGreat={() => setMood('great')}
                onGood={() => setMood('good')}
                onMeh={() => setMood('meh')}
                onSad={() => setMood('bad')}
                onAwful={() => setMood('awful')}
                selected={mood}
                startingEnergy={energy}
                onEnergySet={(event, value) => setEnergy(value)}
            />
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