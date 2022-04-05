import * as React from 'react';
import { Modal, Button, Input, Typography } from 'antd';
import styles from './index.module.less'
import styled from 'styled-components'

const divStyles = { display: 'flex', justifyContent: 'space-between' }

export const OpFeePanel = () => {

  const populateAmount = () => {

  }

  return <div className={styles.withdrawFeePanel}>
    <div style={divStyles}>
      <div>Layer2 network fee</div>
      <div>0.04%</div>
    </div>
    <div style={divStyles}>
      <div>Layer1 network fee</div>
      <div>0.01521 Mina</div>
    </div>
    <div style={divStyles}>
      <div>total fee</div>
      <div>0.01539 Mina</div>
    </div>
    <div style={divStyles}>
      <div>to revieve</div>
      <div>0.18461 Mina</div>
    </div>
    <br />
    <div style={divStyles}>
      <div>Total</div>
      <div>0.2 Mina</div>
    </div>
  </div>
}


