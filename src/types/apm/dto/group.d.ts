export interface UpdateGroupStatus {
  appKey: String
  groupId: String
  status: String
}

export interface getGroupList {
  appKey: String
  eventName: String
  page: Number
  pageSize: Number
}
