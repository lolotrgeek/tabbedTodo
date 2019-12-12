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


  const isValidTimer = value => value.type === 'timer'  ? true : false
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


  const projectMatch = () => {
    console.log(pagename + '- matching...')
    return (
      timers.filter(timer => projects.filter(project =>  project[0] === timer[1].project ? timer[1].details = { name: project[1].name, color: project[1].color } : false))
    )
  }
  // const sortView = view => view.sort((a, b) => )
  useEffect(() => {
    let matches = projectMatch()
    console.log(matches)
    let filterprojects = timers.map( timer => projects.filter(project => project[0] === timer[1].project ? project : false))
    console.log(filterprojects)
  }, [timers, projects])
  useEffect(() => {
    // sort by date
    setTimerView(timers.sort((a, b) => new Date(b[1].created) - new Date(a[1].created)))
    dayHeaders()
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
          // daysWithTimer.map(day => (<Text>{day.date}</Text>),
          //   // day.entries.map(item =>
          //   //   (<Timeline
          //   //     key={item[0]}
          //   //     date={item[1].created}
          //   //     color={item[1].details ? item[1].details.color : 'white'}
          //   //     project={item[1].details ? item[1].details.name : item[1].project}
          //   //     total={item[1].total}
          //   //     deleteTimer={() => deleteProject(item[0])}
          //   //     onPress={() => navigation.navigate('Timer', {
          //   //       projectKey: item[1].project,
          //   //       timerKey: item[0],
          //   //       otherParam: 'anything you want here',
          //   //     })}
          //   //   />)
          //   // )

          // )
        }
        {
          timerView.map(item => projects.forEach(project => project[0] === item[1].project ?
            (<Timeline
              key={item[0]}
              day={new Date(item[1].created).toString().split(' ')[0]}
              date={item[1].created}
              // color={item[1].details ? item[1].details.color : 'white'}
              color={item[1].details ? project[1].color : 'white'}
              project={item[1].details ? project[1].name : item[1].project}
              total={item[1].total}
              deleteTimer={() => deleteProject(item[0])}
              onPress={() => navigation.navigate('TimerList', {
                project: project,
                projectName: project[1].name,
                projectKey: item[1].project,
                timerKey: item[0],
                otherParam: 'anything you want here',
              })}
              onEdit={() => navigation.navigate('TimerLineEditor', {
                project: project,
                timer: item
              })}
            />) : false
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