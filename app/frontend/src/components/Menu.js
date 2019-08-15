import React, { Component } from 'react';
import {Button, Menu, Grid} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import logo from '../CEPlogo.png';


export default class TopMenu extends Component {

  render() {
		//lisää elementit jos logattu sisään
		//if(this.props.isLogged) {
      let userlink = "/user/"+this.props.user._id

      let iconmenu = <Menu></Menu>
      
      
          iconmenu = <Menu secondary>
          <Menu.Item header position='left'>
            <img src={logo} alt="Logo" style={{width: 50, height: 50}}/>
          </Menu.Item>
          </Menu>

      let topmenu = <Menu></Menu>
      
      if (this.props.isLogged) {
      topmenu = <Menu secondary>
            <Menu.Item position='right'>
            <Menu.Item >Company</Menu.Item>

            <Menu.Item>Hello &nbsp; <Link to={userlink}> {this.props.user.firstName} {this.props.user.lastName}</Link>!</Menu.Item>

            <Menu.Item>
              <Button primary onClick={this.props.logout}>Log out</Button>
            </Menu.Item>
            </Menu.Item>
        </Menu>
      }
    return (
      <Menu>
        {iconmenu}
        <Menu.Menu position='right'>
          {topmenu}
        </Menu.Menu>
      </Menu>

    )
  }
}