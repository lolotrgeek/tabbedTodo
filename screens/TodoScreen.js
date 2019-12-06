import React, {useState, useEffect } from 'react';
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

import {getAll, storeItem, updateItem, removeItem, removeAll} from '../constants/Store'

import Icon from 'react-native-vector-icons/Feather';
import TodoList from '../components/TodoList';
import { arrayExpression } from '@babel/types';

export default function TodoScreen({route, navigation}) {

  const [inputvalue, setValue] = useState(''); // state of text input
  const [editvalue, setEditValue] = useState([]); // state of list item input
  const [todos, setTodos] = useState([]); // state of todo list

  useEffect(() => {
    getAll( value => value.type === 'todo' ? true : false, entry => setTodos(todos => [...todos, entry]))
  }, []) // [] makes useEffect run once!
  // https://css-tricks.com/run-useeffect-only-once/


  const addTodo = () => {
    if (inputvalue.length > 0) {
      const NEWKEY = Date.now().toString()
      const NEWVALUE = { type : 'todo', text: inputvalue, checked: false }
      const NEWENTRY = [NEWKEY, NEWVALUE]
      storeItem(NEWKEY, NEWVALUE)
      setTodos([...todos, NEWENTRY]); // add todo to state
      setValue(''); // reset value of input to empty
    }
  }

  const checkTodo = id => {
    setTodos(
      todos.map(todo => {
        if (todo[0] === id) {
          todo[1].checked = !todo[1].checked;
          updateItem(todo[0], { type : 'todo', text: todo[1].text, checked: todo[1].checked })
        }
        return todo;
      })
    );
  }

  const updateTodo = (key, value) => {
    updateItem(key, value)
    // find where key is the same and overwrite it
    let update = todos.filter(todo => {
      if (todo[0] === key) {
        todo[1] = value
        return todo
      }
    })
    console.log('STATE - updated : ', update)
    console.log('STATE - todos : ', todos)
    // setTodos([...todos, update[1].text = editvalue.input])
  }

  const todoState = id => {
    // console.log('STATE- editvalue : ' , editvalue)
    if (editvalue.id && editvalue.id === id) return true
  }

  const deleteTodo = id => {
    removeItem(id) // remove from async storage
    setTodos(
      // filter from todo state
      todos.filter(todo => {
        if (todo[0] !== id) {
          return true;
        }
      })
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Todo List</Text>
      <Button
        title="Go Home"
        onPress={() => navigation.navigate('Projects')}
      />
      <View style={styles.textInputContainer}>
        <TextInput
          style={styles.textInput}
          multiline={false}
          placeholder="What do you want to do today?"
          placeholderTextColor="#abbabb"
          value={inputvalue}
          onChangeText={inputvalue => setValue(inputvalue)}
        />
        <TouchableOpacity onPress={() => addTodo()}>
          <Icon name="plus" size={30} color="blue" style={{ marginLeft: 10 }} />
        </TouchableOpacity>
      </View>
      <ScrollView style={{ width: '100%' }}>
        {todos.map((item, i) =>
          (<TodoList
            value={!todoState(item[0]) ? item[1].text : editvalue.input}
            key={item[0]}
            checked={item[1].checked}
            onChangeText={input => setEditValue({ id: item[0], input: input })}
            setChecked={() => checkTodo(item[0])}
            updateTodo={() => updateTodo(item[0], { text: editvalue.input, checked: item[1].checked })}
            deleteTodo={() => deleteTodo(item[0])}
            onFocus={() => setEditValue({ id: item[0], input: item[1].text })}
          />)
        )}
      </ScrollView>
      <TouchableOpacity onPress={() => removeAll (setTodos)}>
        <Icon name="minus" size={40} color="red" style={{ marginLeft: 10 }} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => getAll()}>
        <Icon name="plus" size={40} color="blue" style={{ marginLeft: 10 }} />
      </TouchableOpacity>
    </View>
  )
}



TodoScreen.navigationOptions = {
  title: 'Todos',
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