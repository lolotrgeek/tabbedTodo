import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet,
  Button,
  Text,
  View
} from 'react-native';

import useCounter from '../constants/Hooks';
import { Timer } from '../components/Timer';
import { TimerStartNotes, TimerStopNotes } from '../components/TimerNotes';
import { useStopwatch, useTimer } from 'react-timer-hook';
import Grid from '@material-ui/core/Grid';
import { compareAsc, format } from 'date-fns'
import DateFnsUtils from '@date-io/date-fns';
import Hashids from 'hashids'
// import { startSocketIO, emitTickSocketIO, emitEntrySocketIO } from '../constants/Socket';
// import * as CommonActions from '@react-navigation/native' 
import { getAll, storeItem, updateItem, removeItem, removeAll } from '../constants/Store'
import { set } from 'date-fns';
import { useSafeArea } from 'react-native-safe-area-context';


export default function TimerScreen({ route, navigation }) {

  const { project, run } = route.params

  let projectKey = project[0]
  let projectName = project[1].name

  // navigation.dispatch(CommonActions.setParams({ title: projectName }))

  // LOCAL STATE
  const [connection, setConnection] = useState()
  const [currentTimer, setCurrentTimer] = useState('')
  // const { count, start, stop, reset } = useCounter(0, ms)
  const [initialValue, setInitialValue] = useState(project[1].time > 0 ? project[1].time : 0)
  const [count, setCount] = useState(initialValue)
  const [total, setTotal] = useState(0)
  const [created, setCreated] = useState('')
  const [ended, setEnded] = useState('')
  const [button, setButton] = useState('start')
  const [mood, setMood] = useState('')
  const [energy, setEnergy] = useState(50)
  const intervalRef = useRef(null);

  // useEffect(() => {
  //   startSocketIO()
  //   return startSocketIO()
  // }, [])

  // useEffect(() => {
  //   emitEntrySocketIO(currentTimer)
  // },[currentTimer])

  // useEffect(() => {
  //   emitTickSocketIO([currentTimer[0], count])
  // },[count])

  /**
   * Timer - start
   */
  const start = useCallback((ms, value, countdown) => {
    if (intervalRef.current !== null) {
      return;
    }
    if (countdown) {
      setCount(value)
      intervalRef.current = setInterval(() => {
        setCount(c => c - 1)
        setTotal(c => c + 1)
      }, ms)

    }
    else {
      intervalRef.current = setInterval(() => {
        setCount(c => c + 1)
        setTotal(c => c + 1)
      }, ms)
    }
  }, []);

  /**
   * Timer - Stop
   */
  const stop = useCallback((value) => {
    if (intervalRef.current === null) {
      return;
    }
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);


  // PAGE FUNCTIONS
  useEffect(() => {
    const focused = navigation.addListener('focus', () => {

    })
    const unfocused = navigation.addListener('blur', () => {
      console.log('attempting stop...')
      stop()
    })
    return focused, unfocused
  }, [])



  // STORAGE FUNCTIONS
  const dateCreator = () => {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return date + ' ' + time;
  }

  const addTimer = (start) => {
    const NEWVALUE = {
      created: new Date().toString(),
      ended : ended,
      type: 'timer',
      project: projectKey,
      start: start,
      stop: count,
      total: total,
      mood: mood,
      energy: energy,
    }
    setCreated(NEWVALUE.created)
    const hashids = new Hashids()
    const NEWKEY = hashids.encode(Date.now().toString())
    const NEWENTRY = [NEWKEY, NEWVALUE]
    console.log(NEWVALUE)
    storeItem(NEWKEY, NEWVALUE)
    setCurrentTimer(NEWENTRY)
  }

  const updateTimer = (key, count) => {
    let value = {
      created: created,
      ended : new Date().toString(),
      type: 'timer',
      project: projectKey,
      start: initialValue,
      stop: count,
      total: total,
      mood: mood,
      energy: energy,
    }
    setCurrentTimer([key, value])
    updateItem(key, value)
  }

  useEffect(() => {
    console.log(mood)
    console.log(energy)
  }, [mood, energy])


  // TIMER VIEW
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{projectName}</Text>
      {/* <Text style={styles.subheader}>{initialValue} </Text>
      <Text >{projectKey} </Text>
      <Text> Total: {total} </Text> */}
      <Timer
        start={() => {
          start(1000, initialValue, initialValue > 0 ? true : false)
          addTimer(initialValue)
          setButton('stop')
        }}
        stop={() => {
          stop(count)
          updateTimer(currentTimer[0], count)
          setTotal(0)
          setButton('start')
        }}
        hideStop={button === 'stop' ? 'flex' : 'none'}
        hideStart={button === 'start' ? 'flex' : 'none'}
        counter={count}
      />
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
    marginTop: '5%',
    fontSize: 40,
    color: 'black',
    paddingBottom: 10
  },
  subheader: {
    fontSize: 20,
    color: 'black',
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