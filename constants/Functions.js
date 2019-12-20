import { isDate, differenceInSeconds, compareAsc, isToday, isYesterday } from 'date-fns'
import { timerValid } from '../constants/Validators'

// TIME FUNCTIONS
export const dateCreator = () => {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return date + ' ' + time;
}
export const secondsToString = seconds => new Date(seconds * 1000).toISOString().substr(11, 8) // hh: mm : ss
export const simpleDate = date => date.getDate() + " " + date.toLocaleString('default', { month: 'long' }) + " " + date.getFullYear()
export const sortbydate = () => timers.sort((a, b) => new Date(b[1].created) - new Date(a[1].created))
export const listDay = () => timers.map(timer => new Date(timer[1].created))
export const timeRules = (created, ended) => compareAsc(created, ended) === 1 ? false : true
export const timeString = date => isDate(date) ? date.toTimeString().split(' ')[0] : date
export const totalTime = (start, end) => differenceInSeconds(new Date(end), new Date(start))
export const timeSpan = (start, end) => timeString(new Date(start)) + ' - ' + timeString(new Date(end))
export const totalOver = (start, end) => Math.sign(end) === -1 ? start + end : 0
export const totalProjectTime = timers => timers.reduce((acc, timer) => acc + timer.total)
export const sayDay = date => isToday(date) ? 'Today' : isYesterday(date) ? 'Yesterday' : date

// TODO:
export const sayRunning = timer => timer[1].ended === timer[1].created ? 'running' : timer[1].ended
export const showCountInline = timer => {
    let value = differenceInSeconds(new Date(timer[1].created), new Date())
    // need timer 'ticking' functions to be global
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
            //console.log(pagename + '- FIRST OUTPUT ENTRY :', timerday)
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
    //console.log(pagename + '- DAYHEADERS - OUTPUT', output)
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
                projects.push({ project: timer[1].project, totals: [timer[1].total], total: timer[1].total })
            }
            const match = projects.find(inProjects => inProjects.project === timer[1].project)
            if (match) {
                match.totals = [...match.totals, timer[1].total]
                match.total = match.totals.reduce((acc, val) => acc + val) // sum the totals
            }
            else {
                projects.push({ project: timer[1].project, totals: [timer[1].total], total: timer[1].total })
            }

        })
        // console.log({title: day.title , data : projects})

        return { title: day.title, data: projects }
    })

}