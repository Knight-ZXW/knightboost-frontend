export type BaseGroup = {
  groupId: String
  title: String
  subTitle: String
  affectCount: Number
  affectDeviceCount: Number
  firstSeenVersion: String
  lastSeenVersion: String
  status: String
  assignedUserId: Number
}

export enum ResolutionStatus {
  UNRESOLVED = 'unresolved',
  PROCESSING = 'processing',
  RESOLVED = 'resolved',
  IGNORED = 'ignored'
}
