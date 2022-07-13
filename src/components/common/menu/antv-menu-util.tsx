/* eslint-disable */
import React, {FC, useCallback, useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined
} from '@ant-design/icons'
import type {MenuProps} from 'antd'
import {Menu} from 'antd'
import MyIconFont from "@/components/common/myIconfont";
import styles from "@/components/common/menu/Menu.module.less";
import {MenuRoute} from "@/route/types";

type MenuType = CommonObjectType<string>

const subMenuTitle = (data: MenuType): JSX.Element => {
  const {icon: MenuIcon, iconfont} = data
  return (
    <div className="flex items-center">
      {iconfont ? <MyIconFont type={iconfont}/> : !!MenuIcon && <MenuIcon/>}
      <span className={styles.noselect}>{data.name}</span>
    </div>
  )
}

type MenuItem = Required<MenuProps>['items'][number]

function createMenuItem(item: CommonObjectType) {
  const {path, name: label, key, type, icon, exact} = item
  return {
    key,
    label: <Link to={path}>{subMenuTitle(item)}</Link>
  }
}

function createSubMenu(item: CommonObjectType) {
  const {path, name, key, type, icon, exact, routes} = item
  const menu = {}
}

function convertToMenu(menuRoute: MenuRoute, filter: (item: MenuRoute) => Boolean): MenuItem | null {
  if (filter && !filter(menuRoute)) {
    return null
  }
  let isSubMenu = menuRoute.type === 'subMenu'
  let menuItems = new Array<MenuItem>()
  if (isSubMenu) {
    let routes = menuRoute.routes!
    for (let route of routes) {
      let menu = convertToMenu(route, filter)
      if (menu) {
        menuItems.push(menu)
      }
    }

  }
  if (menuItems.length > 0) {
    return {
      key: menuRoute.key,
      label: isSubMenu ? subMenuTitle(menuRoute) :
        <Link to={menuRoute.path}>{subMenuTitle(menuRoute)}</Link>,
      children: menuItems ? menuItems : undefined
    }
  } else {
    return {
      key: menuRoute.key,
      label: isSubMenu ? subMenuTitle(menuRoute) :
        <Link to={menuRoute.path}>{subMenuTitle(menuRoute)}</Link>,
    }
  }


}

export function convertToAntvMenu(menuRoutes: Array<MenuRoute>, filter: (item: MenuRoute) => Boolean):Array<MenuItem> {
  let menus = new Array<MenuItem>()
  menuRoutes.forEach(item => {
    const menu = convertToMenu(item, filter)
    if (menu != null) {
      menus.push(menu)
    }
  })
  return menus
}
