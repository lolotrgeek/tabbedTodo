import React, { useState, useEffect } from 'react'
import { Text, View, SafeAreaView, SectionList, Button } from 'react-native'
import useAsync from 'react-use/lib/useAsync';
// import { getAll, storeItem, updateItem, removeAll } from '../constants/Store'
import { getAll, storeItem, updateItem, removeAll, multiGet } from '../constants/Gun'
import { styles } from '../constants/Styles'
import { set } from 'date-fns';

export default function StartScreen({ navigation }) {
    useEffect(() => navigation.setOptions({ title: 'Start' }), [])
    const [items, setItems] = useState([])

    const setEntryState = async () => {
        try {
            const Items = await multiGet()
            setItems(Items)
        } catch (error) {
            console.warn(error)
        }

    }

    useEffect(() => {
        setEntryState()

    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <Button title="Projects" onPress={() => navigation.navigate('Projects', {
                lastscreen: 'Start'
            })} />
            <Button title="Timeline" onPress={() => navigation.navigate('Timeline', {
                lastscreen: 'Start'
            })} />
            <Button title="Load Items" onPress={async () => await setEntryState()} />
            <View style={{ width: '100%' }}>
                {items.map(item => {
                    return (
                        <View key={item[0]}>
                            <Text >{item[0]}</Text>
                            <Text>{item[1] ? item[1].type : 'null'}</Text>
                        </View>
                    )
                })}
            </View>
        </SafeAreaView >
    )
}