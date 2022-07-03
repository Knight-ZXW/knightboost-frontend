import React, { FC, useEffect, useState } from 'react'
import { Card } from 'antd'
import { useTranslation } from 'react-i18next'
import LikeButton from '@/components/test/likeButton'
import { getGroups } from '@/api/apm'
import GroupList from '@/components/groups/groupList'

const MainDashboard: FC = () => {
  const { t } = useTranslation()
  const [pageListReq, setPageListReq] = useState({})
  const [groups, setGroups] = useState([])
  useEffect(() => {
    console.log('now groups', groups)
  }, [pageListReq])
  return (
    <div className="container">
      <GroupList groups={groups} />
      <div className="flex justify-between">
        <div>
          <Card>
            <h1>{t('submit')}</h1>
            <div>
              <p className="text-4xl font-semibold">2001</p>
            </div>
          </Card>
        </div>
        <div>
          <Card>
            <h1>今日用户启动次数1</h1>
          </Card>
        </div>
        <div>
          <Card>
            <h1>今日崩溃次数</h1>
          </Card>
        </div>
        <div>
          <Card>
            <h1>今日崩溃影响设备数</h1>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default MainDashboard
