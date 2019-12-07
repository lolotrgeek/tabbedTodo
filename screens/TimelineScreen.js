import React, { useState, useEffect } from 'react';
import { ExpoLinksView } from '@expo/samples';
import {
  Button,
  Text,
  View,
  StyleSheet,
  ScrollView
} from 'react-native';

import { getAll, storeItem, updateItem, removeItem, removeAll } from '../constants/Store'
import { Timeline } from '../components/Timeline';

export default function TimelineScreen({ route, navigation }) {


  const [timers, setTimers] = useState([]); // state of timers list
  const [projects, setProjects] = useState([]); // state of timers list

  const entries = async () => {
    try {
      let timerEntries = await getAll(value => value.type === 'timer' ? true : false)
      let projectEntries = await getAll(value => value.type === 'project' ? true : false)
      setTimers(timerEntries)
      setProjects(projectEntries)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    entries()
  }, [])


  const updateProject = (key, value) => {
    updateItem(key, value)
    // find where key is the same and overwrite it
    let update = timers.filter(todo => {
      if (todo[0] === key) {
        todo[1] = value
        return todo
      }
    })
    console.log('STATE - updated : ', update)
    console.log('STATE - Projects : ', timers)
    // setJournalEntry([...timers, update[1].text = editvalue.input])
  }

  const deleteProject = id => {
    removeItem(id)
    setTimers(
      timers.filter(todo => {
        if (todo[0] !== id) {
          return true;
        }
      })
    );
  }

  const getProjectbyName = (name) => {
    let filtered = projects.filter(project => name === project[1].name ? project : false)
    console.log(filtered)
    return filtered
  }

  const getProjectColors = (name) => {
    projects.map(project => {
      if (name === project[1].name) {
        // console.log(project[1].color)
        return project[1].color
      }
    })
  }

  const convertDate = (unixtimestamp) => {

    // Months array
    var months_arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Convert timestamp to milliseconds
    var date = new Date(unixtimestamp * 1000);

    // Year
    var year = date.getFullYear();

    // Month
    var month = months_arr[date.getMonth()];

    // Day
    var day = date.getDate();

    // Hours
    var hours = date.getHours();

    // Minutes
    var minutes = "0" + date.getMinutes();

    // Seconds
    var seconds = "0" + date.getSeconds();

    // Display date time in MM-dd-yyyy h:m:s format
    var convdataTime = month + '-' + day + '-' + year + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return convdataTime

  }

  useEffect(() => {

    timers.map((item) => {
      // projects.map(project => {
      //   if (item[1].project === project[1].name) {
      //     console.log(project[1].color)
      //     return project[1].color
      //   }
      //   else {
      //     return 'black'
      //   }
      // })
      let colors = getProjectColors(item[1].project)
      console.log(colors)
    })
  }, [projects])
  return (
    <View style={styles.container}>

      <View style={styles.addButton}>
        <Button
          title='New Entry'
          onPress={() => navigation.navigate('Timer', { name: '', color: '' })}
        />
      </View>
      <ScrollView style={{ width: '100%' }}>
        {
          timers.map((item, i) =>
            (<Timeline
              key={item[0]}
              date={item[1].created}
              color={getProjectColors(item[1].project)}
              project={item[1].project}
              start={item[1].start}
              stop={item[1].stop}
              deleteTimer={() => deleteProject(item[0])}
              onPress={() => navigation.navigate('Timer', {
                projectName: projectName,
                otherParam: 'anything you want here',
              })}
            />)
          )
        }
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