// eslint-disable-next-line no-unused-vars
import { MLApiClient } from '@/apiclient'
import { BaseGroup, ResolutionStatus } from '@/types/group'
import { UpdateGroupStatus } from '@/types/dto/group'

export default {
  a: Number
}

export function getGroups(): Promise<BaseGroup[]> {
  return MLApiClient.post<BaseGroup[]>('/groups')
}

export function updateIssueStatus(updateModel: UpdateGroupStatus) {
  return MLApiClient.post('issue/status/update', updateModel)
}
