import { isDate, differenceInSeconds, compareAsc } from 'date-fns'

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
