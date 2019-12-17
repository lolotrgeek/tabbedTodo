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
import { getAll } from '../constants/Store'
import { Timeline } from '../components/Timeline';
import { compareAsc, differenceInSeconds } from 'date-fns'

export default function TimelineScreen({ navigation }) {

  let pagename = 'TIMELINE'

  const [timers, setTimers] = useState([]); // state of timers list
  const [projects, setProjects] = useState([]); // state of timers list
  const [daysWithTimer, setDaysWithTimer] = useState([]); // disply the timers within each day

  const sortbydate = () => timers.sort((a, b) => new Date(b[1].created) - new Date(a[1].created))
  const listDay = () => timers.map(timer => new Date(timer[1].created))
  const simpleDate = date => date.getDate() + " " + date.toLocaleString('default', { month: 'long' }) + " " + date.getFullYear()
  const isValidTimer = value => value.type === 'timer' ? true : false
  const secondstoString = seconds => new Date(seconds * 1000).toISOString().substr(11, 8) // hh: mm : ss

  const sumProjectTimers = dayheaders => {
    return dayheaders.map(day => {
      // return array of days by project with timers summed
      let projects = []
      // for each day...
      day.data.map(timer => {
        // ... group timer entries by project
        if (projects.length === 0) {
          projects.push({ project: timer[1].project, totals: [timer[1].total] , total : timer[1].total  })
        }
        const match = projects.find(inProjects => inProjects.project === timer[1].project)
        if (match) {
          match.totals = [...match.totals, timer[1].total]
          match.total = match.totals.reduce((acc, val) => acc + val) // sum the totals
        }
        else {
          projects.push({ project: timer[1].project, totals: [timer[1].total], total : timer[1].total })
        }

      })
      // console.log({title: day.title , data : projects})
      
      return { title: day.title, data: projects }
    })

  }

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
    // //console.log(pagename + '- DAYHEADERS - TIMERDAYS : ', timerdays)
    timerdays.forEach(timerday => {
      // first value if output is empty is always unique
      if (output.length === 0) {
        //console.log(pagename + '- FIRST OUTPUT ENTRY :', timerday)
        output.push({ title: timerday.day, data: [timerday.timer] })
      }
      else {
        // find and compare timerdays to outputs
        const match = output.find(inOutput => inOutput.title === timerday.day)
        if (match) {
          //console.log(pagename + '- MATCHING ENTRY :', match.title)
          // add timer to list of timers for matching day
          match.data = [...match.data, timerday.timer]
        }
        else {
          //console.log(pagename + '- NEW OUTPUT ENTRY :', timerday)
          output.push({ title: timerday.day, data: [timerday.timer] })
        }
      }
    })
    //console.log(pagename + '- DAYHEADERS - OUTPUT', output)
    if (output.length > 0) { resolve(output) }
    else { reject([]) }
  })

  const setEntryState = async () => {
    const retrieved = await entries()
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
  }, [])

  useEffect(() => {
    const focused = navigation.addListener('focus', () => {
      //console.log('FOCUS - ' + pagename)
      setEntryState()
    })
    const unfocused = navigation.addListener('blur', () => {
    })
    return focused, unfocused
  }, [])

  useEffect(() => {
    console.log(daysWithTimer)
  }, [daysWithTimer])

  return (
    <SafeAreaView style={styles.container}>
      <SectionList style={{ width: '100%' }}
        sections={daysWithTimer}
        keyExtractor={(item, index) => item + index}
        renderSectionHeader={({ section: { title } }) => {
          return (<Text style={styles.header}>{title}</Text>)
        }}
        renderItem={({ item }) => projects.map(project => {
          if (project[0] === item.project) {
            return (<Timeline
              key={item.project}
              color={project[1].color}
              project={project[1].name}
              // total={secondstoString(totalTime(item[1].created, item[1].ended))}
              total={secondstoString(item.total)}
              onPress={() => navigation.navigate('TimerList', {
                project: project,
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