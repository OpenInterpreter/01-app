/**
 * Commented code blocks in this page are used for development on Android and iOS simulator.
 * Uncomment them to manually set the LivekitUrl for development purposes.
 */

import { observer } from "mobx-react-lite"
import React, { FC, useCallback } from "react"
import { Alert, ViewStyle, Image, ImageStyle, TouchableOpacity, TextStyle } from "react-native"
import { Screen, Text, Button, TextField } from "../components"
import { typography } from "../theme"
import { AppStackScreenProps } from "../navigators"
import { openLinkInBrowser } from "../utils/openLinkInBrowser"
import { SafeAreaView } from "react-native-safe-area-context"
import { useStores } from "../models"

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

const connectSplash = require("../../assets/images/connect.png")

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  const { navigation } = _props

  const { connectionStore } = useStores()

  const handleTextChange = useCallback(
    (input: string) => {
      connectionStore.saveLivekitUrl(input)
    },
    [connectionStore],
  )

  const handleLocalConnect = useCallback(async () => {
    await connectionStore.set_token()

    if (connectionStore.error) {
      Alert.alert("Error connecting to your server, please try again")
      connectionStore.clearError()
      navigation.navigate("Login")
      return
    }

    navigation.navigate("Room")
  }, [navigation])

  const handleScan = useCallback(async () => {
    navigation.navigate("Scan")
  }, [navigation])

  return (
    <>
      {__DEV__ ? (
        <SafeAreaView style={$safeContainer}>
          <TextField
            onChangeText={handleTextChange}
            style={$devInput}
            // value={connectionStore.livekitUrl}
            placeholder="Your LiveKit URL"
          />
          <Button
            testID="loginButton"
            preset="reversed"
            tx="common.connect"
            onPress={handleLocalConnect}
          />
        </SafeAreaView>
      ) : (
        <Screen
          preset="auto"
          contentContainerStyle={$screenContentContainer}
          safeAreaEdges={["top", "bottom"]}
        >
          <TouchableOpacity style={$fullScreenTouchable} onPress={handleScan}>
            <Image
              testID="loginBackground"
              source={connectSplash}
              style={$connectSplashImage}
              resizeMode="contain"
            />
            <Text
              testID="setupLink"
              tx="loginScreen.setup"
              style={$setupGuideText}
              onPress={() =>
                openLinkInBrowser("https://01.openinterpreter.com/client/android-ios#setup")
              }
            />
            <Text
              testID="reportLink"
              tx="loginScreen.report"
              style={$reportText}
              onPress={() => openLinkInBrowser("https://0ggfznkwh4j.typeform.com/to/fXVezM5w")}
            />
          </TouchableOpacity>
        </Screen>
      )}
    </>
  )
})

const $fullScreenTouchable: ViewStyle = {
  flex: 1,
  width: "100%",
  height: "100%",
  justifyContent: "center",
  alignItems: "center",
}

const $safeContainer: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  width: "100%",
}

const $devInput: ViewStyle = {
  width: "100%",
  marginBottom: 10,
}

const $screenContentContainer: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
  flex: 1,
}

const $connectSplashImage: ImageStyle = {
  width: "100%",
  height: "100%",
}

const $setupGuideText: TextStyle = {
  color: "#6a6a6a",
  fontSize: 18,
  position: "absolute",
  bottom: "30%",
  textDecorationLine: "underline",
  fontFamily: typography.fonts.inter.medium,
}

const $reportText: TextStyle = {
  color: "rgba(256, 256, 256, 0.5)",
  fontSize: 16,
  position: "absolute",
  top: "5%",
  right: "5%",
  fontFamily: typography.fonts.inter.medium,
}
