import { Instance, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * Represents a connection to an E2B instance
 */
export const SettingStoreModel = types
  .model("SettingStore")
  .props({
    backup: types.optional(types.boolean, false),
    safety: types.optional(types.boolean, false),
    terms: types.optional(types.boolean, false),
    pushToTalk: types.optional(types.boolean, true),
    wearable: types.optional(types.boolean, false),
    alwaysListening: types.optional(types.boolean, false),
    autorun: types.optional(types.boolean, false),
  })
  .actions(withSetPropAction)
  .actions((self) => ({
    requireStart(sendChat: (message: string) => void) {
      if (self.pushToTalk) {
        sendChat("{REQUIRE_START_ON}")
        console.log("REQUIRE START ON")
      }
    },

    unrequireStart(sendChat: (message: string) => void) {
      if (!self.pushToTalk) {
        sendChat("{REQUIRE_START_OFF}")
        console.log("REQUIRE START OFF")
      }
    },
  }))
  .actions((self) => ({
    autorunOn(sendChat: (message: string) => void) {
      if (self.autorun) {
        sendChat("{AUTORUN_ON}")
        console.log("AUTORUN ON")
      }
    },

    autorunOff(sendChat: (message: string) => void) {
      if (!self.autorun) {
        sendChat("{AUTORUN_OFF}")
        console.log("AUTORUN OFF")
      }
    },
  }))
  .actions((self) => ({
    reset() {
      self.setProp("backup", false)
      self.setProp("safety", false)
      self.setProp("terms", false)
      self.setProp("pushToTalk", true)
      self.setProp("wearable", false)
      self.setProp("alwaysListening", false)
      self.setProp("autorun", false)
    },
  }))

export interface SettingStore extends Instance<typeof SettingStoreModel> {}
