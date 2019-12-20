import React, { useState, useEffect } from 'react';
import {  Button, View, ScrollView } from 'react-native';
import ProjectList from '../components/ProjectList';
import { getAll } from '../constants/Store'
import {styles} from '../constants/Styles'

export default function ProjectScreen({ route, navigation }) {

  let pagename = 'Projects'

  // LOCAL STATE
  const [projects, setProject] = useState([]); // state of projects list

  // PAGE FUNCTIONS
  const entries = async () => {
    try {
      let entry = await getAll(value => value.type === 'project' ? true : false)
      setProject(entry)
    } catch (error) {
      console.log(error)
    }
  }
  // EFFECTS
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
            onView={() => navigation.navigate('TimerList', {
              project: project,
              run: false,
            })}
            onStart={() => navigation.navigate('Timer', {
              project: project,
              run: true,
            })}
            onStop={() => navigation.navigate('Timer', {
              project: project,
              run: false,
            })}
          />
          ))}

      </ScrollView>
    </View>
  )
}