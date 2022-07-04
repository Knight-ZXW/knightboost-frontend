import React, { FC, useState } from 'react'
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
  const { status } = props
  const defaultValue = groupStateOptions.find((item) => item.value === status)
  console.log('defaultValue is ', defaultValue)

  // const [status, setStatus] = useState(defaultStatus)

  const handleChange = (value: { value: string; label: React.ReactNode }) => {
    console.log(value) // { value: "lucy", key: "lucy", label: "Lucy (101)" }
    // setStatus(ResolutionStatus[value.value])
  }

  return (
    <Select size="small" style={{ width: '120px' }} onChange={handleChange}>
      {groupStateOptions.map((d) => (
        <Option key={d.value} value={d.value}>
          {d.label}
        </Option>
      ))}
    </Select>
  )
}

export default GroupStateSelect
