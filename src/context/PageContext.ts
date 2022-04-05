import React from 'react'

export interface WalletPluginPanelContextIntf {
  setVisible: any;
}

export const WalletPluginPanelContext = React.createContext<WalletPluginPanelContextIntf>({setVisible: ()=>{}});
