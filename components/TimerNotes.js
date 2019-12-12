import React from 'react';
import { StyleSheet, View, Text, Button, TextInput } from 'react-native';
// import Slider from '@react-native-community/slider';
import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import { FontAwesome5 } from '@expo/vector-icons'

//https://material-ui.com/components/slider/

const useStyles = makeStyles(theme => ({
    root: {
        width: 300 + theme.spacing(3) * 2,
    },
    margin: {
        height: theme.spacing(3),
    },
}));

function ValueLabelComponent(props) {
    const { children, open, value } = props;

    const popperRef = React.useRef(null);

    React.useEffect(() => {
        if (popperRef.current) {
            popperRef.current.update();
        }
    });

    return (
        <Tooltip
            PopperProps={{
                popperRef,
            }}
            open={open}
            enterTouchDelay={0}
            placement="top"
            title={value}
        >
            {children}
        </Tooltip>
    );
}
ValueLabelComponent.propTypes = {
    children: PropTypes.element.isRequired,
    open: PropTypes.bool.isRequired,
    value: PropTypes.number.isRequired,
};

const PrettoSlider = withStyles({
    root: {
        color: '#52af77',
        height: 8,
    },
    thumb: {
        height: 24,
        width: 24,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        marginTop: -8,
        marginLeft: -12,
        '&:focus,&:hover,&$active': {
            boxShadow: 'inherit',
        },
    },
    active: {},
    valueLabel: {
        left: 'calc(-50% + 4px)',
    },
    track: {
        height: 8,
        borderRadius: 4,
    },
    rail: {
        height: 8,
        borderRadius: 4,
    },
})(Slider);

export function TimerStopNotes(props) {
    const classes = useStyles();
    return (
        <View style={styles.container}>
            <View style={styles.listContainer}>
                <FontAwesome5
                    name="grin"
                    color="orange"
                    style={{
                        paddingBottom: '10%',
                        marginTop: '10%',
                        fontWeight: props.selected === 'great' ? 'bold': 'normal',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        fontSize: props.selected === 'great' ? 60 : 40
                    }}
                    onPress={props.onGreat}
                />
                <FontAwesome5
                    name="smile"
                    size={40}
                    color="green"
                    style={{
                        paddingBottom: '10%',
                        marginTop: '10%',
                        fontWeight: props.selected === 'good' ? 'bold': 'normal',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        fontSize: props.selected === 'good' ? 60 : 40
                    }}
                    onPress={props.onGood}
                />
                <FontAwesome5
                    name="meh"
                    size={40}
                    color="purple"
                    style={{
                        paddingBottom: '10%',
                        marginTop: '10%',
                        fontWeight: props.selected === 'meh' ? 'bold': 'normal',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        fontSize: props.selected === 'meh' ? 60 : 40
                    }}
                    onPress={props.onMeh}
                />
                <FontAwesome5
                    name="frown"
                    size={40}
                    color="blue"
                    style={{
                        paddingBottom: '10%',
                        marginTop: '10%',
                        fontWeight: props.selected === 'bad' ? 'bold': 'normal',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        fontSize: props.selected === 'bad' ? 60 : 40
                    }}
                    onPress={props.onSad}
                />
                <FontAwesome5
                    name="dizzy"
                    size={40}
                    color="grey"
                    style={{
                        paddingBottom: '10%',
                        marginTop: '10%',
                        fontWeight: props.selected === 'awful' ? 'bold': 'normal',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        fontSize: props.selected === 'awful' ? 60 : 40
                    }}
                    onPress={props.onAwful}
                />
            </View >
            <View >
                <Text style={styles.subheader}>Set Energy Level</Text>
                <PrettoSlider
                    valueLabelDisplay="auto"
                    aria-label="pretto slider"
                    defaultValue={props.startingEnergy}
                    onChangeCommitted={props.onEnergySet}
                />
            </View>
        </View>

    );
}

export function TimerStartNotes(props) {
    return (
        <View>
            <TextInput
                style={styles.listItem}
                multiline={false}
                placeholder="Motivation"
                placeholderTextColor="#abbabb"
                value={props.mood}
                editable={true}
                onChangeText={props.onChangeText}
                onFocus={props.onFocus}
            />
        </View >
    );
}
const styles = StyleSheet.create({
    header: {
        marginTop: '15%',
        fontSize: 40,
        color: 'black',
        paddingBottom: 10
    },
    subheader: {
        fontSize: 20,
        color: 'black',
        alignContent: 'center',
        marginLeft: 'auto',
        marginRight: 'auto'

    },
    container: {
        width: '80%',
        alignContent: 'center'
    },
    listContainer: {
        marginTop: '5%',
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        alignContent: 'center',
        minHeight: 60,
    },
    listItem: {
        paddingBottom: '10%',
        marginTop: '10%',
        fontWeight: 'bold',
        marginLeft: 'auto',
        marginRight: 'auto',
    }
});