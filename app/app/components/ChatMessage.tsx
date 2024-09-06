import React from "react"
import { View, ViewStyle, TextStyle } from "react-native"
import { Text } from "./Text"
import { typography } from "../theme"

type ChatMessageProps = {
  message: string
  accentColor: string
  isSelf: boolean
  isConsecutive?: boolean
}

const ChatMessage = ({
  message,
  accentColor,
  isSelf,
}: // isConsecutive,
ChatMessageProps) => {
  return (
    <View
      style={
        $container
        // isConsecutive ? $consecutiveContainer : $nonConsecutiveContainer
      }
    >
      <Text
        size="sm"
        style={[$message, $getSelfMessage(isSelf, accentColor), !isSelf && $textShadow]}
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

/** 
const $consecutiveContainer: ViewStyle = {
  marginBottom: 4, // Reduced spacing for consecutive messages
};

const $nonConsecutiveContainer: ViewStyle = {
  // More spacing for non-consecutive messages
};
*/

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
