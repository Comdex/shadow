import * as React from 'react';
import { Modal, Button, Input, Typography } from 'antd';
import styles from './index.module.less'
import styled from 'styled-components'
import { AmountSuggest } from '@/components/AmountSuggest';
import { TokenAmountInput } from '@/components/TokenAmountInput';
import { OpFeePanel } from '@/components/OpFeePanel';
import { WalletTrigger } from '@/components/WalletTrigger';
import { TransferTokenAmountInput } from '@/components/TransferTokenAmountInput';
import { BizEnums } from '@/common/enums/BizEnums';
import { useHistory, useLocation } from 'react-router';

export const TransferPage: React.FC<any> = (props) => {
  let location = useLocation();
  console.log('TransferPage.location=', location);
  let amountInput = location.state ? (location.state['amountInput'] ? location.state['amountInput'] : 0) : 0;

  return (
    <div className={styles.depositContainer}>
      <div style={{ 'visibility': 'hidden', 'height': '0' }}>
        <AmountSuggest />
      </div>
      <div>
        <TransferTokenAmountInput />
      </div>
      <div>
        <span>Recipient name</span><br />
        <Input placeholder="recipient address" />
      </div>
      <div>
        <span>Your passcode</span><br />
        <Input.Password placeholder="your passcode" />
      </div>
      <div><OpFeePanel amount={amountInput} /></div>
      <div>
        <WalletTrigger tagName={BizEnums.Transfer} />
      </div>
    </div>
  );
}
