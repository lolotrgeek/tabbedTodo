import React, { useState, useEffect } from 'react';
import { ExpoLinksView } from '@expo/samples';
import {
  StyleSheet,
  Button,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import ProjectList from '../components/ProjectList';
import { getAll, storeItem, updateItem, removeItem, removeAll } from '../constants/Store'

export default function ProjectScreen({ route, navigation }) {
  let pagename = 'Projects'
  // LOCAL STATE
  const [projects, setProject] = useState([]); // state of projects list

  // PROJECT FUNCTIONS
  const projectValid = () => Array.isArray(project) && project[1] === 'project' ? true : false
  const nameValid = () => typeof project[1].name === 'string' ? true : false
  const colorValid = () => typeof project[1].color === 'string' && project[1].color.charAt(0) === '#' ? true : false

  const updateProject = (key, value) => {
    setProject(projects.map(project => key === project[0] ? [key, value] : project))
    console.log(pagename +'- STATE UPDATED - Projects : ', projects)
  }


  // PAGE FUNCTIONS
  const entries = async () => {
    try {
      let entry = await getAll(value => value.type === 'project' ? true : false)
      setProject(entry)
    } catch (error) {
      console.log(error)
    }
  }
  
  const handleRoutedParams = () => {
    if (route.params) {
      console.log('PARAMS : ' + JSON.stringify(route.params))
      const { project, update } = route.params
      if (!projectValid) {
        console.log(pagename +'- INVALID ROUTED PROJECT : ' + JSON.stringify(project))
        return false
      }
      if (nameValid && colorValid) {
        console.log(pagename +'- VALID ROUTED PROJECT : ' + project[0] + ',' + JSON.stringify(project[1]))
        if (update) {
          updateProject(project[0], project[1])
          console.log(pagename +'- UPDATING ROUTED PROJECT : ' + JSON.stringify(project))
        }
        else {
          console.log(pagename +'- ADDING ROUTED PROJECT : ' + JSON.stringify(project))
          setProject([...projects, project])
        }

      }
    }
  }

  useEffect(() => {
    const focused = navigation.addListener('focus', () => {
      console.log('FOCUSED PAGE - ' + pagename)
      entries()
    })
    const unfocused = navigation.addListener('blur', () => {
    })
    return focused, unfocused
  }, [])

  useEffect(() => {
    entries()
  }, [])

  // useEffect(() => {
  //   handleRoutedParams()
  // }, [route])

  return (
    <View style={styles.container}>
      <View style={styles.addButton}>
        <Button
          title='Add Project'
          onPress={() => navigation.navigate('Edit', { name: '', color: '' })}
        />
      </View>
      <ScrollView style={{ width: '100%' }}>
        {projects.map((project, i) =>
          (<ProjectList
            key={project[0]}
            text={project[1].name}
            color={project[1].color}
            deleteEntry={() => deleteProject(project[0])}
            onPress={() => navigation.navigate('Edit', {
              project: project
            })}
            onView={() => navigation.navigate('TimerList', {
              project : project,
              run: false,
            })}
            onStart={() => navigation.navigate('Timer', {
              project : project,
              run: true,
            })}
            onStop={() => navigation.navigate('Timer', {
              project : project,
              run: false,
            })}
          />
          ))}

      </ScrollView>
      <TouchableOpacity onPress={() => removeAll(setProject)}>
        <Icon name="minus" size={40} color="red" style={{ marginLeft: 10 }} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => getAll()}>
        <Icon name="plus" size={40} color="blue" style={{ marginLeft: 10 }} />
      </TouchableOpacity>
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
    color: 'white',
    paddingBottom: 10
  },
  addButton: {
    width: '100%',
    marginTop: '10%',
    paddingBottom: 20,
    borderColor: '#aaaaaa',
    borderBottomWidth: 1.5,
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