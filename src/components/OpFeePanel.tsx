import * as React from 'react';
import { Modal, Button, Input, Typography } from 'antd';
import styles from './index.module.less'
import styled from 'styled-components'
import { ShadowContext } from '@/context/ShadowContext';

const divStyles = { display: 'flex', justifyContent: 'space-between' }

export const OpFeePanel = (props) => {
  let shadowData = React.useContext(ShadowContext);

  let { amount } = props;
  console.log('fresh OpFeePanel...amount=', amount);

  let layer1Fee = shadowData.layer1FeePersent * amount;
  let layer2Fee = amount ? shadowData.layer2FeeFixed : 0;
  let totalFee = amount ? layer1Fee + layer2Fee : 0;
  let finalRecieve = amount - totalFee;

  return <div className={styles.withdrawFeePanel}>
    <div style={divStyles}>
      <div>Layer2 network fee</div>
      <div>{layer2Fee} Mina</div>
    </div>
    <div style={divStyles}>
      <div>Layer1 network fee</div>
      <div>{layer1Fee} Mina</div>
    </div>
    <div style={divStyles}>
      <div>total fee</div>
      <div>{totalFee} Mina</div>
    </div>
    <div style={divStyles}>
      <div>to revieve</div>
      <div>{finalRecieve} Mina</div>
    </div>
    <br />
    <div style={divStyles}>
      <div>Total</div>
      <div>{amount} Mina</div>
    </div>
  </div>
}


