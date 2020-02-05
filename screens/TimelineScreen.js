import React, { useState, useEffect } from 'react';
import {Text, SafeAreaView, SectionList, Button } from 'react-native';
import { Timeline } from '../components/Timeline';
import { getAll, storeItem, updateItem, removeAll } from '../constants/Store'
import { multiDay, secondsToString, sumProjectTimers, sayDay, dayHeaders, elapsedTime, findRunning, formatTime, newEntryPerDay } from '../constants/Functions'
import { timerValid, runningValid, timersValid } from '../constants/Validators'
import { styles } from '../constants/Styles'
import { useCounter } from '../constants/Hooks'
import { newProject, newTimer, updateTimer } from '../constants/Models'
import RunningTimer from '../components/runningTimer';

export default function TimelineScreen({ navigation }) {
  useEffect(() => navigation.setOptions({ title: 'Timeline'}), [])

  const [timers, setTimers] = useState([]); // state of timers list
  const [projects, setProjects] = useState([]); // state of timers list
  const [daysWithTimer, setDaysWithTimer] = useState([]); // disply the timers within each day
  const [runningTimer, setRunningTimer] = useState([])
  const [runningProject, setRunningProject] = useState([])
  const { count, setCount, start, stop } = useCounter(1000, false)

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
      // console.log('List Items : ', summed)
      setDaysWithTimer(summed)
    } catch (err) {
      // console.log(err)
    }
  }

  const splitAndUpdate = timer => {
    const entries = newEntryPerDay(timer[1].created)
    // // console.log(entries)
    entries.map((entry, i) => {
      if (i === 0) {
        updateItem(updateTimer(timer, { ended: entry.end }))
      } else {
        let value = timer[1]
        value.created = entry.start
        value.ended = entry.end === 'running' ? new Date() : entry.end
        value.status = entry.end === 'running' ? 'running' : 'done'
        storeItem(newTimer({ value: value }))
      }
    })
  }

  const stopAndUpdate = timer => {
    stop()
    updateItem(updateTimer(timer, { count: count }))
    setCount(0)
    setRunningTimer([])
    setRunningProject([])
    setEntryState()
  }

  const startandUpdate = project => {
    if (runningValid(runningTimer)) {
      stopAndUpdate(runningTimer)
    }
    let newtimer = newTimer({ project: project })
    storeItem(newtimer)
    setEntryState()
    setCount(0)
    setRunningProject(project)
    setRunningTimer(newtimer)
  }

  useEffect(() => {
    // removeAll()
    setEntryState()
  }, [])

  useEffect(() => {
    const focused = navigation.addListener('focus', () => {
      //// console.log('FOCUS - ' + pagename)
      setEntryState()
    })
    const unfocused = navigation.addListener('blur', () => {
      // console.log('attempting stop...')
      setRunningProject([])
      setRunningTimer([])
      stop()
    })
    return focused, unfocused
  }, [])

  useEffect(() => {
    if (timersValid(timers)) {
      const foundRunning = findRunning(timers)
      if (runningValid(foundRunning)) {
        if (multiDay(foundRunning[1].created)) {
          splitAndUpdate(foundRunning)
        }
        setRunningTimer(foundRunning)
        setCount(elapsedTime(foundRunning[1].created))
      }
    }
  }, [timers])

  useEffect(() => {
    if (timersValid(projects) && runningValid(runningTimer)) {
      projects.map(project => {
        if (runningTimer[1].project === project[0]) {
          setRunningProject(project)
        }
      })
    }
  }, [runningTimer, projects])

  useEffect(() => {
    if (runningTimer && Array.isArray(runningTimer) && runningTimer.length === 2) {
      start()
    }
  }, [runningTimer])

  // useEffect(() => {
  //   if (runningValid(runningTimer)) {
  //     // console.log('ticked : ', count, 'calculated : ', elapsedTime(runningTimer[1].created))
  //   }
  // }, [count])

  return (
    <SafeAreaView style={styles.container}>
      <RunningTimer
        // key={runningProject[0] + '_running'}
        onPress={() => stopAndUpdate(runningTimer)}
        display={runningValid(runningTimer) ? 'flex' : 'none'}
        color={runningValid(runningProject) ? runningProject[1].color : ''}
        title={runningValid(runningTimer) ? 'Tracking' : ''}
        project={runningValid(runningProject) ? runningProject[1].name : ''}
        timer={runningValid(runningTimer) ? formatTime(count) : ''}
      />
      <SectionList style={{ width: '100%' }}
        sections={daysWithTimer}
        keyExtractor={(item, index) => item + index}
        renderSectionHeader={({ section: { title } }) => {
          return (<Text style={styles.subheader}>{sayDay(title)}</Text>)
        }}
        renderItem={({ item }) => projects.map(project => {
          if (item.status === 'running') return (null)
          if (project[0] === item.project) {
            return (<Timeline
              key={item.project}
              color={project[1].color}
              project={project[1].name}
              total={typeof item.total === 'number' && new Date(item.total) ? secondsToString(item.total) : item.total}
              onStart={() => startandUpdate(project)}
              onPress={() => navigation.navigate('TimerList', {
                project: project,
                running: { project: runningProject, timer: runningTimer },
                lastscreen: 'Timeline'
              })}
            />)
          }
        })
        }
      />
      <Button title="Projects" onPress={() => navigation.navigate('Projects', {
        running: { project: runningProject, timer: runningTimer },
        lastscreen: 'Timeline'
      })} />
    </SafeAreaView >
  )
}