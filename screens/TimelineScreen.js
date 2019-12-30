import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, SectionList, Button } from 'react-native';
import { Timeline } from '../components/Timeline';
import { getAll, storeItem, updateItem, removeAll } from '../constants/Store'
import { multiDay, secondsToString, sumProjectTimers, sayDay, dayHeaders, elapsedTime, findRunning, formatTime, isRunning, totalTime, newEntryPerDay } from '../constants/Functions'
import { timerValid, runningValid, timersValid } from '../constants/Validators'
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
      setDayList(days)
      const summed = sumProjectTimers(days)
      console.log('List Items : ', summed)
      setDaysWithTimer(summed)
    } catch (err) {
      console.log(err)
    }
  }

  const splitAndUpdate = timer => {
    const entries = newEntryPerDay(timer[1].created)
    console.log(entries)
    entries.map((entry, i) => {
      if (i === 0) {
        let value = timer[1]
        value.ended = entry.end
        value.status = 'done'
        updateItem(timer[0], value)
      } else {
        const hashids = new Hashids()
        let key = hashids.encode(Date.now().toString())
        let value = timer[1]
        value.created = entry.start
        value.ended = entry.end === 'running' ? new Date() : entry.end
        value.status = entry.end === 'running' ? 'running' : 'done'
        console.log('new: ', [key, value])
        storeItem(key, value)
      }
    })
  }

  const stopAndUpdate = item => {
    stop()
    item[1].status = 'done'
    item[1].ended = new Date().toString()
    item[1].total = count
    updateItem(item[0], item[1])
    console.log(item[0], ' - Total Time : ', totalTime(item[1].created))
    console.log(item[0], ' - Updated : ', item[1])
    setCount(0)
    setRunningTimer([])
    setRunningProject([])
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
      total: 0,
      mood: 'good',
      energy: 50,
    }
    console.log(key, ' - Adding New : ', value)
    storeItem(key, value)
    setEntryState()
    setCount(0)
    setRunningProject(project)
    setRunningTimer([key, value])
  }

  useEffect(() => {
    // removeAll()
    setEntryState()
  }, [])

  useEffect(() => {
    const focused = navigation.addListener('focus', () => {
      //console.log('FOCUS - ' + pagename)
      setEntryState()
    })
    const unfocused = navigation.addListener('blur', () => {
      console.log('attempting stop...')
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
          console.log('Found Running Project')
          setRunningProject(project)
        }
      })
    }
  }, [runningTimer, projects])

  useEffect(() => {
    if (runningTimer && Array.isArray(runningTimer) && runningTimer.length === 2) {
      console.log('runningTimer: ', runningTimer)
      start()
    }
  }, [runningTimer])

  // useEffect(() => {
  //   if (runningValid(runningTimer)) {
  //     console.log('ticked : ', count, 'calculated : ', elapsedTime(runningTimer[1].created))
  //   }
  // }, [count])

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
          return (<Text style={styles.subheader}>{sayDay(title)}</Text>)
        }}
        renderItem={({ item }) => projects.map(project => {
          if (item.status === 'running') return ('')
          if (project[0] === item.project) {
            return (<Timeline
              key={item.project}
              color={project[1].color}
              project={project[1].name}
              total={typeof item.total === 'number' ? secondsToString(item.total) : item.total}
              onPress={() => navigation.navigate('TimerList', {
                project: project,
                running: { project: runningProject, timer: runningTimer },
                lastscreen: 'Timeline'
              })}
              onStart={() => startandUpdate(project)}
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