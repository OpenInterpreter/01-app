import React, { FC, useEffect, useState, useCallback, useRef, useMemo } from "react"
import {
  ViewStyle,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
} from "react-native"
import { Screen, Icon } from "../components"
import { ScreenStackScreenProps } from "../navigators/ScreenNavigator"
import { spacing } from "../theme"
import { TranscriptionTile } from "app/components/Transcript"
import { ChatMessageInput } from "../components/ChatMessageInput"
import {
  TrackReferenceOrPlaceholder,
  useTracks,
  useLocalParticipant,
  useConnectionState,
} from "@livekit/react-native"
import { Track, ConnectionState, RemoteTrack, LocalTrack } from "livekit-client"
import { useDataChannel, useChat } from "@livekit/components-react"
import { useStores } from "../models"
import { useAudioActivity } from "../utils/useVolume"
import { AudioVisualizer } from "../components/AudioVisualizer"
import { ChatMessageType } from "../components/Chat"
import { observer } from "mobx-react-lite"
import { toJS } from "mobx"
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated"
import { WelcomeScreenWrapper } from "./WelcomeScreen"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const isSpecialMessage = (message: string): boolean => {
  const specialMessages = [
    "{START}",
    "{CONTEXT_MODE_ON}",
    "{CONTEXT_MODE_OFF}",
    "{REQUIRE_START_ON}",
    "{REQUIRE_START_OFF}",
  ]
  return specialMessages.includes(message.trim())
}

export const HeroScreen: FC<ScreenStackScreenProps<"Hero">> = observer(function HeroScreen(_props) {
  const isRevealed = useRef(false)
  const { navigation } = _props

  const tracks = useTracks()
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
  const [audioTrackReady, setAudioTrackReady] = useState(false)
  const audioTrackRef = useRef<LocalTrack | undefined>(undefined)
  let agentAudioTrack: TrackReferenceOrPlaceholder | undefined

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  useEffect(() => {
    if (roomState === ConnectionState.Disconnected || roomState === ConnectionState.Reconnecting) {
      console.log("Connection Lost", "You have been disconnected from the room")
    }
  }, [roomState])

  useEffect(() => {
    if (roomState === ConnectionState.Connected && localParticipant) {
      const setupMicrophone = async () => {
        await localParticipant.setMicrophoneEnabled(true)
        let attempts = 0
        const maxAttempts = 10

        while (!audioTrackRef.current && attempts < maxAttempts) {
          audioTrackRef.current = localParticipant.getTrackPublication(
            Track.Source.Microphone,
          )?.track
          if (!audioTrackRef.current) {
            await new Promise((resolve) => setTimeout(resolve, 500))
            attempts++
          }
        }

        if (audioTrackRef.current) {
          console.log("Microphone found after", attempts, "attempts")
          console.log("Setting up microphone:", {
            pushToTalk: settingStore.pushToTalk,
            alwaysListening: settingStore.alwaysListening,
          })
          if (settingStore.pushToTalk && !settingStore.alwaysListening) {
            console.log("Muting microphone")
            await audioTrackRef.current.mute()
          } else {
            console.log("Unmuting microphone")
            await audioTrackRef.current.unmute()
          }
          console.log("Microphone muted state:", audioTrackRef.current.isMuted)
          setAudioTrackReady(true)
        } else {
          Alert.alert(`Microphone  track not found after ${maxAttempts} attempts`)
          navigation.navigate("Login")
        }
      }

      ;(async () => {
        await setupMicrophone()
      })()
    }
  }, [localParticipant, roomState, settingStore.pushToTalk, settingStore.alwaysListening])

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

  const aat = tracks.find(
    (trackRef) => trackRef.publication.kind === Track.Kind.Audio && trackRef.participant.isAgent,
  )

  if (aat) {
    agentAudioTrack = aat
  }

  const subscribedVolumes = useAudioActivity(agentAudioTrack?.publication?.track)

  const currentVolume =
    (subscribedVolumes.reduce((sum, value) => sum + value, 0) / subscribedVolumes.length) * 50

  const unmute = () => {
    if (localParticipant && settingStore.pushToTalk && !settingStore.alwaysListening) {
      if (audioTrackRef.current) {
        audioTrackRef.current.unmute()
      }
    }

    // Mute the agent track
    if (agentAudioTrack?.publication?.track) {
      ;(agentAudioTrack.publication.track as RemoteTrack).setMuted(true)
    }

    toggleTheme()
  }

  const mute = () => {
    if (localParticipant && settingStore.pushToTalk && !settingStore.alwaysListening) {
      if (audioTrackRef.current) {
        audioTrackRef.current.mute()
      }
    }

    // Unmute the agent track
    if (agentAudioTrack?.publication?.track) {
      ;(agentAudioTrack.publication.track as RemoteTrack).setMuted(false)
    }

    if (settingStore.pushToTalk) {
      sendChat("{START}")
    }

    toggleTheme()
  }

  const onDataReceived = useCallback((msg: any) => {
    if (msg.topic === "transcription") {
      console.log("message received", msg)
      const decoded = JSON.parse(new TextDecoder("utf-8").decode(msg.payload))
      let timestamp = new Date().getTime()
      if ("timestamp" in decoded && decoded.timestamp > 0) {
        timestamp = decoded.timestamp
      }
      setTranscripts((prevTranscripts) => {
        const newTranscripts = new Map(prevTranscripts)
        const id = `local-${timestamp}` // Create a unique ID for this transcript
        newTranscripts.set(id, {
          name: "You",
          message: decoded.text,
          timestamp,
          isSelf: true,
        })
        return newTranscripts
      })
    }
  }, [])

  useDataChannel(onDataReceived)

  const filteredMessages = useMemo(() => {
    return messages.filter((message) => !isSpecialMessage(message.message))
  }, [messages])

  const filteredTranscripts = useMemo(() => {
    const newTranscripts = new Map(transcripts)
    for (const [id, transcript] of newTranscripts) {
      if (isSpecialMessage(transcript.message)) {
        newTranscripts.delete(id)
      }
    }
    return newTranscripts
  }, [transcripts])

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
                <AudioVisualizer currentVolume={currentVolume} darkMode={isDarkMode} />
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

          <View style={$settingContainer}>
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
