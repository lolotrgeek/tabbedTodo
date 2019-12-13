import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

export default function NumPad(props) {
    return (
        <View style={styles.numPad}>
            <Grid container justify='center' alignItems="center" direction='row' spacing={0}>
                <Grid item lg={12} md={6}>
                    <ButtonGroup aria-label="full width outlined button group">
                        <TouchableOpacity onPress={props.onOne}><Button>1</Button></TouchableOpacity>
                        <TouchableOpacity onPress={props.onTwo}><Button >2</Button></TouchableOpacity>
                        <TouchableOpacity onPress={props.onThree}><Button >3</Button></TouchableOpacity>
                    </ButtonGroup>
                </Grid>
                <Grid item lg={12} md={6}>
                    <ButtonGroup aria-label="full width outlined button group">
                        <TouchableOpacity onPress={props.onFour}><Button >4</Button></TouchableOpacity>
                        <TouchableOpacity onPress={props.onFive}><Button >5</Button></TouchableOpacity>
                        <TouchableOpacity onPress={props.onSix}><Button >6</Button></TouchableOpacity>
                    </ButtonGroup>
                </Grid>
                <Grid item lg={12} md={6}>
                    <ButtonGroup aria-label="full width outlined button group">
                        <TouchableOpacity onPress={props.onSeven}><Button >7</Button></TouchableOpacity>
                        <TouchableOpacity onPress={props.onEight}><Button >8</Button></TouchableOpacity>
                        <TouchableOpacity onPress={props.onNine}><Button >9</Button></TouchableOpacity>
                    </ButtonGroup>
                </Grid>
                <Grid item lg={12} md={6}>
                    <ButtonGroup aria-label="full width outlined button group">
                        <TouchableOpacity onPress={props.onZero}><Button >0</Button></TouchableOpacity>
                        <TouchableOpacity onPress={props.onDel}><Button >Delete</Button></TouchableOpacity>
                    </ButtonGroup>
                </Grid>
            </Grid>
        </View>
    );
}

const styles = StyleSheet.create({
    numPad: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        padding: '5%'
      },
})