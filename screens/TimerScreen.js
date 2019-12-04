import React, { useState, useEffect, useCallback, useRef  } from 'react';
import {
  StyleSheet,
  Button,
  Text,
  View
} from 'react-native';

import useCounter from '../constants/Hooks';
import { Timer } from '../components/Timer';
import { useStopwatch, useTimer } from 'react-timer-hook';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import NumPad from 'react-numpad';

import socketIO from 'socket.io-client';
import { set } from 'store2';
//https://brentmarquez.com/uncategorized/how-to-get-socket-io-to-work-with-react-native/

export default function TimerScreen({ route, navigation }) {

  const { projectName, otherParam } = route.params

  //SERVER STATE
  // const endpoint = "http://127.0.0.1:5050"
  // const io = socketIO(endpoint, {
  //   reconnection: true,
  //   reconnectionAttempts: Infinity,
  //   reconnectionDelay: 1000,
  // })
  // io.on('connection', socket => {
  //   setConnection(true)
  //   console.log('IO - CONNECTED')
  // })

  // LOCAL STATE
  const [connection, setConnection] = useState(Boolean)
  const [ms, setDuration] = useState(0)
  // const { count, start, stop, reset } = useCounter(0, ms)

  const [initialValue, setInitialValue] = useState(0)
  const [count, setCount] = useState(initialValue);
  const intervalRef = useRef(null);

  const start = useCallback((ms) => {
    if (intervalRef.current !== null) {
      return;
    }
    
    intervalRef.current = setInterval(() => {
      setCount(c => c + 1);
    }, ms);
  }, []);

  const stop = useCallback(() => {
    if (intervalRef.current === null) {
      return;
    }

    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  const reset = useCallback(() => {
    setCount(0);
  }, []);

  useEffect(() => {
    const focused = navigation.addListener('focus', () => { 


    })
    const unfocused = navigation.addListener('blur', () => { 
      console.log('attempting stop...')
      stop()
    })
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return focused, unfocused
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Timers</Text>
      <Button
        title="Go Home"
        onPress={() => navigation.navigate('Projects')}
      />
      <Timer
        start={() => start(ms)}
        pause={stop}
        reset={reset}
        counter={count}
      // seconds={seconds}
      // minutes={minutes}
      // hours={hours}
      // days={days}
      />
      <Text style={styles.header}>Time {ms} </Text>
      <NumPad.Number
        confirm={}
        update={}
        
        onChange={(value) => { setDuration(value)}}
        label={'Timer'}
        placeholder={'my placeholder'}
        decimal={false}
        inline={true}
      />
    </View>
  )
}

TimerScreen.navigationOptions = {
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