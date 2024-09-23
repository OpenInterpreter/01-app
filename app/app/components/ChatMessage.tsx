import React from "react"
import { View, ViewStyle, TextStyle } from "react-native"
import { Text } from "./Text"
import { typography } from "../theme"
import { useTheme } from "../utils/useTheme"

type ChatMessageProps = {
  message: string
  isSelf: boolean
  isConsecutive?: boolean
}

const ChatMessage = ({
  message,
  isSelf,
}: 
ChatMessageProps) => {
  const { theme } = useTheme()

  return (
    <View
      style={ $container }
    >
      <Text
        size="sm"
        style={[$message, $getSelfMessage(isSelf, theme.accent), !isSelf && $textShadow]}
      >
        {message}
      </Text>
    </View>
  )
}

const $container: ViewStyle = {
  flexDirection: "column",
  marginBottom: 27 * 1.2,
}

const $textShadow: TextStyle = {
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 1,
}

const $getSelfMessage = (isSelf: boolean, accentColor: string): TextStyle => ({
  color: isSelf ? "#6b7280" : accentColor,
})

const $message: TextStyle = {
  fontSize: 24 * 1.2,
  lineHeight: 27 * 1.2,
  flexWrap: "wrap",
  fontFamily: typography.fonts.ppEditorialNew.regular,
}

export default ChatMessage
