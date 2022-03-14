import React from 'react'

declare namespace CustomRouter {
  interface Route {
    name: string
    path: string
    params?: string
    exact?: boolean
    component: React.FunctionComponent<any>
  }
}
