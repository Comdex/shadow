import * as React from 'react';
import { Modal, Button, Input, Typography } from 'antd';
import styles from './index.module.less'
import styled from 'styled-components'
import { SessionContext } from '@/context/SessionContext';
import { AmountSuggest } from '@/components/AmountSuggest';
import { TokenAmountInput } from '@/components/TokenAmountInput';

export const TokenInputPanel = (props) => {
  let { tagName } = props;

  const [amountInput, setAmountInput] = React.useState(0);
  console.log(setAmountInput);

  return <div>
    <div>
      <AmountSuggest amountInput={amountInput} setAmountInput={setAmountInput} />
    </div>
    <div>
      <TokenAmountInput amountInput={amountInput} setAmountInput={setAmountInput} tagName={tagName} />
    </div>
  </div>
}
