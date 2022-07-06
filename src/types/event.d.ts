import { PlatformKey } from '@/data/platformCategories'

export interface Event {
  id: String
  eventName: String
  appKey: String
  platform: PlatformKey
  deviceId: String
  userId: String
  groupId: String
}
