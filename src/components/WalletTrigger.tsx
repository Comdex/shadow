import * as React from 'react';
import { Modal, Button, Input, Typography } from 'antd';
import styles from './index.module.less'
import { WalletPluginPanelContext } from '@/context/PageContext'
import { BizEnums } from '@/common/enums/BizEnums';
import { SessionContext } from '@/context/SessionContext';
import { WalletContext } from '@/context/WalletContext';
import styled from 'styled-components'
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom'

const AntModalWrapper = styled.div`
  .ant-modal-content {
    border-radius: 8px;
    width:25rem;
    padding:1.2rem;
    background-color: #FFFFCC;
  }
`

const centerStyle = {
  'display': 'flex',
  'justifyContent': 'center',
  'alignItems': 'center'
}

export const WalletTrigger = (props) => {
  const [amountToWallet, setAmountToWallet] = React.useState(0);
  const history = useHistory();
  const location = useLocation();

  // let { tagName, setAmountToWalletCallback } = props;
  // setAmountToWalletCallback(setAmountToWallet);
  let { tagName } = props;

  let walletPluginPanelContext = React.useContext(WalletPluginPanelContext);
  let sessionData = React.useContext(SessionContext);
  let walletData = React.useContext(WalletContext);

  let isDisabled = sessionData.account ? false : true;

  let callBackFunc = (amountToWallet: number) => { };
  let btnTxt = '';
  switch (tagName) {
    case BizEnums.Deposit:
      btnTxt = 'Deposit';
      callBackFunc = (amountToWallet) => {
        console.log('Deposit to trigger wallet and callback...');
        console.log('sessionData.account.secret.balance before:' + sessionData.account.secret.balance);
        sessionData.account.secret.balance += amountToWallet;
        console.log('sessionData.account.secret.balance later:' + sessionData.account.secret.balance);

        console.log("location:", location);
        history.push(location.pathname);
      };
      break;
    case BizEnums.Transfer:
      btnTxt = 'Transfer';
      callBackFunc = (amountToWallet) => {
        console.log('Transfer to trigger wallet and callback...');
        sessionData.account.secret.balance -= amountToWallet;

        console.log("location:", location);
        history.push(location.pathname);
      };
      break;
    default:
      btnTxt = 'Withdraw'
      callBackFunc = (amountToWallet) => {
        console.log('Withdraw to trigger wallet and callback...');
        sessionData.account.secret.balance -= amountToWallet;

        console.log("location:", location);
        history.push(location.pathname);
      };
      break;
  }

  return (
    <div style={centerStyle}>
      <Button className={styles.encryptBtn}
        onClick={() => {
          let xamountToWallet = (document.querySelector('#tokenAmountInput') as HTMLInputElement).value;
          console.log("deposit " + xamountToWallet + "trigger wallet...");
          if (!xamountToWallet) {
            console.log("cannot trigger wallet...");
            return;
          }

          walletPluginPanelContext.currentCallBack = callBackFunc;
          walletPluginPanelContext.amount = Number.parseInt(xamountToWallet);
          walletPluginPanelContext.setVisible(true);
        }}
        disabled={isDisabled}
      >
        {btnTxt}
      </Button>
    </div >
  );
}
