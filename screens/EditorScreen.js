import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, TextInput, Button, } from 'react-native';
import { updateItem, storeItem, removeItem } from '../constants/Store'
import { projectValid, createdValid, nameValid, colorValid, timeValid } from '../constants/Validators'
import { dateCreator, secondsToString } from '../constants/Functions'
import Icon from 'react-native-vector-icons/Feather';
import { CirclePicker } from 'react-color'
import Hashids from 'hashids'
import NumPad from '../components/NumPad';
import styles from '../constants/Styles'

// Color picking
//https://casesandberg.github.io/react-color/

export default function EditorScreen({ route, navigation }) {
  const { project } = route.params

  const [key, setKey] = useState('')
  const [created, setCreated] = useState('')
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const [time, setTime] = useState('')
  // const [showtime, setShowTime] = useState([])

  const handleRoutedParams = () => {
    if (projectValid(project)) {
      console.log(project)
      setKey(project[0])
      if (createdValid(project)) {
        setCreated(project[1].created)
      }
      if (nameValid(project)) {
        setName(project[1].name)
      }
      if (colorValid(project)) {
        setColor(project[1].color)
      }
      if (timeValid(project)) {
        setTime(project[1].time)
        console.log(typeof time)
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
            color: color ? color : "black",
            paddingLeft: 10,
            minHeight: '3%',
            paddingBottom: 10
          }}
          multiline={false}
          placeholder="Enter Project Name?"
          placeholderTextColor={color ? color : "#abbabb"}
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
      <Text style={{ fontSize: 20 }}>{secondsToString(time)}</Text>

      <NumPad
        onOne={() => { setTime(time + '1'); console.log(time) }}
        onTwo={() => { setTime(time + '2'); console.log(time) }}
        onThree={() => { setTime(time + '3'); console.log(time) }}
        onFour={() => { setTime(time + '4'); console.log(time) }}
        onFive={() => { setTime(time + '5'); console.log(time) }}
        onSix={() => { setTime(time + '6'); console.log(time) }}
        onSeven={() => { setTime(time + '7'); console.log(time) }}
        onEight={() => { setTime(time + '8'); console.log(time) }}
        onNine={() => { setTime(time + '9'); console.log(time) }}
        onZero={() => { setTime(time + '0'); console.log(time) }}
        onDel={() => { setTime(time.slice(1)); console.log(time.slice(1)) }}
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