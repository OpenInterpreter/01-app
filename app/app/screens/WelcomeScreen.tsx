import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import {
  TextStyle,
  View,
  ViewStyle,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
  ImageStyle,
} from "react-native"
import { Text, Button } from "app/components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { spacing, typography } from "../theme"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { AppStackParamList } from "../navigators/AppNavigator"

const welcomeImage = require("../../assets/images/terms.png")

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen(_props) {
  const { navigation } = _props
  const { connectionStore } = useStores()

  const logout = async () => {
    connectionStore.disconnect()
    navigation.navigate("Login")
  }

  return (
    <SafeAreaView style={$container}>
      <StatusBar backgroundColor={"black"} />
      <Image source={welcomeImage} style={$backgroundImage} resizeMode="cover" />
      <View style={$darkOverlay} />
      <ScrollView contentContainerStyle={$contentOverlay}>
        <View style={$topContainer}>
          <Text tx="welcomeScreen.starting" style={$headerText} preset="heading" />
          <View style={$bottomContainer}>
            <Text tx="welcomeScreen.about" preset="subheading" style={$topOverlayText} />

            <Button
              onPress={logout}
              style={$logoutButton}
              textStyle={$buttonText}
              tx="common.back"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
})

type WelcomeScreenNavigationProp = StackNavigationProp<AppStackParamList, "Welcome">

export const WelcomeScreenWrapper = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>()
  const route = { params: {} }

  const wrappedNavigation = {
    ...navigation,
    navigate: (screen: keyof AppStackParamList) => {
      if (screen === "Login") {
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        })
      } else {
        navigation.navigate(screen)
      }
    },
  }

  return <WelcomeScreen navigation={wrappedNavigation as any} route={route as any} />
}

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: "black",
}

const $logoutButton: ViewStyle = {
  marginTop: spacing.sm,
  backgroundColor: "transparent",
  borderWidth: 1,
  borderRadius: 15,
  borderColor: "rgba(256, 256, 256, 0.8)",
}

const $buttonText: TextStyle = {
  color: "rgba(256, 256, 256, 0.8)",
  fontSize: 20,
  letterSpacing: -0.6,
  fontFamily: typography.fonts.inter.light,
}

const $topContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 1,
  flexBasis: "57%",
  justifyContent: "space-between",
  paddingHorizontal: spacing.lg,
  overflow: "hidden",
}

const $darkOverlay: ViewStyle = {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: "rgba(0, 0, 0, 0.6)",
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
  justifyContent: "space-between",
}

const $headerText: TextStyle = {
  marginTop: spacing.xxxl,
  marginLeft: spacing.sm,
  fontFamily: typography.fonts.inter.semiBold,
  fontSize: 48,
  letterSpacing: -0.6,
  color: "rgba(256, 256, 256, 0.9)",
  lineHeight: 52,
}

const $topOverlayText: TextStyle = {
  marginBottom: spacing.xl + spacing.lg,
  color: "rgba(256, 256, 256, 0.7)",
  fontFamily: typography.fonts.inter.light,
  fontSize: 21,
  letterSpacing: -0.6,
  lineHeight: 24,
  marginHorizontal: spacing.sm,
  marginRight: spacing.lg,
}

const $bottomContainer: ViewStyle = {
  marginBottom: spacing.xxxl + spacing.lg,
}
