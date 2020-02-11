import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { Timer } from '../components/Timer';
import { TimerStartNotes, TimerStopNotes } from '../components/TimerNotes';
import { styles } from '../constants/Styles'
import { findRunning, elapsedTime, formatTime } from '../constants/Functions'
import Hashids from 'hashids'
import { timerValid } from '../constants/Validators'
// import { storeItem, updateItem, getAll } from '../constants/Store'
import { storeItem, updateItem, getAll } from '../constants/Gun'
import { useCounter } from '../constants/Hooks'

export default function TimerScreen({ route, navigation }) {
  const { project, timer, run } = route.params
  let pagename = 'TimerScreen'
  let projectKey = project[0]
  let projectName = project[1].name
  let color = project[1].color


  useEffect(() => navigation.setOptions({ title: projectName, headerStyle: { backgroundColor: color } }), [])

  // LOCAL STATE
  const [currentTimer, setCurrentTimer] = useState('')
  const [created, setCreated] = useState('')
  const [button, setButton] = useState('start')
  const [mood, setMood] = useState(timer ? timer[1].mood : '')
  const [energy, setEnergy] = useState(timer? timer[1].energy : 50)

  const { count, setCount, start, stop } = useCounter(1000, false)
  useEffect(() => {
    if(timer[1].status === 'running') {
      setCount(elapsedTime(timer))
    }
    setCount(initialCount)
  }, [])

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

  useEffect(() => {
    if (Array.isArray(currentTimer) && currentTimer.length === 2) {
      currentTimer[1].mood = mood
      updateItem(currentTimer[0], currentTimer[1])
    }
  }, [mood])

  useEffect(() => {
    if (Array.isArray(currentTimer) && currentTimer.length === 2) {
      currentTimer[1].energy = energy
      updateItem(currentTimer[0], currentTimer[1])
    }
  }, [energy])
  const setEntryState = async () => {
    try {
      const timerEntries = await getAll(value => timerValid(value) ? true : false)
      try {
        const found = await findRunning(timerEntries)
        // clear running timers
        found.map(timer => {
          if (timer[0] === currentTimer[0]) return;
          timer[1].ended = new Date().toString()
          timer[1].status = 'done'
          updateItem(timer[0], timer[1])
          console.log('cleared :', found[0])
        })
      } catch (error) {
        console.log(error)
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    setEntryState()
  }, [currentTimer])


  // TIMER VIEW
  return (
    <View style={styles.container}>
      <Text style={{
        marginTop: '5%',
        fontSize: 40,
        color: project[1].color,
        paddingBottom: 10
      }}>{projectName}</Text>
      <Timer
        start={() => {
          
          start()
          addTimer()
          setButton('stop')
        }}
        stop={() => {
          stop()
          updateTimer(currentTimer[0])
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