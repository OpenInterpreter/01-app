/**
 * Commented code blocks in this page are used for development on Android and iOS simulator.
 * Uncomment them to manually set the LivekitUrl for development purposes.
 */

import { observer } from "mobx-react-lite"
import React, { FC, useCallback } from "react"
import {
  Alert,
  ViewStyle,
  Image,
  ImageStyle,
  TouchableOpacity,
  TextStyle,
} from "react-native"
import {
  Screen,
  Text,
  Button,
  TextField
} from "../components"
import { typography } from "../theme"
import { AppStackScreenProps } from "../navigators"
import { openLinkInBrowser } from "../utils/openLinkInBrowser"
import { SafeAreaView } from "react-native-safe-area-context"
import { useStores } from "../models"

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

const connectSplash = require("../../assets/images/connect.png")

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  const { navigation } = _props

  const { connectionStore } = useStores();
  
  const handleTextChange = useCallback((input: string) => {
    connectionStore.saveLivekitUrl(input);
  }, [connectionStore]);
  
  const handleLocalConnect = useCallback (async () => {
    await connectionStore.set_token();
  
    if (connectionStore.error) {
      Alert.alert('Error connecting to your server, please try again');
      connectionStore.clearError();
      navigation.navigate("Login");
      return
    }
  
    navigation.navigate("Room");
  }, [navigation]);
  
  
  const localConnect = () => {
    return (
      <Button
        testID="next-screen-button"
        preset="reversed"
        tx="common.connect"
        onPress={handleLocalConnect}
      />
    );
  }

  const handleScan = useCallback(async () => {
    navigation.navigate("Scan")
  }, [navigation])

  return (
    <>
      {__DEV__ ? (
          <SafeAreaView>
            <TextField
              testID="devInput"
              RightAccessory={localConnect}
              onChangeText={handleTextChange}
              value={connectionStore.livekitUrl}
              placeholder="Your LiveKit URL"
            />
          </SafeAreaView> 
        ) : (
          <Screen
            preset="auto"
            contentContainerStyle={$screenContentContainer}
            safeAreaEdges={["top", "bottom"]}
          >
            <TouchableOpacity style={$fullScreenTouchable} onPress={handleScan}>
              <Image testID="loginBackground" source={connectSplash} style={$connectSplashImage} resizeMode="contain" />
              <Text
                testID="setupLink"
                tx="loginScreen.setup"
                style={$setupGuideText}
                onPress={() => openLinkInBrowser("https://01.openinterpreter.com/software/installation") }
              />
            </TouchableOpacity>
          </Screen>
        )
      }
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
  bottom: "36%",
  textDecorationLine: "underline",
  fontFamily: typography.fonts.inter.regular,
}
