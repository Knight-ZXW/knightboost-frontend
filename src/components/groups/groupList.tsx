import React, { FC, useEffect, useState } from 'react'
import { BaseGroup } from '@/types/group'
import { Button, Table } from 'antd'
import MyTable from '@/components/common/table'
import { getGroups } from '@/api/apm'
import GroupStateSelect from '@/components/issue/GroupStateSelect'

interface GroupListProps {}

const columns = [
  {
    title: 'id',
    dataIndex: 'groupId',
    key: 'groupId'
  },
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title'
  },
  {
    title: '影响次数',
    dataIndex: 'affectCount',
    key: 'affectCount'
  },
  {
    title: '影响用户数',
    dataIndex: 'affectUserCount',
    key: 'affectUserCount'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status) => <GroupStateSelect curStatus={status} />
  },

  {
    title: '处理人',
    dataIndex: 'assigneeUserId',
    key: 'assigneeUserId'
  }
]

const GroupList: FC<GroupListProps> = (props) => {
  return (
    <div>
      {/* <Table columns={columns} dataSource={groups} /> */}
      <MyTable apiFun={getGroups} columns={columns} rowKey="groupId" />
    </div>
  )
}

export default GroupList
