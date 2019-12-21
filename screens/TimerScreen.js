import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Text, View } from 'react-native';
import { Timer } from '../components/Timer';
import { TimerStartNotes, TimerStopNotes } from '../components/TimerNotes';
import { styles } from '../constants/Styles'
import Grid from '@material-ui/core/Grid';
import Hashids from 'hashids'
// import { startSocketIO, emitTickSocketIO, emitEntrySocketIO } from '../constants/Socket';
import { storeItem, updateItem } from '../constants/Store'
import { useCounter } from '../constants/Hooks'

export default function TimerScreen({ route, navigation }) {
  const { project, run } = route.params
  let pagename = 'TimerScreen'
  let projectKey = project[0]
  let projectName = project[1].name
  let color = project[1].color


  useEffect(() => navigation.setOptions({ title: projectName, headerStyle: {backgroundColor: color} }), [])

  // LOCAL STATE
  const [connection, setConnection] = useState()
  const [currentTimer, setCurrentTimer] = useState('')
  const [created, setCreated] = useState('')
  const [button, setButton] = useState('start')
  const [mood, setMood] = useState('')
  const [energy, setEnergy] = useState(50)
  
  const initialCount = project[1].time > 0 ? project[1].time : 0
  const direction = initialCount > 0 ? true : false
  const { count, total, setCount, setTotal, start, stop } = useCounter(1000, direction)
  useEffect(() => setCount(initialCount), [])

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

  const addTimer = () => {
    const NEWVALUE = {
      created: new Date().toString(),
      ended: new Date().toString(),
      type: 'timer',
      project: projectKey,
      status: 'running',
      start: initialCount,
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

  const updateTimer = (key) => {
    let value = {
      created: created,
      ended: new Date().toString(),
      type: 'timer',
      project: projectKey,
      status: 'done',
      start: initialCount,
      stop: count,
      total: total,
      mood: mood,
      energy: energy,
    }
    console.log(value)
    setCurrentTimer([key, value])
    updateItem(key, value)
  }

  // useEffect(() => {
  //   console.log(mood)
  //   console.log(energy)
  // }, [mood, energy])

  // PAGE FUNCTIONS
  useEffect(() => {
    const focused = navigation.addListener('focus', () => {
      console.log('FOCUS - ' + pagename)
      if (run === true) {
        setCount(initialCount)
        start()
        addTimer()
        setButton('stop')
      }
    })
    const unfocused = navigation.addListener('blur', () => {
      console.log('attempting stop...')
      stop()
    })
    return focused, unfocused
  }, [])

  // useEffect(() => {
  //   timer[1].mood = mood
  //   updateItem(timer[0], timer[1])
  // }, [mood])

  const formatTime = t => {
    if (t >= 0) return new Date(t * 1000).toISOString().substr(11, 8)  // hh : mm : ss
    else {
      t = Math.abs(t)
      t = t.toString()
      if (t.length === 0) return '00:00:00'
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
      {/* <Text style={styles.subheader}>{initialCount} </Text>
      <Text >{projectKey} </Text>
      <Text> Total: {total} </Text> */}
      <Timer
        start={() => {
          // start(1000, initialCount, initialCount > 0 ? true : false)
          start()
          addTimer()
          setButton('stop')
        }}
        stop={() => {
          stop()
          updateTimer(currentTimer[0])
          setTotal(0)
          setCount(initialCount)
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