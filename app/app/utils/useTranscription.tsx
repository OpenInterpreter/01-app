import { useMemo } from "react"
import { ChatMessageType } from "../components/Chat"

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

export function useTranscriptionHook(
  messages: ChatMessageType[],
  transcripts: Map<string, ChatMessageType>,
) {
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


  return { filteredMessages, filteredTranscripts }
}