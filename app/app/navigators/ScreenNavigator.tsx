import { createStackNavigator, StackScreenProps } from "@react-navigation/stack"
import { CompositeScreenProps } from "@react-navigation/native"
import React from "react"
import { SettingsScreen, HeroScreen } from "../screens"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"

export type ScreenStackParamList = {
  Hero: undefined
  Settings: undefined
}

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type ScreenStackScreenProps<T extends keyof ScreenStackParamList> = CompositeScreenProps<
  StackScreenProps<ScreenStackParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>
const Stack = createStackNavigator<ScreenStackParamList>()

/**
 * This is the main navigator for the demo screens with a bottom tab bar.
 * Each tab is a stack navigator with its own set of screens.
 *
 * More info: https://reactnavigation.org/docs/bottom-tab-navigator/
 * @returns {JSX.Element} The rendered `DemoNavigator`.
 */
export function ScreenNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Hero" component={HeroScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  )
}
