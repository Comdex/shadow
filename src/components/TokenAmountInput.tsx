import * as React from 'react';
import { Modal, Button, Input, Typography } from 'antd';
import styles from './index.module.less'
import styled from 'styled-components'
import { SessionContext } from '@/context/SessionContext';
import { WalletContext } from '@/context/WalletContext';
import { BizEnums } from '@/common/enums/BizEnums';

export const TokenAmountInput = (props) => {
  let { amountInput, setAmountInput, tagName, setAmountToTriggerWallet } = props;
  let sessionData = React.useContext(SessionContext);
  let walletData = React.useContext(WalletContext);

  return <>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>token amount</div>
      <div>
        <span style={{ 'fontSize': '0.6rem', color: 'gray', fontWeight: '1500' }}>
          {BizEnums.Deposit == tagName ? 'wallet' : 'shielded'} balance:
          {BizEnums.Deposit == tagName ? (sessionData.account ? walletData.balance : 0) : (sessionData.account ? sessionData.account.secret.balance : 0)} Mina </span>
        <span onClick={() => {
          console.log('set max AmountInput...');
          setAmountInput(BizEnums.Deposit == tagName ? (sessionData.account ? walletData.balance : 0) : (sessionData.account ? sessionData.account.secret.balance : 0))
        }} style={{ 'color': 'green' }}>
          Max
        </span>
      </div>
    </div>
    <div>
      <Input placeholder="token amount" value={props.amountInput} onChange={e => {
        setAmountInput(e.target.value);
      }} id={'tokenAmountInput'} />
    </div>
  </>
}


