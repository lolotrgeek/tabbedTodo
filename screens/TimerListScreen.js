import React, { useState, useEffect } from 'react';
import { Button, Text, View, SafeAreaView, SectionList } from 'react-native';
import { getAll } from '../constants/Store'
import { TimerList } from '../components/TimerList';
import { timerValid, justtimeValid } from '../constants/Validators'
import { timeString, secondsToString, totalTime, timeSpan, sayDay, dayHeaders, moodMap, isRunning, elapsedTime, findRunning, runningFind, formatTime } from '../constants/Functions'
import { styles } from '../constants/Styles'
import { useCounter } from '../constants/Hooks'


export default function TimerListScreen({ route, navigation }) {
  const pagename = 'TimerList'
  const { project, timer } = route.params
  let projectKey = project[0]
  let projectName = project[1].name
  let color = project[1].color

  useEffect(() => navigation.setOptions({ title: projectName, headerStyle: {backgroundColor: color} }), [])

  const [daysWithTimer, setDaysWithTimer] = useState([]); // display the timers within each day
  const [runningTimer, setRunningTimer] = useState([])
  // const [currentTick, setCurrentTick] = useState()
  // const { count, total, setCount, setTotal, start, stop } = useCounter(1000, NaN, project[1].start > 0 ? true : false)


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
        // const found = await runningFind(days)
        // setRunningTimer(found[0])
        // setCurrentTick(elapsedTime(found[0]))

      } catch (error) {
        console.log(error)
      }
    } catch (error) {
      console.log(error)

    }
  }
  useEffect(() => {
    // setEntryState()
    const focused = navigation.addListener('focus', () => {
      console.log('FOCUS - ' + pagename)
      setEntryState()
    })
    const unfocused = navigation.addListener('blur', () => {
    })
    return focused, unfocused
  }, [])

  // useEffect(() => {
  //   setCount(currentTick)
  //   console.log(count)
  //   start()
  // }, [currentTick])

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
          return (<Text style={styles.subheader}>{sayDay(new Date(title))}</Text>)
        }}
        renderItem={({ item }) => {
          

            return (<TimerList
              key={item[0]}
              date={item[1].created}
              color={project[1].color}
              mood={moodMap(item[1].mood)}
              energy={item[1].energy}
              project={isRunning(item) ? timeString(new Date(item[1].created)) + ' - running' : timeSpan(item[1].created, item[1].ended)}
              total={secondsToString(totalTime(item[1].created, item[1].ended))}
              onPress={() => navigation.navigate('TimerEditor', {
                project: project,
                timer: item,
                lastscreen: pagename
              })}
              onEdit={() => navigation.navigate('TimerEditor', {
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