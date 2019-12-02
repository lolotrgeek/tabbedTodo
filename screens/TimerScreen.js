import React, { useState, useEffect } from 'react';
import { ExpoLinksView } from '@expo/samples';
import {
  StyleSheet,
  Button,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView
} from 'react-native';
import { getAll, storeItem, updateItem, removeItem, removeAll } from '../constants/Functions'
import Icon from 'react-native-vector-icons/Feather';
import { TimerList, Timer } from '../components/Timer';
import { arrayExpression } from '@babel/types';
import { useStopwatch, useTimer } from 'react-timer-hook';

import BackgroundTimer from 'react-native-background-timer'

/**
 * Timer Screen
 * @param {Object} param
 * @param {string} param.projectName 
 */
export default function TimerScreen({ route, navigation }) {

  const { projectName, otherParam } = route.params
  const [timers, setTimers] = useState([]); // state of timer list
  const [inputvalue, setValue] = useState(''); // state of text input
  const [second, setbackgroundTimer] = useState([])

  let t = new Date()
  t.setSeconds(t.getSeconds() + inputvalue)

  const {
    seconds,
    minutes,
    hours,
    days,
    start,
    pause,
    resume,
    restart
  } = useTimer({ expiryTimestamp : t, onExpire: () => console.log('onExpire called') })



  useEffect(() => {
    getAll(value => value.type === 'timer' && value.project === projectName ? true : false, entry => setTimers(timers => [...timers, entry]))
  }, [])

  const addEntry = () => {
    const NEWKEY = Date.now().toString()
    const NEWVALUE = { type: 'timer', project: projectName, time: { seconds: seconds, minutes: minutes, hours: hours, days: days } }
    const NEWENTRY = [NEWKEY, NEWVALUE]
    storeItem(NEWKEY, NEWVALUE)
    setTimers([...timers, NEWENTRY]); // add timer to state
    return NEWKEY
  }

  const addTimer = () => {
    let t = new Date()
    t.setSeconds(t.getSeconds() + inputvalue)
  }

  const updateTimer = (key, time, event) => {
    const value = { type: 'timer', project: projectName, time: time }
    updateItem(key, value)
    let update = timers.filter(timer => {
      if (timer[0] === key) {
        timer[1] = value
      }
    })
    console.log('STATE - updated : ', update)
    console.log('STATE - timers : ', timers)
    // setTimers([...timers, update[1].text = editvalue.input])
    return event
  }

  const timerState = id => {
    // console.log('STATE- editvalue : ' , editvalue)
    if (editvalue.id && editvalue.id === id) return true
  }

  const deleteTimer = id => {
    removeItem(id) // remove from async storage
    setTimers(
      // filter from timer state
      timers.filter(timer => {
        if (timer[0] !== id) {
          return true;
        }
      })
    );
  }

  let _interval

  const startTimer = () => {
    setbackgroundTimer(0)
    _interval = BackgroundTimer.setInterval(() => {
      setbackgroundTimer(second + 1)
    }, 1000);
  }
  const pauseTimer = () => {
    BackgroundTimer.clearInterval(_interval)
  }

  const restartTimer = () => {
    setbackgroundTimer(0)
    BackgroundTimer.clearInterval(_interval)
  }


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Timers</Text>
      <Button
        title="Go Home"
        onPress={() => navigation.navigate('Projects')}
      />
      <View style={styles.textInputContainer}>
        <TextInput
          keyboardType={'numeric'}
          style={styles.textInput}
          multiline={false}
          placeholderTextColor="#abbabb"
          value={inputvalue}
          onChangeText={inputvalue => setValue(inputvalue)}
          
        />
        <TouchableOpacity onPress={() => addTimer()}>
          <Icon name="plus" size={30} color="blue" style={{ marginLeft: 10 }} />
        </TouchableOpacity>
      </View>
      <View style={styles.textInputContainer}>
        {/* <TouchableOpacity onPress={}>
          <Icon name="plus" size={30} color="blue" style={{ marginLeft: 10 }} />
        </TouchableOpacity> */}
        {/* <Timer
        start={() => startTimer()}
        pause={() => pauseTimer()}
        resume={resume}
        restart={() => restartTimer()}
        seconds={second}
      /> */}
        <Timer
          start={() => start(t)}
          pause={() => pause()}
          resume={() => resume()}
          restart={() => restart(t)}
          seconds={seconds}
          minutes={minutes}
          hours={hours}
          days={days}
        />
      </View>
      <ScrollView style={{ width: '100%' }}>
        {timers.map((item, i) => {
          let key = item[0]
          let value = item[1]
            (<TimerList
              date={key}
              start={value.time.start}
              pause={value.time.pause}
              resume={value.time.resume}
              restart={value.time.restart}
              days={value.time.days}
              hours={value.time.hours}
              minutes={value.time.minutes}
              seconds={value.time.seconds}
              deleteTimer={() => deleteTimer(key)}
            />)
        }
        )}
      </ScrollView>
      <TouchableOpacity onPress={() => removeAll(setTimers)}>
        <Icon name="minus" size={40} color="red" style={{ marginLeft: 10 }} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => getAll()}>
        <Icon name="plus" size={40} color="blue" style={{ marginLeft: 10 }} />
      </TouchableOpacity>
    </View>
  )
}



TimerScreen.navigationOptions = {
  title: 'Timers',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  header: {
    marginTop: '15%',
    fontSize: 20,
    color: 'red',
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
    minHeight: '3%'
  }
});