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
import { ShadowContext, ShadowData } from './context/ShadowContext'

ReactDOM.render(
  // <React.StrictMode>
  <ShadowContext.Provider value={new ShadowData()}>
    <WalletContext.Provider value={new WalletData()}>
      <WalletPluginPanelContext.Provider value={{ setVisible: () => { console.log('default WalletPluginPanelContext'); }, targetBtn: WalletPluginPanelBtnEnums.Sign, currentCallBack: () => { console.log('default currentCallBack'); }, amount: 0 }}>
        <SessionContext.Provider value={new SessionData()}>
          <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
        </SessionContext.Provider>
      </WalletPluginPanelContext.Provider>
    </WalletContext.Provider>
  </ShadowContext.Provider>
  // </React.StrictMode>
  ,
  document.getElementById('root')
)
