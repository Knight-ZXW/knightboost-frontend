import React, { FC, useEffect, useState } from 'react'
import { Select } from 'antd'
import { ResolutionStatus } from '@/types/group'

const { Option } = Select

interface GroupState {
  label: string
  value: ResolutionStatus
}

const groupStateOptions:Array<GroupState> =[]
groupStateOptions.push({
  label: '未处理',
  value: ResolutionStatus.UNRESOLVED
})

groupStateOptions.push(  {
  label: '已处理',
  value: ResolutionStatus.RESOLVED
})

groupStateOptions.push(  {
  label: '忽略',
  value: ResolutionStatus.IGNORED
})



interface GroupStateProps {
  curStatus: ResolutionStatus
}

const GroupStateSelect: FC<GroupStateProps> = (props) => {
  const { curStatus } = props

  function getOptionValue(status:ResolutionStatus) :GroupState{
    return groupStateOptions.find((item) => item.value === status)!
  }

  const [status, setStatus] = useState(curStatus)

  const defaultValue = getOptionValue(curStatus)

  const handleChange = (value:ResolutionStatus) => {
    setStatus(value)
  }

  return (
    <Select
      size="small"
      style={{ width: '120px' }}
      value={getOptionValue(status).value}
      onChange={handleChange}
    >
      {groupStateOptions.map((d) => (
        <Option key={d.value} value={d.value}>
          {d.label}
        </Option>
      ))}
    </Select>
  )
}

export default GroupStateSelect
