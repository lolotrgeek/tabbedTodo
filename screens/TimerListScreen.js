import React, { useState, useEffect } from 'react';
import { ExpoLinksView } from '@expo/samples';
import {
  Button,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  SectionList,
} from 'react-native';

import { getAll } from '../constants/Store'
import { TimerList } from '../components/TimerList';
import { differenceInSeconds } from 'date-fns';

export default function TimerListScreen({ route, navigation }) {

  let pagename = 'TimerList'

  const { project, timer, update } = route.params
  let projectKey = project[0]
  let projectName = project[1].name
  let color = project[1].color

  const [inputvalue, setValue] = useState(''); // state of text input
  const [timers, setTimers] = useState([]); // state of timers list
  const [timerView, setTimerView] = useState([])
  const [daysWithTimer, setDaysWithTimer] = useState([]); // disply the timers within each day

  const isValidTimer = value => value.type === 'timer' ? true : false
  const simpleDate = date => date.getDate() + " " + date.toLocaleString('default', { month: 'long' }) + " " + date.getFullYear()
  const timeString = date => date.toTimeString().split(' ')[0]
  const secondstoString = seconds => new Date(seconds * 1000).toISOString().substr(11, 8) // hh: mm : ss
  const totalTime = (start, end) => differenceInSeconds(new Date(end), new Date(start))
  const timeSpan = (start, end) => timeString(new Date(start)) + ' - ' + timeString(new Date(end))
  const moodMap = mood => {
    if(mood === '') return {name : 'times', color : 'black' }
    if(mood === 'great') return { name: 'grin', color : 'orange'}
    if(mood === 'good') return { name: 'smile', color : 'green'}
    if(mood === 'meh') return { name: 'meh', color : 'purple'}
    if(mood === 'bad') return { name: 'frown', color : 'blue'}
    if(mood === 'dizzy') return { name: 'awful', color : 'grey'}
  }

  // PAGE FUNCTIONS
  const entries = () => new Promise(async (resolve, reject) => {
    try {
      let timerEntries = await getAll(value => isValidTimer(value) ? true : false)
      resolve({ timers: timerEntries })
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
    const sortedTimers = retrieved.timers.sort((a, b) => new Date(b[1].created) - new Date(a[1].created))
    const days = await dayHeaders(sortedTimers)
    setDaysWithTimer(days)
  }
  useEffect(() => {
    setEntryState()
  }, [])

  useEffect(() => {
    const focused = navigation.addListener('focus', () => {
      console.log('FOCUS - ' + pagename)
      setEntryState()
    })
    const unfocused = navigation.addListener('blur', () => {
    })
    return focused, unfocused
  }, [])

  useEffect(() => {
    setTimerView(timers.sort((a, b) => new Date(b[1].created) - new Date(a[1].created)))
  }, [timers])

  return (
    <View style={styles.container}>
      <Text style={{
        marginTop: '5%',
        fontSize: 40,
        color: color,
        paddingBottom: 10
      }}>{projectName}</Text>

      <View style={styles.addButton}>
        <Button
          title='New Entry'
          onPress={() => navigation.navigate('Timer', { projectKey: projectKey, name: '', color: '' })}
        />
      </View>
      <SectionList style={{ width: '100%' }}
        sections={daysWithTimer}
        keyExtractor={(item, index) => item + index}
        renderSectionHeader={({ section: { title } }) => {
          return (<Text style={styles.header}>{title}</Text>)
        }}
        renderItem={({ item }) => {
          return (<TimerList
            key={item[0]}
            date={item[1].created}
            color={project[1].color}
            mood={moodMap(item[1].mood)}
            energy={item[1].energy}
            project={timeSpan(item[1].created, item[1].ended)}
            total={secondstoString( totalTime(item[1].created, item[1].ended))}
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
        }}


      />
    </View>
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