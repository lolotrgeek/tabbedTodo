import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet,
  Button,
  Text,
  View
} from 'react-native';

import useCounter from '../constants/Hooks';
import { Timer } from '../components/Timer';
import { useStopwatch, useTimer } from 'react-timer-hook';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import NumPad from 'react-numpad';
import { startSocketIO, emitTickSocketIO, emitEntrySocketIO } from '../constants/Socket';

import { getAll, storeItem, updateItem, removeItem, removeAll } from '../constants/Store'


export default function TimerScreen({ route, navigation }) {

  const { projectName, otherParam } = route.params

  // LOCAL STATE
  const [connection, setConnection] = useState()
  const [currentTimer, setCurrentTimer] = useState('')
  // const { count, start, stop, reset } = useCounter(0, ms)
  const [initialValue, setInitialValue] = useState(0)
  const [count, setCount] = useState(initialValue)
  const intervalRef = useRef(null);

  useEffect(() => {
    startSocketIO()
    return startSocketIO()
  }, [])

  useEffect(() => {
    emitEntrySocketIO(currentTimer)
  },[currentTimer])

  useEffect(() => {
    emitTickSocketIO([currentTimer[0], count])
  },[count])

  // TIMER FUNCTIONS
  const start = useCallback((ms, value, countdown) => {
    if (intervalRef.current !== null) {
      return;
    }

    if (countdown) {
      setCount(value)
      intervalRef.current = setInterval(() => {
        setCount(c => c - 1)
      }, ms)

    }
    else {
      intervalRef.current = setInterval(() => setCount(c => c + 1), ms)
    }
  }, []);

  const stop = useCallback((value) => {
    if (intervalRef.current === null) {
      return;
    }
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  const countDown = () => count === 0 ? initialValue : count

  useEffect(() => {
    const focused = navigation.addListener('focus', () => {

    })
    const unfocused = navigation.addListener('blur', () => {
      console.log('attempting stop...')
      stop()
      
    })
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return focused, unfocused
  }, [])

  // STORAGE FUNCTIONS
  const addTimer = (start) => {
    const NEWKEY = Date.now().toString()
    const NEWVALUE = {
      type: 'timer',
      project: projectName,
      start: start,
      stop: count,
    }
    const NEWENTRY = [NEWKEY, NEWVALUE]
    console.log(NEWVALUE)
    storeItem(NEWKEY, NEWVALUE)
    setCurrentTimer(NEWENTRY)
  }
  const updateTimer = (key, count) => {
    let value = {
      type: 'timer',
      project: projectName,
      start: initialValue,
      stop: count,
    }
    setCurrentTimer([key, value])
    updateItem(key, value)
  }

  // TIMER VIEW
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{projectName} Timer</Text>
      <Button
        title="Go Home"
        onPress={() => navigation.navigate('Projects')}
      />
      <Timer
        start={() => {
          // start(1000, countDown())
          start(1000, initialValue, true)
          addTimer(initialValue)
        }}
        stop={() => {
          stop(count)
          updateTimer(currentTimer[0], count)
        }}
        counter={count}
      // seconds={seconds}
      // minutes={minutes}
      // hours={hours}
      // days={days}
      />
      <Text style={styles.header}>Initial Value: {initialValue} </Text>
      <NumPad.Number
        onChange={(value) => {
          setInitialValue(value)
        }
        }
        label={'Timer'}
        placeholder={'my placeholder'}
        decimal={false}
        inline={true}
      />
    </View>
  )
}

TimerScreen.navigationOptions = {
  title: 'Timer',
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
    minHeight: '3%'
  }
});