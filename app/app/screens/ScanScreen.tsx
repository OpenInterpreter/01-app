import { BarcodeScanningResult, CameraView, useCameraPermissions } from "expo-camera"
import React, { FC } from "react"
import { ViewStyle, TextStyle, View, Alert } from "react-native"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { Text } from "../components/Text"
import { Button } from "../components/Button"
import { Screen } from "../components/Screen"
import { spacing } from "../theme"
import { observer } from "mobx-react-lite"

interface ScanScreenProps extends AppStackScreenProps<"Scan"> {}

export const ScanScreen: FC<ScanScreenProps> = observer(function ScanScreen(_props) {
  const [permission, requestPermission] = useCameraPermissions()
  const { connectionStore } = useStores()
  const { navigation } = _props

  const handleScan = async (scanningResult: BarcodeScanningResult) => {
    await connectionStore.local_connect(scanningResult)
    await connectionStore.set_token()

    if (connectionStore.error) {
      // handle error
      Alert.alert("Error connecting to your server, please try again")
      connectionStore.clearError()
      navigation.navigate("Login")
      return
    }

    navigation.navigate("Room")
  }

  if (!permission) {
    // Camera permissions are still loading.
    return <View />
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$container}>
        <Text tx="permissions.camera" preset={"bold"} style={$message} />
        <Button tx="common.continue" onPress={requestPermission} preset={"reversed"} />
      </Screen>
    )
  }

  return (
    <View style={$container}>
      <CameraView style={$camera} facing={"back"} onBarcodeScanned={handleScan} />
    </View>
  )
})

const $container: ViewStyle = {
  paddingTop: spacing.lg + spacing.xl,
  paddingHorizontal: spacing.lg,
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "transparent",
}

const $message: TextStyle = {
  textAlign: "center",
  paddingBottom: 10,
  color: "white",
}

const $camera: ViewStyle = {
  flex: 1,
  width: "100%",
  height: "100%",
}
