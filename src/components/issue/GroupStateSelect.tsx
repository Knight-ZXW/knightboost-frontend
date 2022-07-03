import React, { FC } from 'react'
import { Select } from 'antd'
import { ResolutionStatus } from '@/types/group'

const { Option } = Select

interface GroupState {
  label: string
  value: ResolutionStatus
}
const groupStateOptions = [
  {
    label: '未处理',
    value: ResolutionStatus.UNRESOLVED
  },
  {
    label: '已处理',
    value: ResolutionStatus.RESOLVED
  },
  {
    label: '忽略',
    value: ResolutionStatus.IGNORED
  }
]
interface GroupStateProps {
  status: ResolutionStatus
}

const GroupStateSelect: FC<GroupStateProps> = (props) => {
  const options = groupStateOptions.map((d) => (
    <Option key={d.value} value={d.value}>
      {d.label}
    </Option>
  ))

  return (
    <Select size="small" style={{ width: '120px' }} value={props.status}>
      {options}
    </Select>
  )
}

export default GroupStateSelect
