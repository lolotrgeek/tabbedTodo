import Hashids from 'hashids'

export const keyGen = () => {
    const hashids = new Hashids()
    return hashids.encode(Date.now())
}
/**
 * Entry uses CRUD, data in entry uses DAG.
 * Entry is mutable, data is immutable.
 * @param {*} type 
 * @param {*} value 
 */
export const newEntry = (type, value) => [keyGen(), { type: type, data: [value] }]
export const entryMap = (entry) => {
    return {
        key: entry[0],
        type: entry[1].type,
        value: entry[1].data[entry[1].data.length - 1] // last value
        // value : entry[1].data.slice(-1)[0] // last value
    }
}

export const getValues = data => data.map((item, i) => {
    let value = item[1]
    console.log(value)
})


export const timerValue = projectkey => {
    return {
        created: new Date().toString(),
        ended: new Date().toString(),
        project: projectkey,
        status: 'running',
        mood: 'good',
        energy: 50,
    }
}

export const newTimer = (projectkey) => {
    newEntry('timer', timerValue(projectkey))
}

export const updateTimer = (key, value) => {

}

export const projectValue = (created, name, color, time) => {
    return {
        created: created,
        name: name,
        color: color,
        time: typeof time === 'string' && time.length > 0 ? parseInt(time) : time
    }
}


export const timerDone = (timer) => {
    timer[1].status = 'done'
    timer[1].ended = new Date().toString()
    timer[1].total = count
    console.log(timer[0], ' - Total Time : ', totalTime(timer[1].created))
    console.log(timer[0], ' - Updated : ', timer[1])
    return timer
}