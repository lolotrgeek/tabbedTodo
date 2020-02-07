// sync data between device and server
// server represents source of truth
// use DAG to store item changes
// data is immutable, changes are added to graph
// [id, [{item}, {item}, ...]]
// LIFO - last in first out
import { DeepstreamClient } from '@deepstream/client'

export function initDeepStream() {
    const client = new DeepstreamClient('localhost:6020')
    client.login()
}

export function testDeepStream() {
    const record = client.record.getRecord('some-name')
    record.set('name', 'lolotrgeek')
}

