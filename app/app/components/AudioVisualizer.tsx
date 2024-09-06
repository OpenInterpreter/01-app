import React, { useEffect, useCallback } from "react"
import { ViewStyle, View, Animated } from "react-native"

export const AudioVisualizer = ({
  currentVolume,
  darkMode,
}: {
  currentVolume: number
  darkMode: boolean
}) => {
  const maxVolume = 50
  const animationRef = React.useRef(new Animated.Value(0)).current

  const startAnimations = useCallback(() => {
    Animated.timing(animationRef, {
      toValue: currentVolume / maxVolume,
      useNativeDriver: true,
      duration: 500,
    }).start()
  }, [animationRef, currentVolume])

  useEffect(() => {
    startAnimations()
  }, [startAnimations])

  const polAnim = animationRef.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2],
    extrapolate: "clamp",
  })

  return (
    <View style={$visualizerContainer}>
      <Animated.View
        style={[
          $ripler(darkMode),
          {
            transform: [{ scale: polAnim }],
          },
        ]}
      />
      <View style={$agentIcon(darkMode)}></View>
    </View>
  )
}

const $ripler = (isDarkMode: boolean): ViewStyle => ({
  height: 80,
  width: 80,
  borderRadius: 80,
  backgroundColor: isDarkMode ? "white" : "black",
  zIndex: 2,
})

const $visualizerContainer: ViewStyle = {
  height: 100,
  width: 100,
  justifyContent: "center",
  alignItems: "center",
}

const $agentIcon = (isDarkMode: boolean): ViewStyle => ({
  height: 110,
  width: 110,
  borderRadius: 110,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: isDarkMode ? "white" : "black",
  zIndex: 3,
  position: "absolute",
})
