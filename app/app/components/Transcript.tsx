import React, { useEffect, useCallback } from "react"
import { ChatMessageType, ChatTile } from "./Chat"
import {
  TrackReferenceOrPlaceholder,
  useLocalParticipant,
  useTrackTranscription,
  useChat,
} from "@livekit/components-react"
import { LocalParticipant, Participant, Track, TranscriptionSegment } from "livekit-client"
import { Dimensions, View, ViewStyle } from "react-native"
import { LinearGradient } from "expo-linear-gradient"

export function TranscriptionTile({
  agentAudioTrack,
  accentColor,
  transcripts,
  setTranscripts,
  messages,
  setMessages,
  isDarkMode,
}: {
  agentAudioTrack: TrackReferenceOrPlaceholder
  accentColor: string
  transcripts: Map<string, ChatMessageType>
  setTranscripts: React.Dispatch<React.SetStateAction<Map<string, ChatMessageType>>>
  messages: ChatMessageType[]
  setMessages: React.Dispatch<React.SetStateAction<ChatMessageType[]>>
  isDarkMode: boolean
}) {
  const agentMessages = useTrackTranscription(agentAudioTrack)
  const localParticipant = useLocalParticipant()
  const localMessages = useTrackTranscription({
    publication: localParticipant.microphoneTrack,
    source: Track.Source.Microphone,
    participant: localParticipant.localParticipant,
  })

  const { chatMessages } = useChat()

  const updateTranscripts = useCallback(
    (segments: TranscriptionSegment[], participant: Participant) => {
      setTranscripts((prevTranscripts) => {
        const newTranscripts = new Map(prevTranscripts)
        segments.forEach((s) => {
          newTranscripts.set(s.id, segmentToChatMessage(s, newTranscripts.get(s.id), participant))
        })
        return newTranscripts
      })
    },
    [setTranscripts],
  )

  useEffect(() => {
    updateTranscripts(agentMessages.segments, agentAudioTrack.participant)
  }, [agentMessages.segments, agentAudioTrack.participant, updateTranscripts])

  useEffect(() => {
    updateTranscripts(localMessages.segments, localParticipant.localParticipant)
  }, [localMessages.segments, localParticipant.localParticipant, updateTranscripts])

  useEffect(() => {
    console.log("TranscriptionTile: Updating messages", {
      transcriptsCount: transcripts.size,
      chatMessagesCount: chatMessages.length,
    })
    const allMessages = Array.from(transcripts.values())
    for (const msg of chatMessages) {
      const isAgent = msg.from?.identity === agentAudioTrack.participant?.identity
      const isSelf = msg.from?.identity === localParticipant.localParticipant.identity
      let name
      if (isAgent) {
        name = "Agent"
      } else if (isSelf) {
        name = "You"
      } else {
        name = msg.from?.name || "Unknown"
      }
      allMessages.push({
        name,
        message: msg.message,
        timestamp: msg.timestamp,
        isSelf,
      })
    }
    setMessages(allMessages.sort((a, b) => a.timestamp - b.timestamp))
  }, [
    transcripts,
    chatMessages,
    agentAudioTrack.participant,
    localParticipant.localParticipant,
    setMessages,
  ])

  return (
    <View style={$transcriptionContainer}>
      <LinearGradient
        colors={
          isDarkMode
            ? ["rgba(0,0,0,1)", "rgba(0,0,0,0.8)", "rgba(0,0,0,0)"]
            : ["rgba(256,256,256,1)", "rgba(256,256,256,0.8)", "rgba(256,256,256,0)"]
        }
        style={$gradientTop}
      />
      <ChatTile messages={messages} accentColor={accentColor} />
      <LinearGradient
        colors={
          isDarkMode
            ? ["rgba(0,0,0,0)", "rgba(0,0,0,0.8)", "rgba(0,0,0,1)"]
            : ["rgba(256,256,256,0)", "rgba(256,256,256,0.8)", "rgba(256,256,256,1)"]
        }
        style={$gradientBottom}
      />
    </View>
  )
}

function segmentToChatMessage(
  s: TranscriptionSegment,
  existingMessage: ChatMessageType | undefined,
  participant: Participant,
): ChatMessageType {
  const msg: ChatMessageType = {
    message: s.final ? s.text : `${s.text} ...`,
    name: participant instanceof LocalParticipant ? "You" : "Agent",
    isSelf: participant instanceof LocalParticipant,
    timestamp: existingMessage?.timestamp ?? Date.now(),
  }
  return msg
}

const $transcriptionContainer: ViewStyle = {
  height: Dimensions.get("window").height * 0.77,
  flex: 1,
}

const $gradientTop: ViewStyle = {
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  height: 27 * 1.2 * 2.8,
  zIndex: 1000,
}

const $gradientBottom: ViewStyle = {
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  height: 27 * 1.2 * 2.8,
  zIndex: 1000,
}
