import React, { useRef, FC } from 'react'
import { withRouter } from 'react-router-dom'

import common from '@/api'
import { previewImg } from '@/assets/js/publicFunc'
import MyTable, {AlignType} from '@/components/common/table'

const RoleList: FC = () => {
  const tableRef: RefType = useRef()

  const preview = (url: string) =>
    previewImg(<img src={url} width="100%" alt="" />)
  const columns = [
    {
      title: 'avatar',
      dataIndex: 'picture',
      align: "center" as 'center',
      render: (picture: CommonObjectType<string>) => (
        <span onClick={() => preview(picture.thumbnail)}>
          <img src={picture.thumbnail} width="40" alt="" />
        </span>
      )
    },
    {
      title: 'name',
      dataIndex: 'name',
      align: 'center' as 'center',
      render: (name: CommonObjectType<string>) => `${name.first} ${name.last}`
    },
    {
      title: 'gender',
      dataIndex: 'gender',
      align: 'center' as 'center',
    },
    {
      title: 'phone',
      align: 'center' as 'center',
      dataIndex: 'phone'
    },
    {
      title: 'cell',
      align: 'center' as 'center',
      dataIndex: 'cell',
      sorter: true
    }
  ]
  return (
    <>
      <MyTable
        apiFun={common.getList}
        columns={columns}
        ref={tableRef}
        extraProps={{ results: 10 }}
      />
    </>
  )
}

// @ts-ignore
export default withRouter(RoleList)
