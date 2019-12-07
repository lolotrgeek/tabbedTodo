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

  const { projectKey, projectName, color, otherParam } = route.params

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
        {timers.map((item, i) =>
          (<TimerList
            key={item[0]}
            date={item[1].created}
            start={item[1].start}
            stop={item[1].stop}
            deleteTimer={() => deleteProject(item[0])}
            onPress={() => navigation.navigate('Timer', {
              projectKey: projectKey,
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