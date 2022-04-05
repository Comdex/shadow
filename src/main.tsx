import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import '@/styles/global.less'
import { renderRoutes } from 'react-router-config'
import routes from './routes'
import { WalletPluginPanelContext } from './context/PageContext'
import { SessionContext } from "./context/SessionContext"
import { WalletPluginPanelBtnEnums } from './common/enums/WalletPluginPanelBtnEnums'

ReactDOM.render(
  // <React.StrictMode>
  <WalletPluginPanelContext.Provider value={{ setVisible: () => { console.log('default WalletPluginPanelContext'); }, targetBtn: WalletPluginPanelBtnEnums.Sign, currentCallBack: () => { console.log('default currentCallBack'); } }}>
    <SessionContext.Provider value={{}}>
      <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
    </SessionContext.Provider>
  </WalletPluginPanelContext.Provider>
  // </React.StrictMode>
  ,
  document.getElementById('root')
)
