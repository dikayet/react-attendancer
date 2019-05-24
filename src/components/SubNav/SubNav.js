import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import { Nav } from 'react-bootstrap';

import styles from './SubNav.module.sass';

const SubNav = (props) => {
  const { links, location } = props;
  return (
    <div className={styles['subnav']}>
      <Nav className="justify-content-center">
        {links.map(link => (
          <Nav.Item key={link.hash}>
            <NavLink className={location.hash === link.hash ? styles['active'] : null} to={link.to}>{link.text}</NavLink>
          </Nav.Item>
        ))}
      </Nav>
    </div>
  )
}

export default withRouter(SubNav);
