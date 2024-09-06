import { Instance, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { api } from "../services/api"
import { BarcodeScanningResult } from "expo-camera"
import { saveString, loadString, remove } from "../utils/storage"

/**
 * Represents a connection to an E2B instance
 */
export const ConnectionStoreModel = types
  .model("ConnectionStore")
  .props({
    livekitUrl: types.string,
    token: types.string,
    error: types.maybeNull(types.string),
  })
  .actions(withSetPropAction)
  .actions((self) => ({
    clearError() {
      self.setProp("error", null)
    },
  }))
  .actions((self) => ({
    async saveLivekitUrl(url: string) {
      await saveString("livekit_url", url)
      self.setProp("livekitUrl", url)
      console.log("cached url and set livekitUrl as ", self.livekitUrl)
    },

    async loadLivekitUrl() {
      const url = await loadString("livekit_url")
      if (url) {
        self.setProp("livekitUrl", url)
      }
    },

    async clearLivekitUrl() {
      await remove("livekit_url")
    },
  }))
  .actions((self) => ({
    async local_connect(scanningResult: BarcodeScanningResult) {
      try {
        console.log("called local connect")
        const data = JSON.parse(scanningResult.data)
        await self.saveLivekitUrl(data.livekit_server)
      } catch (error) {
        console.error("Failed to connect", error)
        self.setProp("error", "Failed to connect to the sandbox")
      }
    },

    async set_token() {
      try {
        const result = await api.token()
        console.log("api get token response", result)
        if (result.kind === "ok") {
          self.setProp("token", result.token)
          console.log("set prop token as ", self.token)
          self.clearError()
        } else {
          self.setProp("error", "Response from API connect not ok")
          throw new Error("Get token failed")
        }
      } catch (error) {
        console.error("Failed to get token", error)
        self.setProp("error", "Failed to get token from the server")
      }
    },

    disconnect() {
      self.clearLivekitUrl()
      self.setProp("token", "")
      self.clearError()
    },
  }))

export interface ConnectionStore extends Instance<typeof ConnectionStoreModel> {}
