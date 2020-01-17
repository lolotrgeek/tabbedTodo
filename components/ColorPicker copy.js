import React, { Component, PureComponent } from 'react'
import { View, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import map from 'lodash/map'
import debounce from 'lodash/debounce'
import * as material from 'material-colors'
import * as checkboard from '../constants/Helpers'
import color from './helpers/color'


export const handleFocus = (Component, Span = 'span') =>
    class Focus extends React.Component {
        state = { focus: false }
        handleFocus = () => this.setState({ focus: true })
        handleBlur = () => this.setState({ focus: false })

        render() {
            return (
                <View onFocus={this.handleFocus} onBlur={this.handleBlur}>
                    <Component {...this.props} {...this.state} />
                </View>
            )
        }
    }


export const ColorWrap = (Picker) => {
    class ColorPicker extends (PureComponent || Component) {
        constructor(props) {
            super()

            this.state = {
                ...color.toState(props.color, 0),
            }

            this.debounce = debounce((fn, data, event) => {
                fn(data, event)
            }, 100)
        }

        // componentWillReceiveProps(nextProps) {
        //   this.setState({
        //     ...color.toState(nextProps.color, this.state.oldHue),
        //   })
        // }

        handleChange = (data, event) => {
            const isValidColor = color.simpleCheckForValidColor(data)
            if (isValidColor) {
                const colors = color.toState(data, data.h || this.state.oldHue)
                this.setState(colors)
                this.props.onChangeComplete && this.debounce(this.props.onChangeComplete, colors, event)
                this.props.onChange && this.props.onChange(colors, event)
            }
        }

        handleSwatchHover = (data, event) => {
            const isValidColor = color.simpleCheckForValidColor(data)
            if (isValidColor) {
                const colors = color.toState(data, data.h || this.state.oldHue)
                this.props.onSwatchHover && this.props.onSwatchHover(colors, event)
            }
        }

        render() {
            const optionalEvents = {}
            if (this.props.onSwatchHover) {
                optionalEvents.onSwatchHover = this.handleSwatchHover
            }

            return (
                <Picker
                    {...this.props}
                    {...this.state}
                    onChange={this.handleChange}
                    {...optionalEvents}
                />
            )
        }
    }

    ColorPicker.propTypes = {
        ...Picker.propTypes,
    }

    ColorPicker.defaultProps = {
        ...Picker.defaultProps,
        color: {
            h: 250,
            s: 0.50,
            l: 0.20,
            a: 1,
        },
    }

    return ColorPicker
}

export const Checkboard = ({ white, grey, size, renderers, borderRadius, boxShadow }) => {
    const styles = StyleSheet.create({
        grid: {
            borderRadius: borderRadius,
            // background: `url(${checkboard.get(white, grey, size, renderers.canvas)}) center left`,
        }
    })

    return (
        <View style={styles.grid} />
    )
}

Checkboard.defaultProps = {
    size: 8,
    white: 'transparent',
    grey: 'rgba(0,0,0,.08)',
    renderers: {},
}

const ENTER = 13

export const Swatch = ({ color, style, onClick = () => { }, onHover, title = color,
    children, focus, focusStyle = {} }) => {
    const transparent = color === 'transparent'
    const styles = StyleSheet.create({
        swatch: {
            backgroundColor: color,
            height: '100%',
            width: '100%',
            position: 'relative',
        },
    })

    const handleClick = e => onClick(color, e)
    const handleHover = e => onHover(color, e)

    const optionalEvents = {}
    if (onHover) {
        optionalEvents.onMouseOver = handleHover
    }

    return (
        <View
            style={styles.swatch}
            title={title}
            tabIndex={0}
            {...optionalEvents}
        >
            {children}
            {transparent && (
                <TouchableOpacity onPress={handleClick}>
                    <Checkboard
                        borderRadius={styles.swatch.borderRadius}
                    />
                </TouchableOpacity>
            )}

        </View>
    )
}

export const CircleSwatch = ({ color, onPress, onSwatchHover, hover, active,
    circleSize, circleSpacing }) => {
    const styles = StyleSheet.create({
        swatch: {
            width: circleSize,
            height: circleSize,
            marginRight: circleSpacing,
            marginBottom: circleSpacing,
        },
        Swatch: {
            borderRadius: circleSpacing,
            backgroundColor: 'transparent',
        },
    })

    return (
        <View style={styles.swatch}>
            <Swatch
                style={styles.Swatch}
                color={color}
                onPress={onPress}
            />
        </View>
    )
}

CircleSwatch.defaultProps = {
    circleSize: 28,
    circleSpacing: 14,
}

export const Circle = ({ width, onChange, onSwatchHover, colors, hex, circleSize,
    styles: passedStyles = {}, circleSpacing, className = '' }) => {
    const styles = StyleSheet.create({
        card: {
            width,
            display: 'flex',
            flexWrap: 'wrap',
            marginRight: -circleSpacing,
            marginBottom: -circleSpacing,
        },
    })
    const handleChange = (hexCode, e) => onChange({ hex: hexCode, source: 'hex' }, e)

    return (
        <View style={styles.card} className={`circle-picker ${className}`}>
            {map(colors, c => (
                <CircleSwatch
                    key={c}
                    color={c}
                    onClick={handleChange}
                    onSwatchHover={onSwatchHover}
                    active={hex === c.toLowerCase()}
                    circleSize={circleSize}
                    circleSpacing={circleSpacing}
                />
            ))}
        </View>
    )
}

Circle.propTypes = {
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    circleSize: PropTypes.number,
    circleSpacing: PropTypes.number,
    styles: PropTypes.object,
}

Circle.defaultProps = {
    width: 252,
    circleSize: 28,
    circleSpacing: 14,
    colors: [material.red['500'], material.pink['500'], material.purple['500'],
    material.deepPurple['500'], material.indigo['500'], material.blue['500'],
    material.lightBlue['500'], material.cyan['500'], material.teal['500'],
    material.green['500'], material.lightGreen['500'], material.lime['500'],
    material.yellow['500'], material.amber['500'], material.orange['500'],
    material.deepOrange['500'], material.brown['500'], material.blueGrey['500']],
    styles: {},
}

export default ColorWrap(Circle)