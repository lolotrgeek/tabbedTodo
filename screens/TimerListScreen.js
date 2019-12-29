import React, { useState, useEffect } from 'react';
import { Button, Text, View, SafeAreaView, SectionList } from 'react-native';
import { getAll, updateItem, storeItem } from '../constants/Store'
import { TimerList } from '../components/TimerList';
import { timerValid, runningValid, timersValid } from '../constants/Validators'
import { timeString, secondsToString, totalTime, timeSpan, sayDay, dayHeaders, moodMap, isRunning, elapsedTime, findRunning, runningFind, formatTime, multiDay, newEntryPerDay } from '../constants/Functions'
import { styles } from '../constants/Styles'
import { useCounter } from '../constants/Hooks'
import Hashids from 'hashids'

export default function TimerListScreen({ route, navigation }) {
  const pagename = 'TimerList'
  const { project, running, lastscreen } = route.params
  let projectKey = project[0]
  let projectName = project[1].name
  let color = project[1].color

  useEffect(() => navigation.setOptions({ title: projectName, headerStyle: { backgroundColor: color } }), [])

  const [timers, setTimers] = useState([])
  const [daysWithTimer, setDaysWithTimer] = useState([]); // display the timers within each day
  const [runningProject, setRunningProject] = useState(runningValid(running) ? running.project : [])
  const [runningTimer, setRunningTimer] = useState(runningValid(running) ? running.timer : [])

  const { count, setCount, start, stop } = useCounter(1000, false)


  // PAGE FUNCTIONS
  const getEntries = () => new Promise(async (resolve, reject) => {
    try {
      let timerEntries = await getAll(value => timerValid(value) ? true : false)
      resolve({ timers: timerEntries })
    } catch (error) {
      reject(error)
    }
  })

  const setEntryState = async () => {
    try {
      const retrieved = await getEntries()
      setTimers(retrieved.timers)
      try {
        const projectTimers = retrieved.timers.filter(timer => timer[1].project === project[0] ? true : false)
        const sortedTimers = projectTimers.sort((a, b) => new Date(b[1].created) - new Date(a[1].created))
        const days = await dayHeaders(sortedTimers)
        setDaysWithTimer(days)
      } catch (error) {
        console.log(error)
      }
    } catch (error) {
      console.log(error)

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
    setCount(0)
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
      total: 0,
      mood: 'good',
      energy: 50,
    }
    console.log('new: ', [key, value])
    storeItem(key, value)
    setEntryState()
    setCount(0)
    setRunningProject(project)
    setRunningTimer([key, value])
  }

  useEffect(() => {
    // setEntryState()
    const focused = navigation.addListener('focus', () => {
      console.log('FOCUS - ' + pagename)
      setEntryState()
    })
    const unfocused = navigation.addListener('blur', () => {
      console.log('attempting stop...')
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
    if (running.project && runningValid(runningTimer)) {
      if (runningTimer[1].project === running.project[0]) {
        console.log('Found Running Project')
        setRunningProject(running.project)
      }
    }
  }, [runningTimer])

  useEffect(() => {
    if (runningTimer && Array.isArray(runningTimer) && runningTimer.length === 2) {
      console.log('runningTimer: ', runningTimer)
      start()
    }
  }, [runningTimer])

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.subheader}> {runningValid(runningTimer) ? 'Tracking' : ''}</Text>
      <Text onPress={() => stopAndUpdate(runningTimer)}>
        {runningValid(runningProject) ? runningProject[1].name : ''}
      </Text>
      <Text onPress={() => stopAndUpdate(runningTimer)}>
        {runningValid(runningTimer) ? formatTime(count) : ''}
      </Text>
      <Text
        onPress={() => navigation.navigate('Edit', { project: project })}
        style={{
          marginTop: '5%',
          fontSize: 40,
          color: color,
          paddingBottom: 10
        }}>{projectName}</Text>

      <View style={styles.addButton}>
        <Button
          title='New Entry'
          onPress={() => startandUpdate(project)}
        />
      </View>
      <SectionList style={{ width: '100%' }}
        sections={daysWithTimer}
        keyExtractor={(item, index) => item + index}
        renderSectionHeader={({ section: { title } }) => {
          return (<Text style={styles.subheader}>{sayDay(title)}</Text>)
        }}
        renderItem={({ item }) => {
          return (<TimerList
            key={item[0]}
            date={item[1].created}
            color={project[1].color}
            mood={moodMap(item[1].mood)}
            energy={item[1].energy}
            project={isRunning(item) ? timeString(new Date(item[1].created)) + ' - ' + '...' : timeSpan(item[1].created, item[1].ended)}
            total={isRunning(item) && runningValid(runningTimer) ? 'Tracking' : secondsToString(totalTime(item[1].created, item[1].ended))}
            // total={isRunning(item) && runningValid(runningTimer) ? formatTime(count) : secondsToString(totalTime(item[1].created, item[1].ended))}
            onPress={() => navigation.navigate('TimerEditor', {
              project: project,
              timer: item,
              running: { project: runningProject, timer: runningTimer },
              lastscreen: pagename,
            })}
            onEdit={() => navigation.navigate('TimerEditor', {
              project: project,
              timer: item,
              running: { project: runningProject, timer: runningTimer },
              lastscreen: pagename
            })}
          />)
        }
        }
      />
    </SafeAreaView >
  )
}