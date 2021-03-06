/* eslint-disable */
import React, { FC, useCallback, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Layout, Menu, MenuProps } from 'antd'

import { flattenRoutes, getKeyName } from '@/assets/js/publicFunc'
import menus from '@/route/routes'
import logo from '@/assets/img/logo.png'
import { useAppSelector } from '@/store/redux-hooks'
import { selectUserInfo } from '@/store/slicers/userSlice'
import { selectCollapsed } from '@/store/slicers/appSlice'

import styles from './Menu.module.less'
import { convertToAntvMenu } from '@/components/common/menu/antv-menu-util'
import {MenuRoute} from "@/route/types";

const { Header } = Layout

const { SubMenu } = Menu
const flatMenu = flattenRoutes(menus)

type MenuType = CommonObjectType<string>

interface MyMenuProps {
  menuMode: 'horizontal' | 'vertical'
}

const MenuView: FC<MyMenuProps> = ({ menuMode }) => {
  const userInfo = useAppSelector(selectUserInfo)
  const collapsed = useAppSelector(selectCollapsed)

  const { pathname } = useLocation()
  const { tabKey: curKey = 'home' } = getKeyName(pathname)
  const [current, setCurrent] = useState(curKey)
  console.log('select key is ',current)
  // 获取用户权限，根据权限过滤菜单
  const { permission = [] } = userInfo

  // 递归逐级向上获取最近一级的菜单，并高亮
  let higherMenuKey: (checkKey?: string, path?: string) => (string);
  higherMenuKey = useCallback(
    (checkKey = 'home', path = pathname) => {
      if (
        checkKey === '403' ||
        flatMenu.some((item: MenuType) => item.key === checkKey)
      ) {
        return checkKey
      }
      let matches =path.match(/(.*)\//g)
      const higherPath = matches![0].replace(/(.*)\//, '$1')
      const {tabKey} = getKeyName(higherPath)
      return higherMenuKey(tabKey, higherPath)
    },
    [pathname]
  );

  useEffect(() => {
    const { tabKey } = getKeyName(pathname)
    const higherKey = higherMenuKey(tabKey)
    setCurrent(higherKey)
  }, [higherMenuKey, pathname])

  // 菜单点击事件
  const handleClick = function ({key}:{key:string}) {
    setCurrent(key)
  }

  let menus3 = convertToAntvMenu(menus, (item) => {
    return permission.filter((ele) => item.key === ele.code || true).length > 0
  })

  const setDefaultKey = flatMenu
    .filter((item: MenuRoute) => item.type === 'subMenu')
    .map(item=>item.key as string)
    .reduce((prev: string[], next: string) => {
      return [...prev, next];
    }, [])

  const showKeys = collapsed ? [] : setDefaultKey
  const LogLink = () => (
    <Link to={{ pathname: '/' }}>
      <div className="flex items-center logo">
        <img alt="logo" src={logo} width="32" />
        {!collapsed && <h1>Antd多页签模板</h1>}
      </div>
    </Link>
  )
  if (menuMode === 'horizontal')
    return (
      <Header className="flex header">
        <LogLink />
        <div className={styles.autoWidthMenu}>
          <Menu
            mode="horizontal"
            onClick={handleClick}
            selectedKeys={[current]}
            items={menus3}
          />
        </div>
      </Header>
    )
  return (
    <Layout.Sider
      theme={"dark"}
      collapsed={collapsed}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        userSelect: 'none'
      }}
      width={220}
    >
      <LogLink />
      <Menu
        theme={"dark"}
        defaultOpenKeys={showKeys}
        mode="inline"
        onClick={handleClick}
        items={menus3}
        selectedKeys={[current]}
      />
    </Layout.Sider>
  )
}

export default MenuView
