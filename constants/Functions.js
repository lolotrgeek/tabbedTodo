import { isSameDay, isDate, differenceInSeconds, startOfToday, differenceInDays, compareAsc, isToday, isYesterday, subSeconds, addSeconds, endOfDay, addMinutes, parseISO } from 'date-fns'

// TODO: REFACTOR SO FUNCTIONS DO NOT NEED ANY DATA STRUCTURE

// TIME FUNCTIONS
export const dateCreator = () => {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return date + ' ' + time;
}
export const secondsToString = seconds => new Date(seconds * 1000).toISOString().substr(11, 8) // hh: mm : ss
export const getMonth = date => date.toLocaleString('default', { month: 'long' })
export const simpleDate = date => getMonth(date)
export const sortbydate = () => timers.sort((a, b) => new Date(b[1].created) - new Date(a[1].created))
export const listDay = () => timers.map(timer => new Date(timer[1].created))
export const timeRules = (created, ended) => compareAsc(parseISO(created), parseISO(ended)) === 1 ? false : true
export const timeString = date => isDate(date) ? date.toTimeString().split(' ')[0] : date
export const totalTime = (start, end) => differenceInSeconds(new Date(end), new Date(start))
export const timeSpan = (start, end) => timeString(new Date(start)) + ' - ' + timeString(new Date(end))
export const totalOver = (start, end) => Math.sign(end) === -1 ? start + end : 0
export const totalProjectTime = timers => timers.reduce((acc, timer) => acc + timer.total)
export const sayDay = datestring => isToday(new Date(datestring)) ? 'Today' : isYesterday(new Date(datestring)) ? 'Yesterday' : datestring
export const formatTime = t => {
    if (t >= 0) return new Date(t * 1000).toISOString().substr(11, 8)  // hh : mm : ss
    else {
        t = Math.abs(t)
        t = t.toString()
        if (t.length === 0) return '00:00:00'
        if (t.length === 1) return '-00:00:0' + t.charAt(0)
        if (t.length === 2) return '-00:00:' + t.charAt(0) + t.charAt(1)
        if (t.length === 3) return '-00:0' + t.charAt(0) + ':' + t.charAt(1) + t.charAt(2)
        if (t.length === 4) return '-00:' + t.charAt(0) + t.charAt(1) + ':' + t.charAt(2) + t.charAt(3)
        if (t.length === 5) return '-0' + t.charAt(0) + ':' + t.charAt(1) + t.charAt(2) + ':' + t.charAt(3) + t.charAt(4)
        if (t.length > 5) return '-' + t.charAt(0) + t.charAt(1) + ':' + t.charAt(2) + t.charAt(3) + ':' + t.charAt(4) + t.charAt(5)
    }
}

// TIMER FUNCTIONS - WIP
export const sayRunning = timer => timer[1].ended === timer[1].created ? 'running' : timer[1].ended
export const isRunning = timer => timer[1].status === 'running' ? true : false
/**
 * Get amount of time since entry was created
 * @param {string} created datestring when entry was created
 */
export const elapsedTime = created => differenceInSeconds(new Date(), new Date(created))
// export const findRunning = async timers => new Promise((resolve, reject) => {
//     let found = timers.filter(timer => isRunning(timer) ? timer : false)
//     found.length > 0 ? resolve(found) : reject([])
// })
export const runningFind = async days => new Promise((resolve, reject) => {
    let found = days.map(day => day.data.filter(timers => isRunning(timers) ? timers : false))
    found.length > 0 ? resolve(found) : reject([])
})
export const findRunning = timers => {
    const foundRunning = timers.filter(timer => {
        if (timer[1].status === 'running') {
            return true
        } else {
            return false
        }
    })
    if (foundRunning && foundRunning.length === 1) {
        console.log('foundRunning : ', foundRunning[0])
        return foundRunning[0]
    }
    else if (foundRunning.length > 1) {
        console.log('foundRunning - multiple running :', foundRunning)
        foundRunning.map(found => found)
        return []
    }
    else {
        console.log('foundRunning - no valid : ', foundRunning)
        return []
    }
}

export const multiDay = (created, stopped) => {
    if (typeof created === 'string') created = new Date(created)
    if (typeof stopped === 'string') stopped = new Date(stopped)
    if (!stopped) stopped = new Date()
    return isSameDay(created, stopped) ? true : false
}

/**
 * Split a timer into one timer per day
 * @param {*} created 
 * @param {*} stopped
 */
export const newEntryPerDay = (created, stopped) => {
    if (typeof created === 'string') created = new Date(created)
    if (typeof stopped === 'string') stopped = new Date(stopped)
    if (!stopped) stopped = new Date()
    console.log(created, stopped)
    const secondsinday = 86400
    let totalSeconds = differenceInSeconds(stopped, created)
    console.log('total seconds', totalSeconds)
    // get whole days
    if (totalSeconds > secondsinday) {
        const output = []
        let daysfromseconds = totalSeconds / secondsinday
        let start = created
        while (daysfromseconds > 1) {
            console.log(daysfromseconds)
            let end = endOfDay(start)
            let day = { start: start.toString(), end: end.toString() }
            output.push(day)
            console.log(day)
            start = addSeconds(end, 1)
            totalSeconds = totalSeconds - secondsinday
            daysfromseconds = totalSeconds / secondsinday
            if (daysfromseconds < 1) {
                console.log(daysfromseconds)
                let end = endOfDay(start)
                let day = { start: start.toString(), end: end.toString()}
                output.push(day)
                console.log(day)
                let last = { start: startOfToday().toString(), end: 'running'}
                output.push(last)
                console.log(last)
                break
            }
        }
        return output
    } else {
        console.log('Entry Less than a day')
        return []
    }

}

// STYLE FUNCTIONS
export const moodMap = mood => {
    if (mood === '') return { name: 'times', color: 'black' }
    if (mood === 'great') return { name: 'grin', color: 'orange' }
    if (mood === 'good') return { name: 'smile', color: 'green' }
    if (mood === 'meh') return { name: 'meh', color: 'purple' }
    if (mood === 'bad') return { name: 'frown', color: 'blue' }
    if (mood === 'dizzy') return { name: 'awful', color: 'grey' }
}

// SORTING FUNCTIONS
/**
 * List all timers in each day
 * @param {*} timerlist 
 * @returns {Promise} [{title: day, data: [timer, ...]}, ...]
 */
export const dayHeaders = timerlist => new Promise((resolve, reject) => {
    const output = [] // [days...]
    // organize timers by day
    const timerdays = timerlist.map(timer => {
        return { day: simpleDate(new Date(timer[1].created)), timer: timer }
    })
    // //console.log(pagename + '- DAYHEADERS - TIMERDAYS : ', timerdays)
    timerdays.forEach(timerday => {
        // first value if output is empty is always unique
        if (output.length === 0) {
            // console.log('FIRST OUTPUT ENTRY :', timerday)
            output.push({ title: timerday.day, data: [timerday.timer] })
        }
        else {
            // find and compare timerdays to outputs
            const match = output.find(inOutput => inOutput.title === timerday.day)
            if (match) {
                //console.log(pagename + '- MATCHING ENTRY :', match.title)
                // add timer to list of timers for matching day
                match.data = [...match.data, timerday.timer]
            }
            else {
                //console.log(pagename + '- NEW OUTPUT ENTRY :', timerday)
                output.push({ title: timerday.day, data: [timerday.timer] })
            }
        }
    })
    // console.log('- DAYHEADERS - OUTPUT', output)
    if (output.length > 0) { resolve(output) }
    else { reject([]) }
})

/**
 * takes timers sorted by day and combines by project then sums total time 
 * @param {Array} dayheaders {title: day, data: [timer, ...]}
 */
export const sumProjectTimers = dayheaders => {
    return dayheaders.map(day => {
        // return array of days by project with timers summed
        let projects = []
        // for each day...
        day.data.map(timer => {
            // ... group timer entries by project
            if (projects.length === 0) {
                console.log('first timer: ', )
                // console.log('ticked : ',  timer[1].total, 'calculated : ', totalTime(timer[1].created, timer[1].ended))
                let total = totalTime(timer[1].created, timer[1].ended)
                projects.push({ project: timer[1].project, totals: [total], total: total, status: timer[1].status, timers : [timer[0]] })
            }
            // for each project get all timer entries and sum the totals
            const match = projects.find(inProjects => inProjects.project === timer[1].project)
            // console.log('projects : ', projects)
            if (match) {
                if (projects[0].timers[0] === timer[0]) {
                    console.log('existing match')
                } else {
                // console.log('ticked : ',  timer[1].total, 'calculated : ', totalTime(timer[1].created, timer[1].ended))
                let total = totalTime(timer[1].created, timer[1].ended)
                match.totals = [...match.totals, total]
                console.log('new match')
                match.total = match.totals.reduce((acc, val) => acc + val) // sum the totals
                }
            }
            else {
                console.log('last timer: ', timer[0])
                // console.log('ticked : ',  timer[1].total, 'calculated : ', totalTime(timer[1].created, timer[1].ended))
                let total = totalTime(timer[1].created, timer[1].ended)
                projects.push({ project: timer[1].project, totals: [total], total: total, status: timer[1].status })
            }
            console.log(projects)
        })
        // console.log({title: day.title , data : projects})

        return { title: day.title, data: projects }
    })

}