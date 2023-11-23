import React from 'react'
import { View, StyleSheet, Animated, Text } from 'react-native'
import Svg, { G, Circle } from 'react-native-svg'

const Chart = ({
    percentage,
    radius = 110,
    strokewidth = 25,
    duration = 400,
    color = 'green',
    delay = 10,
    text,
    max = 100
}) => {

    const AnimatedCircle = Animated.createAnimatedComponent(Circle)
    const animation = (toValue) => {
        return Animated.timing(animatedValue, {
            toValue,
            duration,
            delay,
            useNativeDriver: true
        }).start()
    }
    const animatedValue = React.useRef(new Animated.Value(0)).current
    const halfCircle = radius + strokewidth;
    const circleCircumference = 2 * Math.PI * radius
    const circleRef = React.useRef()
    React.useEffect(() => {
        animation(percentage)
        animatedValue.addListener((v) => {
            if (circleRef?.current) {
                const maxPerc = (100 * v.value) / max
                const strokeDashoffset = circleCircumference - (circleCircumference * maxPerc) / 100
                circleRef.current.setNativeProps({
                    strokeDashoffset
                })
            }
        })
    })
    return (
        <View style={styles.container}>
            <Svg width={radius * 2} height={radius * 2} viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}>
                <G rotation='-90' origin={`${halfCircle}, ${halfCircle}`}>
                    <Circle
                        cx='50%'
                        cy='50%'
                        stroke={color}
                        strokeWidth={strokewidth}
                        r={radius}
                        fill={"transparent"}
                        strokeOpacity={0.2}
                    />
                    <AnimatedCircle
                        ref={circleRef}
                        cx='50%'
                        cy='50%'
                        stroke={color}
                        strokeWidth={strokewidth}
                        r={radius}
                        fill={"transparent"}
                        strokeDasharray={circleCircumference}
                        strokeDashoffset={circleCircumference}
                        strokeLinecap='round'

                    />
                </G>
            </Svg>
            <View style={styles.textContainer}>
                <Text style={styles.text}>Số đơn</Text>
                <Text style={styles.text1}>{text}</Text>
            </View>
        </View>
    )
}

export default Chart

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    textContainer: {
        position: 'absolute',
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    text1: {
        fontSize: 48,
        fontWeight: 'bold',
        color: 'black',
        textAlign:'center'
    },
})