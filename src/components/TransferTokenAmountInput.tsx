import * as React from 'react';
import { Modal, Button, Input, Typography } from 'antd';
import styles from './index.module.less'
import styled from 'styled-components'
import { SessionContext } from '@/context/SessionContext';
import { WalletContext } from '@/context/WalletContext';
import { useHistory, useLocation } from 'react-router';

export const TransferTokenAmountInput = (props) => {
  let { amountInput } = props;

  let history = useHistory();
  let location = useLocation();
  console.log('TransferTokenAmountInput.location=', location);
  let sessionData = React.useContext(SessionContext);
  return <>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>token amount</div>
      <div>
        <span style={{ 'fontSize': '0.6rem', color: 'gray', fontWeight: '1500' }}>
          shielded balance:&nbsp;&nbsp;
          {sessionData.account ? sessionData.account.secret.balance : 0} Mina </span>
        <span onClick={() => {
          console.log('set max AmountInput...');
          history.push({
            'pathname': location.pathname,
            state: { 'amountInput': sessionData.account ? sessionData.account.secret.balance : 0 }
          });
        }} style={{ 'color': 'green' }}>Max</span>
      </div>
    </div>
    <div>
      <Input placeholder="token amount" value={amountInput} id={'tokenAmountInput'} onChange={e => {
        history.push({
          'pathname': location.pathname,
          state: { 'amountInput': e.target.value }
        });
      }} />
    </div>
  </>
}


