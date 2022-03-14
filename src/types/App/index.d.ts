import React from 'react'

declare namespace State {
  interface App {
    chain: string
    // TODO to add during dev. By coldStar





  }
}
declare namespace CustomRouter {
  interface Route {
    name: string
    path: string
    params?: string
    exact?: boolean
    component: React.FunctionComponent<any>
  }
}
