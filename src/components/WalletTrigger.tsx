import * as React from 'react';
import { Modal, Button, Input, Typography } from 'antd';
import styles from './index.module.less'
import { WalletPluginPanelContext } from '@/context/PageContext'

const centerStyle = {
  'display': 'flex',
  'justifyContent': 'center',
  'alignItems': 'center'
}

export const WalletTrigger = () => {
  let walletPluginPanelContext = React.useContext(WalletPluginPanelContext);
  return (
    <div style={centerStyle}>
      <Button className={styles.encryptBtn} onClick={() => { walletPluginPanelContext.setVisible(true); }}> Connect Wallet </Button>
    </div >
  );
}
