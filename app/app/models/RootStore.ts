import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { ConnectionStoreModel } from "./ConnectionStore"
import { SettingStoreModel } from "./SettingStore"

/**
 * A RootStore model.
 */
export const RootStoreModel = types
  .model("RootStore")
  .props({
    settingStore: types.optional(SettingStoreModel, {}),
    connectionStore: types.optional(ConnectionStoreModel, {
      livekitUrl: "",
      token: "",
    }),
  })
  .actions((self) => ({
    afterCreate() {
      // Reset settingStore to its default state
      self.settingStore = SettingStoreModel.create({})
    },
  }))

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
