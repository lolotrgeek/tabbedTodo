import React, { useState, useEffect } from 'react'
import { Button, View, ScrollView } from 'react-native'
import ProjectList from '../components/ProjectList'
// import { getAll, removeAll } from '../constants/Store'
import { getAll, removeAll } from '../constants/Gun'
import { styles } from '../constants/Styles'

export default function ProjectScreen({ route, navigation }) {
  let pagename = 'Projects'
  const { running, update, lastscreen } = route.params
  const [projects, setProject] = useState([]); // state of projects list

  const entries = async () => {
    try {
      let entry = await getAll(value => value.type === 'project' ? true : false)
      setProject(entry)
    } catch (error) {
      Alert.alert(
        'Error',
        'Unable to Load Entries',
        [{
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          { text: 'OK', onPress: () => navigation.navigate(lastscreen) },
        ],
        { cancelable: true },
      );
    }
  }

  useEffect(() => {
    navigation.setOptions({ title: pagename })
    entries()
  }, [])

  useEffect(() => {
    const focused = navigation.addListener('focus', () => {
      navigation.setOptions({ title: pagename })
      entries()
    })
    const unfocused = navigation.addListener('blur', () => {})
    return focused, unfocused
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.addButton}>
        <Button
          title='Add Project'
          onPress={() => navigation.navigate('Edit', { project: [] })}
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
              running: running,
              lastscreen: 'Timeline'
            })}
          />
          ))}

      </ScrollView>
    </View>
  )
}