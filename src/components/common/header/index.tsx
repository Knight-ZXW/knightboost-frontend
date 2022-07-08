import React, { FC, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Dropdown, Layout, Menu, MenuProps } from 'antd'
import {
  LoadingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons'
import Breadcrumb from '@/components/common/breadcrumb'
import { Icon } from '@iconify/react'
import { oidcLogout } from '@/config/oidc_setting'
import { useAppDispatch, useAppSelector } from '@/store/redux-hooks'
import { selectUserInfo, setUserInfo } from '@/store/slicers/userSlice'
import {
  setCollapsed as setCollapsedGlobal,
  setMenuMode
} from '@/store/slicers/appSlice'

import classNames from 'classnames'
import style from './Header.module.less'

const Header: FC = () => {
  const dispatch = useAppDispatch()
  const userInfo = useAppSelector(selectUserInfo)
  const menuMode = useAppSelector((state) => state.app.menuMode)
  const history = useHistory()
  const { username = '-' } = userInfo
  const firstWord = username.slice(0, 1)
  const [collapsed, setCollapsed] = useState(false)
  const [loading, setLoading] = useState(false)
  const logout = async () => {
    if (userInfo.is_oidc_user) {
      setLoading(true)
      await oidcLogout()
      dispatch(setUserInfo({})) // 清除用户信息 下同
    } else {
      dispatch(setUserInfo({}))
      history.replace({ pathname: '/login' })
    }
  }

  // const rightMenuItems: MenuProps['items'] = [
  //   <Menu.Item onClick={logout}>
  //     <span className="ant-btn-link">退出登录</span>
  //     {loading && <LoadingOutlined />}
  //   </Menu.Item>
  // ]

  const rightMenuItems: MenuProps['items'] = [
    {
      label: '退出登录',
      key: 'logOut',
      onClick: logout,
      icon: loading && <LoadingOutlined />
    }
  ]
  const menu = <Menu items={rightMenuItems} />

  const layoutMenuItems: MenuProps['items'] = [
    {
      label: '布局方式',
      key: 'layoutType',
      children: [
        {
          label: '并排布局',
          key: 'alignLayout',
          onClick: () => {
            dispatch(setMenuMode('vertical'))
          }
        },
        {
          label: '头部布局',
          key: 'topLayout',
          onClick: () => {
            dispatch(setMenuMode('horizontal'))
          }
        }
      ]
    }
  ]
  const setting = <Menu items={layoutMenuItems} />

  const toggle = (): void => {
    setCollapsed(!collapsed)
    dispatch(setCollapsedGlobal(!collapsed))
  }

  return (
    <Layout.Header
      className={classNames(style.header, {
        [style.horizontal]: menuMode === 'horizontal'
      })}
    >
      {menuMode === 'vertical' && (
        <>
          <div className={style.toggleMenu} onClick={toggle}>
            {collapsed ? (
              <MenuUnfoldOutlined className={style.trigger} />
            ) : (
              <MenuFoldOutlined className={style.trigger} />
            )}
          </div>
          {/* 面包屑 */}
          <Breadcrumb />
        </>
      )}

      {/* 右上角 */}
      <Dropdown className={`fr ${style.content}`} overlay={menu}>
        <span className={style.user}>
          <span className="avatar">{firstWord}</span>
          <span>{username}</span>
        </span>
      </Dropdown>
      <Dropdown className={`fr ${style.content}`} overlay={setting}>
        <span className={style.preference}>
          <Icon icon="emojione:gear" color="blue" />
        </span>
      </Dropdown>
      <div className={`fr ${style.content}`}>
        <a
          href="https://github.com/hsl947/react-antd-multi-tabs-admin"
          target="_blank"
          rel="noopener noreferrer"
          title="view github"
        >
          <img
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjQwcHgiIGhlaWdodD0iNDBweCIgdmlld0JveD0iMTIgMTIgNDAgNDAiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMTIgMTIgNDAgNDAiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxwYXRoIGZpbGw9IiMzMzMzMzMiIGQ9Ik0zMiAxMy40Yy0xMC41IDAtMTkgOC41LTE5IDE5YzAgOC40IDUuNSAxNS41IDEzIDE4YzEgMC4yIDEuMy0wLjQgMS4zLTAuOWMwLTAuNSAwLTEuNyAwLTMuMiBjLTUuMyAxLjEtNi40LTIuNi02LjQtMi42QzIwIDQxLjYgMTguOCA0MSAxOC44IDQxYy0xLjctMS4yIDAuMS0xLjEgMC4xLTEuMWMxLjkgMC4xIDIuOSAyIDIuOSAyYzEuNyAyLjkgNC41IDIuMSA1LjUgMS42IGMwLjItMS4yIDAuNy0yLjEgMS4yLTIuNmMtNC4yLTAuNS04LjctMi4xLTguNy05LjRjMC0yLjEgMC43LTMuNyAyLTUuMWMtMC4yLTAuNS0wLjgtMi40IDAuMi01YzAgMCAxLjYtMC41IDUuMiAyIGMxLjUtMC40IDMuMS0wLjcgNC44LTAuN2MxLjYgMCAzLjMgMC4yIDQuNyAwLjdjMy42LTIuNCA1LjItMiA1LjItMmMxIDIuNiAwLjQgNC42IDAuMiA1YzEuMiAxLjMgMiAzIDIgNS4xYzAgNy4zLTQuNSA4LjktOC43IDkuNCBjMC43IDAuNiAxLjMgMS43IDEuMyAzLjVjMCAyLjYgMCA0LjYgMCA1LjJjMCAwLjUgMC40IDEuMSAxLjMgMC45YzcuNS0yLjYgMTMtOS43IDEzLTE4LjFDNTEgMjEuOSA0Mi41IDEzLjQgMzIgMTMuNHoiLz48L3N2Zz4="
            alt="github"
            style={{ height: '26px' }}
          />
        </a>
      </div>
    </Layout.Header>
  )
}
export default Header
