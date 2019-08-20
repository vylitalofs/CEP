import React, {Component } from 'react';
import {Button, Menu} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import logo from '../CEPlogo.png';


export default class TopMenu extends Component {

  render() {

      let userlink = "/user/"+this.props.user._id
      let topmenu

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
        <Menu secondary>
          <Menu.Item header position='left'> 
            <img src={logo} alt="Logo" style={{width: 205, height: 89, marginLeft: 30}}/>
          </Menu.Item>
          </Menu>
        <Menu.Menu position='right'>
          {topmenu}
        </Menu.Menu>
      </Menu>

    )
  }
}