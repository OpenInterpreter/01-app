import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import {
  TextStyle,
  View,
  ViewStyle,
  StyleSheet,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageStyle,
} from "react-native"
import { Text, ListItem, Toggle, Button } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { spacing, typography } from "../theme"
import { openLinkInBrowser } from "../utils/openLinkInBrowser"

const termsBackground = require("../../assets/images/terms.png")

interface TermScreenProps extends AppStackScreenProps<"Terms"> {}

export const TermScreen: FC<TermScreenProps> = observer(function TermScreen(_props) {
  const { navigation } = _props
  const { settingStore } = useStores()

  const handleContinue = () => {
    navigation.navigate("Login")
  }

  const setBackup = (newValue: boolean) => {
    settingStore.setProp("backup", newValue)
  }

  const setSafety = (newValue: boolean) => {
    settingStore.setProp("safety", newValue)
  }

  const setTerms = (newValue: boolean) => {
    settingStore.setProp("terms", newValue)
  }

  const isAllChecked = () => {
    return settingStore.backup && settingStore.safety && settingStore.terms
  }

  const openTermsAndConditions = () => {
    openLinkInBrowser("https://01.openinterpreter.com/hardware/mobile/privacy")
  }

  return (
    <KeyboardAvoidingView
      style={$container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <StatusBar backgroundColor={"black"} />
      <Image source={termsBackground} style={$backgroundImage} resizeMode="cover" />
      <View style={$darkOverlay} />
      <ScrollView contentContainerStyle={$contentOverlay}>
        <View style={$topContainer}>
          <Text tx="termScreen.disclaimer" preset="subheading" style={$topOverlayText} />

          <View style={$radioGroup}>
            <ListItem
              onPress={() => setBackup(!settingStore.backup)}
              LeftComponent={
                <>
                  <View style={$radioItem}>
                    <Toggle variant="radio" value={settingStore.backup} onValueChange={setBackup} />
                  </View>
                  <Text tx="termScreen.backup" style={$radioText} />
                </>
              }
            />
            <ListItem
              onPress={() => setSafety(!settingStore.safety)}
              LeftComponent={
                <>
                  <View style={$radioItem}>
                    <Toggle variant="radio" value={settingStore.safety} onValueChange={setSafety} />
                  </View>
                  <Text tx="termScreen.safety" style={$radioText} />
                </>
              }
            />
            <ListItem
              onPress={() => setTerms(!settingStore.terms)}
              LeftComponent={
                <>
                  <View style={$radioItem}>
                    <Toggle variant="radio" value={settingStore.terms} onValueChange={setTerms} />
                  </View>
                  <Text style={$textGroup}>
                    <Text tx="termScreen.agree" style={$radioText} />
                    <Text
                      tx="termScreen.tos"
                      style={[$radioText, $linkText]}
                      onPress={openTermsAndConditions}
                    />
                    <Text text="." style={$radioText} />
                  </Text>
                </>
              }
            />
          </View>

          <Button
            disabled={!isAllChecked()}
            onPress={handleContinue}
            style={[$continueButton, $continueButtonBorder(!isAllChecked())]}
            textStyle={$buttonText(!isAllChecked())}
            tx="common.continue"
          />
          <Text
            tx="termScreen.safetyReport"
            style={$safetyReportText}
            onPress={() => openLinkInBrowser("https://01.openinterpreter.com/safety/introduction")}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
})

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: "black",
}

const $topContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 1,
  justifyContent: "center",
  paddingHorizontal: spacing.xl,
  overflow: "hidden",
}

const $darkOverlay: ViewStyle = {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: "rgba(0, 0, 0, 0.8)",
}

const $backgroundImage: ImageStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  width: "100%",
  height: undefined,
  aspectRatio: 1,
}

const $contentOverlay: ViewStyle = {
  flexGrow: 1,
}

const $topOverlayText: TextStyle = {
  marginBottom: spacing.md,
  color: "rgba(256, 256, 256, 0.7)",
  fontFamily: typography.fonts.inter.medium,
  fontSize: 20,
  letterSpacing: -0.6,
  lineHeight: 24,
}

const $linkText: TextStyle = {
  textDecorationLine: "underline",
}

const $continueButton: ViewStyle = {
  marginTop: spacing.sm,
  backgroundColor: "transparent",
  borderWidth: 1,
  borderRadius: 15,
}

const $continueButtonBorder = (isAllChecked: boolean): ViewStyle => ({
  borderColor: isAllChecked ? "rgba(256, 256, 256, 0.3)" : "rgba(256, 256, 256, 0.7)",
})

const $buttonText = (isAllChecked: boolean): TextStyle => ({
  color: isAllChecked ? "rgba(256, 256, 256, 0.3)" : "rgba(256, 256, 256, 0.7)",
  fontSize: 20,
  letterSpacing: -0.6,
  fontFamily: typography.fonts.inter.light,
})

const $radioItem: ViewStyle = {
  marginRight: spacing.lg,
}

const $radioText: TextStyle = {
  marginBottom: spacing.md,
  paddingRight: spacing.xl,
  color: "rgba(256, 256, 256, 0.7)",
  fontFamily: typography.fonts.inter.medium,
  fontSize: 20,
  letterSpacing: -0.6,
  lineHeight: 24,
}

const $textGroup: TextStyle = {
  paddingRight: spacing.xxl,
}

const $safetyReportText: TextStyle = {
  marginTop: spacing.lg,
  color: "rgba(256, 256, 256, 0.7)",
  fontFamily: typography.fonts.inter.medium,
  fontSize: 20,
  letterSpacing: -0.6,
  lineHeight: 24,
  alignSelf: "center",
}

const $radioGroup: ViewStyle = {
  marginTop: spacing.xl + spacing.lg,
  marginBottom: spacing.xl + spacing.lg,
  marginHorizontal: spacing.sm,
}
