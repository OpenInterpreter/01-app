// TODO: write documentation about fonts and typography along with guides on how to add custom fonts in own
// markdown file and add links from here

import { Platform } from "react-native"
import {
  SpaceGrotesk_300Light as spaceGroteskLight,
  SpaceGrotesk_400Regular as spaceGroteskRegular,
  SpaceGrotesk_500Medium as spaceGroteskMedium,
  SpaceGrotesk_600SemiBold as spaceGroteskSemiBold,
  SpaceGrotesk_700Bold as spaceGroteskBold,
} from "@expo-google-fonts/space-grotesk"

export const customFontsToLoad = {
  spaceGroteskLight,
  spaceGroteskRegular,
  spaceGroteskMedium,
  spaceGroteskSemiBold,
  spaceGroteskBold,
  ppEditorialNewRegular: require("../../assets/fonts/PP_Editorial_New_Regular.otf"),
  ppEditorialNewUltralight: require("../../assets/fonts/PP_Editorial_New_Ultralight.otf"),
  ppEditorialNewUltrabold: require("../../assets/fonts/PP_Editorial_New_Ultrabold.otf"),
  interBold: require("../../assets/fonts/Inter-Bold.otf"),
  interSemiBold: require("../../assets/fonts/Inter-SemiBold.otf"),
  interMedium: require("../../assets/fonts/Inter-Medium.otf"),
  interRegular: require("../../assets/fonts/Inter-Regular.otf"),
  interLight: require("../../assets/fonts/Inter-Light.otf"),
  interThin: require("../../assets/fonts/Inter-Thin.otf"),
}

const fonts = {
  spaceGrotesk: {
    // Cross-platform Google font.
    light: "spaceGroteskLight",
    normal: "spaceGroteskRegular",
    medium: "spaceGroteskMedium",
    semiBold: "spaceGroteskSemiBold",
    bold: "spaceGroteskBold",
  },
  helveticaNeue: {
    // iOS only font.
    thin: "HelveticaNeue-Thin",
    light: "HelveticaNeue-Light",
    normal: "Helvetica Neue",
    medium: "HelveticaNeue-Medium",
  },
  courier: {
    // iOS only font.
    normal: "Courier",
  },
  sansSerif: {
    // Android only font.
    thin: "sans-serif-thin",
    light: "sans-serif-light",
    normal: "sans-serif",
    medium: "sans-serif-medium",
  },
  monospace: {
    // Android only font.
    normal: "monospace",
  },
  ppEditorialNew: {
    // Custom PP Editorial New font
    ultralight: "ppEditorialNewUltralight",
    regular: "ppEditorialNewRegular",
    ultrabold: "ppEditorialNewUltrabold",
  },
  inter: {
    thin: "interThin",
    light: "interLight",
    regular: "interRegular",
    medium: "interMedium",
    semiBold: "interSemiBold",
    bold: "interBold",
  },
}

export const typography = {
  /**
   * The fonts are available to use, but prefer using the semantic name.
   */
  fonts,
  /**
   * The primary font. Used in most places.
   */
  primary: fonts.inter,
  /**
   * An alternate font used for perhaps titles and stuff.
   */
  secondary: Platform.select({ ios: fonts.inter, android: fonts.inter }),
  /**
   * Lets get fancy with a monospace font!
   */
  code: Platform.select({ ios: fonts.inter, android: fonts.inter }),
}

// Add this type definition
export type Weights = keyof typeof typography.primary
