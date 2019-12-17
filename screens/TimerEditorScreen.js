import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { updateItem, removeItem } from '../constants/Store'
import { TimerStopNotes } from '../components/TimerNotes'
import { DatePicker, TimePicker } from '../components/DatePickers'
import { addMinutes } from 'date-fns'
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'
import { timerValid, createdValid } from '../constants/Validators'

export default function TimerEditorScreen({ route, navigation }) {
    const { timer, project, lastscreen } = route.params

    const timerKey = timer[0]
    const timerEntry = timer[1]

    const [key, setKey] = useState('')
    const [created, setCreated] = useState('')
    const [ended, setEnded] = useState('')
    const [projectName, setProjectName] = useState('')
    const [start, setStart] = useState('');
    const [stop, setStop] = useState('');
    const [mood, setMood] = useState('')
    const [energy, setEnergy] = useState(timer[1].energy ? timer[1].energy : 0)


    const deleteEntry = () => {
        removeItem(timerKey)
        // TODO: are you sure? modal
        navigation.navigate(lastscreen ? lastscreen : 'Projects', {
            project: project
        })
    }

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
        if (!timeRules(created, ended)) {
            // MODAL HERE
            console.log('Cannot End before Start.')
            return false
        }
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
        navigation.navigate(lastscreen ? lastscreen : 'Projects', {
            project: project
        })
    }

    return (
        <View style={styles.container}>
            {/* <Text style={{
                marginTop: '5%',
                fontSize: 20,
                // color: color,
                paddingBottom: 10
            }}>{projectName}</Text> */}
            <View style={styles.textInputContainer}>
                <Text style={styles.sideTitle}>Date </Text>

                <DatePicker
                    label=' '
                    startdate={created}
                    onDateChange={newDate => setCreated(newDate)}
                />
            </View>
            <View style={styles.textInputContainer}>
                <Text style={styles.sideTitle}>Start</Text>
                <TouchableOpacity onPress={() => { setCreated(time => addMinutes(new Date(time), -5)) }}>
                    <FontAwesome name="chevron-left" style={{ fontSize: 20, marginRight: 10 }} />
                </TouchableOpacity>
                <TimePicker
                    label=' '
                    time={new Date(created)}
                    onTimeChange={newTime => setCreated(newTime)}
                />
                <TouchableOpacity onPress={() => { setCreated(time => addMinutes(new Date(time), 5)) }}>
                    <FontAwesome name="chevron-right" style={{ fontSize: 20, marginLeft: 10 }} />
                </TouchableOpacity>
            </View>

            <View style={styles.textInputContainer}>
                <Text style={styles.sideTitle}>End </Text>
                <TouchableOpacity onPress={() => { setEnded(time => addMinutes(new Date(time), -5)) }}>
                    <FontAwesome name="chevron-left" style={{ fontSize: 20, marginRight: 10 }} />
                </TouchableOpacity>

                <TimePicker
                    label=' '
                    time={new Date(ended)}
                    onTimeChange={newTime => setEnded(newTime)}
                />
                <TouchableOpacity onPress={() => { setEnded(time => addMinutes(new Date(time), 5)) }}>
                    <FontAwesome name="chevron-right" style={{ fontSize: 20, marginLeft: 10 }} />
                </TouchableOpacity>

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
            <TouchableOpacity onPress={() => deleteEntry()}>
                <FontAwesome5 name='trash-alt' color='red' style={styles.delete} />
            </TouchableOpacity>

        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        padding: 10
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
        paddingRight: 10,
        paddingBottom: 10
    },
    sideTitle: {
        fontSize: 20,
        width: 100,
        marginRight: '1%',
        marginLeft: '1%'
    },
    delete: {
        fontSize: 20,
        margin: '2%'
    }
});