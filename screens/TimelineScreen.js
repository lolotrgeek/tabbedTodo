import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, SectionList } from 'react-native';
import { Timeline } from '../components/Timeline';
import { getAll } from '../constants/Store'
import { secondsToString, sayDay, sumProjectTimers, dayHeaders, isRunning } from '../constants/Functions'
import { timerValid } from '../constants/Validators'
import { styles } from '../constants/Styles'

export default function TimelineScreen({ navigation }) {
  let pagename = 'TIMELINE'
  const [timers, setTimers] = useState([]); // state of timers list
  const [projects, setProjects] = useState([]); // state of timers list
  const [daysWithTimer, setDaysWithTimer] = useState([]); // disply the timers within each day

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

  return (
    <SafeAreaView style={styles.container}>
      <SectionList style={{ width: '100%' }}
        sections={daysWithTimer}
        keyExtractor={(item, index) => item + index}
        renderSectionHeader={({ section: { title } }) => {
          return (<Text style={styles.subheader}>{sayDay(new Date(title))}</Text>)
        }}
        renderItem={({ item }) => projects.map(project => {
          if (project[0] === item.project) {
            return (<Timeline
              key={item.project}
              color={project[1].color}
              project={project[1].name}
              total={secondsToString(item.total)}
              onPress={() => navigation.navigate('TimerList', {
                project: project,
                lastscreen: 'Timeline'
              })}
              onStart={() => navigation.navigate('Timer', {
                project: project,
                lastscreen: 'Timeline',
                run: true,
              })}
            />)
          }
        })
        }
      />
    </SafeAreaView >
  )
}