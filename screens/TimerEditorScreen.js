import React, { useState, useEffect } from 'react';
import { Text, View, Button, TouchableOpacity, Alert } from 'react-native';
import useAsync from 'react-use/lib/useAsync';
// import { updateItem, removeItem } from '../constants/Store'
import { updateItem, removeItem } from '../constants/Gun'
import { EnergySlider, MoodPicker } from '../components/TimerNotes'
import { addMinutes } from 'date-fns'
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'
import { timerValid, createdValid, dateValid } from '../constants/Validators'
import { timeRules, isRunning, simpleDate, timeString, dateRules, totalTime } from '../constants/Functions'
import { styles } from '../constants/Styles'
import DateTimePicker from '@react-native-community/datetimepicker';
import { updateTimer } from '../constants/Models';

export default function TimerEditorScreen({ route, navigation }) {
    const { timer, project, lastscreen } = route.params
    const timerKey = timer[0]
    const timerEntry = timer[1]
    let color = project[1].color
    const projectName = project[1].name

    const [key, setKey] = useState('')
    const [picker, setPicker] = useState('')
    const [created, setCreated] = useState('')
    const [ended, setEnded] = useState('')
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
            setMood(timer[1].mood)
            setEnergy(timer[1].energy)
            if (createdValid) {
                setCreated(new Date(timer[1].created))
                setEnded(isRunning(timer) ? false : new Date(timer[1].ended))
            }
        }
    }

    const timeRulesEnforcer = () => {
        if (!timeRules(created, ended)) {
            Alert.alert(
                'Error',
                'Cannot Start after End.',
            )
            return false
        }
        else if (!timeRules(created, new Date())) {
            Alert.alert(
                'Error',
                'Cannot Start before now.',
            )
            return false
        } else {
            return true
        }
    }

    const handleComplete = () => {
        if (!timeRulesEnforcer()) return false
        let update = {
            created : created,
            ended : ended,
            energy : energy,
            mood : mood,
            count : totalTime(created, ended)
        }
        let updatedtimer = updateTimer(timer, update)
        if (key) updateItem(updatedtimer)
        navigation.navigate(lastscreen ? lastscreen : 'Projects', {
            project: project
        })
    }

    const chooseNewTime = newTime => {
        if (!timeRules(created, ended)) {
            setPicker(false);
            Alert.alert(
                'Error',
                'Cannot Start after End.',
            )
        }
        else if (!timeRules(created, new Date())) {
            setPicker(false);
            Alert.alert(
                'Error',
                'Cannot Start before now.',
            )
        }
        else if (newTime && !dateRules(newTime)) {
            setPicker(false);
            Alert.alert(
                'Error',
                'Cannot Pick Date before Today.',
            )
        }
        else {
            setPicker(false)
            dateValid(newTime) ? setCreated(newTime) : false
        }
    }

    const chooseNewDate = newDate => {
        if (dateRules(newDate)) {
            setPicker(false);
            dateValid(newDate) ? setCreated(newDate) : false
        } else {
            setPicker(false);
            Alert.alert(
                'Error',
                'Cannot Pick Date before Today.',
            )
        }
    }

    useEffect(() => handleRoutedParams(), [])

    // useAsync(() => {
    //     timer[1].mood = mood
    //     // updateItem(timer[0], timer[1])
    // }, [mood])

    // useEffect(() => {
    //     if (!timeRulesEnforcer()) {
    //         setCreated(timer[1].created)
    //     } else {
    //         timer[1].created = created
    //         // updateItem(timer[0], timer[1])
    //     }
    // }, [created])

    // useEffect(() => {
    //     if (!timeRulesEnforcer()) {
    //         setEnded(timer[1].ended)
    //     } else {
    //         timer[1].ended = ended
    //         updateItem(timer[0], timer[1])
    //     }
    // }, [ended])


    return (
        <View style={styles.container}>
            <View style={styles.textInputContainer}>
                <Text style={styles.sideTitle}>Date </Text>
                <TouchableOpacity onPress={() => setPicker('date')} >
                    <Text>{simpleDate(new Date(created))}</Text>
                </TouchableOpacity>
                {picker === 'date' ?
                    <DateTimePicker
                        mode='date'
                        value={new Date(created)}
                        onChange={(event, newDate) => chooseNewDate(newDate)}
                    />
                    : <Text></Text>}
            </View>
            <View style={styles.textInputContainer}>
                <Text style={styles.sideTitle}>Start</Text>
                <TouchableOpacity onPress={() => setCreated(time => addMinutes(new Date(time), -5))}>
                    <FontAwesome name='chevron-left' style={{ fontSize: 20, marginRight: 10 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setPicker('start')} >
                    <Text>{timeString(new Date(created))}</Text>
                </TouchableOpacity>

                {picker === 'start' ?
                    <DateTimePicker
                        mode='time'
                        value={new Date(created)}
                        onChange={(event, newTime) => chooseNewTime(newTime)}
                    />
                    : <Text></Text>}

                <TouchableOpacity onPress={() => { setCreated(time => addMinutes(new Date(time), 5)) }}>
                    <FontAwesome name='chevron-right' style={{ fontSize: 20, marginLeft: 10 }} />
                </TouchableOpacity>
            </View>

            <View style={styles.textInputContainer}>
                <Text style={styles.sideTitle}>End</Text>

                <TouchableOpacity onPress={() => { ended ? setEnded(time => addMinutes(new Date(time), -5)) : null }}>
                    <FontAwesome name='chevron-left' style={{ fontSize: 20, marginRight: 10 }} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setPicker('end')} >
                    <Text>{ended ? timeString(new Date(ended)) : 'Tracking'}</Text>


                </TouchableOpacity>
                {picker === 'end' && ended ?
                    <DateTimePicker
                        mode='time'
                        value={new Date(ended)}
                        onChange={(event, newTime) => chooseNewTime(newTime)}
                    />
                    : <Text></Text>}

                <TouchableOpacity onPress={() => { ended ? setEnded(time => addMinutes(new Date(time), 5)) : null }}>
                    <FontAwesome name='chevron-right' style={{ fontSize: 20, marginLeft: 10 }} />
                </TouchableOpacity>

            </View>

            <MoodPicker
                onGreat={() => setMood('great')}
                onGood={() => setMood('good')}
                onMeh={() => setMood('meh')}
                onSad={() => setMood('bad')}
                onAwful={() => setMood('awful')}
                selected={mood}
            />
            <Text>{energy}</Text>
            <EnergySlider
                startingEnergy={energy}
                energyChange={value => setEnergy(value)}
                onEnergySet={value => setEnergy(value)}
            />
            <Button title='Done' onPress={() => timeRulesEnforcer() ? handleComplete() : false }></Button>
            <TouchableOpacity onPress={() => deleteEntry()}>
                <FontAwesome5 name='trash-alt' color='red' style={styles.delete} />
            </TouchableOpacity>

        </View >
    )
}