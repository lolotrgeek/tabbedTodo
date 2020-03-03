import React, { useState, useEffect, useRef } from 'react'
import { Text, View, SafeAreaView, Button } from 'react-native'
import useAsync from 'react-use/lib/useAsync';
import { removeAll } from '../constants/Store'
import { multiGetAll, multiGet } from '../constants/Gun'
import { styles } from '../constants/Styles'

// TODO : useAsyncRetry
// https://github.com/streamich/react-use/blob/master/docs/useAsyncRetry.md

export default function StartScreen({ navigation }) {
    useEffect(() => navigation.setOptions({ title: 'Start' }), [])
    const [items, setItems] = useState([])
    const getter = useRef(false)
    let i = useRef(0)

    const setEntryState = async () => {
        try {
            const Items = await multiGet()
            setItems(Items)
        } catch (error) {
            console.warn(error)
        }
    }

    useEffect(() => {
        getter.current = setInterval(async () => {
            const Items = await multiGet()
            console.log('Items', Items)
            setItems(Items)
            i.current++
            console.log(i.current)
        }, 1000)
        return () => clearInterval(getter.current)
    }, [])

    useEffect(() => {
        if (items.length > 0 || i.current > 10) clearInterval(getter.current)
    })


    return (
        <SafeAreaView style={styles.container}>
            <Button title="Projects" onPress={() => navigation.navigate('Projects', {
                lastscreen: 'Start'
            })} />
            <Button title="Timeline" onPress={() => navigation.navigate('Timeline', {
                lastscreen: 'Start'
            })} />
            <Button title="Load Items" onPress={async () => await setEntryState()} />
            <Button title="Clear Items" onPress={async () => await setItems([])} />
            <Button title="Delete Items" onPress={async () => await removeAll()} />
            <View style={{ width: '100%' }}>
                {items.map(item => {
                    if (Array.isArray(item)) {
                        return (
                            <View key={item[0]}>
                                <Text >{item[0]}</Text>
                                <Text>{item[1] ? JSON.stringify(item[1]) : 'null'}</Text>
                            </View>
                        )
                    }
                    else {
                        return (<Text key={Date.now()}>{JSON.stringify(item)}</Text>)
                    }

                })}
            </View>
        </SafeAreaView >
    )
}