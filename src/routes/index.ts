import loadable from '@loadable/component'
import Layout, { H5Layout } from '@/layouts'
import { RouteConfig } from 'react-router-config'
import Home from '@/pages/home'
import {Deposit} from '@/components/Deposit'
import {Transfer} from '@/components/Transfer'
import {Withdraw} from '@/components/Withdraw'

const routesConfig: RouteConfig[] = [
  {
    path: '/',
    exact: false,
    component: Home,
    routes: [
      {
        path: '/deposit',
        exact: true,
        component: Deposit
      },
      {
        path: '/transfer',
        exact: true,
        component: Transfer
      },
      {
        path: '/withdraw',
        exact: true,
        component: Withdraw
      }
    ]
  }
]

export default routesConfig
