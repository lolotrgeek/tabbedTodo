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
import { TimerList } from '../components/Timer'
import { getAll, storeItem, updateItem, removeItem, removeAll } from '../constants/Functions'
import Icon from 'react-native-vector-icons/Feather';


export default function TimerListScreen({ route, navigation }) {

  const { projectName, otherParam } = route.params


  // LOCAL STATE
  const [connection, setConnection] = useState(Boolean)
  const [timers, setTimers] = useState([]); // state of timer list

  useEffect(async () => {
    await countKeys()
  }, [])

  // When the View is loaded..
  useEffect(() => {
    countKeys()
    getAll(value => value.type === 'timer' && value.project === projectName ? true : false, entry => setTimers(timers => [...timers, entry]))
  }, [])

  // useEffect(() => {
  //   const focused = navigation.addListener('focus', () => {

  //   })

  //   const unfocused = navigation.addListener('blur', () => {


  //   })
  //   // Return the function to unsubscribe from the event so it gets removed on unmount
  //   return focused, unfocused
  // }, [])


  const updateTimer = (key, time) => {
    const value = { type: 'timer', project: projectName, start: time.start, end: time.end }
    updateItem(key, value)
    let update = timers.filter(timer => {
      if (timer[0] === key) {
        timer[1] = value
      }
    })
    console.log('STATE - updated : ', update)
    console.log('STATE - timers : ', timers)
    // setTimers([...timers, update[1].text = editvalue.input])
    return event
  }

  const timerState = id => {
    // console.log('STATE- editvalue : ' , editvalue)
    if (editvalue.id && editvalue.id === id) return true
  }

  const getAsync = (storeLength) => {
    if(storeLength !== timers.length) return false
    return true
  }

  const deleteTimer = id => {
    removeItem(id) // remove from async storage
    setTimers(
      // filter from timer state
      timers.filter(timer => {
        if (timer[0] !== id) {
          return true;
        }
      })
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}> {projectName} Timers</Text>
      <Button
        title="Go Home"
        onPress={() => navigation.navigate('Projects')}
      />

      <ScrollView style={{ width: '100%' }}>
        {timers.map((item, i) => {
            (<TimerList
              date={item[0]}
              start={item[1].start}
              stop={item[1].stop}
              deleteTimer={() => deleteTimer(key)}
            />)
        })}
      </ScrollView>
      <TouchableOpacity onPress={() => removeAll(setTimers)}>
        <Icon name="minus" size={40} color="red" style={{ marginLeft: 10 }} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => getAll()}>
        <Icon name="plus" size={40} color="blue" style={{ marginLeft: 10 }} />
      </TouchableOpacity>
    </View>
  )
}



TimerListScreen.navigationOptions = {
  title: 'Timers',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  header: {
    marginTop: '15%',
    fontSize: 20,
    color: 'red',
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