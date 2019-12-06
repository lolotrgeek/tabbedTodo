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
import { updateItem, storeItem } from '../constants/Store'
import Icon from 'react-native-vector-icons/Feather';
import { CirclePicker } from 'react-color'
import { keyToTestName } from 'jest-snapshot/build/utils';

// Color picking
//https://casesandberg.github.io/react-color/

export default function EditorScreen({ route, navigation }) {
  const { project } = route.params

  const [key, setKey] = useState('')
  const [name, setName] = useState(''); // state of input project Name
  const [color, setColor] = useState(''); // state of color picker

const projectValid = () => Array.isArray(project) && project[1] === 'project' ? true : false  
const nameValid = () => typeof project[1].name === 'string' ? true : false
const colorValid = () => typeof project[1].color === 'string' && project[1].color.charAt(0) === '#' ? true : false

  const handleRoutedParams = () => {
    if (project && projectValid) {
      setKey(project[0])
      if (nameValid) {
        setName(project[1].name)
      }
      if (colorValid) {
        setColor(project[1].color)
      }
    }
  }

  useEffect(() => {
    handleRoutedParams()
  }, [])

  const addProject = (NEWKEY) => {
    if (name.length > 0) {
      const NEWVALUE = { type: 'project', name: name, color: color }
      const NEWENTRY = [NEWKEY, NEWVALUE]
      storeItem(NEWKEY, NEWVALUE)
    }
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
      let value = { type: 'project', name: name, color: color }
      if (key) {
        console.log('Updating Project')
        updateItem(key, value)
        newroute = {
          project: [key, value],
          update: true
        } 
      }
      if (!key || key === '') {
        let newkey = Date.now().toString()
        setKey(newkey)
        console.log('Adding New Project')
        addProject(newkey)
        newroute = {
          project: [newkey, value],
          update: false
        } 
      }
      navigation.navigate('Projects' , newroute) 
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
          onChangeText={name => setName(name)}
        />
        <Button title='Done' onPress={() => handleComplete()} />
        <TouchableOpacity onPress={() => handleComplete()}>
          <Icon name="plus" size={30} color="blue" style={{ marginLeft: 10 }} />
        </TouchableOpacity>
      </View>
      <CirclePicker
        onChangeComplete={handleSelectedColor}
      />
      <ScrollView style={{ width: '100%' }}>

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
    minHeight: '3%'
  }
});