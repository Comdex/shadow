import * as React from 'react';
import { Modal, Button, Input, Typography } from 'antd';
import styles from './index.module.less'
import styled from 'styled-components'
import { SessionContext } from '@/context/SessionContext';
import { WalletContext } from '@/context/WalletContext';
import { BizEnums } from '@/common/enums/BizEnums';
import { useHistory, useLocation } from 'react-router';

export const TokenAmountInput = (props) => {
  let history = useHistory();
  let location = useLocation();

  const setAmountInput = (amount: number) => {
    history.push({
      'pathname': location.pathname,
      state: { 'amountInput': amount }
    });
  }

  let { tagName, amountInput } = props;
  let sessionData = React.useContext(SessionContext);
  let walletData = React.useContext(WalletContext);

  let labelPiece = BizEnums.Deposit == tagName ? 'wallet' : 'shielded';
  let balanceAmount = BizEnums.Deposit == tagName ? (sessionData.account ? walletData.balance : 0) : (sessionData.account ? sessionData.account.secret.balance : 0);

  return <>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>token amount</div>
      <div>
        <span style={{ 'fontSize': '0.6rem', color: 'gray', fontWeight: '1500' }}>
          {labelPiece} balance:
          {balanceAmount} Mina </span>
        <span onClick={() => {
          console.log('set max AmountInput...');
          setAmountInput(balanceAmount)
        }} style={{ 'color': 'green' }}>
          Max
        </span>
      </div>
    </div>
    <div>
      <Input placeholder="token amount" value={amountInput} onChange={e => {
        setAmountInput(Number.parseFloat(e.target.value));
      }} id={'tokenAmountInput'} />
    </div>
  </>
}


