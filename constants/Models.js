import Hashids from 'hashids'

export const newTimerValue = (project) => ({
    created: new Date().toString(),
    ended: new Date().toString(),
    type: 'timer',
    project: project[0],
    status: 'running',
    total: 0,
    mood: 'good',
    energy: 50,
})

export const newTimer = ({project, value}) => {
    const hashids = new Hashids()
    let key = hashids.encode(Date.now().toString())
    let new_value = value ? value : newTimerValue(project)
    return [key, new_value]
}

export const updateTimer = (timer, { count, created, ended, energy, mood }) => {
    let updated = {
        created: created ? created.toString() : timer[1].created,
        ended: ended ? ended.toString() : new Date().toString(),
        energy: energy ? energy : timer[1].energy,
        mood: mood ? mood : timer[1].mood,
        total: count ? count : timer[1].total,
        status: 'done',
    }
    return [timer[0], updated]
}

export const newProject = (name, color, time) => {
    const hashids = new Hashids()
    const key = hashids.encode(Date.now().toString())
    const value = {
        created: new Date().toString(),
        type: 'project',
        name: name,
        color: color,
        time: typeof time === 'string' && time.length > 0 ? parseInt(time) : time
    }
    return [key, value]
}

export const updateProject = (key, created, name, color, time) => {
    const value = {
        created: created,
        type: 'project',
        name: name,
        color: color,
        time: typeof time === 'string' && time.length > 0 ? parseInt(time) : time
    }
    return [key, value]
}

export const navigation = (project, running, lastscreen) => ({
    project: project,
    running: running,
    lastscreen: lastscreen
})