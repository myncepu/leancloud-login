/*
 * routes.js
 * Copyright (C) 2018 yanpengqiang <yan2010@live.com>
 *
 * Distributed under terms of the MIT license.
 */
import {FontIcons} from '../../assets/icons'
// FontIcons??  '../../assets/icons'文件夹中是一组图片
import * as Screens from '../../screens/index'
import _ from 'lodash'

export const MainRoutes = [
  {
    id: 'LoginMenu',
    title: 'Auth',
    icon: FontIcons.login,
    screen: Screens.LoginMenu,
    children: [
      {
        id: 'Login1',
        title: 'Login V1',
        screen: Screens.LoginV1,
        children: []
      },
      {
        id: 'Login2',
        title: 'Login V2',
        screen: Screens.LoginV2,
        children: []
      },
      {
        id: 'SignUp',
        title: 'Sign Up',
        screen: Screens.SignUp,
        children: []
      },
      {
        id: 'password',
        title: 'Password Recovery',
        screen: Screens.PasswordRecovery,
        children: []
      },
    ]
  },
  {
    id: 'Themes',
    title: 'Themes',
    icon: FontIcons.theme,
    screen: Screens.Themes,
    children: []
  },
]

let menuRoutes = _.cloneDeep(MainRoutes)
menuRoutes.unshift({
  id: 'GridV2',
  title: 'Start',
  screen: Screens.GridV2,
  children: []
},)

export const MenuRoutes = menuRoutes
