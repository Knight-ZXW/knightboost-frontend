// eslint-disable-next-line no-unused-vars
import { MLApiClient } from '@/apiclient'
import { BaseGroup } from '@/types/group'

export default {
  a: Number
}

export function getGroups(): Promise<BaseGroup[]> {
  return MLApiClient.post<BaseGroup[]>('/groups')
}
