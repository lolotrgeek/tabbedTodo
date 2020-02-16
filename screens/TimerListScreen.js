import React, { useState, useEffect } from 'react';
import { Button, Text, View, SafeAreaView, SectionList } from 'react-native';
// import { getAll, updateItem, storeItem } from '../constants/Store'
import { getAll, updateItem, storeItem } from '../constants/Gun'
import { TimerList } from '../components/TimerList';
import RunningTimer from '../components/runningTimer';
import { timerValid, runningValid, timersValid } from '../constants/Validators'
import { timeString, secondsToString, totalTime, timeSpan, sayDay, dayHeaders, moodMap, isRunning, elapsedTime, findRunning, formatTime, multiDay, newEntryPerDay } from '../constants/Functions'
import { styles } from '../constants/Styles'
import { useCounter } from '../constants/Hooks'
import { newTimer, updateTimer } from '../constants/Models';
import useAsync from 'react-use/lib/useAsync';

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
  const setEntryState = async () => {
    try {
      // const retrieved = await getEntries()
      let timerEntries = await getAll(value => timerValid(value) ? true : false)
      setTimers(timerEntries)
      const projectTimers = timerEntries.filter(timer => timer[1].project === project[0] ? true : false)
      const sortedTimers = projectTimers.sort((a, b) => new Date(b[1].created) - new Date(a[1].created))
      const days = dayHeaders(sortedTimers)
      setDaysWithTimer(days)
    } catch (error) {
      console.warn(error)
    }
  }

  const refreshState = () => {
    const projectTimers = timers.filter(timer => timer[1].project === project[0] ? true : false)
    const sortedTimers = projectTimers.sort((a, b) => new Date(b[1].created) - new Date(a[1].created))
    const days = dayHeaders(sortedTimers)
    console.log('DAYS', days)
    setDaysWithTimer(days)
  }

  const foundRunning = () => {
    if (running && running.project && runningValid(runningTimer)) {
      if (runningTimer[1].project === running.project[0]) {
        setRunningProject(running.project)
      }
    }
  }

  const parseRunning = () => {
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
  }

  const startRunning = () => {
    if (runningTimer && Array.isArray(runningTimer) && runningTimer.length === 2) {
      start()
    }
  }

  const splitAndUpdate = timer => {
    const entries = newEntryPerDay(timer[1].created)
    entries.map(async (entry, i) => {
      if (i === 0) {
        await updateItem(updateTimer(timer, { ended: entry.end }))
      } else {
        let value = timer[1]
        value.created = entry.start
        value.ended = entry.end === 'running' ? new Date() : entry.end
        value.status = entry.end === 'running' ? 'running' : 'done'
        await storeItem(newTimer({ value: value }))
      }
    })
  }

  const stopAndUpdate = async timer => {
    try {
      stop()
      setCount(0)
      setRunningTimer([])
      setRunningProject([])
      let updatedTimer = updateTimer(timer, { count: count })
      console.log('updatedTimer ', updatedTimer)
      const clearEntry = timers.filter(entry => entry[0] !== updatedTimer[0])
      console.log('CLEAR', clearEntry)
      setTimers([updatedTimer, ...clearEntry])
      refreshState()
      await storeItem(updatedTimer)
    } catch (error) {
      console.warn(error)
    }
  }
  const startandUpdate = async project => {
    try {
      if (runningValid(runningTimer)) {
        stopAndUpdate(runningTimer)
      }
      let newtimer = newTimer({ project: project })
      setCount(0)
      setRunningProject(project)
      setRunningTimer(newtimer)
      await storeItem(newtimer)
    } catch (error) {
      console.warn(error)
    }

  }

  useAsync(async () => {
    const focused = navigation.addListener('focus', async () => await setEntryState())
    const unfocused = navigation.addListener('blur', () => stop())
    return focused, unfocused
  }, [])

  useEffect(() => parseRunning(), [timers])
  useEffect(() => foundRunning(), [runningTimer])
  useEffect(() => startRunning(), [runningTimer])
  useEffect(() => {
    console.log('STATE')
    console.log('Timers', timers)
    console.log('DayswithTimer', daysWithTimer)
    console.log('runningProject', runningProject)
    console.log('runningTimer', runningTimer)
  }, [timers, daysWithTimer, runningProject, runningTimer])

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