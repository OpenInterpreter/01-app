import React, { useState, useCallback } from "react"
import { View, TouchableOpacity, ViewStyle, TextStyle, Dimensions, Alert } from "react-native"
import { TextField } from "./TextField"
import AntDesign from "@expo/vector-icons/AntDesign"
import FontAwesome6 from "@expo/vector-icons/FontAwesome6"
import { spacing } from "../theme"
import { useStores } from "../models"

type ChatMessageInputProps = {
  placeholder: string
  onSend?: (message: string) => void
  isDarkMode: boolean
}

const SCREEN_WIDTH = Dimensions.get("window").width

export const ChatMessageInput = ({ placeholder, onSend, isDarkMode }: ChatMessageInputProps) => {
  const [message, setMessage] = useState("")
  const { settingStore } = useStores()

  const handleSend = useCallback(() => {
    if (!onSend || message === "") {
      return
    }
    onSend(message)
    if (settingStore.pushToTalk) {
      onSend("{START}")
    }
    setMessage("")
  }, [onSend, message])

  const showCamera = () => {
    Alert.alert("Vision Support", "coming soon!", [{ text: "OK" }])
  }

  const backgroundColor = isDarkMode ? "black" : "white"
  const textColor = isDarkMode ? "white" : "black"

  return (
    <View>
      <View style={$inputContainer}>
        {isDarkMode ? (
          <TouchableOpacity style={$plusButton} onPress={showCamera}>
            <View style={$plusIconContainer(isDarkMode)}>
              <AntDesign name="plus" size={20} color={"white"} />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={$plusButton} onPress={showCamera}>
            <View style={$plusIconContainer(isDarkMode)}>
              <AntDesign name="plus" size={20} color={"white"} />
            </View>
          </TouchableOpacity>
        )}
        <TextField
          value={message}
          onChangeText={setMessage}
          placeholder={placeholder}
          style={[$input, { color: textColor }]}
          containerStyle={$textFieldContainer}
          inputWrapperStyle={[$inputWrapper(isDarkMode), { backgroundColor }]}
          onSubmitEditing={handleSend}
          RightAccessory={() =>
            message.length > 0 && (
              <TouchableOpacity style={$sendButton} onPress={handleSend} disabled={!onSend}>
                <FontAwesome6
                  name="circle-arrow-up"
                  size={32}
                  color={isDarkMode ? "white" : "black"}
                />
              </TouchableOpacity>
            )
          }
        />
      </View>
    </View>
  )
}

const $inputContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  paddingTop: 8,
  paddingBottom: 4,
  width: "100%",
}

const $textFieldContainer: ViewStyle = {
  flex: 1,
  width: SCREEN_WIDTH - 32,
}

const $inputWrapper = (isDarkMode: boolean): ViewStyle => ({
  borderRadius: 35,
  paddingHorizontal: 12,
  borderColor: isDarkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)",
})

const $input: TextStyle = {
  flex: 1,
  fontSize: 16,
  marginLeft: 5,
  height: 24 * 0.95, // TextField component height is 24
}

const $plusButton: ViewStyle = {
  padding: 4,
  paddingRight: spacing.md,
  alignSelf: "center",
}

const $plusIconContainer = (isDarkMode: boolean): ViewStyle => ({
  width: 34,
  height: 34,
  borderRadius: 17,
  backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)",
  justifyContent: "center",
  alignItems: "center",
})

const $sendButton: ViewStyle = {
  paddingRight: 4,
  alignSelf: "center",
}
