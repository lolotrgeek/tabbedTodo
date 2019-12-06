import { storeItem, updateItem, removeItem, removeAll } from '../constants/Functions'


const todoValue = { type: 'todo', text: inputvalue, checked: false }
const journalValue = { type: 'journal', project: project, text: inputvalue }

const add = (VALUE) => {

    const NEWKEY = Date.now().toString()
    const NEWENTRY = [NEWKEY, NEWVALUE]
    storeItem(NEWKEY, NEWVALUE)
    setProject([...projects, NEWENTRY]); // list of Entries
    setValue(''); // input value for a text input

}

const updateProject = (key, value) => {
    updateItem(key, value)
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

const addTimer = (start) => {
    const NEWKEY = Date.now().toString()
    const NEWVALUE = {
        type: 'timer',
        project: projectName,
        start: start,
        stop: count,
    }
    const NEWENTRY = [NEWKEY, NEWVALUE]
    console.log(NEWVALUE)
    storeItem(NEWKEY, NEWVALUE)
    setCurrentTimer(NEWENTRY)
}

const updateTimer = (key, count) => {
    let value = {
        type: 'timer',
        project: projectName,
        start: initialValue,
        stop: count,
    }
    setCurrentTimer([key, value])
    updateItem(key, value)
}


const addTodo = () => {
    if (inputvalue.length > 0) {
        const NEWKEY = Date.now().toString()
        const NEWVALUE = { type: 'todo', text: inputvalue, checked: false }
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
                updateItem(todo[0], { type: 'todo', text: todo[1].text, checked: todo[1].checked })
            }
            return todo;
        })
    );
}

const stateFilter = (key, state) => state[0] === key ? true : false

const deleteEntry = (key, states, setState) => {
    removeItem(key)
    setState(states.filter(state => stateFilter(key, state) ? false : true))
}

const updateEntry = (key, value, states) => {
    updateItem(key, value)
    let update = states.filter(state => {
        if (stateFilter(key, state)) 
        state[1] = value 
        return state
        
    }) 
    console.log('STATE - UPDATING : ', update)
    console.log('STATE : ', states)
}

