import React, { useMemo } from 'react'
import { Route } from 'react-router-dom'
import { CustomRouter } from '../types/App'

export const useRoutes = (contents: CustomRouter.Route[]) =>
  useMemo(() => {
    return contents.map(content => (
      <Route
        exact={content.exact}
        path={`${content.path}${content.params || ''}`}
        key={content.name}
        component={content.component}
      />
    ))
  }, [contents])

export default undefined
