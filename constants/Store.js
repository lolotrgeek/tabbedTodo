import { AsyncStorage } from 'react-native';


export const countKeys = async () => await AsyncStorage.getAllKeys()

const storeMap = (result, validator) => {
    let key = result[0]
    let value = result[1]
    if (!key || key === 'undefined') {
        console.info('ASYNC STORAGE - INVALID KEY : ', key) 
        return false
    }
    if (!value || value === 'undefined') { 
        console.info('ASYNC STORAGE - INVALID VALUE : ', value)
        return false 
    }
    if (typeof value === 'string' && value.charAt(0) === '{') {
        let value = JSON.parse(result[1])
        if (validator(value) === true) {
            let entry = [key, value]
            console.info('ASYNC STORAGE - ADDING TO STATE : ', entry)
            return entry
        }
        else {
            console.info('ASYNC STORAGE - INVALID ENTRY: ', result)
            return false
        }
    }
    else {
        console.info('ASYNC STORAGE - INVALID ENTRY: ', result)
        return false
    }
}

/**
 * Get all entries from AsyncStorage
 * @param {boolean} validator (key, value) critera for each entry to pass
 */
export const getAll = async (validator) => {
    console.info('ASYNC STORAGE - getting all entries... ')
    const keys = await AsyncStorage.getAllKeys()
    console.info('ASYNC STORAGE - KEYS :', keys)
    const stores = await AsyncStorage.multiGet(keys)
    return stores.map(result => storeMap(result, validator)).filter(result => result)
}

const keyValueMap = (result, validator) => {
    let key = result[0]
    let value = result[1]
    if (!key || key === 'undefined') {
        console.info('ASYNC STORAGE - INVALID KEY : ', key) 
        return false
    }
    if (!value || value === 'undefined') { 
        console.info('ASYNC STORAGE - INVALID VALUE : ', value)
        return false 
    }
    if (typeof value === 'string' && value.charAt(0) === '{') {
        let value = JSON.parse(result[1])
        if (validator(key, value) === true) {
            let entry = [key, value]
            console.info('ASYNC STORAGE - VALID ENTRY : ', entry)
            return entry
        }
        else {
            console.info('ASYNC STORAGE - INVALID ENTRY: ', result)
            return false
        }
    }
    else {
        console.info('ASYNC STORAGE - INVALID ENTRY: ', result)
        return false
    }
}

export const getAllEntries = async (validator) => {
    console.info('ASYNC STORAGE - getting all entries... ')
    const keys = await AsyncStorage.getAllKeys()
    console.info('ASYNC STORAGE - KEYS :', keys)
    const stores = await AsyncStorage.multiGet(keys)
    return stores.map(result => keyValueMap(result, validator)).filter(result => result)
}

export const stringifyValue = value => {
    if (typeof value === 'object' || Array.isArray(value)) value = JSON.stringify(value)
    return value
}

/**
 * Add key value pair to Async Storage
 * @param {*} key 
 * @param {*} value 
 */
export const storeItem = async (key, value) => {
    if (typeof value === 'object' || Array.isArray(value)) value = JSON.stringify(value)
    try {
        console.info('ASYNC STORAGE - STORING : [' + key + ' , ' + value + ']')
        await AsyncStorage.setItem(key, value);
    } catch (error) {
        console.error(error)
    }
}

/**
 * Update existing key with given value in Async Storage
 * @param {*} key 
 * @param {*} value 
 */
export const updateItem = async (key, value) => {
    if (typeof value === 'object' || Array.isArray(value)) value = JSON.stringify(value)
    try {
        console.info('ASYNC STORAGE - UPDATING: ', [key, value])
        await AsyncStorage.mergeItem(key, value);
    } catch (error) {
        console.error(error)
    }
}

/**
 * Remove item by key in Async Storage
 * @param {*} key 
 */
export const removeItem = async key => {
    try {
        console.info('ASYNC STORAGE - REMOVING : ' + key)
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.error(error)
    }
}

/**
 *  Delete entire async Storage
 * @param {function} state
 */
export const removeAll = async state => {
    try {
        console.info('ASYNC STORAGE - REMOVING ALL')
        state([])
        await AsyncStorage.clear()
    } catch (error) {
        console.error(error)
    }
}