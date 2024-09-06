import { Linking } from "react-native"

/**
 * Helper for opening a give URL in an external browser.
 *
 * @param {string} url - The URL to open in the browser.
 * @returns {void} - No return value.
 */
export function openLinkInBrowser(url: string) {
  Linking.canOpenURL(url).then((canOpen) => canOpen && Linking.openURL(url))
}
