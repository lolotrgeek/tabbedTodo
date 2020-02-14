import React, { useState, useEffect, useRef } from 'react'
import { Text, View, SafeAreaView, Button } from 'react-native'
import useAsync from 'react-use/lib/useAsync';
// import { getAll, storeItem, updateItem, removeAll } from '../constants/Store'
import { getAll, storeItem, updateItem, removeAll, multiGet } from '../constants/Gun'
import { styles } from '../constants/Styles'

export default function StartScreen({ navigation }) {
    useEffect(() => navigation.setOptions({ title: 'Start' }), [])
    const [items, setItems] = useState([])

    const setEntryState = async () => await multiGet()



    useEffect(() => {
        const timer = setInterval(async () => {
            if (items.length > 0) clearInterval(timer)
            
            let Items = await setEntryState()
            setItems(Items)
            console.log(items)
            console.log(items.length)
        }, 1000); 
        return () => clearInterval(timer);
    }, []);

    // useAsync(async () => {
    //     setItems(['hello'])
    // }, [])

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
            <View style={{ width: '100%' }}>
                {items.map(item => {
                    if (Array.isArray(item)) {
                        return (
                            <View key={item[0]}>
                                <Text >{item[0]}</Text>
                                <Text>{item[1] ? item[1].type : 'null'}</Text>
                            </View>
                        )
                    }
                    else {
                        return (<Text key={item + Date.now()}>{item}</Text>)
                    }

                })}
            </View>
        </SafeAreaView >
    )
}