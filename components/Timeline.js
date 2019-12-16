import React from 'react';
import { StyleSheet, View, Text, Button, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export function Timeline(props) {
    return (
        <View style={styles.listContainer}>
            <View style={{flex: 1, flexDirection: 'column', width:'50%',}}>
                <Text
                    style={{ color: props.color, fontSize: 20 }}
                    onPress={props.onPress}
                >
                    {props.project}
                </Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'column', width:'50%', }}>
                <Text
                    onPress={props.onEdit ? props.onEdit : ''}
                    style={styles.listItem}
                    onPress={props.onEdit}
                >
                    Total : {props.total}
                </Text>
                {/* <Button title="Edit" onPress={props.onEdit ? props.onEdit : ''} /> */}
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    listContainer: {
        flex:1,
        marginTop: '5%',
        flexDirection: 'row',
        width: '100%',
        alignItems: 'flex-start',
        padding: 10
    },
    listItem: {
        paddingBottom: 20,
        marginTop: 6,
        marginRight: 0,
        fontSize: 15,
        fontWeight: 'bold',
    }
});