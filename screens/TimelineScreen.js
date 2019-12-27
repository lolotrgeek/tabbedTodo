import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, SectionList, Button } from 'react-native';
import { Timeline } from '../components/Timeline';
import { getAll, storeItem, updateItem, removeAll } from '../constants/Store'
import { secondsToString, sumProjectTimers, sayDay, dayHeaders, elapsedTime, findRunning, formatTime } from '../constants/Functions'
import { timerValid, runningValid } from '../constants/Validators'
import { styles } from '../constants/Styles'
import { useCounter } from '../constants/Hooks'
import Hashids from 'hashids'

export default function TimelineScreen({ navigation }) {
  let pagename = 'TIMELINE'
  const [timers, setTimers] = useState([]); // state of timers list
  const [projects, setProjects] = useState([]); // state of timers list
  const [dayList, setDayList] = useState([])
  const [daysWithTimer, setDaysWithTimer] = useState([]); // disply the timers within each day
  const [runningTimer, setRunningTimer] = useState([])
  const [runningProject, setRunningProject] = useState([])
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
      setDayList(days)
      const summed = sumProjectTimers(days)
      // console.log(summed)
      setDaysWithTimer(summed)
    } catch (err) {
      console.log(err)
    }

  }

  const stopAndUpdate = item => {
    stop()
    item[1].status = 'done'
    item[1].ended = new Date().toString()
    item[1].total = total
    updateItem(item[0], item[1])
    setTotal(0)
    setCount(0)
    setDirection(Boolean)
    setRunningTimer([])
    setRunningProject([])
    console.log('updated : ', [item[0], item[1]])
    setEntryState()
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
    setDirection(value.start > 0 ? true : false)
    setCount(value.start)
    setRunningTimer([key, value])
    setRunningProject(project)
  }

  useEffect(() => {
    setEntryState()
    const focused = navigation.addListener('focus', () => {
      //console.log('FOCUS - ' + pagename)
      setEntryState()
      if (runningTimer && runningTimer !== undefined && Array.isArray(runningTimer) && runningTimer.length === 2) {
        startandUpdate()
      }
    })
    const unfocused = navigation.addListener('blur', () => {
      console.log('attempting stop...')
      stop()
    })
    return focused, unfocused
  }, [])

  useEffect(() => {
    if (timers && Array.isArray(timers) && timers.length > 0) {
      // let found = timers.filter(timer => timer[1].status === 'running' ? true : false)
      const foundTimer = timers.filter(timer => {
        if (timer[1].status === 'running') {
          return true
        } else {
          return false
        }
      })
      
      if(foundTimer && start.length > 0 || start > 0) {
        console.log('foundTimer: ', foundTimer)
        setRunningTimer(foundTimer[0])
        // setDirection(foundTimer[1].start > 0 ? true : false)
        setCount(foundTimer[1].start)
      } else {
        console.log('foundTimer : no valid : ', foundTimer )
      }
    }
  }, [timers])

  useEffect(() => {
    if (runningTimer && runningTimer !== undefined && Array.isArray(runningTimer) && runningTimer.length === 2) {
      // console.log(runningTimer)
      start()
    }
  }, [runningTimer])

  useEffect(() => {
    let startState = {
      direction: direction,
      runningProject: runningProject,
      runningTimer: runningTimer,
      count: count,
      total: total
    }
    console.log('startState : ', runningTimer.length > 0 ? startState : 'no valid running timer')
  }, [runningProject])

  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.subheader}> {runningValid(runningTimer) ? 'Tracking' : ''}</Text>
      <Text onPress={() => stopAndUpdate(runningTimer)}>
        {runningValid(runningProject) ? runningProject[1].name : ''}
      </Text>
      <Text onPress={() => stopAndUpdate(runningTimer)}>
        {runningValid(runningTimer) ? formatTime(count) : ''}
      </Text>
      <SectionList style={{ width: '100%' }}
        sections={daysWithTimer}
        keyExtractor={(item, index) => item + index}
        renderSectionHeader={({ section: { title } }) => {
          // return (<Text style={styles.subheader}>{sayDay(new Date(title))}</Text>)
          return (<Text style={styles.subheader}>{sayDay(title)}</Text>)
          // return (<Text style={styles.subheader}>{title}</Text>)
        }}
        renderItem={({ item }) => projects.map(project => {
          if (project[0] === item.project) {
            return (<Timeline
              key={item.project}
              color={project[1].color}
              project={project[1].name}
              total={secondsToString(item.total)}
              // total={runningValid(runningTimer) && item.project === runningTimer[1].project ? secondsToString(item.total + total) : secondsToString(item.total)}
              onPress={() => navigation.navigate('TimerList', { project: project, lastscreen: 'Timeline' })}
              onStart={() => startandUpdate(project)}
            />)
          }
        })
        }
      />
      <Button title="Projects" onPress={() => navigation.navigate('Projects', { lastscreen: 'Timeline' })} />
    </SafeAreaView >
  )
}