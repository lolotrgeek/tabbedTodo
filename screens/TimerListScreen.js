import React, { useState, useEffect } from 'react';
import { ExpoLinksView } from '@expo/samples';
import {
  StyleSheet,
  Button,
  Text,
  View,
  TouchableOpacity,
  ScrollView
} from 'react-native';

import { getAll, storeItem, updateItem, removeItem, removeAll } from '../constants/Functions'


import Icon from 'react-native-vector-icons/Feather';
import {TimerList} from '../components/Timer';

export default function TimerListScreen({ route, navigation }) {

  const { projectName, otherParam } = route.params

  const [inputvalue, setValue] = useState(''); // state of text input
  const [timers, setTimers] = useState([]); // state of timers list

  const entries = async () => {
    try {
      let entry = await getAll(value => value.type === 'timer' ? true : false)
      console.log(entry)
      setTimers(entry)
    }  catch (error) {
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
      <Text style={styles.header}>Timers</Text>
      <ScrollView style={{ width: '100%' }}>
        {timers.map((item, i) =>
          (<TimerList
            key={item[0]}
            date={item[0]}
            start={item[1].start}
            stop={item[1].stop}
            deleteEntry={() => deleteProject(item[0])}
            onPress={() => navigation.navigate('Timer', {
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