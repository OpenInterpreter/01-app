import { useState, useEffect, useRef } from "react"
import { LocalParticipant, ConnectionState, Track, LocalTrack, RemoteTrack } from "livekit-client"
import { useChat } from "@livekit/components-react"
import { TrackReferenceOrPlaceholder, useTracks } from "@livekit/react-native"
import { Alert } from "react-native"

export function useAudioSetup(
  localParticipant: LocalParticipant | null,
  roomState: ConnectionState,
  settingStore: any,
  navigation: any,
  isDarkMode: boolean,
  setIsDarkMode: (isDarkMode: boolean) => void
) {
  const [audioTrackReady, setAudioTrackReady] = useState(false)
  const audioTrackRef = useRef<LocalTrack | undefined>(undefined)
  const tracks = useTracks()
  const { send: sendChat } = useChat()
  let agentAudioTrack: TrackReferenceOrPlaceholder | undefined

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

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


  const aat = tracks.find(
    (trackRef) => trackRef.publication.kind === Track.Kind.Audio && trackRef.participant.isAgent,
  )

  if (aat) {
    agentAudioTrack = aat
  }

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

  return { audioTrackReady, agentAudioTrack, unmute, mute }
}