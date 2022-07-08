import { rest } from 'msw'
import { ResolutionStatus } from '@/types/group'

function groupMockData() {
  const arrayData = []
  const maxCount = 30
  for (let i = 0; i < maxCount; i += 1) {
    arrayData.push({
      groupId: i,
      title: '崩溃说明',
      crashType: 'Native Crash',
      affectCount: 1000,
      affectUserCount: 800,
      firstSeenVersion: 1656837523000,
      lastSeenVersion: 1656837523000,
      status: ResolutionStatus.UNRESOLVED,
      assignedUserId: 10
    })
  }
  return {
    code: 0,
    data: {
      total: 30,
      rows: arrayData
    }
  }
}

const mocks = [
  rest.post('groups', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(groupMockData()))
  })
]

export default mocks
