import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Text, View } from 'react-native';
import { Timer } from '../components/Timer';
import { TimerStartNotes, TimerStopNotes } from '../components/TimerNotes';
import { styles } from '../constants/Styles'
import Grid from '@material-ui/core/Grid';
import Hashids from 'hashids'
// import { startSocketIO, emitTickSocketIO, emitEntrySocketIO } from '../constants/Socket';
import { storeItem, updateItem } from '../constants/Store'

export default function TimerScreen({ route, navigation }) {

  const { project, run } = route.params

  let pagename = 'TimerScreen'

  let projectKey = project[0]
  let projectName = project[1].name

  useEffect(() => navigation.setOptions({ title: projectName }), [])

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
      console.log('FOCUS - ' + pagename)
      if (run === true) {
        start(1000, initialValue, initialValue > 0 ? true : false)
        addTimer(initialValue)
        setButton('stop')
      }
    })
    const unfocused = navigation.addListener('blur', () => {
      console.log('attempting stop...')
      stop()
    })
    return focused, unfocused
  }, [])

  const addTimer = (start) => {
    const NEWVALUE = {
      created: new Date().toString(),
      ended: new Date().toString(),
      type: 'timer',
      project: projectKey,
      status : 'running',
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
      ended: new Date().toString(),
      type: 'timer',
      project: projectKey,
      status: 'done',
      start: initialValue,
      stop: count,
      total: total,
      mood: mood,
      energy: energy,
    }
    console.log(value)
    setCurrentTimer([key, value])
    updateItem(key, value)
  }

  useEffect(() => {
    console.log(mood)
    console.log(energy)
  }, [mood, energy])


  const formatTime = t => {
    if (t > 0) return new Date(t * 1000).toISOString().substr(11, 8)  // hh : mm : ss
    else {
      t = Math.abs(t)
      t = t.toString()
      if (t.length === 0) return '-00:00:00'
      if (t.length === 1) return '-00:00:0' + t.charAt(0)
      if (t.length === 2) return '-00:00:' + t.charAt(0) + t.charAt(1)
      if (t.length === 3) return '-00:0' + t.charAt(0) + ':' + t.charAt(1) + t.charAt(2)
      if (t.length === 4) return '-00:' + t.charAt(0) + t.charAt(1) + ':' + t.charAt(2) + t.charAt(3)
      if (t.length === 5) return '-0' + t.charAt(0) + ':' + t.charAt(1) + t.charAt(2) + ':' + t.charAt(3) + t.charAt(4)
      if (t.length > 5) return '-' + t.charAt(0) + t.charAt(1) + ':' + t.charAt(2) + t.charAt(3) + ':' + t.charAt(4) + t.charAt(5)
    }
  }

  // TIMER VIEW
  return (
    <View style={styles.container}>
      <Text style={{
        marginTop: '5%',
        fontSize: 40,
        color: project[1].color,
        paddingBottom: 10
      }}>{projectName}</Text>
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
          setCount(initialValue)
          setButton('start')
        }}
        hideStop={button === 'stop' ? 'flex' : 'none'}
        hideStart={button === 'start' ? 'flex' : 'none'}
        counter={formatTime(count)}
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