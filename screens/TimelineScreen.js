import React, { useState, useEffect } from 'react';
import { ExpoLinksView } from '@expo/samples';
import {
  Button,
  Text,
  View,
  StyleSheet,
  ScrollView
} from 'react-native';

import { getAll, storeItem, updateItem, removeItem, removeAll } from '../constants/Store'
import { Timeline } from '../components/Timeline';

export default function TimelineScreen({ navigation }) {

  let pagename = 'TIMELINE'

  const [timers, setTimers] = useState([]); // state of timers list
  const [projects, setProjects] = useState([]); // state of timers list
  const [matches, setMatches] = useState([]) // timer/project pairs
  const [timerView, setTimerView] = useState([]); // state of sorted timers list
  const [matchedTimers, setMatchedTimers] = useState([]); // state of sorted timers matched with Projects list
  const [daysWithTimer, setDaysWithTimer] = useState([]); // disply the timers within each day

  // PROJECT FUNCTIONS
  const deleteProject = id => {
    removeItem(id)
    setTimers(
      timers.filter(todo => {
        if (todo[0] !== id) {
          return true;
        }
      })
    );
  }
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
  //&& typeof value.start === 'number' && typeof value.stop === 'number' && typeof value.total === 'number'
  // PAGE FUNCTIONS
  const entries = async () => {
    try {
      let timerEntries = await getAll(value => isValidTimer(value) ? true : false)
      let projectEntries = await getAll(value => value.type === 'project' ? true : false)
      setTimers(timerEntries)
      setProjects(projectEntries)
    } catch (error) {
      console.log(error)
    }
  }


  const sortbydate = () => timers.sort((a, b) => new Date(b[1].created) - new Date(a[1].created))
  const listDay = () => timers.map(timer => new Date(timer[1].created))
  const simpleDate = date => date.getDate() + " " + date.toLocaleString('default', { month: 'long' }) + " " + date.getFullYear()

  const dayHeaders = () => {
    // organize timers by day
    let timerday = timers.map(timer => {
      return { day: simpleDate(new Date(timer[1].created)), timer: [timer] }
    })

    console.log(pagename + '- DAYHEADERS - TIMERDAY : ', timerday)

    let output = []
    timerday.forEach(entry => {
      // first value if output is empty is always unique
      if (output.length === 0) {
        output.push(entry)
      }
      else {
        // compare entries
        output.find((out, i) => {
          if (out.day === entry.day) {
            output[i] = { day: out.day, timer: [...out.timer, entry.timer[0]] }
          }
          else {
            console.log(pagename + '- OUTPUT ENTRY :', entry)
            //TODO: add recursion here???
            return [...output, entry]
          }
        })
      }
    })
    console.log(pagename + '- DAYHEADERS - OUTPUT', output)
  }

  useEffect(() => {
    entries()
  }, [])

  useEffect(() => {
    // sort by date
    setTimerView(timers.sort((a, b) => new Date(b[1].created) - new Date(a[1].created)))
  }, [timers])

  useEffect(() => {
    const focused = navigation.addListener('focus', () => {
      console.log('FOCUS - ' + pagename)
      entries()
    })
    const unfocused = navigation.addListener('blur', () => {
    })
    return focused, unfocused
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.header}> Timeline </Text>
      <ScrollView style={{ width: '100%' }}>
        {
          timerView.map(timer => projects.map(project => {
              if(project[0] === timer[1].project) {
                return (<Timeline
                  key={timer[0]}
                  day={new Date(timer[1].created).toString().split(' ')[0]}
                  date={timer[1].created}
                  color={project[1].color}
                  project={project[1].name }
                  total={timer[1].total}
                  // deleteTimer={() => deleteProject(timer[0])}
                  onPress={() => navigation.navigate('Timer', {
                    project: project,
                    timer: timer,
                    lastscreen : 'Timeline'
                  })}
                  onEdit={() => navigation.navigate('TimerLineEditor', {
                    project: project,
                    timer: timer,
                    lastscreen : 'Timeline'
                  })}
                />)
              }
          }
          ))
        }
      </ScrollView>
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