import React, { useState, useEffect } from 'react';
import { Text, View, Button, TouchableOpacity } from 'react-native';
import { updateItem, removeItem } from '../constants/Store'
import { TimerStopNotes } from '../components/TimerNotes'
import { DatePicker, TimePicker } from '../components/DatePickers'
import { addMinutes } from 'date-fns'
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'
import { timerValid, createdValid } from '../constants/Validators'
import { timeRules, isRunning } from '../constants/Functions'
import { styles } from '../constants/Styles'

export default function TimerEditorScreen({ route, navigation }) {
    const { timer, project, lastscreen } = route.params
    const timerKey = timer[0]
    const timerEntry = timer[1]
    let color = project[1].color
    const projectName = project[1].name

    const [key, setKey] = useState('')
    const [created, setCreated] = useState('')
    const [ended, setEnded] = useState('')
    const [start, setStart] = useState('');
    const [stop, setStop] = useState('');
    const [mood, setMood] = useState('')
    const [energy, setEnergy] = useState(projectName ? timer[1].energy : 0)

    useEffect(() => navigation.setOptions({ title: projectName + ' - Timer Entry', headerStyle: { backgroundColor: color } }), [])

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
            if (createdValid) {
                setCreated(new Date(timer[1].created))
                setEnded(isRunning(timer) ? false : new Date(timer[1].ended))
            }
        }
    }

    useEffect(() => {
        handleRoutedParams()
    }, [])

    // useEffect(() => {
    //     console.log(created, ' | ', ended)
    //     if (!timeRules(created, ended)) {
    //         // MODAL HERE
    //         console.log(created, ' | ', ended)
    //         console.log('Cannot End before Start.')
    //     }
    // }, [created, ended])

    useEffect(() => {
        timer[1].mood = mood
        updateItem(timer[0], timer[1])
    }, [mood])

    useEffect(() => {
        if (!timeRules(created, ended)) {
            // MODAL HERE
            console.log(created, ' | ', ended)
            console.log('Cannot Start after End.')
        }
        else if (!timeRules(created, new Date())) {
            console.log('Cannot Start before now')
        } else {
            timer[1].created = created
            updateItem(timer[0], timer[1])
        }
    }, [created])

    useEffect(() => {
        if (!timeRules(created, ended)) {
            // MODAL HERE
            console.log(created, ' | ', ended)
            console.log('Cannot End before Start.')
        }
        else if (!timeRules(created, new Date())) {
            console.log('Cannot Start before now')
        } else {
            timer[1].ended = ended
            updateItem(timer[0], timer[1])
        }
    }, [ended])

    const handleComplete = () => {
        if (!timeRules(created, ended)) {
            // MODAL HERE
            console.log('Cannot End before Start.')
            return false
        }
        timer[1].created = created.toString()
        timer[1].ended = ended.toString()
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
            <View style={styles.textInputContainer}>
                <Text style={styles.sideTitle}>Date </Text>
                <DatePicker
                    label=' '
                    date={created}
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
                    running={!ended ? true : false}
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