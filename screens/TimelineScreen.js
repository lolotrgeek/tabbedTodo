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

export default function TimelineScreen({ route, navigation }) {


  const [timers, setTimers] = useState([]); // state of timers list
  const [projects, setProjects] = useState([]); // state of timers list
  const [matches, setMatches] = useState([]) // timer/project pairs
  const [timerView, setTimerView] = useState([]); // state of sorted timers list

  // PROJECT FUNCTIONS
  const updateProject = (key, value) => {
    updateItem(key, value)
    // find where key is the same and overwrite it
    let update = timers.filter(todo => {
      if (todo[0] === key) {
        todo[1] = value
        return todo
      }
    })
    console.log('STATE - updated : ', update)
    console.log('STATE - Projects : ', timers)
    // setJournalEntry([...timers, update[1].text = editvalue.input])
  }

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
        console.log('MATCH - timer :' + id + ' to timer: ' + timer[1].project)
        return true
      }
      else {
        return false
      }
    })
  }

  const projectMatch = () => {
    console.log('sorting...')
    setTimers(timers.map(timer => projects.filter(project => project[0] === timer[1].project ?
      timer[1].details = { name: project[1].name, color: project[1].color }
      : false
    ))[0]
    )
  }


  // PAGE FUNCTIONS
  const entries = async () => {
    try {
      let timerEntries = await getAll(value => value.type === 'timer' ? true : false)
      let projectEntries = await getAll(value => value.type === 'project' ? true : false)
      setTimers(timerEntries)
      setProjects(projectEntries)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    const focused = navigation.addListener('focus', () => {
      console.log('FOCUS - TIMELINE')
    })
    const unfocused = navigation.addListener('blur', () => {
    })
    return focused, unfocused
  }, [])

  useEffect(() => {
    entries()
  }, [])

  useEffect(() => {
    setTimerView(timers.sort((a, b) => b[1].created - a[1].created).reverse())
  }, [timers])

  return (
    <View style={styles.container}>
      <Text style={styles.header}> Timeline </Text>
      <Button title='Get Matches' onPress={() => projectMatch()}></Button>
      <ScrollView style={{ width: '100%' }}>
        {
          timerView.map((item, i) =>
            (<Timeline
              key={item[0]}
              date={item[1].created}
              color={item[1].details ? item[1].details.color : 'white'}
              project={item[1].details ? item[1].details.name : item[1].project}
              total={item[1].total}
              deleteTimer={() => deleteProject(item[0])}
              onPress={() => navigation.navigate('Timer', {
                projectKey: item[1].project,
                timerKey: item[0],
                otherParam: 'anything you want here',
              })}
            />)
          )
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