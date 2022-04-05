import { WalletPluginPanelBtnEnums } from '@/common/enums/WalletPluginPanelBtnEnums';
import React from 'react'

export interface WalletPluginPanelContextIntf {
  setVisible: any;
  targetBtn: WalletPluginPanelBtnEnums;
  currentCallBack: any;
  amount: number;
}

export const WalletPluginPanelContext = React.createContext<WalletPluginPanelContextIntf>({setVisible: ()=>{}, targetBtn: WalletPluginPanelBtnEnums.Sign, currentCallBack: ()=>{}, amount:0});
