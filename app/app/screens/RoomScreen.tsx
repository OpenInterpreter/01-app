import React, { FC, useEffect } from "react"
import { ScreenNavigator } from "../navigators/ScreenNavigator"
import { AudioSession, LiveKitRoom } from "@livekit/react-native"
import { useStores } from "../models"
import { Alert, ViewStyle, View } from "react-native"
import { AppStackScreenProps } from "../navigators"
import { observer } from "mobx-react-lite"
import { WelcomeScreenWrapper } from "./WelcomeScreen"
import { ThemeProvider } from "../theme/Theme"

interface RoomScreenProps extends AppStackScreenProps<"Room"> {}

export const RoomScreen: FC<RoomScreenProps> = observer(function RoomScreen(_props) {
  const { connectionStore } = useStores()
  const { navigation } = _props
  const [isReady, setIsReady] = React.useState(false)

  // Start the audio session first.
  useEffect(() => {
    const start = async () => {
      await AudioSession.startAudioSession()

      if (connectionStore.error) {
        Alert.alert("Error connecting to our servers, please reconnect")
        connectionStore.clearError()
        navigation.navigate("Login")
      } else {
        setIsReady(true)
      }
    }

    start()

    return () => {
      AudioSession.stopAudioSession()
      connectionStore.disconnect()
    }
  }, [])

  return (
    <View style={$darkModeView}>
      {!isReady ? (
        <WelcomeScreenWrapper />
      ) : (
        <ThemeProvider>
          <LiveKitRoom
            serverUrl={connectionStore.livekitUrl}
            token={connectionStore.token}
            connect={true}
            options={{
              // Use screen pixel density to handle screens with differing densities.
              adaptiveStream: { pixelDensity: "screen" },
            }}
            audio={true}
            video={false}
          >
            <ScreenNavigator />
          </LiveKitRoom>
        </ThemeProvider>
      )}
    </View>
  )
})

const $darkModeView: ViewStyle = {
  flex: 1,
  backgroundColor: "black",
}
