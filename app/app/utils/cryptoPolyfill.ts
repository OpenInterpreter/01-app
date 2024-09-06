import "react-native-get-random-values"
import { Platform } from "react-native"

declare global {
  interface Crypto {
    getRandomValues: <T extends ArrayBufferView | null>(array: T) => T
    randomUUID: () => `${string}-${string}-${string}-${string}-${string}`
  }

  interface Window {
    crypto: Crypto
  }
}

if (Platform.OS !== "web") {
  if (typeof global.crypto !== "object") {
    ;(global as any).crypto = {}
  }

  if (typeof global.crypto.getRandomValues !== "function") {
    global.crypto.getRandomValues = require("react-native-get-random-values").default
  }

  if (typeof global.crypto.randomUUID !== "function") {
    global.crypto.randomUUID = (): `${string}-${string}-${string}-${string}-${string}` => {
      // a UUID generator using crypto.getRandomValues
      const bytes = new Uint8Array(16)
      crypto.getRandomValues(bytes)

      // Set version (4) and variant (2) bits
      bytes[6] = (bytes[6] & 0x0f) | 0x40
      bytes[8] = (bytes[8] & 0x3f) | 0x80

      // Convert to hex string
      const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")

      // Format as UUID
      return `${hex.slice(0, 8)}-${hex.slice(8, 4)}-${hex.slice(12, 4)}-${hex.slice(
        16,
        4,
      )}-${hex.slice(20)}` as `${string}-${string}-${string}-${string}-${string}`
    }
  }
}
