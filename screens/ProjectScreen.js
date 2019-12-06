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

  
  const [projects, setProject] = useState([]); // state of projects list

  const handleRoutedParams = () => {
    if(route.params) {
      const { projectKey, projectName, projectColor } = route.params
      if (!projectKey || !projectName || !projectColor) return false
      if (typeof projectName === 'string' && typeof projectColor === 'string' && projectColor.charAt(0) === '#') {
         let value = [projectKey, { type: 'project', name: projectName, color: projectColor }]
         setProjects([...projects, value])
       }
    }
  }

  const entries = async () => {
    try {
      let entry = await getAll(value => value.type === 'project' ? true : false)
      console.log(entry)
      setProject(entry)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    entries()
  }, [])


  const deleteProject = id => {
    removeItem(id)
    setProject(
      projects.filter(todo => {
        if (todo[0] !== id) {
          return true;
        }
      })
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.textInputContainer}>
        <Button title='Add Project' onPress={() => navigation.navigate('Edit', {
          projectName: '',
          color: '',
        })} />
      </View>
      <ScrollView style={{ width: '100%' }}>
        {projects.map((item, i) =>
          (<ProjectList
            text={item[1].name}
            key={item[0]}
            deleteEntry={() => deleteProject(item[0])}
            onPress={() => navigation.navigate('TimerList', {
              projectName: item[1].name,
              otherParam: 'anything you want here',
            })}
            onEdit={() => navigation.navigate('Edit', {
              projectName: item[1].name,
              color: item[1].color,
              otherParam: 'anything you want here',
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