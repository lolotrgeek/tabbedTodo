// https://github.com/parse-community/parse-server
// https://github.com/parse-community/Parse-SDK-JS

import * as Parse from 'parse/react-native'
import { AsyncStorage } from 'react-native'

const APPID = "APPLICATION_ID"
const SERVERURL = "http://localhost:1337/parse"


export function initParse() {
    Parse.setAsyncStorage(AsyncStorage)
    Parse.initialize(APPID)
    Parse.serverURL = SERVERURL
}
initParse()

export const newItem = () => {
    const newItem = Parse.Object.extend("Item")
    return new newItem()
}

export function storeItem(item) {
    const Item = newItem()
    Item.set(item[0], item[1])
    Item.save()
        .then((storedItem) => {
            console.warn('New object created with objectId: ' + storedItem);
        }, (error) => {
            console.warn('Failed to create new object, with error code: ' + error.message);
        })
}

export function getItem(item) {
    const Item = newItem()
    const query = new Parse.Query(Item);
    query.get(item[0])
        .then((retrievedItem) => {
            console.log(retrievedItem)
            return retrievedItem
        }, (error) => {
            console.warn('The object was not retrieved, with error code: ' + error.message);
        })
}

export function removeItem(item) {
    const Item = newItem()
    Item.unset(item[0])
    Item.save()
        .then((removedItem) => {
            console.warn('New object created with objectId: ' + removedItem);
        }, (error) => {
            console.warn('Failed to create new object, with error code: ' + error.message);
        })
}
export function updateItem(item) {
    return storeItem(item)
}

export function getEntry(item) {
    return getItem(item)
}

export const storeMap = (result, validator) => {
    let key = result[0]
    let value = result[1]
    if (!key || key === 'undefined') {
        //console.info('ASYNC STORAGE - INVALID KEY : ', key) 
        return false
    }
    if (!value || value === 'undefined') {
        //console.info('ASYNC STORAGE - INVALID VALUE : ', value)
        return false
    }
    if (typeof value === 'string' && value.charAt(0) === '{') {
        let value = JSON.parse(result[1])
        if (validator(value) === true) {
            let entry = [key, value]
            //console.info('ASYNC STORAGE - ADDING TO STATE : ', entry)
            return entry
        }
        else {
            //console.info('ASYNC STORAGE - INVALID ENTRY TYPE: ', result)
            return false
        }
    }
    else {
        //console.info('ASYNC STORAGE - INVALID ENTRY STRING: ', result)
        return false
    }
}

/**
 * Get all entries from Parse
 * @param {boolean} validator (key, value) critera for each entry to pass
 */
export const getAll = async (validator) => {
    const Item = newItem()
    const query = new Parse.Query(Item)
    query.find().then((results) => {
        console.log(results)
        return results.map(result => storeMap(result, validator)).filter(result => result)
    })
}