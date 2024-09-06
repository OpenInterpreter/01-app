import React, { useEffect, useRef } from "react"
import { View, ViewStyle, ScrollView, Dimensions } from "react-native"
import ChatMessage from "./ChatMessage"
import { spacing } from "../theme"

export type ChatMessageType = {
  name: string
  message: string
  isSelf: boolean
  timestamp: number
}

type ChatTileProps = {
  messages: ChatMessageType[]
  accentColor: string
}

const windowHeight = Dimensions.get("window").height

export const ChatTile = ({ messages, accentColor }: ChatTileProps) => {
  const scrollViewRef = useRef<ScrollView>(null)

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false })
    }
  }, [messages])

  return (
    <View style={$container}>
      <ScrollView
        ref={scrollViewRef}
        style={$messagesContainer}
        contentContainerStyle={$messagesContent}
        scrollEventThrottle={16}
      >
        {messages.map((message, index) => {
          // const isConsecutive = index > 0 && messages[index - 1].isSelf === message.isSelf;

          return (
            <ChatMessage
              key={index}
              message={message.message}
              isSelf={message.isSelf}
              accentColor={accentColor}
              // isConsecutive={isConsecutive}
            />
          )
        })}
      </ScrollView>
    </View>
  )
}

const $container: ViewStyle = {
  flex: 1,
  width: "100%",
  height: "100%",
}

const $messagesContainer: ViewStyle = {
  width: "100%",
  flexGrow: 1,
  paddingHorizontal: spacing.md,
  height: windowHeight * 0.8,
}

const $messagesContent: ViewStyle = {
  flexGrow: 1,
  justifyContent: "flex-end",
  paddingBottom: spacing.xl + spacing.lg - spacing.xxs,
}
