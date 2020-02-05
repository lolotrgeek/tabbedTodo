import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, TextInput, Button, Alert } from 'react-native';
import { updateItem, storeItem, removeItem } from '../constants/Store'
import { projectValid, createdValid, nameValid, colorValid, timeValid } from '../constants/Validators'
import Icon from 'react-native-vector-icons/Feather';
import { ColorPicker } from '../components/ColorPicker'
import { styles } from '../constants/Styles'
import * as material from 'material-colors'
import { updateProject, newProject } from '../constants/Models';


export default function EditorScreen({ route, navigation }) {
  const { project } = route.params
  const [key, setKey] = useState('')
  const [created, setCreated] = useState('')
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const [time, setTime] = useState('')

  const swatch = {
    width: 28,
    circleSize: 28,
    circleSpacing: 14,
  }
  const colors = [
    material.red['500'], material.pink['500'], material.purple['500'],
    material.deepPurple['500'], material.indigo['500'], material.blue['500'],
    material.lightBlue['500'], material.cyan['500'], material.teal['500'],
    material.green['500'], material.lightGreen['500'], material.lime['500'],
    material.yellow['500'], material.amber['500'], material.orange['500'],
    material.deepOrange['500'], material.brown['500'], material.blueGrey['500']
  ]

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

  const addProject = project => {
    if (name.length > 0) {
      storeItem(project)
    }
  }

  const deleteProject = id => {
    Alert.alert(
      'Delete Project',
      'Are you sure?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => {removeItem(id); navigation.navigate('Projects')} },
      ],
      { cancelable: true },
    );        
    
  }

  const enforceProjectRules = () => {
    if (!name || name === '') {
      Alert.alert(
        'Error',
        'Give a Valid Name',
      )
      return false
    }
    else if (!color || color === '' || color.charAt(0) !== '#') {
      Alert.alert(
        'Error',
        'Give a Valid Color',
      )
      return false
    }
    else {
      return true
    }
  }

  const handleComplete = () => {
    if (enforceProjectRules()) {
      let newroute
      if (key) {
        let updatedproject = updateProject(key, created, name, color, time)  
        updateItem(updatedproject)
        newroute = {
          project: updatedproject,
          update: true
        }
      }
      if (!key || key === '') {
        let newproject = newProject(name, color, time)
        setKey(newproject[0])
        addProject(newproject)
        newroute = {
          project: newproject,
          update: false
        }
      }
      navigation.navigate('Projects', newroute)
    }
  }

  useEffect(() => handleRoutedParams(), [])
  useEffect(() => navigation.setOptions({ title: name, headerStyle: { backgroundColor: color } }), [color])

  return (
    <View style={styles.container}>
      <View style={styles.textInputContainer}>
        <TextInput
          style={{
            height: 50,
            fontSize: 18,
            fontWeight: 'bold',
            color: color ? color : "black",
            paddingLeft: 10,
            minHeight: '3%',
            borderBottomWidth: 1,
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

      <View style={{
        width: '100%',
        display:'flex',
        flexDirection : 'row',
        justifyContent : 'space-evenly',
        flexWrap : 'wrap',
        marginRight: -14,
        marginTop: 14,
        marginBottom: 14,

      }}>
        {colors.map(c => {
          return (
            <ColorPicker
              key={c}
              width={swatch.width}
              circleSpacing={swatch.circleSpacing}
              circleSize={swatch.circleSize}
              color={c}
              onPress={() => setColor(c)}
            />)
        })}
      </View>

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
    </View >
  )
}