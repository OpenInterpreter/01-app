import React from "react"
import { ViewStyle, View } from "react-native"
import { useTheme } from "../utils/useTheme"
import { Theme } from "../theme/Theme"

export const AudioVisualizer = () => {
  const { theme } = useTheme()

  return (
    <View style={$visualizerContainer}>
      <View style={$agentIcon(theme)} />
    </View>
  )
}

const $visualizerContainer: ViewStyle = {
  height: 100,
  width: 100,
  justifyContent: "center",
  alignItems: "center",
}

const $agentIcon = (theme: Theme): ViewStyle => ({
  height: 110,
  width: 110,
  borderRadius: 55,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.accent,
  zIndex: 3,
  position: "absolute",
})