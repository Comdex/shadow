import React from 'react'
import { Button, Input, Typography } from 'antd';

const { Title } = Typography;

const Register = (props) => {
  let { handleGoBackClick } = props;

  return <div>
    <Title level={3}>Connect to application</Title>
    <div style={{ 'marginBottom': '5px' }}>
      <Input placeholder="Your Unique Name" />
    </div>
    <div style={{ 'marginBottom': '20px', 'borderBottom': '2px' }}>
      <Input.Password placeholder="Your Passcode" />
    </div>
    <div style={{ 'marginBottom': '5px' }}>
      <Button onClick={() => {/* TODO */ }} block={true}>Register</Button>
    </div>
    <Button onClick={handleGoBackClick} block={true}>Go back</Button>
    <br />
  </div>
}

export default Register;
