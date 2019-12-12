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
import NumPad from 'react-numpad';

// Color picking
//https://casesandberg.github.io/react-color/

export default function EditorScreen({ route, navigation }) {
  const { project } = route.params

  const [key, setKey] = useState('')
  const [created, setCreated] = useState('')
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const [time, setTime] = useState(0)

  const projectValid = () => Array.isArray(project) && project[1] === 'project' ? true : false
  const createdValid = () => typeof project[1].created.charAt(0) === 'number' ? true : false
  const nameValid = () => typeof project[1].name === 'string' ? true : false
  const colorValid = () => typeof project[1].color === 'string' && project[1].color.charAt(0) === '#' ? true : false
  const timeValid = () => true

  const handleRoutedParams = () => {
    if (project && projectValid) {
      setKey(project[0])
      if (createdValid) {
        setCreated(project[1].created)
      }
      if (nameValid) {
        setName(project[1].name)
      }
      if (colorValid) {
        setColor(project[1].color)
      }
      if (timeValid) {
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

  return (
    <View style={styles.container}>
      <Text style={{
        marginTop: '10%',
        fontSize: 40,
        color: color,
        paddingBottom: 10
      }}>{name}</Text>
      <View style={styles.textInputContainer}>
        <TextInput
          style={styles.textInput}
          multiline={false}
          placeholder="Enter Project Name?"
          placeholderTextColor="#abbabb"
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
    <Text>Time Value: {time}</Text>
      <NumPad.Number
        onChange={value => setTime(value)}
        label={'Optional: Set Ideal Project Time'}
        placeholder={'my placeholder'}
        decimal={false}
        inline={true}
      />
      <Button title="done" style={styles.doneButton} size={40} onPress={() => handleComplete()} />
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
    backgroundColor: '#F5FCFF'
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
    minHeight: '3%',
    paddingBottom: 10
  },
  colorPicker: {
    alignItems: 'baseline',
    flex: 1,
    marginTop: 10,
  },
  deleteButton: {
    alignItems: 'baseline',
    flexDirection: 'row',
    flex: 1,
    marginTop: 10,
  },
  doneButton : {
    alignItems: 'baseline',
    flexDirection: 'row',
    flex: 1,
    marginTop: 10
  }
});