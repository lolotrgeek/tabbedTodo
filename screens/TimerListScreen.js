import React, { useState, useEffect } from 'react';
import { Button, Text, View, SafeAreaView, SectionList } from 'react-native';
import { getAll, updateItem, storeItem } from '../constants/Store'
import { TimerList } from '../components/TimerList';
import RunningTimer from '../components/runningTimer';
import { timerValid, runningValid, timersValid } from '../constants/Validators'
import { timeString, secondsToString, totalTime, timeSpan, sayDay, dayHeaders, moodMap, isRunning, elapsedTime, findRunning, formatTime, multiDay, newEntryPerDay } from '../constants/Functions'
import { styles } from '../constants/Styles'
import { useCounter } from '../constants/Hooks'
import { newTimer, updateTimer } from '../constants/Models';

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
        // console.log(error)
      }
    } catch (error) {
      // console.log(error)

    }
  }
  
  const splitAndUpdate = timer => {
    const entries = newEntryPerDay(timer[1].created)
    // // console.log(entries)
    entries.map((entry, i) => {
      if (i === 0) {
        updateItem(updateTimer(timer, {ended: entry.end}))
      } else {
        let value = timer[1]
        value.created = entry.start
        value.ended = entry.end === 'running' ? new Date() : entry.end
        value.status = entry.end === 'running' ? 'running' : 'done'
        storeItem(newTimer({value: value}))
      }
    })
  }
  const stopAndUpdate = timer => {
    stop()
    updateItem(updateTimer(timer, {count: count}))
    setCount(0)
    setRunningTimer([])
    setRunningProject([])
    setEntryState()
  }
  const startandUpdate = project => {
    if (runningValid(runningTimer)) {
      stopAndUpdate(runningTimer)
    }
    let newtimer = newTimer({project: project})
    storeItem(newtimer)
    setEntryState()
    setCount(0)
    setRunningProject(project)
    setRunningTimer(newtimer)
  }

  useEffect(() => {
    const focused = navigation.addListener('focus', () => {
      // console.log('FOCUS - ' + pagename)
      setEntryState()
    })
    const unfocused = navigation.addListener('blur', () => {
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
        // console.log('Found Running Project')
        setRunningProject(running.project)
      }
    }
  }, [runningTimer])

  useEffect(() => {
    if (runningTimer && Array.isArray(runningTimer) && runningTimer.length === 2) {
      // console.log('runningTimer: ', runningTimer)
      start()
    }
  }, [runningTimer])

  return (
    <SafeAreaView style={styles.container}>
      <RunningTimer
        onPress={() => stopAndUpdate(runningTimer)}
        display={runningValid(runningTimer) ? 'flex' : 'none'}
        color={runningValid(runningProject) ? runningProject[1].color : ''}
        title={runningValid(runningTimer) ? 'Tracking' : ''}
        project={runningValid(runningProject) ? runningProject[1].name : ''}
        timer={runningValid(runningTimer) ? formatTime(count) : ''}
      />
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