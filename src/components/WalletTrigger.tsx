import * as React from 'react';
import { Modal, Button, Input, Typography } from 'antd';
import styles from './index.module.less'
import { WalletPluginPanelContext } from '@/context/PageContext'
import { BizEnums } from '@/common/enums/BizEnums';
import { SessionContext } from '@/context/SessionContext';

const centerStyle = {
  'display': 'flex',
  'justifyContent': 'center',
  'alignItems': 'center'
}

export const WalletTrigger = (props) => {
  let { tagName } = props;
  let walletPluginPanelContext = React.useContext(WalletPluginPanelContext);
  let sessionData = React.useContext(SessionContext);

  let isDisabled = sessionData.account ? false : true;

  let btnTxt = '';
  switch (tagName) {
    case BizEnums.Deposit:
      btnTxt = 'Deposit';
      break;
    case BizEnums.Transfer:
      btnTxt = 'Transfer';
      break;
    default:
      btnTxt = 'Withdraw'
      break;
  }

  return (
    <div style={centerStyle}>
      <Button className={styles.encryptBtn}
        onClick={() => { walletPluginPanelContext.setVisible(true); }}
        disabled={isDisabled}
      >
        {btnTxt}
      </Button>
    </div >
  );
}
