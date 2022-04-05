import React from 'react'
import { Button, Input, Typography, Anchor } from 'antd';

const { Title } = Typography;
const { Link } = Anchor;

const Login = (props) => {
  let { handleGoRegisterClick } = props;

  return <div>
    <Title level={3}>Connect to application</Title>
    <Input placeholder="Your Unique Name" showCount allowClear maxLength={20} />
    <br />
    <br />
    <Button onClick={() => {/* TODO */ }} block={true}>Log in</Button>
    <br />
    <Anchor affix={false} onClick={handleGoRegisterClick}>
      <Link title="no account? go register" />
    </Anchor>
  </div>
}

export default Login;
