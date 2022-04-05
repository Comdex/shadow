import * as React from 'react';
import { Modal, Button, Input, Typography } from 'antd';
import styles from './index.module.less'
import styled from 'styled-components'
import { SessionContext } from '@/context/SessionContext';
import { WalletContext } from '@/context/WalletContext';

export const TransferTokenAmountInput = (props) => {
  const [amountInput, setAmountInput] = React.useState(0);
  let sessionData = React.useContext(SessionContext);
  return <>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>token amount</div>
      <div>
        <span style={{ 'fontSize': '0.6rem', color: 'gray', fontWeight: '1500' }}>
          shielded balance:
          {sessionData.account ? sessionData.account.secret.balance : 0} Mina </span>
        <span onClick={() => { console.log('set max AmountInput...'); setAmountInput(sessionData.account ? sessionData.account.secret.balance : 0) }} style={{ 'color': 'green' }}>Max</span>
      </div>
    </div>
    <div>
      <Input placeholder="token amount" value={amountInput} />
    </div>
  </>
}


