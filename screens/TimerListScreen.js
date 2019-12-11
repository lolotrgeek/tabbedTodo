import React, { useState, useEffect } from 'react';
import { ExpoLinksView } from '@expo/samples';
import {
  Button,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native';

import { getAll, removeItem } from '../constants/Store'
import { TimerList } from '../components/Timer';

export default function TimerListScreen({ route, navigation }) {

  let pagename = 'TIMERLIST'

  const { projectKey, projectName, color, project, timer, update } = route.params

  const [inputvalue, setValue] = useState(''); // state of text input
  const [timers, setTimers] = useState([]); // state of timers list
  const [timerView, setTimerView] = useState([])

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

  const entries = async () => {
    try {
      let entry = await getAll(value => value.type === 'timer' && value.project === projectKey ? true : false)
      setTimers(entry)
    } catch (error) {
      console.log(pagename + ' - ERROR : ' , error)
    }
  }
  useEffect(() => {
    const focused = navigation.addListener('focus', () => {
      console.log('FOCUS - '+ pagename)
      entries()
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
        marginTop: '15%',
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
      <ScrollView style={{ width: '100%' }}>
        {timerView.map((timer, i) =>
          (<TimerList
            key={timer[0]}
            date={timer[1].created}
            start={timer[1].start}
            stop={timer[1].stop}
            total={timer[1].total}
            deleteTimer={() => deleteProject(timer[0])}
            onPress={() => navigation.navigate('Timer', {
              projectKey: projectKey,
              projectName: projectName,
              otherParam: 'anything you want here',
            })}
            onEdit={() => navigation.navigate('TimerEditor', {
              timer: timer,
              project: project,
              projectName: projectName,
              otherParam: 'anything you want here',
            })}
          />)
        )}
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