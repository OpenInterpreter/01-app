import React, { FC, useCallback } from "react"
import { TextStyle, View, ViewStyle, TouchableOpacity } from "react-native"
import { Screen, Text, Toggle, Card } from "../components"
import { ScreenStackScreenProps } from "../navigators/ScreenNavigator"
import { spacing } from "../theme"
import { useStores } from "../models"
import { openLinkInBrowser } from "../utils/openLinkInBrowser"
import { observer } from "mobx-react-lite"
import { Icon } from "../components/Icon"
import Svg, { Circle } from "react-native-svg"
import { useChat } from "@livekit/components-react"

export const SettingsScreen: FC<ScreenStackScreenProps<"Settings">> = observer(
  function SettingsScreen(_props) {
    const { settingStore, connectionStore } = useStores()
    const { send: sendChat } = useChat()
    const { navigation } = _props

    const handlePushToTalkToggle = (newValue: boolean) => {
      settingStore.setProp("pushToTalk", newValue)

      if (!newValue) {
        // if push to talk is turned off then turn off always listening
        console.log("SETTING REQUIRE START OFF")
        settingStore.setProp("alwaysListening", newValue)
        settingStore.unrequireStart(sendChat)
      } else {
        console.log("SETTING REQUIRE START ON")
        settingStore.requireStart(sendChat)
      }
    }

    const handleAlwaysListeningToggle = (newValue: boolean) => {
      settingStore.setProp("alwaysListening", newValue)
    }

    const handleWearableToggle = (newValue: boolean) => {
      settingStore.setProp("wearable", newValue)
    }

    const handleAutorunToggle = (newValue: boolean) => {
      settingStore.setProp("autorun", newValue)

      if (!newValue) {
        // if push to talk is turned off then turn off always listening
        console.log("SETTING AUTORUN OFF")
        settingStore.autorunOff(sendChat)
      } else {
        console.log("SETTING AUTORUN ON")
        settingStore.autorunOn(sendChat)
      }
    }

    const handleReturn = useCallback(() => {
      navigation.navigate("Hero")
    }, [])

    function handleDisconnect() {
      connectionStore.disconnect()
      settingStore.reset()
      navigation.navigate("Login")
    }

    return (
      <Screen preset="scroll" safeAreaEdges={["top"]} contentContainerStyle={$container}>
        <TouchableOpacity testID="returnIcon" style={$caretContainer} onPress={handleReturn}>
          <Icon icon="caretLeft" size={36} color="white" />
        </TouchableOpacity>

        <View style={$topContainer}>
          <Text style={$title} preset="subheading" tx="settingScreen.title" />
        </View>

        <View style={$itemsContainer}>
          <Card
            style={[$background, $largeContainer]}
            ContentComponent={
              <View style={$center}>
                <Svg height="72" width="72" viewBox="0 0 100 100">
                  <Circle cx="50" cy="50" r="48" stroke="white" strokeWidth="2" fill="none" />
                </Svg>
              </View>
            }
          />
          <Text tx="settingScreen.interpreterDescription" style={$formHelper} />

          <Card
            style={[$background, $smallContainer]}
            LeftComponent={
              <Text tx="settingScreen.pushToTalk" preset="default" style={$itemText} />
            }
            RightComponent={
              <Toggle
                containerStyle={$togglePadding}
                value={settingStore.pushToTalk}
                onValueChange={handlePushToTalkToggle}
                variant="switch"
              />
            }
          />
          <Text tx="settingScreen.pushToTalkDescription" style={$formHelper} />

          {settingStore.pushToTalk ? (
            <>
              <Card
                style={[$background, $smallContainer]}
                LeftComponent={
                  <Text tx="settingScreen.alwaysListen" preset="default" style={$itemText} />
                }
                RightComponent={
                  <Toggle
                    containerStyle={$togglePadding}
                    value={settingStore.alwaysListening}
                    onValueChange={handleAlwaysListeningToggle}
                    variant="switch"
                  />
                }
              />
              <Text tx="settingScreen.alwaysListeningDescription" style={$formHelper} />
            </>
          ) : (
            <></>
          )}

          <Card
            style={[$background, $smallContainer]}
            LeftComponent={<Text tx="settingScreen.wearable" preset="default" style={$itemText} />}
            RightComponent={
              <Toggle
                testID="wearableToggle"
                containerStyle={$togglePadding}
                value={settingStore.wearable}
                onValueChange={handleWearableToggle}
                variant="switch"
              />
            }
          />
          <Text tx="settingScreen.wearableDescription" style={$formHelper} />

          <Card
            style={[$background, $smallContainer]}
            LeftComponent={<Text tx="settingScreen.autorun" preset="default" style={$itemText} />}
            RightComponent={
              <Toggle
                testID="autorunToggle"
                containerStyle={$togglePadding}
                value={settingStore.autorun}
                onValueChange={handleAutorunToggle}
                variant="switch"
              />
            }
          />
          <Text tx="settingScreen.autorunDescription" style={$formHelper} />

          <Card
            style={[$background, $footerContainer]}
            onPress={() => openLinkInBrowser("https://0ggfznkwh4j.typeform.com/to/fXVezM5w")}
            LeftComponent={<Text tx="settingScreen.report" style={[$itemText, $footerText]} />}
          />

          <Card
            style={[$background, $footerContainer]}
            onPress={handleDisconnect}
            LeftComponent={<Text tx="common.disconnect" style={[$disconnect, $footerText]} />}
          />
        </View>

        <Text
          style={$privacyPolicyLink}
          tx="settingScreen.privacyPolicy"
          onPress={() => openLinkInBrowser("https://01.openinterpreter.com/legal/privacy-policy")}
        />
      </Screen>
    )
  },
)

const $container: ViewStyle = {
  paddingTop: 1,
  paddingHorizontal: spacing.md + 2,
}

const $center: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
  flex: 1,
}

const $background: ViewStyle = {
  backgroundColor: "#1c1c1e",
  borderWidth: 0,
  marginTop: spacing.md,
}

const $togglePadding: ViewStyle = {
  marginRight: spacing.xs + 1,
}

const $formHelper: TextStyle = {
  color: "white",
  opacity: 0.5,
  letterSpacing: 0.2,
  fontSize: 14,
  lineHeight: 18,
  marginLeft: spacing.md,
  marginTop: spacing.xs,
  marginRight: spacing.md,
}

const $topContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  marginBottom: spacing.xl,
}

const $caretContainer: ViewStyle = {
  left: 0,
  position: "absolute",
  zIndex: 10000,
}

const $title: TextStyle = {
  color: "white",
  textAlign: "center",
}

const $itemText: TextStyle = {
  color: "white",
  fontSize: 17,
  marginLeft: 1,
}

const $footerText: TextStyle = {
  marginLeft: spacing.xxs + 2,
}

const $disconnect: TextStyle = {
  color: "#fc4439",
  fontSize: 17,
}

const $privacyPolicyLink: TextStyle = {
  color: "#0981fa",
  marginBottom: spacing.lg,
  alignSelf: "center",
  fontSize: 17,
}

const $itemsContainer: ViewStyle = {
  marginBottom: spacing.xl,
}

const $smallContainer: ViewStyle = {
  minHeight: 48,
  alignItems: "center",
  paddingLeft: spacing.md,
  marginTop: spacing.lg + 2,
}

const $footerContainer: ViewStyle = {
  minHeight: 48,
  alignItems: "center",
  paddingLeft: spacing.md,
  marginTop: spacing.lg,
  marginLeft: spacing.xxs,
  marginRight: spacing.xxs,
}

const $largeContainer: ViewStyle = {
  minHeight: 184,
}
