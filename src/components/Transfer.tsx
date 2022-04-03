import * as React from 'react';
import { Modal, Button, Input, Typography } from 'antd';
import styles from './index.module.less'
import styled from 'styled-components'
import {AmountSuggestPanel} from '@/components/AmountSuggestPanel';
import { TokenAmountInput } from '@/components/TokenAmountInput';
import {OpFeePanel} from '@/components/OpFeePanel';
import { WalletTrigger } from './WalletTrigger';

export const Transfer = () => {
  const [visible, setVisible] = React.useState(true);

  return (
          <div className={styles.depositContainer}>
            <div style={{'visibility':'hidden', 'height':'0'}}>
              <AmountSuggestPanel />
            </div>
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
            <div><OpFeePanel /></div>
            <div>
              <WalletTrigger />
            </div>
          </div>
  );
}
