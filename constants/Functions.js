import { AsyncStorage } from 'react-native';


/**
 * Get all values from AsyncStorage
 * @param {boolean} validator (value) critera for values to pass
 * @param {function} state (entry) the state to update upon validation
 */
export const getAll = async (validator, state) => {
    console.log('ASYNC STORAGE - getting all entries... ')
    const keys = await AsyncStorage.getAllKeys()
    console.info('ASYNC STORAGE - KEYS :', keys)
    const stores = await AsyncStorage.multiGet(keys)
    stores.map((result, i, store) => {
        let key = result[0]
        let value = result[1]
        if (typeof value === 'string' && value.charAt(0) === '{') {
            let value = JSON.parse(result[1])
            if( validator(value) === true) {
                let entry = [key, value]
                console.log('ASYNC STORAGE - ADDING TO STATE : ', result)
                state(entry)
            } 
            else {
                console.info('ASYNC STORAGE - INVALID ENTRY: ', result)
            }
        }
        else {
            console.info('ASYNC STORAGE - INVALID ENTRY: ', result)
        }
    });
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
        console.log('ASYNC STORAGE - STORING : [' + key + ' , ' + value + ']')
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
        console.log('ASYNC STORAGE - UPDATING: ', [key, value])
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
        console.log('ASYNC STORAGE - REMOVING : ' + key)
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
        console.log('ASYNC STORAGE - REMOVING ALL')
        state([])
        await AsyncStorage.clear()
    } catch (error) {
        console.error(error)
    }
}