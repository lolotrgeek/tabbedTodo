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
  const [time, setTime] = useState('')
  // const [showtime, setShowTime] = useState([])

  const projectValid = validate => Array.isArray(validate) && validate[1].type === 'project' ? true : false
  const createdValid = validate => typeof validate[1].created.charAt(0) === 'number' ? true : false
  const nameValid = validate => typeof validate[1].name === 'string' ? true : false
  const colorValid = validate => typeof validate[1].color === 'string' && validate[1].color.charAt(0) === '#' ? true : false
  const timeValid = validate => typeof parseInt(validate[1].time) === 'number' ? true : false 
  
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
      let value = { created: created, type: 'project', name: name, color: color, time: time}
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

  const formatTime = t => {
    if (typeof t !== 'string') return false
    if (t.length === 0) return '00 : 00 : 00'
    if (t.length === 1) return '00 : 00 : 0' + t.charAt(0)
    if (t.length === 2) return '00 : 00 : ' + t.charAt(0) + t.charAt(1)
    if (t.length === 3) return '00 : 0' + t.charAt(0) + ' : ' + t.charAt(1) + t.charAt(2)
    if (t.length === 4) return '00 : ' + t.charAt(0) + t.charAt(1) + ' : ' + t.charAt(2) + t.charAt(3)
    if (t.length === 5) return '0' + t.charAt(0) + ' : ' + t.charAt(1) + t.charAt(2) + ' : ' + t.charAt(3) + t.charAt(4)
    if (t.length > 5) return t.charAt(0) + t.charAt(1) + ' : ' + t.charAt(2) + t.charAt(3) + ' : ' + t.charAt(4) + t.charAt(5)
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
        onOne={() => { setTime(time+ '1'); console.log(time) }}
        onTwo={() => { setTime(time+ '2'); console.log(time) }}
        onThree={() => { setTime(time+ '3'); console.log(time) }}
        onFour={() => { setTime(time+ '4'); console.log(time) }}
        onFive={() => { setTime(time+ '5'); console.log(time) }}
        onSix={() => { setTime(time+ '6'); console.log(time) }}
        onSeven={() => { setTime(time+ '7'); console.log(time) }}
        onEight={() => { setTime(time+ '8'); console.log(time) }}
        onNine={() => { setTime(time+ '9'); console.log(time) }}
        onZero={() => { setTime(time+ '0'); console.log(time) }}
        onDel={() => {setTime(time.slice(1)) ; console.log(time.slice(1))}}
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