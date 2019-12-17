import React, { useState, useEffect } from 'react';
import { ExpoLinksView } from '@expo/samples';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Button,
  ScrollView
} from 'react-native';
import { updateItem, storeItem, removeItem } from '../constants/Store'
import Icon from 'react-native-vector-icons/Feather';
import { CirclePicker } from 'react-color'
import { keyToTestName } from 'jest-snapshot/build/utils';
import Hashids from 'hashids'
import NumPad from '../components/NumPad';

// Color picking
//https://casesandberg.github.io/react-color/

export default function EditorScreen({ route, navigation }) {
  const { project } = route.params
  
  const [key, setKey] = useState('')
  const [created, setCreated] = useState('')
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const [time, setTime] = useState([])

  const projectValid = () => Array.isArray(project) && project[1] === 'project' ? true : false
  const createdValid = () => typeof project[1].created.charAt(0) === 'number' ? true : false
  const nameValid = () => typeof project[1].name === 'string' ? true : false
  const colorValid = () => typeof project[1].color === 'string' && project[1].color.charAt(0) === '#' ? true : false
  const timeValid = () => Array.isArray(project[1].time) ? true : false 

  const handleRoutedParams = () => {
    console.log(project)
    if (project && projectValid) {
      setKey(project[0])
      if (createdValid === true) {
        setCreated(project[1].created)
      }
      if (nameValid === true) {
        setName(project[1].name)
      }
      if (colorValid === true) {
        setColor(project[1].color)
      }
      if (timeValid === true) {
        setTime(project[1].time)
      }
    }
  }

  useEffect(() => handleRoutedParams(), [])

  const addProject = (NEWKEY, NEWVALUE) => {
    if (name.length > 0) {
      storeItem(NEWKEY, NEWVALUE)
    }
  }

  const deleteProject = id => {
    removeItem(id)
    //todo are you sure notification        
    navigation.navigate('Projects')
  }
  const dateCreator = () => {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return date + ' ' + time;
  }

  const handleSelectedColor = (color, event) => {
    console.log(color)
    console.log(event)
    setColor(color.hex)
  }

  const handleComplete = () => {
    if (!name || name === '') {
      console.warn('Give a Valid Name')
    }
    else if (!color || color === '' || color.charAt(0) !== '#') {
      console.warn('Give a Valid Color')
    }
    else {
      let newroute
      let value = { created: created, type: 'project', name: name, color: color, time: time }
      if (key) {
        console.log('Updating Project')
        updateItem(key, value)
        newroute = {
          project: [key, value],
          update: true
        }
      }
      if (!key || key === '') {
        value.created = dateCreator()
        const hashids = new Hashids()
        const newkey = hashids.encode(Date.now())
        console.log(newkey)
        setKey(newkey)
        console.log('Adding New Project')
        addProject(newkey, value)
        newroute = {
          project: [newkey, value],
          update: false
        }
      }
      navigation.navigate('Projects', newroute)
    }
  }

  // const formatTime = () => time[0].toString() + time[1].toString() + ':' + time[2].toString() + time[3].toString() + ':' + time[4].toString() + time[5].toString()
  const formatTime = t => {
    if (!Array.isArray(t)) return false
    if (t.length === 0) return '00 : 00 : 00'
    if (t.length === 1) return '00 : 00 : 0' + t[0].toString()
    if (t.length === 2) return '00 : 00 : ' + t[0].toString() + t[1].toString()
    if (t.length === 3) return '00 : 0' + t[0].toString() + ' : ' + t[1].toString() + t[2].toString()
    if (t.length === 4) return '00 : ' + t[0].toString() + t[1].toString() + ' : ' + t[2].toString() + t[3].toString()
    if (t.length === 5) return '0' + t[0].toString() + ' : ' + t[1].toString() + t[2].toString() + ' : ' + t[3].toString() + t[4].toString()
    if (t.length > 5) return t[0].toString() + t[1].toString() + ' : ' + t[2].toString() + t[3].toString() + ' : ' + t[4].toString() + t[5].toString()
  }
  return (
    <View style={styles.container}>
      {/* <Text style={{
        marginTop: '5%',
        fontSize: 40,
        color: color,
        paddingBottom: 10
      }}>{name}</Text> */}
      <View style={styles.textInputContainer}>
        <TextInput
          style={{
            height: 20,
            fontSize: 18,
            fontWeight: 'bold',
            color: color ? color: "black",
            paddingLeft: 10,
            minHeight: '3%',
            paddingBottom: 10
          }}
          multiline={false}
          placeholder="Enter Project Name?"
          placeholderTextColor= {color ? color: "#abbabb"}
          value={name}
          onChangeText={value => setName(value)}
        />
        <TouchableOpacity onPress={() => handleComplete()}>
          <Icon name="plus" size={30} color="blue" style={{ marginLeft: 10 }} />
        </TouchableOpacity>
      </View>

      <View style={styles.colorPicker}>
        <CirclePicker
          onChangeComplete={handleSelectedColor}
        />
      </View>
      <Text style={{fontSize: 20 }}>{  formatTime(time)}</Text>

      <NumPad
        onOne={() => { console.log(time); setTime([ ...time, 1]) }}
        onTwo={() => { console.log(time); setTime([...time, 2]) }}
        onThree={() => { console.log(time); setTime([...time, 3]) }}
        onFour={() => { console.log(time); setTime([...time, 4]) }}
        onFive={() => { console.log(time); setTime([...time, 5]) }}
        onSix={() => { console.log(time); setTime([...time, 6]) }}
        onSeven={() => { console.log(time); setTime([...time, 7]) }}
        onEight={() => { console.log(time); setTime([...time, 8]) }}
        onNine={() => { console.log(time); setTime([...time, 9]) }}
        onZero={() => { console.log(time); setTime([...time, 0]) }}
        onDel={() => { console.log(time.slice(1)); setTime(time.slice(1)) }}
      />

      <View style={styles.doneButton}>
        <Button title="done" style={{ fontSize: 60 }} onPress={() => handleComplete()} />

      </View>
      <View style={styles.deleteButton}>
        {project ? (<Icon
          name="trash-2"
          size={30}
          color="red"
          style={{ marginLeft: 'auto' }}
          onPress={() => deleteProject(project[0])}
        />) : <Text></Text>}

      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    width: '100%'
  },
  header: {
    marginTop: '10%',
    fontSize: 40,
    color: 'black',
    paddingBottom: 10
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    borderColor: 'black',
    borderBottomWidth: 1,
    marginTop: '5%',
    paddingRight: 10,
    paddingBottom: 10
  },
  textInput: {
    height: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    paddingLeft: 10,
    minHeight: '3%',
    paddingBottom: 10
  },
  colorPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '5%',
    marginBottom: '5%'
  },
  deleteButton: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: '5%',
    marginBottom: '5%'
  },
  doneButton: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: '5%',
    marginBottom: '5%'
  }
});