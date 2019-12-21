import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, SectionList, Button } from 'react-native';
import { Timeline } from '../components/Timeline';
import { getAll, storeItem, updateItem } from '../constants/Store'
import { timeString, secondsToString, sumProjectTimers, totalTime, timeSpan, sayDay, dayHeaders, isRunning, elapsedTime, findRunning, runningFind, formatTime } from '../constants/Functions'
import { timerValid, timersValid, runningValid } from '../constants/Validators'
import { styles } from '../constants/Styles'
import { useCounter } from '../constants/Hooks'
import Hashids from 'hashids'


export default function TimelineScreen({ navigation }) {
  let pagename = 'TIMELINE'
  const [timers, setTimers] = useState([]); // state of timers list
  const [projects, setProjects] = useState([]); // state of timers list
  const [daysWithTimer, setDaysWithTimer] = useState([]); // disply the timers within each day
  const [runningTimer, setRunningTimer] = useState([])
  const [direction, setDirection] = useState(Boolean)
  const { count, total, setCount, setTotal, start, stop } = useCounter(1000, direction)

  const getEntries = () => new Promise(async (resolve, reject) => {
    try {
      let timerEntries = await getAll(value => timerValid(value) ? true : false)
      let projectEntries = await getAll(value => value.type === 'project' ? true : false)
      resolve({ timers: timerEntries, projects: projectEntries })
    } catch (error) {
      reject(error)
    }
  })


  const setEntryState = async () => {
    const retrieved = await getEntries()
    setTimers(retrieved.timers)
    setProjects(retrieved.projects)
    const sortedTimers = retrieved.timers.sort((a, b) => new Date(b[1].created) - new Date(a[1].created))
    try {
      const days = await dayHeaders(sortedTimers)
      const summed = sumProjectTimers(days)
      console.log(summed)
      setDaysWithTimer(summed)
    } catch (err) {
      console.log(err)
    }

  }

  const foundRunning = async () => {
    try {
      let found = await findRunning(timers)
      console.log('found: ', found)
      setRunningTimer(found)
    }
    catch (error) {
      console.log(error)
    }
  }

  const stopAndUpdate = item => {
    stop()
    item[1].status = 'done'
    item[1].ended = new Date().toString()
    updateItem(item[0], item[1])
    setCount(0)
    setRunningTimer([])
  }

  const startandUpdate = project => {
    if (runningValid(runningTimer)) {
      stopAndUpdate(runningTimer)
    }
    const hashids = new Hashids()
    let key = hashids.encode(Date.now().toString())
    let value = {
      created: new Date().toString(),
      ended: new Date().toString(),
      type: 'timer',
      project: project[0],
      status: 'running',
      start: project[1].time,
      stop: count,
      total: total,
      mood: 'good',
      energy: 50,
    }
    console.log('new: ', [key, value])
    storeItem(key, value)
    setCount(value.start)
    setRunningTimer([key, value])
    start()
  }

  useEffect(() => {
    setEntryState()
    const focused = navigation.addListener('focus', () => {
      //console.log('FOCUS - ' + pagename)
      setEntryState()
    })
    const unfocused = navigation.addListener('blur', () => {
    })
    return focused, unfocused
  }, [])

  useEffect(() => {
    if (timers && Array.isArray(timers) && timers.length > 0) {
      // let found = timers.filter(timer => timer[1].status === 'running' ? true : false)
      const found = timers.filter(timer => {
        if (timer[1].status === 'running') {
          return true
        } else {
          return false
        }
      })
      console.log('found: ', found)
      setRunningTimer(found[0])
    }
  }, [timers])

  useEffect(() => {
    if (runningTimer && runningTimer !== undefined && Array.isArray(runningTimer) && runningTimer.length > 0) {
      console.log('running : ', runningTimer)
      setDirection(runningTimer[1].start > 0 ? true : false)
      setCount(elapsedTime(runningTimer))
      start()
    }
  }, [runningTimer])

  useEffect(() => {
    console.log(count)
  }, [count])

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.subheader}> {runningValid(runningTimer) ? 'Tracking' : ''}</Text>
      <Text onPress={() => stopAndUpdate(runningTimer)}>
        {runningValid(runningTimer) ? formatTime(count) : ''}
      </Text>
      <SectionList style={{ width: '100%' }}
        sections={daysWithTimer}
        keyExtractor={(item, index) => item + index}
        renderSectionHeader={({ section: { title } }) => {
          return (<Text style={styles.subheader}>{sayDay(new Date(title))}</Text>)
        }}
        renderItem={({ item }) => projects.map(project => {
          if (project[0] === item.project) {
            console.log('project: ' , project)
            return (<Timeline
              key={item.project}
              color={project[1].color}
              project={project[1].name}
              total={secondsToString(item.total)}
              // total={runningValid(runningTimer) && item.project === runningTimer[1].project ? formatTime(count) : secondsToString(item.total)}
              onPress={() => navigation.navigate('TimerList', {project: project, lastscreen: 'Timeline'})}
              onStart={() => startandUpdate(project)}
            />)
          }
        })
        }
      />
      <Button title="Projects" onPress={() => navigation.navigate('Projects', {lastscreen: 'Timeline'})} />
    </SafeAreaView >
  )
}