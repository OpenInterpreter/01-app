import React, { FC, useEffect, useState, useCallback, useRef } from "react"
import {
  ViewStyle,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native"
import { Screen, Icon } from "../components"
import { ScreenStackScreenProps } from "../navigators/ScreenNavigator"
import { spacing } from "../theme"
import { TranscriptionTile } from "app/components/Transcript"
import { ChatMessageInput } from "../components/ChatMessageInput"
import {
  useLocalParticipant,
  useConnectionState,
} from "@livekit/react-native"
import { ConnectionState } from "livekit-client"
import { useChat } from "@livekit/components-react"
import { useStores } from "../models"
import { AudioVisualizer } from "../components/AudioVisualizer"
import { ChatMessageType } from "../components/Chat"
import { observer } from "mobx-react-lite"
import { toJS } from "mobx"
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated"
import { WelcomeScreenWrapper } from "./WelcomeScreen"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useAudioSetup } from "../utils/useAudioSetup"
import { useTranscriptionHook } from "../utils/useTranscription"



export const HeroScreen: FC<ScreenStackScreenProps<"Hero">> = observer(function HeroScreen(_props) {
  const isRevealed = useRef(false)
  const { navigation } = _props

  const { localParticipant } = useLocalParticipant()
  const roomState = useConnectionState()
  const { settingStore } = useStores()
  const { send: sendChat } = useChat()

  const [messages, setMessages] = useState<ChatMessageType[]>([])
  const [transcripts, setTranscripts] = useState<Map<string, ChatMessageType>>(new Map())

  const [isDarkMode, setIsDarkMode] = useState(true)
  const isWearable = toJS(settingStore.wearable)
  const insets = useSafeAreaInsets()
  const [_, setKeyboardVisible] = useState(false)
  const chatFlexValue = useSharedValue(7)

  const {
    audioTrackReady,
    agentAudioTrack,
    unmute,
    mute,
  } = useAudioSetup(localParticipant, roomState, settingStore, navigation, isDarkMode, setIsDarkMode)

  const { filteredMessages, filteredTranscripts } = useTranscriptionHook(messages, transcripts)

  useEffect(() => {
    if (roomState === ConnectionState.Disconnected || roomState === ConnectionState.Reconnecting) {
      console.log("Connection Lost", "You have been disconnected from the room")
    }
  }, [roomState])


  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true)
      chatFlexValue.value = 5
    })
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false)
      chatFlexValue.value = 7
    })

    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
  }, [])

  const chatAnimatedStyle = useAnimatedStyle(() => ({
    flex: isWearable ? 0 : chatFlexValue.value,
    display: isWearable ? "none" : "flex",
  }))

  const visualizerAnimatedStyle = useAnimatedStyle(() => ({
    flex: isWearable ? 1 : 2,
    paddingTop: isWearable ? insets.top : 0,
  }))

  const inputAnimatedStyle = useAnimatedStyle(() => ({
    flex: isWearable ? 0 : 1,
    display: isWearable ? "none" : "flex",
  }))

  const handleSettings = useCallback(() => {
    navigation.navigate("Settings")
  }, [])

  return (
    <>
      {agentAudioTrack && audioTrackReady ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={$keyboardAvoidingView}
        >
          <Animated.View style={[$animatedContainer, chatAnimatedStyle]}>
            <Screen
              preset="fixed"
              backgroundColor={$darkMode(isDarkMode)}
              contentContainerStyle={$topContainer(isDarkMode)}
            >
              <TranscriptionTile
                agentAudioTrack={agentAudioTrack}
                accentColor={isDarkMode ? "white" : "black"}
                transcripts={filteredTranscripts}
                setTranscripts={setTranscripts}
                messages={filteredMessages}
                setMessages={setMessages}
                isDarkMode={isDarkMode}
              />
            </Screen>
          </Animated.View>

          <Animated.View style={[$animatedContainer, visualizerAnimatedStyle]}>
            <TouchableOpacity
              testID="audioVisualizer"
              style={$fullSize}
              onPressIn={settingStore.pushToTalk ? unmute : undefined}
              onPressOut={settingStore.pushToTalk ? mute : undefined}
              activeOpacity={1}
            >
              <Screen
                preset="fixed"
                backgroundColor={$darkMode(isDarkMode)}
                contentContainerStyle={[
                  $bottomContainer(isDarkMode),
                  $justifyBottomContainer(isWearable),
                ]}
                safeAreaEdges={isRevealed.current ? ["top"] : []}
              >
                <AudioVisualizer darkMode={isDarkMode} />
              </Screen>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[$animatedContainer, inputAnimatedStyle]}>
            <Screen
              preset="fixed"
              backgroundColor={$darkMode(isDarkMode)}
              contentContainerStyle={$chatInputContainer(isDarkMode)}
            >
              <ChatMessageInput
                placeholder="Type a message"
                onSend={sendChat}
                isDarkMode={isDarkMode}
              />
            </Screen>
          </Animated.View>

          <View testID="settingsIcon" style={$settingContainer}>
            <Icon
              icon="cog"
              size={36}
              color={isDarkMode ? "white" : "black"}
              onPress={handleSettings}
            />
          </View>
        </KeyboardAvoidingView>
      ) : (
        <WelcomeScreenWrapper />
      )}
    </>
  )
})

const $darkMode = (isDarkMode: boolean): string => (isDarkMode ? "black" : "white")

const $fullSize: ViewStyle = {
  flex: 1,
  width: "100%",
}

const $animatedContainer: ViewStyle = {
  overflow: "hidden",
}

const $settingContainer: ViewStyle = {
  position: "absolute",
  top: spacing.xl + spacing.xl,
  right: spacing.xl,
  zIndex: 1000,
  opacity: 0.5,
}

const $keyboardAvoidingView: ViewStyle = {
  flex: 1,
  backgroundColor: "black",
}

const $topContainer = (isDarkMode: boolean): ViewStyle => ({
  paddingTop: spacing.lg + spacing.xl,
  paddingHorizontal: spacing.md,
  flex: 1,
  backgroundColor: isDarkMode ? "black" : "white",
})

const $bottomContainer = (isDarkMode: boolean): ViewStyle => ({
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.xs,
  flex: 1,
  alignItems: "center",
  backgroundColor: isDarkMode ? "black" : "white",
})

const $justifyBottomContainer = (isWearable: boolean): ViewStyle => ({
  justifyContent: isWearable ? "center" : "flex-start",
})

const $chatInputContainer = (isDarkMode: boolean): ViewStyle => ({
  paddingBottom: spacing.md,
  paddingRight: spacing.md,
  paddingLeft: spacing.sm,
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: isDarkMode ? "black" : "white",
  width: "100%",
})
