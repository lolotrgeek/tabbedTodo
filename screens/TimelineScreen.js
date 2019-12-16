import React, { useState, useEffect } from 'react';
import { ExpoLinksView } from '@expo/samples';
import {
  Button,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  SectionList,
} from 'react-native';

import { getAll, storeItem, updateItem, removeItem, removeAll } from '../constants/Store'
import { Timeline } from '../components/Timeline';
import { compareAsc } from 'date-fns'

export default function TimelineScreen({ navigation }) {

  let pagename = 'TIMELINE'

  const [timers, setTimers] = useState([]); // state of timers list
  const [projects, setProjects] = useState([]); // state of timers list
  const [matches, setMatches] = useState([]) // timer/project pairs
  const [timerView, setTimerView] = useState([]); // state of sorted timers list
  const [matchedTimers, setMatchedTimers] = useState([]); // state of sorted timers matched with Projects list
  const [daysWithTimer, setDaysWithTimer] = useState([]); // disply the timers within each day

  const getProjects = (id) => {
    timers.filter(timer => {
      if (id === timer[1].project) {
        console.log(pagename + '- MATCH - timer :' + id + ' to timer: ' + timer[1].project)
        return true
      }
      else {
        return false
      }
    })
  }


  const isValidTimer = value => value.type === 'timer' ? true : false

  // PAGE FUNCTIONS
  const entries = () => new Promise(async (resolve, reject) => {
    try {
      let timerEntries = await getAll(value => isValidTimer(value) ? true : false)
      let projectEntries = await getAll(value => value.type === 'project' ? true : false)
      resolve({ timers: timerEntries, projects: projectEntries })
    } catch (error) {
      reject(error)
    }
  })

  const dayHeaders = timerlist => new Promise((resolve, reject) => {
    const output = [] // [days...]
    // organize timers by day
    const timerdays = timerlist.map(timer => {
      return { day: simpleDate(new Date(timer[1].created)), timer: timer }
    })
    // console.log(pagename + '- DAYHEADERS - TIMERDAYS : ', timerdays)
    timerdays.forEach(timerday => {
      // first value if output is empty is always unique
      if (output.length === 0) {
        console.log(pagename + '- FIRST OUTPUT ENTRY :', timerday)
        output.push({ title: timerday.day, data: [timerday.timer] })
      }
      else {
        // find and compare timerdays to outputs
        const match = output.find(inOutput => inOutput.title === timerday.day)
        if (match) {
          console.log(pagename + '- MATCHING ENTRY :', match.day)
          // add timer to list of timers for matching day
          match.data = [...match.data, timerday.timer]
        }
        else {
          console.log(pagename + '- NEW OUTPUT ENTRY :', timerday)
          output.push({ title: timerday.day, data: [timerday.timer] })
        }
      }
    })
    console.log(pagename + '- DAYHEADERS - OUTPUT', output)
    if (output.length > 0) { resolve(output) }
    else { reject([]) }
  })

  const setEntryState = async () => {
    const retrieved = await entries()
    setTimers(retrieved.timers)
    setProjects(retrieved.projects)
    const days = await dayHeaders(retrieved.timers)
    setDaysWithTimer(days)
  }


  const sortbydate = () => timers.sort((a, b) => new Date(b[1].created) - new Date(a[1].created))
  const listDay = () => timers.map(timer => new Date(timer[1].created))
  const simpleDate = date => date.getDate() + " " + date.toLocaleString('default', { month: 'long' }) + " " + date.getFullYear()

  useEffect(() => {
    setEntryState()
  }, [])

  useEffect(() => {
    // daysWithTimer.map(entry => {
    //   console.log(entry.title)
    //   entry.data.map(timer => projects.map(project => {
    //     console.log(timer[1], project[1])
    //   })
    //   )
    // }
    // )
    console.log(daysWithTimer)
  }, [daysWithTimer])

  useEffect(() => {
    // sort by date
    setTimerView(timers.sort((a, b) => new Date(b[1].created) - new Date(a[1].created)))
  }, [timers])

  useEffect(() => {
    const focused = navigation.addListener('focus', () => {
      console.log('FOCUS - ' + pagename)
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
          return (<Text style={styles.header}>{title}</Text>)
        }}
        renderItem={({ item }) => projects.map(project => {
          if (project[0] === item[1].project) {
            return (<Timeline
              key={item[0]}
              date={item[1].created}
              color={project[1].color}
              project={project[1].name}
              total={item[1].total}
              onPress={() => navigation.navigate('TimerList', {
                project: project,
                timer: item,
                lastscreen: 'Timeline'
              })}
              onEdit={() => navigation.navigate('TimerLineEditor', {
                project: project,
                timer: item,
                lastscreen: 'Timeline'
              })}
            />)
          }
        })
        }
      />
    </SafeAreaView >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  header: {
    marginTop: '15%',
    fontSize: 40,
    color: 'black',
    paddingBottom: 10
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    borderColor: 'black',
    borderBottomWidth: 1,
    paddingRight: 10,
    paddingBottom: 10
  },
  textInput: {
    flex: 1,
    height: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    paddingLeft: 10,
    minHeight: '3%'
  }
});