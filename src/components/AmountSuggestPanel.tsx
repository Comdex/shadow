import * as React from 'react';
import { Modal, Button, Input, Typography } from 'antd';
import styles from './index.module.less'
import styled from 'styled-components'

const btnStyles = {'backgroundColor':'transparent'}
const divStyles = `{
  'diplay':'flex',
  'justify-content':'space-between'
}`

export const AmountSuggestPanel = () => {

  const populateAmount = () => {

  }

  return <div className={divStyles}>
              <span>suggest amount</span><br />
              <Button onClick={populateAmount} style={btnStyles}> 0.1 Mina </Button>
              <Button onClick={populateAmount} style={btnStyles}> 0.3 Mina </Button>
              <Button onClick={populateAmount} style={btnStyles}> 0.5 Mina </Button>
              <Button onClick={populateAmount} style={btnStyles}> 1  Mina </Button>
  </div>
}


