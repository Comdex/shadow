import { useStores } from '@/hooks'
import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import styles from './index.module.less'
import logoImg from '@/assets/logo_shadow.jpg'
import {renderRoutes} from 'react-router-config';
import {ConnectApp} from '@/components/ConnectApp';

const Home: React.FC<any> = (props) => {
  return (
    <div className={styles.homeContainer}>
      <div className={styles.headerContainer}>
          <img src={logoImg} />
          <div className={styles.headerRightDiv}>
            <div>
              <span>You shielded balance</span><br/>
              <span style={{'fontSize':'1.3rem', 'fontWeight':'600'}}>0 MINA</span>
            </div>
            <ConnectApp />
          </div>
      </div>
      <div className={styles.mainContainer}>
          <div className={[styles.center, styles.navContainer].join(" ")}>
            <ul>
              <li className={styles.nav}><NavLink exact to="/deposit" activeClassName={styles.selected}>Deposit</NavLink></li>
              <li className={styles.nav}><NavLink exact to="/transfer" activeClassName={styles.selected}>Transfer</NavLink></li>
              <li className={styles.nav}><NavLink exact to="/withdraw" activeClassName={styles.selected}>Withdraw</NavLink></li>
            </ul>
          </div>
          <div className={styles.center}>
              {renderRoutes(props.route.routes)}
          </div>
      </div>
      <div className={[styles.center, styles.footContainer].join(" ")}>Foot</div>
    </div>
  )
}

export default Home
