import * as React from 'react';
import { Modal, Button, Input, Typography } from 'antd';
import styles from './index.module.less'
import styled from 'styled-components'

const btnStyles = { 'backgroundColor': 'transparent', 'width': '5rem' }
const divStyles = `{
  'diplay':'flex',
  'align-content':'space-between',
  'justify-content':'space-between'
}`

export const AmountSuggest = (props) => {
  let { amountInput, setAmountInput } = props;

  return <div className={divStyles}>
    <span>suggest amount</span><br />
    <Button onClick={() => { setAmountInput(1) }} style={btnStyles}> 1 Mina </Button>
    <Button onClick={() => { setAmountInput(3) }} style={btnStyles}> 3 Mina </Button>
    <Button onClick={() => { setAmountInput(5) }} style={btnStyles}> 5 Mina </Button>
    <Button onClick={() => { setAmountInput(10) }} style={btnStyles}> 10  Mina </Button>
  </div>
}


