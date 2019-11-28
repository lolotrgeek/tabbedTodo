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
import EntryList from '../components/entryList';

export default function JournalScreen() {

  const [inputvalue, setValue] = useState(''); // state of text input
  const [journalEntries, setJournalEntry] = useState([]); // state of journalEntries list


  useEffect(() => {
    getAll(value => value.type === 'journal' ? true : false, entry => setJournalEntry(journalEntries => [...journalEntries, entry]))
  }, [])

  const addEntry = () => {
    if (inputvalue.length > 0) {
      const NEWKEY = Date.now().toString()
      const NEWVALUE = { type :'journal', text: inputvalue}
      const NEWENTRY = [NEWKEY, NEWVALUE]
      storeItem(NEWKEY, NEWVALUE)
      setJournalEntry([...journalEntries, NEWENTRY]); // add todo to state
      setValue(''); // reset value of input to empty
    }
  }

  const updateEntry = (key, value) => {
    updateItem(key, value)
    // find where key is the same and overwrite it
    let update = journalEntries.filter(todo => {
      if (todo[0] === key) {
        todo[1] = value
        return todo
      }
    })
    console.log('STATE - updated : ', update)
    console.log('STATE - journalEntries : ', journalEntries)
    // setJournalEntry([...journalEntries, update[1].text = editvalue.input])
  }

  const deleteEntry = id => {
    removeItem(id)
    setJournalEntry(
      journalEntries.filter(todo => {
        if (todo[0] !== id) {
          return true;
        }
      })
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Journal Entries</Text>
      <View style={styles.textInputContainer}>
        <TextInput
          style={styles.textInput}
          multiline={false}
          placeholder="What do you want to enter?"
          placeholderTextColor="#abbabb"
          value={inputvalue}
          onChangeText={inputvalue => setValue(inputvalue)}
        />
        <TouchableOpacity onPress={() => addEntry()}>
          <Icon name="plus" size={30} color="blue" style={{ marginLeft: 10 }} />
        </TouchableOpacity>
      </View>
      <ScrollView style={{ width: '100%' }}>
        {journalEntries.map((item, i) =>
          (<EntryList
            text={item[1].text }
            key={item[0]}
            deleteEntry={() => deleteEntry(item[0])}
          />)
        )}
      </ScrollView>
      <TouchableOpacity onPress={() => removeAll(setJournalEntry)}>
        <Icon name="minus" size={40} color="red" style={{ marginLeft: 10 }} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => getAll()}>
        <Icon name="plus" size={40} color="blue" style={{ marginLeft: 10 }} />
      </TouchableOpacity>
    </View>
  )
}



JournalScreen.navigationOptions = {
  title: 'Journal',
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