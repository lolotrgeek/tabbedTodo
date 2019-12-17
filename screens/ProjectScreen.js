import React, { useState, useEffect } from 'react';
import { StyleSheet, Button, View, ScrollView } from 'react-native';
import ProjectList from '../components/ProjectList';
import { getAll } from '../constants/Store'

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
            onPress={() => navigation.navigate('Edit', {
              project: project
            })}
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