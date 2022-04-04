import loadable from '@loadable/component'
import Layout, { H5Layout } from '@/layouts'
import { RouteConfig } from 'react-router-config'
import HomePage from '@/pages/HomePage'
import {DepositPage} from '@/pages/DepositPage/DepositPage'
import {TransferPage} from '@/pages/TransferPage/TransferPage'
import {WithdrawPage} from '@/pages/WithdrawPage/WithdrawPage'

const routesConfig: RouteConfig[] = [
  {
    path: '/',
    exact: false,
    component: HomePage,
    routes: [
      {
        path: '/deposit',
        exact: true,
        component: DepositPage
      },
      {
        path: '/transfer',
        exact: true,
        component: TransferPage
      },
      {
        path: '/withdraw',
        exact: true,
        component: WithdrawPage
      }
    ]
  }
]

export default routesConfig
