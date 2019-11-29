import React, {useState, useEffect } from 'react';
import { ExpoLinksView } from '@expo/samples';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView
} from 'react-native';

import {getAll, storeItem, updateItem, removeItem, removeAll} from '../constants/Functions'


import Icon from 'react-native-vector-icons/Feather';
import ProjectList from '../components/ProjectList';

export default function ProjectScreen() {

  const [inputvalue, setValue] = useState(''); // state of text input
  const [projects, setProject] = useState([]); // state of projects list


  useEffect(() => {
    getAll(value => value.type === 'project' ? true : false, entry => setProject(projects => [...projects, entry]))
  }, [])

  const addProject = () => {
    if (inputvalue.length > 0) {
      const NEWKEY = Date.now().toString()
      const NEWVALUE = { type :'project', text: inputvalue}
      const NEWENTRY = [NEWKEY, NEWVALUE]
      storeItem(NEWKEY, NEWVALUE)
      setProject([...projects, NEWENTRY]); // add todo to state
      setValue(''); // reset value of input to empty
    }
  }

  const updateProject = (key, value) => {
    updateItem(key, value)
    // find where key is the same and overwrite it
    let update = projects.filter(todo => {
      if (todo[0] === key) {
        todo[1] = value
        return todo
      }
    })
    console.log('STATE - updated : ', update)
    console.log('STATE - Projects : ', projects)
    // setJournalEntry([...projects, update[1].text = editvalue.input])
  }

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
      <Text style={styles.header}>Projects</Text>
      <View style={styles.textInputContainer}>
        <TextInput
          style={styles.textInput}
          multiline={false}
          placeholder="Enter Project Name?"
          placeholderTextColor="#abbabb"
          value={inputvalue}
          onChangeText={inputvalue => setValue(inputvalue)}
        />
        <TouchableOpacity onPress={() => addProject()}>
          <Icon name="plus" size={30} color="blue" style={{ marginLeft: 10 }} />
        </TouchableOpacity>
      </View>
      <ScrollView style={{ width: '100%' }}>
        {projects.map((item, i) =>
          (<ProjectList
            text={item[1].text }
            key={item[0]}
            deleteEntry={() => deleteProject(item[0])}
          />)
        )}
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

ProjectScreen.navigationOptions = {
  title: 'Projects',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  header: {
    marginTop: '15%',
    fontSize: 20,
    color: 'red',
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