import React from 'react';
import { StyleSheet, View, Text, Button, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export function Timeline(props) {
    return (
        <View style={styles.listContainer}>
            <View>
                <Text
                    onPress={props.onEdit ? props.onEdit : ''}
                    style={{
                        paddingBottom: 20,
                        marginTop: 6,
                        fontSize: 15,
                        fontWeight: 'bold',
                        color: props.color,
                    }}
                    onPress={props.onPress}
                >
                    {props.project} - Total : {props.total}  ({props.date})
                </Text>
                {/* <Button title="Edit" onPress={props.onEdit ? props.onEdit : ''} /> */}
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    counter: {
        marginTop: '15%',
        fontSize: 40,
        color: 'black',
        paddingBottom: 10
    },
    listContainer: {
        marginTop: '5%',
        flexDirection: 'row',
        width: '100%',
        alignItems: 'flex-start',
        padding: 10
    },
});