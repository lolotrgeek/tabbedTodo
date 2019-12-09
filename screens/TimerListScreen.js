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

import { getAll, getAllEntries, updateItem, removeItem } from '../constants/Store'
import { TimerList } from '../components/Timer';

export default function TimerListScreen({ route, navigation }) {

  const { projectKey, projectName, color, project, timer, update } = route.params

  const [inputvalue, setValue] = useState(''); // state of text input
  const [timers, setTimers] = useState([]); // state of timers list

  const entries = async () => {
    try {
      let entry = await getAll(value => value.type === 'timer' && value.project === projectKey ? true : false)
      console.log(entry)
      setTimers(entry)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    entries()
  }, [])


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
        {timers.map((timer, i) =>
          (<TimerList
            key={timer[0]}
            date={timer[1].created}
            start={timer[1].start}
            stop={timer[1].stop}
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
            }) }
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