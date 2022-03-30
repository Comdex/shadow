import * as React from 'react';
import { Modal, Button, Input, Typography } from 'antd';
import styles from './index.module.less'
import styled from 'styled-components'
import {AmountSuggestPanel} from '@/components/AmountSuggestPanel';
import { TokenAmountInput } from '@/components/TokenAmountInput';
import {WithdrawFeePanel} from '@/components/WithdrawFeePanel';

export const Transfer = () => {
  const [visible, setVisible] = React.useState(true);

  return (
          <div className={styles.depositContainer}>
            <div>
              <TokenAmountInput />
            </div>
            <div>
              <span>Recipient address</span><br/>
              <Input placeholder="recipient address" />
            </div>
            <div>
              <span>Your passcode</span><br/>
              <Input placeholder="your passcode" />
            </div>
            <div><WithdrawFeePanel /></div>
            <div>
              <Button className={styles.encryptBtn}> Connect Wallet </Button>
            </div>
          </div>
  );
}
