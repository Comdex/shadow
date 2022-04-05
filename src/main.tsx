import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import '@/styles/global.less'
import { renderRoutes } from 'react-router-config'
import routes from './routes'
import { WalletPluginPanelContext } from './context/PageContext'
import { SessionContext, SessionData } from "./context/SessionContext"
import { WalletPluginPanelBtnEnums } from './common/enums/WalletPluginPanelBtnEnums'
import { WalletContext, WalletData } from './context/WalletContext'

ReactDOM.render(
  // <React.StrictMode>
  <WalletContext.Provider value={new WalletData()}>
    <WalletPluginPanelContext.Provider value={{ setVisible: () => { console.log('default WalletPluginPanelContext'); }, targetBtn: WalletPluginPanelBtnEnums.Sign, currentCallBack: () => { console.log('default currentCallBack'); }, amount: 0 }}>
      <SessionContext.Provider value={new SessionData()}>
        <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
      </SessionContext.Provider>
    </WalletPluginPanelContext.Provider>
  </WalletContext.Provider>
  // </React.StrictMode>
  ,
  document.getElementById('root')
)
