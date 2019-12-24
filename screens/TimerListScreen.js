import React, { useState, useEffect } from 'react';
import { Button, Text, View, SafeAreaView, SectionList } from 'react-native';
import { getAll, updateItem, storeItem } from '../constants/Store'
import { TimerList } from '../components/TimerList';
import { timerValid, runningValid, justtimeValid } from '../constants/Validators'
import { timeString, secondsToString, totalTime, timeSpan, sayDay, dayHeaders, moodMap, isRunning, elapsedTime, findRunning, runningFind, formatTime } from '../constants/Functions'
import { styles } from '../constants/Styles'
import { useCounter } from '../constants/Hooks'
import Hashids from 'hashids'

export default function TimerListScreen({ route, navigation }) {
  const pagename = 'TimerList'
  const { project, timer } = route.params
  let projectKey = project[0]
  let projectName = project[1].name
  let color = project[1].color

  useEffect(() => navigation.setOptions({ title: projectName, headerStyle: { backgroundColor: color } }), [])

  const [daysWithTimer, setDaysWithTimer] = useState([]); // display the timers within each day
  const [runningTimer, setRunningTimer] = useState([])
  const [direction, setDirection] = useState(true)
  const { count, total, setCount, setTotal, start, stop } = useCounter(1000, direction)


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

  const foundRunning = async () => {
    try {
      let found = await runningFind(daysWithTimer)
      console.log('found: ', found[0][0])
      setRunningTimer(found[0][0])
    }
    catch (error) {
      console.log(error)
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
    setRunningTimer([])
    console.log('updated : ' , [item[0], item[1]])
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
    if (daysWithTimer && Array.isArray(daysWithTimer) && daysWithTimer.length > 0) {
      foundRunning(daysWithTimer)
    }
  }, [daysWithTimer])

  useEffect(() => {
    if (runningTimer && Array.isArray(runningTimer) && runningTimer.length > 0) {
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
      <Text
        onPress={() => navigation.navigate('Edit', { project: project })}
        style={{
          marginTop: '5%',
          fontSize: 40,
          color: color,
          paddingBottom: 10
        }}>{projectName}</Text>

      <Text onPress={() => stopAndUpdate(runningTimer)}>
        {runningValid(runningTimer) ? formatTime(count) : ''}
      </Text>

      <View style={styles.addButton}>
        <Button
          title='New Entry'
          onPress={() => navigation.navigate('Timer', { project: project })}
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
            project={isRunning(item) ? timeString(new Date(item[1].created)) + ' - ' + item[1].status : timeSpan(item[1].created, item[1].ended)}
            // project={timeSpan(item[1].created, item[1].ended)}
            total={isRunning(item) && runningValid(runningTimer) ? formatTime(count) : secondsToString(totalTime(item[1].created, item[1].ended))}
            // total={secondsToString(totalTime(item[1].created, item[1].ended))}
            onPress={() => isRunning(item) ? stopAndUpdate(item) : navigation.navigate('TimerEditor', {
              project: project,
              timer: item,
              lastscreen: pagename
            })}
            onEdit={() => isRunning(item) ? stopAndUpdate(item) : navigation.navigate('TimerEditor', {
              project: project,
              timer: item,
              lastscreen: pagename
            })}
          />)


        }
        }
      />
    </SafeAreaView >
  )
}