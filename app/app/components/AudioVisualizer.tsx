import React from "react"
import { ViewStyle, View } from "react-native"

export const AudioVisualizer = ({
  darkMode,
}: {
  darkMode: boolean
}) => {
  return (
    <View style={$visualizerContainer}>
      <View style={$agentIcon(darkMode)} />
    </View>
  )
}

const $visualizerContainer: ViewStyle = {
  height: 100,
  width: 100,
  justifyContent: "center",
  alignItems: "center",
}

const $agentIcon = (isDarkMode: boolean): ViewStyle => ({
  height: 110,
  width: 110,
  borderRadius: 55,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: isDarkMode ? "white" : "black",
  zIndex: 3,
  position: "absolute",
})